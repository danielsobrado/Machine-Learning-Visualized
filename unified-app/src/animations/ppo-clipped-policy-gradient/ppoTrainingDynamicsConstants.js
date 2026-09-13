export const PPO_EPOCH_DEFAULTS = Object.freeze({
  oldLogit: 0,
  action: 1,
  advantage: 1,
  learningRate: 1.5,
  epochs: 8,
});

export const PPO_EPOCH_LIMITS = Object.freeze({
  learningRate: Object.freeze({ min: 0.1, max: 5, step: 0.1 }),
  epochs: Object.freeze({ min: 1, max: 16, step: 1 }),
});

export const PPO_KL_WARNING = 0.03;
