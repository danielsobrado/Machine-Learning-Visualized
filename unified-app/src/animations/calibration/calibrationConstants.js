export const REFERENCE_BINS = Object.freeze([
  { confidence: 0.1, observed: 0.09, count: 18 },
  { confidence: 0.3, observed: 0.31, count: 24 },
  { confidence: 0.5, observed: 0.49, count: 28 },
  { confidence: 0.7, observed: 0.72, count: 24 },
  { confidence: 0.9, observed: 0.88, count: 16 },
]);

export const SHIFT_SCENARIOS = Object.freeze({
  stable: {
    label: 'Stable population',
    short: 'Calibration and ranking are both close to the reference population.',
    diagnosis: 'No material shift',
    recommendedMethod: 'none',
    reason: 'Do not add a calibrator just because one is available. Extra post-processing can overfit noise.',
    calibrationBins: [
      { confidence: 0.1, observed: 0.10, count: 18 },
      { confidence: 0.3, observed: 0.30, count: 24 },
      { confidence: 0.5, observed: 0.50, count: 28 },
      { confidence: 0.7, observed: 0.71, count: 24 },
      { confidence: 0.9, observed: 0.87, count: 16 },
    ],
    evaluationBins: [
      { confidence: 0.1, observed: 0.08, count: 18 },
      { confidence: 0.3, observed: 0.32, count: 24 },
      { confidence: 0.5, observed: 0.48, count: 28 },
      { confidence: 0.7, observed: 0.70, count: 24 },
      { confidence: 0.9, observed: 0.89, count: 16 },
    ],
  },
  priorShift: {
    label: 'Base-rate shift',
    short: 'The event becomes rarer while score ordering remains useful.',
    diagnosis: 'Mostly intercept / prevalence shift',
    recommendedMethod: 'intercept',
    reason: 'When ranking survives but probabilities are systematically too high, a simple log-odds intercept correction is a strong first candidate.',
    calibrationBins: [
      { confidence: 0.1, observed: 0.03, count: 18 },
      { confidence: 0.3, observed: 0.12, count: 24 },
      { confidence: 0.5, observed: 0.28, count: 28 },
      { confidence: 0.7, observed: 0.52, count: 24 },
      { confidence: 0.9, observed: 0.78, count: 16 },
    ],
    evaluationBins: [
      { confidence: 0.1, observed: 0.04, count: 18 },
      { confidence: 0.3, observed: 0.13, count: 24 },
      { confidence: 0.5, observed: 0.27, count: 28 },
      { confidence: 0.7, observed: 0.54, count: 24 },
      { confidence: 0.9, observed: 0.77, count: 16 },
    ],
  },
  confidenceDrift: {
    label: 'Confidence drift',
    short: 'The model keeps roughly the same ranking but its scores become too extreme.',
    diagnosis: 'Mostly logit-scale / sharpness drift',
    recommendedMethod: 'temperature',
    reason: 'Temperature scaling changes confidence sharpness with one parameter while preserving ranking.',
    calibrationBins: [
      { confidence: 0.03, observed: 0.09, count: 18 },
      { confidence: 0.18, observed: 0.31, count: 24 },
      { confidence: 0.50, observed: 0.49, count: 28 },
      { confidence: 0.82, observed: 0.72, count: 24 },
      { confidence: 0.97, observed: 0.88, count: 16 },
    ],
    evaluationBins: [
      { confidence: 0.03, observed: 0.10, count: 18 },
      { confidence: 0.18, observed: 0.30, count: 24 },
      { confidence: 0.50, observed: 0.50, count: 28 },
      { confidence: 0.82, observed: 0.71, count: 24 },
      { confidence: 0.97, observed: 0.87, count: 16 },
    ],
  },
  conceptDrift: {
    label: 'Ranking drift',
    short: 'High scores no longer order risk as reliably as before.',
    diagnosis: 'Underlying discrimination degraded',
    recommendedMethod: 'none',
    reason: 'A monotonic calibrator can relabel probabilities, but it cannot restore lost ranking. Investigate features, labels, cohorts, and model drift before polishing probabilities.',
    calibrationBins: [
      { confidence: 0.1, observed: 0.12, count: 18 },
      { confidence: 0.3, observed: 0.34, count: 24 },
      { confidence: 0.5, observed: 0.57, count: 28 },
      { confidence: 0.7, observed: 0.49, count: 24 },
      { confidence: 0.9, observed: 0.69, count: 16 },
    ],
    evaluationBins: [
      { confidence: 0.1, observed: 0.14, count: 18 },
      { confidence: 0.3, observed: 0.36, count: 24 },
      { confidence: 0.5, observed: 0.55, count: 28 },
      { confidence: 0.7, observed: 0.47, count: 24 },
      { confidence: 0.9, observed: 0.67, count: 16 },
    ],
  },
});

export const RECALIBRATION_METHODS = Object.freeze({
  none: {
    label: 'No recalibration',
    detail: 'Keep the original probability scale.',
  },
  intercept: {
    label: 'Intercept correction',
    detail: 'Shift log-odds up or down without changing their spread.',
  },
  temperature: {
    label: 'Temperature scaling',
    detail: 'Rescale logit sharpness with one positive parameter.',
  },
  platt: {
    label: 'Platt scaling',
    detail: 'Learn both logit slope and intercept on held-out scores.',
  },
});

export const FIT_RANGES = Object.freeze({
  intercept: Object.freeze({ min: -3, max: 3, step: 0.02 }),
  temperature: Object.freeze({ min: 0.3, max: 4, step: 0.02 }),
  plattSlope: Object.freeze({ min: 0.2, max: 2.5, step: 0.05 }),
  plattIntercept: Object.freeze({ min: -2, max: 2, step: 0.05 }),
});

export const DEFAULT_SCENARIO_ID = 'priorShift';
export const DEFAULT_THRESHOLD = 0.5;
export const PROBABILITY_EPSILON = 1e-6;
export const MATERIAL_AUC_DROP = 0.08;
export const MATERIAL_ECE_RISE = 0.03;
