import {
  FEATURE_LABELS,
  INITIAL_STREAM,
  LAYER_NORM_EPSILON,
  NORMALIZATION_DEMO_INPUT,
  NORMALIZATION_DEMO_MATRIX,
  RESIDUAL_WRITES,
} from './residualStreamConstants.js';

export function addVectors(left, right) {
  validateSameLength(left, right);
  return left.map((value, index) => value + right[index]);
}

export function scaleVector(vector, amount) {
  validateVector(vector, 'vector');
  if (!Number.isFinite(amount)) throw new TypeError('amount must be finite');
  return vector.map((value) => value * amount);
}

export function vectorNorm(vector) {
  validateVector(vector, 'vector');
  return Math.sqrt(vector.reduce((sum, value) => sum + value ** 2, 0));
}

export function meanVariance(vector) {
  validateVector(vector, 'vector');
  const mean = vector.reduce((sum, value) => sum + value, 0) / vector.length;
  const variance = vector.reduce((sum, value) => sum + (value - mean) ** 2, 0) / vector.length;
  return { mean, variance };
}

export function layerNorm(vector, epsilon = LAYER_NORM_EPSILON) {
  validateVector(vector, 'vector');
  if (!Number.isFinite(epsilon) || epsilon <= 0) throw new RangeError('epsilon must be positive and finite');
  const { mean, variance } = meanVariance(vector);
  const denominator = Math.sqrt(variance + epsilon);
  return vector.map((value) => (value - mean) / denominator);
}

export function applyMatrix(vector, matrix = NORMALIZATION_DEMO_MATRIX) {
  validateVector(vector, 'vector');
  if (!Array.isArray(matrix) || matrix.length === 0) throw new TypeError('matrix must be non-empty');
  matrix.forEach((row, index) => {
    validateVector(row, `matrix[${index}]`);
    if (row.length !== vector.length) throw new RangeError('matrix rows must match vector width');
  });
  return matrix.map((row) => row.reduce((sum, weight, index) => sum + weight * vector[index], 0));
}

export function buildResidualLedger(strengths) {
  if (!strengths || typeof strengths !== 'object') throw new TypeError('strengths are required');
  const initialScale = requireStrength(strengths, INITIAL_STREAM.id);
  let stream = scaleVector(INITIAL_STREAM.base, initialScale);
  const initial = {
    ...INITIAL_STREAM,
    value: [...stream],
    magnitude: vectorNorm(stream),
  };

  const writes = RESIDUAL_WRITES.map((component) => {
    const amount = requireStrength(strengths, component.id);
    const write = scaleVector(component.base, amount);
    const before = [...stream];
    const after = addVectors(before, write);
    stream = after;
    return {
      ...component,
      amount,
      before,
      write,
      after,
      magnitude: vectorNorm(write),
    };
  });

  const totalWriteMagnitude = writes.reduce((sum, step) => sum + step.magnitude, 0);
  const dominantFeatureIndex = stream.reduce(
    (best, value, index, values) => (Math.abs(value) > Math.abs(values[best]) ? index : best),
    0,
  );

  return {
    initial,
    writes,
    finalStream: [...stream],
    finalMagnitude: vectorNorm(stream),
    totalWriteMagnitude,
    dominantFeature: FEATURE_LABELS[dominantFeatureIndex],
  };
}

export function normalizationPlacement(mode, input = NORMALIZATION_DEMO_INPUT) {
  validateVector(input, 'input');
  if (!['pre', 'post'].includes(mode)) throw new RangeError(`Unsupported normalization mode: ${mode}`);

  if (mode === 'pre') {
    const normalizedInput = layerNorm(input);
    const write = applyMatrix(normalizedInput);
    const output = addVectors(input, write);
    return {
      mode,
      input: [...input],
      normalizedInput,
      sublayerInput: normalizedInput,
      write,
      summed: [...output],
      output,
      equation: 'y = x + F(LN(x))',
      outputStats: meanVariance(output),
    };
  }

  const write = applyMatrix(input);
  const summed = addVectors(input, write);
  const output = layerNorm(summed);
  return {
    mode,
    input: [...input],
    normalizedInput: null,
    sublayerInput: [...input],
    write,
    summed,
    output,
    equation: 'y = LN(x + F(x))',
    outputStats: meanVariance(output),
  };
}

function requireStrength(strengths, id) {
  const value = strengths[id];
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${id} strength must be non-negative and finite`);
  return value;
}

function validateSameLength(left, right) {
  validateVector(left, 'left');
  validateVector(right, 'right');
  if (left.length !== right.length) throw new RangeError('vectors must have matching lengths');
}

function validateVector(vector, name) {
  if (!Array.isArray(vector) || vector.length === 0 || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector`);
  }
}
