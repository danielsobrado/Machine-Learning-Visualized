export const HOURS = 18;
export const SAMPLES_PER_HOUR = 80;
export const INCIDENT_HOUR = 7;
export const PSI_BINS = [-Infinity, -1, -0.35, 0.35, 1, Infinity];

export const DEFAULT_SCENARIO = {
  scenarioId: 'concept-drift',
  currentHour: HOURS - 1,
  labelDelay: 3,
  psiThreshold: 0.2,
  accuracyDropThreshold: 0.08,
  latencyBudget: 260,
};

export const SCENARIOS = [
  { id: 'covariate-shift', label: 'Covariate shift', description: 'Inputs move after deployment; PSI should react even before labels arrive.' },
  { id: 'concept-drift', label: 'Concept drift', description: 'P(y|x) changes while the input distribution stays similar. Feature drift alone can miss it.' },
  { id: 'label-shift', label: 'Label shift', description: 'Class prevalence changes; delayed outcomes determine when performance evidence becomes available.' },
  { id: 'latency-incident', label: 'Latency incident', description: 'Prediction quality is stable but serving latency violates the operational SLO.' },
];

export const CONTROL_LIMITS = {
  currentHour: { min: 1, max: HOURS - 1, step: 1 },
  labelDelay: { min: 0, max: 8, step: 1 },
  psiThreshold: { min: 0.05, max: 0.4, step: 0.05 },
  accuracyDropThreshold: { min: 0.03, max: 0.2, step: 0.01 },
  latencyBudget: { min: 160, max: 420, step: 20 },
};
