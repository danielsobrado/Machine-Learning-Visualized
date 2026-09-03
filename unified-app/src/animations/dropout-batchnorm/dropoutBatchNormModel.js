import {
  DROPOUT_BATCHNORM_DEFAULTS,
  DROPOUT_DEMO,
  VALUE_BOUNDS,
} from './dropoutBatchNormConstants.js';

function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function assertVector(values, name = 'values') {
  if (!Array.isArray(values) || values.length === 0) {
    throw new RangeError(`${name} must be a non-empty array`);
  }
  values.forEach((value) => assertFinite(value, `${name} value`));
}

function assertVariance(value, name = 'variance') {
  assertFinite(value, name);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
}

function assertEpsilon(value) {
  assertFinite(value, 'epsilon');
  if (value < VALUE_BOUNDS.minimumEpsilon) {
    throw new RangeError(`epsilon must be at least ${VALUE_BOUNDS.minimumEpsilon}`);
  }
}

function assertDropoutRate(value) {
  assertFinite(value, 'dropoutRate');
  if (value < 0 || value > VALUE_BOUNDS.maximumDropoutRate) {
    throw new RangeError(`dropoutRate must be between 0 and ${VALUE_BOUNDS.maximumDropoutRate}`);
  }
}

function assertUpdateWeight(value) {
  assertFinite(value, 'updateWeight');
  if (value < 0 || value > VALUE_BOUNDS.maximumUpdateWeight) {
    throw new RangeError('updateWeight must be between 0 and 1');
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

export function batchStats(values) {
  assertVector(values);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
  return { mean, variance };
}

export function normalizeWithVariance(
  value,
  mean,
  variance,
  epsilon = DROPOUT_BATCHNORM_DEFAULTS.epsilon,
) {
  assertFinite(value, 'value');
  assertFinite(mean, 'mean');
  assertVariance(variance);
  assertEpsilon(epsilon);
  return (value - mean) / Math.sqrt(variance + epsilon);
}

export function normalize(value, mean, std) {
  assertFinite(std, 'std');
  if (std <= 0) throw new RangeError('std must be positive');
  return normalizeWithVariance(value, mean, std ** 2);
}

export function batchNorm(value, {
  mean,
  variance,
  std,
  gamma = 1,
  beta = 0,
  epsilon = DROPOUT_BATCHNORM_DEFAULTS.epsilon,
}) {
  assertFinite(gamma, 'gamma');
  assertFinite(beta, 'beta');
  const resolvedVariance = variance ?? (std === undefined ? undefined : std ** 2);
  assertVariance(resolvedVariance);
  const normalized = normalizeWithVariance(value, mean, resolvedVariance, epsilon);
  return { normalized, output: (gamma * normalized) + beta };
}

export function trainingBatchNorm(values, {
  selectedIndex = DROPOUT_BATCHNORM_DEFAULTS.selectedIndex,
  gamma = DROPOUT_BATCHNORM_DEFAULTS.gamma,
  beta = DROPOUT_BATCHNORM_DEFAULTS.beta,
  epsilon = DROPOUT_BATCHNORM_DEFAULTS.epsilon,
} = {}) {
  assertVector(values);
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= values.length) {
    throw new RangeError('selectedIndex must identify a batch observation');
  }
  const stats = batchStats(values);
  const outputs = values.map((value) => batchNorm(value, { ...stats, gamma, beta, epsilon }));
  return {
    stats,
    selected: outputs[selectedIndex],
    outputs,
  };
}

export function inferenceBatchNorm(value, runningState, {
  gamma = DROPOUT_BATCHNORM_DEFAULTS.gamma,
  beta = DROPOUT_BATCHNORM_DEFAULTS.beta,
  epsilon = DROPOUT_BATCHNORM_DEFAULTS.epsilon,
} = {}) {
  if (!runningState || typeof runningState !== 'object') {
    throw new TypeError('runningState is required');
  }
  return batchNorm(value, {
    mean: runningState.mean,
    variance: runningState.variance,
    gamma,
    beta,
    epsilon,
  });
}

export function updateRunningState(runningState, currentBatchStats, updateWeight) {
  if (!runningState || !currentBatchStats) {
    throw new TypeError('running and batch statistics are required');
  }
  assertFinite(runningState.mean, 'running mean');
  assertVariance(runningState.variance, 'running variance');
  assertFinite(currentBatchStats.mean, 'batch mean');
  assertVariance(currentBatchStats.variance, 'batch variance');
  assertUpdateWeight(updateWeight);

  return {
    mean: ((1 - updateWeight) * runningState.mean) + (updateWeight * currentBatchStats.mean),
    variance: ((1 - updateWeight) * runningState.variance) + (updateWeight * currentBatchStats.variance),
  };
}

export function compareBatchContexts(baselineValues, currentValues, runningState, options = {}) {
  assertVector(baselineValues, 'baselineValues');
  assertVector(currentValues, 'currentValues');
  const baselineValue = baselineValues[0];
  const currentValue = currentValues[0];
  if (baselineValue !== currentValue) {
    throw new RangeError('comparison batches must keep the selected first observation unchanged');
  }

  const baselineTraining = trainingBatchNorm(baselineValues, { ...options, selectedIndex: 0 });
  const currentTraining = trainingBatchNorm(currentValues, { ...options, selectedIndex: 0 });
  const baselineInference = inferenceBatchNorm(baselineValue, runningState, options);
  const currentInference = inferenceBatchNorm(currentValue, runningState, options);

  return {
    baselineTraining,
    currentTraining,
    baselineInference,
    currentInference,
    trainingDelta: Math.abs(currentTraining.selected.output - baselineTraining.selected.output),
    inferenceDelta: Math.abs(currentInference.output - baselineInference.output),
  };
}

export function invertedDropout(value, dropoutRate, kept) {
  assertFinite(value, 'value');
  assertDropoutRate(dropoutRate);
  if (typeof kept !== 'boolean') throw new TypeError('kept must be boolean');
  if (!kept) return 0;
  return value / (1 - dropoutRate);
}

export function theoreticalDropoutMoments(value, dropoutRate) {
  assertFinite(value, 'value');
  assertDropoutRate(dropoutRate);
  const keepProbability = 1 - dropoutRate;
  const variance = (value ** 2) * dropoutRate / keepProbability;
  return {
    mean: value,
    variance,
    std: Math.sqrt(variance),
  };
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
  if (typeof trainingMode !== 'boolean') throw new TypeError('trainingMode must be boolean');
  if (!Number.isInteger(passes) || passes < 1) throw new RangeError('passes must be a positive integer');
  if (!Number.isInteger(seed)) throw new TypeError('seed must be an integer');

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
    variance,
    std: Math.sqrt(variance),
    keptCount: passes.filter((pass) => pass.kept).length,
    droppedCount: passes.filter((pass) => !pass.kept).length,
  };
}
