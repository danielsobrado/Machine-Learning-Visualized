function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'classification-metrics',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CLASSIFICATION_METRICS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'classification-metrics',
]);

export const CLASSIFICATION_METRICS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'metrics-subgroup-recall-gap',
    ['clfmet-044-slice-metrics'],
    ['metrics-subgroup-tpr-worked'],
  ),
  competency(
    'metrics-asymmetric-error-costs',
    ['clfmet-018-costs'],
    ['metrics-cost-weighted-errors-worked'],
  ),
  competency(
    'metrics-imbalanced-accuracy-failure',
    ['clfmet-017-imbalance'],
    ['metrics-imbalanced-accuracy-worked'],
  ),
  competency(
    'metrics-macro-average-minority-failure',
    ['clfmet-042-macro-average'],
    ['metrics-macro-recall-minority-worked'],
  ),
  competency(
    'metrics-hard-label-vs-probability-quality',
    ['clfmet-046-score-vs-label'],
    ['metrics-hard-label-vs-calibration-decision'],
  ),
  competency(
    'metrics-final-test-threshold-leakage',
    ['clfmet-048-leakage'],
    ['metrics-test-threshold-selection-leakage'],
  ),
  competency(
    'metrics-small-slice-uncertainty',
    ['clfmet-049-reporting'],
    ['metrics-small-slice-uncertainty-decision'],
  ),
]);
