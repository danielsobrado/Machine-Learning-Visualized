import {
  DEFAULT_EPSILON,
  SUBLAYER_BIASES,
  SUBLAYER_WEIGHTS,
} from './layerNormalizationConstants.js';

function requireVector(values, name) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty array of finite numbers`);
  }
}

function requireSameLength(values, reference, name) {
  requireVector(values, name);
  if (values.length !== reference.length) {
    throw new RangeError(`${name} must match the feature dimension`);
  }
}

function requireEpsilon(epsilon) {
  if (!Number.isFinite(epsilon) || epsilon <= 0) {
    throw new RangeError('epsilon must be a finite positive number');
  }
}

export function mean(values) {
  requireVector(values, 'values');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function populationVariance(values, mu = mean(values)) {
  requireVector(values, 'values');
  if (!Number.isFinite(mu)) throw new TypeError('mu must be finite');
  return values.reduce((sum, value) => sum + (value - mu) ** 2, 0) / values.length;
}

export function vectorStats(values) {
  const mu = mean(values);
  return {
    mean: mu,
    variance: populationVariance(values, mu),
  };
}

export function layerNormalize(values, {
  gamma = Array(values.length).fill(1),
  beta = Array(values.length).fill(0),
  epsilon = DEFAULT_EPSILON,
} = {}) {
  requireVector(values, 'values');
  requireSameLength(gamma, values, 'gamma');
  requireSameLength(beta, values, 'beta');
  requireEpsilon(epsilon);

  const inputStats = vectorStats(values);
  const denominator = Math.sqrt(inputStats.variance + epsilon);
  const centered = values.map((value) => value - inputStats.mean);
  const normalized = centered.map((value) => value / denominator);
  const output = normalized.map((value, index) => value * gamma[index] + beta[index]);

  return {
    inputStats,
    denominator,
    centered,
    normalized,
    normalizedStats: vectorStats(normalized),
    output,
    outputStats: vectorStats(output),
  };
}

function requireMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new TypeError('matrix must be a non-empty array of rows');
  }
  requireVector(matrix[0], 'matrix row');
  const width = matrix[0].length;
  matrix.forEach((row) => {
    requireVector(row, 'matrix row');
    if (row.length !== width) throw new RangeError('matrix rows must have equal length');
  });
}

export function layerNormalizeRows(matrix, options = {}) {
  requireMatrix(matrix);
  return matrix.map((row) => layerNormalize(row, options));
}

export function batchNormalizeColumns(matrix, epsilon = DEFAULT_EPSILON) {
  requireMatrix(matrix);
  requireEpsilon(epsilon);

  const width = matrix[0].length;
  const columnStats = Array.from({ length: width }, (_, column) => {
    const values = matrix.map((row) => row[column]);
    const stats = vectorStats(values);
    return {
      ...stats,
      denominator: Math.sqrt(stats.variance + epsilon),
    };
  });

  return {
    columnStats,
    rows: matrix.map((row) => row.map((value, column) => {
      const stats = columnStats[column];
      return (value - stats.mean) / stats.denominator;
    })),
  };
}

export function sublayerTransform(values, strength = 1) {
  requireVector(values, 'values');
  if (values.length !== SUBLAYER_WEIGHTS.length || values.length !== SUBLAYER_BIASES.length) {
    throw new RangeError('values must match the configured sublayer feature dimension');
  }
  if (!Number.isFinite(strength) || strength < 0) {
    throw new RangeError('strength must be a finite non-negative number');
  }

  return values.map((value, index) => (
    Math.tanh(value * SUBLAYER_WEIGHTS[index] + SUBLAYER_BIASES[index]) * strength
  ));
}

export function addVectors(left, right) {
  requireVector(left, 'left');
  requireSameLength(right, left, 'right');
  return left.map((value, index) => value + right[index]);
}

export function transformerNormStep(values, {
  mode,
  gamma,
  beta,
  epsilon = DEFAULT_EPSILON,
  branchStrength = 1,
}) {
  if (mode !== 'pre' && mode !== 'post') {
    throw new RangeError(`Unknown normalization placement: ${mode}`);
  }

  if (mode === 'pre') {
    const normalization = layerNormalize(values, { gamma, beta, epsilon });
    const branchInput = normalization.output;
    const branchOutput = sublayerTransform(branchInput, branchStrength);
    const output = addVectors(values, branchOutput);
    return { normalization, branchInput, branchOutput, residualInput: values, output };
  }

  const branchInput = values;
  const branchOutput = sublayerTransform(branchInput, branchStrength);
  const residualInput = addVectors(values, branchOutput);
  const normalization = layerNormalize(residualInput, { gamma, beta, epsilon });
  return { normalization, branchInput, branchOutput, residualInput, output: normalization.output };
}
