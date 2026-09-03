export const AB_TEST_DEFAULTS = Object.freeze({
  baselinePct: 12,
  liftPct: 8,
  sampleSize: 12000,
  treatmentShare: 50,
  mdePct: 5,
  guardrailImpactPct: -1.5,
  guardrailThresholdPct: -2,
});

export const SIGNIFICANCE_ALPHA = 0.05;
export const CONFIDENCE_Z = 1.96;

export const OPTIONAL_STOPPING_SIMULATION = Object.freeze({
  looks: 12,
  simulations: 5000,
  seed: 20260903,
});
