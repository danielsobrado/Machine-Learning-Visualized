import assert from 'node:assert/strict';
import test from 'node:test';

import { argmaxFlipExperiment, informationCollision, maxPoolWindow, poolMatrix } from './maxPoolingModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('max pooling forwards the maximum and routes backward gradient only to the argmax', () => {
  const result = maxPoolWindow([2, 9, 4, 1], 3);
  assert.equal(result.maxValue, 9);
  assert.equal(result.winnerIndex, 1);
  assert.deepEqual(result.inputGradients, [0, 3, 0, 0]);
});

test('a tiny perturbation can barely change the output while completely flipping gradient routing', () => {
  const result = argmaxFlipExperiment({ first: 5, second: 4.99, perturbation: 0.02, upstreamGradient: 1 });
  assert.equal(result.routeFlipped, true);
  close(result.outputChange, 0.01);
  close(result.gradientL1Change, 2);
  assert.deepEqual(result.before.inputGradients, [1, 0, 0, 0]);
  assert.deepEqual(result.after.inputGradients, [0, 1, 0, 0]);
});

test('ties are explicit and the teaching model uses first-maximum routing', () => {
  const result = maxPoolWindow([5, 5, 1, 0], 1);
  assert.equal(result.tieCount, 2);
  assert.deepEqual(result.tieIndices, [0, 1]);
  assert.equal(result.winnerIndex, 0);
  assert.deepEqual(result.inputGradients, [1, 0, 0, 0]);
});

test('different windows can collapse to the same pooled output while discarding very different evidence', () => {
  const result = informationCollision([9, 0, 0, 0], [9, 8, 7, 6]);
  assert.equal(result.samePooledOutput, true);
  close(result.first.maxValue, 9);
  close(result.second.maxValue, 9);
  assert.ok(result.meanDifference > 5);
});

test('matrix pooling reports winner coordinates and tie count', () => {
  const result = poolMatrix([[1, 5], [5, 2]], 2, 1);
  assert.equal(result.length, 1);
  assert.equal(result[0][0].value, 5);
  assert.equal(result[0][0].winner.row, 0);
  assert.equal(result[0][0].winner.col, 1);
  assert.equal(result[0][0].tieCount, 2);
});

test('invalid inputs fail explicitly', () => {
  assert.throws(() => maxPoolWindow([], 1), TypeError);
  assert.throws(() => maxPoolWindow([1, Number.NaN], 1), TypeError);
  assert.throws(() => poolMatrix([[1, 2, 3], [4, 5, 6]], 2, 1), TypeError);
  assert.throws(() => poolMatrix([[1, 2], [3, 4]], 3, 1), RangeError);
});
