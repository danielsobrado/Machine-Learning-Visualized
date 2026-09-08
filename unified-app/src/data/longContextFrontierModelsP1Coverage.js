function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'long-context-frontier-models',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const LONG_CONTEXT_FRONTIER_MODELS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'long-context-frontier-models',
]);

export const LONG_CONTEXT_FRONTIER_MODELS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'longctx-claimed-vs-effective-context',
    ['longctx-021', 'longctx-057'],
    ['long-context-effective-window-diagnosis'],
  ),
  competency(
    'longctx-kv-cache-serving-pressure',
    ['longctx-026', 'longctx-058'],
    ['longctx-kv-cache-memory-worked'],
  ),
  competency(
    'longctx-position-aware-packing',
    ['longctx-039', 'longctx-052'],
    ['longctx-lost-middle-repacking-diagnosis'],
  ),
  competency(
    'longctx-hybrid-retrieval-context-design',
    ['longctx-033', 'longctx-051'],
    ['longctx-hybrid-rag-recall-decision'],
  ),
  competency(
    'longctx-claim-level-grounding',
    ['longctx-038', 'longctx-062'],
    ['longctx-citation-grounding-diagnosis'],
  ),
  competency(
    'longctx-compressed-memory-exactness',
    ['longctx-042', 'longctx-054'],
    ['longctx-compressed-memory-loss-diagnosis'],
  ),
  competency(
    'longctx-freshness-cache-invalidation',
    ['longctx-043', 'longctx-060'],
    ['longctx-cache-freshness-design'],
  ),
]);
