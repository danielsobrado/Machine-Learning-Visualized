function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new TypeError(`${name} must be a positive integer`);
}

export function transformerShapeLedger({ batchSize = 1, sequenceLength, dModel, numHeads, dFF }) {
  [batchSize, sequenceLength, dModel, numHeads, dFF].forEach((value, index) => requirePositiveInteger(value, ['batchSize', 'sequenceLength', 'dModel', 'numHeads', 'dFF'][index]));
  if (dModel % numHeads !== 0) throw new RangeError('dModel must be divisible by numHeads');
  const headDim = dModel / numHeads;

  return {
    headDim,
    rows: [
      { id: 'tokens', label: 'Token IDs', shape: [batchSize, sequenceLength] },
      { id: 'embed', label: 'Embeddings', shape: [batchSize, sequenceLength, dModel] },
      { id: 'qkv', label: 'Q / K / V per head', shape: [batchSize, numHeads, sequenceLength, headDim] },
      { id: 'scores', label: 'Attention scores', shape: [batchSize, numHeads, sequenceLength, sequenceLength] },
      { id: 'concat', label: 'Concatenated heads', shape: [batchSize, sequenceLength, dModel] },
      { id: 'ffn', label: 'FFN hidden', shape: [batchSize, sequenceLength, dFF] },
      { id: 'output', label: 'Block output', shape: [batchSize, sequenceLength, dModel] },
    ],
  };
}

export function transformerCoreParameterLedger({ dModel, dFF }) {
  [dModel, dFF].forEach((value, index) => requirePositiveInteger(value, ['dModel', 'dFF'][index]));
  const qkv = 3 * dModel * dModel;
  const outputProjection = dModel * dModel;
  const ffnUp = dModel * dFF;
  const ffnDown = dFF * dModel;
  return {
    qkv,
    outputProjection,
    ffnUp,
    ffnDown,
    attention: qkv + outputProjection,
    ffn: ffnUp + ffnDown,
    total: qkv + outputProjection + ffnUp + ffnDown,
  };
}

export function attentionScoreElements({ batchSize = 1, sequenceLength, numHeads }) {
  [batchSize, sequenceLength, numHeads].forEach((value, index) => requirePositiveInteger(value, ['batchSize', 'sequenceLength', 'numHeads'][index]));
  return batchSize * numHeads * sequenceLength * sequenceLength;
}

export function attentionMaskRule(mode) {
  if (mode === 'encoder') return 'Bidirectional: every token may read every non-padding token.';
  if (mode === 'decoder') return 'Causal: token t may read positions ≤ t, never future tokens.';
  throw new RangeError(`Unknown transformer mode: ${mode}`);
}
