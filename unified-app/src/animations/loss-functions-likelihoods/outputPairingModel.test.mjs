import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildOutputPairingState,
  categoricalNllFromLogits,
  logSumExp,
  multilabelNllFromLogits,
  softmaxFromLogits,
} from './outputPairingModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('softmax probabilities sum to one', () => {
  const probabilities = softmaxFromLogits([2.4, 0.3, -1.2]);
  close(probabilities.reduce((sum, value) => sum + value, 0), 1);
});

test('softmax and categorical NLL are invariant to a shared logit shift', () => {
  const logits = [2.4, 0.3, -1.2];
  const shifted = logits.map((value) => value + 1000);
  const probabilities = softmaxFromLogits(logits);
  const shiftedProbabilities = softmaxFromLogits(shifted);
  probabilities.forEach((value, index) => close(value, shiftedProbabilities[index], 1e-12));
  close(categoricalNllFromLogits(logits, 1), categoricalNllFromLogits(shifted, 1), 1e-12);
});

test('categorical NLL stays finite for extreme logits', () => {
  const loss = categoricalNllFromLogits([1000, -1000, 0], 0);
  assert.equal(Number.isFinite(loss), true);
  close(loss, 0);
  assert.equal(Number.isFinite(logSumExp([1000, -1000, 0])), true);
});

test('multilabel sigmoid probabilities are independent and need not sum to one', () => {
  const state = buildOutputPairingState('multilabel', [4, 4, -4]);
  assert.ok(state.probabilitySum > 1);
  assert.equal(state.probabilities.length, 3);
});

test('binary logits-aware loss stays finite for extreme confidence', () => {
  const positive = buildOutputPairingState('binary', [1000, 0, 0]);
  const negative = buildOutputPairingState('binary', [-1000, 0, 0]);
  assert.equal(Number.isFinite(positive.loss), true);
  assert.equal(Number.isFinite(negative.loss), true);
  close(positive.loss, 0);
  assert.ok(negative.loss > 900);
});

test('multilabel NLL sums independent Bernoulli losses', () => {
  const loss = multilabelNllFromLogits([0, 0, 0], [1, 0, 1]);
  close(loss, 3 * Math.log(2));
});

test('invalid output contracts fail explicitly', () => {
  assert.throws(() => softmaxFromLogits([]), TypeError);
  assert.throws(() => categoricalNllFromLogits([1, 2], 3), RangeError);
  assert.throws(() => multilabelNllFromLogits([1, 2], [1]), TypeError);
  assert.throws(() => buildOutputPairingState('unknown', [1, 2, 3]), RangeError);
});
