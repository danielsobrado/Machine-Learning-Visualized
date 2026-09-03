import assert from 'node:assert/strict';
import test from 'node:test';

import { recoveryProbe, relu, reluDerivative, reluTrainingStep, simulateReluTraining } from './reluModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('ReLU forward and local derivative use the expected active and dead branches', () => {
  assert.equal(relu(-2), 0);
  assert.equal(relu(3), 3);
  assert.equal(reluDerivative(-2), 0);
  assert.equal(reluDerivative(3), 1);
});

test('an oversized first step can push an active neuron into the dead half-space', () => {
  const run = simulateReluTraining({ input: 1, target: 0.2, weight: 1, bias: 0, learningRate: 1, steps: 4 });
  assert.equal(run.history[0].dead, false);
  close(run.history[0].nextWeight, 0.2);
  close(run.history[0].nextBias, -0.8);
  assert.equal(run.history[1].dead, true);
  assert.equal(run.firstDeadStep, 2);
});

test('once dead for the repeated example, the neuron receives zero parameter gradients', () => {
  const run = simulateReluTraining({ input: 1, target: 0.2, weight: 1, bias: 0, learningRate: 1, steps: 4 });
  const deadSteps = run.history.slice(1);
  assert.ok(deadSteps.every((entry) => entry.weightGradient === 0 && entry.biasGradient === 0));
  assert.ok(deadSteps.every((entry) => entry.weight === 0.2 && entry.bias === -0.8));
});

test('a smaller learning rate keeps the same neuron active and continues reducing loss', () => {
  const run = simulateReluTraining({ input: 1, target: 0.2, weight: 1, bias: 0, learningRate: 0.2, steps: 4 });
  assert.equal(run.firstDeadStep, null);
  assert.ok(run.history.at(-1).loss < run.history[0].loss);
});

test('an external bias nudge can revive a dead ReLU even though its own gradient cannot', () => {
  const probe = recoveryProbe({ input: 1, target: 0.2, weight: 0.2, bias: -0.8, learningRate: 0.2, biasNudge: 1 });
  assert.equal(probe.before.dead, true);
  assert.equal(probe.before.biasGradient, 0);
  assert.equal(probe.revived, true);
  assert.equal(probe.after.localSlope, 1);
});

test('invalid inputs fail explicitly', () => {
  assert.throws(() => relu(Number.NaN), RangeError);
  assert.throws(() => reluTrainingStep({ input: 1, target: 0, weight: 1, bias: 0, learningRate: 0 }), RangeError);
  assert.throws(() => simulateReluTraining({ input: 1, target: 0, weight: 1, bias: 0, learningRate: 0.1, steps: 0 }), RangeError);
});
