import assert from 'node:assert/strict';
import test from 'node:test';

import {
  argmax,
  confidenceScalingExperiment,
  negativeLogLikelihood,
  shiftInvarianceExperiment,
  stableSoftmax,
} from './softmaxFailureModel.js';

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('stable softmax produces probabilities that sum to one', () => {
  const probabilities = stableSoftmax([2, 1, 0]);
  close(probabilities.reduce((sum, value) => sum + value, 0), 1);
});

test('adding a common logit offset leaves softmax unchanged', () => {
  const result = shiftInvarianceExperiment([2, 1, 0], 1000);
  assert.ok(result.maxAbsoluteDifference < 1e-12);
});

test('positive logit scaling preserves the predicted class', () => {
  const result = confidenceScalingExperiment({ logits: [2, 1, 0], scale: 5, targetIndex: 1 });
  assert.equal(result.beforePrediction, 0);
  assert.equal(result.afterPrediction, 0);
  assert.equal(result.predictionUnchanged, true);
});

test('scaling can make the same wrong prediction dramatically more confident', () => {
  const result = confidenceScalingExperiment({ logits: [2, 1, 0], scale: 5, targetIndex: 1 });
  assert.equal(result.targetCorrectBefore, false);
  assert.equal(result.targetCorrectAfter, false);
  assert.ok(result.afterMaxProbability > 0.99);
  assert.ok(result.afterTargetProbability < result.beforeTargetProbability / 20);
});

test('overconfident wrong scaling increases negative log likelihood', () => {
  const result = confidenceScalingExperiment({ logits: [2, 1, 0], scale: 5, targetIndex: 1 });
  assert.ok(result.afterNll > result.beforeNll * 3);
});

test('negative log likelihood matches minus log probability', () => {
  close(negativeLogLikelihood([0.25, 0.75], 0), -Math.log(0.25));
});

test('invalid softmax inputs fail explicitly', () => {
  assert.throws(() => stableSoftmax([1], 1), TypeError);
  assert.throws(() => stableSoftmax([1, 2], 0), RangeError);
  assert.throws(() => argmax([Number.NaN, 1]), TypeError);
  assert.throws(() => negativeLogLikelihood([0.5, 0.5], 2), RangeError);
});
