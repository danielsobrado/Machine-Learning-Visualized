export const VECTOR_GROUPS = Object.freeze([
  Object.freeze({ id: 'billing', label: 'Billing', center: Object.freeze([0.24, 0.28]) }),
  Object.freeze({ id: 'access', label: 'Access', center: Object.freeze([0.76, 0.27]) }),
  Object.freeze({ id: 'policy', label: 'Policy', center: Object.freeze([0.72, 0.74]) }),
  Object.freeze({ id: 'product', label: 'Product', center: Object.freeze([0.30, 0.73]) }),
]);

export const RAG_VECTOR_DEFAULTS = Object.freeze({
  count: 80,
  breadth: 0.45,
  topK: 5,
  method: 'hnsw',
  filterGroup: 'all',
  embeddingMode: 'aligned-v1',
  seed: 23,
  query: Object.freeze([0.27, 0.31]),
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function rotate(vector, radians) {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [
    vector[0] * cosine - vector[1] * sine,
    vector[0] * sine + vector[1] * cosine,
  ];
}

export function generateVectorCorpus(count = RAG_VECTOR_DEFAULTS.count, seed = RAG_VECTOR_DEFAULTS.seed) {
  if (!Number.isInteger(count) || count < 20 || count > 400) throw new RangeError('count must be an integer between 20 and 400');
  const random = seededRandom(seed);
  return Array.from({ length: count }, (_, index) => {
    const group = VECTOR_GROUPS[index % VECTOR_GROUPS.length];
    const radius = 0.16 * Math.sqrt(random());
    const angle = random() * Math.PI * 2;
    return {
      id: `doc-${index + 1}`,
      label: `${group.label} ${Math.floor(index / VECTOR_GROUPS.length) + 1}`,
      group: group.id,
      semantic: [
        clamp(group.center[0] + Math.cos(angle) * radius, 0.03, 0.97),
        clamp(group.center[1] + Math.sin(angle) * radius, 0.03, 0.97),
      ],
    };
  });
}

export function materializeEmbeddingSpace(corpus, query, embeddingMode) {
  const angle = Math.PI / 5;
  const transformIndex = embeddingMode === 'reindexed-v2';
  const transformQuery = embeddingMode !== 'aligned-v1';
  return {
    points: corpus.map((point) => ({
      ...point,
      vector: transformIndex ? rotate(point.semantic, angle) : [...point.semantic],
    })),
    queryVector: transformQuery ? rotate(query, angle) : [...query],
  };
}
