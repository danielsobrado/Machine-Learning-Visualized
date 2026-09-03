export const ACTIVATIONS = Object.freeze({
  linear: Object.freeze({ label: 'Linear' }),
  tanh: Object.freeze({ label: 'tanh' }),
  sigmoid: Object.freeze({ label: 'Sigmoid' }),
  relu: Object.freeze({ label: 'ReLU' }),
  leakyRelu: Object.freeze({ label: 'Leaky ReLU' }),
});

export const GRADIENT_PROBLEM_DEFAULTS = Object.freeze({
  presetId: 'saturatedTanh',
  depth: 14,
  input: 3,
  weight: 1.5,
  bias: 0,
  activationId: 'tanh',
  useResidual: false,
  residualScale: 1,
  clipNorm: 5,
  outputGradient: 1,
});

export const GRADIENT_PRESETS = Object.freeze({
  saturatedTanh: Object.freeze({
    label: 'Saturated tanh · vanishing',
    description: 'Large pre-activations push tanh into a flat region, so its exact derivative becomes small.',
    depth: 14,
    input: 3,
    weight: 1.5,
    bias: 0,
    activationId: 'tanh',
  }),
  deadRelu: Object.freeze({
    label: 'Dead ReLU · blocked path',
    description: 'A negative pre-activation gives ReLU zero local slope and cuts the backward path.',
    depth: 12,
    input: -1,
    weight: 1,
    bias: 0,
    activationId: 'relu',
  }),
  explodingRelu: Object.freeze({
    label: 'Positive ReLU · exploding',
    description: 'ReLU stays active while a weight above one compounds through depth.',
    depth: 24,
    input: 1,
    weight: 1.5,
    bias: 0,
    activationId: 'relu',
  }),
  neutralLinear: Object.freeze({
    label: 'Linear identity · neutral',
    description: 'With weight one and slope one, the scalar chain preserves the backward signal exactly.',
    depth: 16,
    input: 1,
    weight: 1,
    bias: 0,
    activationId: 'linear',
  }),
});

export const GRADIENT_THRESHOLDS = Object.freeze({
  vanishing: 1e-4,
  exploding: 1e4,
  logFloor: -12,
});

export const VALUE_BOUNDS = Object.freeze({
  minDepth: 2,
  maxDepth: 40,
  maxAbsoluteInput: 5,
  maxAbsoluteWeight: 2,
  maxAbsoluteBias: 3,
  minResidualScale: 0,
  maxResidualScale: 2,
  maxClipNorm: 100,
});

export const LEAKY_RELU_SLOPE = 0.1;
