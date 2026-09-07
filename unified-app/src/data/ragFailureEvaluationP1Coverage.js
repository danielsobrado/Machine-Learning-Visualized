function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RAG_FAILURE_EVALUATION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'rag-failure-modes',
  'rag-retrieval-evaluation',
]);

export const RAG_FAILURE_EVALUATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rag-failure-stage-attribution',
    'rag-failure-modes',
    ['ragfail-035-candidate-audit', 'ragfail-037-packed-context'],
    ['rag-failure-stage-attribution-trace'],
  ),
  competency(
    'rag-failure-stale-conflict-resolution',
    'rag-failure-modes',
    ['ragfail-023-stale-mechanism', 'ragfail-024-conflict-mechanism', 'ragfail-039-conflict-resolution'],
    ['rag-failure-stale-conflict-resolution'],
  ),
  competency(
    'rag-failure-context-dilution',
    'rag-failure-modes',
    ['ragfail-026-topk-tradeoff', 'ragfail-028-strict-tradeoff'],
    ['rag-failure-context-dilution-operating-point'],
  ),
  competency(
    'rag-failure-slice-regression',
    'rag-failure-modes',
    ['ragfail-047-slice'],
    ['rag-failure-slice-regression'],
  ),
  competency(
    'rag-failure-grounded-abstention',
    'rag-failure-modes',
    ['ragfail-014-absence', 'ragfail-040-abstention'],
    ['rag-failure-abstain-without-valid-support'],
  ),
  competency(
    'rag-eval-recall-at-k',
    'rag-retrieval-evaluation',
    ['rageval-021-recall-formula', 'rageval-028-cutoff'],
    ['rag-eval-recall-at-k-multirelevant-worked'],
  ),
  competency(
    'rag-eval-mrr-first-relevant-rank',
    'rag-retrieval-evaluation',
    ['rageval-023-mrr-formula', 'rageval-024-mrr-focus'],
    ['rag-mrr-worked'],
  ),
  competency(
    'rag-eval-ndcg-graded-ordering',
    'rag-retrieval-evaluation',
    ['rageval-025-dcg', 'rageval-026-ndcg-normalization', 'rageval-027-binary-vs-graded'],
    ['rag-eval-ndcg-ordering-worked'],
  ),
  competency(
    'rag-eval-label-quality-freshness',
    'rag-retrieval-evaluation',
    ['rageval-040-label-quality', 'rageval-042-staleness'],
    ['rag-eval-label-quality-trap'],
  ),
  competency(
    'rag-eval-retrieval-vs-generation-boundary',
    'rag-retrieval-evaluation',
    ['rageval-036-packed-context', 'rageval-046-candidate-vs-answer'],
    ['rag-eval-retrieval-vs-generation-boundary'],
  ),
  competency(
    'rag-eval-representative-slice-gates',
    'rag-retrieval-evaluation',
    ['rageval-038-query-set', 'rageval-039-slices'],
    ['rag-eval-slice-gate-design'],
  ),
]);
