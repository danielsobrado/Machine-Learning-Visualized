import assert from 'node:assert/strict';
import test from 'node:test';
import {
  binaryCrossEntropy,
  buildCrossEntropyLab,
  categoricalCrossEntropy,
  crossEntropyFromLogits,
  entropy,
  klDivergence,
  logSumExp,
  oneHot,
  softmax,
  softmaxCrossEntropyGradient,
} from './crossEntropyModel.js';
import { CROSS_ENTROPY_SCENARIOS } from './crossEntropyConfig.js';

test('one-hot categorical loss reduces to negative log probability of the true class', () => {
  const target = oneHot(3, 1);
  const prediction = [0.1, 0.7, 0.2];
  assert.ok(Math.abs(categoricalCrossEntropy(target, prediction) + Math.log(0.7)) < 1e-12);
});

test('cross entropy from logits matches probability-space calculation', () => {
  const logits = [1.2, -0.4, 0.3];
  const target = [0.8, 0.1, 0.1];
  assert.ok(Math.abs(crossEntropyFromLogits(target, logits) - categoricalCrossEntropy(target, softmax(logits))) < 1e-12);
});

test('cross entropy decomposes into target entropy plus KL divergence', () => {
  const target = [0.7, 0.2, 0.1];
  const prediction = [0.5, 0.35, 0.15];
  const ce = categoricalCrossEntropy(target, prediction);
  assert.ok(Math.abs(ce - entropy(target) - klDivergence(target, prediction)) < 1e-12);
});

test('softmax cross-entropy gradient is prediction minus target and sums to zero', () => {
  const target = [1, 0, 0];
  const prediction = [0.6, 0.3, 0.1];
  const gradient = softmaxCrossEntropyGradient(target, prediction);
  assert.deepEqual(gradient, [-0.4, 0.3, 0.1]);
  assert.ok(Math.abs(gradient.reduce((sum, value) => sum + value, 0)) < 1e-12);
});

test('adding a constant to every logit does not change softmax or cross entropy', () => {
  const target = [1, 0, 0];
  const a = [2, 1, 0];
  const b = [1002, 1001, 1000];
  const pa = softmax(a);
  const pb = softmax(b);
  pa.forEach((value, index) => assert.ok(Math.abs(value - pb[index]) < 1e-12));
  assert.ok(Math.abs(crossEntropyFromLogits(target, a) - crossEntropyFromLogits(target, b)) < 1e-12);
});

test('stable log-sum-exp remains finite for extreme logits', () => {
  assert.ok(Number.isFinite(logSumExp([1000, 999, -1000])));
  assert.ok(Number.isFinite(crossEntropyFromLogits([1, 0, 0], [1000, 999, -1000])));
});

test('overconfident wrong prediction is punished more than cautious wrong prediction', () => {
  const cautious = CROSS_ENTROPY_SCENARIOS.find((scenario) => scenario.id === 'wrong-cautious');
  const overconfident = CROSS_ENTROPY_SCENARIOS.find((scenario) => scenario.id === 'wrong-overconfident');
  const cautiousLab = buildCrossEntropyLab({ scenario: cautious, logitScale: 1, labelSmoothing: 0 });
  const overconfidentLab = buildCrossEntropyLab({ scenario: overconfident, logitScale: 1, labelSmoothing: 0 });
  assert.ok(overconfidentLab.loss > cautiousLab.loss);
});

test('two correct predictions can have identical accuracy but different cross entropy', () => {
  const cautious = CROSS_ENTROPY_SCENARIOS.find((scenario) => scenario.id === 'correct-cautious');
  const confident = CROSS_ENTROPY_SCENARIOS.find((scenario) => scenario.id === 'correct-confident');
  const cautiousLab = buildCrossEntropyLab({ scenario: cautious, logitScale: 1, labelSmoothing: 0 });
  const confidentLab = buildCrossEntropyLab({ scenario: confident, logitScale: 1, labelSmoothing: 0 });
  assert.equal(cautiousLab.correct, true);
  assert.equal(confidentLab.correct, true);
  assert.ok(confidentLab.loss < cautiousLab.loss);
});

test('binary cross entropy handles exact correct certainty and impossible truth', () => {
  assert.equal(binaryCrossEntropy(1, 1), 0);
  assert.equal(binaryCrossEntropy(0, 0), 0);
  assert.equal(binaryCrossEntropy(1, 0), Number.POSITIVE_INFINITY);
});
