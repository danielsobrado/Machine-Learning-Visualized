export const K_DIAGNOSTIC_VALUES = Object.freeze([2, 3, 4, 5, 6]);
export const DIAGNOSTIC_ITERATIONS = 12;

export const INITIALIZATION_CASES = Object.freeze({
  spread: {
    label: 'Spread-out start',
    short: 'Seeds begin near different visible regions.',
    centroids: Object.freeze([
      [0.8, 1.0],
      [4.1, 1.0],
      [2.5, 4.4],
    ]),
  },
  crowded: {
    label: 'Crowded start',
    short: 'All seeds begin in the same upper region.',
    centroids: Object.freeze([
      [2.5, 4.4],
      [2.9, 4.9],
      [3.3, 4.3],
    ]),
  },
});
