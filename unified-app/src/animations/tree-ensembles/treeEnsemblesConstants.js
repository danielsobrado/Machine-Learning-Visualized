export const FEATURES = Object.freeze(['x', 'y']);

export const POINTS = Object.freeze([
  { id: 'A', x: 0.12, y: 0.22, label: 0 },
  { id: 'B', x: 0.18, y: 0.36, label: 0 },
  { id: 'C', x: 0.25, y: 0.64, label: 0 },
  { id: 'D', x: 0.31, y: 0.79, label: 1 },
  { id: 'E', x: 0.42, y: 0.28, label: 0 },
  { id: 'F', x: 0.48, y: 0.58, label: 1 },
  { id: 'G', x: 0.54, y: 0.74, label: 1 },
  { id: 'H', x: 0.60, y: 0.34, label: 0 },
  { id: 'I', x: 0.67, y: 0.49, label: 1 },
  { id: 'J', x: 0.73, y: 0.71, label: 1 },
  { id: 'K', x: 0.81, y: 0.28, label: 1 },
  { id: 'L', x: 0.88, y: 0.54, label: 1 },
]);

export const TREE_CONFIG = Object.freeze({
  minDepth: 1,
  maxDepth: 4,
  defaultDepth: 2,
  minLeafSize: 1,
});

export const FOREST_CONFIG = Object.freeze({
  minTrees: 1,
  maxTrees: 40,
  defaultTrees: 15,
  featureSubsetSize: 1,
  seed: 0x5eed1234,
});

export const BOOSTING_CONFIG = Object.freeze({
  minRounds: 1,
  maxRounds: 12,
  defaultRounds: 5,
  minLearningRate: 0.1,
  maxLearningRate: 1,
  learningRateStep: 0.05,
  defaultLearningRate: 0.5,
  probabilityEpsilon: 1e-9,
});

export const FOREST_DIVERSITY_DEMO = Object.freeze({
  minTrees: 1,
  maxTrees: 100,
  defaultTrees: 25,
  minCorrelation: 0,
  maxCorrelation: 0.95,
  defaultCorrelation: 0.8,
  correlationStep: 0.05,
});

export const FOREST_DIVERSITY_CHART = Object.freeze({
  width: 560,
  height: 250,
  left: 52,
  right: 20,
  top: 20,
  bottom: 42,
});
