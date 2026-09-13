export const EQUIVALENCE_DEFAULTS = {
  estimate: 0.4,
  standardError: 0.8,
  margin: 2,
  alpha: 5,
};

export const EQUIVALENCE_LIMITS = {
  estimate: { min: -4, max: 4, step: 0.1 },
  standardError: { min: 0.2, max: 2.5, step: 0.1 },
  margin: { min: 0.5, max: 4, step: 0.1 },
};
