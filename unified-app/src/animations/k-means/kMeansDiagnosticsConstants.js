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

export const EMPTY_CLUSTER_CASE = Object.freeze({
  label: 'Duplicate-seed empty cluster',
  centroids: Object.freeze([
    [0.8, 1.0],
    [0.8, 1.0],
    [5.7, 5.1],
  ]),
});

export const OUTLIER_SENSITIVITY_CASE = Object.freeze({
  label: 'Mean-centroid outlier sensitivity',
  point: Object.freeze([6.8, 1.2]),
});

export const NON_CONVEX_CASE = Object.freeze({
  label: 'Concentric rings',
  center: Object.freeze([3.5, 3.5]),
  innerRadius: 1,
  outerRadius: 3,
  pointsPerRing: 12,
  initialCentroids: Object.freeze([
    [0.5, 3.5],
    [6.5, 3.5],
  ]),
});
