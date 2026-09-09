function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'embeddings',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const EMBEDDINGS_P1_AUDITED_LESSON_IDS = Object.freeze(['embeddings']);

export const EMBEDDINGS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'embedding-anisotropy-diagnosis-and-ablation',
    ['emb-011-misconception', 'emb-064-neighbor-audit'],
    ['embedding-anisotropy', 'embedding-anisotropy-ablation-decision'],
  ),
]);
