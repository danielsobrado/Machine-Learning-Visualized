export const DEFAULT_ESTIMAND_SCENARIO = Object.freeze({
  responsiveShare: 0.35,
  highEffect: 14,
  lowEffect: 2,
  responsiveTreatmentRate: 0.8,
  otherTreatmentRate: 0.25,
});

export const ESTIMAND_LIMITS = Object.freeze({
  responsiveShare: { min: 0.1, max: 0.9, step: 0.05 },
  highEffect: { min: -10, max: 25, step: 1 },
  lowEffect: { min: -10, max: 20, step: 1 },
  responsiveTreatmentRate: { min: 0.05, max: 0.95, step: 0.05 },
  otherTreatmentRate: { min: 0.05, max: 0.95, step: 0.05 },
});
