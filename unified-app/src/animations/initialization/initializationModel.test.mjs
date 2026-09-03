import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyzeInitialization,
  classifyScale,
  propagationMultipliers,
  propagationSeries,
  weightVariance,
} from './initializationModel.js';

test('Xavier variance follows the Glorot fan-in and fan-out formula', () => {
  assert.equal(weightVariance('xavier', { fanIn: 64, fanOut: 64 }), 1 / 64);
  assert.equal(weightVariance('xavier', { fanIn: 32, fanOut: 96 }), 2 / 128);
});

test('He initialization preserves ReLU forward second-moment scale', () => {
  const result = propagationMultipliers({
    method: 'he',
    activation: 'relu',
    fanIn: 128,
    fanOut: 32,
  });

  assert.equal(result.forwardMultiplier, 1);
});

test('He ReLU backward scale still depends on fan-out over fan-in', () => {
  const result = propagationMultipliers({
    method: 'he',
    activation: 'relu',
    fanIn: 256,
    fanOut: 32,
  });

  assert.equal(result.forwardMultiplier, 1);
  assert.equal(result.backwardMultiplier, 0.125);
});

test('balanced He ReLU stays stable in both directions through depth', () => {
  const result = analyzeInitialization({
    method: 'he',
    activation: 'relu',
    fanIn: 64,
    fanOut: 64,
    layers: 8,
  });

  assert.equal(result.finalForward, 1);
  assert.equal(result.finalBackward, 1);
  assert.equal(result.forwardHealth, 'stable');
  assert.equal(result.backwardHealth, 'stable');
  assert.equal(result.hiddenGradientFailure, false);
});

test('a ReLU bottleneck can hide vanishing gradients behind stable activations', () => {
  const result = analyzeInitialization({
    method: 'he',
    activation: 'relu',
    fanIn: 256,
    fanOut: 32,
    layers: 3,
  });

  assert.equal(result.finalForward, 1);
  assert.equal(result.finalBackward, 0.001953125);
  assert.equal(result.forwardHealth, 'stable');
  assert.equal(result.backwardHealth, 'vanishing');
  assert.equal(result.hiddenGradientFailure, true);
});

test('a ReLU expansion can hide exploding gradients behind stable activations', () => {
  const result = analyzeInitialization({
    method: 'he',
    activation: 'relu',
    fanIn: 32,
    fanOut: 256,
    layers: 2,
  });

  assert.equal(result.finalForward, 1);
  assert.equal(result.finalBackward, 64);
  assert.equal(result.forwardHealth, 'stable');
  assert.equal(result.backwardHealth, 'exploding');
  assert.equal(result.hiddenGradientFailure, true);
});

test('Xavier balances linear propagation exactly when widths match', () => {
  const result = propagationMultipliers({
    method: 'xavier',
    activation: 'linear',
    fanIn: 96,
    fanOut: 96,
  });

  assert.equal(result.forwardMultiplier, 1);
  assert.equal(result.backwardMultiplier, 1);
});

test('propagation series and scale classification expose depth compounding', () => {
  const series = propagationSeries(0.5, 3);

  assert.deepEqual(series.map((entry) => entry.scale), [0.5, 0.25, 0.125]);
  assert.equal(classifyScale(0.125), 'vanishing');
  assert.equal(classifyScale(1), 'stable');
  assert.equal(classifyScale(5), 'exploding');
});

test('model rejects unknown methods, activations, and invalid dimensions', () => {
  assert.throws(() => weightVariance('mystery', { fanIn: 64, fanOut: 64 }), RangeError);
  assert.throws(
    () => propagationMultipliers({ method: 'he', activation: 'sigmoid', fanIn: 64, fanOut: 64 }),
    RangeError,
  );
  assert.throws(() => weightVariance('he', { fanIn: 0, fanOut: 64 }), RangeError);
  assert.throws(() => propagationSeries(1, 0), RangeError);
});
