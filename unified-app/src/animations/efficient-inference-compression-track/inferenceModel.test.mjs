import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './inferenceConfig.js';
import { buildInferenceLab, kvMemoryGiB, performanceEstimate, weightMemoryGiB } from './inferenceModel.js';

test('lower weight precision reduces resident weight memory', () => {
  assert.ok(weightMemoryGiB(4) < weightMemoryGiB(8));
  assert.ok(weightMemoryGiB(8) < weightMemoryGiB(16));
});

test('KV cache grows with context length', () => {
  const short = kvMemoryGiB({ ...DEFAULT_SCENARIO, context: 2048 });
  const long = kvMemoryGiB({ ...DEFAULT_SCENARIO, context: 8192 });
  assert.ok(long > short);
});

test('KV cache grows with concurrent batch size', () => {
  const one = kvMemoryGiB({ ...DEFAULT_SCENARIO, batch: 1 });
  const many = kvMemoryGiB({ ...DEFAULT_SCENARIO, batch: 8 });
  assert.ok(many > one);
});

test('aggressive configuration can exceed compact VRAM', () => {
  const estimate = performanceEstimate({
    ...DEFAULT_SCENARIO,
    hardwareId: 'compact-16',
    weightBits: 16,
    kvBits: 16,
    context: 16384,
    batch: 16,
  });
  assert.equal(estimate.fits, false);
  assert.equal(estimate.aggregateTokensPerSecond, 0);
});

test('quantized weights improve memory-bound throughput in the teaching model', () => {
  const fp16 = performanceEstimate({ ...DEFAULT_SCENARIO, weightBits: 16, batch: 1, speculativeAcceptance: 0 });
  const int4 = performanceEstimate({ ...DEFAULT_SCENARIO, weightBits: 4, batch: 1, speculativeAcceptance: 0 });
  assert.ok(int4.aggregateTokensPerSecond > fp16.aggregateTokensPerSecond);
});

test('lab returns finite Pareto candidates that fit memory', () => {
  const lab = buildInferenceLab(DEFAULT_SCENARIO);
  assert.ok(lab.pareto.length > 0);
  lab.pareto.forEach((candidate) => {
    assert.equal(candidate.estimate.fits, true);
    assert.ok(Number.isFinite(candidate.estimate.aggregateTokensPerSecond));
  });
});
