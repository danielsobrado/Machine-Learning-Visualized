export const P0_STATISTICS_GAP_SCENARIOS_BY_LESSON = Object.freeze({
  'probability-distributions': [
    {
      id: 'prob-heavy-tail-assumption',
      level: 'diagnosis',
      relatedComparison: 'gaussian-vs-heavy-tail-errors',
      scenario: 'A regression model uses a Gaussian error assumption. Residuals are centered near zero but have far more extreme values than a normal distribution would predict, and nominal uncertainty intervals miss many observations in the tails.',
      prompt: 'Why does the distribution assumption matter downstream?',
      choices: ['A misspecified light-tailed error model can make likelihood-based fitting and uncertainty estimates too sensitive or too confident in the tails', 'The residual distribution never affects model behavior once the mean is correct', 'A Gaussian assumption guarantees calibrated prediction intervals for any residual shape'],
      answerIndex: 0,
      explanation: 'Distribution assumptions determine the likelihood and implied uncertainty. Heavy-tailed residuals can make Gaussian-based estimates and intervals behave poorly even when the conditional mean is approximately correct.',
      misconceptionTested: 'Probability-distribution assumptions are only descriptive and cannot affect downstream model fitting or uncertainty.',
    },
  ],
  'time-series-forecasting-track': [
    {
      id: 'ts-prediction-interval-coverage',
      level: 'visual-state',
      kind: 'visual-state',
      relatedComparison: 'point-error-vs-interval-coverage',
      visualState: { nominalInterval: '90%', horizon1Coverage: '89%', horizon7Coverage: '61%', pointMAE: 'stable' },
      scenario: 'Visual state: a forecasting model has stable point MAE, but its nominal 90% prediction intervals cover 89% of outcomes at horizon 1 and only 61% at horizon 7.',
      prompt: 'What is the main evaluation failure?',
      choices: ['Uncertainty is badly under-covered at longer horizons even though point-error metrics look stable', 'The point forecasts must be unbiased because MAE is stable', 'Prediction-interval coverage is irrelevant when a point forecast exists'],
      answerIndex: 0,
      explanation: 'Forecast evaluation should separate point accuracy from uncertainty quality. Horizon-specific interval coverage reveals that long-range uncertainty is substantially underestimated despite acceptable point MAE.',
      misconceptionTested: 'Good point-forecast metrics guarantee useful or calibrated prediction intervals.',
    },
  ],
});

export function getP0StatisticsGapScenariosForLesson(lessonId) {
  return P0_STATISTICS_GAP_SCENARIOS_BY_LESSON[lessonId] || [];
}
