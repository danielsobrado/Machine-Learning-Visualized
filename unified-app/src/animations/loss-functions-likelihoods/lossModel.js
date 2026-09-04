const LOG_2PI = Math.log(2 * Math.PI);

function assertPositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

export function gaussianNll(residual, sigma) {
  assertFinite(residual, 'residual');
  assertPositive(sigma, 'sigma');
  return 0.5 * LOG_2PI + Math.log(sigma) + (residual ** 2) / (2 * sigma ** 2);
}

export function laplaceNll(residual, scale) {
  assertFinite(residual, 'residual');
  assertPositive(scale, 'scale');
  return Math.log(2 * scale) + Math.abs(residual) / scale;
}

export function softplus(value) {
  assertFinite(value, 'value');
  if (value > 0) return value + Math.log1p(Math.exp(-value));
  return Math.log1p(Math.exp(value));
}

export function sigmoid(value) {
  assertFinite(value, 'value');
  if (value >= 0) {
    const exp = Math.exp(-value);
    return 1 / (1 + exp);
  }
  const exp = Math.exp(value);
  return exp / (1 + exp);
}

export function bernoulliNllFromLogit(label, logit) {
  if (label !== 0 && label !== 1) throw new RangeError('label must be zero or one');
  assertFinite(logit, 'logit');
  return softplus(logit) - label * logit;
}

export function gaussianScaleMle(residuals) {
  if (!Array.isArray(residuals) || residuals.length === 0) throw new TypeError('residuals must be non-empty');
  if (residuals.some((value) => !Number.isFinite(value))) throw new TypeError('residuals must be finite');
  const meanSquare = residuals.reduce((sum, value) => sum + value ** 2, 0) / residuals.length;
  return Math.sqrt(meanSquare);
}

export function laplaceScaleMle(residuals) {
  if (!Array.isArray(residuals) || residuals.length === 0) throw new TypeError('residuals must be non-empty');
  if (residuals.some((value) => !Number.isFinite(value))) throw new TypeError('residuals must be finite');
  return residuals.reduce((sum, value) => sum + Math.abs(value), 0) / residuals.length;
}

export function regressionRows(points, slope, intercept, outlierOn = false) {
  assertFinite(slope, 'slope');
  assertFinite(intercept, 'intercept');
  return points.map((point) => {
    const y = outlierOn && point.id === 'E' ? point.y + 2.1 : point.y;
    const prediction = intercept + slope * point.x;
    const residual = y - prediction;
    return { ...point, y, prediction, residual };
  });
}

export function regressionNll(rows, mode, scale) {
  if (!Array.isArray(rows) || rows.length === 0) throw new TypeError('rows must be non-empty');
  if (mode === 'gaussian') return rows.reduce((sum, row) => sum + gaussianNll(row.residual, scale), 0);
  if (mode === 'laplace') return rows.reduce((sum, row) => sum + laplaceNll(row.residual, scale), 0);
  throw new RangeError(`unsupported regression mode: ${mode}`);
}

export function classificationRows(points, logitScale, bias, flippedLabel = false) {
  assertFinite(logitScale, 'logitScale');
  assertFinite(bias, 'bias');
  return points.map((point) => {
    const y = flippedLabel && point.id === 'D' ? 1 : point.y;
    const logit = (point.score - 0.5) * logitScale + bias;
    const probability = sigmoid(logit);
    const nll = bernoulliNllFromLogit(y, logit);
    const predicted = probability >= 0.5 ? 1 : 0;
    return { ...point, y, logit, probability, nll, error: predicted === y ? 0 : 1 };
  });
}

export function classificationNll(rows) {
  return rows.reduce((sum, row) => sum + row.nll, 0);
}

export function negativeLogLikelihoodToRelativeLikelihood(nll, bestNll) {
  assertFinite(nll, 'nll');
  assertFinite(bestNll, 'bestNll');
  return Math.exp(Math.min(0, bestNll - nll));
}

export function regressionSlopeSweep({ points, mode, intercept, scale, outlierOn }) {
  const candidates = Array.from({ length: 71 }, (_, index) => 0.3 + index * 0.02);
  const rows = candidates.map((slope) => ({
    slope,
    nll: regressionNll(regressionRows(points, slope, intercept, outlierOn), mode, scale),
  }));
  const best = rows.reduce((current, item) => item.nll < current.nll ? item : current, rows[0]);
  return { rows, best };
}

export function classificationBiasSweep({ points, logitScale, flippedLabel }) {
  const candidates = Array.from({ length: 81 }, (_, index) => -2 + index * 0.05);
  const rows = candidates.map((bias) => ({
    bias,
    nll: classificationNll(classificationRows(points, logitScale, bias, flippedLabel)),
  }));
  const best = rows.reduce((current, item) => item.nll < current.nll ? item : current, rows[0]);
  return { rows, best };
}

export function buildLossLab({
  regressionPoints,
  classificationPoints,
  mode,
  slope,
  intercept,
  gaussianSigma,
  laplaceScale,
  logitScale,
  bias,
  outlierOn,
  flippedLabel,
}) {
  const regression = regressionRows(regressionPoints, slope, intercept, outlierOn);
  const residuals = regression.map((row) => row.residual);
  const gaussianMle = Math.max(gaussianScaleMle(residuals), 1e-9);
  const laplaceMle = Math.max(laplaceScaleMle(residuals), 1e-9);
  const classification = classificationRows(classificationPoints, logitScale, bias, flippedLabel);

  if (mode === 'bernoulli') {
    const sweep = classificationBiasSweep({ points: classificationPoints, logitScale, flippedLabel });
    return {
      mode,
      classification,
      activeNll: classificationNll(classification),
      errors: classification.reduce((sum, row) => sum + row.error, 0),
      sweep,
      best: sweep.best,
    };
  }

  const activeScale = mode === 'gaussian' ? gaussianSigma : laplaceScale;
  const activeNll = regressionNll(regression, mode, activeScale);
  const scaleMle = mode === 'gaussian' ? gaussianMle : laplaceMle;
  const mleNll = regressionNll(regression, mode, scaleMle);
  const sweep = regressionSlopeSweep({
    points: regressionPoints,
    mode,
    intercept,
    scale: activeScale,
    outlierOn,
  });

  return {
    mode,
    regression,
    activeScale,
    activeNll,
    scaleMle,
    mleNll,
    gaussianMle,
    laplaceMle,
    sweep,
    best: sweep.best,
  };
}
