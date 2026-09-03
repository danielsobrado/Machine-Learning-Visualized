export const OPTIMIZERS = {
  sgd: {
    label: 'SGD',
    detail: 'Uses the current mini-batch gradient directly.',
  },
  momentum: {
    label: 'Momentum',
    detail: 'Builds velocity so repeated gradient directions accumulate.',
  },
  adam: {
    label: 'Adam',
    detail: 'Uses first and second gradient moments to create per-parameter step scaling.',
  },
};

export const OPTIMIZER_DEFAULTS = {
  optimizer: 'adam',
  learningRate: 0.18,
  beta1: 0.85,
  beta2: 0.96,
  epsilon: 1e-6,
  batchSize: 8,
  steps: 18,
};

export const OPTIMIZER_CONTROL_LIMITS = {
  learningRate: { min: 0.02, max: 0.4, step: 0.02 },
  beta1: { min: 0, max: 0.95, step: 0.05 },
  beta2: { min: 0.8, max: 0.999, step: 0.001 },
  batchSize: { min: 1, max: 64, step: 1 },
  steps: { min: 4, max: 32, step: 1 },
};

export const OPTIMIZER_LANDSCAPE = {
  start: [-4.8, 3.6],
  minimum: [-3, 1],
  xCoefficient: 0.08,
  yCoefficient: 0.55,
  noiseConstant: 0.42,
};

export const TUNING_LEARNING_RATES = Object.freeze([
  0.02,
  0.04,
  0.06,
  0.08,
  0.1,
  0.12,
  0.16,
  0.18,
  0.24,
  0.32,
  0.4,
]);

export const ADAM_MECHANICS_DEFAULTS = {
  beta1: 0.9,
  beta2: 0.999,
  epsilon: 1e-8,
  learningRate: 0.001,
  gradient: [0.02, 20],
};
