function requirement(scenarioIds, quizIds = []) {
  return Object.freeze({
    scenarioIds: Object.freeze(scenarioIds),
    quizIds: Object.freeze(quizIds),
  });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    scenarioIds: Object.freeze(scenarioIds),
  });
}

export const CLASSICAL_ML_STATISTICS_COVERAGE = Object.freeze({
  'linear-regression': requirement([
    'lr-heteroscedastic-residuals',
    'lr-influential-outlier',
    'lr-heteroscedastic-binned-residuals-worked',
  ]),
  'logistic-regression': requirement([
    'logreg-imbalance-threshold-cost',
    'logreg-cost-threshold-worked',
  ]),
  'classification-metrics': requirement([
    'metrics-subgroup-slicing',
    'metrics-visual-threshold-cost',
    'metrics-calibration-cost-threshold',
    'metrics-subgroup-tpr-worked',
  ]),
  'roc-pr-curves': requirement([
    'roc-pr-rare-positive',
    'roc-pr-threshold-operating-point',
    'roc-pr-rare-positive-worked',
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
    'cv-nested-selection-design-worked',
  ]),
  'data-leakage-deep-dive': requirement([
    'leakage-point-in-time-feature',
    'leakage-target-encoding-scope',
    'leakage-temporal-split',
    'leakage-target-encoding-oof-worked',
  ]),
  'feature-scaling-preprocessing': requirement([
    'scaling-robust-outliers',
    'scaling-model-family',
    'scaling-skew-transform-decision',
  ]),
  overfitting: requirement([
    'overfit-validation-reuse',
    'overfit-final-untouched-test',
    'overfit-model-selection-reuse-worked',
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
    'kmeans-k-stability-worked-decision',
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
    'tree-post-outcome-feature-diagnosis',
  ]),
  'time-series-forecasting-track': requirement([
    'ts-metric-rmse-vs-mae',
    'ts-metric-mape-zero',
    'ts-metric-pinball',
    'ts-visual-horizon-error',
    'ts-prediction-interval-coverage',
    'ts-mape-zero-worked',
    'ts-pinball-loss-worked',
  ]),
  'recommender-systems-ranking-track': requirement([
    'rec-ndcg-graded-ranking',
    'rec-matrix-factorization',
    'rec-offline-online-metrics',
    'rec-feedback-loop',
    'rec-ndcg-worked-calculation',
  ]),
  'bayes-rule-ml': requirement([
    'bayes-classifier-posterior-threshold',
    'bayes-confusion-matrix-bridge',
  ]),
  'maximum-likelihood-estimation': requirement([
    'mle-vs-map-prior',
    'mle-likelihood-prior-posterior',
    'mle-map-bernoulli-worked',
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
    'prob-overdispersion-poisson',
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
    'hypothesis-fdr-vs-fwer-decision',
  ]),
  'ab-testing-foundations': requirement([
    'ab-peeking-false-positive',
    'ab-alpha-spending',
    'ab-alpha-spending-worked-decision',
  ]),
  'power-sample-size': requirement([
    'power-paired-design',
    'power-proportion-baseline-rate',
    'power-continuous-outcome-variance',
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
    'dag-mediator-total-effect-decision',
  ]),
  'treatment-effects': requirement([
    'cate-subgroup-uncertainty',
    'cate-subgroup-multiple-testing',
  ]),
  'propensity-scores': requirement([
    'propensity-balance-smd',
    'propensity-extreme-weight-trim',
    'propensity-positivity-overlap-decision',
  ]),
  'spearman-correlation': requirement([
    'spearman-tied-ranks',
    'spearman-nonmonotonic',
  ]),
});

export const CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('heteroscedasticity-diagnostic-evidence', 'linear-regression', [
    'lr-heteroscedastic-binned-residuals-worked',
  ]),
  depthRequirement('cost-sensitive-threshold-calculation', 'logistic-regression', [
    'logreg-cost-threshold-worked',
  ]),
  depthRequirement('subgroup-metric-calculation', 'classification-metrics', [
    'metrics-subgroup-tpr-worked',
  ]),
  depthRequirement('rare-class-operating-point-calculation', 'roc-pr-curves', [
    'roc-pr-rare-positive-worked',
  ]),
  depthRequirement('nested-model-selection-design', 'cross-validation', [
    'cv-nested-selection-design-worked',
  ]),
  depthRequirement('supervised-preprocessing-evaluation-boundary', 'data-leakage-deep-dive', [
    'leakage-target-encoding-oof-worked',
  ]),
  depthRequirement('skew-and-scale-preprocessing-decision', 'feature-scaling-preprocessing', [
    'scaling-skew-transform-decision',
  ]),
  depthRequirement('model-selection-reuse-diagnosis', 'overfitting', [
    'overfit-model-selection-reuse-worked',
  ]),
  depthRequirement('cluster-count-stability-decision', 'k-means', [
    'kmeans-k-stability-worked-decision',
  ]),
  depthRequirement('prediction-time-feature-leakage-diagnosis', 'tree-ensembles', [
    'tree-post-outcome-feature-diagnosis',
  ]),
  depthRequirement('zero-safe-forecast-metric-choice', 'time-series-forecasting-track', [
    'ts-mape-zero-worked',
  ]),
  depthRequirement('quantile-loss-calculation', 'time-series-forecasting-track', [
    'ts-pinball-loss-worked',
  ]),
  depthRequirement('count-distribution-assumption-diagnosis', 'probability-distributions', [
    'prob-overdispersion-poisson',
  ]),
  depthRequirement('ranking-metric-calculation', 'recommender-systems-ranking-track', [
    'rec-ndcg-worked-calculation',
  ]),
  depthRequirement('mle-map-worked-estimate', 'maximum-likelihood-estimation', [
    'mle-map-bernoulli-worked',
  ]),
  depthRequirement('multiplicity-objective-choice', 'hypothesis-testing-intuition', [
    'hypothesis-fdr-vs-fwer-decision',
  ]),
  depthRequirement('planned-sequential-boundary-decision', 'ab-testing-foundations', [
    'ab-alpha-spending-worked-decision',
  ]),
  depthRequirement('continuous-outcome-power-reasoning', 'power-sample-size', [
    'power-continuous-outcome-variance',
  ]),
  depthRequirement('causal-estimand-mediator-decision', 'causal-graphs-dags', [
    'dag-mediator-total-effect-decision',
  ]),
  depthRequirement('positivity-overlap-estimand-decision', 'propensity-scores', [
    'propensity-positivity-overlap-decision',
  ]),
]);
