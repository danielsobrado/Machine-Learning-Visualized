function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive integer`);
}

export function transformerMatrixParameterLedger({
  dModel,
  numHeads,
  numLayers,
  dFF,
  includeCrossAttention = false,
}) {
  requirePositiveInteger(dModel, 'dModel');
  requirePositiveInteger(numHeads, 'numHeads');
  requirePositiveInteger(numLayers, 'numLayers');
  requirePositiveInteger(dFF, 'dFF');
  if (dModel % numHeads !== 0) throw new RangeError('dModel must be divisible by numHeads');

  const headDim = dModel / numHeads;
  const selfAttentionPerLayer = 4 * dModel * dModel;
  const crossAttentionPerLayer = includeCrossAttention ? 4 * dModel * dModel : 0;
  const ffnPerLayer = 2 * dModel * dFF;
  const totalPerLayer = selfAttentionPerLayer + crossAttentionPerLayer + ffnPerLayer;

  return {
    headDim,
    selfAttentionPerLayer,
    crossAttentionPerLayer,
    ffnPerLayer,
    totalPerLayer,
    selfAttentionTotal: selfAttentionPerLayer * numLayers,
    crossAttentionTotal: crossAttentionPerLayer * numLayers,
    ffnTotal: ffnPerLayer * numLayers,
    stackTotal: totalPerLayer * numLayers,
  };
}

export function formatParameterCount(value) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError('value must be non-negative and finite');
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return String(value);
}
