export const SCHEDULER_CADENCE_DEFAULTS = Object.freeze({
  accumulationSteps: 8,
  warmupOptimizerSteps: 1000,
  targetLearningRate: 0.001,
  inspectedOptimizerStep: 125,
});

export const SCHEDULER_CADENCE_LIMITS = Object.freeze({
  accumulationSteps: Object.freeze({ min: 1, max: 16, step: 1 }),
  warmupOptimizerSteps: Object.freeze({ min: 100, max: 2000, step: 100 }),
  inspectedOptimizerStep: Object.freeze({ min: 1, max: 500, step: 1 }),
});
