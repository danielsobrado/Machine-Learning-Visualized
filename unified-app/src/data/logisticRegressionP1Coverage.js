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
    'logreg-cost-sensitive-threshold',
    ['logreg-039-cost-threshold', 'logreg-040-imbalance'],
    ['logreg-cost-threshold-worked'],
  ),
  competency(
    'logreg-odds-probability-interpretation',
    ['logreg-029-log-odds', 'logreg-030-odds-ratio'],
    ['logreg-odds-to-probability-worked'],
  ),
  competency(
    'logreg-separation-regularization',
    ['logreg-035-separability', 'logreg-063-scenario-separable'],
    ['logreg-separation-regularization-diagnosis'],
  ),
  competency(
    'logreg-nonlinear-feature-representation',
    ['logreg-044-interactions', 'logreg-066-scenario-nonlinear'],
    ['logreg-nonlinear-interaction-design'],
  ),
  competency(
    'logreg-calibration-prior-shift',
    ['logreg-042-calibration', 'logreg-071-scenario-base-rate'],
    ['logreg-prior-shift-calibration-diagnosis'],
  ),
  competency(
    'logreg-stable-logits-loss',
    ['logreg-049-implementation', 'logreg-070-scenario-stable-loss'],
    ['logreg-stable-bce-logits-diagnosis'],
  ),
  competency(
    'logreg-multicollinearity-coefficient-stability',
    ['logreg-043-multicollinearity', 'logreg-065-scenario-correlated'],
    ['logreg-correlated-coefficient-instability-diagnosis'],
  ),
]);
