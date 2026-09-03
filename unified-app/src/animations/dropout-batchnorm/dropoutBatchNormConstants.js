export const BATCH_SCENARIOS = Object.freeze({
  ordinary: Object.freeze({
    label: 'Ordinary mini-batch',
    description: 'A compact batch around the selected activation.',
    values: Object.freeze([3, 1, 2, 4]),
  }),
  shifted: Object.freeze({
    label: 'Shifted neighbors',
    description: 'The selected activation stays 3; only its neighbors move upward.',
    values: Object.freeze([3, 6, 7, 8]),
  }),
  outlier: Object.freeze({
    label: 'Outlier neighbor',
    description: 'One extreme neighbor pulls the batch statistics away from the selected activation.',
    values: Object.freeze([3, 1, 2, 20]),
  }),
  singleton: Object.freeze({
    label: 'One observation',
    description: 'With one scalar observation for this feature, the batch variance collapses to zero.',
    values: Object.freeze([3]),
  }),
});

export const DROPOUT_BATCHNORM_DEFAULTS = Object.freeze({
  scenarioId: 'ordinary',
  selectedIndex: 0,
  gamma: 1,
  beta: 0,
  epsilon: 1e-5,
  dropoutRate: 0.4,
  updateWeight: 0.2,
  runningMean: 0,
  runningVariance: 1,
});

export const DROPOUT_DEMO = Object.freeze({
  passes: 24,
  initialSeed: 17,
});

export const VALUE_BOUNDS = Object.freeze({
  maximumDropoutRate: 0.8,
  minimumEpsilon: 1e-12,
  maximumUpdateWeight: 1,
});
