export const SIMULATION_RUNS = 4000;
export const BASE_SEED = 271828;

export const DEFAULT_SCENARIO = Object.freeze({
  looks: 8,
  maxPerArm: 1200,
  effect: 0.16,
  alpha: 0.05,
});

export const CONTROL_LIMITS = Object.freeze({
  looks: { min: 1, max: 20, step: 1 },
  maxPerArm: { min: 200, max: 2400, step: 100 },
  effect: { min: 0, max: 0.35, step: 0.01 },
  alpha: { min: 0.01, max: 0.1, step: 0.01 },
});

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'fixed', label: 'One final look', values: { looks: 1, maxPerArm: 1200, effect: 0.16, alpha: 0.05 } },
  { id: 'peek', label: 'Aggressive peeking', values: { looks: 16, maxPerArm: 1200, effect: 0.16, alpha: 0.05 } },
  { id: 'small', label: 'Small effect', values: { looks: 8, maxPerArm: 1600, effect: 0.08, alpha: 0.05 } },
]);
