import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BIAS_EXAMPLE,
  doubleEstimatorTargetMean,
  maximizationBias,
  qLearningTarget,
  qUpdate,
} from './qLearningModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('each noisy action estimate is unbiased in the teaching example', () => {
  const result = maximizationBias(BIAS_EXAMPLE);
  result.actionMeans.forEach((mean) => close(mean, 0));
});

test('max over unbiased noisy estimates is positively biased', () => {
  const result = maximizationBias(BIAS_EXAMPLE);
  close(result.maxOfMeans, 0);
  close(result.meanOfMax, 0.9);
  close(result.bias, 0.9);
});

test('independent selection and evaluation removes the max-selection bias in the balanced example', () => {
  close(doubleEstimatorTargetMean({ selectionSamples: BIAS_EXAMPLE, evaluationSamples: BIAS_EXAMPLE }), 0);
});

test('non-terminal target bootstraps from the largest next action value', () => {
  close(qLearningTarget({ reward: 1, gamma: 0.9, nextActionValues: [2, 5] }), 5.5);
});

test('terminal target does not bootstrap', () => {
  close(qLearningTarget({ reward: 1, gamma: 0.9, nextActionValues: [100, 200], terminal: true }), 1);
});

test('Q update moves alpha fraction toward the target', () => {
  close(qUpdate({ current: 2, target: 6, alpha: 0.25 }), 3);
});

test('invalid Q-learning inputs fail explicitly', () => {
  assert.throws(() => maximizationBias([]), TypeError);
  assert.throws(() => qLearningTarget({ reward: 1, gamma: 2, nextActionValues: [1, 2] }), RangeError);
  assert.throws(() => qUpdate({ current: 1, target: 2, alpha: -0.1 }), RangeError);
});
