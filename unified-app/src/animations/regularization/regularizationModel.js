import {
  FEATURES,
  PENALTIES,
  SCALE_SENSITIVITY_DEMO,
  SHRINKAGE,
} from './regularizationConstants.js';

export { FEATURES, PENALTIES } from './regularizationConstants.js';

function validateLambda(lambda) {
  if (!Number.isFinite(lambda) || lambda < 0) {
    throw new RangeError('lambda must be a finite non-negative number');
  }
}

function penaltyFor(penaltyId) {
  const penalty = PENALTIES[penaltyId];
  if (!penalty) throw new RangeError(`Unknown penalty: ${penaltyId}`);
  return penalty;
}

function effectiveLambda(penaltyId, lambda) {
  validateLambda(lambda);
  penaltyFor(penaltyId);
  return penaltyId === 'none' ? 0 : lambda;
}

export function shrinkFeature(feature, penaltyId, lambda) {
  if (!feature || !Number.isFinite(feature.base)) {
    throw new TypeError('feature must include a finite base coefficient');
  }

  const penalty = penaltyFor(penaltyId);
  const appliedLambda = effectiveLambda(penaltyId, lambda);
  if (appliedLambda === 0) return { ...feature, weight: feature.base, removed: false };

  const l2Shrink = 1 / (1 + appliedLambda * penalty.l2 * SHRINKAGE.l2ShrinkScale);
  const afterL2 = feature.base * l2Shrink;
  const l1Cut = appliedLambda * penalty.l1 * SHRINKAGE.l1CutScale;
  const magnitude = Math.max(0, Math.abs(afterL2) - l1Cut);
  const weight = Math.sign(afterL2) * magnitude;

  return {
    ...feature,
    weight,
    removed: Math.abs(weight) < SHRINKAGE.removalThreshold,
  };
}

export function lossProfile(weights, lambda, penaltyId) {
  const penalty = penaltyFor(penaltyId);
  const appliedLambda = effectiveLambda(penaltyId, lambda);
  const signalLoss = weights.reduce((sum, feature) => {
    const lostUsefulSignal = feature.useful
      ? Math.abs(feature.base - feature.weight) * feature.importance * 5.5
      : 0;
    const noisyVariance = feature.useful ? 0 : Math.abs(feature.weight) * 6.5;
    return sum + lostUsefulSignal + noisyVariance;
  }, 15);
  const l1Penalty = weights.reduce((sum, feature) => sum + Math.abs(feature.weight), 0)
    * appliedLambda * penalty.l1 * 2.5;
  const l2Penalty = weights.reduce((sum, feature) => sum + feature.weight ** 2, 0)
    * appliedLambda * penalty.l2 * 1.25;
  const train = signalLoss + l1Penalty * 0.2 + l2Penalty * 0.2;
  const validation = signalLoss
    + weights.filter((feature) => !feature.useful && !feature.removed).length * 3.5
    + Math.max(0, appliedLambda - 0.55) * 18;

  return {
    dataLoss: signalLoss,
    penaltyLoss: l1Penalty + l2Penalty,
    train,
    validation,
    total: signalLoss + l1Penalty + l2Penalty,
  };
}

export function sweepProfile(penaltyId) {
  penaltyFor(penaltyId);
  return Array.from({ length: 11 }, (_, index) => {
    const lambda = index / 10;
    const weights = FEATURES.map((feature) => shrinkFeature(feature, penaltyId, lambda));
    const losses = lossProfile(weights, lambda, penaltyId);
    return { lambda, ...losses };
  });
}

export function bestLambda(points) {
  if (!Array.isArray(points) || points.length === 0) {
    throw new RangeError('points must contain at least one sweep result');
  }
  return points.reduce((best, point) => (point.validation < best.validation ? point : best), points[0]);
}

export function linePath(points, key) {
  const max = Math.max(...points.flatMap((point) => [point.train, point.validation, point.total]), 1);
  return points.map((point, index) => {
    const x = 28 + index * 30;
    const y = 168 - (point[key] / max) * 130;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

export function regularizationSummary(weights) {
  const removedCount = weights.filter((feature) => feature.removed).length;
  const noisyActive = weights.filter((feature) => !feature.useful && !feature.removed).length;
  const usefulMass = weights
    .filter((feature) => feature.useful)
    .reduce((sum, feature) => sum + Math.abs(feature.weight), 0);
  const baseUsefulMass = FEATURES
    .filter((feature) => feature.useful)
    .reduce((sum, feature) => sum + Math.abs(feature.base), 0);

  return {
    removedCount,
    noisyActive,
    usefulRetention: usefulMass / baseUsefulMass,
  };
}

export function diagnosisForState({ penaltyId, lambda, noisyActive, usefulRetention }) {
  if (penaltyId === 'none') {
    return 'No penalty: noisy weights remain active; compare a regularized setting on validation.';
  }
  if (lambda < 0.15) {
    return 'Too weak: noisy weights remain active and validation can suffer.';
  }
  if (lambda > 0.75) {
    return 'Too strong: useful signal is being shrunk enough to underfit.';
  }
  if (noisyActive <= 1 && usefulRetention > 0.55) {
    return 'Balanced on this toy validation set: complexity falls while useful signal remains.';
  }
  return 'Tradeoff zone: compare validation loss before increasing lambda.';
}

function coefficientPenalty(coefficient, penaltyId, lambda) {
  validateLambda(lambda);
  if (penaltyId === 'l1') return lambda * Math.abs(coefficient);
  if (penaltyId === 'l2') return lambda * coefficient ** 2;
  throw new RangeError('scale sensitivity demo supports only l1 or l2');
}

export function unitScalePenalty({
  scale = SCALE_SENSITIVITY_DEMO.defaultScale,
  penaltyId = 'l2',
  lambda = SCALE_SENSITIVITY_DEMO.lambda,
  physicalEffect = SCALE_SENSITIVITY_DEMO.physicalEffect,
} = {}) {
  if (!Number.isFinite(scale) || scale <= 0) {
    throw new RangeError('scale must be a finite positive number');
  }
  if (!Number.isFinite(physicalEffect)) {
    throw new TypeError('physicalEffect must be finite');
  }

  const rawCoefficient = physicalEffect / scale;
  const standardizedCoefficient = physicalEffect;

  return {
    scale,
    penaltyId,
    rawCoefficient,
    standardizedCoefficient,
    rawPenalty: coefficientPenalty(rawCoefficient, penaltyId, lambda),
    standardizedPenalty: coefficientPenalty(standardizedCoefficient, penaltyId, lambda),
  };
}

export function percent(value) {
  return `${Math.round(value * 100)}%`;
}
