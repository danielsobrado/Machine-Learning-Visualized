export const COMPLEXITY_STEPS = 12;
export const TRAIN_X_MIN = 4;
export const TRAIN_X_MAX = 96;
export const NORMALIZED_X_CENTER = 50;
export const NORMALIZED_X_SCALE = 46;
export const VALIDATION_COUNT = 24;
export const TEST_COUNT = 80;
export const VALIDATION_SEED = 211;
export const TEST_SEED = 509;
export const NUMERIC_RIDGE = 1e-8;

export const DATASETS = Object.freeze({
  clean: {
    label: 'Clean signal',
    detail: 'Enough data with moderate observation noise makes extra flexibility less dangerous.',
    trainCount: 26,
    trainNoiseAmplitude: 8.28,
    holdoutNoiseAmplitude: 5,
    noisyIndices: Object.freeze([]),
  },
  noisy: {
    label: 'Noisy labels',
    detail: 'Several corrupted training outcomes give flexible fits something useless to memorize.',
    trainCount: 26,
    trainNoiseAmplitude: 23.92,
    holdoutNoiseAmplitude: 5,
    noisyIndices: Object.freeze([4, 10, 17, 22]),
  },
  tiny: {
    label: 'Tiny sample',
    detail: 'Few training rows let a high-degree polynomial interpolate sample quirks between observations.',
    trainCount: 14,
    trainNoiseAmplitude: 17.48,
    holdoutNoiseAmplitude: 5,
    noisyIndices: Object.freeze([]),
  },
});

export const REGULARIZATION = Object.freeze({
  none: {
    label: 'None',
    lambda: 0,
    detail: 'Only a tiny numerical stabilizer is used; complexity is otherwise unconstrained.',
  },
  mild: {
    label: 'Mild ridge',
    lambda: 0.01,
    detail: 'A real L2 penalty damps high-degree coefficients while preserving useful flexibility.',
  },
  strong: {
    label: 'Strong ridge',
    lambda: 0.5,
    detail: 'The stronger penalty can suppress variance, but it can also leave substantial bias.',
  },
});
