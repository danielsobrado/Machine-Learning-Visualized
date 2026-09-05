# Statistics, experimentation and classical ML assessment coverage

This file records the curated assessment gaps that must be covered by the corresponding topic modules in `unified-app` and the standalone topic apps.

## P0

- Data Leakage: temporal leakage lineage, target encoding leakage, feature availability at prediction time.
- Time-Series Forecasting: MAE vs RMSE vs MAPE vs pinball loss, prediction intervals, horizon-specific evaluation.
- Probability Distributions: dedicated assessment module plus explicit links from distribution assumptions to downstream model behavior.
- A/B Testing: sequential looks/peeking and alpha spending.

## P1

- Linear Regression: heteroscedasticity diagnosis and stronger outlier counterexamples.
- Logistic Regression: class imbalance, asymmetric FP/FN costs, threshold selection from business cost.
- Classification Metrics: subgroup metric differences, metric choice under asymmetric costs, connection to calibration.
- ROC / PR Curves: imbalanced-data threshold failure scenarios and cases where ROC AUC hides poor minority performance.
- Calibration: calibration under dataset shift, recalibration choice and diagnosis.
- Train / Validation / Test: group/entity split, repeated model-selection contamination, train/serve skew.
- Cross Validation: time-series CV, repeated stratified CV, nested CV/model selection.
- Feature Scaling: which algorithms care about scaling and transformations beyond standard/min-max scaling.
- Overfitting: repeated validation-set reuse, model-selection overfit, final untouched test set.
- Bias–Variance: noisy labels, regularization-family comparisons, irreducible error.
- Regularization: connect L1/L2 to dropout, tree depth, augmentation and early stopping.
- K-Means: choosing K, centroid instability/drift, non-spherical clusters, scaling sensitivity.
- KNN / Naive Bayes / SVM: class imbalance, scaling differences, brittle boundaries, explicit model-choice scenarios.
- Tree Ensembles: attribution pitfalls, leakage through target-like features, overfit diagnostics.
- Recommender Systems: worked nDCG examples, matrix factorization, offline vs online metrics, popularity feedback loops.
- Bayes Rule: bridge posterior probabilities to confusion-matrix and calibrated-classifier decisions.
- MLE: prior vs likelihood vs posterior and explicit transition from MLE to MAP.
- Loss Functions & Likelihoods: multiclass categorical NLL, label smoothing, robust losses.
- Sampling & Confidence Intervals: bootstrap intervals, mean/non-proportion examples, CI interpretation traps.
- Hypothesis Testing: one-sided vs two-sided tests, multiple comparisons, practical vs statistical significance.
- Power & Sample Size: proportion vs continuous outcomes, paired tests, baseline-rate dependence.
- CUPED: bad pre-period covariates, multiple covariates, leakage from post-treatment information.
- Simpson's Paradox: standardization/matching as corrections; distinguish effect modification from confounding.
- Causal DAGs: mediators, front-door paths, M-bias, collider-conditioning diagnosis.
- Treatment Effects: CATE uncertainty, subgroup multiple testing, targeting vs causal discovery.
- Propensity Scores: standardized mean differences, trimming, extreme weights, positivity violations.

## P2

- Sequential Testing: Pocock vs O'Brien-Fleming boundaries and stopping decisions.
- Spearman Correlation: tied ranks, monotonic-but-nonlinear vs non-monotonic patterns.

## Acceptance rule

A row is only considered complete when its topic has explicit assessment questions or worked scenario prompts covering every listed gap. Merely mentioning a concept in lesson prose does not satisfy the assessment requirement.
