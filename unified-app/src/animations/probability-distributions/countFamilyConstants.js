export const COUNT_FAMILY_DEFAULTS = {
  mean: 4,
  shape: 2,
  zeroInflation: 0.35,
  maxCount: 14,
};

export const COUNT_FAMILY_LIMITS = {
  mean: { min: 0.5, max: 10, step: 0.5 },
  shape: { min: 1, max: 20, step: 1 },
  zeroInflation: { min: 0, max: 0.7, step: 0.05 },
};

export const COUNT_FAMILY_PRESETS = [
  { id: 'poisson-like', label: 'Poisson-like', values: { mean: 4, shape: 20, zeroInflation: 0 } },
  { id: 'overdispersed', label: 'Overdispersed', values: { mean: 4, shape: 2, zeroInflation: 0 } },
  { id: 'zero-inflated', label: 'Excess zeros', values: { mean: 4, shape: 2, zeroInflation: 0.4 } },
];
