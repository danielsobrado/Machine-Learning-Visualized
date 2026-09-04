import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildEntropyLab,
  crossEntropy,
  effectiveOutcomeCount,
  entropy,
  klDivergence,
  maxEntropy,
  normalizeWeights,
  selfInformation,
  simulateAverageSurprise,
} from './entropyModel.js';

test('normalizes arbitrary non-negative weights', () => {
  assert.deepEqual(normalizeWeights([2, 2, 4]), [0.25, 0.25, 0.5]);
});

test('self information matches canonical bit examples', () => {
  assert.equal(selfInformation(0.5), 1);
  assert.equal(selfInformation(0.125), 3);
  assert.equal(selfInformation(1), 0);
  assert.equal(selfInformation(0), Number.POSITIVE_INFINITY);
});

test('certain distribution has zero entropy', () => {
  assert.equal(entropy([1, 0, 0]), 0);
});

test('uniform distribution reaches log2(n) entropy', () => {
  const probabilities = Array.from({ length: 8 }, () => 1 / 8);
  assert.ok(Math.abs(entropy(probabilities) - 3) < 1e-12);
  assert.ok(Math.abs(maxEntropy(8) - 3) < 1e-12);
  assert.ok(Math.abs(effectiveOutcomeCount(probabilities) - 8) < 1e-10);
});

test('cross entropy decomposes into entropy plus KL divergence', () => {
  const p = [0.7, 0.2, 0.1];
  const q = [0.5, 0.3, 0.2];
  const ce = crossEntropy(p, q);
  const decomposition = entropy(p) + klDivergence(p, q);
  assert.ok(Math.abs(ce - decomposition) < 1e-12);
  assert.ok(klDivergence(p, q) >= 0);
});

test('KL divergence is zero only for a matched distribution in the exact case', () => {
  const p = [0.6, 0.3, 0.1];
  assert.ok(Math.abs(klDivergence(p, p)) < 1e-12);
});

test('prediction assigning zero probability to possible event gives infinite cross entropy', () => {
  assert.equal(crossEntropy([0.5, 0.5], [1, 0]), Number.POSITIVE_INFINITY);
});

test('simulation is deterministic for a fixed seed', () => {
  const first = simulateAverageSurprise([0.7, 0.2, 0.1], 500, 42);
  const second = simulateAverageSurprise([0.7, 0.2, 0.1], 500, 42);
  assert.deepEqual(first, second);
});

test('sample average surprise approaches analytic entropy', () => {
  const probabilities = [0.55, 0.25, 0.15, 0.05];
  const simulation = simulateAverageSurprise(probabilities, 50_000, 7);
  assert.ok(Math.abs(simulation.average - entropy(probabilities)) < 0.03);
});

test('lab preserves H(P,Q) = H(P) + KL(P||Q)', () => {
  const lab = buildEntropyLab({ weights: [7, 2, 1], modelTransform: 'softened', sampleSize: 100, seed: 1 });
  assert.ok(Math.abs(lab.decompositionResidual) < 1e-12);
  assert.ok(lab.entropy <= lab.maximum + 1e-12);
});
