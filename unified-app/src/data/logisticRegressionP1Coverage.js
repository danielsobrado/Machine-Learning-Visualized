function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'logistic-regression',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const LOGISTIC_REGRESSION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'logistic-regression',
]);

export const LOGISTIC_REGRESSION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'logreg-odds-ratio-to-probability',
    ['logreg-030-odds-ratio'],
    ['logreg-odds-to-probability-worked'],
  ),
  competency(
    'logreg-separation-regularization',
    ['logreg-035-separability'],
    ['logreg-separation-regularization-diagnosis'],
  ),
  competency(
    'logreg-nonlinear-feature-interaction',
    ['logreg-044-interactions'],
    ['logreg-nonlinear-interaction-design'],
  ),
  competency(
    'logreg-base-rate-shift-calibration',
    ['logreg-042-calibration'],
    ['logreg-prior-shift-calibration-diagnosis'],
  ),
  competency(
    'logreg-stable-bce-from-logits',
    ['logreg-049-implementation'],
    ['logreg-stable-bce-logits-diagnosis'],
  ),
  competency(
    'logreg-multicollinearity-coefficient-instability',
    ['logreg-043-multicollinearity'],
    ['logreg-correlated-coefficient-instability-diagnosis'],
  ),
  competency(
    'logreg-asymmetric-cost-threshold',
    ['logreg-039-cost-threshold'],
    ['logreg-cost-threshold-worked'],
  ),
  competency(
    'logreg-imbalance-resampling-calibration',
    ['logreg-040-imbalance'],
    ['logreg-oversampling-calibration-diagnosis'],
  ),
]);
