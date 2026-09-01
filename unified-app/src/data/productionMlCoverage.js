function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({ id, lessonId, scenarioIds: Object.freeze(scenarioIds) });
}

export const PRODUCTION_ML_AUDITED_LESSON_IDS = Object.freeze([
  'efficient-inference-compression-track',
  'efficient-llm-serving',
  'model-debugging',
  'model-monitoring',
  'model-interpretability',
  'ml-security-robustness-track',
  'data-engineering-for-ml-track',
]);

export const PRODUCTION_ML_COVERAGE = Object.freeze({
  'efficient-inference-compression-track': requirement([
    'inference-total-memory-compression-worked',
    'inference-concurrency-capacity-worked',
  ]),
  'efficient-llm-serving': requirement([
    'serving-slo-batching-operating-point',
    'serving-littles-law-concurrency-worked',
  ]),
  'model-debugging': requirement([
    'debugging-online-offline-divergence',
    'debugging-shadow-transform-parity',
  ]),
  'model-monitoring': requirement([
    'monitoring-delayed-label-incident-triage',
    'monitoring-error-budget-burn-worked',
  ]),
  'model-interpretability': requirement([
    'interpretability-grouped-correlation-worked',
    'interpretability-background-shift-diagnosis',
  ]),
  'ml-security-robustness-track': requirement([
    'security-tool-authorization-boundary',
    'security-credential-scope-boundary',
  ]),
  'data-engineering-for-ml-track': requirement([
    'de-point-in-time-parity-worked',
    'de-transformation-version-parity',
  ]),
});

export const PRODUCTION_ML_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('total-serving-memory-compression-calculation', 'efficient-inference-compression-track', ['inference-total-memory-compression-worked']),
  depthRequirement('serving-concurrency-capacity-calculation', 'efficient-inference-compression-track', ['inference-concurrency-capacity-worked']),
  depthRequirement('serving-slo-operating-point-decision', 'efficient-llm-serving', ['serving-slo-batching-operating-point']),
  depthRequirement('serving-littles-law-concurrency-calculation', 'efficient-llm-serving', ['serving-littles-law-concurrency-worked']),
  depthRequirement('online-offline-divergence-diagnosis', 'model-debugging', ['debugging-online-offline-divergence']),
  depthRequirement('shadow-feature-transform-parity-diagnosis', 'model-debugging', ['debugging-shadow-transform-parity']),
  depthRequirement('delayed-label-monitoring-triage', 'model-monitoring', ['monitoring-delayed-label-incident-triage']),
  depthRequirement('monitoring-error-budget-burn-calculation', 'model-monitoring', ['monitoring-error-budget-burn-worked']),
  depthRequirement('correlated-feature-grouped-importance-diagnosis', 'model-interpretability', ['interpretability-grouped-correlation-worked']),
  depthRequirement('explanation-background-shift-diagnosis', 'model-interpretability', ['interpretability-background-shift-diagnosis']),
  depthRequirement('tool-authorization-boundary-design', 'ml-security-robustness-track', ['security-tool-authorization-boundary']),
  depthRequirement('credential-scope-capability-separation-design', 'ml-security-robustness-track', ['security-credential-scope-boundary']),
  depthRequirement('point-in-time-train-serve-parity-decision', 'data-engineering-for-ml-track', ['de-point-in-time-parity-worked']),
  depthRequirement('transformation-version-parity-diagnosis', 'data-engineering-for-ml-track', ['de-transformation-version-parity']),
]);
