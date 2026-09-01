export const POINTS = Object.freeze([
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

export const PRESETS = Object.freeze({
  balanced: {
    label: 'Balanced fit',
    detail: 'A useful separator with deliberate class overlap.',
    weightRisk: 1.35,
    weightEngagement: -0.45,
    bias: 0.1,
    threshold: 0.5,
  },
  cautious: {
    label: 'Cautious positives',
    detail: 'A higher threshold suppresses false alarms but misses more positives.',
    weightRisk: 1.35,
    weightEngagement: -0.45,
    bias: 0.1,
    threshold: 0.7,
  },
  underfit: {
    label: 'Underfit scores',
    detail: 'Small weights compress probabilities near 0.5.',
    weightRisk: 0.45,
    weightEngagement: -0.15,
    bias: 0,
    threshold: 0.5,
  },
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
