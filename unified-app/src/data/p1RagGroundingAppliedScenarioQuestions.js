export const P1_RAG_GROUNDING_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'rag-reranking-grounding': [
    {
      id: 'rag-reranker-pipeline-ceiling-worked',
      level: 'calculation',
      relatedComparison: 'retrieval-recall-vs-reranker-retention-vs-grounded-generation',
      scenario: 'On a benchmark, the initial retriever includes the gold passage somewhere in its top 50 for 94% of queries. After reranking to top 5, the gold passage remains for only 80% of all queries. When the gold passage is present in the final top 5, the generator answers correctly 90% of the time.',
      prompt: 'With the current reranker and generator, what approximate end-to-end correctness ceiling follows from these measured stages?',
      choices: [
        'About 72%, because 0.80 final evidence availability x 0.90 conditional generation accuracy = 0.72',
        'About 84.6%, because the original 0.94 retriever recall should be multiplied directly by 0.90 and reranker losses ignored',
        'About 94%, because retrieving the gold passage anywhere in top 50 guarantees the answer can use it',
      ],
      answerIndex: 0,
      explanation: 'The generator only gets its 90% conditional success rate on the 80% of queries where reranking preserves the gold passage in the final context. Multiplying 0.80 x 0.90 gives about 0.72. The gap from 94% retrieval availability to 80% final availability also identifies reranking as a material bottleneck.',
      misconceptionTested: 'Strong first-stage retrieval recall automatically carries through reranking and guarantees that the generator receives the same evidence.',
    },
  ],
  'rag-failure-modes': [
    {
      id: 'rag-failure-attribution-ledger',
      level: 'diagnosis',
      relatedComparison: 'retrieval-miss-vs-grounding-miss-vs-generation-miss',
      scenario: 'A review of 100 failed RAG answers finds 40 cases where the gold evidence never appeared in retrieved candidates, 35 cases where gold evidence reached the final context but the answer ignored or mis-cited it, and 25 cases where the answer used the right evidence yet still produced an incorrect conclusion.',
      prompt: 'Which failure ledger correctly preserves the first actionable subsystem for all 100 cases?',
      choices: [
        '100 retrieval failures, because every bad final answer should be charged to the retriever first',
        '40 retrieval failures, 35 grounding/evidence-use failures, and 25 generation/reasoning failures',
        '75 generation failures and 25 retrieval failures, because only the final model produces user-visible text',
      ],
      answerIndex: 1,
      explanation: 'Failure attribution should follow the pipeline boundary where the required condition first breaks. Missing evidence is retrieval failure; available-but-unused evidence is grounding or evidence-use failure; correctly used evidence followed by a wrong conclusion is downstream generation or reasoning failure.',
      misconceptionTested: 'RAG quality can be debugged effectively by assigning every bad answer to one undifferentiated end-to-end failure bucket.',
    },
  ],
});

export function getP1RagGroundingAppliedScenariosForLesson(lessonId) {
  return P1_RAG_GROUNDING_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
