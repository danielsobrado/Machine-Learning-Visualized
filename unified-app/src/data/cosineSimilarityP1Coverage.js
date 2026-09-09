function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'cosine-similarity',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const COSINE_SIMILARITY_P1_AUDITED_LESSON_IDS = Object.freeze(['cosine-similarity']);

export const COSINE_SIMILARITY_P1_REQUIREMENTS = Object.freeze([
  competency(
    'cosine-directional-ranking-arithmetic',
    ['cos-021-formula', 'cos-025-positive-scaling'],
    ['cosine-ranking-worked'],
  ),
  competency(
    'cosine-score-is-not-relevance-proof',
    ['cos-012-not-proof', 'cos-020-foundation-check'],
    ['cosine-relevance-audit'],
  ),
]);
