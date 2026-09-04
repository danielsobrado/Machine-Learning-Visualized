export const DEFAULT_SCENARIO = Object.freeze({
  populationSize: 1400,
  observedSelection: 1.2,
  hiddenConfounding: 0,
  treatmentEffect: 8,
  weightCap: 12,
  seed: 431,
});

export const CONTROL_LIMITS = Object.freeze({
  populationSize: { min: 400, max: 3000, step: 100 },
  observedSelection: { min: 0, max: 2.8, step: 0.1 },
  hiddenConfounding: { min: 0, max: 1.8, step: 0.1 },
  treatmentEffect: { min: -10, max: 20, step: 1 },
  weightCap: { min: 3, max: 30, step: 1 },
});

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'good-overlap', label: 'Good overlap', values: { observedSelection: 0.8, hiddenConfounding: 0, weightCap: 12 } },
  { id: 'poor-overlap', label: 'Poor overlap', values: { observedSelection: 2.5, hiddenConfounding: 0, weightCap: 20 } },
  { id: 'hidden-bias', label: 'Hidden confounder', values: { observedSelection: 1.2, hiddenConfounding: 1.2, weightCap: 12 } },
]);
