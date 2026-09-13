import assert from 'node:assert/strict';
import test from 'node:test';
import { ppoLogitGradient, repeatedEpochTrace } from './ppoTrainingDynamicsModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('initial positive-advantage gradient increases sampled action probability', () => {
  const gradient = ppoLogitGradient({ oldLogit: 0, newLogit: 0, action: 1, advantage: 1, epsilon: 0.2 });
  close(gradient, 0.5);
});

test('helpful update stops contributing once PPO clipping is active', () => {
  const gradient = ppoLogitGradient({ oldLogit: 0, newLogit: 2, action: 1, advantage: 1, epsilon: 0.2 });
  close(gradient, 0);
});

test('large first epoch can overshoot clip ratio before clipping activates', () => {
  const trace = repeatedEpochTrace({ oldLogit: 0, action: 1, advantage: 1, epsilon: 0.2, learningRate: 5, epochs: 3 });
  assert.ok(trace.rows[1].ratio > 1.2);
  assert.ok(trace.rows[1].kl > 0.03);
  assert.equal(trace.rows[1].clippingActive, true);
});

test('small learning rate reaches clipping boundary with less KL drift', () => {
  const gentle = repeatedEpochTrace({ oldLogit: 0, action: 1, advantage: 1, epsilon: 0.2, learningRate: 0.2, epochs: 8 });
  const aggressive = repeatedEpochTrace({ oldLogit: 0, action: 1, advantage: 1, epsilon: 0.2, learningRate: 5, epochs: 8 });
  assert.ok(gentle.finalKl < aggressive.finalKl);
});

test('invalid repeated-epoch inputs fail explicitly', () => {
  assert.throws(() => repeatedEpochTrace({ oldLogit: 0, action: 1, advantage: 1, epsilon: 0.2, learningRate: 0, epochs: 2 }), RangeError);
  assert.throws(() => repeatedEpochTrace({ oldLogit: 0, action: 2, advantage: 1, epsilon: 0.2, learningRate: 1, epochs: 2 }), RangeError);
});
