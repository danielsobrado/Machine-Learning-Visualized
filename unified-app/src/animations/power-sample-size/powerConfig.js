export const DEFAULT_SCENARIO = Object.freeze({
  baselineRate: 12,
  relativeLift: 6,
  plannedTotal: 16000,
  alpha: 5,
  targetPower: 80,
  treatmentAllocation: 50,
  designEffect: 1,
});

export const CONTROL_LIMITS = Object.freeze({
  baselineRate: { min: 2, max: 40, step: 1 },
  relativeLift: { min: 1, max: 25, step: 1 },
  plannedTotal: { min: 2000, max: 100000, step: 1000 },
  alpha: { min: 1, max: 15, step: 1 },
  targetPower: { min: 70, max: 95, step: 1 },
  treatmentAllocation: { min: 20, max: 80, step: 5 },
  designEffect: { min: 1, max: 3, step: 0.1 },
});

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'balanced', label: 'Balanced design', values: { treatmentAllocation: 50, designEffect: 1, alpha: 5, targetPower: 80 } },
  { id: 'small-effect', label: 'Small MDE', values: { relativeLift: 3, plannedTotal: 30000, treatmentAllocation: 50 } },
  { id: 'clustered', label: 'Clustered / noisy', values: { designEffect: 2, plannedTotal: 30000, treatmentAllocation: 50 } },
]);
