import { DEPLOYMENT_POPULATION, REFERENCE_BANDS, THRESHOLDS } from './rocPrCurvesConstants.js';

export function totalCounts(bands) {
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
  return total === 0 ? 0 : totals.positives / total;
}

export function confusionAt(threshold, bands = REFERENCE_BANDS) {
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

export function curvePoints(bands = REFERENCE_BANDS, thresholds = THRESHOLDS) {
  return thresholds.map((threshold) => {
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
  const sorted = [...points].sort((left, right) => left[xKey] - right[xKey] || left[yKey] - right[yKey]);
  return sorted.slice(1).reduce((area, point, index) => {
    const previous = sorted[index];
    const width = point[xKey] - previous[xKey];
    return area + width * (point[yKey] + previous[yKey]) / 2;
  }, 0);
}

export function rocAuc(bands = REFERENCE_BANDS) {
  return trapezoidArea(curvePoints(bands), 'fpr', 'tpr');
}

export function prAuc(bands = REFERENCE_BANDS) {
  return trapezoidArea(curvePoints(bands), 'recall', 'precisionPlot');
}

export function reweightForPrevalence(
  bands,
  targetPrevalence,
  population = DEPLOYMENT_POPULATION,
) {
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

export function findCapacityThreshold(bands, maxAlerts, thresholds = THRESHOLDS) {
  const candidates = thresholds
    .map((threshold) => ({ threshold, counts: confusionAt(threshold, bands) }))
    .map((candidate) => ({ ...candidate, summary: metrics(candidate.counts) }))
    .filter((candidate) => candidate.summary.predictedPositives <= maxAlerts)
    .sort((left, right) => {
      const recallDelta = (right.summary.recall ?? 0) - (left.summary.recall ?? 0);
      if (Math.abs(recallDelta) > 1e-12) return recallDelta;
      const precisionDelta = (right.summary.precision ?? 0) - (left.summary.precision ?? 0);
      if (Math.abs(precisionDelta) > 1e-12) return precisionDelta;
      return left.threshold - right.threshold;
    });

  return candidates[0] ?? null;
}

export function metricPercent(value, digits = 0) {
  return value === null ? 'N/A' : `${(value * 100).toFixed(digits)}%`;
}
