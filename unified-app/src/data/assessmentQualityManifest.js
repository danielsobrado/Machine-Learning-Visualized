export const P0_PRIORITY_ASSESSMENT_LESSON_IDS = Object.freeze([
  'probability-distributions',
  'model-debugging',
  'model-monitoring',
  'model-interpretability',
]);

export const P0_ASSESSMENT_COVERAGE = Object.freeze({
  'probability-distributions': Object.freeze({
    scenarioIds: Object.freeze(['prob-visual-normal-spread', 'prob-visual-poisson-dispersion']),
    minVisualStateQuestions: 2,
  }),
  'linear-regression': Object.freeze({
    scenarioIds: Object.freeze(['lr-visual-residual-curve']),
    minVisualStateQuestions: 1,
  }),
  'classification-metrics': Object.freeze({
    scenarioIds: Object.freeze(['metrics-visual-threshold-cost']),
    minVisualStateQuestions: 1,
    minComparisonQuestions: 1,
  }),
  'data-leakage-deep-dive': Object.freeze({
    scenarioIds: Object.freeze([
      'leakage-point-in-time-feature',
      'leakage-target-encoding-scope',
      'leakage-temporal-split',
    ]),
  }),
  'time-series-forecasting-track': Object.freeze({
    scenarioIds: Object.freeze([
      'ts-metric-rmse-vs-mae',
      'ts-metric-mape-zero',
      'ts-metric-pinball',
      'ts-visual-horizon-error',
    ]),
    minVisualStateQuestions: 1,
    minComparisonQuestions: 1,
  }),
  'rag-retrieval-evaluation': Object.freeze({
    scenarioIds: Object.freeze([
      'rag-eval-recall-at-k',
      'rag-eval-mrr',
      'rag-eval-ndcg',
      'rag-eval-retrieval-vs-generation',
    ]),
    minComparisonQuestions: 3,
  }),
  'rag-failure-modes': Object.freeze({
    scenarioIds: Object.freeze([
      'rag-failure-missing-vs-unused',
      'rag-failure-context-dilution',
    ]),
    minVisualStateQuestions: 1,
    minComparisonQuestions: 1,
  }),
  'ml-security-robustness-track': Object.freeze({
    scenarioIds: Object.freeze([
      'security-indirect-prompt-injection',
      'security-retrieval-poisoning',
      'security-robustness-vs-safety',
    ]),
    minComparisonQuestions: 1,
  }),
  'data-engineering-for-ml-track': Object.freeze({
    scenarioIds: Object.freeze([
      'de-point-in-time-join',
      'de-target-encoding-materialization',
      'de-train-serve-skew',
    ]),
    minVisualStateQuestions: 1,
  }),
  'matrix-decompositions': Object.freeze({
    scenarioIds: Object.freeze([
      'compare-decomposition-choice',
      'compare-decomposition-rank',
    ]),
    minComparisonQuestions: 2,
  }),
  'flash-attention': Object.freeze({
    scenarioIds: Object.freeze([
      'compare-attention-flash-vs-gqa',
      'compare-attention-kv-memory',
      'compare-attention-sparse',
    ]),
    minComparisonQuestions: 3,
  }),
  'gradient-descent': Object.freeze({
    scenarioIds: Object.freeze(['compare-optimizer-conditioning']),
    minComparisonQuestions: 1,
  }),
  'model-debugging': Object.freeze({
    scenarioIds: Object.freeze(['debugging-slice-first']),
  }),
  'model-monitoring': Object.freeze({
    scenarioIds: Object.freeze(['monitoring-drift-types']),
    minComparisonQuestions: 1,
  }),
  'model-interpretability': Object.freeze({
    scenarioIds: Object.freeze(['interpretability-correlated-features']),
  }),
});
