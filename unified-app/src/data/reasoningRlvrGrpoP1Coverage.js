function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'reasoning-rlvr-grpo',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const REASONING_RLVR_GRPO_P1_AUDITED_LESSON_IDS = Object.freeze([
  'reasoning-rlvr-grpo',
]);

export const REASONING_RLVR_GRPO_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rlvr-verifier-validity-generalization',
    ['rlvr-grpo-050', 'rlvr-grpo-062', 'rlvr-grpo-065'],
    ['rlvr-verifier-generalization-decision'],
  ),
  competency(
    'rlvr-grpo-group-normalized-advantage',
    ['rlvr-grpo-031', 'rlvr-grpo-032', 'rlvr-grpo-069'],
    ['rlvr-grpo-normalized-advantage-worked'],
  ),
  competency(
    'rlvr-all-negative-absolute-success',
    ['rlvr-grpo-019', 'rlvr-grpo-054', 'rlvr-grpo-055'],
    ['rlvr-all-negative-relative-trap-diagnosis'],
  ),
  competency(
    'rlvr-kl-stability-tradeoff',
    ['rlvr-grpo-041', 'rlvr-grpo-043', 'rlvr-grpo-068'],
    ['rlvr-kl-drift-health-decision'],
  ),
  competency(
    'rlvr-process-vs-outcome-credit',
    ['rlvr-grpo-011', 'rlvr-grpo-012', 'rlvr-grpo-058'],
    ['rlvr-orm-canceling-errors-diagnosis'],
  ),
  competency(
    'rlvr-rollout-diversity-contrast',
    ['rlvr-grpo-034', 'rlvr-grpo-037', 'rlvr-grpo-056'],
    ['rlvr-rollout-contrast-health-diagnosis'],
  ),
  competency(
    'rlvr-rejection-sampling-distillation-quality',
    ['rlvr-grpo-046', 'rlvr-grpo-047', 'rlvr-grpo-073'],
    ['rlvr-rejection-sampling-curation-decision'],
  ),
]);
