export const HETEROGENEITY_DEFAULTS = Object.freeze({
  averageEffect: 0.3,
  interaction: 0.45,
  baselineSlope: 0.8,
  residualSd: 1,
  samplePerCell: 400,
});

export const HETEROGENEITY_LIMITS = Object.freeze({
  averageEffect: { min: -0.5, max: 1, step: 0.05 },
  interaction: { min: 0, max: 1, step: 0.05 },
  baselineSlope: { min: 0, max: 1.5, step: 0.1 },
  samplePerCell: { min: 50, max: 1000, step: 50 },
});
