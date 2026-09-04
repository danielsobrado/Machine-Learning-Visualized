export const BASE_SEED = 314159;

export const DEFAULT_SCENARIO = Object.freeze({
  samplePerArm: 800,
  effect: 0.25,
  preCorrelation: 0.7,
  covariateMode: 'pre',
  postTreatmentShift: 0.7,
});

export const CONTROL_LIMITS = Object.freeze({
  samplePerArm: { min: 100, max: 2400, step: 100 },
  effect: { min: 0, max: 0.6, step: 0.02 },
  preCorrelation: { min: 0, max: 0.9, step: 0.05 },
  postTreatmentShift: { min: 0, max: 1.5, step: 0.1 },
});

export const COVARIATE_MODES = Object.freeze([
  { id: 'pre', label: 'Pre-treatment covariate' },
  { id: 'post', label: 'Post-treatment trap' },
]);

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'strong', label: 'Strong pre-period signal', values: { samplePerArm: 800, effect: 0.25, preCorrelation: 0.8, covariateMode: 'pre', postTreatmentShift: 0.7 } },
  { id: 'weak', label: 'Weak covariate', values: { samplePerArm: 800, effect: 0.25, preCorrelation: 0.15, covariateMode: 'pre', postTreatmentShift: 0.7 } },
  { id: 'post', label: 'Bad post-treatment adjustment', values: { samplePerArm: 800, effect: 0.25, preCorrelation: 0.7, covariateMode: 'post', postTreatmentShift: 0.9 } },
]);
