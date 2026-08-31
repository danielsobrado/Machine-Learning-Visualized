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
  'efficient-inference-compression-track': requirement(['inference-total-memory-compression-worked']),
  'efficient-llm-serving': requirement(['serving-slo-batching-operating-point']),
  'model-debugging': requirement(['debugging-online-offline-divergence']),
  'model-monitoring': requirement(['monitoring-delayed-label-incident-triage']),
  'model-interpretability': requirement(['interpretability-grouped-correlation-worked']),
  'ml-security-robustness-track': requirement(['security-tool-authorization-boundary']),
  'data-engineering-for-ml-track': requirement(['de-point-in-time-parity-worked']),
});

export const PRODUCTION_ML_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('total-serving-memory-compression-calculation', 'efficient-inference-compression-track', ['inference-total-memory-compression-worked']),
  depthRequirement('serving-slo-operating-point-decision', 'efficient-llm-serving', ['serving-slo-batching-operating-point']),
  depthRequirement('online-offline-divergence-diagnosis', 'model-debugging', ['debugging-online-offline-divergence']),
  depthRequirement('delayed-label-monitoring-triage', 'model-monitoring', ['monitoring-delayed-label-incident-triage']),
  depthRequirement('correlated-feature-grouped-importance-diagnosis', 'model-interpretability', ['interpretability-grouped-correlation-worked']),
  depthRequirement('tool-authorization-boundary-design', 'ml-security-robustness-track', ['security-tool-authorization-boundary']),
  depthRequirement('point-in-time-train-serve-parity-decision', 'data-engineering-for-ml-track', ['de-point-in-time-parity-worked']),
]);
