export const BASE_POINTS = Object.freeze([
  { id: 'A', age: 23, income: 38000, split: 'train', label: 'student' },
  { id: 'B', age: 31, income: 52000, split: 'train', label: 'early career' },
  { id: 'C', age: 42, income: 76000, split: 'train', label: 'manager' },
  { id: 'D', age: 53, income: 94000, split: 'train', label: 'senior' },
  { id: 'E', age: 61, income: 112000, split: 'validation', label: 'director' },
  { id: 'F', age: 35, income: 58000, split: 'validation', label: 'analyst' },
]);

export const OUTLIER = Object.freeze({
  id: 'G',
  age: 64,
  income: 235000,
  label: 'outlier',
});

export const DECISION_QUERY = Object.freeze({
  id: 'Q',
  age: 40,
  income: 60000,
  label: 'new applicant',
});

export const OUTLIER_SPLITS = Object.freeze(['train', 'validation']);

export const METHODS = Object.freeze({
  raw: {
    label: 'Raw',
    formula: 'x',
    detail: 'No fitted transform: raw dollars dominate Euclidean distance beside age measured in years.',
  },
  standard: {
    label: 'Standardize',
    formula: '(x - mean) / std',
    detail: 'Centers each feature and expresses values in training-standard-deviation units.',
  },
  minmax: {
    label: 'Min-max',
    formula: '(x - min) / (max - min)',
    detail: 'Maps the fitted training range to 0–1; held-out values can fall outside that interval.',
  },
  robust: {
    label: 'Robust',
    formula: '(x - median) / IQR',
    detail: 'Uses the training median and IQR to protect the fitted center and scale from extremes; it does not clip or remove the outliers themselves.',
  },
});

const PLOT_VIEWPORT = Object.freeze({ width: 360, height: 260, pad: 34 });

export function buildPoints(includeOutlier, outlierSplit = 'train') {
  if (!OUTLIER_SPLITS.includes(outlierSplit)) {
    throw new Error(`Unsupported outlier split: ${outlierSplit}`);
  }

  if (!includeOutlier) return [...BASE_POINTS];
  return [...BASE_POINTS, { ...OUTLIER, split: outlierSplit }];
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

export function stats(values) {
  if (!values.length) throw new Error('Cannot compute feature statistics from an empty sample.');

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const q1 = percentile(values, 0.25);
  const q3 = percentile(values, 0.75);
  return {
    mean,
    std: Math.sqrt(variance) || 1,
    min: Math.min(...values),
    max: Math.max(...values),
    median: median(values),
    iqr: q3 - q1 || 1,
  };
}

export function fitScaler(points, fitOnAllData = false) {
  const fitPoints = fitOnAllData ? points : points.filter((point) => point.split === 'train');
  return {
    age: stats(fitPoints.map((point) => point.age)),
    income: stats(fitPoints.map((point) => point.income)),
  };
}

export function transformValue(value, featureStats, method) {
  assertMethod(method);
  if (method === 'standard') return (value - featureStats.mean) / featureStats.std;
  if (method === 'minmax') return (value - featureStats.min) / (featureStats.max - featureStats.min || 1);
  if (method === 'robust') return (value - featureStats.median) / featureStats.iqr;
  return value;
}

export function transformPoint(point, scaler, method) {
  return {
    ...point,
    x: transformValue(point.age, scaler.age, method),
    y: transformValue(point.income, scaler.income, method),
  };
}

export function distanceBreakdown(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const xSquared = dx ** 2;
  const ySquared = dy ** 2;
  const totalSquared = xSquared + ySquared;

  return {
    dx,
    dy,
    distance: Math.sqrt(totalSquared),
    xShare: totalSquared ? xSquared / totalSquared : 0,
    yShare: totalSquared ? ySquared / totalSquared : 0,
  };
}

export function nearestTrainingNeighbor(points, scaler, method, query = DECISION_QUERY) {
  assertMethod(method);
  const trainingPoints = points.filter((point) => point.split === 'train');
  if (!trainingPoints.length) throw new Error('Nearest-neighbor experiment requires at least one training point.');

  const transformedQuery = transformPoint({ ...query, split: 'query' }, scaler, method);
  const ranking = trainingPoints
    .map((point) => {
      const transformed = transformPoint(point, scaler, method);
      return {
        id: point.id,
        label: point.label,
        distance: distanceBreakdown(transformedQuery, transformed).distance,
      };
    })
    .sort((a, b) => a.distance - b.distance);

  return {
    query: transformedQuery,
    nearest: ranking[0],
    ranking,
  };
}

export function outlierImpact(method) {
  if (method === 'raw') return null;
  assertMethod(method);

  const baselinePoints = buildPoints(false);
  const contaminatedPoints = buildPoints(true, 'train');
  const baselineScaler = fitScaler(baselinePoints, false);
  const contaminatedScaler = fitScaler(contaminatedPoints, false);
  const ordinaryTraining = BASE_POINTS.filter((point) => point.split === 'train');

  const coreBefore = ordinaryTraining.map((point) => (
    transformValue(point.income, baselineScaler.income, method)
  ));
  const coreAfter = ordinaryTraining.map((point) => (
    transformValue(point.income, contaminatedScaler.income, method)
  ));
  const coreSpanBefore = Math.max(...coreBefore) - Math.min(...coreBefore);
  const coreSpanAfter = Math.max(...coreAfter) - Math.min(...coreAfter);
  const scaleBefore = scaleMagnitude(baselineScaler.income, method);
  const scaleAfter = scaleMagnitude(contaminatedScaler.income, method);

  return {
    method,
    scaleBefore,
    scaleAfter,
    scaleChangeRatio: scaleAfter / scaleBefore,
    coreSpanBefore,
    coreSpanAfter,
    coreSpanRetention: coreSpanAfter / coreSpanBefore,
    outlierTransformed: transformValue(OUTLIER.income, contaminatedScaler.income, method),
  };
}

export function bounds(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

export function projectIsotropic(point, box, viewport = PLOT_VIEWPORT) {
  const { width, height, pad } = viewport;
  const drawableWidth = width - pad * 2;
  const drawableHeight = height - pad * 2;
  const xRange = box.maxX - box.minX || 1;
  const yRange = box.maxY - box.minY || 1;
  const pixelsPerUnit = Math.min(drawableWidth / xRange, drawableHeight / yRange);
  const usedWidth = xRange * pixelsPerUnit;
  const usedHeight = yRange * pixelsPerUnit;
  const left = pad + (drawableWidth - usedWidth) / 2;
  const top = pad + (drawableHeight - usedHeight) / 2;

  return {
    cx: left + (point.x - box.minX) * pixelsPerUnit,
    cy: top + usedHeight - (point.y - box.minY) * pixelsPerUnit,
  };
}

export function scaleMagnitude(featureStats, method) {
  assertMethod(method);
  if (method === 'standard') return featureStats.std;
  if (method === 'minmax') return featureStats.max - featureStats.min || 1;
  if (method === 'robust') return featureStats.iqr;
  return null;
}

function assertMethod(method) {
  if (!Object.hasOwn(METHODS, method)) {
    throw new Error(`Unsupported scaling method: ${method}`);
  }
}
