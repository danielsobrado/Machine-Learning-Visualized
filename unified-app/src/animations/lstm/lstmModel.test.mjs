import assert from 'node:assert/strict';
import test from 'node:test';

import { lstmScalarStep, memoryRetention, sigmoid, stepsUntilRetentionBelow } from './lstmModel.js';

function close(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('sigmoid remains numerically stable for large positive and negative logits', () => {
  assert.ok(sigmoid(1000) > 0.999999999999);
  assert.ok(sigmoid(-1000) < 1e-12);
});

test('scalar LSTM cell follows the standard gate equations', () => {
  const result = lstmScalarStep({ previousCell: 1.2, forgetLogit: 2, inputLogit: -1, candidateLogit: 0.8, outputLogit: 1.3 });
  close(result.cell, result.forgetGate * 1.2 + result.inputGate * result.candidate);
  close(result.hidden, result.outputGate * Math.tanh(result.cell));
});

test('direct cell-state gradient through one time step equals the forget gate', () => {
  const result = lstmScalarStep({ previousCell: 1, forgetLogit: 0, inputLogit: 0, candidateLogit: 0, outputLogit: 0 });
  close(result.forgetGate, 0.5);
  close(result.directCellGradient, 0.5);
});

test('constant forget gates compound multiplicatively through time', () => {
  close(memoryRetention(0.9, 4), 0.9 ** 4);
});

test('forget gate 0.95 retains less than one percent after 100 steps', () => {
  const retention = memoryRetention(0.95, 100);
  assert.ok(retention < 0.006);
  assert.ok(retention > 0.005);
});

test('forget gate 0.99 still loses most direct signal over a long horizon', () => {
  const retention = memoryRetention(0.99, 100);
  assert.ok(retention > 0.36 && retention < 0.37);
});

test('steps-until-threshold reports the first step below the target retention', () => {
  const steps = stepsUntilRetentionBelow(0.95, 0.01);
  assert.ok(memoryRetention(0.95, steps) <= 0.01);
  assert.ok(memoryRetention(0.95, steps - 1) > 0.01);
});

test('perfect forget gate keeps direct memory indefinitely', () => {
  close(memoryRetention(1, 10000), 1);
  assert.equal(stepsUntilRetentionBelow(1, 0.01), Number.POSITIVE_INFINITY);
});

test('invalid LSTM configurations fail explicitly', () => {
  assert.throws(() => sigmoid(Number.NaN), RangeError);
  assert.throws(() => memoryRetention(1.1, 5), RangeError);
  assert.throws(() => memoryRetention(0.9, -1), RangeError);
  assert.throws(() => stepsUntilRetentionBelow(0.9, 1), RangeError);
});
