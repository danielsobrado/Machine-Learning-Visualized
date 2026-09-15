export const PRODUCTION_RELIABILITY_NEXT_LESSON_IDS = Object.freeze(new Set([
  'model-debugging',
  'model-monitoring',
  'uncertainty-estimation',
  'model-fairness',
]));

export const DEBUGGING_NEXT_DEFAULTS = Object.freeze({
  baseline: Object.freeze({
    lowLightRecall: 0.61,
    daytimeRecall: 0.86,
    globalPrecision: 0.90,
  }),
  targetMetric: 'lowLightRecall',
  guardrailMetric: 'globalPrecision',
  collateralMetric: 'daytimeRecall',
  minTargetGain: 0.12,
  maxGuardrailDrop: 0.03,
  maxCollateralDrop: 0.03,
  hypotheses: Object.freeze([
    Object.freeze({
      id: 'targeted-data',
      title: 'Low-light data gap',
      intervention: 'Add verified low-light examples and retrain.',
      metrics: Object.freeze({ lowLightRecall: 0.79, daytimeRecall: 0.85, globalPrecision: 0.89 }),
    }),
    Object.freeze({
      id: 'lower-threshold',
      title: 'Decision threshold too strict',
      intervention: 'Lower the global decision threshold.',
      metrics: Object.freeze({ lowLightRecall: 0.76, daytimeRecall: 0.82, globalPrecision: 0.80 }),
    }),
  ]),
});

export const MONITORING_NEXT_DEFAULTS = Object.freeze({
  dedupeWindowMinutes: 15,
  alerts: Object.freeze([
    Object.freeze({ minute: 0, fingerprint: 'partner-schema-drift', title: 'Partner schema drift' }),
    Object.freeze({ minute: 3, fingerprint: 'partner-schema-drift', title: 'Partner schema drift' }),
    Object.freeze({ minute: 8, fingerprint: 'partner-schema-drift', title: 'Partner schema drift' }),
    Object.freeze({ minute: 12, fingerprint: 'latency-slo', title: 'Latency SLO burn' }),
  ]),
  decision: Object.freeze({
    blastRadius: 0.70,
    rollbackAvailable: true,
    rollbackRisk: 0.15,
    forwardFixConfidence: 0.60,
    dataIntegrityRisk: 0.55,
  }),
});

export const UNCERTAINTY_NEXT_DEFAULTS = Object.freeze({
  rows: Object.freeze([
    Object.freeze({ logits: Object.freeze([3.0, 0.0]), label: 0 }),
    Object.freeze({ logits: Object.freeze([2.5, 0.0]), label: 0 }),
    Object.freeze({ logits: Object.freeze([2.0, 0.0]), label: 1 }),
    Object.freeze({ logits: Object.freeze([1.8, 0.0]), label: 0 }),
    Object.freeze({ logits: Object.freeze([1.5, 0.0]), label: 1 }),
    Object.freeze({ logits: Object.freeze([-2.0, 0.0]), label: 1 }),
  ]),
  candidateTemperatures: Object.freeze([0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4]),
});

export const FAIRNESS_NEXT_DEFAULTS = Object.freeze({
  candidateThresholds: Object.freeze([0.4, 0.5, 0.6, 0.7]),
  thresholdA: 0.5,
  thresholdB: 0.6,
  rowsByGroup: Object.freeze({
    A: Object.freeze([
      Object.freeze({ score: 0.85, label: 1 }),
      Object.freeze({ score: 0.75, label: 0 }),
      Object.freeze({ score: 0.65, label: 1 }),
      Object.freeze({ score: 0.55, label: 1 }),
      Object.freeze({ score: 0.45, label: 0 }),
      Object.freeze({ score: 0.35, label: 1 }),
      Object.freeze({ score: 0.25, label: 1 }),
      Object.freeze({ score: 0.15, label: 0 }),
    ]),
    B: Object.freeze([
      Object.freeze({ score: 0.85, label: 0 }),
      Object.freeze({ score: 0.75, label: 1 }),
      Object.freeze({ score: 0.65, label: 1 }),
      Object.freeze({ score: 0.55, label: 0 }),
      Object.freeze({ score: 0.45, label: 0 }),
      Object.freeze({ score: 0.35, label: 0 }),
      Object.freeze({ score: 0.25, label: 0 }),
      Object.freeze({ score: 0.15, label: 0 }),
    ]),
  }),
});
