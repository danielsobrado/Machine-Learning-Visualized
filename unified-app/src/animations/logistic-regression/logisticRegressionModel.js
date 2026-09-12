import {
  DECISION_SURFACE,
  FEATURE_TRANSFORM,
  FIT_CONFIG,
  POINTS,
  PRESETS,
  SEPARABLE_POINTS,
  SEPARATION_EXPERIMENT,
  THRESHOLD_RANGE,
  TRAIN_POINTS,
  VALIDATION_POINTS,
} from './logisticRegressionConstants.js';

export { POINTS, PRESETS, TRAIN_POINTS, VALIDATION_POINTS } from './logisticRegressionConstants.js';

const BOUNDARY_EPSILON = 1e-9;
const PROBABILITY_EPSILON = 1e-15;

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

export function normalizeFeature(value) {
  if (!Number.isFinite(value)) throw new TypeError('feature value must be finite');
  return (value - FEATURE_TRANSFORM.center) / FEATURE_TRANSFORM.scale;
}

export function modelLogit(risk, engagement, weightRisk, weightEngagement, bias) {
  return weightRisk * normalizeFeature(risk)
    + weightEngagement * normalizeFeature(engagement)
    + bias;
}

export function modelProbability(risk, engagement, weightRisk, weightEngagement, bias) {
  return sigmoid(modelLogit(risk, engagement, weightRisk, weightEngagement, bias));
}

export function scorePoint(point, weightRisk, weightEngagement, bias) {
  validatePoint(point);
  const z = modelLogit(point.risk, point.engagement, weightRisk, weightEngagement, bias);
  const probability = sigmoid(z);
  return { ...point, z, probability, predicted: probability >= 0.5 ? 1 : 0 };
}

export function scorePoints(points, model) {
  validatePointSet(points);
  validateModel(model);
  return points.map((point) => scorePoint(
    point,
    model.weightRisk,
    model.weightEngagement,
    model.bias,
  ));
}

export function classifyPoint(point, threshold) {
  if (!Number.isFinite(point?.probability)) throw new TypeError('point probability must be finite');
  validateThreshold(threshold);
  return { ...point, predicted: point.probability >= threshold ? 1 : 0 };
}

export function summarize(scored) {
  if (!Array.isArray(scored)) throw new TypeError('scored must be an array');
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

export function binaryLogLoss(scored) {
  if (!Array.isArray(scored) || !scored.length) throw new RangeError('scored must contain at least one point');
  return scored.reduce((sum, point) => {
    const probability = Math.min(1 - PROBABILITY_EPSILON, Math.max(PROBABILITY_EPSILON, point.probability));
    return sum - point.y * Math.log(probability) - (1 - point.y) * Math.log(1 - probability);
  }, 0) / scored.length;
}

export function brierScore(scored) {
  if (!Array.isArray(scored) || !scored.length) throw new RangeError('scored must contain at least one point');
  return scored.reduce((sum, point) => sum + (point.probability - point.y) ** 2, 0) / scored.length;
}

export function fitLogisticRegression(
  points,
  {
    lambda = 0,
    maxIterations = FIT_CONFIG.maxIterations,
    tolerance = FIT_CONFIG.tolerance,
  } = {},
) {
  validatePointSet(points, true);
  if (!Number.isFinite(lambda) || lambda < 0) throw new RangeError('lambda must be a non-negative finite number');
  if (!Number.isInteger(maxIterations) || maxIterations < 1) throw new RangeError('maxIterations must be a positive integer');
  if (!Number.isFinite(tolerance) || tolerance < 0) throw new RangeError('tolerance must be a non-negative finite number');

  let coefficients = [0, 0, 0];
  const trace = [fitTraceEntry(0, coefficients, points, lambda, null)];
  let converged = false;

  for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
    const gradient = [0, 0, 0];
    const hessian = Array.from({ length: 3 }, () => [0, 0, 0]);

    for (const point of points) {
      const row = designRow(point);
      const probability = sigmoid(dot(coefficients, row));
      const residual = probability - point.y;
      const weight = probability * (1 - probability);

      for (let i = 0; i < 3; i += 1) {
        gradient[i] += residual * row[i];
        for (let j = 0; j < 3; j += 1) {
          hessian[i][j] += weight * row[i] * row[j];
        }
      }
    }

    for (let index = 1; index < 3; index += 1) {
      gradient[index] += lambda * coefficients[index];
      hessian[index][index] += lambda;
    }
    for (let index = 0; index < 3; index += 1) {
      hessian[index][index] += FIT_CONFIG.hessianEpsilon;
    }

    const step = solveLinearSystem(hessian, gradient);
    coefficients = coefficients.map((coefficient, index) => coefficient - step[index]);
    const maxStep = Math.max(...step.map((value) => Math.abs(value)));
    trace.push(fitTraceEntry(iteration, coefficients, points, lambda, maxStep));

    if (maxStep <= tolerance) {
      converged = true;
      break;
    }
  }

  const [bias, weightRisk, weightEngagement] = coefficients;
  const finalTrace = trace.at(-1);
  return {
    bias,
    weightRisk,
    weightEngagement,
    lambda,
    iterations: finalTrace.iteration,
    converged,
    coefficientNorm: Math.hypot(weightRisk, weightEngagement),
    logLoss: finalTrace.logLoss,
    objective: finalTrace.objective,
    trace,
  };
}

export function fitPresetModel(presetId) {
  const preset = PRESETS[presetId];
  if (!preset) throw new RangeError(`Unknown preset: ${presetId}`);
  return {
    ...fitLogisticRegression(TRAIN_POINTS, { lambda: preset.lambda }),
    presetId,
    threshold: preset.threshold,
  };
}

export function separationExperiment() {
  const unregularized = fitLogisticRegression(SEPARABLE_POINTS, {
    lambda: 0,
    maxIterations: SEPARATION_EXPERIMENT.maxIterations,
    tolerance: 0,
  });
  const regularized = fitLogisticRegression(SEPARABLE_POINTS, {
    lambda: SEPARATION_EXPERIMENT.ridgeLambda,
    maxIterations: SEPARATION_EXPERIMENT.maxIterations,
  });

  return {
    unregularized,
    regularized,
    ridgeLambda: SEPARATION_EXPERIMENT.ridgeLambda,
    points: SEPARABLE_POINTS,
  };
}

export function projectConfusion(counts, prevalence, population) {
  if (!Number.isFinite(prevalence) || prevalence < 0 || prevalence > 1) {
    throw new RangeError('prevalence must be between 0 and 1');
  }
  if (!Number.isFinite(population) || population <= 0) {
    throw new RangeError('population must be positive');
  }
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
  if (!Number.isFinite(falsePositiveCost) || falsePositiveCost < 0) throw new RangeError('falsePositiveCost must be non-negative');
  if (!Number.isFinite(falseNegativeCost) || falseNegativeCost < 0) throw new RangeError('falseNegativeCost must be non-negative');
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
  validateThreshold(threshold);
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

export function findCostOptimalThreshold(sweep, referenceThreshold = 0.5) {
  if (!Array.isArray(sweep) || !sweep.length) throw new RangeError('sweep must contain at least one threshold');
  return sweep.reduce((best, candidate) => {
    if (!best || candidate.cost < best.cost - 1e-9) return candidate;
    if (Math.abs(candidate.cost - best.cost) > 1e-9) return best;

    const candidateDistance = Math.abs(candidate.threshold - referenceThreshold);
    const bestDistance = Math.abs(best.threshold - referenceThreshold);
    return candidateDistance < bestDistance ? candidate : best;
  }, null);
}

export function findCostOptimalThresholdRanges(sweep, tolerance = 1e-9) {
  if (!Array.isArray(sweep) || !sweep.length) return [];
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
  if (!Number.isFinite(falsePositiveCost) || falsePositiveCost < 0) throw new RangeError('falsePositiveCost must be non-negative');
  if (!Number.isFinite(falseNegativeCost) || falseNegativeCost < 0) throw new RangeError('falseNegativeCost must be non-negative');
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
  validateThreshold(threshold);
  const target = logit(threshold);
  if (Math.abs(weightRisk) <= BOUNDARY_EPSILON && Math.abs(weightEngagement) <= BOUNDARY_EPSILON) {
    return null;
  }

  const points = [];
  const { featureMin, featureMax } = DECISION_SURFACE;

  if (Math.abs(weightEngagement) > BOUNDARY_EPSILON) {
    for (const risk of [featureMin, featureMax]) {
      const centeredRisk = normalizeFeature(risk);
      const centeredEngagement = (target - bias - weightRisk * centeredRisk) / weightEngagement;
      pushUniquePoint(
        points,
        risk,
        FEATURE_TRANSFORM.center + centeredEngagement * FEATURE_TRANSFORM.scale,
      );
    }
  }

  if (Math.abs(weightRisk) > BOUNDARY_EPSILON) {
    for (const engagement of [featureMin, featureMax]) {
      const centeredEngagement = normalizeFeature(engagement);
      const centeredRisk = (target - bias - weightEngagement * centeredEngagement) / weightRisk;
      pushUniquePoint(
        points,
        FEATURE_TRANSFORM.center + centeredRisk * FEATURE_TRANSFORM.scale,
        engagement,
      );
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

function validateThreshold(threshold) {
  if (!Number.isFinite(threshold) || threshold <= 0 || threshold >= 1) {
    throw new RangeError('threshold must be strictly between 0 and 1');
  }
}

function validatePoint(point) {
  if (!point || !Number.isFinite(point.risk) || !Number.isFinite(point.engagement)) {
    throw new TypeError('point features must be finite');
  }
  if (point.y !== 0 && point.y !== 1) throw new TypeError('point label must be 0 or 1');
}

function validatePointSet(points, requireBothClasses = false) {
  if (!Array.isArray(points) || !points.length) throw new RangeError('points must contain at least one row');
  points.forEach(validatePoint);
  if (requireBothClasses && new Set(points.map((point) => point.y)).size < 2) {
    throw new RangeError('logistic fitting requires both classes');
  }
}

function validateModel(model) {
  if (!model || ![model.weightRisk, model.weightEngagement, model.bias].every(Number.isFinite)) {
    throw new TypeError('model coefficients must be finite');
  }
}

function designRow(point) {
  return [1, normalizeFeature(point.risk), normalizeFeature(point.engagement)];
}

function dot(left, right) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function stableSoftplus(value) {
  if (value > 0) return value + Math.log1p(Math.exp(-value));
  return Math.log1p(Math.exp(value));
}

function fitTraceEntry(iteration, coefficients, points, lambda, maxStep) {
  const logLossTotal = points.reduce((sum, point) => {
    const z = dot(coefficients, designRow(point));
    return sum + stableSoftplus(z) - point.y * z;
  }, 0);
  const penalty = 0.5 * lambda * (coefficients[1] ** 2 + coefficients[2] ** 2);
  return {
    iteration,
    logLoss: logLossTotal / points.length,
    objective: (logLossTotal + penalty) / points.length,
    coefficientNorm: Math.hypot(coefficients[1], coefficients[2]),
    maxStep,
  };
}

function solveLinearSystem(matrix, vector) {
  const size = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);

  for (let column = 0; column < size; column += 1) {
    let pivotRow = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivotRow][column])) pivotRow = row;
    }
    if (Math.abs(augmented[pivotRow][column]) < 1e-14) throw new Error('Logistic fit Hessian is numerically singular');
    [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];

    const pivot = augmented[column][column];
    for (let valueIndex = column; valueIndex <= size; valueIndex += 1) {
      augmented[column][valueIndex] /= pivot;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let valueIndex = column; valueIndex <= size; valueIndex += 1) {
        augmented[row][valueIndex] -= factor * augmented[column][valueIndex];
      }
    }
  }

  return augmented.map((row) => row[size]);
}
