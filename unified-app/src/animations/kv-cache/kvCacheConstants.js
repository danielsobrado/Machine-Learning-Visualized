export const KV_CACHE_TOKENS = Object.freeze(['The', 'model', 'predicts', 'next', 'token', 'carefully', 'today', '.']);

export const KV_CACHE_DEFAULTS = Object.freeze({
  contextLength: 6,
  decodeStep: 4,
  queryHeads: 16,
  kvHeads: 16,
  headDim: 64,
  layers: 24,
  batchSize: 1,
  bytesPerElement: 2,
  windowSize: 8,
  useCache: true,
});

export const KV_CACHE_LIMITS = Object.freeze({
  queryHeads: Object.freeze([4, 8, 16, 32]),
  headDim: Object.freeze({ min: 32, max: 128, step: 16 }),
  layers: Object.freeze({ min: 1, max: 64, step: 1 }),
  batchSize: Object.freeze({ min: 1, max: 16, step: 1 }),
});

export const KV_CACHE_DTYPES = Object.freeze([
  Object.freeze({ id: 'fp32', label: 'FP32', bytes: 4 }),
  Object.freeze({ id: 'fp16-bf16', label: 'FP16 / BF16', bytes: 2 }),
  Object.freeze({ id: 'int8-fp8', label: '8-bit cache', bytes: 1 }),
]);
