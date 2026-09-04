export const SIMULATION_RUNS = 4000;
export const BOUNDARY_CALIBRATION_RUNS = 5000;
export const BOUNDARY_SEARCH_STEPS = 18;
export const BASE_SEED = 271828;

export const BOUNDARY_DESIGNS = Object.freeze({
  bonferroni: Object.freeze({
    label: 'Bonferroni',
    detail: 'Simple equal alpha split. Conservative because it ignores the correlation between cumulative looks.',
  }),
  pocock: Object.freeze({
    label: 'Pocock',
    detail: 'Uses an approximately constant z boundary across looks, calibrated for the correlated cumulative design.',
  }),
  'obrien-fleming': Object.freeze({
    label: "O'Brien–Fleming",
    detail: 'Very strict early boundaries that relax toward the fixed-horizon boundary as information accumulates.',
  }),
});

export const DEFAULT_SCENARIO = Object.freeze({
  looks: 8,
  maxPerArm: 1200,
  effect: 0.16,
  alpha: 0.05,
  designId: 'obrien-fleming',
});

export const CONTROL_LIMITS = Object.freeze({
  looks: { min: 1, max: 20, step: 1 },
  maxPerArm: { min: 200, max: 2400, step: 100 },
  effect: { min: 0, max: 0.35, step: 0.01 },
  alpha: { min: 0.01, max: 0.1, step: 0.01 },
});

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'fixed', label: 'One final look', values: { looks: 1, maxPerArm: 1200, effect: 0.16, alpha: 0.05, designId: 'obrien-fleming' } },
  { id: 'peek', label: 'Aggressive peeking', values: { looks: 16, maxPerArm: 1200, effect: 0.16, alpha: 0.05, designId: 'pocock' } },
  { id: 'small', label: 'Small effect', values: { looks: 8, maxPerArm: 1600, effect: 0.08, alpha: 0.05, designId: 'obrien-fleming' } },
]);
