export const DROPOUT_BATCHNORM_DEFAULTS = Object.freeze({
  activation: 3,
  batchMean: 1,
  batchStd: 2,
  runningMean: 0,
  runningStd: 1,
  gamma: 1,
  beta: 0,
  dropoutRate: 0.4,
  trainingMode: true,
});

export const DROPOUT_DEMO = Object.freeze({
  passes: 12,
  initialSeed: 17,
});

export const VALUE_BOUNDS = Object.freeze({
  minimumStd: 0.1,
  maximumDropoutRate: 0.8,
});
