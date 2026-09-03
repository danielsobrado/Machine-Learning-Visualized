import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildMaskMatrix,
  maskBeforeSoftmax,
  maskOrderExperiment,
  softmax,
  zeroAfterSoftmax,
} from './attentionMaskModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('softmax is normalized and numerically stable', () => {
  const weights = softmax([1000, 999, 998]);
  close(weights.reduce((sum, value) => sum + value, 0), 1);
  assert.ok(weights[0] > weights[1]);
});

test('every non-padding causal query row gets its own normalized distribution', () => {
  const matrix = buildMaskMatrix({ mode: 'causal', maskPadding: true });
  matrix.rows.slice(0, 3).forEach((row) => close(row.probabilitySum, 1));
  assert.notDeepEqual(matrix.rows[0].cells.map((cell) => cell.probability), matrix.rows[2].cells.map((cell) => cell.probability));
});

test('padding query rows carry zero attention mass', () => {
  const matrix = buildMaskMatrix({ mode: 'bidirectional', maskPadding: true });
  matrix.rows.slice(3).forEach((row) => close(row.probabilitySum, 0));
});

test('causal rows cannot attend to future keys', () => {
  const matrix = buildMaskMatrix({ mode: 'causal', maskPadding: false });
  matrix.rows.forEach((row) => row.cells.forEach((cell) => {
    if (cell.col > row.row) assert.equal(cell.probability, 0);
  }));
});

test('masking before softmax renormalizes visible keys to one', () => {
  const weights = maskBeforeSoftmax({ scores: [3, 2, 5], allowed: [true, true, false] });
  close(weights.reduce((sum, value) => sum + value, 0), 1);
  assert.equal(weights[2], 0);
});

test('naively zeroing masked probabilities after softmax loses probability mass', () => {
  const weights = zeroAfterSoftmax({ scores: [3, 2, 5], allowed: [true, true, false] });
  assert.ok(weights.reduce((sum, value) => sum + value, 0) < 0.2);
});

test('mask order changes the resulting weighted output when post-softmax zeroing is not renormalized', () => {
  const result = maskOrderExperiment();
  close(result.correctWeightSum, 1);
  assert.ok(result.naiveWeightSum < 1);
  assert.notEqual(result.correctOutput, result.naiveOutput);
});

test('invalid mask inputs fail explicitly', () => {
  assert.throws(() => buildMaskMatrix({ mode: 'magic' }), RangeError);
  assert.throws(() => maskBeforeSoftmax({ scores: [1], allowed: [] }), RangeError);
  assert.throws(() => softmax([]), TypeError);
});
