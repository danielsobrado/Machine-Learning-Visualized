import assert from 'node:assert/strict';
import test from 'node:test';

import { Q_LEARNING_TRAINING_DEFAULTS } from './qLearningTrainingConfig.js';
import {
  compareTdControl,
  epsilonGreedyAction,
  simulateTdControl,
  transition,
} from './qLearningTrainingModel.js';

test('cliff transition resets the agent to start without ending the episode', () => {
  const outcome = transition([3, 0], 1);
  assert.deepEqual(outcome.nextPosition, [3, 0]);
  assert.equal(outcome.reward, -100);
  assert.equal(outcome.hitCliff, true);
  assert.equal(outcome.terminal, false);
});

test('goal transition terminates the episode', () => {
  const outcome = transition([2, 5], 2);
  assert.deepEqual(outcome.nextPosition, [3, 5]);
  assert.equal(outcome.reward, 0);
  assert.equal(outcome.hitCliff, false);
  assert.equal(outcome.terminal, true);
});

test('epsilon greedy is deterministic when epsilon is zero', () => {
  const random = () => 0.99;
  assert.equal(epsilonGreedyAction([1, 4, 2, 3], 0, random), 1);
});

test('seeded training is reproducible', () => {
  const config = { ...Q_LEARNING_TRAINING_DEFAULTS, episodes: 20, seed: 91 };
  const first = simulateTdControl({ algorithm: 'q-learning', config });
  const second = simulateTdControl({ algorithm: 'q-learning', config });
  assert.deepEqual(first.episodes, second.episodes);
  assert.deepEqual(first.table, second.table);
  assert.deepEqual(first.transitions, second.transitions);
});

test('Q-learning records greedy bootstrap actions while SARSA records behavior bootstrap actions', () => {
  const config = {
    ...Q_LEARNING_TRAINING_DEFAULTS,
    episodes: 80,
    epsilon: 0.35,
    seed: 7,
  };
  const comparison = compareTdControl(config);
  const qOffPolicyStep = comparison.qLearning.transitions.find((step) => (
    !step.terminal
    && step.nextBehaviorActionIndex !== step.bootstrapActionIndex
  ));
  assert.ok(qOffPolicyStep, 'expected at least one exploratory Q-learning transition');

  const invalidSarsaStep = comparison.sarsa.transitions.find((step) => (
    !step.terminal
    && step.nextBehaviorActionIndex !== step.bootstrapActionIndex
  ));
  assert.equal(invalidSarsaStep, undefined);
});

test('comparison returns finite learning summaries for both algorithms', () => {
  const config = { ...Q_LEARNING_TRAINING_DEFAULTS, episodes: 30 };
  const comparison = compareTdControl(config);
  for (const result of [comparison.qLearning, comparison.sarsa]) {
    assert.equal(result.episodes.length, 30);
    assert.ok(result.transitions.length > 0);
    assert.ok(Number.isFinite(result.summary.recentAverageReturn));
    assert.ok(Number.isFinite(result.summary.recentAverageSteps));
    assert.ok(Number.isFinite(result.summary.successRate));
  }
});
