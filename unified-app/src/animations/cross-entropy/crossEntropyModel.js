function validateVector(values, name) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite array`);
  }
}

function validateDistribution(probabilities, name) {
  validateVector(probabilities, name);
  if (probabilities.some((value) => value < 0 || value > 1)) throw new RangeError(`${name} must contain probabilities`);
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 1e-9) throw new RangeError(`${name} must sum to one`);
}

function validateBatchExamples(examples) {
  if (!Array.isArray(examples) || examples.length === 0) throw new TypeError('examples must be a non-empty array');
  examples.forEach((example, index) => {
    if (!example || !Number.isInteger(example.targetIndex)) throw new TypeError(`examples[${index}] must define targetIndex`);
    validateVector(example.logits, `examples[${index}].logits`);
    if (example.logits.length < 2) throw new RangeError(`examples[${index}] must contain at least two logits`);
    if (example.targetIndex < 0 || example.targetIndex >= example.logits.length) {
      throw new RangeError(`examples[${index}].targetIndex is out of range`);
    }
  });
}

export function logSumExp(logits) {
  validateVector(logits, 'logits');
  const max = Math.max(...logits);
  return max + Math.log(logits.reduce((sum, value) => sum + Math.exp(value - max), 0));
}

export function logSoftmax(logits) {
  const normalizer = logSumExp(logits);
  return logits.map((value) => value - normalizer);
}

export function softmax(logits) {
  return logSoftmax(logits).map((value) => Math.exp(value));
}

export function naiveSoftmax(logits) {
  validateVector(logits, 'logits');
  const exponentials = logits.map((value) => Math.exp(value));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

export function oneHot(classCount, targetIndex) {
  if (!Number.isInteger(classCount) || classCount < 2) throw new RangeError('classCount must be at least two');
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= classCount) throw new RangeError('targetIndex is out of range');
  return Array.from({ length: classCount }, (_, index) => index === targetIndex ? 1 : 0);
}

export function smoothTarget(target, smoothing) {
  validateDistribution(target, 'target');
  if (!Number.isFinite(smoothing) || smoothing < 0 || smoothing >= 1) throw new RangeError('smoothing must be in [0, 1)');
  const uniform = 1 / target.length;
  return target.map((value) => (1 - smoothing) * value + smoothing * uniform);
}

export function entropy(probabilities) {
  validateDistribution(probabilities, 'probabilities');
  return probabilities.reduce((sum, probability) => probability === 0 ? sum : sum - probability * Math.log(probability), 0);
}

export function categoricalCrossEntropy(target, prediction) {
  validateDistribution(target, 'target');
  validateDistribution(prediction, 'prediction');
  if (target.length !== prediction.length) throw new RangeError('target and prediction must have equal length');
  let total = 0;
  for (let index = 0; index < target.length; index += 1) {
    if (target[index] === 0) continue;
    if (prediction[index] === 0) return Number.POSITIVE_INFINITY;
    total -= target[index] * Math.log(prediction[index]);
  }
  return total;
}

export function crossEntropyFromLogits(target, logits) {
  validateDistribution(target, 'target');
  validateVector(logits, 'logits');
  if (target.length !== logits.length) throw new RangeError('target and logits must have equal length');
  const logProbabilities = logSoftmax(logits);
  return -target.reduce((sum, value, index) => sum + value * logProbabilities[index], 0);
}

export function klDivergence(target, prediction) {
  const ce = categoricalCrossEntropy(target, prediction);
  const h = entropy(target);
  return Number.isFinite(ce) ? Math.max(0, ce - h) : ce;
}

export function softmaxCrossEntropyGradient(target, prediction) {
  validateDistribution(target, 'target');
  validateDistribution(prediction, 'prediction');
  if (target.length !== prediction.length) throw new RangeError('target and prediction must have equal length');
  return prediction.map((value, index) => value - target[index]);
}

export function binaryCrossEntropy(target, probability) {
  if (target !== 0 && target !== 1) throw new RangeError('binary target must be zero or one');
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) throw new RangeError('probability must be in [0, 1]');
  if ((target === 1 && probability === 0) || (target === 0 && probability === 1)) return Number.POSITIVE_INFINITY;
  if ((target === 1 && probability === 1) || (target === 0 && probability === 0)) return 0;
  if (target === 1) return -Math.log(probability);
  return -Math.log(1 - probability);
}

export function batchCrossEntropy(examples, reduction = 'mean', sampleWeights = null) {
  validateBatchExamples(examples);
  if (!['none', 'sum', 'mean'].includes(reduction)) throw new RangeError(`Unknown reduction: ${reduction}`);
  const weights = sampleWeights ?? Array(examples.length).fill(1);
  if (!Array.isArray(weights) || weights.length !== examples.length || weights.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError('sampleWeights must be non-negative finite values matching examples');
  }
  const weightSum = weights.reduce((sum, value) => sum + value, 0);
  if (reduction === 'mean' && weightSum <= 0) throw new RangeError('mean reduction requires positive total sample weight');

  const losses = examples.map((example) => crossEntropyFromLogits(oneHot(example.logits.length, example.targetIndex), example.logits));
  const weightedLosses = losses.map((loss, index) => loss * weights[index]);
  if (reduction === 'none') return weightedLosses;
  const total = weightedLosses.reduce((sum, value) => sum + value, 0);
  return reduction === 'sum' ? total : total / weightSum;
}

function sharedLogitScaleGradient(examples, reduction) {
  validateBatchExamples(examples);
  const contributions = examples.map((example) => {
    const target = oneHot(example.logits.length, example.targetIndex);
    const prediction = softmax(example.logits);
    const gradient = softmaxCrossEntropyGradient(target, prediction);
    return gradient.reduce((sum, value, index) => sum + value * example.logits[index], 0);
  });
  const total = contributions.reduce((sum, value) => sum + value, 0);
  if (reduction === 'sum') return total;
  if (reduction === 'mean') return total / examples.length;
  throw new RangeError(`Unknown reduction: ${reduction}`);
}

export function buildBatchReductionLab(examples) {
  validateBatchExamples(examples);
  const duplicated = [...examples, ...examples];
  const sumLoss = batchCrossEntropy(examples, 'sum');
  const meanLoss = batchCrossEntropy(examples, 'mean');
  const duplicatedSumLoss = batchCrossEntropy(duplicated, 'sum');
  const duplicatedMeanLoss = batchCrossEntropy(duplicated, 'mean');
  const sumGradient = sharedLogitScaleGradient(examples, 'sum');
  const meanGradient = sharedLogitScaleGradient(examples, 'mean');
  const duplicatedSumGradient = sharedLogitScaleGradient(duplicated, 'sum');
  const duplicatedMeanGradient = sharedLogitScaleGradient(duplicated, 'mean');

  return {
    exampleCount: examples.length,
    perExampleLosses: batchCrossEntropy(examples, 'none'),
    sumLoss,
    meanLoss,
    duplicatedSumLoss,
    duplicatedMeanLoss,
    sumLossRatio: duplicatedSumLoss / sumLoss,
    meanLossRatio: duplicatedMeanLoss / meanLoss,
    sumGradient,
    meanGradient,
    duplicatedSumGradient,
    duplicatedMeanGradient,
    sumGradientRatio: duplicatedSumGradient / sumGradient,
    meanGradientRatio: duplicatedMeanGradient / meanGradient,
  };
}

export function buildCrossEntropyLab({ scenario, logitScale, labelSmoothing }) {
  if (!scenario) throw new TypeError('scenario is required');
  if (!Number.isFinite(logitScale) || logitScale <= 0) throw new RangeError('logitScale must be positive');
  const logits = scenario.logits.map((value) => value * logitScale);
  const prediction = softmax(logits);
  const naivePrediction = naiveSoftmax(logits);
  const naiveSoftmaxFinite = naivePrediction.every(Number.isFinite);
  const hardTarget = oneHot(logits.length, scenario.targetIndex);
  const target = smoothTarget(hardTarget, labelSmoothing);
  const loss = crossEntropyFromLogits(target, logits);
  const probabilityLoss = categoricalCrossEntropy(target, prediction);
  const targetEntropy = entropy(target);
  const kl = Math.max(0, loss - targetEntropy);
  const gradient = softmaxCrossEntropyGradient(target, prediction);
  const predictedIndex = prediction.indexOf(Math.max(...prediction));

  return {
    logits,
    prediction,
    naivePrediction,
    naiveSoftmaxFinite,
    hardTarget,
    target,
    loss,
    probabilityLoss,
    targetEntropy,
    klDivergence: kl,
    decompositionResidual: loss - targetEntropy - kl,
    gradient,
    gradientSum: gradient.reduce((sum, value) => sum + value, 0),
    predictedIndex,
    correct: predictedIndex === scenario.targetIndex,
    trueClassProbability: prediction[scenario.targetIndex],
  };
}
