export const P1_SYSTEMS_NEXT_LESSON_IDS = Object.freeze(new Set([
  'recommender-systems-ranking-track',
  'ml-security-robustness-track',
  'data-engineering-for-ml-track',
  'efficient-inference-compression-track',
]));

export const RECOMMENDER_SYSTEMS_NEXT_DEFAULTS = Object.freeze({
  positiveItem: Object.freeze({ id: 'positive', score: 0.78, interactionCount: 3 }),
  negatives: Object.freeze([
    Object.freeze({ id: 'n1', score: 0.94 }),
    Object.freeze({ id: 'n2', score: 0.88 }),
    Object.freeze({ id: 'n3', score: 0.81 }),
    Object.freeze({ id: 'n4', score: 0.74 }),
    Object.freeze({ id: 'n5', score: 0.65 }),
    Object.freeze({ id: 'n6', score: 0.55 }),
    Object.freeze({ id: 'n7', score: 0.45 }),
    Object.freeze({ id: 'n8', score: 0.30 }),
    Object.freeze({ id: 'n9', score: 0.20 }),
    Object.freeze({ id: 'n10', score: 0.10 }),
  ]),
  sampledNegativeCount: 3,
  implicitAlpha: 4,
  observations: Object.freeze([
    Object.freeze({ id: 'clicked', preference: 1, interactionCount: 3, prediction: 0.70 }),
    Object.freeze({ id: 'unobserved-a', preference: 0, interactionCount: 0, prediction: 0.40 }),
    Object.freeze({ id: 'unobserved-b', preference: 0, interactionCount: 0, prediction: 0.20 }),
  ]),
});

export const SECURITY_SYSTEMS_NEXT_DEFAULTS = Object.freeze({
  attack: Object.freeze({ poisonedContent: true, requestsTool: true, requestsSecret: true }),
  presets: Object.freeze({
    weak: Object.freeze({
      provenanceCheck: false,
      sourceTrustFilter: false,
      leastPrivilege: false,
      outputValidation: false,
    }),
    authorizationOnly: Object.freeze({
      provenanceCheck: false,
      sourceTrustFilter: false,
      leastPrivilege: true,
      outputValidation: false,
    }),
    defenseInDepth: Object.freeze({
      provenanceCheck: true,
      sourceTrustFilter: true,
      leastPrivilege: true,
      outputValidation: true,
    }),
  }),
});

export const DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS = Object.freeze({
  entityId: 'customer-42',
  predictionTime: 8,
  latestAsOf: 14,
  featureWindowHours: 5,
  dimensionVersions: Object.freeze([
    Object.freeze({ effectiveStart: 0, effectiveEnd: 10, segment: 'SMB' }),
    Object.freeze({ effectiveStart: 10, effectiveEnd: Infinity, segment: 'Enterprise' }),
  ]),
  events: Object.freeze([
    Object.freeze({ id: 'e1', eventTime: 6, arrivalTime: 6 }),
    Object.freeze({ id: 'e2', eventTime: 9, arrivalTime: 15 }),
    Object.freeze({ id: 'e3', eventTime: 12, arrivalTime: 12 }),
  ]),
});

export const INFERENCE_SYSTEMS_NEXT_DEFAULTS = Object.freeze({
  paramsBillions: 7,
  weightBits: 4,
  layers: 32,
  kvHeads: 8,
  headDim: 128,
  cacheBytes: 2,
  sequenceLengths: Object.freeze([8192, 4100, 2050, 1025]),
  pageTokens: 512,
  activationGiB: 2.4,
  runtimeReserveGiB: 1.8,
});
