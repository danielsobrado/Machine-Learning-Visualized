function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'kv-cache',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const KV_CACHE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'kv-cache',
]);

export const KV_CACHE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'kv-cache-footprint-arithmetic',
    ['kvc-025-memory-formula'],
    ['kv-cache-memory-worked'],
  ),
  competency(
    'kv-cache-serving-batch-capacity',
    ['kvc-017-serving-basic'],
    ['kv-cache-batch-capacity-worked'],
  ),
  competency(
    'kv-cache-bandwidth-tpot-bound',
    ['kvc-031-bandwidth'],
    ['kv-cache-bandwidth-tpot-worked'],
  ),
  competency(
    'kv-cache-paged-allocation-fragmentation',
    ['kvc-041-paged-cache'],
    ['kv-cache-paged-fragmentation-worked'],
  ),
  competency(
    'kv-cache-prefix-reuse-boundary',
    ['kvc-064-prefix-sharing'],
    ['kv-cache-prefix-reuse-boundary-design'],
  ),
  competency(
    'kv-cache-position-continuity',
    ['kvc-069-position-bug'],
    ['kv-cache-position-offset-diagnosis'],
  ),
  competency(
    'kv-cache-speculative-rollback',
    ['kvc-071-speculation'],
    ['kv-cache-speculative-rollback-worked'],
  ),
]);
