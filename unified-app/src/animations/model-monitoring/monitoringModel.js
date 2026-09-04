import {
  HOURS,
  INCIDENT_HOUR,
  PSI_BINS,
  SAMPLES_PER_HOUR,
} from './monitoringConfig.js';

function hash01(value, salt = 0) {
  const x = Math.sin((value + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function gaussianish(index, salt) {
  const u1 = Math.max(1e-6, hash01(index, salt));
  const u2 = hash01(index, salt + 1);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function quantile(values, q) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * q) - 1));
  return sorted[index];
}

export function populationStabilityIndex(reference, observed, bins = PSI_BINS) {
  let total = 0;
  for (let i = 0; i < bins.length - 1; i += 1) {
    const refCount = reference.filter((value) => value >= bins[i] && value < bins[i + 1]).length;
    const obsCount = observed.filter((value) => value >= bins[i] && value < bins[i + 1]).length;
    const p = Math.max(refCount / reference.length, 1e-4);
    const q = Math.max(obsCount / observed.length, 1e-4);
    total += (q - p) * Math.log(q / p);
  }
  return total;
}

function generateSample(hour, index, scenarioId) {
  const globalIndex = hour * SAMPLES_PER_HOUR + index;
  const incident = hour >= INCIDENT_HOUR;
  let featureShift = 0;
  let truthBoundary = 0;
  let labelBias = 0;
  let latencyExtra = 0;

  if (incident && scenarioId === 'covariate-shift') featureShift = 1.15;
  if (incident && scenarioId === 'concept-drift') truthBoundary = 1.05;
  if (incident && scenarioId === 'label-shift') labelBias = 0.95;
  if (incident && scenarioId === 'latency-incident') latencyExtra = 230;

  const x = gaussianish(globalIndex, 11) + featureShift;
  const modelProbability = sigmoid(1.7 * x - 0.05);
  const truthProbability = sigmoid(1.8 * x - truthBoundary + labelBias);
  const prediction = modelProbability >= 0.5 ? 1 : 0;
  const label = hash01(globalIndex, 17) < truthProbability ? 1 : 0;
  const latencyMs = 115 + Math.abs(gaussianish(globalIndex, 21)) * 34 + latencyExtra + (incident ? hash01(globalIndex, 31) * 18 : 0);
  return { x, modelProbability, prediction, label, latencyMs };
}

export function generateMonitoringSeries(scenarioId) {
  return Array.from({ length: HOURS }, (_, hour) => ({
    hour,
    samples: Array.from({ length: SAMPLES_PER_HOUR }, (_, index) => generateSample(hour, index, scenarioId)),
  }));
}

function classificationMetrics(samples) {
  const correct = samples.filter((sample) => sample.prediction === sample.label).length;
  const tp = samples.filter((sample) => sample.prediction === 1 && sample.label === 1).length;
  const fp = samples.filter((sample) => sample.prediction === 1 && sample.label === 0).length;
  const fn = samples.filter((sample) => sample.prediction === 0 && sample.label === 1).length;
  const accuracy = correct / samples.length;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const brier = samples.reduce((sum, sample) => sum + (sample.modelProbability - sample.label) ** 2, 0) / samples.length;
  const prevalence = samples.filter((sample) => sample.label === 1).length / samples.length;
  return { accuracy, precision, recall, brier, prevalence };
}

export function buildMonitoringLab(config) {
  const series = generateMonitoringSeries(config.scenarioId);
  const baselineHours = series.slice(0, INCIDENT_HOUR);
  const baselineSamples = baselineHours.flatMap((row) => row.samples);
  const baselineFeatures = baselineSamples.map((sample) => sample.x);
  const baselineMetrics = classificationMetrics(baselineSamples);
  const baselineLatency = quantile(baselineSamples.map((sample) => sample.latencyMs), 0.95);

  const timeline = series.map((row) => {
    const metrics = classificationMetrics(row.samples);
    const labelsAvailable = row.hour <= config.currentHour - config.labelDelay;
    const psi = populationStabilityIndex(baselineFeatures, row.samples.map((sample) => sample.x));
    const p95Latency = quantile(row.samples.map((sample) => sample.latencyMs), 0.95);
    const accuracyDrop = baselineMetrics.accuracy - metrics.accuracy;
    const alerts = {
      drift: row.hour <= config.currentHour && psi >= config.psiThreshold,
      performance: row.hour <= config.currentHour && labelsAvailable && accuracyDrop >= config.accuracyDropThreshold,
      latency: row.hour <= config.currentHour && p95Latency >= config.latencyBudget,
    };
    return { hour: row.hour, labelsAvailable, psi, p95Latency, accuracyDrop, metrics, alerts };
  });

  const visible = timeline.filter((row) => row.hour <= config.currentHour);
  const firstAlert = visible.find((row) => row.alerts.drift || row.alerts.performance || row.alerts.latency) || null;
  const current = visible[visible.length - 1];
  const mature = visible.filter((row) => row.labelsAvailable);
  const latestMature = mature[mature.length - 1] || null;

  return {
    baseline: { ...baselineMetrics, p95Latency: baselineLatency },
    timeline,
    visible,
    current,
    latestMature,
    firstAlert,
    detectionDelay: firstAlert && firstAlert.hour >= INCIDENT_HOUR ? firstAlert.hour - INCIDENT_HOUR : null,
  };
}
