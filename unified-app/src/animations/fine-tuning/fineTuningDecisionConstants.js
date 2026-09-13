export const FINE_TUNING_PRESETS = Object.freeze({
  '3b': Object.freeze({ label: '3B-like model', baseParameters: 3_000_000_000, layers: 28, dModel: 3072 }),
  '7b': Object.freeze({ label: '7B-like model', baseParameters: 7_000_000_000, layers: 32, dModel: 4096 }),
  '13b': Object.freeze({ label: '13B-like model', baseParameters: 13_000_000_000, layers: 40, dModel: 5120 }),
});

export const FINE_TUNING_DEFAULTS = Object.freeze({
  presetId: '7b',
  rank: 16,
  adaptedMatricesPerLayer: 4,
  benchmarkOverlap: false,
  formatMatch: true,
  domainExamples: 5000,
});

export const BYTES_PER_BF16_WEIGHT = 2;
export const BYTES_PER_INT4_WEIGHT = 0.5;
export const BYTES_PER_ADAM_MOMENTS = 8;
