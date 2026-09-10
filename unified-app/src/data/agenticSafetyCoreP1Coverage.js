function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const AGENTIC_SAFETY_CORE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'tool-using-reasoning-models',
  'agentic-coding-systems',
  'frontier-evaluation-safety',
]);

export const AGENTIC_SAFETY_CORE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'tool-routing-evidence-computation-grounding',
    'tool-using-reasoning-models',
    ['tool-012', 'tool-013', 'tool-025', 'tool-026', 'tool-027', 'tool-048'],
    ['tool-routing-precision-recall-worked', 'tool-evidence-before-computation-decision', 'tool-observation-grounding-diagnosis'],
  ),
  competency(
    'tool-injection-loop-side-effect-training-boundary',
    'tool-using-reasoning-models',
    ['tool-017', 'tool-019', 'tool-034', 'tool-035', 'tool-041', 'tool-042', 'tool-043', 'tool-044'],
    ['tool-indirect-injection-boundary-diagnosis', 'tool-loop-progress-budget-diagnosis', 'tool-observation-loss-masking-worked', 'tool-idempotency-timeout-design'],
  ),
  competency(
    'agent-target-fix-regression-scope-evidence',
    'agentic-coding-systems',
    ['agentcode-005', 'agentcode-006', 'agentcode-030', 'agentcode-032', 'agentcode-047'],
    ['agent-target-regression-evidence-decision', 'agent-diff-scope-audit-diagnosis', 'agent-test-gaming-hidden-behavior-diagnosis'],
  ),
  competency(
    'agent-recovery-approval-verification-reporting',
    'agentic-coding-systems',
    ['agentcode-034', 'agentcode-035', 'agentcode-036', 'agentcode-045', 'agentcode-046'],
    ['agent-checkpoint-rollback-decision', 'agent-side-effect-approval-boundary-decision', 'agent-verification-reporting-diagnosis'],
  ),
  competency(
    'frontier-safe-success-guardrail-reliability-metrics',
    'frontier-evaluation-safety',
    ['frontier-006', 'frontier-009', 'frontier-010', 'frontier-025', 'frontier-047'],
    ['frontier-safe-success-accounting-worked', 'frontier-guardrail-precision-recall-worked', 'frontier-repeated-trial-reliability-worked'],
  ),
  competency(
    'frontier-action-evidence-oversight-release-gating',
    'frontier-evaluation-safety',
    ['frontier-031', 'frontier-037', 'frontier-038', 'frontier-041', 'frontier-042', 'frontier-045', 'frontier-046'],
    ['frontier-injection-action-log-diagnosis', 'frontier-oversight-randomization-diagnosis', 'frontier-staged-rollout-rare-risk-decision', 'frontier-release-evidence-decision'],
  ),
]);
