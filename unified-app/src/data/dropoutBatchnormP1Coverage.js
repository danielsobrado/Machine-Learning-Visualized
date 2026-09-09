function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'dropout-batchnorm',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DROPOUT_BATCHNORM_P1_AUDITED_LESSON_IDS = Object.freeze(['dropout-batchnorm']);

export const DROPOUT_BATCHNORM_P1_REQUIREMENTS = Object.freeze([
  competency(
    'dropout-batchnorm-evaluation-mode',
    ['dbn-043-train-eval-flag'],
    ['dropout-batchnorm-eval-mode-diagnosis'],
  ),
  competency(
    'batchnorm-small-batch-statistics',
    ['dbn-028-batch-size'],
    ['batchnorm-small-batch'],
  ),
  competency(
    'dropout-training-vs-inference',
    ['dbn-010-eval-dropout'],
    ['dropout-train-inference'],
  ),
  competency(
    'dropout-inverted-expectation-scaling',
    ['dbn-032-inverted-dropout'],
    ['dropout-inverted-expectation-worked'],
  ),
  competency(
    'dropout-batchnorm-ordering-statistics',
    ['dbn-048-dropout-after-bn'],
    ['dropout-batchnorm-order-diagnosis'],
  ),
]);
