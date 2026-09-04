export const DEFAULT_SCENARIO = {
  conditionRate: 0.3,
  eventGivenCondition: 0.75,
  eventGivenNotCondition: 0.2,
  population: 10000,
};

export const CONTROL_LIMITS = {
  conditionRate: { min: 0.05, max: 0.95, step: 0.05 },
  eventGivenCondition: { min: 0.05, max: 0.95, step: 0.05 },
  eventGivenNotCondition: { min: 0.05, max: 0.95, step: 0.05 },
  population: { min: 1000, max: 20000, step: 1000 },
};

export const SCENARIO_PRESETS = [
  {
    id: 'independent',
    label: 'Independent events',
    values: { conditionRate: 0.4, eventGivenCondition: 0.3, eventGivenNotCondition: 0.3 },
  },
  {
    id: 'associated',
    label: 'Strong association',
    values: { conditionRate: 0.3, eventGivenCondition: 0.8, eventGivenNotCondition: 0.2 },
  },
  {
    id: 'rare-condition',
    label: 'Rare condition',
    values: { conditionRate: 0.05, eventGivenCondition: 0.9, eventGivenNotCondition: 0.1 },
  },
  {
    id: 'negative',
    label: 'Negative association',
    values: { conditionRate: 0.5, eventGivenCondition: 0.15, eventGivenNotCondition: 0.7 },
  },
];
