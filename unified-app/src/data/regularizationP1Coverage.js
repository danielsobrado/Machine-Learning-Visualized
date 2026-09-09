function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'regularization',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const REGULARIZATION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'regularization',
]);

export const REGULARIZATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'regularization-strength-validation-selection',
    ['reg-010-validation-role'],
    ['regularization-validation-curve-worked'],
  ),
  competency(
    'regularization-broad-effective-capacity-controls',
    ['reg-050-mechanism-summary'],
    ['regularization-early-stopping-augmentation'],
  ),
  competency(
    'regularization-l1-l2-penalty-arithmetic',
    ['reg-011-l1-basic'],
    ['regularization-l1-l2-penalty-worked'],
  ),
  competency(
    'regularization-feature-scale-penalty-semantics',
    ['reg-047-standardization'],
    ['regularization-feature-scale-penalty-diagnosis'],
  ),
  competency(
    'regularization-decoupled-weight-decay',
    ['reg-027-decoupled-weight-decay'],
    ['regularization-adamw-decoupled-weight-decay'],
  ),
  competency(
    'regularization-correlated-feature-stability',
    ['reg-046-elastic-correlated'],
    ['regularization-correlated-l1-instability-decision'],
  ),
]);
