export const FUTILITY_DEFAULTS = Object.freeze({
  informationFraction: 0.5,
  currentZ: 0.4,
  assumedEffect: 0.08,
  maxPerArm: 1000,
  finalAlphaTwoSided: 0.05,
  futilityThreshold: 0.15,
});

export const FUTILITY_LIMITS = Object.freeze({
  informationFraction: { min: 0.2, max: 0.9, step: 0.05 },
  currentZ: { min: -1.5, max: 3.5, step: 0.1 },
  assumedEffect: { min: 0, max: 0.25, step: 0.01 },
  futilityThreshold: { min: 0.05, max: 0.5, step: 0.05 },
});
