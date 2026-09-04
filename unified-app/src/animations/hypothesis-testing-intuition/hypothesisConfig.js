export const DEFAULT_SCENARIO = Object.freeze({
  observedEffect: 4,
  designEffect: 5,
  noiseSd: 18,
  sampleSize: 180,
  alpha: 5,
  meaningfulThreshold: 5,
});

export const CONTROL_LIMITS = Object.freeze({
  observedEffect: { min: -12, max: 20, step: 0.5 },
  designEffect: { min: 0, max: 15, step: 0.5 },
  noiseSd: { min: 5, max: 35, step: 1 },
  sampleSize: { min: 25, max: 1200, step: 25 },
  alpha: { min: 1, max: 15, step: 0.5 },
  meaningfulThreshold: { min: 1, max: 12, step: 0.5 },
});

export const SCENARIO_PRESETS = Object.freeze([
  {
    id: 'tiny-significant',
    label: 'Tiny but significant',
    values: { observedEffect: 2, designEffect: 2, noiseSd: 12, sampleSize: 1200, alpha: 5, meaningfulThreshold: 5 },
  },
  {
    id: 'useful-uncertain',
    label: 'Useful but uncertain',
    values: { observedEffect: 7, designEffect: 7, noiseSd: 28, sampleSize: 80, alpha: 5, meaningfulThreshold: 5 },
  },
  {
    id: 'strong-evidence',
    label: 'Strong evidence',
    values: { observedEffect: 8, designEffect: 8, noiseSd: 16, sampleSize: 250, alpha: 5, meaningfulThreshold: 5 },
  },
]);
