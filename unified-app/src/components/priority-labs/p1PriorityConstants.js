export const P1_FOUNDATION_DEFAULTS = Object.freeze({
  'probability-distributions': Object.freeze({ residual: 2.5, scale: 1 }),
  'loss-functions-likelihoods': Object.freeze({ confidence: 0.82, smoothing: 0.1, classes: 4 }),
  'maximum-likelihood-estimation': Object.freeze({ successes: 7, trials: 10, alpha: 2, beta: 2 }),
  'gradient-descent': Object.freeze({ conditionNumber: 20, learningRate: 0.08, saddleX: 0.05, saddleY: 0.05 }),
});

export const P1_CAUSAL_DEFAULTS = Object.freeze({
  'causal-graphs-dags': Object.freeze({ conditionMediator: false, conditionCollider: false }),
  'treatment-effects': Object.freeze({ effect: 0.08, standardError: 0.025, subgroupCount: 8, alpha: 0.05 }),
  'propensity-scores': Object.freeze({ treatedMean: 0.72, controlMean: 0.43, pooledSd: 0.28, trimmedTreatedMean: 0.58, trimmedControlMean: 0.52, trimmedPooledSd: 0.27, extremeWeightShare: 0.16 }),
  'confounding-simpsons-paradox': Object.freeze({ lowShareTreated: 0.8, lowShareControl: 0.25, lowShareTarget: 0.5, lowControl: 0.2, lowTreated: 0.28, highControl: 0.7, highTreated: 0.76 }),
  'cuped-variance-reduction': Object.freeze({ rSquared: 0.36, postTreatmentCovariate: false }),
  'sequential-testing-peeking': Object.freeze({ alpha: 0.05, looks: 5 }),
});

export const P1_PRODUCTION_DEFAULTS = Object.freeze({
  'uncertainty-estimation': Object.freeze({ buckets: [
    { confidence: 0.55, accuracy: 0.5, share: 0.2 },
    { confidence: 0.68, accuracy: 0.62, share: 0.25 },
    { confidence: 0.8, accuracy: 0.74, share: 0.3 },
    { confidence: 0.92, accuracy: 0.84, share: 0.25 },
  ] }),
  'model-fairness': Object.freeze({ falsePositives: 18, falseNegatives: 7, fpCost: 1, fnCost: 6 }),
  'efficient-inference-compression-track': Object.freeze({ paramsBillions: 7, weightBits: 4, layers: 32, sequenceLength: 8192, kvHeads: 8, headDim: 128, batchSize: 1, cacheBytes: 2 }),
  'data-engineering-for-ml-track': Object.freeze({ categoryPositives: 3, categoryRows: 4, currentTarget: 1, featureTimestampOffsetHours: 3 }),
});

export const P1_SECURITY_CASES = Object.freeze([
  Object.freeze({
    id: 'prompt-injection',
    title: 'Retrieved prompt injection',
    attack: 'A retrieved document tells the model to ignore system policy and reveal hidden instructions.',
    weakDefense: 'Trust retrieved text as instructions.',
    strongDefense: 'Treat retrieval as untrusted data, delimit it, constrain tool permissions, and validate outputs.',
  }),
  Object.freeze({
    id: 'retrieval-poisoning',
    title: 'Retrieval poisoning',
    attack: 'An attacker inserts high-similarity content designed to dominate retrieval for a sensitive query.',
    weakDefense: 'Rank only by embedding similarity.',
    strongDefense: 'Use provenance, ingestion controls, source trust, anomaly checks, and post-retrieval filtering.',
  }),
]);

export const P1_DEBUGGING_REPLAY = Object.freeze([
  Object.freeze({ stage: 'Before', metric: 'Recall', value: '61%', detail: 'Failures cluster on low-light images.' }),
  Object.freeze({ stage: 'Intervention', metric: 'Change', value: 'Data slice', detail: 'Add targeted low-light examples and verify labels.' }),
  Object.freeze({ stage: 'After', metric: 'Recall', value: '78%', detail: 'Slice recall improves; global precision remains inside guardrail.' }),
]);

export const P1_MONITORING_HISTORY = Object.freeze([
  Object.freeze({ time: '09:00', state: 'Baseline', detail: 'Calibration and latency inside normal range.' }),
  Object.freeze({ time: '10:20', state: 'Incident', detail: 'Input drift rises after a partner schema change.' }),
  Object.freeze({ time: '10:35', state: 'Diagnosis', detail: 'Missing-value rate isolates the affected feature.' }),
  Object.freeze({ time: '11:05', state: 'Mitigation', detail: 'Fallback transformation restores compatibility.' }),
  Object.freeze({ time: '12:00', state: 'Recovery', detail: 'Drift and error metrics return to baseline.' }),
]);

export const P1_LAB_LESSON_IDS = Object.freeze(new Set([
  'probability-distributions',
  'loss-functions-likelihoods',
  'maximum-likelihood-estimation',
  'gradient-descent',
  'causal-graphs-dags',
  'treatment-effects',
  'propensity-scores',
  'confounding-simpsons-paradox',
  'cuped-variance-reduction',
  'sequential-testing-peeking',
  'recommender-systems-ranking-track',
  'model-debugging',
  'model-monitoring',
  'uncertainty-estimation',
  'model-fairness',
  'ml-security-robustness-track',
  'data-engineering-for-ml-track',
  'efficient-inference-compression-track',
]));
