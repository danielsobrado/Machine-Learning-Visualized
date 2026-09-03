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

export const FOREST_DIVERSITY_REFERENCE_CORRELATIONS = Object.freeze([
  { value: 0, label: 'independent errors' },
  { value: 0.5, label: 'moderately correlated' },
  { value: 0.9, label: 'near-clone trees' },
]);
