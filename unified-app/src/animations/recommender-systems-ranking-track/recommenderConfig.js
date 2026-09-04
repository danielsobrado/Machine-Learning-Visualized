export const DEFAULT_SCENARIO = {
  historyStrength: 75,
  exploration: 8,
  topK: 5,
  modelId: 'hybrid',
};

export const CONTROL_LIMITS = {
  historyStrength: { min: 0, max: 100, step: 5 },
  exploration: { min: 0, max: 40, step: 2 },
  topK: { min: 3, max: 7, step: 1 },
};

export const MODEL_DEFINITIONS = [
  { id: 'popularity', label: 'Popularity', detail: 'Ranks what is already popular. Strong fallback, weak personalization.' },
  { id: 'collaborative', label: 'Collaborative', detail: 'Uses interaction history. Powerful for returning users, brittle in cold start.' },
  { id: 'hybrid', label: 'Hybrid', detail: 'Combines interaction history with content affinity and a small popularity prior.' },
];

export const SCENARIO_PRESETS = [
  { id: 'returning', label: 'Returning user', values: { historyStrength: 90, exploration: 6, topK: 5, modelId: 'hybrid' } },
  { id: 'cold-start', label: 'Cold start', values: { historyStrength: 5, exploration: 10, topK: 5, modelId: 'hybrid' } },
  { id: 'feedback-loop', label: 'Feedback trap', values: { historyStrength: 70, exploration: 0, topK: 5, modelId: 'popularity' } },
];

export const ITEM_CATALOG = [
  { id: 'nebula', name: 'Nebula Run', category: 'Sci-Fi', popularity: 0.94, quality: 0.82, collaborative: 0.76, embedding: [0.96, 0.12, 0.25] },
  { id: 'orbit', name: 'Silent Orbit', category: 'Sci-Fi', popularity: 0.55, quality: 0.91, collaborative: 0.88, embedding: [0.91, 0.18, 0.34] },
  { id: 'garden', name: 'Hidden Garden', category: 'Nature', popularity: 0.88, quality: 0.72, collaborative: 0.35, embedding: [0.14, 0.94, 0.28] },
  { id: 'tides', name: 'Tidal Notes', category: 'Nature', popularity: 0.42, quality: 0.88, collaborative: 0.48, embedding: [0.18, 0.86, 0.44] },
  { id: 'forge', name: 'Signal Forge', category: 'Technology', popularity: 0.79, quality: 0.86, collaborative: 0.91, embedding: [0.72, 0.18, 0.93] },
  { id: 'compiler', name: 'Compiler Dreams', category: 'Technology', popularity: 0.31, quality: 0.93, collaborative: 0.84, embedding: [0.63, 0.15, 0.98] },
  { id: 'market', name: 'Market Pulse', category: 'Business', popularity: 0.83, quality: 0.68, collaborative: 0.52, embedding: [0.34, 0.20, 0.66] },
  { id: 'founders', name: 'Founders at Dawn', category: 'Business', popularity: 0.27, quality: 0.89, collaborative: 0.67, embedding: [0.48, 0.22, 0.71] },
  { id: 'atlas', name: 'Atlas of Cities', category: 'Travel', popularity: 0.71, quality: 0.80, collaborative: 0.45, embedding: [0.36, 0.63, 0.44] },
  { id: 'islands', name: 'Remote Islands', category: 'Travel', popularity: 0.24, quality: 0.94, collaborative: 0.61, embedding: [0.43, 0.72, 0.52] },
  { id: 'kitchen', name: 'Night Kitchen', category: 'Food', popularity: 0.66, quality: 0.74, collaborative: 0.41, embedding: [0.20, 0.51, 0.32] },
  { id: 'ferment', name: 'Ferment Lab', category: 'Food', popularity: 0.19, quality: 0.90, collaborative: 0.58, embedding: [0.27, 0.46, 0.49] },
];

export const USER_VECTOR = [0.78, 0.24, 0.92];
export const FEEDBACK_ROUNDS = 10;
