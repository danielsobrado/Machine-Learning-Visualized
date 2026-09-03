function requireFiniteArray(values, name) {
  if (!Array.isArray(values) || values.length < 2 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must contain at least two finite values`);
  }
}

function requirePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

export function stableSoftmax(logits, temperature = 1) {
  requireFiniteArray(logits, 'logits');
  requirePositive(temperature, 'temperature');
  const scaled = logits.map((value) => value / temperature);
  const maximum = Math.max(...scaled);
  const exponentials = scaled.map((value) => Math.exp(value - maximum));
  const denominator = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / denominator);
}

export function scaleLogits(logits, scale) {
  requireFiniteArray(logits, 'logits');
  requirePositive(scale, 'scale');
  return logits.map((value) => value * scale);
}

export function argmax(values) {
  requireFiniteArray(values, 'values');
  return values.reduce((bestIndex, value, index) => (
    value > values[bestIndex] ? index : bestIndex
  ), 0);
}

export function negativeLogLikelihood(probabilities, targetIndex) {
  requireFiniteArray(probabilities, 'probabilities');
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= probabilities.length) {
    throw new RangeError('targetIndex must reference a probability');
  }
  const probability = probabilities[targetIndex];
  if (probability <= 0 || probability > 1) throw new RangeError('target probability must be in (0, 1]');
  return -Math.log(probability);
}

export function confidenceScalingExperiment({ logits, scale, targetIndex }) {
  const scaledLogits = scaleLogits(logits, scale);
  const before = stableSoftmax(logits);
  const after = stableSoftmax(scaledLogits);
  const beforePrediction = argmax(before);
  const afterPrediction = argmax(after);

  return {
    logits: [...logits],
    scaledLogits,
    before,
    after,
    beforePrediction,
    afterPrediction,
    predictionUnchanged: beforePrediction === afterPrediction,
    beforeMaxProbability: Math.max(...before),
    afterMaxProbability: Math.max(...after),
    targetIndex,
    targetCorrectBefore: beforePrediction === targetIndex,
    targetCorrectAfter: afterPrediction === targetIndex,
    beforeTargetProbability: before[targetIndex],
    afterTargetProbability: after[targetIndex],
    beforeNll: negativeLogLikelihood(before, targetIndex),
    afterNll: negativeLogLikelihood(after, targetIndex),
  };
}

export function shiftInvarianceExperiment(logits, shift) {
  requireFiniteArray(logits, 'logits');
  if (!Number.isFinite(shift)) throw new RangeError('shift must be finite');
  const before = stableSoftmax(logits);
  const shifted = logits.map((value) => value + shift);
  const after = stableSoftmax(shifted);
  return {
    before,
    after,
    shifted,
    maxAbsoluteDifference: Math.max(...before.map((value, index) => Math.abs(value - after[index]))),
  };
}
