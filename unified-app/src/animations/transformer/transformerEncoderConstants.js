export const ENCODER_STEPS = Object.freeze([
  Object.freeze({
    id: 'input',
    label: '1. Token representation + position information',
    original: 'The 2017 Transformer adds sinusoidal position encodings to token embeddings.',
    modern: 'Other encoders may use learned absolute positions, relative biases, RoPE-like mechanisms, or other position schemes.',
  }),
  Object.freeze({
    id: 'attention',
    label: '2. Encoder self-attention',
    original: 'Q, K, and V are projected from the same source sequence. Full attention allows each valid source token to read the other valid source tokens.',
    modern: 'Padding or task-specific masks still restrict invalid positions. Separate heads can learn different projection subspaces, but distinct human-interpretable specialization is not guaranteed.',
  }),
  Object.freeze({
    id: 'ffn',
    label: '3. Position-wise feed-forward network',
    original: 'The original block used a two-linear-layer FFN with ReLU, expanding d_model = 512 to d_ff = 2048 and projecting back.',
    modern: 'Modern encoders may use GELU, gated FFNs, different expansion ratios, MoE layers, or other sublayer designs.',
  }),
  Object.freeze({
    id: 'residual',
    label: '4. Residual path + normalization',
    original: 'The original Transformer used post-norm: normalize after each residual addition.',
    modern: 'Many later architectures use pre-norm or related variants. The residual path remains additive, but normalization placement is architecture-specific.',
  }),
]);

export const ENCODER_OUTPUT_DESTINATIONS = Object.freeze([
  Object.freeze({ label: 'Another encoder layer', detail: 'Intermediate layers feed the next shape-preserving encoder block.' }),
  Object.freeze({ label: 'Task / pooling head', detail: 'Encoder-only systems can map contextual states to classification, ranking, extraction, or embedding outputs.' }),
  Object.freeze({ label: 'Decoder cross-attention memory', detail: 'In encoder–decoder systems, source states become K/V memory read by decoder queries.' }),
]);

export const ORIGINAL_ENCODER_DIMENSIONS = Object.freeze({
  dModel: 512,
  heads: 8,
  headDim: 64,
  dFF: 2048,
});
