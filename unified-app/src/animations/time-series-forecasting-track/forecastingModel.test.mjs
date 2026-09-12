import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_SCENARIO,
  RECURSIVE_FORECAST_DEMO,
  SEASON_PERIOD,
  SERIES_LENGTH,
} from './forecastingConfig.js';
import {
  buildFutureCovariateDemo,
  buildRecursiveForecastDemo,
  fitAutoregression,
  recursiveForecast,
  teacherForcedForecast,
} from './forecastingEmpiricalLabs.js';
import {
  buildForecastLab,
  forecastAtOrigin,
  generateSeries,
  rollingBacktest,
} from './forecastingModel.js';

test('series generation is deterministic and keeps the configured length', () => {
  const first = generateSeries(DEFAULT_SCENARIO);
  const second = generateSeries(DEFAULT_SCENARIO);
  assert.equal(first.length, SERIES_LENGTH);
  assert.deepEqual(first, second);
});

test('seasonal naive is exact for a noiseless stationary seasonal signal', () => {
  const series = generateSeries({ seasonality: 14, trend: 0, noise: 0, regimeShift: 0 });
  const origin = series.length - SEASON_PERIOD;
  const forecast = forecastAtOrigin(series, origin, SEASON_PERIOD, 'seasonal-naive');
  forecast.forEach((point, index) => {
    assert.ok(Math.abs(point.value - series[origin + index].value) < 1e-9);
  });
});

test('rolling backtests keep strictly chronological origins', () => {
  const series = generateSeries(DEFAULT_SCENARIO);
  const folds = rollingBacktest(series, 12, 5);
  assert.deepEqual(folds.map((fold) => fold.origin), [48, 60, 72, 84, 96]);
  folds.forEach((fold) => assert.ok(fold.testStart >= fold.origin));
});

test('a seasonal baseline beats naive on a clean seasonal series', () => {
  const lab = buildForecastLab({
    ...DEFAULT_SCENARIO,
    seasonality: 16,
    trend: 0,
    noise: 0,
    regimeShift: 0,
    modelId: 'seasonal-naive',
  });
  const naive = lab.holdout.find((model) => model.id === 'naive');
  const seasonal = lab.holdout.find((model) => model.id === 'seasonal-naive');
  assert.ok(seasonal.metrics.mae < naive.metrics.mae);
  assert.equal(seasonal.metrics.mae, 0);
});

test('leakage trap is explicitly separate from deployable model results', () => {
  const lab = buildForecastLab(DEFAULT_SCENARIO);
  assert.ok(Number.isFinite(lab.leakage.mae));
  assert.equal(lab.leakage.observations, DEFAULT_SCENARIO.horizon - 1);
  assert.ok(lab.holdout.every((model) => model.id !== 'leaky-centered-window'));
});

test('recursive deployment never reads future actual values', () => {
  const config = RECURSIVE_FORECAST_DEMO;
  const series = generateSeries(config.scenario);
  const model = fitAutoregression(series, config.origin, config.lags, config.ridge);
  const history = series.slice(0, config.origin);
  const baseline = recursiveForecast(history, model, config.horizon);
  const mutatedFuture = series.map((point, index) => (
    index < config.origin ? point : { ...point, value: point.value + 1000 }
  ));

  assert.deepEqual(recursiveForecast(history, model, config.horizon), baseline);
  assert.notDeepEqual(
    teacherForcedForecast(mutatedFuture, model, config.horizon),
    teacherForcedForecast(series, model, config.horizon),
  );
});

test('teacher forcing hides recursive multi-step error accumulation', () => {
  const demo = buildRecursiveForecastDemo();
  assert.ok(demo.teacherMae < demo.recursiveMae);
  assert.ok(demo.lateRecursiveMae > demo.earlyRecursiveMae);
  assert.equal(demo.rows.length, RECURSIVE_FORECAST_DEMO.horizon);
});

test('future-covariate oracle is better only because it uses unavailable information', () => {
  const demo = buildFutureCovariateDemo();
  assert.ok(demo.oracle.mae < demo.safe.mae);
  assert.ok(demo.availability.some((item) => item.feature === 'realized traffic' && !item.safe));
  assert.ok(demo.availability.filter((item) => item.safe).every((item) => item.status.includes('ahead')));
});
