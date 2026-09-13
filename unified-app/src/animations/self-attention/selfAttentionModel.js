export const SELF_ATTENTION_TOKENS = Object.freeze([
  Object.freeze({ token: 'The', embedding: Object.freeze([0.2, 0.1, 0.1, 0.0]) }),
  Object.freeze({ token: 'animal', embedding: Object.freeze([1.0, 0.2, 0.1, 0.4]) }),
  Object.freeze({ token: 'crossed', embedding: Object.freeze([0.1, 1.0, 0.2, 0.1]) }),
  Object.freeze({ token: 'street', embedding: Object.freeze([0.0, 0.9, 0.6, 0.2]) }),
  Object.freeze({ token: 'tired', embedding: Object.freeze([0.8, 0.1, 0.3, 0.7]) }),
]);

export const SELF_ATTENTION_PROJECTIONS = Object.freeze({
  query: Object.freeze([
    Object.freeze([0.75, 0.10, 0.15]),
    Object.freeze([0.05, 0.80, 0.10]),
    Object.freeze([0.15, 0.10, 0.70]),
    Object.freeze([0.35, 0.05, 0.30]),
  ]),
  key: Object.freeze([
    Object.freeze([0.80, 0.05, 0.10]),
    Object.freeze([0.10, 0.75, 0.15]),
    Object.freeze([0.10, 0.20, 0.65]),
    Object.freeze([0.25, 0.10, 0.35]),
  ]),
  value: Object.freeze([
    Object.freeze([0.80, 0.10]),
    Object.freeze([0.10, 0.75]),
    Object.freeze([0.35, 0.45]),
    Object.freeze([0.55, 0.25]),
  ]),
});

function requireFiniteVector(vector, name) {
  if (!Array.isArray(vector) || vector.length === 0 || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector`);
  }
}

function requireMatrix(matrix, inputSize, name) {
  if (!Array.isArray(matrix) || matrix.length !== inputSize) {
    throw new RangeError(`${name} must have one row per input feature`);
  }
  const width = matrix[0]?.length;
  if (!width || matrix.some((row) => !Array.isArray(row) || row.length !== width || row.some((value) => !Number.isFinite(value)))) {
    throw new RangeError(`${name} must be a rectangular finite matrix`);
  }
}

export function projectVector(vector, matrix) {
  requireFiniteVector(vector, 'vector');
  requireMatrix(matrix, vector.length, 'matrix');
  return Array.from({ length: matrix[0].length }, (_, column) => (
    vector.reduce((sum, value, row) => sum + value * matrix[row][column], 0)
  ));
}

export function dotProduct(left, right) {
  requireFiniteVector(left, 'left');
  requireFiniteVector(right, 'right');
  if (left.length !== right.length) throw new RangeError('dot product dimensions must match');
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

export function softmax(logits, temperature = 1) {
  requireFiniteVector(logits, 'logits');
  if (!Number.isFinite(temperature) || temperature <= 0) throw new RangeError('temperature must be positive');
  const scaled = logits.map((value) => value / temperature);
  const max = Math.max(...scaled);
  const exponentials = scaled.map((value) => Math.exp(value - max));
  const denominator = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / denominator);
}

export function weightedSum(weights, vectors) {
  requireFiniteVector(weights, 'weights');
  if (!Array.isArray(vectors) || vectors.length !== weights.length || vectors.length === 0) {
    throw new RangeError('weights and vectors must have matching non-zero lengths');
  }
  vectors.forEach((vector, index) => requireFiniteVector(vector, `vectors[${index}]`));
  const width = vectors[0].length;
  if (vectors.some((vector) => vector.length !== width)) throw new RangeError('value vectors must share a dimension');
  return Array.from({ length: width }, (_, column) => (
    vectors.reduce((sum, vector, index) => sum + weights[index] * vector[column], 0)
  ));
}

export function buildTokenProjections(tokens = SELF_ATTENTION_TOKENS, projections = SELF_ATTENTION_PROJECTIONS) {
  return tokens.map(({ token, embedding }) => ({
    token,
    embedding: [...embedding],
    q: projectVector(embedding, projections.query),
    k: projectVector(embedding, projections.key),
    v: projectVector(embedding, projections.value),
  }));
}

function maskedSoftmax(scores, blocked, temperature) {
  const visibleScores = scores.filter((_, index) => !blocked[index]);
  const visibleWeights = softmax(visibleScores, temperature);
  let cursor = 0;
  return scores.map((_, index) => {
    if (blocked[index]) return 0;
    const value = visibleWeights[cursor];
    cursor += 1;
    return value;
  });
}

export function attentionRow({
  projections,
  queryIndex,
  causal = false,
  temperature = 1,
  queryFeatureOffset = 0,
}) {
  if (!Array.isArray(projections) || projections.length === 0) throw new TypeError('projections are required');
  if (!Number.isInteger(queryIndex) || queryIndex < 0 || queryIndex >= projections.length) {
    throw new RangeError('queryIndex is outside the token range');
  }
  const baseQuery = projections[queryIndex].q;
  const query = baseQuery.map((value, index) => (index === 0 ? value + queryFeatureOffset : value));
  const scale = Math.sqrt(query.length);
  const blocked = projections.map((_, index) => causal && index > queryIndex);
  const dotProducts = projections.map(({ k }) => dotProduct(query, k));
  const scaledScores = dotProducts.map((value) => value / scale);
  const weights = maskedSoftmax(scaledScores, blocked, temperature);
  const output = weightedSum(weights, projections.map(({ v }) => v));
  const winnerIndex = weights.reduce((best, value, index) => (value > weights[best] ? index : best), 0);
  return {
    query,
    scale,
    blocked,
    dotProducts,
    scaledScores,
    weights,
    output,
    winnerIndex,
  };
}

export function attentionMatrix({
  projections,
  causal = false,
  temperature = 1,
  selectedQueryIndex = null,
  queryFeatureOffset = 0,
}) {
  return projections.map((_, queryIndex) => attentionRow({
    projections,
    queryIndex,
    causal,
    temperature,
    queryFeatureOffset: queryIndex === selectedQueryIndex ? queryFeatureOffset : 0,
  }));
}

export function entropy(probabilities) {
  requireFiniteVector(probabilities, 'probabilities');
  return -probabilities.reduce((sum, probability) => (
    sum + (probability > 0 ? probability * Math.log(probability) : 0)
  ), 0);
}
