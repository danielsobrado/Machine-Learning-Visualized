import { PENALTIES, REGULARIZATION_EXPERIMENT } from './regularizationConstants.js';

function penaltyFor(penaltyId) {
  const penalty = PENALTIES[penaltyId];
  if (!penalty) throw new RangeError(`Unknown penalty: ${penaltyId}`);
  return penalty;
}

function validateLambda(lambda) {
  if (!Number.isFinite(lambda) || lambda < 0) throw new RangeError('lambda must be a finite non-negative number');
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function softThreshold(value, threshold) {
  if (value > threshold) return value - threshold;
  if (value < -threshold) return value + threshold;
  return 0;
}

function trainingScale(dataset) {
  const featureCount = dataset.rows[0].length;
  const means = Array.from({ length: featureCount }, (_, column) => mean(dataset.rows.map((row) => row[column])));
  const scales = Array.from({ length: featureCount }, (_, column) => {
    const variance = mean(dataset.rows.map((row) => (row[column] - means[column]) ** 2));
    const scale = Math.sqrt(variance);
    return scale > Number.EPSILON ? scale : 1;
  });
  return { means, scales };
}

function standardizeRows(rows, means, scales) {
  return rows.map((row) => row.map((value, column) => (value - means[column]) / scales[column]));
}

export function predictDataset(model, dataset) {
  const standardized = standardizeRows(dataset.rows, model.featureMeans, model.featureScales);
  return standardized.map((row) => model.intercept + row.reduce(
    (sum, value, column) => sum + value * model.coefficients[column],
    0,
  ));
}

export function meanSquaredError(targets, predictions) {
  if (targets.length !== predictions.length || targets.length === 0) {
    throw new RangeError('targets and predictions must have the same non-zero length');
  }
  return targets.reduce((sum, target, index) => sum + (target - predictions[index]) ** 2, 0) / targets.length;
}

export function fitRegularizedLinearModel(dataset, penaltyId, lambda) {
  validateLambda(lambda);
  const penalty = penaltyFor(penaltyId);
  const appliedLambda = penaltyId === 'none' ? 0 : lambda;
  const { means, scales } = trainingScale(dataset);
  const rows = standardizeRows(dataset.rows, means, scales);
  const intercept = mean(dataset.targets);
  const centeredTargets = dataset.targets.map((target) => target - intercept);
  const sampleCount = rows.length;
  const featureCount = rows[0].length;
  const coefficients = Array(featureCount).fill(0);
  const predictions = Array(sampleCount).fill(0);
  let iterations = 0;
  let converged = false;

  for (iterations = 1; iterations <= REGULARIZATION_EXPERIMENT.maxIterations; iterations += 1) {
    let maxDelta = 0;
    for (let column = 0; column < featureCount; column += 1) {
      const previous = coefficients[column];
      let rho = 0;
      let squaredScale = 0;
      for (let rowIndex = 0; rowIndex < sampleCount; rowIndex += 1) {
        const value = rows[rowIndex][column];
        const residualWithoutColumn = centeredTargets[rowIndex] - (predictions[rowIndex] - value * previous);
        rho += value * residualWithoutColumn;
        squaredScale += value * value;
      }
      rho /= sampleCount;
      squaredScale /= sampleCount;
      const denominator = squaredScale + appliedLambda * penalty.l2;
      const next = softThreshold(rho, appliedLambda * penalty.l1) / denominator;
      const delta = next - previous;
      coefficients[column] = next;
      maxDelta = Math.max(maxDelta, Math.abs(delta));
      if (delta !== 0) {
        for (let rowIndex = 0; rowIndex < sampleCount; rowIndex += 1) {
          predictions[rowIndex] += rows[rowIndex][column] * delta;
        }
      }
    }
    if (maxDelta <= REGULARIZATION_EXPERIMENT.convergenceTolerance) {
      converged = true;
      break;
    }
  }

  const model = Object.freeze({
    penaltyId,
    lambda: appliedLambda,
    coefficients: Object.freeze(coefficients),
    intercept,
    featureMeans: Object.freeze(means),
    featureScales: Object.freeze(scales),
    iterations: Math.min(iterations, REGULARIZATION_EXPERIMENT.maxIterations),
    converged,
  });
  const trainPredictions = predictDataset(model, dataset);
  const trainMse = meanSquaredError(dataset.targets, trainPredictions);
  const l1Norm = coefficients.reduce((sum, coefficient) => sum + Math.abs(coefficient), 0);
  const l2SquaredNorm = coefficients.reduce((sum, coefficient) => sum + coefficient ** 2, 0);
  const penaltyLoss = appliedLambda * (penalty.l1 * l1Norm + 0.5 * penalty.l2 * l2SquaredNorm);

  return Object.freeze({
    model,
    trainMse,
    dataLoss: trainMse / 2,
    penaltyLoss,
    objective: trainMse / 2 + penaltyLoss,
  });
}
