export const DEFAULT_K = 5;
export const DEFAULT_STRATEGY = 'stratified';
export const DEFAULT_REPEATS = 5;
export const DEFAULT_CANDIDATE_COUNT = 8;
export const BASE_GENERALIZATION_SCORE = 0.78;

export const SPLIT_STRATEGIES = Object.freeze({
  random: {
    label: 'Random K-fold',
    short: 'Exchangeable independent rows',
    detail: 'Useful only when rows are independent and identically distributed. Repeated entities can leak across folds.',
  },
  stratified: {
    label: 'Stratified K-fold',
    short: 'Preserve class balance',
    detail: 'Keeps label proportions steadier, but does not solve entity or time dependence.',
  },
  grouped: {
    label: 'Group K-fold',
    short: 'Unseen entities',
    detail: 'Keeps every user in exactly one validation fold so identity cannot leak into its training complement.',
  },
  time: {
    label: 'Expanding time CV',
    short: 'Predict the future',
    detail: 'Each validation window occurs strictly after its training history. Ordinary shuffled K-fold is invalid for forecasting.',
  },
  groupedTime: {
    label: 'Grouped + time',
    short: 'Future unseen entities',
    detail: 'Moves whole entities forward through time so validation is both chronologically later and entity-disjoint.',
  },
});

export const CROSS_VALIDATION_ROWS = Object.freeze([
  { id: 'A1', user: 'u01', time: 1, target: 0, difficulty: 0.24 },
  { id: 'A2', user: 'u01', time: 2, target: 0, difficulty: 0.27 },
  { id: 'B1', user: 'u02', time: 3, target: 1, difficulty: 0.42 },
  { id: 'B2', user: 'u02', time: 4, target: 1, difficulty: 0.46 },
  { id: 'C1', user: 'u03', time: 5, target: 0, difficulty: 0.31 },
  { id: 'C2', user: 'u03', time: 6, target: 1, difficulty: 0.49 },
  { id: 'D1', user: 'u04', time: 7, target: 1, difficulty: 0.53 },
  { id: 'D2', user: 'u04', time: 8, target: 1, difficulty: 0.57 },
  { id: 'E1', user: 'u05', time: 9, target: 0, difficulty: 0.36 },
  { id: 'E2', user: 'u05', time: 10, target: 0, difficulty: 0.39 },
  { id: 'F1', user: 'u06', time: 11, target: 1, difficulty: 0.61 },
  { id: 'F2', user: 'u06', time: 12, target: 1, difficulty: 0.65 },
  { id: 'G1', user: 'u07', time: 13, target: 0, difficulty: 0.41 },
  { id: 'G2', user: 'u07', time: 14, target: 1, difficulty: 0.59 },
  { id: 'H1', user: 'u08', time: 15, target: 1, difficulty: 0.68 },
  { id: 'H2', user: 'u08', time: 16, target: 1, difficulty: 0.71 },
  { id: 'I1', user: 'u09', time: 17, target: 0, difficulty: 0.45 },
  { id: 'I2', user: 'u09', time: 18, target: 0, difficulty: 0.48 },
  { id: 'J1', user: 'u10', time: 19, target: 1, difficulty: 0.74 },
  { id: 'J2', user: 'u10', time: 20, target: 1, difficulty: 0.77 },
  { id: 'K1', user: 'u11', time: 21, target: 0, difficulty: 0.51 },
  { id: 'K2', user: 'u11', time: 22, target: 1, difficulty: 0.69 },
  { id: 'L1', user: 'u12', time: 23, target: 1, difficulty: 0.81 },
  { id: 'L2', user: 'u12', time: 24, target: 1, difficulty: 0.84 },
]);
