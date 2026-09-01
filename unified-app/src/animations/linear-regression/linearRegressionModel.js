import { LINEAR_REGRESSION_DIAGNOSTIC_THRESHOLDS } from './linearRegressionConstants.js';

export const LINEAR_REGRESSION_DEMO_DATA = Object.freeze([
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 6 },
]);

export function predict({ slope, intercept }, x) {
  return slope * x + intercept;
}

export function calculateResiduals(data, model) {
  let totalSquaredError = 0;
  const residuals = data.map((point) => {
    const predictedY = predict(model, point.x);
    const error = point.y - predictedY;
    totalSquaredError += error * error;
    return { ...point, predictedY, error };
  });

  return {
    residuals,
    mse: data.length ? totalSquaredError / data.length : 0,
    sse: totalSquaredError,
  };
}

export function calculateMSE(data, model) {
  return calculateResiduals(data, model).mse;
}

export function calculateOLS(points) {
  if (points.length < 2) return null;

  const n = points.length;
  const meanX = mean(points.map((point) => point.x));
  const meanY = mean(points.map((point) => point.y));
  const sxx = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  if (sxx < 1e-12) return null;

  const sxy = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
  const slope = sxy / sxx;
  return { slope, intercept: meanY - slope * meanX };
}

export function calculateFitMetrics(data, model = calculateOLS(data)) {
  if (!model || !data.length) return null;
  const { residuals, mse, sse } = calculateResiduals(data, model);
  const meanY = mean(data.map((point) => point.y));
  const totalSumSquares = data.reduce((sum, point) => sum + (point.y - meanY) ** 2, 0);
  const mae = mean(residuals.map((point) => Math.abs(point.error)));

  return {
    model,
    residuals,
    mse,
    rmse: Math.sqrt(mse),
    mae,
    r2: totalSumSquares < 1e-12 ? null : 1 - sse / totalSumSquares,
  };
}

export function calculateResidualSpreadBins(data, model = calculateOLS(data), binCount = 3) {
  if (!model || !data.length) return [];
  const residuals = calculateResiduals(data, model).residuals.sort((a, b) => a.x - b.x);
  const bins = [];

  for (let index = 0; index < binCount; index += 1) {
    const start = Math.floor((index * residuals.length) / binCount);
    const end = Math.floor(((index + 1) * residuals.length) / binCount);
    const rows = residuals.slice(start, end);
    if (!rows.length) continue;
    const rmse = Math.sqrt(mean(rows.map((row) => row.error ** 2)));
    bins.push({
      index,
      count: rows.length,
      minX: rows[0].x,
      maxX: rows[rows.length - 1].x,
      rmse,
      meanAbsoluteResidual: mean(rows.map((row) => Math.abs(row.error))),
    });
  }

  return bins;
}

export function diagnoseResidualPattern(data, model = calculateOLS(data)) {
  const fit = calculateFitMetrics(data, model);
  if (!fit) return null;
  const spreadBins = calculateResidualSpreadBins(data, model, 3);
  const spreads = spreadBins.map((bin) => bin.rmse).filter((value) => value > 1e-12);
  const spreadRatio = spreads.length ? Math.max(...spreads) / Math.min(...spreads) : 1;
  const meanX = mean(data.map((point) => point.x));
  const curvatureBasis = fit.residuals.map((point) => (point.x - meanX) ** 2);
  const curvatureCorrelation = correlation(fit.residuals.map((point) => point.error), curvatureBasis);

  let status = 'well-behaved';
  if (Math.abs(curvatureCorrelation) >= LINEAR_REGRESSION_DIAGNOSTIC_THRESHOLDS.nonlinearCorrelation) {
    status = 'nonlinear';
  } else if (spreadRatio >= LINEAR_REGRESSION_DIAGNOSTIC_THRESHOLDS.heteroscedasticSpreadRatio) {
    status = 'heteroscedastic';
  }

  return { ...fit, spreadBins, spreadRatio, curvatureCorrelation, status };
}

export function calculateInfluence(points, model = calculateOLS(points)) {
  if (!model || points.length <= 2) return [];
  const n = points.length;
  const parameterCount = 2;
  const meanX = mean(points.map((point) => point.x));
  const sxx = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
  if (sxx < 1e-12) return [];

  const { residuals, sse } = calculateResiduals(points, model);
  const residualVariance = sse / (n - parameterCount);

  return residuals.map((point, index) => {
    const leverage = 1 / n + ((point.x - meanX) ** 2) / sxx;
    const residualScale = residualVariance > 0 ? Math.sqrt(residualVariance * Math.max(1 - leverage, 1e-12)) : 0;
    const standardizedResidual = residualScale > 0 ? point.error / residualScale : 0;
    const cooksDistance = residualVariance > 0
      ? ((point.error ** 2) / (parameterCount * residualVariance)) * (leverage / Math.max((1 - leverage) ** 2, 1e-12))
      : 0;
    const withoutPoint = points.filter((_, rowIndex) => rowIndex !== index);
    const leaveOneOutModel = calculateOLS(withoutPoint);

    return {
      ...point,
      leverage,
      standardizedResidual,
      cooksDistance,
      leaveOneOutModel,
      slopeShift: leaveOneOutModel ? model.slope - leaveOneOutModel.slope : 0,
      interceptShift: leaveOneOutModel ? model.intercept - leaveOneOutModel.intercept : 0,
    };
  });
}

export function influenceThresholds(sampleSize) {
  const parameterCount = 2;
  return {
    standardizedResidual: LINEAR_REGRESSION_DIAGNOSTIC_THRESHOLDS.standardizedResidual,
    leverage: (LINEAR_REGRESSION_DIAGNOSTIC_THRESHOLDS.leverageMultiplier * parameterCount) / sampleSize,
    cooksDistance: LINEAR_REGRESSION_DIAGNOSTIC_THRESHOLDS.cooksDistanceMultiplier / sampleSize,
  };
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function correlation(left, right) {
  if (left.length !== right.length || left.length < 2) return 0;
  const leftMean = mean(left);
  const rightMean = mean(right);
  const numerator = left.reduce((sum, value, index) => sum + (value - leftMean) * (right[index] - rightMean), 0);
  const leftSumSquares = left.reduce((sum, value) => sum + (value - leftMean) ** 2, 0);
  const rightSumSquares = right.reduce((sum, value) => sum + (value - rightMean) ** 2, 0);
  const denominator = Math.sqrt(leftSumSquares * rightSumSquares);
  return denominator < 1e-12 ? 0 : numerator / denominator;
}
