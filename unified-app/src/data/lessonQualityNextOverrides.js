export const LESSON_QUALITY_NEXT_OVERRIDES = Object.freeze({
  'linear-regression': Object.freeze({
    reason: 'Regression lesson now distinguishes confidence intervals for the fitted mean from wider prediction intervals for new observations and contrasts OLS with a Theil–Sen robust fit under an extreme response outlier.',
    nextAction: 'Add bootstrap coefficient intervals and quantile-regression prediction bands for non-Gaussian residuals.',
  }),
  'logistic-regression': Object.freeze({
    reason: 'Classifier lesson now demonstrates probability-scale calibration shift and compares a single global operating threshold with subgroup-specific cost-optimal thresholds while keeping fairness claims separate.',
    nextAction: 'Add held-out Platt/temperature calibration fitting and constrained threshold optimization under fairness requirements.',
  }),
  'train-validation-test-split': Object.freeze({
    reason: 'Split lesson now includes a repeated model-selection replay showing validation winner optimism and contrasts it with an outer nested-evaluation estimate.',
    nextAction: 'Add repeated nested-CV variance and model-selection stability diagnostics across resampled outer folds.',
  }),
  'cross-validation': Object.freeze({
    reason: 'Cross-validation lesson now compares expanding and blocked temporal windows on a regime-shift series and aggregates forecast error separately by horizon.',
    nextAction: 'Add temporal gap/embargo handling and probabilistic multi-horizon scoring for leakage-sensitive forecasting.',
  }),
  'time-series-forecasting-track': Object.freeze({
    reason: 'Forecasting lesson now separates asymmetric decision cost from interval calibration and reports both cost and coverage horizon by horizon.',
    nextAction: 'Add rolling conformal interval recalibration and decision-value curves under changing forecast costs.',
  }),
  'causal-graphs-dags': Object.freeze({
    reason: 'DAG lesson now executes a complete binary front-door adjustment numerically, including treatment-mix standardization inside each mediator level and mediator standardization under each intervention.',
    nextAction: 'Add numeric sensitivity to front-door assumption violations and contrast identified with non-identified graph variants.',
  }),
  'treatment-effects': Object.freeze({
    reason: 'Treatment-effect lesson now adds hierarchical partial pooling, showing how subgroup standard error and between-group heterogeneity determine shrinkage toward the population effect.',
    nextAction: 'Add a multi-subgroup hierarchical forest view with posterior probability-of-benefit decisions.',
  }),
  'propensity-scores': Object.freeze({
    reason: 'Propensity-score lesson now computes an augmented inverse-probability-weighted treatment effect alongside the outcome-model plug-in estimate and exposes inverse-weight effective sample size under overlap stress.',
    nextAction: 'Add cross-fitted nuisance estimation, overlap weighting, and uncertainty for doubly robust estimates.',
  }),
  'confounding-simpsons-paradox': Object.freeze({
    reason: 'Confounding lesson now contrasts exact matching to the treated population with standardization to an explicit target population, making ATT-versus-ATE estimand changes visible numerically.',
    nextAction: 'Add quantitative sensitivity analysis for unmeasured confounding beyond measured matching and standardization.',
  }),
  'cuped-variance-reduction': Object.freeze({
    reason: 'CUPED lesson now accumulates multiple pre-treatment covariates through sequential partial R², exposing incremental explained variance, remaining variance, and equivalent-sample precision gain.',
    nextAction: 'Add correlated-covariate diagnostics and regularized high-dimensional baseline adjustment.',
  }),
  'sequential-testing-peeking': Object.freeze({
    reason: 'Sequential-testing lesson now compares the observed interim Z statistic with a pre-specified five-look O’Brien–Fleming efficacy boundary and turns the result into an explicit stop-or-continue decision.',
    nextAction: 'Add futility boundaries and simulate achieved type-I error, power, and expected sample size under stopping.',
  }),
  'gradient-descent': Object.freeze({
    reason: 'Optimization lesson now compares vanilla gradient descent, momentum, and diagonal preconditioning on the same ill-conditioned quadratic with a shared start, trajectory view, and loss reduction readout.',
    nextAction: 'Add Nesterov and RMSProp/Adam trajectories with per-coordinate effective-step diagnostics.',
  }),
  'probability-distributions': Object.freeze({
    reason: 'Distribution lesson now contrasts a two-Gaussian mixture with its moment-matched single Gaussian, making multimodality loss visible even when mean and variance are preserved.',
    nextAction: 'Add heavy-tail and skew model-selection diagnostics with Q-Q or residual-shape checks.',
  }),
  'loss-functions-likelihoods': Object.freeze({
    reason: 'Loss lesson now compares class-weighted categorical NLL with focal loss under severe imbalance and exposes how each objective reallocates contribution toward minority or hard examples.',
    nextAction: 'Add label-noise-robust losses and show downstream calibration and decision-cost consequences after reweighting.',
  }),
  'maximum-likelihood-estimation': Object.freeze({
    reason: 'MLE lesson now distinguishes likelihood-only MLE, Beta-Bernoulli MAP, and posterior mean while sweeping prior concentration to expose shrinkage sensitivity.',
    nextAction: 'Add posterior credible intervals and prior-predictive checks to separate point estimation from uncertainty and model checking.',
  }),
});
