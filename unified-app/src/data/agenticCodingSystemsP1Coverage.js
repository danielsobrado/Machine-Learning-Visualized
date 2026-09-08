function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'agentic-coding-systems',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const AGENTIC_CODING_SYSTEMS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'agentic-coding-systems',
]);

export const AGENTIC_CODING_SYSTEMS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'agent-regression-localization-and-reproduction',
    ['agentcode-021', 'agentcode-027'],
    ['agent-git-bisect-worked'],
  ),
  competency(
    'agent-fail-pass-regression-preservation',
    ['agentcode-005', 'agentcode-030'],
    ['agent-target-regression-evidence-decision'],
  ),
  competency(
    'agent-diff-scope-minimality',
    ['agentcode-032', 'agentcode-047'],
    ['agent-diff-scope-audit-diagnosis'],
  ),
  competency(
    'agent-test-gaming-generalization',
    ['agentcode-013', 'agentcode-073'],
    ['agent-test-gaming-hidden-behavior-diagnosis'],
  ),
  competency(
    'agent-checkpoint-rollback',
    ['agentcode-034', 'agentcode-063'],
    ['agent-checkpoint-rollback-decision'],
  ),
  competency(
    'agent-side-effect-approval-boundaries',
    ['agentcode-036', 'agentcode-071'],
    ['agent-side-effect-approval-boundary-decision'],
  ),
  competency(
    'agent-verification-evidence-honesty',
    ['agentcode-045', 'agentcode-067'],
    ['agent-verification-reporting-diagnosis'],
  ),
]);
