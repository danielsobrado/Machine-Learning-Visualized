function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const FINE_TUNING_RAG_CHUNKING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'fine-tuning',
  'rag-chunking-context',
]);

export const FINE_TUNING_RAG_CHUNKING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'fine-tuning-small-data-catastrophic-forgetting',
    'fine-tuning',
    ['ftune-019-overfit-risk', 'ftune-039-catastrophic-forgetting'],
    ['fine-tuning-small-data-forgetting-diagnosis'],
  ),
  competency(
    'fine-tuning-layer-specific-update-policy',
    'fine-tuning',
    ['ftune-035-objective-scope', 'ftune-036-learning-rate'],
    ['fine-tuning-layer-scope-learning-rate-choice'],
  ),
  competency(
    'fine-tuning-method-resource-choice',
    'fine-tuning',
    ['ftune-015-memory-budget', 'ftune-024-rank-tradeoff'],
    ['fine-tuning-full-vs-lora-qlora-choice'],
  ),
  competency(
    'fine-tuning-domain-shift-validation',
    'fine-tuning',
    ['ftune-040-eval-splits', 'ftune-047-monitoring-loss'],
    ['fine-tuning-domain-shift-validation'],
  ),
  competency(
    'fine-tuning-freeze-unfreeze-capacity',
    'fine-tuning',
    ['ftune-021-full-mechanism', 'ftune-023-lora-freeze'],
    ['fine-tuning-freeze-unfreeze-debugging'],
  ),
  competency(
    'rag-chunk-boundary-recall',
    'rag-chunking-context',
    ['ragchunk-009-boundary', 'ragchunk-023-boundary-recall'],
    ['rag-chunk-boundary-condition-recovery'],
  ),
  competency(
    'rag-chunk-duplicate-context-crowding',
    'rag-chunking-context',
    ['ragchunk-010-duplicate', 'ragchunk-032-dedup', 'ragchunk-043-mmr'],
    ['rag-chunk-duplicate-budget-crowding'],
  ),
  competency(
    'rag-chunk-multihop-evidence-coverage',
    'rag-chunking-context',
    ['ragchunk-039-evidence-coverage', 'ragchunk-045-multi-hop'],
    ['rag-chunk-multihop-packing'],
  ),
  competency(
    'rag-chunk-context-budget-reservation',
    'rag-chunking-context',
    ['ragchunk-007-budget', 'ragchunk-029-reserved-space'],
    ['rag-chunk-context-budget-calculation'],
  ),
  competency(
    'rag-chunk-retrieved-vs-packed-failure',
    'rag-chunking-context',
    ['ragchunk-041-packed-vs-retrieved', 'ragchunk-049-failure-location'],
    ['rag-chunk-retrieved-but-not-packed'],
  ),
]);
