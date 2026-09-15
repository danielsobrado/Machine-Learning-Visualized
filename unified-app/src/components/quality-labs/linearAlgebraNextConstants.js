export const LINEAR_ALGEBRA_NEXT_LESSON_IDS = Object.freeze(new Set([
  'matrix-decompositions',
  'qr-decomposition',
  'svd',
  'fundamental-subspaces',
  'matrix-multiplication',
]));

export const DECOMPOSITION_NEXT_DEFAULTS = Object.freeze({
  diagonalA: 4,
  diagonalD: 3,
  offDiagonal: 2,
});

export const QR_NEXT_DEFAULTS = Object.freeze({
  nearCollinearExponent: 3,
});

export const SVD_NEXT_DEFAULTS = Object.freeze({
  sigma1: 6,
  sigma2: 2,
  leftAngleDegrees: 25,
  rightAngleDegrees: -20,
});

export const SUBSPACES_NEXT_DEFAULTS = Object.freeze({
  matrix: Object.freeze([
    Object.freeze([1, 2, 3]),
    Object.freeze([2, 4, 6]),
    Object.freeze([1, 1, 1]),
  ]),
});

export const MULTIPLICATION_NEXT_DEFAULTS = Object.freeze({
  matrix: Object.freeze([
    Object.freeze([1, 2, -1]),
    Object.freeze([0.5, -1, 3]),
  ]),
  vector: Object.freeze([1, -2, 0.5]),
});
