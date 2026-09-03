export const DEFAULT_EPSILON = 1e-5;

export const TOKEN_CASES = Object.freeze({
  spiky: Object.freeze({
    label: 'Spiky token',
    values: Object.freeze([0.2, 4.5, -2.8, 1.1, 0.7, 3.6]),
  }),
  shifted: Object.freeze({
    label: 'Shifted token',
    values: Object.freeze([3.4, 3.9, 4.2, 3.6, 4.5, 4.0]),
  }),
  constant: Object.freeze({
    label: 'Near-constant token',
    values: Object.freeze([2, 2, 2, 2, 2, 2]),
  }),
});

export const AFFINE_PROFILES = Object.freeze({
  identity: Object.freeze({
    label: 'Identity affine',
    gamma: Object.freeze([1, 1, 1, 1, 1, 1]),
    beta: Object.freeze([0, 0, 0, 0, 0, 0]),
  }),
  learned: Object.freeze({
    label: 'Featurewise learned affine',
    gamma: Object.freeze([2, 0.5, 1.8, 0.4, 1.6, 0.7]),
    beta: Object.freeze([0.2, -0.25, 0.05, 0.4, -0.1, 0.25]),
  }),
});

export const BATCH_CONTEXTS = Object.freeze({
  ordinary: Object.freeze({
    label: 'Ordinary neighbors',
    neighbors: Object.freeze([
      Object.freeze([0.6, 1.4, -1.2, 0.3, 1.1, 2.2]),
      Object.freeze([-0.4, 2.1, -0.8, 1.7, 0.5, 1.3]),
      Object.freeze([1.2, 0.7, -1.6, 0.8, 1.4, 2.7]),
    ]),
  }),
  outlier: Object.freeze({
    label: 'One extreme neighbor',
    neighbors: Object.freeze([
      Object.freeze([0.6, 1.4, -1.2, 0.3, 1.1, 2.2]),
      Object.freeze([18, -14, 22, -17, 16, -20]),
      Object.freeze([1.2, 0.7, -1.6, 0.8, 1.4, 2.7]),
    ]),
  }),
});

export const SUBLAYER_WEIGHTS = Object.freeze([0.7, -0.45, 0.6, 0.35, -0.55, 0.5]);
export const SUBLAYER_BIASES = Object.freeze([0.1, -0.2, 0.05, 0.15, -0.1, 0.08]);
