export const TRANSFORMER_CALCULATOR_DEFAULTS = Object.freeze({
  dModel: 512,
  numHeads: 8,
  numLayers: 6,
  dFF: 2048,
  includeCrossAttention: false,
});

export const TRANSFORMER_CALCULATOR_LIMITS = Object.freeze({
  dModel: Object.freeze({ min: 16, max: 16384 }),
  numHeads: Object.freeze({ min: 1, max: 256 }),
  numLayers: Object.freeze({ min: 1, max: 256 }),
  dFF: Object.freeze({ min: 16, max: 65536 }),
});

export const PARAMETER_SCOPE = Object.freeze([
  'Q, K, V, and output projection matrix weights for self-attention',
  'Two dense FFN matrix weights: d_model → d_ff → d_model',
  'Optional Q, K, V, and output projection matrix weights for one cross-attention module per layer',
]);

export const PARAMETER_OMISSIONS = Object.freeze([
  'bias vectors and normalization parameters',
  'token, learned-position, and modality embeddings',
  'vocabulary / task output heads and weight tying',
  'gated FFNs such as SwiGLU, MoE experts, GQA/MQA projection differences, and architecture-specific extras',
]);
