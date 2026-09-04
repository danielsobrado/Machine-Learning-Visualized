export const DEFAULT_SCENARIO = Object.freeze({
  populationSize: 1000,
  responsiveShare: 35,
  highEffect: 18,
  lowEffect: -4,
  baselineGap: 10,
  treatmentShare: 50,
  assignmentSeed: 17,
});

export const CONTROL_LIMITS = Object.freeze({
  populationSize: { min: 200, max: 2400, step: 100 },
  responsiveShare: { min: 10, max: 90, step: 5 },
  highEffect: { min: -10, max: 30, step: 1 },
  lowEffect: { min: -20, max: 20, step: 1 },
  baselineGap: { min: -15, max: 20, step: 1 },
});

export const SCENARIO_PRESETS = Object.freeze([
  { id: 'hidden-harm', label: 'Average hides harm', values: { responsiveShare: 35, highEffect: 18, lowEffect: -4, baselineGap: 10 } },
  { id: 'homogeneous', label: 'Homogeneous effect', values: { responsiveShare: 50, highEffect: 8, lowEffect: 8, baselineGap: 0 } },
  { id: 'small-segment', label: 'Small responder segment', values: { responsiveShare: 20, highEffect: 24, lowEffect: -2, baselineGap: 12 } },
]);
