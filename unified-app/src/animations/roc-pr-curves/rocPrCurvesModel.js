import { DEPLOYMENT_POPULATION, REFERENCE_BANDS } from './rocPrCurvesConstants.js';

const EPSILON = 1e-12;

export function totalCounts(bands) {
  validateBands(bands);
  return bands.reduce(
    (totals, band) => ({
      positives: totals.positives + band.positives,
      negatives: totals.negatives + band.negatives,
    }),
    { positives: 0, negatives: 0 },
  );
}

export function prevalenceOf(bands) {
  const totals = totalCounts(bands);
  const total = totals.positives + totals.negatives;
  return total === 0 ? null : totals.positives / total;
}

export function exactThresholds(bands = REFERENCE_BANDS) {
  validateBands(bands);
  const scores = [...new Set(bands.map((band) => band.score))].sort((left, right) => right - left);
  const maxScore = scores[0];
  const emptyPredictionThreshold = maxScore + Math.max(1e-9, Math.abs(maxScore) * 1e-9);
  return [emptyPredictionThreshold, ...scores];
}

export function confusionAt(threshold, bands = REFERENCE_BANDS) {
  if (!Number.isFinite(threshold)) throw new TypeError('threshold must be finite');
  const totals = totalCounts(bands);
  const predictedPositive = bands.filter((band) => band.score >= threshold);
  const tp = predictedPositive.reduce((sum, band) => sum + band.positives, 0);
  const fp = predictedPositive.reduce((sum, band) => sum + band.negatives, 0);

  return {
    tp,
    fp,
    fn: totals.positives - tp,
    tn: totals.negatives - fp,
  };
}

function ratio(numerator, denominator) {
  return denominator === 0 ? null : numerator / denominator;
}

export function metrics(counts) {
  validateCounts(counts);
  const predictedPositives = counts.tp + counts.fp;
  const actualPositives = counts.tp + counts.fn;
  const actualNegatives = counts.fp + counts.tn;
  const precision = ratio(counts.tp, predictedPositives);
  const recall = ratio(counts.tp, actualPositives);
  const fpr = ratio(counts.fp, actualNegatives);

  return {
    precision,
    recall,
    tpr: recall,
    fpr,
    predictedPositives,
    actualPositives,
    actualNegatives,
  };
}

export function prPrecisionForPlot(point) {
  return point.precision ?? 1;
}

export function curvePoints(bands = REFERENCE_BANDS, thresholds = null) {
  validateBands(bands);
  const activeThresholds = thresholds ?? exactThresholds(bands);
  if (!Array.isArray(activeThresholds) || !activeThresholds.length || activeThresholds.some((value) => !Number.isFinite(value))) {
    throw new TypeError('thresholds must be a non-empty array of finite numbers');
  }

  return activeThresholds.map((threshold) => {
    const counts = confusionAt(threshold, bands);
    const summary = metrics(counts);
    return {
      threshold,
      ...counts,
      ...summary,
      precisionPlot: prPrecisionForPlot(summary),
    };
  });
}

export function trapezoidArea(points, xKey, yKey) {
  if (!Array.isArray(points) || points.length < 2) return 0;
  const sorted = [...points].sort((left, right) => left[xKey] - right[xKey] || left[yKey] - right[yKey]);
  return sorted.slice(1).reduce((area, point, index) => {
    const previous = sorted[index];
    const width = point[xKey] - previous[xKey];
    return area + width * (point[yKey] + previous[yKey]) / 2;
  }, 0);
}

export function rocAuc(bands = REFERENCE_BANDS) {
  validateBands(bands);
  const totals = totalCounts(bands);
  if (totals.positives === 0 || totals.negatives === 0) return null;

  let weightedWins = 0;
  for (const positiveBand of bands) {
    if (positiveBand.positives === 0) continue;
    for (const negativeBand of bands) {
      if (negativeBand.negatives === 0) continue;
      const pairWeight = positiveBand.positives * negativeBand.negatives;
      if (positiveBand.score > negativeBand.score) weightedWins += pairWeight;
      else if (positiveBand.score === negativeBand.score) weightedWins += pairWeight * 0.5;
    }
  }

  return weightedWins / (totals.positives * totals.negatives);
}

export function prAuc(bands = REFERENCE_BANDS) {
  return trapezoidArea(curvePoints(bands), 'recall', 'precisionPlot');
}

export function averagePrecision(bands = REFERENCE_BANDS) {
  validateBands(bands);
  const totals = totalCounts(bands);
  if (totals.positives === 0) return null;

  const sorted = [...bands].sort((left, right) => right.score - left.score);
  let tp = 0;
  let fp = 0;
  let previousRecall = 0;
  let area = 0;

  for (const band of sorted) {
    tp += band.positives;
    fp += band.negatives;
    const recall = tp / totals.positives;
    const precision = tp / (tp + fp);
    area += (recall - previousRecall) * precision;
    previousRecall = recall;
  }

  return area;
}

export function bestPointUnderFpr(bands, maxFpr) {
  validateProbability(maxFpr, 'maxFpr');
  const candidates = curvePoints(bands)
    .filter((point) => point.fpr !== null && point.recall !== null && point.fpr <= maxFpr + EPSILON)
    .sort((left, right) => {
      const recallDelta = right.recall - left.recall;
      if (Math.abs(recallDelta) > EPSILON) return recallDelta;
      const precisionDelta = (right.precision ?? 0) - (left.precision ?? 0);
      if (Math.abs(precisionDelta) > EPSILON) return precisionDelta;
      return right.threshold - left.threshold;
    });
  return candidates[0] ?? null;
}

export function reweightForPrevalence(
  bands,
  targetPrevalence,
  population = DEPLOYMENT_POPULATION,
) {
  validateBands(bands);
  validateProbability(targetPrevalence, 'targetPrevalence');
  if (!Number.isFinite(population) || population <= 0) throw new RangeError('population must be positive and finite');

  const totals = totalCounts(bands);
  const positiveTarget = population * targetPrevalence;
  const negativeTarget = population - positiveTarget;

  return bands.map((band) => ({
    score: band.score,
    positives: totals.positives === 0 ? 0 : (band.positives / totals.positives) * positiveTarget,
    negatives: totals.negatives === 0 ? 0 : (band.negatives / totals.negatives) * negativeTarget,
  }));
}

export function mergeBands(...collections) {
  if (!collections.length) throw new RangeError('at least one band collection is required');
  collections.forEach(validateBands);
  const byScore = new Map();
  for (const bands of collections) {
    for (const band of bands) {
      const current = byScore.get(band.score) ?? { score: band.score, positives: 0, negatives: 0 };
      current.positives += band.positives;
      current.negatives += band.negatives;
      byScore.set(band.score, current);
    }
  }
  return [...byScore.values()].sort((left, right) => right.score - left.score);
}

export function findCapacityThreshold(bands, maxAlerts, thresholds = null) {
  validateBands(bands);
  if (!Number.isFinite(maxAlerts) || maxAlerts < 0) throw new RangeError('maxAlerts must be finite and non-negative');
  const activeThresholds = thresholds ?? exactThresholds(bands);
  const candidates = activeThresholds
    .map((threshold) => ({ threshold, counts: confusionAt(threshold, bands) }))
    .map((candidate) => ({ ...candidate, summary: metrics(candidate.counts) }))
    .filter((candidate) => candidate.summary.predictedPositives <= maxAlerts + EPSILON)
    .sort((left, right) => {
      const recallDelta = (right.summary.recall ?? 0) - (left.summary.recall ?? 0);
      if (Math.abs(recallDelta) > EPSILON) return recallDelta;
      const precisionDelta = (right.summary.precision ?? 0) - (left.summary.precision ?? 0);
      if (Math.abs(precisionDelta) > EPSILON) return precisionDelta;
      return right.threshold - left.threshold;
    });

  return candidates[0] ?? null;
}

export function metricPercent(value, digits = 0) {
  return value === null ? 'N/A' : `${(value * 100).toFixed(digits)}%`;
}

function validateBands(bands) {
  if (!Array.isArray(bands) || !bands.length) throw new TypeError('bands must be a non-empty array');
  for (const band of bands) {
    if (!Number.isFinite(band?.score)) throw new TypeError('band scores must be finite');
    if (!Number.isFinite(band.positives) || band.positives < 0) throw new RangeError('band positives must be finite and non-negative');
    if (!Number.isFinite(band.negatives) || band.negatives < 0) throw new RangeError('band negatives must be finite and non-negative');
  }
}

function validateCounts(counts) {
  for (const key of ['tp', 'fp', 'fn', 'tn']) {
    if (!Number.isFinite(counts?.[key]) || counts[key] < 0) throw new RangeError(`${key} must be finite and non-negative`);
  }
}

function validateProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be between 0 and 1`);
}
