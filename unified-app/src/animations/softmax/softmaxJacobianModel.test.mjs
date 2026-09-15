import assert from 'node:assert/strict';
import test from 'node:test';
import { SOFTMAX_JACOBIAN_DEFAULTS } from './softmaxJacobianConstants.js';
import { perturbSoftmaxLogit, softmaxJacobian } from './softmaxJacobianModel.js';

function close(actual, expected, tolerance = 1e-8) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('softmax Jacobian has positive diagonal and negative off-diagonal coupling', () => {
  const { matrix } = softmaxJacobian(SOFTMAX_JACOBIAN_DEFAULTS.logits);
  matrix.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
    if (rowIndex === columnIndex) assert.ok(value > 0);
    else assert.ok(value < 0);
  }));
});

test('each selected-logit derivative column sums to zero because probabilities stay normalized', () => {
  const { matrix } = softmaxJacobian(SOFTMAX_JACOBIAN_DEFAULTS.logits);
  matrix[0].forEach((_, column) => {
    const sum = matrix.reduce((total, row) => total + row[column], 0);
    close(sum, 0);
  });
});

test('analytic selected-logit derivatives match centered finite differences', () => {
  const logits = [...SOFTMAX_JACOBIAN_DEFAULTS.logits];
  const selectedLogit = 1;
  const epsilon = 1e-5;
  const analytic = softmaxJacobian(logits).matrix.map((row) => row[selectedLogit]);
  const plus = perturbSoftmaxLogit({ logits, selectedLogit, perturbation: epsilon }).after;
  const minus = perturbSoftmaxLogit({ logits, selectedLogit, perturbation: -epsilon }).after;
  analytic.forEach((value, index) => close(value, (plus[index] - minus[index]) / (2 * epsilon), 1e-7));
});

test('raising one logit increases its probability and decreases the others', () => {
  const result = perturbSoftmaxLogit({ ...SOFTMAX_JACOBIAN_DEFAULTS, perturbation: 0.2 });
  assert.ok(result.after[0] > result.before[0]);
  assert.ok(result.after[1] < result.before[1]);
  assert.ok(result.after[2] < result.before[2]);
  close(result.derivativeSum, 0);
});
