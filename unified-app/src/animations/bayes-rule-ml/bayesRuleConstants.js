export const BAYES_DEFAULTS = {
  priorPct: 8,
  sensitivityPct: 86,
  falsePositivePct: 12,
  actionThresholdPct: 70,
  population: 1000,
};

export const BAYES_LIMITS = {
  priorPct: { min: 1, max: 50, step: 1 },
  sensitivityPct: { min: 45, max: 99, step: 1 },
  falsePositivePct: { min: 1, max: 45, step: 1 },
  actionThresholdPct: { min: 40, max: 95, step: 1 },
};
