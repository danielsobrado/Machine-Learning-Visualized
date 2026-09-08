function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'efficient-llm-serving',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const EFFICIENT_LLM_SERVING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'efficient-llm-serving',
]);

export const EFFICIENT_LLM_SERVING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'serving-slo-goodput-operating-point',
    ['serve-008', 'serve-062'],
    ['serving-slo-batching-operating-point'],
  ),
  competency(
    'serving-prefill-decode-interference',
    ['serve-012', 'serve-054'],
    ['serve-prefill-decode-starvation-diagnosis'],
  ),
  competency(
    'serving-kv-capacity-accounting',
    ['serve-042', 'serve-060'],
    ['serve-kv-capacity-worked'],
  ),
  competency(
    'serving-paged-kv-fragmentation',
    ['serve-018', 'serve-055'],
    ['serve-paged-kv-fragmentation-diagnosis'],
  ),
  competency(
    'serving-prefix-cache-economics',
    ['serve-030', 'serve-064'],
    ['serve-prefix-cache-expected-prefill-worked'],
  ),
  competency(
    'serving-speculation-economics',
    ['serve-035', 'serve-074'],
    ['serve-speculation-break-even-worked'],
  ),
  competency(
    'serving-distributed-scaling-overhead',
    ['serve-046', 'serve-089'],
    ['serve-tensor-parallel-scaling-worked'],
  ),
]);
