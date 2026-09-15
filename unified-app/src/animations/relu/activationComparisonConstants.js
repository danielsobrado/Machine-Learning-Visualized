export const ACTIVATION_INPUT_RANGE = Object.freeze({ min: -8, max: 8, step: 0.1 });
export const UPSTREAM_GRADIENT_RANGE = Object.freeze({ min: -2, max: 2, step: 0.1 });
export const DEFAULT_ACTIVATION_INPUT = -4;
export const DEFAULT_UPSTREAM_GRADIENT = 1;
export const LEAKY_RELU_ALPHA = 0.01;
export const GELU_TANH_COEFFICIENT = 0.044715;
export const GELU_TANH_SCALE = Math.sqrt(2 / Math.PI);

export const ACTIVATION_KINDS = Object.freeze([
  Object.freeze({ id: 'relu', label: 'ReLU', role: 'Fast hidden activation; zero gradient on the negative side.' }),
  Object.freeze({ id: 'leaky-relu', label: 'Leaky ReLU', role: 'Keeps a small negative-side gradient instead of hard zero.' }),
  Object.freeze({ id: 'sigmoid', label: 'Sigmoid', role: 'Useful for binary probabilities; saturates strongly at large |x|.' }),
  Object.freeze({ id: 'tanh', label: 'Tanh', role: 'Zero-centered and bounded, but still saturates at large |x|.' }),
  Object.freeze({ id: 'gelu', label: 'GELU', role: 'Smooth input-dependent gating used widely in Transformer MLPs.' }),
]);

export const DERIVATIVE_CHART = Object.freeze({
  xMin: -6,
  xMax: 6,
  yMin: -0.15,
  yMax: 1.15,
  samples: 121,
});
