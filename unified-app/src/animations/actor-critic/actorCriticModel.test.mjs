import assert from 'node:assert/strict';
import test from 'node:test';

import {
  actorCriticStep,
  policyScoreGradient,
  policySensitivityExperiment,
  sigmoid,
  tdTarget,
} from './actorCriticModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('sigmoid is stable and maps zero to one half', () => {
  close(sigmoid(0), 0.5);
  assert.ok(sigmoid(100) > 0.999999999);
  assert.ok(sigmoid(-100) < 1e-9);
});

test('Bernoulli policy score gradient is action minus probability', () => {
  const positive = policyScoreGradient({ policyLogit: 0, sampledAction: 1 });
  const negative = policyScoreGradient({ policyLogit: 0, sampledAction: 0 });
  close(positive.scoreGradient, 0.5);
  close(negative.scoreGradient, -0.5);
});

test('same positive advantage yields a smaller actor parameter step for an already likely action', () => {
  const [half, likely] = policySensitivityExperiment();
  close(half.probability, 0.5);
  close(likely.probability, 0.95);
  assert.ok(Math.abs(half.actorDelta) > Math.abs(likely.actorDelta) * 9.9);
});

test('negative advantage reverses the policy update direction', () => {
  const result = actorCriticStep({
    policyLogit: 0,
    sampledAction: 1,
    targetValue: 2,
    criticValue: 5,
    actorStep: 0.2,
    criticStep: 0.1,
  });
  assert.ok(result.actorDelta < 0);
  assert.ok(result.nextProbability < result.probability);
});

test('critic moves toward its target', () => {
  const result = actorCriticStep({
    policyLogit: 0,
    sampledAction: 1,
    targetValue: 8,
    criticValue: 4,
    actorStep: 0.2,
    criticStep: 0.25,
  });
  close(result.nextCritic, 5);
});

test('TD target bootstraps from next-state value unless terminal', () => {
  close(tdTarget({ reward: 2, gamma: 0.9, nextValue: 5 }), 6.5);
  close(tdTarget({ reward: 2, gamma: 0.9, nextValue: 5, terminal: true }), 2);
});

test('zero advantage produces no actor or critic update', () => {
  const result = actorCriticStep({
    policyLogit: 1,
    sampledAction: 1,
    targetValue: 3,
    criticValue: 3,
    actorStep: 0.2,
    criticStep: 0.2,
  });
  close(result.actorDelta, 0);
  close(result.criticDelta, 0);
});

test('invalid actor critic inputs fail explicitly', () => {
  assert.throws(() => policyScoreGradient({ policyLogit: 0, sampledAction: 2 }), RangeError);
  assert.throws(() => tdTarget({ reward: 1, gamma: 1.1, nextValue: 1 }), RangeError);
  assert.throws(() => actorCriticStep({ policyLogit: 0, sampledAction: 1, targetValue: 1, criticValue: 0, actorStep: 0, criticStep: 0.1 }), RangeError);
});
