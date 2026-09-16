export const NEURAL_CNN_NEXT_QUALITY_LESSON_IDS = Object.freeze(new Set([
  'gradient-problems',
  'layer-normalization',
  'relu',
  'leaky-relu',
  'conv2d',
  'conv-relu',
  'max-pooling',
]));

export const NEURAL_CNN_NEXT_LAB_LESSON_IDS = Object.freeze(new Set([
  'gradient-problems',
  'leaky-relu',
  'conv2d',
  'conv-relu',
  'max-pooling',
]));

export const ACTIVATION_CHAIN_DEFAULTS = Object.freeze({
  depth: 12,
  presets: Object.freeze([
    Object.freeze({ id: 'sigmoid', label: 'Sigmoid saturated', activation: 'sigmoid', z: 4, gain: 1 }),
    Object.freeze({ id: 'tanh', label: 'tanh saturated', activation: 'tanh', z: 3, gain: 1 }),
    Object.freeze({ id: 'relu-active', label: 'ReLU active', activation: 'relu', z: 1, gain: 1 }),
    Object.freeze({ id: 'relu-dead', label: 'ReLU dead', activation: 'relu', z: -1, gain: 1 }),
    Object.freeze({ id: 'gelu', label: 'GELU moderate', activation: 'gelu', z: 0.5, gain: 1 }),
  ]),
});

export const ACTIVATION_FAMILY_DEFAULTS = Object.freeze({
  x: -1.5,
  preluSlope: 0.2,
  leakySlope: 0.1,
  eluAlpha: 1,
});

export const CONV_NEXT_DEFAULTS = Object.freeze({
  input: Object.freeze([
    Object.freeze([[1, 2, 0], [0, 1, 3], [2, 1, 0]]),
    Object.freeze([[0, 1, 2], [2, 0, 1], [1, 3, 1]]),
  ]),
  filters: Object.freeze([
    Object.freeze({
      label: 'Filter A',
      bias: 0,
      kernels: Object.freeze([
        Object.freeze([[1, 0], [0, -1]]),
        Object.freeze([[0, 1], [-1, 0]]),
      ]),
    }),
    Object.freeze({
      label: 'Filter B',
      bias: 1,
      kernels: Object.freeze([
        Object.freeze([[0, 1], [1, 0]]),
        Object.freeze([[1, -1], [0, 1]]),
      ]),
    }),
  ]),
});

export const CONV_RELU_BACKWARD_DEFAULTS = Object.freeze({
  input: Object.freeze([[1, 2, 0], [0, 1, 3], [2, 1, 0]]),
  kernel: Object.freeze([[1, -1], [0.5, 1]]),
  bias: -1,
  upstream: Object.freeze([[1, 1], [1, 1]]),
});

export const POOLING_COMPARISON_DEFAULTS = Object.freeze({
  patch: Object.freeze([[1, 4], [2, 3]]),
  stridedKernel: Object.freeze([[0.1, 0.4], [0.2, 0.3]]),
  upstream: 1,
});
