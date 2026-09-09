function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'tokenization',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TOKENIZATION_P1_AUDITED_LESSON_IDS = Object.freeze(['tokenization']);

export const TOKENIZATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'tokenization-language-context-budget',
    ['tok-034-token-count', 'tok-043-language-coverage'],
    ['tokenization-budget-worked'],
  ),
  competency(
    'tokenization-model-id-contract',
    ['tok-015-embedding-link', 'tok-040-id-stability'],
    ['tokenization-model-id-mapping-diagnosis'],
  ),
]);
