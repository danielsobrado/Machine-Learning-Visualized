import {
  DROPOUT_BATCHNORM_DEFAULTS,
  DROPOUT_DEMO,
  VALUE_BOUNDS,
} from './dropoutBatchNormConstants.js';

function assertFinite(value, name) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be finite`);
  }
}

function assertPositiveStd(value, name) {
  assertFinite(value, name);
  if (value < VALUE_BOUNDS.minimumStd) {
    throw new RangeError(`${name} must be at least ${VALUE_BOUNDS.minimumStd}`);
  }
}

function assertDropoutRate(value) {
  assertFinite(value, 'dropoutRate');
  if (value < 0 || value > VALUE_BOUNDS.maximumDropoutRate) {
    throw new RangeError(`dropoutRate must be between 0 and ${VALUE_BOUNDS.maximumDropoutRate}`);
  }
}

function seededUniform(seed, index) {
  let state = (seed + Math.imul(index + 1, 0x9e3779b1)) >>> 0;
  state ^= state >>> 16;
  state = Math.imul(state, 0x21f0aaad);
  state ^= state >>> 15;
  state = Math.imul(state, 0x735a2d97);
  state ^= state >>> 15;
  return (state >>> 0) / 4294967296;
}

export function normalize(value, mean, std) {
  assertFinite(value, 'value');
  assertFinite(mean, 'mean');
  assertPositiveStd(std, 'std');
  return (value - mean) / std;
}

export function batchNorm(value, { mean, std, gamma = 1, beta = 0 }) {
  assertFinite(gamma, 'gamma');
  assertFinite(beta, 'beta');
  const normalized = normalize(value, mean, std);
  return {
    normalized,
    output: (gamma * normalized) + beta,
  };
}

export function invertedDropout(value, dropoutRate, kept) {
  assertFinite(value, 'value');
  assertDropoutRate(dropoutRate);
  if (typeof kept !== 'boolean') {
    throw new TypeError('kept must be boolean');
  }
  if (!kept) return 0;
  return value / (1 - dropoutRate);
}

export function dropoutPasses({
  value,
  dropoutRate,
  trainingMode,
  passes = DROPOUT_DEMO.passes,
  seed = DROPOUT_DEMO.initialSeed,
}) {
  assertFinite(value, 'value');
  assertDropoutRate(dropoutRate);
  if (typeof trainingMode !== 'boolean') {
    throw new TypeError('trainingMode must be boolean');
  }
  if (!Number.isInteger(passes) || passes < 1) {
    throw new RangeError('passes must be a positive integer');
  }
  if (!Number.isInteger(seed)) {
    throw new TypeError('seed must be an integer');
  }

  const keepProbability = 1 - dropoutRate;
  return Array.from({ length: passes }, (_, index) => {
    const kept = trainingMode ? seededUniform(seed, index) < keepProbability : true;
    return {
      index,
      kept,
      output: trainingMode ? invertedDropout(value, dropoutRate, kept) : value,
    };
  });
}

export function summarizePasses(passes) {
  if (!Array.isArray(passes) || passes.length === 0) {
    throw new RangeError('passes must be a non-empty array');
  }
  const values = passes.map((pass) => pass.output);
  values.forEach((value) => assertFinite(value, 'pass.output'));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
  return {
    mean,
    std: Math.sqrt(variance),
    keptCount: passes.filter((pass) => pass.kept).length,
    droppedCount: passes.filter((pass) => !pass.kept).length,
  };
}

export function layerFlow({
  activation = DROPOUT_BATCHNORM_DEFAULTS.activation,
  batchMean = DROPOUT_BATCHNORM_DEFAULTS.batchMean,
  batchStd = DROPOUT_BATCHNORM_DEFAULTS.batchStd,
  runningMean = DROPOUT_BATCHNORM_DEFAULTS.runningMean,
  runningStd = DROPOUT_BATCHNORM_DEFAULTS.runningStd,
  gamma = DROPOUT_BATCHNORM_DEFAULTS.gamma,
  beta = DROPOUT_BATCHNORM_DEFAULTS.beta,
  dropoutRate = DROPOUT_BATCHNORM_DEFAULTS.dropoutRate,
  trainingMode = DROPOUT_BATCHNORM_DEFAULTS.trainingMode,
  seed = DROPOUT_DEMO.initialSeed,
} = {}) {
  const stats = trainingMode
    ? { mean: batchMean, std: batchStd }
    : { mean: runningMean, std: runningStd };
  const normalized = batchNorm(activation, { ...stats, gamma, beta });
  const passes = dropoutPasses({
    value: normalized.output,
    dropoutRate,
    trainingMode,
    seed,
  });

  return {
    statsSource: trainingMode ? 'current batch' : 'running statistics',
    normalized: normalized.normalized,
    batchNormOutput: normalized.output,
    passes,
    passSummary: summarizePasses(passes),
    expectedDropoutOutput: normalized.output,
  };
}

export function batchNormModeComparison({
  activation = DROPOUT_BATCHNORM_DEFAULTS.activation,
  batchMean = DROPOUT_BATCHNORM_DEFAULTS.batchMean,
  batchStd = DROPOUT_BATCHNORM_DEFAULTS.batchStd,
  runningMean = DROPOUT_BATCHNORM_DEFAULTS.runningMean,
  runningStd = DROPOUT_BATCHNORM_DEFAULTS.runningStd,
  gamma = DROPOUT_BATCHNORM_DEFAULTS.gamma,
  beta = DROPOUT_BATCHNORM_DEFAULTS.beta,
} = {}) {
  const training = batchNorm(activation, { mean: batchMean, std: batchStd, gamma, beta });
  const inference = batchNorm(activation, { mean: runningMean, std: runningStd, gamma, beta });
  return {
    training,
    inference,
    modeGap: Math.abs(training.output - inference.output),
  };
}
