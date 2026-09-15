export const SOFTMAX_JACOBIAN_DEFAULTS = Object.freeze({
  logits: Object.freeze([2, 1, 0]),
  selectedLogit: 0,
  perturbation: 0.1,
  temperature: 1,
});

export const SOFTMAX_JACOBIAN_LIMITS = Object.freeze({
  perturbation: Object.freeze({ min: -0.5, max: 0.5, step: 0.05 }),
  temperature: Object.freeze({ min: 0.5, max: 3, step: 0.1 }),
});
