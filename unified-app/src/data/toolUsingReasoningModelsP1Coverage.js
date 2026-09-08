function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'tool-using-reasoning-models',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TOOL_USING_REASONING_MODELS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'tool-using-reasoning-models',
]);

export const TOOL_USING_REASONING_MODELS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'tool-routing-precision-recall',
    ['tool-012', 'tool-013'],
    ['tool-routing-precision-recall-worked'],
  ),
  competency(
    'tool-evidence-before-computation',
    ['tool-026', 'tool-069'],
    ['tool-evidence-before-computation-decision'],
  ),
  competency(
    'tool-observation-grounding',
    ['tool-016', 'tool-063'],
    ['tool-observation-grounding-diagnosis'],
  ),
  competency(
    'tool-indirect-injection-boundary',
    ['tool-017', 'tool-061'],
    ['tool-indirect-injection-boundary-diagnosis'],
  ),
  competency(
    'tool-side-effect-unknown-outcome',
    ['tool-043', 'tool-062'],
    ['tool-idempotency-timeout-design'],
  ),
  competency(
    'tool-loop-progress-budget',
    ['tool-041', 'tool-057'],
    ['tool-loop-progress-budget-diagnosis'],
  ),
  competency(
    'tool-observation-loss-masking',
    ['tool-034', 'tool-072'],
    ['tool-observation-loss-masking-worked'],
  ),
]);
