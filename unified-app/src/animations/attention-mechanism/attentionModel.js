function requireVector(vector, name) {
  if (!Array.isArray(vector) || vector.length === 0 || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector`);
  }
}

function requireMatrix(matrix, name) {
  if (!Array.isArray(matrix) || matrix.length === 0) throw new TypeError(`${name} must be a non-empty matrix`);
  matrix.forEach((row, index) => requireVector(row, `${name}[${index}]`));
  const width = matrix[0].length;
  if (matrix.some((row) => row.length !== width)) throw new RangeError(`${name} rows must have equal length`);
}

export function dotProduct(first, second) {
  requireVector(first, 'first');
  requireVector(second, 'second');
  if (first.length !== second.length) throw new RangeError('vectors must have equal dimension');
  return first.reduce((sum, value, index) => sum + value * second[index], 0);
}

export function softmax(logits) {
  requireVector(logits, 'logits');
  const max = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - max));
  const denominator = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / denominator);
}

export function entropy(probabilities) {
  requireVector(probabilities, 'probabilities');
  const sum = probabilities.reduce((total, value) => total + value, 0);
  if (probabilities.some((value) => value < 0) || Math.abs(sum - 1) > 1e-9) throw new RangeError('probabilities must be non-negative and sum to one');
  return -probabilities.reduce((total, probability) => total + (probability === 0 ? 0 : probability * Math.log(probability)), 0);
}

export function weightedSum(weights, values) {
  requireVector(weights, 'weights');
  requireMatrix(values, 'values');
  if (weights.length !== values.length) throw new RangeError('weights and values must have matching rows');
  const sum = weights.reduce((total, value) => total + value, 0);
  if (Math.abs(sum - 1) > 1e-9 || weights.some((value) => value < 0)) throw new RangeError('weights must be a probability distribution');
  return Array.from({ length: values[0].length }, (_, column) => (
    values.reduce((total, row, index) => total + weights[index] * row[column], 0)
  ));
}

export function scaledDotProductAttention({ query, keys, values, scale = true }) {
  requireVector(query, 'query');
  requireMatrix(keys, 'keys');
  requireMatrix(values, 'values');
  if (keys.length !== values.length) throw new RangeError('keys and values must have matching rows');
  if (keys.some((key) => key.length !== query.length)) throw new RangeError('query and key dimensions must match');
  const divisor = scale ? Math.sqrt(query.length) : 1;
  const scores = keys.map((key) => dotProduct(query, key) / divisor);
  const weights = softmax(scores);
  return { scores, weights, output: weightedSum(weights, values), divisor };
}

export function qkvExperiment() {
  const query = [1, 0];
  const keys = [[1, 0], [0, 1], [-1, 0]];
  const values = [[8, 1], [0, 6], [-4, 2]];
  return { query, keys, values, ...scaledDotProductAttention({ query, keys, values }) };
}

export function scalingExperiment(dimension) {
  if (!Number.isInteger(dimension) || dimension <= 0) throw new RangeError('dimension must be a positive integer');
  const baseScores = [1, 0, -1];
  const rawScores = baseScores.map((value) => value * Math.sqrt(dimension));
  const scaledScores = baseScores;
  const rawWeights = softmax(rawScores);
  const scaledWeights = softmax(scaledScores);
  return {
    dimension,
    rawScores,
    scaledScores,
    rawWeights,
    scaledWeights,
    rawEntropy: entropy(rawWeights),
    scaledEntropy: entropy(scaledWeights),
  };
}

export function multiHeadExperiment() {
  const values = [[1], [5], [9]];
  const headAScores = [2, 0, -1];
  const headBScores = [-1, 0, 2];
  const headAWeights = softmax(headAScores);
  const headBWeights = softmax(headBScores);
  const headAOutput = weightedSum(headAWeights, values)[0];
  const headBOutput = weightedSum(headBWeights, values)[0];
  return {
    values,
    headAScores,
    headBScores,
    headAWeights,
    headBWeights,
    headAOutput,
    headBOutput,
    concatenated: [headAOutput, headBOutput],
    averaged: (headAOutput + headBOutput) / 2,
  };
}

export function selfAttentionExperiment() {
  const tokenNames = ['red', 'fox', 'runs'];
  const embeddings = [[1, 0], [0.8, 0.2], [0, 1]];
  const rows = embeddings.map((query) => scaledDotProductAttention({ query, keys: embeddings, values: embeddings }));
  return { tokenNames, embeddings, rows };
}

export function attentionInterpretationTrap() {
  const caseA = {
    label: 'Diffuse weights, different values',
    weights: [0.5, 0.5],
    values: [[0], [2]],
  };
  const caseB = {
    label: 'Sharp weights, identical values',
    weights: [0.9, 0.1],
    values: [[1], [1]],
  };
  const outputA = weightedSum(caseA.weights, caseA.values)[0];
  const outputB = weightedSum(caseB.weights, caseB.values)[0];
  return { ...{ caseA, caseB }, outputA, outputB, outputsMatch: Math.abs(outputA - outputB) < 1e-12 };
}
