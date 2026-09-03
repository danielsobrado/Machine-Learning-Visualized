import assert from 'node:assert/strict';
import test from 'node:test';

import {
  activationMoments,
  analyzeInitialization,
  buildWidthSchedule,
  classifyScale,
  compareInitializers,
  symmetryStep,
  weightVariance,
} from './initializationModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('initializer variances use the intended fan rule', () => {
  close(weightVariance('xavier', { fanIn: 32, fanOut: 96 }), 2 / 128);
  close(weightVariance('heFanIn', { fanIn: 32, fanOut: 96 }), 2 / 32);
  close(weightVariance('heFanOut', { fanIn: 32, fanOut: 96 }), 2 / 96);
});

test('width schedule makes a rectangular transition once, then stays shape-valid', () => {
  assert.deepEqual(buildWidthSchedule({ inputWidth: 256, hiddenWidth: 32, layers: 4 }), [256, 32, 32, 32, 32]);
});

test('balanced He fan-in ReLU preserves forward and backward second moments', () => {
  const result = analyzeInitialization({ method: 'heFanIn', activation: 'relu', inputWidth: 64, hiddenWidth: 64, layers: 8 });
  close(result.finalForward, 1);
  close(result.finalBackward, 1);
  assert.equal(result.forwardHealth, 'stable');
  assert.equal(result.backwardHealth, 'stable');
});

test('a bottleneck backward mismatch occurs once instead of being illegally compounded', () => {
  const result = analyzeInitialization({ method: 'heFanIn', activation: 'relu', inputWidth: 256, hiddenWidth: 32, layers: 8 });
  close(result.finalForward, 1);
  close(result.finalBackward, 0.125);
  close(result.layers[0].backwardGain, 0.125);
  assert.ok(result.layers.slice(1).every((layer) => Math.abs(layer.backwardGain - 1) < 1e-12));
});

test('an expansion backward mismatch also occurs once', () => {
  const result = analyzeInitialization({ method: 'heFanIn', activation: 'relu', inputWidth: 32, hiddenWidth: 256, layers: 8 });
  close(result.finalForward, 1);
  close(result.finalBackward, 8);
  assert.equal(result.backwardHealth, 'exploding');
});

test('He fan-out preserves backward ReLU scale but moves the rectangular mismatch forward', () => {
  const result = analyzeInitialization({ method: 'heFanOut', activation: 'relu', inputWidth: 256, hiddenWidth: 32, layers: 6 });
  close(result.finalBackward, 1);
  close(result.finalForward, 8);
  assert.equal(result.forwardHealth, 'exploding');
  assert.equal(result.backwardHealth, 'stable');
});

test('Xavier is an explicit forward-backward compromise on a rectangular linear layer', () => {
  const result = analyzeInitialization({ method: 'xavier', activation: 'linear', inputWidth: 256, hiddenWidth: 32, layers: 5 });
  close(result.finalForward, 512 / 288);
  close(result.finalBackward, 64 / 288);
});

test('tanh moments respond to actual pre-activation scale and expose saturation', () => {
  const gentle = activationMoments('tanh', 0.1);
  const saturated = activationMoments('tanh', 9);
  assert.ok(gentle.derivativeSecondMoment > 0.8);
  assert.ok(saturated.derivativeSecondMoment < 0.2);
  assert.ok(saturated.activationSecondMoment > gentle.activationSecondMoment);
});

test('tanh saturation is visible in the layer analysis instead of assumed linear', () => {
  const result = analyzeInitialization({ method: 'huge', activation: 'tanh', inputWidth: 64, hiddenWidth: 64, layers: 4 });
  assert.ok(result.saturatedLayerCount >= 1);
  assert.ok(result.layers[0].preActivationSecondMoment >= 9 - 1e-12);
});

test('tiny initialization vanishes through a balanced ReLU stack', () => {
  const result = analyzeInitialization({ method: 'tiny', activation: 'relu', inputWidth: 64, hiddenWidth: 64, layers: 4 });
  assert.equal(result.forwardHealth, 'vanishing');
  assert.equal(result.backwardHealth, 'vanishing');
});

test('comparison evaluates every configured initializer', () => {
  const results = compareInitializers({ activation: 'relu', inputWidth: 64, hiddenWidth: 64, layers: 3 });
  assert.equal(results.length, 5);
  assert.ok(results.some((result) => result.method === 'heFanIn'));
  assert.ok(results.some((result) => result.method === 'heFanOut'));
});

test('identical hidden neurons remain identical after the same gradient update', () => {
  const result = symmetryStep({ input: 1, target: 1, hiddenWeight: 0, outputWeight: 0.5, learningRate: 0.2, perturbation: 0 });
  close(result.hiddenGradients[0], result.hiddenGradients[1]);
  close(result.nextHiddenWeights[0], result.nextHiddenWeights[1]);
  assert.equal(result.symmetryBrokenBefore, false);
  assert.equal(result.symmetryBrokenAfter, false);
});

test('a small perturbation breaks symmetry and produces different hidden gradients', () => {
  const result = symmetryStep({ input: 1, target: 1, hiddenWeight: 0, outputWeight: 0.5, learningRate: 0.2, perturbation: 0.08 });
  assert.notEqual(result.hiddenGradients[0], result.hiddenGradients[1]);
  assert.notEqual(result.nextHiddenWeights[0], result.nextHiddenWeights[1]);
  assert.equal(result.symmetryBrokenBefore, true);
  assert.equal(result.symmetryBrokenAfter, true);
});

test('invalid configurations fail explicitly', () => {
  assert.throws(() => weightVariance('mystery', { fanIn: 64, fanOut: 64 }), RangeError);
  assert.throws(() => buildWidthSchedule({ inputWidth: 0, hiddenWidth: 64, layers: 3 }), RangeError);
  assert.throws(() => activationMoments('sigmoid', 1), RangeError);
  assert.throws(() => classifyScale(-1), RangeError);
  assert.throws(() => symmetryStep({ input: 1, target: 1, hiddenWeight: 0, outputWeight: 0.5, learningRate: 0 }), RangeError);
});
