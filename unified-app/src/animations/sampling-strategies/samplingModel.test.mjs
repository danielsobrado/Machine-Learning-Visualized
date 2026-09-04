import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyStrategy,
  applyTopK,
  applyTopP,
  beamSearchTwoStep,
  buildTokenDistribution,
  distributionEntropy,
  exhaustiveBestTwoStep,
  sampleRows,
  softmax,
} from './samplingModel.js';
import { BEAM_TREE, TOKEN_LOGITS } from './samplingConfig.js';

test('softmax sums to one and is invariant to a constant logit shift', () => {
  const a = softmax([1, 2, 3]);
  const b = softmax([101, 102, 103]);
  assert.ok(Math.abs(a.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  a.forEach((value, index) => assert.ok(Math.abs(value - b[index]) < 1e-12));
});

test('lower temperature sharpens the distribution', () => {
  const cold = softmax([3, 2, 1], 0.4);
  const hot = softmax([3, 2, 1], 1.5);
  assert.ok(cold[0] > hot[0]);
  assert.ok(distributionEntropy(cold) < distributionEntropy(hot));
});

test('top-k keeps exactly k candidates and renormalizes them', () => {
  const rows = buildTokenDistribution(TOKEN_LOGITS, 1);
  const kept = applyTopK(rows, 3);
  assert.equal(kept.length, 3);
  assert.ok(Math.abs(kept.reduce((sum, row) => sum + row.samplingProbability, 0) - 1) < 1e-12);
});

test('top-p keeps the smallest prefix that reaches the threshold', () => {
  const rows = [
    { token: 'a', probability: 0.5 },
    { token: 'b', probability: 0.3 },
    { token: 'c', probability: 0.2 },
  ];
  const kept = applyTopP(rows, 0.7);
  assert.deepEqual(kept.map((row) => row.token), ['a', 'b']);
  assert.ok(rows[0].probability < 0.7);
  assert.ok(rows[0].probability + rows[1].probability >= 0.7);
});

test('temperature strategy samples from the full vocabulary instead of applying top-k or top-p', () => {
  const rows = buildTokenDistribution(TOKEN_LOGITS, 0.8);
  const result = applyStrategy({ rows, strategyId: 'temperature', topK: 1, topP: 0.1, seed: 4 });
  assert.equal(result.eligible.length, TOKEN_LOGITS.length);
});

test('greedy always selects the highest-probability token', () => {
  const rows = buildTokenDistribution(TOKEN_LOGITS, 1);
  const result = applyStrategy({ rows, strategyId: 'greedy', topK: 2, topP: 0.5, seed: 99 });
  assert.equal(result.selected.token, rows[0].token);
  assert.equal(result.eligible.length, 1);
});

test('seeded sampling is deterministic and only selects eligible rows', () => {
  const rows = applyTopK(buildTokenDistribution(TOKEN_LOGITS, 1), 3);
  const first = sampleRows(rows, 123);
  const second = sampleRows(rows, 123);
  assert.deepEqual(first, second);
  assert.ok(rows.some((row) => row.token === first.token));
});

test('beam width one behaves greedily and can miss the globally best sequence', () => {
  const beam = beamSearchTwoStep(BEAM_TREE, 1)[0];
  const best = exhaustiveBestTwoStep(BEAM_TREE);
  assert.deepEqual(beam.tokens, [' A', '1']);
  assert.deepEqual(best.tokens, [' B', '1']);
  assert.ok(best.probability > beam.probability);
});

test('beam width two recovers the globally best two-step sequence in the counterexample', () => {
  const beam = beamSearchTwoStep(BEAM_TREE, 2)[0];
  const best = exhaustiveBestTwoStep(BEAM_TREE);
  assert.deepEqual(beam.tokens, best.tokens);
  assert.ok(Math.abs(beam.probability - best.probability) < 1e-12);
});
