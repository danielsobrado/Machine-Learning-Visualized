function requireVector(vector, name) {
  if (!Array.isArray(vector) || vector.length === 0 || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector`);
  }
}

function requireSameShape(first, second) {
  requireVector(first, 'first');
  requireVector(second, 'second');
  if (first.length !== second.length) throw new RangeError('vectors must have the same dimension');
}

export function dotProduct(first, second) {
  requireSameShape(first, second);
  return first.reduce((sum, value, index) => sum + value * second[index], 0);
}

export function l2Norm(vector) {
  requireVector(vector, 'vector');
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

export function cosineSimilarity(first, second) {
  requireSameShape(first, second);
  const denominator = l2Norm(first) * l2Norm(second);
  if (denominator === 0) throw new RangeError('cosine similarity is undefined for a zero vector');
  return dotProduct(first, second) / denominator;
}

export function euclideanDistance(first, second) {
  requireSameShape(first, second);
  return Math.sqrt(first.reduce((sum, value, index) => sum + (value - second[index]) ** 2, 0));
}

export function scaleVector(vector, scale) {
  requireVector(vector, 'vector');
  if (!Number.isFinite(scale)) throw new TypeError('scale must be finite');
  return vector.map((value) => value * scale);
}

export function metricTrapExperiment(scale = 100) {
  if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('scale must be positive');
  const query = [1, 0];
  const collinear = scaleVector(query, scale);
  const nearby = [0.8, 0.2];

  return {
    query,
    collinear,
    nearby,
    collinearCosine: cosineSimilarity(query, collinear),
    nearbyCosine: cosineSimilarity(query, nearby),
    collinearDistance: euclideanDistance(query, collinear),
    nearbyDistance: euclideanDistance(query, nearby),
    collinearDot: dotProduct(query, collinear),
    nearbyDot: dotProduct(query, nearby),
  };
}

export function scalingInvarianceExperiment(vector = [0.6, 0.8], scale = 20) {
  if (!Number.isFinite(scale) || scale <= 0) throw new RangeError('scale must be positive');
  const scaled = scaleVector(vector, scale);
  return {
    vector: [...vector],
    scaled,
    cosine: cosineSimilarity(vector, scaled),
    distance: euclideanDistance(vector, scaled),
    originalNorm: l2Norm(vector),
    scaledNorm: l2Norm(scaled),
    dot: dotProduct(vector, scaled),
  };
}
