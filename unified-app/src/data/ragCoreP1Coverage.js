function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RAG_CORE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'rag-chunking-context',
  'rag-vector-indexing',
  'rag-reranking-grounding',
  'rag-failure-modes',
  'rag-retrieval-evaluation',
]);

export const RAG_CORE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rag-chunking-boundary-structure',
    'rag-chunking-context',
    ['ragchunk-023-boundary-recall', 'ragchunk-048-eval-loop'],
    ['rag-chunk-semantic-vs-fixed', 'rag-chunk-boundary-condition-recovery'],
  ),
  competency(
    'rag-overlap-context-cost',
    'rag-chunking-context',
    ['ragchunk-024-overlap-cost', 'ragchunk-032-dedup'],
    ['rag-overlap-duplication', 'rag-chunk-overlap-cost-worked'],
  ),
  competency(
    'rag-ann-recall-latency-operating-point',
    'rag-vector-indexing',
    ['ragindex-039-exact-baseline', 'ragindex-042-recall-latency-curve'],
    ['rag-index-recall-latency', 'rag-ann-slo-operating-point'],
  ),
  competency(
    'rag-reranker-candidate-recall-budget',
    'rag-reranking-grounding',
    ['ragrank-024-candidate-size', 'ragrank-026-missing-limit'],
    ['rag-cross-encoder-budget', 'rag-reranker-pipeline-ceiling-worked'],
  ),
  competency(
    'rag-claim-grounding-temporal-conflict',
    'rag-reranking-grounding',
    ['ragrank-034-rank-vs-ground', 'ragrank-038-recency'],
    ['rag-grounding-claim-level-support', 'rag-grounding-conflict-recency-resolution'],
  ),
  competency(
    'rag-grounded-abstention-no-support',
    'rag-failure-modes',
    ['ragfail-014-absence', 'ragfail-040-abstention'],
    ['rag-failure-abstain-without-valid-support'],
  ),
  competency(
    'rag-first-broken-stage-attribution',
    'rag-failure-modes',
    ['ragfail-035-candidate-audit', 'ragfail-037-packed-context'],
    ['rag-failure-stage-attribution-trace', 'rag-failure-attribution-ledger'],
  ),
  competency(
    'rag-retrieval-metric-semantics',
    'rag-retrieval-evaluation',
    ['rageval-021-recall-formula', 'rageval-026-ndcg-normalization'],
    ['rag-eval-recall-at-k-multirelevant-worked', 'rag-eval-ndcg-ordering-worked'],
  ),
]);
