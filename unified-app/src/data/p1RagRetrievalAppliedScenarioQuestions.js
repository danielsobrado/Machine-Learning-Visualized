export const P1_RAG_RETRIEVAL_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'rag-chunking-context': [
    {
      id: 'rag-chunk-overlap-cost-worked',
      level: 'calculation',
      relatedComparison: 'chunk-overlap-recall-vs-index-context-cost',
      scenario: 'A 1,800-token handbook is indexed with 600-token chunks and 200-token overlap. The stride is therefore 400 tokens, so full chunks start at token offsets 0, 400, 800, and 1,200. The team wants to quantify how much duplicate text this overlap creates before increasing it further.',
      prompt: 'How many token instances are indexed, and how much duplication is added beyond the 1,800-token source?',
      choices: [
        '1,800 token instances, so overlap adds no indexing or context redundancy',
        '2,400 token instances, so 600 duplicated token instances are added, equal to 33.3% overhead relative to the source',
        '3,000 token instances, so 1,200 duplicated token instances are added, equal to 66.7% overhead relative to the source',
      ],
      answerIndex: 1,
      explanation: 'Four full 600-token chunks contain 4 x 600 = 2,400 indexed token instances. The original source contains 1,800 unique token positions, so overlap creates 600 extra token instances. That is 600 / 1,800 = 33.3% redundancy before metadata, embeddings, or retrieval-time duplicate context are considered.',
      misconceptionTested: 'Chunk overlap improves boundary recall without increasing index size, duplicate retrieval, or downstream context consumption.',
    },
  ],
  'rag-vector-indexing': [
    {
      id: 'rag-ann-slo-operating-point',
      level: 'decision',
      relatedComparison: 'ann-recall-vs-retrieval-latency-slo',
      scenario: 'An ANN index is evaluated at three search-effort settings. Setting A gives Recall@20 = 0.88 at 32 ms P95. Setting B gives Recall@20 = 0.94 at 55 ms P95. Setting C gives Recall@20 = 0.965 at 104 ms P95. The product requires Recall@20 of at least 0.93 and retrieval P95 no higher than 70 ms.',
      prompt: 'Which setting is the strongest valid operating point under both requirements?',
      choices: [
        'Setting A, because the lowest latency should be selected even though recall misses the minimum target',
        'Setting C, because retrieval recall should always be maximized even when the latency SLO is violated',
        'Setting B, because it is the only option that satisfies both the minimum recall target and the P95 latency SLO',
      ],
      answerIndex: 2,
      explanation: 'Setting A violates the 0.93 recall floor, while Setting C violates the 70 ms P95 latency ceiling. Setting B meets both constraints at 0.94 recall and 55 ms P95. ANN tuning is an operating-point problem, not a single-metric maximization problem.',
      misconceptionTested: 'ANN quality should be tuned by maximizing recall or minimizing latency independently of the end-to-end product constraints.',
    },
  ],
  'rag-retrieval-evaluation': [
    {
      id: 'rag-mrr-worked',
      level: 'calculation',
      relatedComparison: 'mrr-first-relevant-rank-vs-binary-recall',
      scenario: 'A retriever is evaluated on three queries. The first relevant passage appears at rank 1 for query A, rank 2 for query B, and rank 5 for query C. Each query has at least one relevant passage, so binary retrieval success alone would report success for all three.',
      prompt: 'What is the Mean Reciprocal Rank across these three queries?',
      choices: [
        '0.90, because all three queries eventually retrieve relevant evidence',
        'About 0.57, because MRR = (1 + 1/2 + 1/5) / 3',
        'About 2.67, because MRR averages the raw ranks 1, 2, and 5',
      ],
      answerIndex: 1,
      explanation: 'The reciprocal ranks are 1, 0.5, and 0.2. Their mean is 1.7 / 3 = 0.5667, or about 0.57. MRR therefore distinguishes a retriever that consistently surfaces useful evidence early from one that merely finds it somewhere in the returned list.',
      misconceptionTested: 'If every query retrieves a relevant result somewhere, rank-sensitive retrieval metrics add no useful information beyond binary success.',
    },
  ],
});

export function getP1RagRetrievalAppliedScenariosForLesson(lessonId) {
  return P1_RAG_RETRIEVAL_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
