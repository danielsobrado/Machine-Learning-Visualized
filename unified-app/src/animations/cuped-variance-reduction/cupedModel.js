import { BASE_SEED } from './cupedConfig.js';

const EPSILON = 1e-12;

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normalSample(random) {
  const u1 = Math.max(EPSILON, random());
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sampleVariance(values, center = mean(values)) {
  if (values.length < 2) return 0;
  return values.reduce((sum, value) => sum + (value - center) ** 2, 0) / (values.length - 1);
}

function covariance(xs, ys) {
  const xMean = mean(xs);
  const yMean = mean(ys);
  return xs.reduce((sum, x, index) => sum + (x - xMean) * (ys[index] - yMean), 0) / (xs.length - 1);
}

function correlation(xs, ys) {
  const denominator = Math.sqrt(sampleVariance(xs) * sampleVariance(ys));
  return denominator <= EPSILON ? 0 : covariance(xs, ys) / denominator;
}

function differenceInMeans(rows, accessor) {
  const control = rows.filter((row) => row.treatment === 0).map(accessor);
  const treatment = rows.filter((row) => row.treatment === 1).map(accessor);
  const estimate = mean(treatment) - mean(control);
  const standardError = Math.sqrt(sampleVariance(treatment) / treatment.length + sampleVariance(control) / control.length);
  return {
    estimate,
    standardError,
    lower: estimate - 1.96 * standardError,
    upper: estimate + 1.96 * standardError,
  };
}

export function generateExperiment(scenario, seed = BASE_SEED) {
  const random = mulberry32(seed);
  const rho = Math.min(0.95, Math.max(0, scenario.preCorrelation));
  const beta = rho === 0 ? 0 : rho / Math.sqrt(Math.max(EPSILON, 1 - rho ** 2));
  const rows = [];

  for (let treatment = 0; treatment <= 1; treatment += 1) {
    for (let index = 0; index < scenario.samplePerArm; index += 1) {
      const pre = normalSample(random);
      const outcomeNoise = normalSample(random);
      const postNoise = normalSample(random) * 0.15;
      const outcome = beta * pre + scenario.effect * treatment + outcomeNoise;
      const post = pre + scenario.postTreatmentShift * treatment + postNoise;
      rows.push({ treatment, pre, post, outcome });
    }
  }

  return rows;
}

export function applyCuped(rows, covariateMode = 'pre') {
  const covariate = rows.map((row) => row[covariateMode]);
  const outcomes = rows.map((row) => row.outcome);
  const covariateMean = mean(covariate);
  const variance = sampleVariance(covariate, covariateMean);
  const theta = variance <= EPSILON ? 0 : covariance(covariate, outcomes) / variance;
  return rows.map((row) => ({
    ...row,
    adjustedOutcome: row.outcome - theta * (row[covariateMode] - covariateMean),
    adjustmentCovariate: row[covariateMode],
    theta,
  }));
}

export function buildCupedLab(scenario, seed = BASE_SEED) {
  const rows = generateExperiment(scenario, seed);
  const adjustedRows = applyCuped(rows, scenario.covariateMode);
  const raw = differenceInMeans(rows, (row) => row.outcome);
  const adjusted = differenceInMeans(adjustedRows, (row) => row.adjustedOutcome);
  const preValues = rows.map((row) => row.pre);
  const outcomeValues = rows.map((row) => row.outcome);
  const adjustmentValues = rows.map((row) => row[scenario.covariateMode]);
  const theta = adjustedRows[0]?.theta ?? 0;
  const varianceReduction = raw.standardError <= EPSILON
    ? 0
    : 1 - (adjusted.standardError / raw.standardError) ** 2;
  const estimateShift = adjusted.estimate - raw.estimate;

  return {
    scenario,
    raw,
    adjusted,
    metrics: {
      theta,
      preOutcomeCorrelation: correlation(preValues, outcomeValues),
      adjustmentOutcomeCorrelation: correlation(adjustmentValues, outcomeValues),
      varianceReduction,
      precisionMultiplier: adjusted.standardError <= EPSILON ? 1 : raw.standardError / adjusted.standardError,
      estimateShift,
      biasFromTruthRaw: raw.estimate - scenario.effect,
      biasFromTruthAdjusted: adjusted.estimate - scenario.effect,
    },
    sampleRows: adjustedRows.slice(0, 6),
  };
}
