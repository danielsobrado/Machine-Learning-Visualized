import {
  OPTIMIZER_DEFAULTS,
  OPTIMIZER_LANDSCAPE,
  OPTIMIZERS,
  TUNING_LEARNING_RATES,
} from './optimizerConstants.js';

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

function requirePositive(value, name) {
  requireFinite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
}

function requireProbability(value, name) {
  requireFinite(value, name);
  if (value < 0 || value >= 1) throw new RangeError(`${name} must be in [0, 1)`);
}

function requireVector2(value, name) {
  if (!Array.isArray(value) || value.length !== 2 || value.some((item) => !Number.isFinite(item))) {
    throw new TypeError(`${name} must be a finite 2D vector`);
  }
}

function requireOptimizer(optimizer) {
  if (!Object.hasOwn(OPTIMIZERS, optimizer)) throw new RangeError(`Unknown optimizer: ${optimizer}`);
}

export function l2Norm(vector) {
  if (!Array.isArray(vector) || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError('vector must contain finite numbers');
  }
  return Math.sqrt(vector.reduce((sum, value) => sum + (value * value), 0));
}

export function loss([x, y]) {
  return OPTIMIZER_LANDSCAPE.xCoefficient * (x - OPTIMIZER_LANDSCAPE.minimum[0]) ** 2
    + OPTIMIZER_LANDSCAPE.yCoefficient * (y - OPTIMIZER_LANDSCAPE.minimum[1]) ** 2;
}

export function trueGradient([x, y]) {
  return [
    2 * OPTIMIZER_LANDSCAPE.xCoefficient * (x - OPTIMIZER_LANDSCAPE.minimum[0]),
    2 * OPTIMIZER_LANDSCAPE.yCoefficient * (y - OPTIMIZER_LANDSCAPE.minimum[1]),
  ];
}

export function gradientNoiseScale(batchSize) {
  if (!Number.isInteger(batchSize) || batchSize <= 0) throw new RangeError('batchSize must be a positive integer');
  return OPTIMIZER_LANDSCAPE.noiseConstant / Math.sqrt(batchSize);
}

export function deterministicNoise(step, batchSize) {
  if (!Number.isInteger(step) || step <= 0) throw new RangeError('step must be a positive integer');
  const scale = gradientNoiseScale(batchSize);
  return [
    Math.sin(step * 1.7 + batchSize * 0.11) * scale,
    Math.cos(step * 2.3 + batchSize * 0.07) * scale,
  ];
}

export function adamStep({
  gradient,
  learningRate,
  beta1,
  beta2,
  epsilon,
  step,
  firstMoment = [0, 0],
  secondMoment = [0, 0],
  biasCorrection = true,
}) {
  requireVector2(gradient, 'gradient');
  requireVector2(firstMoment, 'firstMoment');
  requireVector2(secondMoment, 'secondMoment');
  requirePositive(learningRate, 'learningRate');
  requireProbability(beta1, 'beta1');
  requireProbability(beta2, 'beta2');
  requirePositive(epsilon, 'epsilon');
  if (!Number.isInteger(step) || step <= 0) throw new RangeError('step must be a positive integer');

  const nextFirstMoment = gradient.map((value, index) => (
    beta1 * firstMoment[index] + (1 - beta1) * value
  ));
  const nextSecondMoment = gradient.map((value, index) => (
    beta2 * secondMoment[index] + (1 - beta2) * value * value
  ));
  const firstScale = biasCorrection ? 1 - beta1 ** step : 1;
  const secondScale = biasCorrection ? 1 - beta2 ** step : 1;
  const correctedFirst = nextFirstMoment.map((value) => value / firstScale);
  const correctedSecond = nextSecondMoment.map((value) => value / secondScale);
  const update = correctedFirst.map((value, index) => (
    -learningRate * value / (Math.sqrt(correctedSecond[index]) + epsilon)
  ));

  return {
    firstMoment: nextFirstMoment,
    secondMoment: nextSecondMoment,
    correctedFirst,
    correctedSecond,
    update,
  };
}

export function adamFirstStepAnatomy({ gradient, learningRate, beta1, beta2, epsilon }) {
  const corrected = adamStep({
    gradient,
    learningRate,
    beta1,
    beta2,
    epsilon,
    step: 1,
    biasCorrection: true,
  });
  const uncorrected = adamStep({
    gradient,
    learningRate,
    beta1,
    beta2,
    epsilon,
    step: 1,
    biasCorrection: false,
  });
  const effectiveLearningRates = corrected.update.map((value, index) => (
    gradient[index] === 0 ? 0 : Math.abs(value / gradient[index])
  ));
  const correctedNorm = l2Norm(corrected.update);
  const uncorrectedNorm = l2Norm(uncorrected.update);

  return {
    gradient: [...gradient],
    corrected,
    uncorrected,
    effectiveLearningRates,
    correctedNorm,
    uncorrectedNorm,
    uncorrectedToCorrectedNormRatio: correctedNorm === 0 ? 1 : uncorrectedNorm / correctedNorm,
  };
}

export function simulate({
  optimizer,
  learningRate,
  beta1 = OPTIMIZER_DEFAULTS.beta1,
  beta2 = OPTIMIZER_DEFAULTS.beta2,
  epsilon = OPTIMIZER_DEFAULTS.epsilon,
  batchSize,
  steps,
}) {
  requireOptimizer(optimizer);
  requirePositive(learningRate, 'learningRate');
  requireProbability(beta1, 'beta1');
  requireProbability(beta2, 'beta2');
  requirePositive(epsilon, 'epsilon');
  if (!Number.isInteger(batchSize) || batchSize <= 0) throw new RangeError('batchSize must be a positive integer');
  if (!Number.isInteger(steps) || steps <= 0) throw new RangeError('steps must be a positive integer');

  let theta = [...OPTIMIZER_LANDSCAPE.start];
  let velocity = [0, 0];
  let firstMoment = [0, 0];
  let secondMoment = [0, 0];
  const path = [{ step: 0, theta: [...theta], loss: loss(theta), grad: [0, 0], update: [0, 0] }];

  for (let step = 1; step <= steps; step += 1) {
    const exactGradient = trueGradient(theta);
    const noise = deterministicNoise(step, batchSize);
    const gradient = exactGradient.map((value, index) => value + noise[index]);
    let update;

    if (optimizer === 'momentum') {
      velocity = gradient.map((value, index) => beta1 * velocity[index] + value);
      update = velocity.map((value) => -learningRate * value);
    } else if (optimizer === 'adam') {
      const adam = adamStep({
        gradient,
        learningRate,
        beta1,
        beta2,
        epsilon,
        step,
        firstMoment,
        secondMoment,
        biasCorrection: true,
      });
      firstMoment = adam.firstMoment;
      secondMoment = adam.secondMoment;
      update = adam.update;
    } else {
      update = gradient.map((value) => -learningRate * value);
    }

    theta = theta.map((value, index) => value + update[index]);
    path.push({
      step,
      theta: [...theta],
      loss: loss(theta),
      exactGradient,
      noise,
      grad: gradient,
      update,
    });
  }

  return path;
}

function finalLossFor(optimizer, learningRate, shared) {
  const path = simulate({ optimizer, learningRate, ...shared });
  return path.at(-1).loss;
}

export function evaluateOptimizerFairness({
  learningRate,
  beta1,
  beta2,
  epsilon,
  batchSize,
  steps,
  learningRates = TUNING_LEARNING_RATES,
}) {
  requirePositive(learningRate, 'learningRate');
  if (!Array.isArray(learningRates) || learningRates.length === 0) throw new TypeError('learningRates must be non-empty');
  learningRates.forEach((value) => requirePositive(value, 'tuning learning rate'));
  const shared = { beta1, beta2, epsilon, batchSize, steps };

  const sameRate = Object.keys(OPTIMIZERS).map((optimizer) => ({
    optimizer,
    learningRate,
    finalLoss: finalLossFor(optimizer, learningRate, shared),
  })).sort((a, b) => a.finalLoss - b.finalLoss);

  const tuned = Object.keys(OPTIMIZERS).map((optimizer) => {
    const candidates = learningRates.map((candidateLearningRate) => ({
      optimizer,
      learningRate: candidateLearningRate,
      finalLoss: finalLossFor(optimizer, candidateLearningRate, shared),
    }));
    return candidates.reduce((best, candidate) => (candidate.finalLoss < best.finalLoss ? candidate : best));
  }).sort((a, b) => a.finalLoss - b.finalLoss);

  return {
    sameRate,
    tuned,
    sameRateWinner: sameRate[0].optimizer,
    tunedWinner: tuned[0].optimizer,
    rankingChanged: sameRate.map((item) => item.optimizer).join('|') !== tuned.map((item) => item.optimizer).join('|'),
  };
}

export function project([x, y]) {
  return {
    cx: 60 + ((x + 5.5) / 5.5) * 420,
    cy: 320 - ((y + 0.5) / 4.5) * 260,
  };
}

export function lossColor(value) {
  if (value < 0.2) return '#ecfdf5';
  if (value < 0.6) return '#dbeafe';
  if (value < 1.4) return '#fef3c7';
  return '#fee2e2';
}
