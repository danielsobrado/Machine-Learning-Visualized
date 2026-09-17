export const Q_LEARNING_ACTIONS = Object.freeze([
  Object.freeze({ id: 'up', label: '↑', dr: -1, dc: 0 }),
  Object.freeze({ id: 'right', label: '→', dr: 0, dc: 1 }),
  Object.freeze({ id: 'down', label: '↓', dr: 1, dc: 0 }),
  Object.freeze({ id: 'left', label: '←', dr: 0, dc: -1 }),
]);

export const Q_LEARNING_ENVIRONMENT = Object.freeze({
  rows: 4,
  columns: 6,
  start: Object.freeze([3, 0]),
  goal: Object.freeze([3, 5]),
  cliff: Object.freeze([
    Object.freeze([3, 1]),
    Object.freeze([3, 2]),
    Object.freeze([3, 3]),
    Object.freeze([3, 4]),
  ]),
  rewards: Object.freeze({
    step: -1,
    cliff: -100,
    goal: 0,
  }),
});

export const Q_LEARNING_TRAINING_DEFAULTS = Object.freeze({
  alpha: 0.5,
  gamma: 0.9,
  epsilon: 0.1,
  episodes: 160,
  maxStepsPerEpisode: 120,
  seed: 17,
  replayAlgorithm: 'q-learning',
});

export const Q_LEARNING_TRAINING_LIMITS = Object.freeze({
  alpha: Object.freeze({ min: 0.05, max: 1, step: 0.05 }),
  gamma: Object.freeze({ min: 0, max: 1, step: 0.05 }),
  epsilon: Object.freeze({ min: 0, max: 0.5, step: 0.01 }),
  episodes: Object.freeze({ min: 20, max: 400, step: 20 }),
});
