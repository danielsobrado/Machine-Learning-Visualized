export const NON_COLLAPSIBILITY_DEFAULTS = Object.freeze({
  lowBaseline: 0.10,
  highBaseline: 0.60,
  commonOddsRatio: 2.0,
  highRiskShare: 0.50,
});

export const NON_COLLAPSIBILITY_LIMITS = Object.freeze({
  lowBaseline: { min: 0.02, max: 0.35, step: 0.01 },
  highBaseline: { min: 0.30, max: 0.85, step: 0.01 },
  commonOddsRatio: { min: 0.5, max: 4, step: 0.1 },
  highRiskShare: { min: 0.10, max: 0.90, step: 0.05 },
});
