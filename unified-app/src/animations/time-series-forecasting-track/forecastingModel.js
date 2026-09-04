import {
  MIN_TRAIN_POINTS,
  MODEL_DEFINITIONS,
  SEASON_PERIOD,
  SERIES_LENGTH,
} from './forecastingConfig.js';

const BASE_LEVEL = 50;
const REGIME_SHIFT_INDEX = SERIES_LENGTH - 24;
const EPSILON = 1e-9;

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function generateSeries({ seasonality, trend, noise, regimeShift }) {
  return Array.from({ length: SERIES_LENGTH }, (_, index) => {
    const seasonal = seasonality * Math.sin((2 * Math.PI * index) / SEASON_PERIOD);
    const deterministicNoise = noise * (
      0.62 * Math.sin(index * 1.73 + 0.4)
      + 0.38 * Math.sin(index * 0.47 + 1.1)
    );
    const shiftProgress = index < REGIME_SHIFT_INDEX
      ? 0
      : 1 - Math.exp(-(index - REGIME_SHIFT_INDEX + 1) / 5);

    return {
      index,
      value: BASE_LEVEL + trend * index + seasonal + deterministicNoise + regimeShift * shiftProgress,
    };
  });
}

function fitLinearTrend(history) {
  const xMean = mean(history.map((point) => point.index));
  const yMean = mean(history.map((point) => point.value));
  const numerator = history.reduce(
    (sum, point) => sum + (point.index - xMean) * (point.value - yMean),
    0,
  );
  const denominator = history.reduce(
    (sum, point) => sum + (point.index - xMean) ** 2,
    0,
  );
  const slope = denominator <= EPSILON ? 0 : numerator / denominator;
  return { slope, intercept: yMean - slope * xMean };
}

function fitSeasonalOffsets(history, trendModel) {
  const buckets = Array.from({ length: SEASON_PERIOD }, () => []);
  history.forEach((point) => {
    const trendValue = trendModel.intercept + trendModel.slope * point.index;
    buckets[point.index % SEASON_PERIOD].push(point.value - trendValue);
  });
  return buckets.map((bucket) => mean(bucket));
}

export function forecastAtOrigin(series, origin, horizon, modelId) {
  if (origin < MIN_TRAIN_POINTS || origin + horizon > series.length) {
    throw new RangeError('Forecast origin or horizon is outside the supported series window.');
  }

  const history = series.slice(0, origin);
  const trendModel = modelId === 'trend-seasonal' ? fitLinearTrend(history) : null;
  const seasonalOffsets = trendModel ? fitSeasonalOffsets(history, trendModel) : null;

  return Array.from({ length: horizon }, (_, step) => {
    const targetIndex = origin + step;
    let value;

    if (modelId === 'naive') {
      value = history.at(-1).value;
    } else if (modelId === 'seasonal-naive') {
      const sourceIndex = targetIndex - SEASON_PERIOD;
      value = sourceIndex < origin
        ? series[sourceIndex].value
        : series[origin - SEASON_PERIOD + (step % SEASON_PERIOD)].value;
    } else if (modelId === 'trend-seasonal') {
      value = trendModel.intercept
        + trendModel.slope * targetIndex
        + seasonalOffsets[targetIndex % SEASON_PERIOD];
    } else {
      throw new RangeError(`Unknown forecasting model: ${modelId}`);
    }

    return { index: targetIndex, value };
  });
}

function scaleError(training) {
  if (training.length < 2) return 1;
  const differences = training.slice(1).map(
    (point, index) => Math.abs(point.value - training[index].value),
  );
  return Math.max(EPSILON, mean(differences));
}

export function calculateMetrics(actual, predicted, training) {
  if (actual.length !== predicted.length || actual.length === 0) {
    throw new RangeError('Actual and predicted series must have the same non-zero length.');
  }

  const errors = actual.map((point, index) => point.value - predicted[index].value);
  const absoluteErrors = errors.map(Math.abs);
  const squaredErrors = errors.map((error) => error ** 2);
  const mae = mean(absoluteErrors);

  return {
    mae: round(mae),
    rmse: round(Math.sqrt(mean(squaredErrors))),
    mase: round(mae / scaleError(training)),
    bias: round(mean(errors)),
  };
}

export function evaluateAtOrigin(series, origin, horizon) {
  const actual = series.slice(origin, origin + horizon);
  const training = series.slice(0, origin);
  return MODEL_DEFINITIONS.map((model) => {
    const forecast = forecastAtOrigin(series, origin, horizon, model.id);
    return {
      ...model,
      forecast,
      metrics: calculateMetrics(actual, forecast, training),
    };
  });
}

export function rollingBacktest(series, horizon, folds) {
  return Array.from({ length: folds }, (_, foldIndex) => {
    const origin = series.length - horizon * (folds - foldIndex);
    if (origin < MIN_TRAIN_POINTS) {
      throw new RangeError('Too many folds for the selected forecast horizon.');
    }

    return {
      fold: foldIndex + 1,
      origin,
      testStart: origin,
      testEnd: origin + horizon - 1,
      models: evaluateAtOrigin(series, origin, horizon),
    };
  });
}

export function summarizeBacktests(backtests) {
  return MODEL_DEFINITIONS.map((model) => {
    const foldMetrics = backtests.map(
      (fold) => fold.models.find((candidate) => candidate.id === model.id).metrics,
    );
    const maes = foldMetrics.map((metrics) => metrics.mae);
    return {
      ...model,
      mae: round(mean(maes)),
      mase: round(mean(foldMetrics.map((metrics) => metrics.mase))),
      bestMae: round(Math.min(...maes)),
      worstMae: round(Math.max(...maes)),
      spread: round(Math.max(...maes) - Math.min(...maes)),
    };
  });
}

export function calculateLeakageTrap(series, origin, horizon) {
  const usableEnd = Math.min(series.length - 1, origin + horizon);
  const actual = series.slice(origin, usableEnd);
  const predictions = actual.map((point) => ({
    index: point.index,
    value: (series[point.index - 1].value + series[point.index + 1].value) / 2,
  }));

  return {
    ...calculateMetrics(actual, predictions, series.slice(0, origin)),
    observations: actual.length,
  };
}

export function buildForecastLab(scenario) {
  const series = generateSeries(scenario);
  const origin = series.length - scenario.horizon;
  const holdout = evaluateAtOrigin(series, origin, scenario.horizon);
  const backtests = rollingBacktest(series, scenario.horizon, scenario.folds);
  const backtestSummary = summarizeBacktests(backtests);
  const selected = holdout.find((model) => model.id === scenario.modelId) || holdout[0];
  const selectedBacktest = backtestSummary.find((model) => model.id === selected.id);
  const winner = [...backtestSummary].sort((a, b) => a.mae - b.mae)[0];

  return {
    series,
    origin,
    actual: series.slice(origin),
    holdout,
    backtests,
    backtestSummary,
    selected,
    selectedBacktest,
    winner,
    leakage: calculateLeakageTrap(series, origin, scenario.horizon),
  };
}
