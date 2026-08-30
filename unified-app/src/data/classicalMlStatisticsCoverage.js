function requirement(scenarioIds, quizIds = []) {
  return Object.freeze({
    scenarioIds: Object.freeze(scenarioIds),
    quizIds: Object.freeze(quizIds),
  });
}

export const CLASSICAL_ML_STATISTICS_COVERAGE = Object.freeze({
  'linear-regression': requirement([
    'lr-heteroscedastic-residuals',
    'lr-influential-outlier',
  ]),
  'logistic-regression': requirement([
    'logreg-imbalance-threshold-cost',
  ]),
  'classification-metrics': requirement([
    'metrics-subgroup-slicing',
    'metrics-visual-threshold-cost',
    'metrics-calibration-cost-threshold',
  ]),
  'roc-pr-curves': requirement([
    'roc-pr-rare-positive',
    'roc-pr-threshold-operating-point',
  ]),
  calibration: requirement([
    'calibration-shift-recalibration',
  ]),
  'train-validation-test-split': requirement([
    'split-grouped-entity',
    'split-train-serve-semantics',
    'split-reused-selection-contamination',
  ]),
  'cross-validation': requirement([
    'cv-repeated-stratified',
    'cv-grouped-time-boundary',
    'cv-nested-model-selection',
    'cv-rolling-origin-time-series',
  ]),
  'data-leakage-deep-dive': requirement([
    'leakage-point-in-time-feature',
    'leakage-target-encoding-scope',
    'leakage-temporal-split',
  ]),
  'feature-scaling-preprocessing': requirement([
    'scaling-robust-outliers',
    'scaling-model-family',
  ]),
  overfitting: requirement([
    'overfit-validation-reuse',
    'overfit-final-untouched-test',
  ]),
  'bias-variance-tradeoff': requirement([
    'bias-variance-noisy-labels',
    'bias-variance-more-data',
    'bias-variance-regularization-tradeoff',
  ]),
  regularization: requirement([
    'regularization-family-comparison',
    'regularization-early-stopping-augmentation',
  ]),
  'k-means': requirement([
    'kmeans-nonspherical-failure',
    'kmeans-scaling-sensitivity',
    'kmeans-initialization-instability',
    'kmeans-choose-k-stability',
    'kmeans-centroid-drift',
  ]),
  'knn-naive-bayes-svm': requirement([
    'classifier-family-scaling',
    'classifier-family-imbalance',
    'classifier-family-model-choice',
    'classifier-boundary-brittleness',
  ]),
  'tree-ensembles': requirement([
    'tree-attribution-correlated-features',
    'boosting-overfit-rounds',
    'tree-target-like-leakage',
  ]),
  'time-series-forecasting-track': requirement([
    'ts-metric-rmse-vs-mae',
    'ts-metric-mape-zero',
    'ts-metric-pinball',
    'ts-visual-horizon-error',
    'ts-prediction-interval-coverage',
  ]),
  'recommender-systems-ranking-track': requirement([
    'rec-ndcg-graded-ranking',
    'rec-matrix-factorization',
    'rec-offline-online-metrics',
    'rec-feedback-loop',
  ]),
  'bayes-rule-ml': requirement([
    'bayes-classifier-posterior-threshold',
    'bayes-confusion-matrix-bridge',
  ]),
  'maximum-likelihood-estimation': requirement([
    'mle-vs-map-prior',
    'mle-likelihood-prior-posterior',
  ]),
  'loss-functions-likelihoods': requirement([
    'loss-categorical-nll',
    'loss-label-smoothing',
    'loss-robust-outliers',
  ]),
  'probability-distributions': requirement([
    'prob-visual-normal-spread',
    'prob-visual-poisson-dispersion',
    'prob-heavy-tail-assumption',
  ], [
    'prob-001-purpose',
    'prob-041-bayes-link',
    'prob-048-cross-entropy-link',
  ]),
  'sampling-confidence-intervals': requirement([
    'ci-bootstrap-skewed-statistic',
    'ci-frequentist-interpretation',
  ]),
  'hypothesis-testing-intuition': requirement([
    'hypothesis-one-vs-two-sided',
    'hypothesis-multiple-testing',
    'hypothesis-practical-significance',
  ]),
  'ab-testing-foundations': requirement([
    'ab-peeking-false-positive',
    'ab-alpha-spending',
  ]),
  'power-sample-size': requirement([
    'power-paired-design',
    'power-proportion-baseline-rate',
  ]),
  'sequential-testing-peeking': requirement([
    'sequential-boundary-shape',
  ]),
  'cuped-variance-reduction': requirement([
    'cuped-bad-covariate',
    'cuped-multiple-pretreatment-covariates',
  ]),
  'confounding-simpsons-paradox': requirement([
    'simpson-standardization',
    'simpson-effect-modification-vs-confounding',
  ]),
  'causal-graphs-dags': requirement([
    'dag-mediator-adjustment',
    'dag-collider-m-bias',
    'dag-front-door-identification',
  ]),
  'treatment-effects': requirement([
    'cate-subgroup-uncertainty',
    'cate-subgroup-multiple-testing',
  ]),
  'propensity-scores': requirement([
    'propensity-balance-smd',
    'propensity-extreme-weight-trim',
  ]),
  'spearman-correlation': requirement([
    'spearman-tied-ranks',
    'spearman-nonmonotonic',
  ]),
});
