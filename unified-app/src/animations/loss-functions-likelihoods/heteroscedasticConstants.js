export const HETEROSCEDASTIC_GROUPS = {
  stable: {
    label: 'Stable region',
    residuals: [0.18, -0.24, 0.31, -0.16],
  },
  noisy: {
    label: 'Noisy region',
    residuals: [1.25, -0.9, 1.55, -1.1],
  },
};

export const HETEROSCEDASTIC_DEFAULTS = {
  stableSigma: 0.35,
  noisySigma: 1.1,
};

export const HETEROSCEDASTIC_SIGMA_LIMITS = {
  min: 0.15,
  max: 2.5,
  step: 0.05,
};
