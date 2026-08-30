export const P0_STATISTICS_DECISION_SCENARIOS_BY_LESSON = Object.freeze({
  'time-series-forecasting-track': [
    {
      id: 'ts-mape-zero-worked',
      level: 'calculation',
      relatedComparison: 'mae-rmse-mape-zero-demand',
      scenario: 'Actual demand for two periods is [0, 10] units and forecasts are [2, 8]. A dashboard is configured to report MAPE as its primary error metric.',
      prompt: 'What is the key problem with using ordinary MAPE on these observations?',
      choices: ['The percentage error for the zero-actual period is undefined, so MAPE is not a reliable primary metric when valid zeros occur', 'MAPE is exactly 20% because both forecasts miss by 2 units', 'MAPE is always preferable to MAE whenever the target is non-negative'],
      answerIndex: 0,
      explanation: 'Ordinary MAPE divides each absolute error by the corresponding actual value. A valid actual value of zero makes that term undefined, so a metric such as MAE or another zero-safe business metric should be considered instead.',
      misconceptionTested: 'MAPE remains well-defined and comparable when the target can legitimately equal zero.',
    },
    {
      id: 'ts-pinball-loss-worked',
      level: 'calculation',
      relatedComparison: 'quantile-vs-point-loss',
      scenario: 'A 0.9-quantile forecast is 90 units and the observed value is 100. For pinball loss, an under-prediction uses q × (y - forecast).',
      prompt: 'What pinball loss does this observation contribute?',
      choices: ['9', '1', '10'],
      answerIndex: 0,
      explanation: 'The forecast is 10 units below the observation. At q = 0.9, pinball loss is 0.9 × 10 = 9, reflecting the larger penalty placed on under-predicting a high quantile.',
      misconceptionTested: 'Quantile loss penalizes over-prediction and under-prediction symmetrically like absolute error.',
    },
  ],
  'probability-distributions': [
    {
      id: 'prob-overdispersion-poisson',
      level: 'diagnosis',
      relatedComparison: 'poisson-vs-negative-binomial',
      scenario: 'A count target has a sample mean near 4 but variance near 18 across otherwise comparable observations. A Poisson model systematically understates uncertainty and produces too many large residuals.',
      prompt: 'Which assumption should be challenged first?',
      choices: ['The Poisson mean-variance restriction; an overdispersed count model such as negative binomial is worth evaluating', 'The counts must be Gaussian because the variance exceeds the mean', 'The variance is irrelevant because every count distribution has variance equal to its mean'],
      answerIndex: 0,
      explanation: 'A basic Poisson model implies conditional variance equal to its conditional mean. Substantially larger observed conditional variance is evidence of overdispersion and motivates checking a model that can represent extra count variability.',
      misconceptionTested: 'Poisson is automatically appropriate for every non-negative integer target regardless of dispersion.',
    },
  ],
  'data-leakage-deep-dive': [
    {
      id: 'leakage-target-encoding-oof-worked',
      level: 'design',
      relatedComparison: 'global-vs-out-of-fold-target-encoding',
      scenario: 'A high-cardinality category is target-encoded before cross-validation. The current implementation computes each category mean using every labeled row and then runs CV on the already encoded table.',
      prompt: 'Which evaluation procedure prevents the validation labels from leaking into their own encoded feature?',
      choices: ['Within each fold, fit the target encoder only on that fold’s training rows and transform its validation rows with those training-derived statistics', 'Compute one target encoding from the full labeled dataset and reuse it in every fold', 'Compute category means separately on each validation fold and use those values as validation features'],
      answerIndex: 0,
      explanation: 'Target encoding is supervised preprocessing and must stay inside the training side of every evaluation boundary. Out-of-fold fitting prevents a validation row’s target, directly or through its category aggregate, from influencing its own feature.',
      misconceptionTested: 'Preprocessing done before cross-validation cannot leak labels if the downstream model itself is fit inside the folds.',
    },
  ],
  'ab-testing-foundations': [
    {
      id: 'ab-alpha-spending-worked-decision',
      level: 'decision',
      relatedComparison: 'naive-peeking-vs-planned-sequential-boundary',
      scenario: 'An A/B test has a pre-specified interim analysis whose alpha-spending boundary requires p < 0.012 to stop for efficacy. At that look the observed p-value is 0.030.',
      prompt: 'What is the valid decision at this interim look?',
      choices: ['Do not declare significance at this look because 0.030 does not cross the pre-specified 0.012 boundary', 'Stop and declare significance because 0.030 is below the ordinary 0.05 threshold', 'Change the interim boundary to 0.05 now that the observed effect is positive'],
      answerIndex: 0,
      explanation: 'Repeated looks require the stopping rule to be accounted for. Because the pre-specified boundary at this look is 0.012, p = 0.030 does not cross it; reverting to 0.05 would discard the intended Type I error control.',
      misconceptionTested: 'A sequential experiment may use the ordinary 0.05 threshold independently at every interim look.',
    },
  ],
});

export function getP0StatisticsDecisionScenariosForLesson(lessonId) {
  return P0_STATISTICS_DECISION_SCENARIOS_BY_LESSON[lessonId] || [];
}
