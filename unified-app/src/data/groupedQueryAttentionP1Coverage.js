function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'grouped-query-attention',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const GROUPED_QUERY_ATTENTION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'grouped-query-attention',
]);

export const GROUPED_QUERY_ATTENTION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'gqa-kv-cache-width-reduction',
    ['gqa-031-cache-ratio', 'gqa-063-memory-estimate'],
    ['gqa-kv-cache-reduction-worked'],
  ),
  competency(
    'gqa-mha-gqa-mqa-operating-point',
    ['gqa-006-middle-ground', 'gqa-066-capacity-choice'],
    ['gqa-cache-quality-tradeoff'],
  ),
  competency(
    'gqa-query-to-kv-group-mapping',
    ['gqa-023-head-index-map', 'gqa-060-wrong-broadcast'],
    ['gqa-group-mapping-broadcast-diagnosis'],
  ),
  competency(
    'gqa-serving-concurrency-capacity',
    ['gqa-044-batch-scaling', 'gqa-052-high-batch'],
    ['gqa-serving-capacity-worked'],
  ),
  competency(
    'gqa-decode-bandwidth-economics',
    ['gqa-032-bandwidth-ratio', 'gqa-065-latency-metric'],
    ['gqa-bandwidth-reduction-worked'],
  ),
  competency(
    'gqa-checkpoint-conversion-adaptation',
    ['gqa-039-conversion-intuition', 'gqa-040-uptraining'],
    ['gqa-checkpoint-conversion-decision'],
  ),
  competency(
    'gqa-aggressive-sharing-quality-risk',
    ['gqa-037-quality-capacity', 'gqa-064-quality-eval'],
    ['gqa-aggressive-sharing-quality-diagnosis'],
  ),
]);
