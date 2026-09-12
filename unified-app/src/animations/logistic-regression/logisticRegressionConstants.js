export const TRAIN_POINTS = Object.freeze([
  { id: 'A', risk: 16, engagement: 72, y: 0 },
  { id: 'B', risk: 22, engagement: 50, y: 0 },
  { id: 'C', risk: 26, engagement: 34, y: 0 },
  { id: 'D', risk: 31, engagement: 62, y: 0 },
  { id: 'E', risk: 35, engagement: 20, y: 0 },
  { id: 'F', risk: 39, engagement: 78, y: 1 },
  { id: 'G', risk: 55, engagement: 40, y: 0 },
  { id: 'H', risk: 49, engagement: 25, y: 1 },
  { id: 'I', risk: 52, engagement: 68, y: 1 },
  { id: 'J', risk: 58, engagement: 36, y: 1 },
  { id: 'K', risk: 63, engagement: 58, y: 1 },
  { id: 'L', risk: 68, engagement: 18, y: 1 },
  { id: 'M', risk: 72, engagement: 76, y: 1 },
  { id: 'N', risk: 78, engagement: 42, y: 1 },
  { id: 'O', risk: 83, engagement: 64, y: 1 },
  { id: 'P', risk: 89, engagement: 28, y: 1 },
]);

export const VALIDATION_POINTS = Object.freeze([
  { id: 'V1', risk: 18, engagement: 60, y: 0 },
  { id: 'V2', risk: 25, engagement: 30, y: 0 },
  { id: 'V3', risk: 30, engagement: 75, y: 0 },
  { id: 'V4', risk: 38, engagement: 42, y: 0 },
  { id: 'V5', risk: 42, engagement: 70, y: 1 },
  { id: 'V6', risk: 46, engagement: 22, y: 0 },
  { id: 'V7', risk: 50, engagement: 50, y: 1 },
  { id: 'V8', risk: 54, engagement: 30, y: 1 },
  { id: 'V9', risk: 60, engagement: 65, y: 1 },
  { id: 'V10', risk: 66, engagement: 35, y: 1 },
  { id: 'V11', risk: 74, engagement: 55, y: 1 },
  { id: 'V12', risk: 82, engagement: 20, y: 1 },
  { id: 'V13', risk: 35, engagement: 80, y: 1 },
  { id: 'V14', risk: 58, engagement: 18, y: 0 },
  { id: 'V15', risk: 44, engagement: 58, y: 0 },
  { id: 'V16', risk: 70, engagement: 75, y: 1 },
]);

export const POINTS = TRAIN_POINTS;

export const PRESETS = Object.freeze({
  balanced: {
    label: 'Learned fit',
    detail: 'Refit logistic regression on the training sample with mild L2 regularization.',
    lambda: 0.1,
    threshold: 0.5,
  },
  cautious: {
    label: 'Cautious positives',
    detail: 'Keep the same learned probabilities but raise the operating threshold.',
    lambda: 0.1,
    threshold: 0.7,
  },
  underfit: {
    label: 'Strong ridge',
    detail: 'Refit with heavy L2 shrinkage so probabilities are less extreme.',
    lambda: 5,
    threshold: 0.5,
  },
});

export const FEATURE_TRANSFORM = Object.freeze({ center: 50, scale: 18 });

export const FIT_CONFIG = Object.freeze({
  maxIterations: 40,
  tolerance: 1e-10,
  hessianEpsilon: 1e-10,
});

export const SEPARABLE_POINTS = Object.freeze([
  { id: 'S1', risk: 20, engagement: 20, y: 0 },
  { id: 'S2', risk: 25, engagement: 50, y: 0 },
  { id: 'S3', risk: 30, engagement: 80, y: 0 },
  { id: 'S4', risk: 35, engagement: 35, y: 0 },
  { id: 'S5', risk: 40, engagement: 65, y: 0 },
  { id: 'S6', risk: 45, engagement: 45, y: 0 },
  { id: 'S7', risk: 55, engagement: 55, y: 1 },
  { id: 'S8', risk: 60, engagement: 30, y: 1 },
  { id: 'S9', risk: 65, engagement: 75, y: 1 },
  { id: 'S10', risk: 70, engagement: 40, y: 1 },
  { id: 'S11', risk: 78, engagement: 62, y: 1 },
  { id: 'S12', risk: 85, engagement: 25, y: 1 },
]);

export const SEPARATION_EXPERIMENT = Object.freeze({
  maxIterations: 15,
  ridgeLambda: 0.1,
});

export const DEPLOYMENT_POPULATION = 1000;

export const DEPLOYMENT_SCENARIOS = Object.freeze({
  rareSafetyEvent: {
    label: 'Rare safety event',
    detail: 'Misses are extremely expensive, even though positives are rare.',
    prevalence: 0.05,
    falsePositiveCost: 1,
    falseNegativeCost: 200,
  },
  balancedOperations: {
    label: 'Balanced operations',
    detail: 'Moderate prevalence with similar costs for both error types.',
    prevalence: 0.3,
    falsePositiveCost: 10,
    falseNegativeCost: 10,
  },
  expensiveIntervention: {
    label: 'Expensive intervention',
    detail: 'False alarms trigger a costly action, so precision matters more.',
    prevalence: 0.08,
    falsePositiveCost: 100,
    falseNegativeCost: 10,
  },
});

export const THRESHOLD_RANGE = Object.freeze({
  min: 0.05,
  max: 0.95,
  step: 0.01,
});

export const DECISION_SURFACE = Object.freeze({
  featureMin: 0,
  featureMax: 100,
  svgMin: 24,
  svgMax: 336,
  gridSize: 16,
});
