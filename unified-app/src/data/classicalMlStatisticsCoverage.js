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
    'calibration-reliability-gap-worked',
  ], [
    'cal-060-final-test',
    'cal-061-small-data-method',
    'cal-062-large-data-method',
    'cal-067-recalibration-trigger',
  ]),
  'train-validation-test-split': requirement([
    'split-grouped-entity',
    'split-train-serve-semantics',
    'split-reused-selection-contamination',
    'split-entity-generalization-worked',
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
    'bias-variance-learning-curve-worked',
  ]),
  regularization: requirement([
    'regularization-family-comparison',
    'regularization-early-stopping-augmentation',
    'regularization-validation-curve-worked',
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
    'classifier-family-latency-tradeoff-worked',
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
    'bayes-base-rate-worked',
  ], [
    'bayes-030-precision',
    'bayes-042-threshold',
    'bayes-044-calibration-check',
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
    'loss-huber-outlier-worked',
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
    'ci-clustered-sampling-unit-decision',
  ], [
    'ci-017-t-vs-z',
    'ci-021-mean-se',
    'ci-029-bootstrap-purpose',
    'ci-035-mean-vs-proportion',
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
    'sequential-three-look-boundary-worked',
  ]),
  'cuped-variance-reduction': requirement([
    'cuped-bad-covariate',
    'cuped-multiple-pretreatment-covariates',
    'cuped-variance-reduction-worked',
  ]),
  'confounding-simpsons-paradox': requirement([
    'simpson-standardization',
    'simpson-effect-modification-vs-confounding',
    'simpson-standardized-rate-worked',
  ], [
    'conf-030-effect-modification',
    'conf-033-standardization',
    'conf-034-matching',
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
    'cate-uncertainty-worked-decision',
  ]),
  'propensity-scores': requirement([
    'propensity-balance-smd',
    'propensity-extreme-weight-trim',
    'propensity-positivity-overlap-decision',
  ]),
  'spearman-correlation': requirement([
    'spearman-tied-ranks',
    'spearman-nonmonotonic',
    'spearman-tied-ranks-worked',
  ], [
    'sp-026-nonlinear',
    'sp-027-nonmonotonic',
    'sp-031-tied-ranks',
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
  depthRequirement('calibration-reliability-gap-calculation', 'calibration', [
    'calibration-reliability-gap-worked',
  ]),
  depthRequirement('entity-generalization-split-decision', 'train-validation-test-split', [
    'split-entity-generalization-worked',
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
  depthRequirement('learning-curve-bias-variance-diagnosis', 'bias-variance-tradeoff', [
    'bias-variance-learning-curve-worked',
  ]),
  depthRequirement('regularization-validation-tradeoff-decision', 'regularization', [
    'regularization-validation-curve-worked',
  ]),
  depthRequirement('cluster-count-stability-decision', 'k-means', [
    'kmeans-k-stability-worked-decision',
  ]),
  depthRequirement('classifier-serving-tradeoff-decision', 'knn-naive-bayes-svm', [
    'classifier-family-latency-tradeoff-worked',
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
  depthRequirement('ranking-metric-calculation', 'recommender-systems-ranking-track', [
    'rec-ndcg-worked-calculation',
  ]),
  depthRequirement('bayes-base-rate-calculation', 'bayes-rule-ml', [
    'bayes-base-rate-worked',
  ]),
  depthRequirement('mle-map-worked-estimate', 'maximum-likelihood-estimation', [
    'mle-map-bernoulli-worked',
  ]),
  depthRequirement('robust-loss-outlier-calculation', 'loss-functions-likelihoods', [
    'loss-huber-outlier-worked',
  ]),
  depthRequirement('count-distribution-assumption-diagnosis', 'probability-distributions', [
    'prob-overdispersion-poisson',
  ]),
  depthRequirement('clustered-sampling-unit-design', 'sampling-confidence-intervals', [
    'ci-clustered-sampling-unit-decision',
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
  depthRequirement('planned-multiple-look-threshold-calculation', 'sequential-testing-peeking', [
    'sequential-three-look-boundary-worked',
  ]),
  depthRequirement('cuped-variance-reduction-calculation', 'cuped-variance-reduction', [
    'cuped-variance-reduction-worked',
  ]),
  depthRequirement('simpson-standardization-calculation', 'confounding-simpsons-paradox', [
    'simpson-standardized-rate-worked',
  ]),
  depthRequirement('causal-estimand-mediator-decision', 'causal-graphs-dags', [
    'dag-mediator-total-effect-decision',
  ]),
  depthRequirement('cate-uncertainty-decision', 'treatment-effects', [
    'cate-uncertainty-worked-decision',
  ]),
  depthRequirement('positivity-overlap-estimand-decision', 'propensity-scores', [
    'propensity-positivity-overlap-decision',
  ]),
  depthRequirement('spearman-tied-rank-calculation', 'spearman-correlation', [
    'spearman-tied-ranks-worked',
  ]),
]);
