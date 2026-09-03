import assert from 'node:assert/strict';
import test from 'node:test';

import {
  accumulationScaleRatio,
  classifyQuadraticStep,
  compareLoopModes,
  exactStabilityProduct,
  quadraticGradient,
  quadraticLoss,
  simulateTrainingLoop,
} from './trainingLoopModel.js';
import { TRAINING_LOOP_DEFAULTS } from './trainingLoopConstants.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('quadratic loss and gradient are internally consistent', () => {
  close(quadraticLoss(2, 1.4), 2.8);
  close(quadraticGradient(2, 1.4), 2.8);
});

test('quadratic gradient descent uses the exact alpha-lambda stability regimes', () => {
  assert.equal(classifyQuadraticStep(0.2, 1.4), 'monotonic');
  assert.equal(classifyQuadraticStep(0.5, 2), 'one-step');
  assert.equal(classifyQuadraticStep(0.75, 2), 'oscillatory-stable');
  assert.equal(classifyQuadraticStep(1, 2), 'critical');
  assert.equal(classifyQuadraticStep(1.1, 2), 'divergent');
});

test('correct accumulation averages micro-batch gradients before the update', () => {
  const result = simulateTrainingLoop({
    ...TRAINING_LOOP_DEFAULTS,
    optimizerSteps: 1,
    microBatches: 8,
    mode: 'correct',
  });
  close(result.history[1].optimizerGradient, result.history[1].gradientSum / 8);
});

test('unscaled accumulation multiplies the effective update by the micro-batch count', () => {
  const correct = simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, optimizerSteps: 1, mode: 'correct' });
  const broken = simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, optimizerSteps: 1, mode: 'unscaled' });
  close(broken.history[1].optimizerGradient / correct.history[1].optimizerGradient, TRAINING_LOOP_DEFAULTS.microBatches);
  close(accumulationScaleRatio(TRAINING_LOOP_DEFAULTS), TRAINING_LOOP_DEFAULTS.microBatches);
});

test('default correct loop is stable while unscaled accumulation crosses the exact divergence boundary', () => {
  const correct = simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, mode: 'correct' });
  const broken = simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, mode: 'unscaled' });
  assert.ok(correct.baseStabilityProduct < 2);
  assert.ok(broken.effectiveStabilityProduct > 2);
  assert.equal(broken.expectedUnscaledRegime, 'divergent');
  assert.ok(broken.final.loss > correct.final.loss * 1000);
});

test('forgetting zero_grad carries stale gradients across optimizer steps', () => {
  const stale = simulateTrainingLoop({
    ...TRAINING_LOOP_DEFAULTS,
    optimizerSteps: 3,
    microBatches: 1,
    noiseAmplitude: 0,
    mode: 'stale',
  });
  close(stale.history[2].optimizerGradient, stale.history[1].optimizerGradient + stale.history[2].averagedGradient);
  assert.notEqual(stale.history[2].optimizerGradient, stale.history[2].averagedGradient);
});

test('micro-batch count does not change the deterministic stability product when accumulation is averaged', () => {
  const one = simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, microBatches: 1, noiseAmplitude: 0, mode: 'correct' });
  const sixteen = simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, microBatches: 16, noiseAmplitude: 0, mode: 'correct' });
  close(one.effectiveStabilityProduct, sixteen.effectiveStabilityProduct);
  close(one.final.loss, sixteen.final.loss);
});

test('comparison includes all training-loop failure modes', () => {
  const results = compareLoopModes(TRAINING_LOOP_DEFAULTS);
  assert.deepEqual(results.map((result) => result.mode), ['correct', 'unscaled', 'stale']);
});

test('stability product is alpha times curvature', () => {
  close(exactStabilityProduct(0.2, 1.4), 0.28);
});

test('invalid loop configurations fail explicitly', () => {
  assert.throws(() => simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, learningRate: 0 }), RangeError);
  assert.throws(() => simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, optimizerSteps: 0 }), RangeError);
  assert.throws(() => simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, microBatches: 0 }), RangeError);
  assert.throws(() => simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, noiseAmplitude: -1 }), RangeError);
  assert.throws(() => simulateTrainingLoop({ ...TRAINING_LOOP_DEFAULTS, mode: 'magic' }), RangeError);
});
