export function relu(value) {
  if (!Number.isFinite(value)) throw new RangeError('value must be finite');
  return Math.max(0, value);
}

export function reluDerivative(value) {
  if (!Number.isFinite(value)) throw new RangeError('value must be finite');
  return value > 0 ? 1 : 0;
}

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

function requirePositive(value, name) {
  requireFinite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
}

export function reluTrainingStep({ input, target, weight, bias, learningRate }) {
  [input, target, weight, bias].forEach((value, index) => {
    requireFinite(value, ['input', 'target', 'weight', 'bias'][index]);
  });
  requirePositive(learningRate, 'learningRate');

  const z = (weight * input) + bias;
  const activation = relu(z);
  const error = activation - target;
  const loss = 0.5 * error * error;
  const localSlope = reluDerivative(z);
  const dLossDz = error * localSlope;
  const weightGradient = dLossDz * input;
  const biasGradient = dLossDz;
  const nextWeight = weight - (learningRate * weightGradient);
  const nextBias = bias - (learningRate * biasGradient);

  return {
    z,
    activation,
    error,
    loss,
    localSlope,
    dLossDz,
    weightGradient,
    biasGradient,
    nextWeight,
    nextBias,
    dead: z <= 0,
  };
}

export function simulateReluTraining({ input, target, weight, bias, learningRate, steps }) {
  if (!Number.isInteger(steps) || steps <= 0) throw new RangeError('steps must be a positive integer');
  let currentWeight = weight;
  let currentBias = bias;
  const history = [];

  for (let step = 1; step <= steps; step += 1) {
    const result = reluTrainingStep({
      input,
      target,
      weight: currentWeight,
      bias: currentBias,
      learningRate,
    });
    history.push({ step, weight: currentWeight, bias: currentBias, ...result });
    currentWeight = result.nextWeight;
    currentBias = result.nextBias;
  }

  return {
    history,
    firstDeadStep: history.find((entry) => entry.dead)?.step ?? null,
    final: history.at(-1),
  };
}

export function recoveryProbe({ input, target, weight, bias, learningRate, biasNudge }) {
  requireFinite(biasNudge, 'biasNudge');
  const before = reluTrainingStep({ input, target, weight, bias, learningRate });
  const after = reluTrainingStep({ input, target, weight, bias: bias + biasNudge, learningRate });
  return {
    before,
    after,
    revived: before.dead && !after.dead,
  };
}
