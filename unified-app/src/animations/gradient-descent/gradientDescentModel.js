import {
  DEFAULT_LEARNING_RATE,
  DEFAULT_START_WEIGHT,
  LOSS_SCENE,
  STABILITY_LAB,
} from './gradientDescentConstants.js';

export { DEFAULT_LEARNING_RATE, DEFAULT_START_WEIGHT };

export function loss(weight) {
  return weight * weight;
}

export function gradient(weight) {
  return 2 * weight;
}

export function nextWeight(weight, learningRate) {
  return weight - learningRate * gradient(weight);
}

export function updateMultiplier(learningRate) {
  return 1 - 2 * learningRate;
}

export function convergenceFactor(learningRate) {
  return Math.abs(updateMultiplier(learningRate));
}

export function learningRateStatus(learningRate) {
  if (!Number.isFinite(learningRate) || learningRate <= 0) {
    return { text: 'Invalid', color: 'text-red-600', converges: false };
  }
  if (learningRate < 0.05) {
    return { text: 'Very slow · converges', color: 'text-yellow-600', converges: true };
  }
  if (learningRate < 0.5) {
    return { text: 'Monotonic · converges', color: 'text-green-600', converges: true };
  }
  if (learningRate === 0.5) {
    return { text: 'One-step optimum', color: 'text-emerald-600', converges: true };
  }
  if (learningRate < 1) {
    return { text: 'Oscillatory · converges', color: 'text-blue-600', converges: true };
  }
  if (learningRate === 1) {
    return { text: 'Critical · no convergence', color: 'text-orange-600', converges: false };
  }
  return { text: 'Diverges', color: 'text-red-600', converges: false };
}

export function simulateQuadraticDescent({
  learningRate,
  startWeight = STABILITY_LAB.startWeight,
  steps = STABILITY_LAB.steps,
}) {
  if (!Number.isFinite(learningRate) || learningRate <= 0) {
    throw new RangeError('learningRate must be a positive finite number');
  }
  if (!Number.isFinite(startWeight)) {
    throw new TypeError('startWeight must be finite');
  }
  if (!Number.isInteger(steps) || steps < 1) {
    throw new RangeError('steps must be a positive integer');
  }

  const history = [{ iteration: 0, weight: startWeight, loss: loss(startWeight) }];
  let weight = startWeight;

  for (let iteration = 1; iteration <= steps; iteration += 1) {
    weight = nextWeight(weight, learningRate);
    history.push({ iteration, weight, loss: loss(weight) });
  }

  return history;
}

export function lossWorldY(weight) {
  return LOSS_SCENE.minimumY + loss(weight) * LOSS_SCENE.lossScale;
}
