function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'knn-naive-bayes-svm',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const KNN_NAIVE_BAYES_SVM_P1_AUDITED_LESSON_IDS = Object.freeze([
  'knn-naive-bayes-svm',
]);

export const KNN_NAIVE_BAYES_SVM_P1_REQUIREMENTS = Object.freeze([
  competency(
    'classifier-family-feature-scaling',
    ['knnnbsvm-005-scale'],
    ['classifier-family-scaling'],
  ),
  competency(
    'classifier-family-class-imbalance',
    ['knnnbsvm-072-metric-choice'],
    ['classifier-family-imbalance'],
  ),
  competency(
    'classifier-family-model-serving-choice',
    ['knnnbsvm-018-choice-context'],
    ['classifier-family-model-choice'],
  ),
  competency(
    'classifier-knn-local-noise-brittleness',
    ['knnnbsvm-008-small-k'],
    ['classifier-boundary-brittleness'],
  ),
  competency(
    'classifier-family-latency-tradeoff',
    ['knnnbsvm-022-knn-prediction-cost'],
    ['classifier-family-latency-tradeoff-worked'],
  ),
  competency(
    'classifier-naive-bayes-correlated-evidence',
    ['knnnbsvm-034-nb-correlation'],
    ['classifier-naive-bayes-correlated-evidence-diagnosis'],
  ),
  competency(
    'classifier-svm-c-gamma-bias-variance',
    ['knnnbsvm-042-gamma'],
    ['classifier-svm-c-gamma-grid-diagnosis'],
  ),
]);
