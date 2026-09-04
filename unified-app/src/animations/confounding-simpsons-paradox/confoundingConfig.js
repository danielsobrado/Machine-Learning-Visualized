export const DEFAULT_SCENARIO = Object.freeze({
  sampleSize: 4000,
  assignmentBias: 0.32,
  baselineGap: 0.38,
  withinLift: 0.08,
  highRiskShare: 0.5,
});

export const CONTROL_LIMITS = Object.freeze({
  sampleSize: { min: 400, max: 8000, step: 400 },
  assignmentBias: { min: 0, max: 0.4, step: 0.02 },
  baselineGap: { min: 0, max: 0.5, step: 0.02 },
  withinLift: { min: -0.15, max: 0.2, step: 0.01 },
});

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'reversal', label: 'Simpson reversal', values: { sampleSize: 4000, assignmentBias: 0.32, baselineGap: 0.38, withinLift: 0.08, highRiskShare: 0.5 } },
  { id: 'randomized', label: 'Randomized assignment', values: { sampleSize: 4000, assignmentBias: 0, baselineGap: 0.38, withinLift: 0.08, highRiskShare: 0.5 } },
  { id: 'no-gap', label: 'No confounder outcome gap', values: { sampleSize: 4000, assignmentBias: 0.32, baselineGap: 0, withinLift: 0.08, highRiskShare: 0.5 } },
  { id: 'harm', label: 'Harmful treatment', values: { sampleSize: 4000, assignmentBias: 0.32, baselineGap: 0.38, withinLift: -0.08, highRiskShare: 0.5 } },
]);
