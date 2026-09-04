export const DEFAULT_SCENARIO = {
  family: 'binomial',
  trials: 12,
  probability: 0.35,
  poissonRate: 3,
  mean: 0,
  sigma: 1,
  exponentialRate: 1.5,
  lower: 2,
  upper: 6,
  sampleSize: 800,
  seed: 17,
};

export const FAMILY_OPTIONS = [
  { id: 'binomial', label: 'Binomial', kind: 'discrete' },
  { id: 'poisson', label: 'Poisson', kind: 'discrete' },
  { id: 'normal', label: 'Normal', kind: 'continuous' },
  { id: 'exponential', label: 'Exponential', kind: 'continuous' },
];

export const CONTROL_LIMITS = {
  trials: { min: 2, max: 30, step: 1 },
  probability: { min: 0.05, max: 0.95, step: 0.05 },
  poissonRate: { min: 0.5, max: 10, step: 0.5 },
  mean: { min: -3, max: 3, step: 0.25 },
  sigma: { min: 0.25, max: 3, step: 0.25 },
  exponentialRate: { min: 0.25, max: 4, step: 0.25 },
  lower: { min: -6, max: 20, step: 0.5 },
  upper: { min: -6, max: 20, step: 0.5 },
  sampleSize: { min: 100, max: 3000, step: 100 },
};

export const SCENARIO_PRESETS = [
  {
    id: 'binomial',
    label: 'Classifier successes',
    values: { family: 'binomial', trials: 12, probability: 0.35, lower: 2, upper: 6 },
  },
  {
    id: 'poisson',
    label: 'Rare arrivals',
    values: { family: 'poisson', poissonRate: 3, lower: 1, upper: 5 },
  },
  {
    id: 'normal',
    label: 'Model scores',
    values: { family: 'normal', mean: 0, sigma: 1, lower: -1, upper: 1 },
  },
  {
    id: 'exponential',
    label: 'Waiting time',
    values: { family: 'exponential', exponentialRate: 2.5, lower: 0, upper: 0.5 },
  },
];
