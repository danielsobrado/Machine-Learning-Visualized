import assert from 'node:assert/strict';
import test from 'node:test';

import {
  adamFirstStepAnatomy,
  adamStep,
  evaluateOptimizerFairness,
  gradientNoiseScale,
  loss,
  simulate,
  trueGradient,
} from './optimizerModel.js';
import { ADAM_MECHANICS_DEFAULTS, OPTIMIZER_DEFAULTS } from './optimizerConstants.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('quadratic loss has its minimum and zero gradient at the configured basin', () => {
  close(loss([-3, 1]), 0);
  assert.deepEqual(trueGradient([-3, 1]), [0, 0]);
});

test('larger mini-batches reduce the deterministic noise scale', () => {
  assert.ok(gradientNoiseScale(64) < gradientNoiseScale(4));
  close(gradientNoiseScale(16), 0.42 / 4);
});

test('plain SGD update equals negative learning-rate times the sampled gradient', () => {
  const path = simulate({
    optimizer: 'sgd',
    learningRate: 0.1,
    beta1: 0.85,
    beta2: 0.96,
    epsilon: 1e-6,
    batchSize: 8,
    steps: 1,
  });
  close(path[1].update[0], -0.1 * path[1].grad[0]);
  close(path[1].update[1], -0.1 * path[1].grad[1]);
});

test('Adam bias correction makes the first moments equal the observed first gradient moments', () => {
  const gradient = [2, -4];
  const result = adamStep({
    gradient,
    learningRate: 0.001,
    beta1: 0.9,
    beta2: 0.999,
    epsilon: 1e-8,
    step: 1,
    biasCorrection: true,
  });
  close(result.correctedFirst[0], 2);
  close(result.correctedFirst[1], -4);
  close(result.correctedSecond[0], 4);
  close(result.correctedSecond[1], 16);
});

test('Adam first corrected step nearly normalizes very different gradient magnitudes', () => {
  const result = adamFirstStepAnatomy(ADAM_MECHANICS_DEFAULTS);
  close(Math.abs(result.corrected.update[0]), ADAM_MECHANICS_DEFAULTS.learningRate, 1e-8);
  close(Math.abs(result.corrected.update[1]), ADAM_MECHANICS_DEFAULTS.learningRate, 1e-8);
  assert.ok(result.effectiveLearningRates[0] > result.effectiveLearningRates[1] * 900);
});

test('omitting Adam bias correction materially distorts the first update', () => {
  const result = adamFirstStepAnatomy(ADAM_MECHANICS_DEFAULTS);
  assert.ok(result.uncorrectedToCorrectedNormRatio > 3);
  assert.ok(result.uncorrectedToCorrectedNormRatio < 3.2);
});

test('simulation is deterministic for the same configuration', () => {
  const config = {
    optimizer: 'adam',
    learningRate: OPTIMIZER_DEFAULTS.learningRate,
    beta1: OPTIMIZER_DEFAULTS.beta1,
    beta2: OPTIMIZER_DEFAULTS.beta2,
    epsilon: OPTIMIZER_DEFAULTS.epsilon,
    batchSize: OPTIMIZER_DEFAULTS.batchSize,
    steps: OPTIMIZER_DEFAULTS.steps,
  };
  assert.deepEqual(simulate(config), simulate(config));
});

test('same learning rate and tuned learning rates can rank optimizers differently', () => {
  const result = evaluateOptimizerFairness({
    learningRate: OPTIMIZER_DEFAULTS.learningRate,
    beta1: OPTIMIZER_DEFAULTS.beta1,
    beta2: OPTIMIZER_DEFAULTS.beta2,
    epsilon: OPTIMIZER_DEFAULTS.epsilon,
    batchSize: OPTIMIZER_DEFAULTS.batchSize,
    steps: OPTIMIZER_DEFAULTS.steps,
  });
  assert.equal(result.sameRateWinner, 'adam');
  assert.equal(result.tunedWinner, 'momentum');
  assert.equal(result.rankingChanged, true);
});

test('tuning chooses a separate learning rate for each optimizer', () => {
  const result = evaluateOptimizerFairness({
    learningRate: OPTIMIZER_DEFAULTS.learningRate,
    beta1: OPTIMIZER_DEFAULTS.beta1,
    beta2: OPTIMIZER_DEFAULTS.beta2,
    epsilon: OPTIMIZER_DEFAULTS.epsilon,
    batchSize: OPTIMIZER_DEFAULTS.batchSize,
    steps: OPTIMIZER_DEFAULTS.steps,
  });
  const byOptimizer = Object.fromEntries(result.tuned.map((item) => [item.optimizer, item]));
  assert.equal(byOptimizer.adam.learningRate, 0.18);
  assert.equal(byOptimizer.momentum.learningRate, 0.16);
  assert.equal(byOptimizer.sgd.learningRate, 0.4);
});

test('invalid optimizer settings fail explicitly', () => {
  assert.throws(() => simulate({ optimizer: 'magic', learningRate: 0.1, batchSize: 8, steps: 2 }), RangeError);
  assert.throws(() => simulate({ optimizer: 'sgd', learningRate: 0, batchSize: 8, steps: 2 }), RangeError);
  assert.throws(() => simulate({ optimizer: 'adam', learningRate: 0.1, beta1: 1, beta2: 0.9, epsilon: 1e-8, batchSize: 8, steps: 2 }), RangeError);
  assert.throws(() => gradientNoiseScale(0), RangeError);
  assert.throws(() => adamStep({ gradient: [1], learningRate: 0.1, beta1: 0.9, beta2: 0.999, epsilon: 1e-8, step: 1 }), TypeError);
});
