function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({ id, lessonId, scenarioIds: Object.freeze(scenarioIds) });
}

export const FRONTIER_SYSTEMS_AUDITED_LESSON_IDS = Object.freeze([
  'test-time-compute-thinking-budgets',
  'long-context-frontier-models',
  'omni-multimodal-architectures',
  'tool-using-reasoning-models',
  'agentic-coding-systems',
  'frontier-evaluation-safety',
]);

export const FRONTIER_SYSTEMS_COVERAGE = Object.freeze({
  'test-time-compute-thinking-budgets': requirement(['ttc-adaptive-budget-slo-worked']),
  'long-context-frontier-models': requirement(['long-context-effective-window-diagnosis']),
  'omni-multimodal-architectures': requirement(['omni-temporal-skew-worked']),
  'tool-using-reasoning-models': requirement(['tool-idempotency-timeout-design']),
  'agentic-coding-systems': requirement(['agent-git-bisect-worked']),
  'frontier-evaluation-safety': requirement(['frontier-release-evidence-decision']),
});

export const FRONTIER_SYSTEMS_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('adaptive-test-time-compute-budget-decision', 'test-time-compute-thinking-budgets', ['ttc-adaptive-budget-slo-worked']),
  depthRequirement('effective-long-context-diagnosis', 'long-context-frontier-models', ['long-context-effective-window-diagnosis']),
  depthRequirement('multimodal-temporal-alignment-calculation', 'omni-multimodal-architectures', ['omni-temporal-skew-worked']),
  depthRequirement('idempotent-tool-recovery-design', 'tool-using-reasoning-models', ['tool-idempotency-timeout-design']),
  depthRequirement('coding-agent-regression-localization-calculation', 'agentic-coding-systems', ['agent-git-bisect-worked']),
  depthRequirement('frontier-release-evidence-decision', 'frontier-evaluation-safety', ['frontier-release-evidence-decision']),
]);
