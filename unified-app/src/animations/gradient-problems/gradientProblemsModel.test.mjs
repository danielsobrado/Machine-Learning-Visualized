import assert from 'node:assert/strict';
import test from 'node:test';

import {
  activationState,
  blockDerivative,
  buildGradientTrace,
  clipByGlobalNorm,
  diagnoseGradient,
  l2Norm,
  logMagnitude,
} from './gradientProblemsModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('activation derivatives come from the actual pre-activation state', () => {
  close(activationState(0, 'tanh').slope, 1);
  assert.ok(activationState(4, 'tanh').slope < 0.002);
  assert.equal(activationState(-1, 'relu').slope, 0);
  close(activationState(-1, 'leakyRelu').slope, 0.1);
});

test('plain linear identity preserves the gradient through depth', () => {
  const trace = buildGradientTrace({
    depth: 20,
    input: 1,
    weight: 1,
    bias: 0,
    activationId: 'linear',
    useResidual: false,
  });
  close(trace.inputGradient, 1);
  assert.ok(trace.layers.every((layer) => layer.localDerivative === 1));
});

test('a saturated tanh chain produces a vanishing input gradient', () => {
  const trace = buildGradientTrace({
    depth: 14,
    input: 3,
    weight: 1.5,
    bias: 0,
    activationId: 'tanh',
    useResidual: false,
  });
  assert.equal(diagnoseGradient(trace.inputGradient), 'vanishing');
  assert.equal(trace.layers[0].activationState, 'saturated');
});

test('a dead ReLU blocks the backward signal exactly', () => {
  const trace = buildGradientTrace({
    depth: 12,
    input: -1,
    weight: 1,
    bias: 0,
    activationId: 'relu',
    useResidual: false,
  });
  close(trace.inputGradient, 0);
  assert.ok(trace.layers.every((layer) => layer.activationSlope === 0));
});

test('positive ReLU with large repeated weight explodes', () => {
  const trace = buildGradientTrace({
    depth: 24,
    input: 1,
    weight: 1.5,
    bias: 0,
    activationId: 'relu',
    useResidual: false,
  });
  close(trace.inputGradient, 1.5 ** 24, 1e-6);
  assert.equal(diagnoseGradient(trace.inputGradient), 'exploding');
});

test('residual derivative uses the exact identity plus branch term', () => {
  close(blockDerivative({ weight: 0.5, activationSlope: 0.2, useResidual: true, residualScale: 0.4 }), 1.04);
  close(blockDerivative({ weight: 0.5, activationSlope: 0.2, useResidual: false, residualScale: 0.4 }), 0.1);
});

test('residual path can preserve signal through a dead ReLU branch', () => {
  const trace = buildGradientTrace({
    depth: 12,
    input: -1,
    weight: 1,
    bias: 0,
    activationId: 'relu',
    useResidual: true,
    residualScale: 1,
  });
  close(trace.inputGradient, 1);
  assert.ok(trace.layers.every((layer) => layer.localDerivative === 1));
});

test('residual path is not a guarantee against explosion', () => {
  const trace = buildGradientTrace({
    depth: 18,
    input: 1,
    weight: 1,
    bias: 0,
    activationId: 'relu',
    useResidual: true,
    residualScale: 1,
  });
  close(trace.inputGradient, 2 ** 18);
  assert.equal(diagnoseGradient(trace.inputGradient), 'exploding');
});

test('global norm clipping scales the full parameter-gradient vector once', () => {
  const result = clipByGlobalNorm([3, 4], 2.5);
  close(result.originalNorm, 5);
  close(result.scale, 0.5);
  close(result.clippedNorm, 2.5);
  assert.deepEqual(result.clipped, [1.5, 2]);
});

test('global norm clipping does not raise small gradients', () => {
  const result = clipByGlobalNorm([0.03, 0.04], 1);
  close(result.originalNorm, 0.05);
  close(result.clippedNorm, 0.05);
  close(result.scale, 1);
  assert.equal(result.wasClipped, false);
});

test('parameter-gradient norm is derived from the computed backward pass', () => {
  const trace = buildGradientTrace({
    depth: 2,
    input: 1,
    weight: 1,
    bias: 0,
    activationId: 'linear',
  });
  close(trace.parameterGradientNorm, l2Norm(trace.parameterGradients));
  assert.deepEqual(trace.parameterGradients, [1, 1, 1, 1]);
});

test('log magnitude supports zero and multiple orders of magnitude', () => {
  close(logMagnitude(1000), 3);
  assert.equal(logMagnitude(0), -12);
});

test('invalid configurations fail explicitly', () => {
  assert.throws(() => buildGradientTrace({ depth: 1 }), RangeError);
  assert.throws(() => buildGradientTrace({ depth: 4, activationId: 'mystery' }), RangeError);
  assert.throws(() => buildGradientTrace({ depth: 4, useResidual: 'yes' }), TypeError);
  assert.throws(() => clipByGlobalNorm([1, 2], -1), RangeError);
});
