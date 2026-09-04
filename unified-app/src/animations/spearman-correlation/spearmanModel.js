function validateSeries(values, name) {
  if (!Array.isArray(values) || values.length < 2 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must contain at least two finite values`);
  }
}

function validatePair(x, y) {
  validateSeries(x, 'x');
  validateSeries(y, 'y');
  if (x.length !== y.length) throw new RangeError('x and y must have equal length');
}

export function averageRanks(values) {
  validateSeries(values, 'values');
  const indexed = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const ranks = Array(values.length);
  let start = 0;
  while (start < indexed.length) {
    let end = start;
    while (end + 1 < indexed.length && indexed[end + 1].value === indexed[start].value) end += 1;
    const average = ((start + 1) + (end + 1)) / 2;
    for (let index = start; index <= end; index += 1) ranks[indexed[index].index] = average;
    start = end + 1;
  }
  return ranks;
}

export function hasTies(values) {
  validateSeries(values, 'values');
  return new Set(values).size !== values.length;
}

export function pearsonCorrelation(x, y) {
  validatePair(x, y);
  const meanX = x.reduce((sum, value) => sum + value, 0) / x.length;
  const meanY = y.reduce((sum, value) => sum + value, 0) / y.length;
  let covariance = 0;
  let varianceX = 0;
  let varianceY = 0;
  for (let index = 0; index < x.length; index += 1) {
    const dx = x[index] - meanX;
    const dy = y[index] - meanY;
    covariance += dx * dy;
    varianceX += dx ** 2;
    varianceY += dy ** 2;
  }
  if (varianceX === 0 || varianceY === 0) return null;
  return covariance / Math.sqrt(varianceX * varianceY);
}

export function spearmanCorrelation(x, y) {
  validatePair(x, y);
  return pearsonCorrelation(averageRanks(x), averageRanks(y));
}

export function noTiesShortcut(x, y) {
  validatePair(x, y);
  if (hasTies(x) || hasTies(y)) return null;
  const rankX = averageRanks(x);
  const rankY = averageRanks(y);
  const sumD2 = rankX.reduce((sum, value, index) => sum + (value - rankY[index]) ** 2, 0);
  const n = x.length;
  return 1 - (6 * sumD2) / (n * (n ** 2 - 1));
}

export function rankRows(x, y) {
  validatePair(x, y);
  const rankX = averageRanks(x);
  const rankY = averageRanks(y);
  return x.map((value, index) => {
    const d = rankX[index] - rankY[index];
    return { index, x: value, y: y[index], rankX: rankX[index], rankY: rankY[index], d, d2: d ** 2 };
  });
}

export function strictlyIncreasingTransform(values) {
  validateSeries(values, 'values');
  return values.map((value) => Math.exp(value / 10));
}

export function buildSpearmanLab({ x, y, outlierMultiplier = 1 }) {
  validatePair(x, y);
  if (!Number.isFinite(outlierMultiplier) || outlierMultiplier <= 0) throw new RangeError('outlierMultiplier must be positive');
  const adjustedY = [...y];
  if (outlierMultiplier !== 1) adjustedY[adjustedY.length - 1] *= outlierMultiplier;
  const rows = rankRows(x, adjustedY);
  const pearson = pearsonCorrelation(x, adjustedY);
  const spearman = spearmanCorrelation(x, adjustedY);
  const transformedX = strictlyIncreasingTransform(x);
  const transformedSpearman = spearmanCorrelation(transformedX, adjustedY);
  const shortcut = noTiesShortcut(x, adjustedY);

  return {
    x,
    y: adjustedY,
    rows,
    pearson,
    spearman,
    shortcut,
    hasTies: hasTies(x) || hasTies(adjustedY),
    transformedX,
    transformedSpearman,
    sumD2: rows.reduce((sum, row) => sum + row.d2, 0),
  };
}
