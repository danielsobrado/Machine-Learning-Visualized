function validateVector(vector, name) {
  if (!Array.isArray(vector) || vector.length === 0 || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector`);
  }
}

function assertSameLength(a, b) {
  if (a.length !== b.length) throw new RangeError('vectors must have equal length');
}

export function dotProduct(a, b) {
  validateVector(a, 'a');
  validateVector(b, 'b');
  assertSameLength(a, b);
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

export function vectorNorm(vector) {
  validateVector(vector, 'vector');
  return Math.sqrt(vector.reduce((sum, value) => sum + value ** 2, 0));
}

export function cosineSimilarity(a, b) {
  validateVector(a, 'a');
  validateVector(b, 'b');
  assertSameLength(a, b);
  const normA = vectorNorm(a);
  const normB = vectorNorm(b);
  if (normA === 0 || normB === 0) return null;
  const value = dotProduct(a, b) / (normA * normB);
  return Math.max(-1, Math.min(1, value));
}

export function angleDegrees(a, b) {
  const cosine = cosineSimilarity(a, b);
  if (cosine === null) return null;
  return Math.acos(cosine) * 180 / Math.PI;
}

export function scaleVector(vector, scale) {
  validateVector(vector, 'vector');
  if (!Number.isFinite(scale)) throw new TypeError('scale must be finite');
  return vector.map((value) => value * scale);
}

export function normalizeVector(vector) {
  const norm = vectorNorm(vector);
  if (norm === 0) return null;
  return vector.map((value) => value / norm);
}

export function euclideanDistance(a, b) {
  validateVector(a, 'a');
  validateVector(b, 'b');
  assertSameLength(a, b);
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

export function rankItems(query, items, metric = 'cosine') {
  validateVector(query, 'query');
  if (!Array.isArray(items) || items.length === 0) throw new TypeError('items must be non-empty');
  const rows = items.map((item) => {
    const cosine = cosineSimilarity(query, item.vector);
    const dot = dotProduct(query, item.vector);
    const euclidean = euclideanDistance(query, item.vector);
    return { ...item, cosine, dot, euclidean };
  });

  if (metric === 'cosine') return rows.sort((a, b) => (b.cosine ?? -Infinity) - (a.cosine ?? -Infinity));
  if (metric === 'dot') return rows.sort((a, b) => b.dot - a.dot);
  if (metric === 'euclidean') return rows.sort((a, b) => a.euclidean - b.euclidean);
  throw new RangeError(`unsupported metric: ${metric}`);
}

export function buildCosineLab({ a, b, scaleA, scaleB, query, items }) {
  const scaledA = scaleVector(a, scaleA);
  const scaledB = scaleVector(b, scaleB);
  const cosine = cosineSimilarity(scaledA, scaledB);
  const normalizedA = normalizeVector(scaledA);
  const normalizedB = normalizeVector(scaledB);
  const normalizedDot = normalizedA && normalizedB ? dotProduct(normalizedA, normalizedB) : null;

  return {
    a: scaledA,
    b: scaledB,
    dot: dotProduct(scaledA, scaledB),
    normA: vectorNorm(scaledA),
    normB: vectorNorm(scaledB),
    cosine,
    angle: angleDegrees(scaledA, scaledB),
    normalizedA,
    normalizedB,
    normalizedDot,
    cosineRanking: rankItems(query, items, 'cosine'),
    dotRanking: rankItems(query, items, 'dot'),
    euclideanRanking: rankItems(query, items, 'euclidean'),
  };
}
