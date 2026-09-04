export const DEFAULT_SCENARIO = Object.freeze({
  trueRate: 58,
  sampleSize: 160,
  confidence: 95,
  runs: 120,
  method: 'wilson',
  seed: 17,
});

export const CONTROL_LIMITS = Object.freeze({
  trueRate: { min: 2, max: 98, step: 1 },
  sampleSize: { min: 20, max: 1000, step: 20 },
  confidence: { min: 80, max: 99, step: 1 },
  runs: { min: 40, max: 400, step: 20 },
});

export const METHOD_OPTIONS = Object.freeze([
  { id: 'wilson', label: 'Wilson', detail: 'Reliable default for a binomial proportion.' },
  { id: 'wald', label: 'Wald', detail: 'Simple p̂ ± z·SE; can fail badly near 0/1 or with small n.' },
]);

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'healthy', label: 'Mid-rate / decent n', values: { trueRate: 58, sampleSize: 160, confidence: 95, runs: 120, method: 'wilson' } },
  { id: 'rare-wilson', label: 'Rare rate · Wilson', values: { trueRate: 5, sampleSize: 40, confidence: 95, runs: 240, method: 'wilson' } },
  { id: 'rare-wald', label: 'Rare rate · Wald', values: { trueRate: 5, sampleSize: 40, confidence: 95, runs: 240, method: 'wald' } },
]);
