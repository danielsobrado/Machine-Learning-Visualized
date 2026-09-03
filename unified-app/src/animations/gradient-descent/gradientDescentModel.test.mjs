import assert from 'node:assert/strict';
import test from 'node:test';

import {
  convergenceFactor,
  gradient,
  learningRateStatus,
  loss,
  lossWorldY,
  nextWeight,
  simulateQuadraticDescent,
  updateMultiplier,
} from './gradientDescentModel.js';

test('gradient descent model follows the displayed quadratic update', () => {
  assert.equal(loss(4), 16);
  assert.equal(gradient(4), 8);
  assert.equal(nextWeight(4, 0.1), 3.2);
  assert.equal(nextWeight(-4, 0.1), -3.2);
});

test('loss-scene mapping draws the minimum below higher-loss points', () => {
  assert.ok(lossWorldY(0) < lossWorldY(1));
  assert.ok(lossWorldY(1) < lossWorldY(4));
  assert.equal(lossWorldY(-4), lossWorldY(4));
});

test('learning-rate status distinguishes every exact quadratic stability regime', () => {
  assert.equal(learningRateStatus(0.01).text, 'Very slow · converges');
  assert.equal(learningRateStatus(0.1).text, 'Monotonic · converges');
  assert.equal(learningRateStatus(0.5).text, 'One-step optimum');
  assert.equal(learningRateStatus(0.95).text, 'Oscillatory · converges');
  assert.equal(learningRateStatus(1).text, 'Critical · no convergence');
  assert.equal(learningRateStatus(1.1).text, 'Diverges');
});

test('update multiplier explains monotonic and oscillatory behavior', () => {
  assert.equal(updateMultiplier(0.1), 0.8);
  assert.equal(updateMultiplier(0.5), 0);
  assert.ok(Math.abs(updateMultiplier(0.95) - (-0.9)) < 1e-12);
  assert.equal(updateMultiplier(1), -1);
  assert.ok(updateMultiplier(1.1) < -1);

  assert.equal(convergenceFactor(0.5), 0);
  assert.ok(convergenceFactor(0.95) < 1);
  assert.equal(convergenceFactor(1), 1);
  assert.ok(convergenceFactor(1.1) > 1);
});

test('alpha 0.5 reaches the quadratic optimum in one step', () => {
  const history = simulateQuadraticDescent({ learningRate: 0.5, startWeight: 4, steps: 4 });

  assert.equal(history[1].weight, 0);
  assert.equal(history[1].loss, 0);
  assert.ok(history.slice(1).every((item) => item.weight === 0));
});

test('alpha 0.95 oscillates while converging', () => {
  const history = simulateQuadraticDescent({ learningRate: 0.95, startWeight: 4, steps: 12 });
  const signs = history.slice(1, 5).map((item) => Math.sign(item.weight));

  assert.deepEqual(signs, [-1, 1, -1, 1]);
  assert.ok(Math.abs(history.at(-1).weight) < Math.abs(history[0].weight));
  assert.ok(history.at(-1).loss < history[0].loss);
});

test('alpha 1 is a non-convergent two-cycle', () => {
  const history = simulateQuadraticDescent({ learningRate: 1, startWeight: 4, steps: 6 });

  assert.deepEqual(history.map((item) => item.weight), [4, -4, 4, -4, 4, -4, 4]);
  assert.ok(history.every((item) => item.loss === 16));
});

test('learning rates above one diverge on this quadratic', () => {
  const history = simulateQuadraticDescent({ learningRate: 1.1, startWeight: 4, steps: 6 });
  const magnitudes = history.map((item) => Math.abs(item.weight));

  for (let index = 1; index < magnitudes.length; index += 1) {
    assert.ok(magnitudes[index] > magnitudes[index - 1]);
  }
  assert.ok(history.at(-1).loss > history[0].loss);
});

test('simulation validates invalid inputs', () => {
  assert.throws(() => simulateQuadraticDescent({ learningRate: 0 }), RangeError);
  assert.throws(() => simulateQuadraticDescent({ learningRate: Number.NaN }), RangeError);
  assert.throws(() => simulateQuadraticDescent({ learningRate: 0.1, startWeight: Number.NaN }), TypeError);
  assert.throws(() => simulateQuadraticDescent({ learningRate: 0.1, steps: 0 }), RangeError);
  assert.throws(() => simulateQuadraticDescent({ learningRate: 0.1, steps: 1.5 }), RangeError);
});
