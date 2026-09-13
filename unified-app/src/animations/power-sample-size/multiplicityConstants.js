export const MULTIPLICITY_DEFAULTS = Object.freeze({
  hypotheses: 4,
  familyAlpha: 5,
  relativeLift: 6,
});

export const MULTIPLICITY_LIMITS = Object.freeze({
  hypotheses: { min: 1, max: 20, step: 1 },
  familyAlpha: { min: 1, max: 10, step: 1 },
  relativeLift: { min: 2, max: 20, step: 1 },
});
