import assert from 'node:assert/strict';
import test from 'node:test';
import {
  batchStats,
  compareBatchContexts,
  dropoutPasses,
  inferenceBatchNorm,
  invertedDropout,
  summarizePasses,
  theoreticalDropoutMoments,
  trainingBatchNorm,
  updateRunningState,
} from './dropoutBatchNormModel.js';

const ORDINARY = [3, 1, 2, 4];
const SHIFTED = [3, 6, 7, 8];
const RUNNING = { mean: 0, variance: 1 };

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('BatchNorm derives population statistics from the actual mini-batch', () => {
  const stats = batchStats(ORDINARY);
  close(stats.mean, 2.5);
  close(stats.variance, 1.25);
});

test('training BatchNorm uses the current mini-batch statistics', () => {
  const result = trainingBatchNorm(ORDINARY);
  close(result.selected.normalized, 0.5 / Math.sqrt(1.25 + 1e-5));
});

test('same selected activation changes when its training neighbors change', () => {
  const comparison = compareBatchContexts(ORDINARY, SHIFTED, RUNNING);
  assert.ok(comparison.trainingDelta > 1);
});

test('same selected activation is invariant to request neighbors during normal inference', () => {
  const comparison = compareBatchContexts(ORDINARY, SHIFTED, RUNNING);
  close(comparison.inferenceDelta, 0);
});

test('running state follows the explicitly displayed EMA update', () => {
  const next = updateRunningState(RUNNING, { mean: 4, variance: 9 }, 0.25);
  close(next.mean, 1);
  close(next.variance, 3);
});

test('singleton scalar feature has zero batch variance and collapses to beta after normalization', () => {
  const result = trainingBatchNorm([3], { gamma: 2, beta: -0.75 });
  close(result.stats.variance, 0);
  close(result.selected.normalized, 0);
  close(result.selected.output, -0.75);
});

test('inference uses frozen running state rather than current batch statistics', () => {
  const result = inferenceBatchNorm(3, { mean: 1, variance: 4 });
  close(result.normalized, 2 / Math.sqrt(4 + 1e-5));
});

test('inverted dropout masks dropped values and rescales kept values', () => {
  close(invertedDropout(2, 0.5, true), 4);
  close(invertedDropout(2, 0.5, false), 0);
});

test('theoretical inverted-dropout mean is preserved while variance is nonzero in training', () => {
  const moments = theoreticalDropoutMoments(2, 0.4);
  close(moments.mean, 2);
  close(moments.variance, 4 * 0.4 / 0.6);
  assert.ok(moments.std > 0);
});

test('sampled training dropout contains both masked and kept paths', () => {
  const summary = summarizePasses(dropoutPasses({
    value: 2,
    dropoutRate: 0.4,
    trainingMode: true,
    passes: 24,
    seed: 17,
  }));
  assert.ok(summary.keptCount > 0);
  assert.ok(summary.droppedCount > 0);
  assert.ok(summary.std > 0);
});

test('normal inference dropout is deterministic identity', () => {
  const passes = dropoutPasses({
    value: 2.75,
    dropoutRate: 0.8,
    trainingMode: false,
    passes: 12,
    seed: 17,
  });
  assert.ok(passes.every((pass) => pass.output === 2.75));
  close(summarizePasses(passes).std, 0);
});

test('invalid batch, running-state, update, and dropout inputs are rejected', () => {
  assert.throws(() => batchStats([]), RangeError);
  assert.throws(() => trainingBatchNorm([1, 2], { selectedIndex: 4 }), RangeError);
  assert.throws(() => updateRunningState(RUNNING, { mean: 1, variance: 1 }, 1.1), RangeError);
  assert.throws(() => inferenceBatchNorm(1, { mean: 0, variance: -1 }), RangeError);
  assert.throws(() => invertedDropout(1, 0.9, true), RangeError);
});
