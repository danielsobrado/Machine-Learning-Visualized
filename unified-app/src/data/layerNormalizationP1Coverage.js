function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'layer-normalization',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const LAYER_NORMALIZATION_P1_AUDITED_LESSON_IDS = Object.freeze(['layer-normalization']);

export const LAYER_NORMALIZATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'layernorm-within-token-arithmetic',
    ['ln-002-axis', 'ln-021-formula-order'],
    ['layernorm-token-axis-worked'],
  ),
  competency(
    'layernorm-batch-independence-vs-batchnorm',
    ['ln-011-batch-independent', 'ln-012-batchnorm-difference'],
    ['layernorm-vs-batchnorm'],
  ),
]);
