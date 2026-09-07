function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DEEP_LEARNING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'neural-network',
]);

export const DEEP_LEARNING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'fundamentals-xor-nonlinearity',
    'neural-network',
    ['nn-051-xor-case', 'nn-053-no-activation-case'],
    ['nn-fundamentals-xor-nonlinearity'],
  ),
  competency(
    'fundamentals-tensor-shapes',
    'neural-network',
    ['nn-022-shapes', 'nn-052-shape-error-case'],
    ['nn-fundamentals-tensor-shape-worked'],
  ),
  competency(
    'fundamentals-parameter-counting',
    'neural-network',
    ['nn-013-parameters'],
    ['nn-fundamentals-parameter-count-worked'],
  ),
  competency(
    'fundamentals-forward-pass-reasoning',
    'neural-network',
    ['nn-021-dense-equation', 'nn-064-learning-case'],
    ['nn-fundamentals-forward-pass-worked'],
  ),
]);
