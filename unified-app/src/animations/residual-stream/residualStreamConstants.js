export const FEATURE_LABELS = Object.freeze([
  'subject',
  'relation',
  'syntax',
  'prediction',
]);

export const INITIAL_STREAM = Object.freeze({
  id: 'embedding',
  label: 'Initial token representation',
  base: Object.freeze([0.9, 0.2, 0.1, 0.4]),
  color: '#0f766e',
});

export const RESIDUAL_WRITES = Object.freeze([
  Object.freeze({ id: 'attn1', label: 'Attention write 1', base: Object.freeze([0.2, 0.7, -0.1, 0.1]), color: '#2563eb' }),
  Object.freeze({ id: 'mlp1', label: 'MLP write 1', base: Object.freeze([-0.1, 0.2, 0.8, 0.2]), color: '#7c3aed' }),
  Object.freeze({ id: 'attn2', label: 'Attention write 2', base: Object.freeze([0.1, -0.3, 0.1, 0.7]), color: '#db2777' }),
  Object.freeze({ id: 'mlp2', label: 'MLP write 2', base: Object.freeze([0.3, 0.1, 0.4, -0.2]), color: '#ea580c' }),
]);

export const DEFAULT_WRITE_STRENGTHS = Object.freeze({
  embedding: 1,
  attn1: 0.7,
  mlp1: 0.55,
  attn2: 0.4,
  mlp2: 0.35,
});

export const NORMALIZATION_DEMO_INPUT = Object.freeze([2.0, 0.0, -1.0, 3.0]);

export const NORMALIZATION_DEMO_MATRIX = Object.freeze([
  Object.freeze([0.4, -0.1, 0.15, 0.0]),
  Object.freeze([0.1, 0.35, 0.0, 0.2]),
  Object.freeze([-0.15, 0.1, 0.45, 0.1]),
  Object.freeze([0.0, 0.2, -0.1, 0.3]),
]);

export const LAYER_NORM_EPSILON = 1e-5;
