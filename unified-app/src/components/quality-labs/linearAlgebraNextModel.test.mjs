import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildDecompositionComparison,
  buildFundamentalSubspaces,
  buildQrStabilityLab,
  buildRectangularMap,
  buildSvdApproximation,
  matrixProductShape,
} from './linearAlgebraNextModel.js';
import {
  DECOMPOSITION_NEXT_DEFAULTS,
  MULTIPLICATION_NEXT_DEFAULTS,
  QR_NEXT_DEFAULTS,
  SUBSPACES_NEXT_DEFAULTS,
  SVD_NEXT_DEFAULTS,
} from './linearAlgebraNextConstants.js';

const close = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

const matrixVector = (matrix, vector) => matrix.map((row) =>
  row.reduce((sum, value, index) => sum + value * vector[index], 0));

test('LU, QR, SVD, and Cholesky reconstruct the same SPD matrix', () => {
  const lab = buildDecompositionComparison(DECOMPOSITION_NEXT_DEFAULTS);
  assert.ok(lab.determinant > 0);
  for (const error of Object.values(lab.errors)) assert.ok(error < 1e-9);
  assert.ok(lab.factors.SVD.singularValues[0] >= lab.factors.SVD.singularValues[1]);
});

test('Householder preserves orthogonality better than classical Gram-Schmidt near collinearity', () => {
  const lab = buildQrStabilityLab(QR_NEXT_DEFAULTS);
  assert.ok(lab.classical.orthogonalityError > lab.householder.orthogonalityError);
  assert.ok(lab.householder.orthogonalityError < 1e-10);
  assert.ok(lab.householder.reconstructionError < 1e-10);
});

test('rank-1 SVD reconstruction error equals the discarded singular value', () => {
  const lab = buildSvdApproximation(SVD_NEXT_DEFAULTS);
  close(lab.rank1Error, SVD_NEXT_DEFAULTS.sigma2, 1e-9);
  close(lab.rank1Error, lab.expectedRank1Error, 1e-9);
  assert.ok(lab.energyRetained > 0 && lab.energyRetained < 1);
});

test('row reduction derives all four fundamental subspaces consistently', () => {
  const lab = buildFundamentalSubspaces(SUBSPACES_NEXT_DEFAULTS.matrix);
  assert.equal(lab.rank, 2);
  assert.deepEqual(lab.pivotColumns, [0, 1]);
  assert.deepEqual(lab.dimensions, {
    columnSpace: 2,
    rowSpace: 2,
    nullSpace: 1,
    leftNullSpace: 1,
  });
  assert.deepEqual(lab.nullBasis[0].map(Math.round), [1, -2, 1]);
  assert.deepEqual(lab.leftNullBasis[0].map(Math.round), [-2, 1, 0]);
  for (const basisVector of lab.nullBasis) {
    for (const value of matrixVector(SUBSPACES_NEXT_DEFAULTS.matrix, basisVector)) close(value, 0);
  }
});

test('rectangular multiplication agrees between row-dot and column-combination views', () => {
  const lab = buildRectangularMap(MULTIPLICATION_NEXT_DEFAULTS);
  assert.equal(lab.inputDimension, 3);
  assert.equal(lab.outputDimension, 2);
  lab.output.forEach((value, index) => close(value, lab.contributionSum[index]));
  assert.deepEqual(matrixProductShape(2, 3, 3, 4), {
    compatible: true,
    outputRows: 2,
    outputColumns: 4,
    contractedDimension: 3,
  });
  assert.equal(matrixProductShape(2, 3, 2, 4).compatible, false);
});
