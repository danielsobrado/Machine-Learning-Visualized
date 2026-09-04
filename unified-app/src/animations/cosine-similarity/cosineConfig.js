export const VECTOR_PRESETS = [
  { id: 'similar', label: 'Similar direction', a: [3, 2], b: [6, 5] },
  { id: 'orthogonal', label: 'Orthogonal', a: [3, 0], b: [0, 4] },
  { id: 'opposite', label: 'Opposite', a: [3, 2], b: [-6, -4] },
  { id: 'zero', label: 'Zero-vector trap', a: [0, 0], b: [4, 1] },
];

export const SEARCH_QUERY = [1, 0];

export const SEARCH_ITEMS = [
  { id: 'near', label: 'Nearby, slight angle', vector: [1, 0.2] },
  { id: 'far-same', label: 'Far away, exact direction', vector: [10, 0] },
  { id: 'diagonal', label: 'Diagonal', vector: [1.4, 1.4] },
  { id: 'opposite', label: 'Opposite direction', vector: [-2, 0] },
];

export const COSINE_DEFAULTS = {
  presetId: 'similar',
  scaleA: 1,
  scaleB: 1,
};
