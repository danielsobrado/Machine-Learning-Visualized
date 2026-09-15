import assert from 'node:assert/strict';
import test from 'node:test';

import { activationState, compareActivations } from './activationComparisonModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('sigmoid and tanh derivatives are correct at zero', () => {
  const sigmoid = activationState('sigmoid', 0);
  const tanh = activationState('tanh', 0);
  close(sigmoid.output, 0.5);
  close(sigmoid.derivative, 0.25);
  close(tanh.output, 0);
  close(tanh.derivative, 1);
});

test('ReLU blocks a negative input while Leaky ReLU keeps a small gradient', () => {
  const relu = activationState('relu', -4);
  const leaky = activationState('leaky-relu', -4);
  assert.equal(relu.output, 0);
  assert.equal(relu.derivative, 0);
  close(leaky.output, -0.04);
  close(leaky.derivative, 0.01);
});

test('sigmoid and tanh visibly saturate at large magnitude', () => {
  assert.ok(activationState('sigmoid', 8).derivative < 0.001);
  assert.ok(activationState('sigmoid', -8).derivative < 0.001);
  assert.ok(activationState('tanh', 8).derivative < 1e-6);
  assert.ok(activationState('tanh', -8).derivative < 1e-6);
});

test('GELU tanh approximation has the expected value and slope at zero', () => {
  const gelu = activationState('gelu', 0);
  close(gelu.output, 0);
  close(gelu.derivative, 0.5);
});

test('upstream gradient is multiplied by each local derivative', () => {
  const rows = compareActivations(-4, 2);
  const relu = rows.find((row) => row.id === 'relu');
  const leaky = rows.find((row) => row.id === 'leaky-relu');
  assert.equal(relu.passedGradient, 0);
  close(leaky.passedGradient, 0.02);
});

test('invalid activation inputs fail explicitly', () => {
  assert.throws(() => activationState('unknown', 0), RangeError);
  assert.throws(() => activationState('relu', Number.NaN), RangeError);
  assert.throws(() => compareActivations(0, Number.POSITIVE_INFINITY), RangeError);
});
