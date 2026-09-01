import { THRESHOLD_RANGE } from './logisticRegressionConstants.js';

export { POINTS, PRESETS } from './logisticRegressionConstants.js';

export function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

export function logit(probability) {
  return Math.log(probability / (1 - probability));
}

export function scorePoint(point, weightRisk, weightEngagement, bias) {
  const centeredRisk = (point.risk - 50) / 18;
  const centeredEngagement = (point.engagement - 50) / 18;
  const z = weightRisk * centeredRisk + weightEngagement * centeredEngagement + bias;
  const probability = sigmoid(z);
  return { ...point, z, probability, predicted: probability >= 0.5 ? 1 : 0 };
}

export function classifyPoint(point, threshold) {
  return { ...point, predicted: point.probability >= threshold ? 1 : 0 };
}

export function summarize(scored) {
  return scored.reduce(
    (counts, point) => {
      if (point.y === 1 && point.predicted === 1) counts.tp += 1;
      if (point.y === 0 && point.predicted === 1) counts.fp += 1;
      if (point.y === 1 && point.predicted === 0) counts.fn += 1;
      if (point.y === 0 && point.predicted === 0) counts.tn += 1;
      return counts;
    },
    { tp: 0, fp: 0, fn: 0, tn: 0 },
  );
}

export function safeRatio(numerator, denominator) {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function metricPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export function ratesFromCounts(counts) {
  return {
    truePositiveRate: safeRatio(counts.tp, counts.tp + counts.fn),
    falsePositiveRate: safeRatio(counts.fp, counts.fp + counts.tn),
  };
}

export function projectConfusion(counts, prevalence, population) {
  const rates = ratesFromCounts(counts);
  const positives = population * prevalence;
  const negatives = population - positives;

  return {
    tp: positives * rates.truePositiveRate,
    fn: positives * (1 - rates.truePositiveRate),
    fp: negatives * rates.falsePositiveRate,
    tn: negatives * (1 - rates.falsePositiveRate),
    rates,
  };
}

export function decisionCost(confusion, falsePositiveCost, falseNegativeCost) {
  return confusion.fp * falsePositiveCost + confusion.fn * falseNegativeCost;
}

export function evaluateThreshold(
  scored,
  threshold,
  prevalence,
  population,
  falsePositiveCost,
  falseNegativeCost,
) {
  const classified = scored.map((point) => classifyPoint(point, threshold));
  const counts = summarize(classified);
  const projected = projectConfusion(counts, prevalence, population);

  return {
    threshold,
    counts,
    projected,
    cost: decisionCost(projected, falsePositiveCost, falseNegativeCost),
    accuracy: safeRatio(projected.tp + projected.tn, population),
    precision: safeRatio(projected.tp, projected.tp + projected.fp),
    recall: projected.rates.truePositiveRate,
  };
}

export function thresholdSweep(
  scored,
  prevalence,
  population,
  falsePositiveCost,
  falseNegativeCost,
) {
  const steps = Math.round((THRESHOLD_RANGE.max - THRESHOLD_RANGE.min) / THRESHOLD_RANGE.step);

  return Array.from({ length: steps + 1 }, (_, index) => {
    const threshold = Number((THRESHOLD_RANGE.min + index * THRESHOLD_RANGE.step).toFixed(2));
    return evaluateThreshold(
      scored,
      threshold,
      prevalence,
      population,
      falsePositiveCost,
      falseNegativeCost,
    );
  });
}

export function findCostOptimalThreshold(
  sweep,
  referenceThreshold = 0.5,
) {
  return sweep.reduce((best, candidate) => {
    if (!best || candidate.cost < best.cost - 1e-9) return candidate;
    if (Math.abs(candidate.cost - best.cost) > 1e-9) return best;

    const candidateDistance = Math.abs(candidate.threshold - referenceThreshold);
    const bestDistance = Math.abs(best.threshold - referenceThreshold);
    return candidateDistance < bestDistance ? candidate : best;
  }, null);
}

export function calibratedCostThreshold(falsePositiveCost, falseNegativeCost) {
  const totalCost = falsePositiveCost + falseNegativeCost;
  return totalCost === 0 ? 0.5 : falsePositiveCost / totalCost;
}

export function boundaryLine(weightRisk, weightEngagement, bias, threshold) {
  const target = logit(threshold);
  const toSvgX = (risk) => 24 + risk * 3.12;
  const toSvgY = (engagement) => 336 - engagement * 3.12;

  if (Math.abs(weightRisk) < 0.05 && Math.abs(weightEngagement) < 0.05) {
    const x = toSvgX(50);
    return { x1: x, y1: 24, x2: x, y2: 336 };
  }

  if (Math.abs(weightEngagement) < 0.05) {
    const risk = 50 + ((target - bias) * 18) / weightRisk;
    const x = toSvgX(Math.max(0, Math.min(100, risk)));
    return { x1: x, y1: 24, x2: x, y2: 336 };
  }

  const yAt = (risk) => {
    const centeredRisk = (risk - 50) / 18;
    const centeredEngagement = (target - bias - weightRisk * centeredRisk) / weightEngagement;
    return 50 + centeredEngagement * 18;
  };

  const y0 = Math.max(-20, Math.min(120, yAt(0)));
  const y100 = Math.max(-20, Math.min(120, yAt(100)));
  return { x1: toSvgX(0), y1: toSvgY(y0), x2: toSvgX(100), y2: toSvgY(y100) };
}
