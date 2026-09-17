import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BIAS_EXAMPLE,
  doubleEstimatorTargetMean,
  maximizationBias,
  qLearningTarget,
  qUpdate,
  sarsaTarget,
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

test('non-terminal Q-learning target bootstraps from the largest next action value', () => {
  close(qLearningTarget({ reward: 1, gamma: 0.9, nextActionValues: [2, 5] }), 5.5);
});

test('SARSA target bootstraps from the next behavior action', () => {
  close(sarsaTarget({ reward: 1, gamma: 0.9, nextActionValues: [5, 2], nextActionIndex: 1 }), 2.8);
});

test('Q-learning and SARSA targets diverge when behavior is non-greedy', () => {
  const nextActionValues = [10, 2];
  close(qLearningTarget({ reward: 0, gamma: 0.9, nextActionValues }), 9);
  close(sarsaTarget({ reward: 0, gamma: 0.9, nextActionValues, nextActionIndex: 1 }), 1.8);
});

test('terminal targets do not bootstrap', () => {
  close(qLearningTarget({ reward: 1, gamma: 0.9, nextActionValues: [100, 200], terminal: true }), 1);
  close(sarsaTarget({ reward: 1, gamma: 0.9, nextActionValues: [100, 200], nextActionIndex: 1, terminal: true }), 1);
});

test('Q update moves alpha fraction toward the target', () => {
  close(qUpdate({ current: 2, target: 6, alpha: 0.25 }), 3);
});

test('invalid TD-control inputs fail explicitly', () => {
  assert.throws(() => maximizationBias([]), TypeError);
  assert.throws(() => qLearningTarget({ reward: 1, gamma: 2, nextActionValues: [1, 2] }), RangeError);
  assert.throws(() => sarsaTarget({ reward: 1, gamma: 0.9, nextActionValues: [1, 2], nextActionIndex: 3 }), RangeError);
  assert.throws(() => qUpdate({ current: 1, target: 2, alpha: -0.1 }), RangeError);
});
