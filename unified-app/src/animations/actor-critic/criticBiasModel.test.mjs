import assert from 'node:assert/strict';
import test from 'node:test';
import { criticBiasComparison } from './criticBiasModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('accurate critic reproduces the ideal actor update', () => {
  const result = criticBiasComparison({ criticValue: 5, trueStateValue: 5 });
  close(result.criticError, 0);
  close(result.estimated.actorDelta, result.ideal.actorDelta);
  assert.equal(result.directionFlipped, false);
  assert.equal(result.updateSuppressed, false);
});

test('overestimated critic can reverse a truly positive advantage', () => {
  const result = criticBiasComparison({ targetValue: 8, trueStateValue: 5, criticValue: 9 });
  assert.ok(result.ideal.advantage > 0);
  assert.ok(result.estimated.advantage < 0);
  assert.equal(result.directionFlipped, true);
  assert.equal(result.updateSuppressed, false);
});

test('critic equal to target can suppress a genuinely positive update', () => {
  const result = criticBiasComparison({ targetValue: 8, trueStateValue: 5, criticValue: 8 });
  assert.ok(result.ideal.actorDelta > 0);
  close(result.estimated.actorDelta, 0);
  assert.equal(result.directionFlipped, false);
  assert.equal(result.updateSuppressed, true);
});

test('underestimated critic exaggerates a positive update', () => {
  const result = criticBiasComparison({ targetValue: 8, trueStateValue: 5, criticValue: 2 });
  assert.ok(result.estimated.actorDelta > result.ideal.actorDelta);
  assert.equal(result.directionFlipped, false);
  assert.equal(result.updateSuppressed, false);
});
