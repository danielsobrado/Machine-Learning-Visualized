function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${name} must be a positive integer.`);
  }
}

export function kvCacheBytes({
  tokens,
  layers,
  kvHeads,
  headDim,
  bytesPerElement,
}) {
  for (const [name, value] of Object.entries({ tokens, layers, kvHeads, headDim, bytesPerElement })) {
    assertPositiveInteger(value, name);
  }
  return tokens * layers * 2 * kvHeads * headDim * bytesPerElement;
}

export function causalAttentionPairs(tokens) {
  assertPositiveInteger(tokens, 'tokens');
  return (tokens * (tokens + 1)) / 2;
}

export function gqaKvReduction(queryHeads, kvHeads) {
  assertPositiveInteger(queryHeads, 'queryHeads');
  assertPositiveInteger(kvHeads, 'kvHeads');
  if (kvHeads > queryHeads || queryHeads % kvHeads !== 0) {
    throw new RangeError('kvHeads must divide queryHeads and cannot exceed it.');
  }
  return queryHeads / kvHeads;
}

export function packedChunkCount({
  contextWindowTokens,
  promptTokens,
  outputReserveTokens,
  chunkTokens,
  topK,
}) {
  for (const [name, value] of Object.entries({
    contextWindowTokens,
    promptTokens,
    outputReserveTokens,
    chunkTokens,
    topK,
  })) {
    if (!Number.isInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative integer.`);
  }
  if (contextWindowTokens < 1 || chunkTokens < 1 || topK < 1) {
    throw new RangeError('contextWindowTokens, chunkTokens, and topK must be positive.');
  }

  const available = Math.max(0, contextWindowTokens - promptTokens - outputReserveTokens);
  return Math.min(topK, Math.floor(available / chunkTokens));
}

export function fullContextFits({ corpusTokens, contextWindowTokens, outputReserveTokens = 0 }) {
  assertPositiveInteger(corpusTokens, 'corpusTokens');
  assertPositiveInteger(contextWindowTokens, 'contextWindowTokens');
  if (!Number.isInteger(outputReserveTokens) || outputReserveTokens < 0) {
    throw new RangeError('outputReserveTokens must be a non-negative integer.');
  }
  return corpusTokens + outputReserveTokens <= contextWindowTokens;
}

export function pairReductionRatio(fullTokens, packedTokens) {
  assertPositiveInteger(fullTokens, 'fullTokens');
  assertPositiveInteger(packedTokens, 'packedTokens');
  if (packedTokens > fullTokens) return 1;
  return causalAttentionPairs(packedTokens) / causalAttentionPairs(fullTokens);
}

export function bytesToGiB(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) throw new RangeError('bytes must be non-negative.');
  return bytes / (1024 ** 3);
}

export function buildLongContextLab({
  architecture,
  contextTokens,
  corpusTokens,
  chunkTokens,
  topK,
  promptTokens,
  outputReserveTokens,
}) {
  const cacheBytes = kvCacheBytes({
    tokens: contextTokens,
    layers: architecture.layers,
    kvHeads: architecture.kvHeads,
    headDim: architecture.headDim,
    bytesPerElement: architecture.bytesPerElement,
  });
  const mhaCacheBytes = kvCacheBytes({
    tokens: contextTokens,
    layers: architecture.layers,
    kvHeads: architecture.queryHeads,
    headDim: architecture.headDim,
    bytesPerElement: architecture.bytesPerElement,
  });
  const packedChunks = packedChunkCount({
    contextWindowTokens: contextTokens,
    promptTokens,
    outputReserveTokens,
    chunkTokens,
    topK,
  });
  const packedTokens = Math.max(1, promptTokens + outputReserveTokens + (packedChunks * chunkTokens));
  const comparableFullTokens = Math.max(packedTokens, corpusTokens);

  return {
    cacheBytes,
    cacheGiB: bytesToGiB(cacheBytes),
    mhaCacheGiB: bytesToGiB(mhaCacheBytes),
    kvReductionFactor: gqaKvReduction(architecture.queryHeads, architecture.kvHeads),
    prefillCausalPairsPerHead: causalAttentionPairs(contextTokens),
    decodePairsPerNewTokenPerHead: contextTokens,
    packedChunks,
    packedTokens,
    packedUtilization: packedTokens / contextTokens,
    fullCorpusFits: fullContextFits({
      corpusTokens,
      contextWindowTokens: contextTokens,
      outputReserveTokens,
    }),
    packedVsCorpusPairRatio: pairReductionRatio(comparableFullTokens, packedTokens),
  };
}
