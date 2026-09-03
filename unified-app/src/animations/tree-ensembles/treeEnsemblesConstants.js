export const POINTS = Object.freeze([
  { x: 0.12, y: 0.22, label: 0 },
  { x: 0.18, y: 0.36, label: 0 },
  { x: 0.25, y: 0.64, label: 0 },
  { x: 0.31, y: 0.79, label: 1 },
  { x: 0.42, y: 0.28, label: 0 },
  { x: 0.48, y: 0.58, label: 1 },
  { x: 0.54, y: 0.74, label: 1 },
  { x: 0.60, y: 0.34, label: 0 },
  { x: 0.67, y: 0.49, label: 1 },
  { x: 0.73, y: 0.71, label: 1 },
  { x: 0.81, y: 0.28, label: 1 },
  { x: 0.88, y: 0.54, label: 1 },
]);

export const FOREST_RULES = Object.freeze([
  { feature: 'x', threshold: 0.52, polarity: 1 },
  { feature: 'y', threshold: 0.46, polarity: 1 },
  { feature: 'x', threshold: 0.74, polarity: -1 },
  { feature: 'y', threshold: 0.70, polarity: 1 },
  { feature: 'x', threshold: 0.35, polarity: 1 },
  { feature: 'y', threshold: 0.31, polarity: 1 },
  { feature: 'x', threshold: 0.62, polarity: 1 },
]);

export const BOOSTING_STEPS = Object.freeze([
  { rule: 'x > 0.50', contribution: 0.42 },
  { rule: 'y > 0.55', contribution: 0.30 },
  { rule: 'x > 0.75', contribution: 0.18 },
  { rule: 'y < 0.32', contribution: -0.16 },
  { rule: 'x < 0.28', contribution: -0.14 },
]);

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
