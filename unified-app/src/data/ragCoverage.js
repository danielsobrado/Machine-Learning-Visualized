function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({ id, lessonId, scenarioIds: Object.freeze(scenarioIds) });
}

export const RAG_AUDITED_LESSON_IDS = Object.freeze([
  'rag-chunking-context',
  'rag-vector-indexing',
  'rag-reranking-grounding',
  'rag-retrieval-evaluation',
  'rag-failure-modes',
]);

export const RAG_COVERAGE = Object.freeze({
  'rag-chunking-context': requirement(['rag-chunk-overlap-cost-worked']),
  'rag-vector-indexing': requirement(['rag-ann-slo-operating-point']),
  'rag-reranking-grounding': requirement(['rag-reranker-pipeline-ceiling-worked']),
  'rag-retrieval-evaluation': requirement(['rag-mrr-worked']),
  'rag-failure-modes': requirement(['rag-failure-attribution-ledger']),
});

export const RAG_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('chunk-overlap-redundancy-calculation', 'rag-chunking-context', ['rag-chunk-overlap-cost-worked']),
  depthRequirement('ann-recall-latency-operating-point-decision', 'rag-vector-indexing', ['rag-ann-slo-operating-point']),
  depthRequirement('reranker-pipeline-quality-ceiling-calculation', 'rag-reranking-grounding', ['rag-reranker-pipeline-ceiling-worked']),
  depthRequirement('mrr-first-relevant-rank-calculation', 'rag-retrieval-evaluation', ['rag-mrr-worked']),
  depthRequirement('rag-pipeline-failure-attribution-diagnosis', 'rag-failure-modes', ['rag-failure-attribution-ledger']),
]);
