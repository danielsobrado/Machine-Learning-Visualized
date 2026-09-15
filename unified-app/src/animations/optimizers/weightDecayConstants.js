export const WEIGHT_DECAY_DEFAULTS = Object.freeze({
  parameters: Object.freeze([2, 2]),
  dataGradient: Object.freeze([0, 0]),
  adaptiveRms: Object.freeze([0.1, 10]),
  learningRate: 0.1,
  weightDecay: 0.1,
  epsilon: 1e-8,
});

export const WEIGHT_DECAY_CONTROL_LIMITS = Object.freeze({
  learningRate: Object.freeze({ min: 0.01, max: 0.3, step: 0.01 }),
  weightDecay: Object.freeze({ min: 0.01, max: 0.3, step: 0.01 }),
  secondCoordinateRms: Object.freeze({ min: 0.1, max: 10, step: 0.1 }),
});
