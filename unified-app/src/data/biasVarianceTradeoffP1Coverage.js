function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'bias-variance-tradeoff',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const BIAS_VARIANCE_TRADEOFF_P1_AUDITED_LESSON_IDS = Object.freeze([
  'bias-variance-tradeoff',
]);

export const BIAS_VARIANCE_TRADEOFF_P1_REQUIREMENTS = Object.freeze([
  competency(
    'bias-variance-high-bias-remediation',
    ['bv-005-underfit-pattern'],
    ['bias-variance-high-bias-remedy-decision'],
  ),
  competency(
    'bias-variance-sample-sensitivity',
    ['bv-023-variance-term'],
    ['bias-variance-repeated-sample-variance-worked'],
  ),
  competency(
    'bias-variance-irreducible-noise',
    ['bv-004-noise-basic'],
    ['bias-variance-noisy-labels'],
  ),
  competency(
    'bias-variance-more-data-for-variance',
    ['bv-012-sample-size'],
    ['bias-variance-more-data'],
  ),
  competency(
    'bias-variance-learning-curve-diagnosis',
    ['bv-030-learning-curve'],
    ['bias-variance-learning-curve-worked'],
  ),
  competency(
    'bias-variance-regularization-tradeoff',
    ['bv-034-regularization-mechanism'],
    ['bias-variance-regularization-tradeoff'],
  ),
]);
