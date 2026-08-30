export const P1_ASSESSMENT_COVERAGE = Object.freeze({
  'logistic-regression': Object.freeze({
    scenarioIds: Object.freeze(['logreg-imbalance-threshold-cost', 'logreg-odds-coefficient']),
    minComparisonQuestions: 1,
  }),
  'classification-metrics': Object.freeze({
    scenarioIds: Object.freeze(['metrics-subgroup-slicing']),
    minComparisonQuestions: 1,
  }),
  'cross-validation': Object.freeze({
    scenarioIds: Object.freeze(['cv-repeated-stratified', 'cv-grouped-time-boundary']),
    minComparisonQuestions: 2,
  }),
  'k-means': Object.freeze({
    scenarioIds: Object.freeze([
      'kmeans-nonspherical-failure',
      'kmeans-scaling-sensitivity',
      'kmeans-initialization-instability',
    ]),
    minVisualStateQuestions: 1,
    minComparisonQuestions: 1,
  }),
  calibration: Object.freeze({
    scenarioIds: Object.freeze(['calibration-shift-recalibration']),
    minVisualStateQuestions: 1,
  }),
  overfitting: Object.freeze({
    scenarioIds: Object.freeze(['overfit-validation-reuse']),
  }),
  regularization: Object.freeze({
    scenarioIds: Object.freeze(['regularization-family-comparison']),
    minComparisonQuestions: 1,
  }),
  'recommender-systems-ranking-track': Object.freeze({
    scenarioIds: Object.freeze(['rec-ndcg-graded-ranking', 'rec-feedback-loop', 'rec-cold-start-content']),
    minComparisonQuestions: 2,
  }),
  'gradient-descent': Object.freeze({
    scenarioIds: Object.freeze(['gd-saddle-gradient-small']),
    minVisualStateQuestions: 1,
  }),
  'neural-network': Object.freeze({
    scenarioIds: Object.freeze(['nn-architecture-ablation']),
    minComparisonQuestions: 1,
  }),
  'rag-chunking-context': Object.freeze({
    scenarioIds: Object.freeze(['rag-chunk-semantic-vs-fixed', 'rag-overlap-duplication']),
    minComparisonQuestions: 1,
  }),
  'rag-vector-indexing': Object.freeze({
    scenarioIds: Object.freeze(['rag-index-recall-latency']),
    minComparisonQuestions: 1,
  }),
  'rag-reranking-grounding': Object.freeze({
    scenarioIds: Object.freeze(['rag-cross-encoder-budget']),
    minComparisonQuestions: 1,
  }),
});
