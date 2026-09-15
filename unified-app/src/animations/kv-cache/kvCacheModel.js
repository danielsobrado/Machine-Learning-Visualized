function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive integer`);
}

function requireBoolean(value, name) {
  if (typeof value !== 'boolean') throw new TypeError(`${name} must be boolean`);
}

export function validKvHeadOptions(queryHeads) {
  requirePositiveInteger(queryHeads, 'queryHeads');
  return Array.from({ length: queryHeads }, (_, index) => index + 1)
    .filter((value) => queryHeads % value === 0);
}

export function attentionFamily(queryHeads, kvHeads) {
  requirePositiveInteger(queryHeads, 'queryHeads');
  requirePositiveInteger(kvHeads, 'kvHeads');
  if (queryHeads % kvHeads !== 0) throw new RangeError('queryHeads must be divisible by kvHeads');
  if (kvHeads === queryHeads) return 'MHA';
  if (kvHeads === 1) return 'MQA';
  return 'GQA';
}

export function kvCacheBytes({
  batchSize,
  tokens,
  layers,
  kvHeads,
  headDim,
  bytesPerElement,
}) {
  [batchSize, tokens, layers, kvHeads, headDim, bytesPerElement].forEach((value, index) => {
    requirePositiveInteger(value, ['batchSize', 'tokens', 'layers', 'kvHeads', 'headDim', 'bytesPerElement'][index]);
  });
  return batchSize * tokens * layers * 2 * kvHeads * headDim * bytesPerElement;
}

export function kvCacheMetrics({
  contextLength,
  decodeStep,
  queryHeads,
  kvHeads,
  headDim,
  layers,
  batchSize,
  bytesPerElement,
  windowSize,
  useCache,
}) {
  [contextLength, queryHeads, kvHeads, headDim, layers, batchSize, bytesPerElement, windowSize].forEach((value, index) => {
    requirePositiveInteger(value, ['contextLength', 'queryHeads', 'kvHeads', 'headDim', 'layers', 'batchSize', 'bytesPerElement', 'windowSize'][index]);
  });
  if (!Number.isInteger(decodeStep) || decodeStep < 0 || decodeStep >= contextLength) {
    throw new RangeError('decodeStep must be inside the active context');
  }
  if (queryHeads % kvHeads !== 0) throw new RangeError('queryHeads must be divisible by kvHeads');
  requireBoolean(useCache, 'useCache');

  const prefixLength = decodeStep + 1;
  const visibleCount = Math.min(prefixLength, windowSize);
  const visibleStart = prefixLength - visibleCount;
  const family = attentionFamily(queryHeads, kvHeads);
  const queriesPerKvHead = queryHeads / kvHeads;

  const noCacheKvVectors = prefixLength * layers * kvHeads * 2;
  const cachedKvVectors = layers * kvHeads * 2;
  const projectionSavings = prefixLength <= 0 ? 0 : 1 - cachedKvVectors / noCacheKvVectors;
  const attentionScorePairs = visibleCount * queryHeads * batchSize;
  const activeCacheBytes = kvCacheBytes({
    batchSize,
    tokens: visibleCount,
    layers,
    kvHeads,
    headDim,
    bytesPerElement,
  });
  const fullPrefixCacheBytes = kvCacheBytes({
    batchSize,
    tokens: prefixLength,
    layers,
    kvHeads,
    headDim,
    bytesPerElement,
  });
  const newTokenWriteBytes = kvCacheBytes({
    batchSize,
    tokens: 1,
    layers,
    kvHeads,
    headDim,
    bytesPerElement,
  });

  return {
    prefixLength,
    visibleCount,
    visibleStart,
    family,
    queriesPerKvHead,
    noCacheKvVectors,
    cachedKvVectors,
    projectionSavings,
    attentionScorePairs,
    activeCacheBytes,
    fullPrefixCacheBytes,
    newTokenWriteBytes,
    kvVectorsProjected: useCache ? cachedKvVectors : noCacheKvVectors,
  };
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) throw new RangeError('bytes must be finite and non-negative');
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[unit]}`;
}
