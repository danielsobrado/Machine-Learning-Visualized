export const TIME_SERIES_FORECASTING_AUDITED_LESSON_IDS = Object.freeze([
  'time-series-forecasting-track',
]);

export const TIME_SERIES_FORECASTING_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    id: 'time-series-point-in-time-feature-correctness',
    lessonId: 'time-series-forecasting-track',
    competency: 'shifted-rolling-feature-point-in-time-correctness',
    scenarioId: 'tsf-point-in-time-rolling-worked',
  }),
  Object.freeze({
    id: 'time-series-rolling-origin-stability',
    lessonId: 'time-series-forecasting-track',
    competency: 'multi-cutoff-backtest-stability-diagnosis',
    scenarioId: 'tsf-rolling-origin-backtest-diagnosis',
  }),
  Object.freeze({
    id: 'time-series-interval-calibration',
    lessonId: 'time-series-forecasting-track',
    competency: 'empirical-prediction-interval-coverage',
    scenarioId: 'tsf-interval-coverage-worked',
  }),
  Object.freeze({
    id: 'time-series-horizon-matched-selection',
    lessonId: 'time-series-forecasting-track',
    competency: 'deployment-horizon-matched-model-selection',
    scenarioId: 'tsf-horizon-release-selection',
  }),
]);

export const TIME_SERIES_FORECASTING_NEW_APPLIED_SCENARIO_IDS = Object.freeze([
  'tsf-point-in-time-rolling-worked',
  'tsf-rolling-origin-backtest-diagnosis',
  'tsf-interval-coverage-worked',
  'tsf-horizon-release-selection',
]);
