function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RAG_INDEX_GROUNDING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'rag-vector-indexing',
  'rag-reranking-grounding',
]);

export const RAG_INDEX_GROUNDING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rag-index-exact-vs-ann-operating-point',
    'rag-vector-indexing',
    ['ragindex-002-exact', 'ragindex-003-ann', 'ragindex-018-benchmark'],
    ['rag-ann-slo-operating-point'],
  ),
  competency(
    'rag-index-ann-breadth-recall',
    'rag-vector-indexing',
    ['ragindex-006-breadth', 'ragindex-027-hnsw-ef', 'ragindex-042-recall-latency-curve'],
    ['rag-index-ann-breadth-recall-debugging'],
  ),
  competency(
    'rag-index-distance-normalization-contract',
    'rag-vector-indexing',
    ['ragindex-036-normalization', 'ragindex-037-distance'],
    ['rag-index-distance-metric-mismatch'],
  ),
  competency(
    'rag-index-filtered-search-recall',
    'rag-vector-indexing',
    ['ragindex-034-filtering', 'ragindex-048-security-filter'],
    ['rag-index-postfilter-starvation'],
  ),
  competency(
    'rag-index-freshness-maintenance',
    'rag-vector-indexing',
    ['ragindex-033-updates', 'ragindex-046-corpus-drift', 'ragindex-047-monitoring'],
    ['rag-index-stale-entry-maintenance'],
  ),
  competency(
    'rag-reranker-pipeline-ceiling',
    'rag-reranking-grounding',
    ['ragrank-024-candidate-size', 'ragrank-025-topk-cutoff'],
    ['rag-reranker-pipeline-ceiling-worked'],
  ),
  competency(
    'rag-reranker-candidate-recall-limit',
    'rag-reranking-grounding',
    ['ragrank-004-first-pass', 'ragrank-005-limit'],
    ['rag-reranker-missing-evidence-limit'],
  ),
  competency(
    'rag-grounding-claim-level-support',
    'rag-reranking-grounding',
    ['ragrank-013-claim-level', 'ragrank-036-citation-span', 'ragrank-040-evidence-type'],
    ['rag-grounding-claim-level-support'],
  ),
  competency(
    'rag-grounding-conflict-recency',
    'rag-reranking-grounding',
    ['ragrank-029-stale-check', 'ragrank-030-conflict-check', 'ragrank-038-recency'],
    ['rag-grounding-conflict-recency-resolution'],
  ),
  competency(
    'rag-grounding-abstention',
    'rag-reranking-grounding',
    ['ragrank-031-abstain', 'ragrank-042-absence'],
    ['rag-grounding-abstention-no-support'],
  ),
  competency(
    'rag-grounding-strictness-risk-tradeoff',
    'rag-reranking-grounding',
    ['ragrank-032-strictness-precision', 'ragrank-033-strictness-recall', 'ragrank-046-calibration'],
    ['rag-grounding-strictness-tradeoff'],
  ),
]);
