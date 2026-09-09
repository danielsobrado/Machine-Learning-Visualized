function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'gradient-problems',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const GRADIENT_PROBLEMS_P1_AUDITED_LESSON_IDS = Object.freeze(['gradient-problems']);

export const GRADIENT_PROBLEMS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'gradient-vanishing-exploding-differential',
    ['grp-003-vanishing', 'grp-004-exploding', 'grp-011-dead-relu'],
    ['gradient-problem-differential-diagnosis'],
  ),
  competency(
    'gradient-depth-chain-product',
    ['grp-006-depth', 'grp-021-product-math'],
    ['gradient-depth-product-worked'],
  ),
  competency(
    'gradient-clipping-guardrail-limit',
    ['grp-016-clipping-basic', 'grp-017-clipping-limit', 'grp-036-clipping-by-norm'],
    ['gradient-clipping-norm-worked'],
  ),
  competency(
    'gradient-initialization-normalization-stabilization',
    ['grp-014-initialization', 'grp-032-initialization-design', 'grp-033-normalization'],
    ['gradient-scale-root-cause-stabilization'],
  ),
]);
