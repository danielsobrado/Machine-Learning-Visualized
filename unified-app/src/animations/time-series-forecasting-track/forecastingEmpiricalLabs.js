import {
  FUTURE_COVARIATE_DEMO,
  RECURSIVE_FORECAST_DEMO,
} from './forecastingConfig.js';
import { generateSeries } from './forecastingModel.js';

const EPSILON = 1e-10;

function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite.`);
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) throw new RangeError(`${name} must be a positive integer.`);
}

function mean(values) {
  if (!Array.isArray(values) || values.length === 0) throw new RangeError('mean requires at least one value.');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function mae(actual, predicted) {
  if (actual.length !== predicted.length || actual.length === 0) {
    throw new RangeError('actual and predicted must have the same non-zero length.');
  }
  return mean(actual.map((value, index) => Math.abs(value - predicted[index])));
}

function solveLinearSystem(matrix, vector) {
  const size = vector.length;
  if (matrix.length !== size || matrix.some((row) => row.length !== size)) {
    throw new RangeError('linear system must be square.');
  }
  const augmented = matrix.map((row, index) => [...row, vector[index]]);

  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    if (Math.abs(augmented[pivot][column]) <= EPSILON) throw new RangeError('linear system is singular.');
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];

    const divisor = augmented[column][column];
    for (let item = column; item <= size; item += 1) augmented[column][item] /= divisor;

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let item = column; item <= size; item += 1) {
        augmented[row][item] -= factor * augmented[column][item];
      }
    }
  }

  return augmented.map((row) => row[size]);
}

function fitRidge(design, targets, ridge = 0) {
  if (!Array.isArray(design) || design.length === 0 || design.length !== targets.length) {
    throw new RangeError('design and targets must have the same non-zero length.');
  }
  assertFinite(ridge, 'ridge');
  if (ridge < 0) throw new RangeError('ridge must be non-negative.');
  const width = design[0].length;
  if (width === 0 || design.some((row) => row.length !== width || row.some((value) => !Number.isFinite(value)))) {
    throw new TypeError('design rows must contain the same finite features.');
  }
  if (targets.some((value) => !Number.isFinite(value))) throw new TypeError('targets must be finite.');

  const gram = Array.from({ length: width }, () => Array(width).fill(0));
  const rhs = Array(width).fill(0);
  for (let row = 0; row < design.length; row += 1) {
    for (let column = 0; column < width; column += 1) {
      rhs[column] += design[row][column] * targets[row];
      for (let other = 0; other < width; other += 1) {
        gram[column][other] += design[row][column] * design[row][other];
      }
    }
  }
  for (let column = 1; column < width; column += 1) gram[column][column] += ridge;
  return solveLinearSystem(gram, rhs);
}

function validateSeries(series) {
  if (!Array.isArray(series) || series.length === 0) throw new RangeError('series must contain observations.');
  series.forEach((point, index) => {
    if (!point || !Number.isFinite(point.value)) throw new TypeError(`series[${index}].value must be finite.`);
  });
}

export function fitAutoregression(series, origin, lags, ridge = 0) {
  validateSeries(series);
  assertPositiveInteger(origin, 'origin');
  if (!Array.isArray(lags) || lags.length === 0 || lags.some((lag) => !Number.isInteger(lag) || lag < 1)) {
    throw new RangeError('lags must contain positive integers.');
  }
  if (new Set(lags).size !== lags.length) throw new RangeError('lags must be unique.');
  const maxLag = Math.max(...lags);
  if (origin > series.length || origin <= maxLag) throw new RangeError('origin must leave enough historical lag rows.');

  const design = [];
  const targets = [];
  for (let index = maxLag; index < origin; index += 1) {
    design.push([1, ...lags.map((lag) => series[index - lag].value)]);
    targets.push(series[index].value);
  }
  return { lags: [...lags], coefficients: fitRidge(design, targets, ridge), origin };
}

function autoregressiveValue(values, targetIndex, model) {
  return model.coefficients[0] + model.lags.reduce(
    (sum, lag, index) => sum + model.coefficients[index + 1] * values[targetIndex - lag],
    0,
  );
}

export function recursiveForecast(history, model, horizon) {
  validateSeries(history);
  assertPositiveInteger(horizon, 'horizon');
  if (history.length !== model.origin) throw new RangeError('history must end exactly at the fitted forecast origin.');
  const values = history.map((point) => point.value);
  const forecast = [];
  for (let step = 0; step < horizon; step += 1) {
    const targetIndex = model.origin + step;
    const value = autoregressiveValue(values, targetIndex, model);
    values.push(value);
    forecast.push({ index: targetIndex, value });
  }
  return forecast;
}

export function teacherForcedForecast(series, model, horizon) {
  validateSeries(series);
  assertPositiveInteger(horizon, 'horizon');
  if (model.origin + horizon > series.length) throw new RangeError('teacher-forced evaluation exceeds the available series.');
  const actualValues = series.map((point) => point.value);
  return Array.from({ length: horizon }, (_, step) => {
    const index = model.origin + step;
    return { index, value: autoregressiveValue(actualValues, index, model) };
  });
}

export function buildRecursiveForecastDemo(config = RECURSIVE_FORECAST_DEMO) {
  const series = generateSeries(config.scenario);
  const { origin, horizon, lags, ridge } = config;
  const model = fitAutoregression(series, origin, lags, ridge);
  const recursive = recursiveForecast(series.slice(0, origin), model, horizon);
  const teacherForced = teacherForcedForecast(series, model, horizon);
  const actual = series.slice(origin, origin + horizon);
  const rows = actual.map((point, index) => ({
    horizon: index + 1,
    actual: point.value,
    teacherForced: teacherForced[index].value,
    recursive: recursive[index].value,
    teacherError: Math.abs(point.value - teacherForced[index].value),
    recursiveError: Math.abs(point.value - recursive[index].value),
  }));

  return {
    model,
    rows,
    teacherMae: mae(actual.map((point) => point.value), teacherForced.map((point) => point.value)),
    recursiveMae: mae(actual.map((point) => point.value), recursive.map((point) => point.value)),
    lateRecursiveMae: mean(rows.slice(Math.floor(rows.length / 2)).map((row) => row.recursiveError)),
    earlyRecursiveMae: mean(rows.slice(0, Math.floor(rows.length / 2)).map((row) => row.recursiveError)),
  };
}

export function generateFutureCovariateSeries(config = FUTURE_COVARIATE_DEMO) {
  assertPositiveInteger(config.length, 'length');
  assertPositiveInteger(config.origin, 'origin');
  assertPositiveInteger(config.seasonalPeriod, 'seasonalPeriod');
  if (config.origin >= config.length) throw new RangeError('origin must be before the end of the covariate series.');

  return Array.from({ length: config.length }, (_, index) => {
    const phase = (2 * Math.PI * index) / config.seasonalPeriod;
    const promoPlan = index % config.seasonalPeriod === 2 || index % config.seasonalPeriod === 3 ? 1 : 0;
    const realizedTraffic = 20
      + 4 * Math.sin(0.73 * index + 0.2)
      + 3 * Math.cos(0.31 * index + 1.3);
    const noise = 0.8 * Math.sin(1.91 * index + 0.4);
    const target = 35
      + 0.18 * index
      + 5 * Math.sin(phase)
      + 7 * promoPlan
      + 1.15 * realizedTraffic
      + noise;
    return { index, phase, promoPlan, realizedTraffic, target };
  });
}

function safeCovariateFeatures(row) {
  return [1, row.index, Math.sin(row.phase), Math.cos(row.phase), row.promoPlan];
}

function oracleCovariateFeatures(row) {
  return [...safeCovariateFeatures(row), row.realizedTraffic];
}

function fitAndScoreCovariateModel(training, holdout, featureFn, ridge) {
  const coefficients = fitRidge(training.map(featureFn), training.map((row) => row.target), ridge);
  const predictions = holdout.map((row) => featureFn(row).reduce(
    (sum, value, index) => sum + value * coefficients[index],
    0,
  ));
  return {
    coefficients,
    predictions,
    mae: mae(holdout.map((row) => row.target), predictions),
  };
}

export function buildFutureCovariateDemo(config = FUTURE_COVARIATE_DEMO) {
  const series = generateFutureCovariateSeries(config);
  const training = series.slice(0, config.origin);
  const holdout = series.slice(config.origin);
  const safe = fitAndScoreCovariateModel(training, holdout, safeCovariateFeatures, config.ridge);
  const oracle = fitAndScoreCovariateModel(training, holdout, oracleCovariateFeatures, config.ridge);
  return {
    training,
    holdout,
    safe,
    oracle,
    availability: [
      { feature: 'calendar phase', status: 'known ahead', safe: true },
      { feature: 'promotion plan', status: 'scheduled ahead', safe: true },
      { feature: 'realized traffic', status: 'observed during target period', safe: false },
    ],
  };
}
