import { CALIBRATION_POOL_SIZE, TEST_SIZE } from './uncertaintyConfig.js';

function hash01(value, salt = 0) {
  const x = Math.sin((value + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function gaussianish(index, salt) {
  const u1 = Math.max(1e-6, hash01(index, salt));
  const u2 = hash01(index, salt + 1);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function truthFunction(x) {
  return 50 + 12 * Math.sin(x) + 4 * x;
}

function modelPrediction(x, distributionShift) {
  const base = 50 + 11.5 * Math.sin(x) + 3.8 * x;
  const extrapolation = Math.max(0, Math.abs(x) - 2.5);
  return base - distributionShift * (0.45 + extrapolation * 0.18);
}

function estimatedScale(x, noiseScale) {
  return Math.max(0.5, noiseScale * (0.75 + 0.22 * Math.abs(x)));
}

function makePoint(index, count, noiseScale, distributionShift, salt) {
  const fraction = (index + 0.5) / count;
  const shiftedCenter = distributionShift * 0.13;
  const x = -2.5 + fraction * 5 + shiftedCenter;
  const scale = estimatedScale(x, noiseScale);
  const noise = gaussianish(index, salt) * scale * 0.72;
  const truth = truthFunction(x) + noise;
  const prediction = modelPrediction(x, distributionShift);
  return { x, truth, prediction, scale };
}

export function conformalQuantile(scores, targetCoverage) {
  const sorted = [...scores].sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const rank = Math.ceil((sorted.length + 1) * targetCoverage);
  return sorted[Math.min(sorted.length - 1, Math.max(0, rank - 1))];
}

export function calibrateConformal({ calibrationSize, noiseScale, targetCoverage }) {
  const points = Array.from({ length: CALIBRATION_POOL_SIZE }, (_, index) => (
    makePoint(index, CALIBRATION_POOL_SIZE, noiseScale, 0, 101)
  )).slice(0, calibrationSize);
  const scores = points.map((point) => Math.abs(point.truth - point.prediction) / point.scale);
  return { points, scores, qHat: conformalQuantile(scores, targetCoverage) };
}

export function buildConformalLab(scenario) {
  const calibration = calibrateConformal(scenario);
  const test = Array.from({ length: TEST_SIZE }, (_, index) => (
    makePoint(index, TEST_SIZE, scenario.noiseScale, scenario.distributionShift, 211)
  )).map((point, index) => {
    const halfWidth = calibration.qHat * point.scale;
    const lower = point.prediction - halfWidth;
    const upper = point.prediction + halfWidth;
    const covered = point.truth >= lower && point.truth <= upper;
    const width = upper - lower;
    const deferred = width > scenario.abstainWidth;
    return { ...point, index, lower, upper, width, covered, deferred, absoluteError: Math.abs(point.truth - point.prediction) };
  });

  const served = test.filter((point) => !point.deferred);
  const covered = test.filter((point) => point.covered).length;
  const servedCovered = served.filter((point) => point.covered).length;
  const meanWidth = test.reduce((sum, point) => sum + point.width, 0) / test.length;
  const servedMae = served.length === 0 ? null : served.reduce((sum, point) => sum + point.absoluteError, 0) / served.length;
  const allMae = test.reduce((sum, point) => sum + point.absoluteError, 0) / test.length;

  return {
    calibration,
    test,
    sampleRows: test.filter((_, index) => index % 30 === 0).slice(0, 8),
    metrics: {
      empiricalCoverage: covered / test.length,
      meanWidth,
      deferRate: 1 - served.length / test.length,
      servedCoverage: served.length === 0 ? null : servedCovered / served.length,
      servedMae,
      allMae,
    },
  };
}
