import {
  CORRELATED_STABILITY_DEMO,
  FEATURES,
  PENALTIES,
  REGULARIZATION_EXPERIMENT,
  SCALE_SENSITIVITY_DEMO,
} from './regularizationConstants.js';
import { createRegularizationDataset } from './regularizationDataset.js';
import { fitRegularizedLinearModel, meanSquaredError, predictDataset } from './regularizationSolver.js';

export { FEATURES, PENALTIES } from './regularizationConstants.js';

const DEFAULT_TRAIN = createRegularizationDataset({
  seed: REGULARIZATION_EXPERIMENT.trainSeed,
  size: REGULARIZATION_EXPERIMENT.trainSize,
});
const DEFAULT_VALIDATION = createRegularizationDataset({
  seed: REGULARIZATION_EXPERIMENT.validationSeed,
  size: REGULARIZATION_EXPERIMENT.validationSize,
});

function validateLambda(lambda) {
  if (!Number.isFinite(lambda) || lambda < 0) throw new RangeError('lambda must be a finite non-negative number');
}

function penaltyFor(penaltyId) {
  const penalty = PENALTIES[penaltyId];
  if (!penalty) throw new RangeError(`Unknown penalty: ${penaltyId}`);
  return penalty;
}

function createSnapshotFromDatasets(penaltyId, lambda, trainDataset, validationDataset) {
  validateLambda(lambda);
  penaltyFor(penaltyId);
  const appliedLambda = penaltyId === 'none' ? 0 : lambda;
  const fitted = fitRegularizedLinearModel(trainDataset, penaltyId, appliedLambda);
  const validationPredictions = predictDataset(fitted.model, validationDataset);
  const validationMse = meanSquaredError(validationDataset.targets, validationPredictions);
  const weights = FEATURES.map((feature, index) => ({
    ...feature,
    weight: fitted.model.coefficients[index],
    removed: Math.abs(fitted.model.coefficients[index]) < REGULARIZATION_EXPERIMENT.zeroThreshold,
  }));

  return Object.freeze({
    penaltyId,
    lambda: appliedLambda,
    weights: Object.freeze(weights),
    losses: Object.freeze({
      dataLoss: fitted.dataLoss,
      penaltyLoss: fitted.penaltyLoss,
      total: fitted.objective,
      train: fitted.trainMse,
      validation: validationMse,
    }),
    fit: fitted.model,
  });
}

export function createRegularizationSnapshot(penaltyId, lambda) {
  return createSnapshotFromDatasets(penaltyId, lambda, DEFAULT_TRAIN, DEFAULT_VALIDATION);
}

export function sweepProfile(penaltyId, steps = REGULARIZATION_EXPERIMENT.sweepPoints) {
  penaltyFor(penaltyId);
  if (!Number.isInteger(steps) || steps < 2) throw new RangeError('steps must be an integer of at least 2');
  return Array.from({ length: steps }, (_, index) => {
    const lambda = (REGULARIZATION_EXPERIMENT.maxLambda * index) / (steps - 1);
    const snapshot = createRegularizationSnapshot(penaltyId, lambda);
    return { lambda, ...snapshot.losses };
  });
}

export function bestLambda(points) {
  if (!Array.isArray(points) || points.length === 0) throw new RangeError('points must contain at least one sweep result');
  return points.reduce((best, point) => (point.validation < best.validation ? point : best), points[0]);
}

export function linePath(points, key) {
  if (!Array.isArray(points) || points.length < 2) throw new RangeError('points must contain at least two sweep results');
  const values = points.map((point) => point[key]);
  if (values.some((value) => !Number.isFinite(value))) throw new TypeError(`points must contain finite ${key} values`);
  const max = Math.max(...points.flatMap((point) => [point.train, point.validation]), 1);
  return points.map((point, index) => {
    const x = 28 + (index / (points.length - 1)) * 300;
    const y = 168 - (point[key] / max) * 130;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

export function regularizationSummary(snapshot) {
  const active = snapshot.weights.filter((feature) => !feature.removed);
  return {
    activeCount: active.length,
    removedCount: snapshot.weights.length - active.length,
    noisyActive: active.filter((feature) => !feature.useful).length,
    coefficientNorm: Math.sqrt(snapshot.weights.reduce((sum, feature) => sum + feature.weight ** 2, 0)),
  };
}

export function diagnosisForState({ snapshot, best, unregularized }) {
  if (snapshot.penaltyId === 'none') {
    return 'No penalty: this is the fitted baseline; compare validation MSE against tuned regularized fits.';
  }
  if (Math.abs(snapshot.lambda - best.lambda) <= REGULARIZATION_EXPERIMENT.maxLambda / (REGULARIZATION_EXPERIMENT.sweepPoints - 1)) {
    return 'Near the measured validation optimum for this deterministic train/validation split.';
  }
  if (snapshot.losses.validation > unregularized.losses.validation && snapshot.losses.train > unregularized.losses.train) {
    return 'Over-shrunk on this split: training fit worsened and validation MSE is above the unregularized baseline.';
  }
  if (snapshot.lambda < best.lambda) {
    return 'Weaker than the measured optimum: more coefficient freedom remains than validation currently rewards.';
  }
  return 'Stronger than the measured optimum: extra shrinkage is trading variance control for more bias.';
}

export function correlatedFeatureStability(penaltyId, lambda = CORRELATED_STABILITY_DEMO.lambda) {
  validateLambda(lambda);
  penaltyFor(penaltyId);
  const runs = CORRELATED_STABILITY_DEMO.seeds.map((seed) => {
    const trainDataset = createRegularizationDataset({ seed, size: REGULARIZATION_EXPERIMENT.trainSize });
    const fitted = fitRegularizedLinearModel(trainDataset, penaltyId, lambda);
    const signalA = fitted.model.coefficients[0];
    const signalB = fitted.model.coefficients[1];
    const totalMagnitude = Math.abs(signalA) + Math.abs(signalB);
    return Object.freeze({
      seed,
      signalA,
      signalB,
      dominant: Math.abs(signalA) >= Math.abs(signalB) ? 'A' : 'B',
      pairImbalance: totalMagnitude === 0 ? 0 : Math.abs(Math.abs(signalA) - Math.abs(signalB)) / totalMagnitude,
      zeroedPairMember: Math.abs(signalA) < REGULARIZATION_EXPERIMENT.zeroThreshold
        || Math.abs(signalB) < REGULARIZATION_EXPERIMENT.zeroThreshold,
    });
  });
  const dominantA = runs.filter((run) => run.dominant === 'A').length;
  const zeroedPairMemberCount = runs.filter((run) => run.zeroedPairMember).length;
  const meanPairImbalance = runs.reduce((sum, run) => sum + run.pairImbalance, 0) / runs.length;

  return Object.freeze({
    penaltyId,
    lambda,
    runs: Object.freeze(runs),
    dominantA,
    dominantB: runs.length - dominantA,
    zeroedPairMemberCount,
    meanPairImbalance,
  });
}

function coefficientPenalty(coefficient, penaltyId, lambda) {
  validateLambda(lambda);
  if (penaltyId === 'l1') return lambda * Math.abs(coefficient);
  if (penaltyId === 'l2') return 0.5 * lambda * coefficient ** 2;
  throw new RangeError('scale sensitivity demo supports only l1 or l2');
}

export function unitScalePenalty({
  scale = SCALE_SENSITIVITY_DEMO.defaultScale,
  penaltyId = 'l2',
  lambda = SCALE_SENSITIVITY_DEMO.lambda,
  physicalEffect = SCALE_SENSITIVITY_DEMO.physicalEffect,
} = {}) {
  if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('scale must be a finite positive number');
  if (!Number.isFinite(physicalEffect)) throw new TypeError('physicalEffect must be finite');
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

export function percent(value, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}
