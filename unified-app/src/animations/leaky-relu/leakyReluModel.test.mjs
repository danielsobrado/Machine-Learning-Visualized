import assert from 'node:assert/strict';
import test from 'node:test';

import { depthForRetention, leakyRelu, leakyReluDerivative, negativeDepthPropagation } from './leakyReluModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('Leaky ReLU preserves sign and uses alpha on the negative branch', () => {
  close(leakyRelu(-3, 0.1), -0.3);
  close(leakyReluDerivative(-3, 0.1), 0.1);
  close(leakyRelu(2, 0.1), 2);
  close(leakyReluDerivative(2, 0.1), 1);
});

test('negative-side gradients compound as alpha to the depth', () => {
  const result = negativeDepthPropagation({ input: -2, upstreamGradient: 1, alpha: 0.1, depth: 4 });
  close(result.finalGradient, 1e-4);
  close(result.retention, 1e-4);
  close(result.closedFormRetention, 1e-4);
});

test('a conventional tiny leak can still produce effectively vanished gradients through depth', () => {
  const result = negativeDepthPropagation({ input: -2, upstreamGradient: 1, alpha: 0.01, depth: 8 });
  close(result.finalGradient, 1e-16, 1e-28);
  assert.ok(result.retention < 1e-12);
});

test('alpha zero exactly recovers ReLU on the negative branch', () => {
  const result = negativeDepthPropagation({ input: -2, upstreamGradient: 1.5, alpha: 0, depth: 3 });
  assert.equal(result.finalActivation, 0);
  assert.equal(result.finalGradient, 0);
});

test('alpha one keeps negative-side gradient but removes the negative-side kink', () => {
  const result = negativeDepthPropagation({ input: -2, upstreamGradient: 1.5, alpha: 1, depth: 5 });
  close(result.finalActivation, -2);
  close(result.finalGradient, 1.5);
  close(result.retention, 1);
});

test('depth threshold reports how quickly a leak falls below a chosen retention', () => {
  assert.equal(depthForRetention({ alpha: 0.1, minimumRetention: 1e-3 }), 3);
  assert.equal(depthForRetention({ alpha: 0, minimumRetention: 1e-3 }), 1);
  assert.equal(depthForRetention({ alpha: 1, minimumRetention: 1e-3 }), Number.POSITIVE_INFINITY);
});

test('invalid configurations fail explicitly', () => {
  assert.throws(() => leakyRelu(-1, -0.1), RangeError);
  assert.throws(() => negativeDepthPropagation({ input: 1, upstreamGradient: 1, alpha: 0.1, depth: 2 }), RangeError);
  assert.throws(() => negativeDepthPropagation({ input: -1, upstreamGradient: 1, alpha: 0.1, depth: 0 }), RangeError);
  assert.throws(() => depthForRetention({ alpha: 0.1, minimumRetention: 1 }), RangeError);
});
