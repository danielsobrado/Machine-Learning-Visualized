function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'time-series-forecasting-track',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TIME_SERIES_FORECASTING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'time-series-forecasting-track',
]);

export const TIME_SERIES_FORECASTING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'tsf-point-in-time-rolling-feature',
    ['tsf-024-shift-before-roll'],
    ['tsf-point-in-time-rolling-worked'],
  ),
  competency(
    'tsf-rolling-origin-temporal-stability',
    ['tsf-014-rolling-split'],
    ['tsf-rolling-origin-backtest-diagnosis'],
  ),
  competency(
    'tsf-naive-baseline-gating',
    ['tsf-012-baseline'],
    ['tsf-naive-baseline-gating-worked'],
  ),
  competency(
    'tsf-recursive-multi-step-error-propagation',
    ['tsf-030-recursive-strategy'],
    ['tsf-recursive-error-propagation-diagnosis'],
  ),
  competency(
    'tsf-prediction-interval-coverage',
    ['tsf-043-coverage'],
    ['tsf-prediction-interval-coverage-worked'],
  ),
  competency(
    'tsf-future-exogenous-feature-availability',
    ['tsf-038-exogenous-availability'],
    ['tsf-future-exogenous-availability-decision'],
  ),
]);
