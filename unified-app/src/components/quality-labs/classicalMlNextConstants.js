export const CLASSICAL_ML_NEXT_LESSON_IDS = Object.freeze(new Set([
  'linear-regression',
  'logistic-regression',
  'train-validation-test-split',
  'cross-validation',
  'time-series-forecasting-track',
]));

export const LINEAR_REGRESSION_NEXT_DEFAULTS = Object.freeze({
  prediction: 11,
  residualStdError: 2,
  sampleSize: 25,
  x: 8,
  xMean: 5,
  sxx: 100,
  criticalValue: 2.069,
  probeX: 5,
  points: Object.freeze([
    Object.freeze({ x: 0, y: 1 }),
    Object.freeze({ x: 1, y: 3 }),
    Object.freeze({ x: 2, y: 5 }),
    Object.freeze({ x: 3, y: 7 }),
    Object.freeze({ x: 4, y: 9 }),
    Object.freeze({ x: 5, y: 20 }),
  ]),
});

export const LOGISTIC_REGRESSION_NEXT_DEFAULTS = Object.freeze({
  probability: 0.72,
  logitShift: -0.9,
  globalThreshold: 0.6,
  candidateThresholds: Object.freeze([0.4, 0.5, 0.6, 0.7, 0.8]),
  groupCosts: Object.freeze({
    A: Object.freeze({ falsePositive: 1, falseNegative: 4 }),
    B: Object.freeze({ falsePositive: 5, falseNegative: 2 }),
  }),
  rows: Object.freeze([
    Object.freeze({ group: 'A', score: 0.9, label: 1 }),
    Object.freeze({ group: 'A', score: 0.7, label: 1 }),
    Object.freeze({ group: 'A', score: 0.55, label: 0 }),
    Object.freeze({ group: 'A', score: 0.4, label: 0 }),
    Object.freeze({ group: 'B', score: 0.8, label: 1 }),
    Object.freeze({ group: 'B', score: 0.65, label: 0 }),
    Object.freeze({ group: 'B', score: 0.52, label: 1 }),
    Object.freeze({ group: 'B', score: 0.35, label: 0 }),
  ]),
});

export const SELECTION_REPLAY_DEFAULTS = Object.freeze({
  attempts: Object.freeze([
    Object.freeze({ id: 'M1', validationError: 0.2, testError: 0.21 }),
    Object.freeze({ id: 'M2', validationError: 0.18, testError: 0.2 }),
    Object.freeze({ id: 'M3', validationError: 0.17, testError: 0.22 }),
    Object.freeze({ id: 'M4', validationError: 0.15, testError: 0.23 }),
    Object.freeze({ id: 'M5', validationError: 0.14, testError: 0.24 }),
  ]),
  outerFoldErrors: Object.freeze([0.22, 0.2, 0.23]),
});

export const TEMPORAL_CV_DEFAULTS = Object.freeze({
  series: Object.freeze([10, 10, 11, 11, 12, 12, 20, 21, 22, 23, 24, 25]),
  initialTrainSize: 6,
  horizon: 2,
  step: 2,
  blockedWindowSize: 4,
});

export const FORECAST_SCORING_DEFAULTS = Object.freeze({
  underForecastCost: 4,
  overForecastCost: 1,
  rows: Object.freeze([
    Object.freeze({ horizon: 1, actual: 100, forecast: 95, lower: 90, upper: 105 }),
    Object.freeze({ horizon: 1, actual: 110, forecast: 112, lower: 102, upper: 120 }),
    Object.freeze({ horizon: 2, actual: 120, forecast: 108, lower: 100, upper: 116 }),
    Object.freeze({ horizon: 2, actual: 115, forecast: 118, lower: 107, upper: 128 }),
    Object.freeze({ horizon: 3, actual: 130, forecast: 112, lower: 102, upper: 122 }),
    Object.freeze({ horizon: 3, actual: 125, forecast: 132, lower: 118, upper: 140 }),
  ]),
});
