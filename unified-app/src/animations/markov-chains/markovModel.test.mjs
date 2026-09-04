import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildMarkovLab,
  distributionAfter,
  estimatedPeriod,
  isIrreducible,
  samplePath,
  stationaryResidual,
  stepDistribution,
  validateTransitionMatrix,
} from './markovModel.js';
import { MARKOV_PRESETS } from './markovConfig.js';

const preset = (id) => MARKOV_PRESETS.find((item) => item.id === id);

test('validates stochastic matrices and rejects broken rows', () => {
  assert.equal(validateTransitionMatrix(preset('weather').matrix), true);
  assert.throws(() => validateTransitionMatrix([[0.8, 0.3], [0.2, 0.8]]), /sum to one/);
});

test('one distribution step preserves total probability', () => {
  const next = stepDistribution([1, 0, 0], preset('weather').matrix);
  assert.ok(Math.abs(next.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  assert.deepEqual(next, [0.7, 0.2, 0.1]);
});

test('weather chain is irreducible and aperiodic', () => {
  assert.equal(isIrreducible(preset('weather').matrix), true);
  assert.equal(estimatedPeriod(preset('weather').matrix), 1);
});

test('periodic flip has period two', () => {
  assert.equal(isIrreducible(preset('periodic').matrix), true);
  assert.equal(estimatedPeriod(preset('periodic').matrix), 2);
  assert.deepEqual(distributionAfter([1, 0], preset('periodic').matrix, 6), [1, 0]);
  assert.deepEqual(distributionAfter([1, 0], preset('periodic').matrix, 7), [0, 1]);
});

test('absorbing chain is not irreducible and retains start dependence', () => {
  const matrix = preset('absorbing').matrix;
  assert.equal(isIrreducible(matrix), false);
  const fromStart = distributionAfter([1, 0, 0], matrix, 4);
  const fromWin = distributionAfter([0, 1, 0], matrix, 4);
  assert.deepEqual(fromStart, [0, 0.65, 0.35]);
  assert.deepEqual(fromWin, [0, 1, 0]);
});

test('weather stationary candidate matches the actual fixed point', () => {
  const lab = buildMarkovLab({ matrix: preset('weather').matrix, steps: 40, seed: 1 });
  assert.ok(lab.stationaryResidual < 1e-10);
  assert.ok(Math.abs(lab.stationaryCandidate[0] - 0.4565217391) < 1e-6);
  assert.ok(Math.abs(lab.stationaryCandidate[2] - 0.2608695652) < 1e-6);
});

test('stationary residual is zero for the periodic chain uniform distribution', () => {
  assert.ok(stationaryResidual([0.5, 0.5], preset('periodic').matrix) < 1e-12);
});

test('sample path is deterministic for a fixed seed and legal under transitions', () => {
  const matrix = preset('weather').matrix;
  const first = samplePath({ matrix, startState: 0, steps: 20, seed: 99 });
  const second = samplePath({ matrix, startState: 0, steps: 20, seed: 99 });
  assert.deepEqual(first, second);
  for (let index = 0; index < first.length - 1; index += 1) assert.ok(matrix[first[index]][first[index + 1]] > 0);
});
