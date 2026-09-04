function validateVector(values, name) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite array`);
  }
}

export function softmax(logits) {
  validateVector(logits, 'logits');
  const max = Math.max(...logits);
  const exps = logits.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

export function expectedReturn(probabilities, returns) {
  validateVector(probabilities, 'probabilities');
  validateVector(returns, 'returns');
  if (probabilities.length !== returns.length) throw new RangeError('vector lengths must match');
  return probabilities.reduce((sum, probability, index) => sum + probability * returns[index], 0);
}

export function scoreFunctionGradient(probabilities, actionIndex) {
  validateVector(probabilities, 'probabilities');
  if (!Number.isInteger(actionIndex) || actionIndex < 0 || actionIndex >= probabilities.length) throw new RangeError('actionIndex out of range');
  return probabilities.map((probability, index) => (index === actionIndex ? 1 : 0) - probability);
}

export function reinforceGradient(logits, actionIndex, advantage) {
  if (!Number.isFinite(advantage)) throw new TypeError('advantage must be finite');
  const probabilities = softmax(logits);
  return scoreFunctionGradient(probabilities, actionIndex).map((value) => advantage * value);
}

export function applyGradientAscent(logits, gradient, learningRate) {
  validateVector(logits, 'logits');
  validateVector(gradient, 'gradient');
  if (logits.length !== gradient.length) throw new RangeError('vector lengths must match');
  if (!Number.isFinite(learningRate) || learningRate < 0) throw new RangeError('learningRate must be non-negative');
  return logits.map((value, index) => value + learningRate * gradient[index]);
}

export function exactPolicyGradient(logits, actionReturns) {
  const probabilities = softmax(logits);
  validateVector(actionReturns, 'actionReturns');
  if (probabilities.length !== actionReturns.length) throw new RangeError('vector lengths must match');
  const objective = expectedReturn(probabilities, actionReturns);
  return {
    probabilities,
    objective,
    gradient: probabilities.map((probability, index) => probability * (actionReturns[index] - objective)),
  };
}

export function expectedReinforceGradient(logits, actionReturns, baseline = 0) {
  if (!Number.isFinite(baseline)) throw new TypeError('baseline must be finite');
  const probabilities = softmax(logits);
  const gradient = Array.from({ length: logits.length }, () => 0);
  probabilities.forEach((probability, actionIndex) => {
    const sampleGradient = scoreFunctionGradient(probabilities, actionIndex);
    const advantage = actionReturns[actionIndex] - baseline;
    sampleGradient.forEach((value, index) => {
      gradient[index] += probability * advantage * value;
    });
  });
  return gradient;
}

export function reinforceGradientVariance(logits, actionReturns, baseline = 0) {
  const probabilities = softmax(logits);
  const mean = expectedReinforceGradient(logits, actionReturns, baseline);
  let variance = 0;
  probabilities.forEach((probability, actionIndex) => {
    const sample = scoreFunctionGradient(probabilities, actionIndex).map((value) => value * (actionReturns[actionIndex] - baseline));
    const squaredDistance = sample.reduce((sum, value, index) => sum + (value - mean[index]) ** 2, 0);
    variance += probability * squaredDistance;
  });
  return variance;
}

export function buildPolicyGradientStep({ logits, actionReturns, sampledAction, sampledReturn, baseline, learningRate }) {
  const before = softmax(logits);
  const advantage = sampledReturn - baseline;
  const gradient = reinforceGradient(logits, sampledAction, advantage);
  const nextLogits = applyGradientAscent(logits, gradient, learningRate);
  const after = softmax(nextLogits);
  const exact = exactPolicyGradient(logits, actionReturns);
  const zeroBaselineVariance = reinforceGradientVariance(logits, actionReturns, 0);
  const selectedBaselineVariance = reinforceGradientVariance(logits, actionReturns, baseline);
  return {
    before,
    after,
    advantage,
    gradient,
    nextLogits,
    exactGradient: exact.gradient,
    objective: exact.objective,
    zeroBaselineVariance,
    selectedBaselineVariance,
    gradientSum: gradient.reduce((sum, value) => sum + value, 0),
  };
}
