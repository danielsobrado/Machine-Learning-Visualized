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
});
