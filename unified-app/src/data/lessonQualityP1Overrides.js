export const P1_COMPLETED_QUALITY_OVERRIDES = Object.freeze({
  'linear-regression': Object.freeze({
    reason: 'Foundational regression lesson now includes residual-failure diagnostics, heteroscedasticity counterexamples, and influence/outlier analysis in addition to active fit controls.',
    nextAction: 'Add confidence-band versus prediction-band comparison and a small robust-regression contrast.',
  }),
  'logistic-regression': Object.freeze({
    reason: 'Classifier workbench now includes class-imbalance deployment scenarios, asymmetric false-positive/false-negative costs, and cost-sensitive threshold selection.',
    nextAction: 'Add probability-calibration shift and subgroup-threshold policy comparisons.',
  }),
  'train-validation-test-split': Object.freeze({
    reason: 'Split simulator includes random, stratified, temporal, grouped-entity, repeated-selection contamination, and train/serve-skew diagnostics.',
    nextAction: 'Add nested model-selection replay showing how validation reuse biases final selection.',
  }),
  'cross-validation': Object.freeze({
    reason: 'Cross-validation lesson includes grouped folds, preprocessing scope, repeated-CV reasoning, variance diagnostics, and time-aware fold-design contracts.',
    nextAction: 'Add blocked versus expanding-window forecast CV with horizon-specific error aggregation.',
  }),
  'time-series-forecasting-track': Object.freeze({
    reason: 'Forecasting workbench exposes rolling backtests plus MAE, RMSE, MAPE, MASE, pinball loss, interval coverage, leakage, and temporal-feature diagnostics.',
    nextAction: 'Add asymmetric business-cost forecast scoring and horizon-by-horizon calibration views.',
  }),
  'probability-distributions': Object.freeze({
    reason: 'Distribution lesson now connects Gaussian versus Laplace noise assumptions directly to quadratic versus absolute residual penalties.',
    nextAction: 'Add a mixture-distribution scenario showing why a single-family assumption can miss multimodality.',
  }),
  'loss-functions-likelihoods': Object.freeze({
    reason: 'Loss lesson now includes multiclass categorical NLL and an interactive label-smoothing target/loss comparison.',
    nextAction: 'Add focal-loss and class-weighted categorical NLL comparisons under severe imbalance.',
  }),
  'maximum-likelihood-estimation': Object.freeze({
    reason: 'MLE workbench now contrasts Bernoulli MLE with a Beta-prior MAP estimate and visualizes prior-driven shrinkage.',
    nextAction: 'Add posterior-mean versus MAP comparison and a prior-strength sensitivity sweep.',
  }),
  'gradient-descent': Object.freeze({
    reason: 'Optimization lesson now includes learning-rate stability plus an ill-conditioned quadratic trajectory and stationary-but-not-minimum saddle diagnosis.',
    nextAction: 'Add momentum and preconditioning trajectories on the same ill-conditioned valley.',
  }),
  'causal-graphs-dags': Object.freeze({
    reason: 'DAG lesson now distinguishes mediator conditioning, collider opening, total-effect adjustment, and front-door identification logic.',
    nextAction: 'Add a complete numeric front-door adjustment worked example with its identification assumptions.',
  }),
  'treatment-effects': Object.freeze({
    reason: 'Treatment-effect workbench now pairs subgroup/CATE estimates with confidence intervals and explicit multiple-testing risk.',
    nextAction: 'Add shrinkage or hierarchical partial-pooling comparison for noisy subgroup effects.',
  }),
  'propensity-scores': Object.freeze({
    reason: 'Propensity-score lesson now reports standardized mean differences before/after trimming, overlap quality, and extreme-weight variance risk.',
    nextAction: 'Add stabilized-weight effective-sample-size and doubly-robust sensitivity comparisons.',
  }),
  'confounding-simpsons-paradox': Object.freeze({
    reason: 'Confounding lesson now includes a true Simpson reversal with different treated/control stratum composition and target-population standardization.',
    nextAction: 'Add direct matching-versus-standardization comparison under imperfect overlap.',
  }),
  'cuped-variance-reduction': Object.freeze({
    reason: 'CUPED lesson now links pre-treatment R² to variance/SE reduction and explicitly rejects post-treatment covariates.',
    nextAction: 'Add multiple-covariate residualization with incremental R² and collinearity diagnostics.',
  }),
  'sequential-testing-peeking': Object.freeze({
    reason: 'Sequential-testing workbench now includes Lan–DeMets Pocock-like and O’Brien–Fleming-like cumulative alpha-spending schedules.',
    nextAction: 'Add observed-z stopping decisions and expected-sample-size comparison under several true effects.',
  }),
  'recommender-systems-ranking-track': Object.freeze({
    reason: 'Ranking lesson now includes a worked latent-factor dot-product prediction and rank-by-rank DCG, IDCG, and nDCG calculation.',
    nextAction: 'Add implicit-feedback matrix factorization and sampled-negative evaluation caveats.',
  }),
  'model-debugging': Object.freeze({
    reason: 'Debugging lesson now includes a saved before/intervention/after failure-slice replay with an explicit global guardrail.',
    nextAction: 'Add competing-hypothesis replay where two plausible fixes produce different slice signatures.',
  }),
  'model-monitoring': Object.freeze({
    reason: 'Monitoring lesson now includes incident annotations from baseline through diagnosis, mitigation, and verified recovery.',
    nextAction: 'Add alert deduplication and rollback-versus-forward-fix decision scenarios.',
  }),
  'uncertainty-estimation': Object.freeze({
    reason: 'Uncertainty lesson now includes empirical reliability buckets, expected calibration error, signed calibration bias, and abstention-policy framing.',
    nextAction: 'Add temperature-scaling recalibration fit on a held-out calibration split.',
  }),
  'model-fairness': Object.freeze({
    reason: 'Fairness lesson now combines subgroup error counts with asymmetric business/harm costs while keeping fairness metrics distinct from cost optimization.',
    nextAction: 'Add paired subgroup threshold sweeps with equalized-odds and calibration trade-off traces.',
  }),
  'ml-security-robustness-track': Object.freeze({
    reason: 'Security lesson now includes concrete retrieved prompt-injection and retrieval-poisoning cases with weak-versus-defense-in-depth controls.',
    nextAction: 'Add executable red-team traces across ingestion, retrieval, authorization, and output validation boundaries.',
  }),
  'data-engineering-for-ml-track': Object.freeze({
    reason: 'ML data-engineering lesson now demonstrates self-label target-encoding leakage and point-in-time feature-materialization leakage.',
    nextAction: 'Add slowly-changing-dimension and late-arriving-event feature-store scenarios.',
  }),
  'efficient-inference-compression-track': Object.freeze({
    reason: 'Inference-efficiency lesson now separates quantized parameter memory from KV-cache memory across model size, context length, batch size, and KV-head count.',
    nextAction: 'Add activation/runtime overhead and paged-KV fragmentation to the serving-memory budget.',
  }),
});
