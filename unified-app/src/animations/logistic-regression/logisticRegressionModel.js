import { DECISION_SURFACE, THRESHOLD_RANGE } from './logisticRegressionConstants.js';

export { POINTS, PRESETS } from './logisticRegressionConstants.js';

const FEATURE_CENTER = 50;
const FEATURE_SCALE = 18;
const BOUNDARY_EPSILON = 1e-9;

export function sigmoid(value) {
  if (value >= 0) {
    const exponential = Math.exp(-value);
    return 1 / (1 + exponential);
  }
  const exponential = Math.exp(value);
  return exponential / (1 + exponential);
}

export function logit(probability) {
  if (!(probability > 0 && probability < 1)) {
    throw new RangeError('probability must be strictly between 0 and 1');
  }
  return Math.log(probability / (1 - probability));
}

export function modelLogit(risk, engagement, weightRisk, weightEngagement, bias) {
  const centeredRisk = (risk - FEATURE_CENTER) / FEATURE_SCALE;
  const centeredEngagement = (engagement - FEATURE_CENTER) / FEATURE_SCALE;
  return weightRisk * centeredRisk + weightEngagement * centeredEngagement + bias;
}

export function modelProbability(risk, engagement, weightRisk, weightEngagement, bias) {
  return sigmoid(modelLogit(risk, engagement, weightRisk, weightEngagement, bias));
}

export function scorePoint(point, weightRisk, weightEngagement, bias) {
  const z = modelLogit(point.risk, point.engagement, weightRisk, weightEngagement, bias);
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

export function findCostOptimalThresholdRanges(sweep, tolerance = 1e-9) {
  if (!sweep.length) return [];
  const minimumCost = Math.min(...sweep.map((point) => point.cost));
  const ranges = [];
  let currentRange = null;

  sweep.forEach((point) => {
    if (Math.abs(point.cost - minimumCost) <= tolerance) {
      if (!currentRange) {
        currentRange = { min: point.threshold, max: point.threshold };
      } else {
        currentRange.max = point.threshold;
      }
      return;
    }

    if (currentRange) {
      ranges.push(Object.freeze(currentRange));
      currentRange = null;
    }
  });

  if (currentRange) ranges.push(Object.freeze(currentRange));
  return ranges;
}

export function calibratedCostThreshold(falsePositiveCost, falseNegativeCost) {
  const totalCost = falsePositiveCost + falseNegativeCost;
  return totalCost === 0 ? 0.5 : falsePositiveCost / totalCost;
}

export function decisionSurfacePointToSvg({ risk, engagement }) {
  const featureSpan = DECISION_SURFACE.featureMax - DECISION_SURFACE.featureMin;
  const svgSpan = DECISION_SURFACE.svgMax - DECISION_SURFACE.svgMin;
  return {
    x: DECISION_SURFACE.svgMin + ((risk - DECISION_SURFACE.featureMin) / featureSpan) * svgSpan,
    y: DECISION_SURFACE.svgMax - ((engagement - DECISION_SURFACE.featureMin) / featureSpan) * svgSpan,
  };
}

function inFeatureRange(value) {
  return value >= DECISION_SURFACE.featureMin - BOUNDARY_EPSILON
    && value <= DECISION_SURFACE.featureMax + BOUNDARY_EPSILON;
}

function clampFeature(value) {
  return Math.max(DECISION_SURFACE.featureMin, Math.min(DECISION_SURFACE.featureMax, value));
}

function pushUniquePoint(points, risk, engagement) {
  if (!inFeatureRange(risk) || !inFeatureRange(engagement)) return;
  const point = { risk: clampFeature(risk), engagement: clampFeature(engagement) };
  const duplicate = points.some((candidate) => (
    Math.abs(candidate.risk - point.risk) <= BOUNDARY_EPSILON
    && Math.abs(candidate.engagement - point.engagement) <= BOUNDARY_EPSILON
  ));
  if (!duplicate) points.push(point);
}

export function boundaryLine(weightRisk, weightEngagement, bias, threshold) {
  const target = logit(threshold);
  if (Math.abs(weightRisk) <= BOUNDARY_EPSILON && Math.abs(weightEngagement) <= BOUNDARY_EPSILON) {
    return null;
  }

  const points = [];
  const { featureMin, featureMax } = DECISION_SURFACE;

  if (Math.abs(weightEngagement) > BOUNDARY_EPSILON) {
    for (const risk of [featureMin, featureMax]) {
      const centeredRisk = (risk - FEATURE_CENTER) / FEATURE_SCALE;
      const centeredEngagement = (target - bias - weightRisk * centeredRisk) / weightEngagement;
      pushUniquePoint(points, risk, FEATURE_CENTER + centeredEngagement * FEATURE_SCALE);
    }
  }

  if (Math.abs(weightRisk) > BOUNDARY_EPSILON) {
    for (const engagement of [featureMin, featureMax]) {
      const centeredEngagement = (engagement - FEATURE_CENTER) / FEATURE_SCALE;
      const centeredRisk = (target - bias - weightEngagement * centeredEngagement) / weightRisk;
      pushUniquePoint(points, FEATURE_CENTER + centeredRisk * FEATURE_SCALE, engagement);
    }
  }

  if (points.length < 2) return null;

  let endpoints = [points[0], points[1]];
  let maximumDistanceSquared = -1;
  for (let left = 0; left < points.length; left += 1) {
    for (let right = left + 1; right < points.length; right += 1) {
      const riskDelta = points[left].risk - points[right].risk;
      const engagementDelta = points[left].engagement - points[right].engagement;
      const distanceSquared = riskDelta ** 2 + engagementDelta ** 2;
      if (distanceSquared > maximumDistanceSquared) {
        maximumDistanceSquared = distanceSquared;
        endpoints = [points[left], points[right]];
      }
    }
  }

  const start = decisionSurfacePointToSvg(endpoints[0]);
  const end = decisionSurfacePointToSvg(endpoints[1]);
  return {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
    featureStart: Object.freeze({ ...endpoints[0] }),
    featureEnd: Object.freeze({ ...endpoints[1] }),
  };
}
