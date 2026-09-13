export const POSITION_BIAS_DEFAULTS = Object.freeze({
  impressions: 10000,
  topExamination: 1,
  secondExamination: 0.45,
  itemARelevance: 0.32,
  itemBRelevance: 0.24,
});

export const POSITION_BIAS_LIMITS = Object.freeze({
  secondExamination: { min: 0.2, max: 1, step: 0.05 },
});
