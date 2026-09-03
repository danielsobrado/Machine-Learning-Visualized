export const BACKPROP_DEFAULTS = {
  x: 1.4,
  w: 0.8,
  b: -0.2,
  target: 1.6,
  learningRate: 0.25,
};

export const BACKPROP_CONTROL_LIMITS = {
  x: { min: -2, max: 2, step: 0.1 },
  w: { min: -2, max: 2, step: 0.1 },
  b: { min: -2, max: 2, step: 0.1 },
  target: { min: -1, max: 3, step: 0.1 },
  learningRate: { min: 0.05, max: 0.8, step: 0.05 },
};

export const BRANCH_DEFAULTS = {
  h: 1.5,
  targetA: 2.2,
  targetB: -0.4,
  branchScale: 0.7,
};

export const BRANCH_CONTROL_LIMITS = {
  h: { min: -2.5, max: 2.5, step: 0.1 },
  targetA: { min: -2.5, max: 2.5, step: 0.1 },
  targetB: { min: -2.5, max: 2.5, step: 0.1 },
  branchScale: { min: 0, max: 1.5, step: 0.05 },
};

export const NUMERICAL_GRADIENT_EPSILON = 1e-5;
