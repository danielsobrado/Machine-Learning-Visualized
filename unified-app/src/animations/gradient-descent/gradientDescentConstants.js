export const DEFAULT_LEARNING_RATE = 0.1;
export const DEFAULT_START_WEIGHT = 4;

export const QUADRATIC_CURVATURE = 1;

export const LOSS_SCENE = Object.freeze({
  weightRange: 5,
  xScale: 50,
  lossScale: 10,
  minimumY: -110,
});

export const STABILITY_LAB = Object.freeze({
  minLearningRate: 0.01,
  maxLearningRate: 1.2,
  learningRateStep: 0.01,
  defaultLearningRate: 0.95,
  startWeight: 4,
  steps: 12,
});

export const STABILITY_PRESETS = Object.freeze([
  { learningRate: 0.1, label: 'steady' },
  { learningRate: 0.5, label: 'one step' },
  { learningRate: 0.95, label: 'oscillates + converges' },
  { learningRate: 1, label: 'critical' },
  { learningRate: 1.1, label: 'diverges' },
]);

export const STABILITY_CHART = Object.freeze({
  width: 560,
  height: 260,
  left: 48,
  right: 20,
  top: 22,
  bottom: 42,
});
