export const DEFAULT_DR_SCENARIO = Object.freeze({
  highRiskShare: 0.4,
  propensityMisspecification: 0,
  outcomeMisspecification: 0.7,
});

export const DR_LIMITS = Object.freeze({
  highRiskShare: { min: 0.2, max: 0.8, step: 0.05 },
  propensityMisspecification: { min: 0, max: 1, step: 0.05 },
  outcomeMisspecification: { min: 0, max: 1, step: 0.05 },
});

export const DR_TRUTH = Object.freeze({
  low: { propensity: 0.2, controlMean: 20, treatmentMean: 24 },
  high: { propensity: 0.8, controlMean: 50, treatmentMean: 58 },
});
