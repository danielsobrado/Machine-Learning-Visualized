export const TRAINING_LOOP_DEFAULTS = {
  learningRate: 0.2,
  curvature: 1.4,
  optimizerSteps: 8,
  microBatches: 8,
  startParameter: 2,
  noiseAmplitude: 0.12,
};

export const TRAINING_LOOP_LIMITS = {
  learningRate: { min: 0.02, max: 0.8, step: 0.02 },
  curvature: { min: 0.4, max: 3, step: 0.1 },
  optimizerSteps: { min: 1, max: 16, step: 1 },
  microBatches: { min: 1, max: 16, step: 1 },
};

export const LOOP_MODES = {
  correct: {
    label: 'Correct accumulation',
    description: 'Average micro-batch gradients before the optimizer step.',
  },
  unscaled: {
    label: 'Unscaled accumulation',
    description: 'Sum micro-batch gradients without dividing by the accumulation count.',
  },
  stale: {
    label: 'Forgot zero_grad',
    description: 'Keep gradients from previous optimizer steps and add new gradients on top.',
  },
};

export const STABILITY = {
  stableUpperExclusive: 2,
};
