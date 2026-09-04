export const MODEL_PRESETS = [
  { id: 'gqa-8b', label: '8B-style GQA', layers: 32, kvHeads: 8, headDim: 128, bytesPerElement: 2 },
  { id: 'mha-8b', label: '8B-style MHA', layers: 32, kvHeads: 32, headDim: 128, bytesPerElement: 2 },
  { id: 'gqa-70b', label: '70B-style GQA', layers: 80, kvHeads: 8, headDim: 128, bytesPerElement: 2 },
];

export const SERVING_REQUESTS = [
  { id: 'R1', arrival: 0, promptTokens: 1200, outputTokens: 6, sharedPrefixTokens: 800 },
  { id: 'R2', arrival: 0, promptTokens: 1400, outputTokens: 2, sharedPrefixTokens: 800 },
  { id: 'R3', arrival: 0, promptTokens: 900, outputTokens: 9, sharedPrefixTokens: 800 },
  { id: 'R4', arrival: 2, promptTokens: 1800, outputTokens: 4, sharedPrefixTokens: 800 },
  { id: 'R5', arrival: 3, promptTokens: 1100, outputTokens: 7, sharedPrefixTokens: 800 },
  { id: 'R6', arrival: 5, promptTokens: 1000, outputTokens: 3, sharedPrefixTokens: 800 },
];

export const SERVING_DEFAULTS = {
  modelId: 'gqa-8b',
  blockSize: 16,
  maxSequenceTokens: 4096,
  maxBatchSize: 3,
  speculativeDraftLength: 6,
  speculativeAcceptance: 0.75,
};
