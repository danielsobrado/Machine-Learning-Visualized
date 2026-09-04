import assert from 'node:assert/strict';
import test from 'node:test';
import { BANDIT_SCENARIOS, EXPLORATION_DEFAULTS } from './explorationConfig.js';
import { epsilonAt, epsilonGreedyProbabilities, simulateBandit, updateEstimate } from './explorationModel.js';

test('epsilon schedule interpolates and clamps at the end value', () => {
  assert.equal(epsilonAt(0, 0.4, 0.1, 100), 0.4);
  assert.ok(Math.abs(epsilonAt(50, 0.4, 0.1, 100) - 0.25) < 1e-12);
  assert.ok(Math.abs(epsilonAt(200, 0.4, 0.1, 100) - 0.1) < 1e-12);
});

test('epsilon-greedy probabilities sum to one', () => {
  const probabilities = epsilonGreedyProbabilities([3, 2, 1], 0.2);
  assert.ok(Math.abs(probabilities.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  assert.ok(probabilities[0] > probabilities[1]);
});

test('epsilon one is uniform random and epsilon zero is greedy', () => {
  assert.deepEqual(epsilonGreedyProbabilities([3, 2, 1], 1), [1 / 3, 1 / 3, 1 / 3]);
  assert.deepEqual(epsilonGreedyProbabilities([3, 2, 1], 0), [1, 0, 0]);
});

test('actual probability of a non-greedy action is epsilon times (k-1)/k for unique greedy action', () => {
  const probabilities = epsilonGreedyProbabilities([3, 2, 1, 0], 0.2);
  const nonGreedy = probabilities.slice(1).reduce((sum, value) => sum + value, 0);
  assert.ok(Math.abs(nonGreedy - 0.2 * 3 / 4) < 1e-12);
});

test('sample-average and constant step-size updates follow their definitions', () => {
  assert.equal(updateEstimate(0, 10, 2, 'sample-average', 0.1), 5);
  assert.equal(updateEstimate(0, 10, 2, 'constant', 0.1), 1);
});

test('bandit simulation is deterministic for a fixed seed', () => {
  const scenario = BANDIT_SCENARIOS[0];
  const args = { ...EXPLORATION_DEFAULTS, scenario, steps: 100 };
  assert.deepEqual(simulateBandit(args), simulateBandit(args));
});

test('stationary epsilon-greedy learns the best arm with the default seed', () => {
  const scenario = BANDIT_SCENARIOS.find((item) => item.id === 'stationary');
  const result = simulateBandit({ ...EXPLORATION_DEFAULTS, scenario, steps: 800, seed: 7 });
  assert.equal(result.learnedBestArm, 1);
  assert.ok(result.optimalActionRate > 0.6);
});

test('constant step size adapts better than sample average after a late nonstationary change in this deterministic lab', () => {
  const scenario = BANDIT_SCENARIOS.find((item) => item.id === 'nonstationary');
  const common = { ...EXPLORATION_DEFAULTS, scenario, steps: 600, epsilonStart: 0.15, epsilonEnd: 0.05, seed: 11 };
  const sampleAverage = simulateBandit({ ...common, stepSizeMode: 'sample-average' });
  const constant = simulateBandit({ ...common, stepSizeMode: 'constant', constantAlpha: 0.12 });
  assert.equal(constant.learnedBestArm, 2);
  assert.ok(constant.estimates[2] > sampleAverage.estimates[2]);
});
