import assert from 'node:assert/strict';
import test from 'node:test';
import {
  averagePositionsFinalizedPerPass,
  buildDiffusionLab,
  corruptWithMasks,
  denoisingSchedule,
  expectedMaskedCount,
  generationPasses,
  maskedCrossEntropy,
  revealHighestConfidence,
} from './diffusionModel.js';
import { DIFFUSION_SAMPLE_TOKENS } from './diffusionConfig.js';

test('mask corruption handles exact endpoints', () => {
  const tokens = ['a', 'b', 'c'];
  assert.deepEqual(corruptWithMasks(tokens, 0, 1).corrupted, tokens);
  assert.deepEqual(corruptWithMasks(tokens, 1, 1).corrupted, ['[MASK]', '[MASK]', '[MASK]']);
});

test('mask corruption is deterministic for a seed', () => {
  assert.deepEqual(corruptWithMasks(DIFFUSION_SAMPLE_TOKENS, 0.5, 42), corruptWithMasks(DIFFUSION_SAMPLE_TOKENS, 0.5, 42));
});

test('expected masked count is n times mask probability', () => {
  assert.equal(expectedMaskedCount(100, 0.37), 37);
});

test('denoising schedule reveals every position exactly once', () => {
  const schedule = denoisingSchedule(17, 5);
  assert.equal(schedule.reduce((sum, row) => sum + row.reveal, 0), 17);
  assert.equal(schedule.at(-1).remaining, 0);
});

test('generation pass counts distinguish AR, full diffusion and block diffusion', () => {
  const args = { sequenceLength: 128, diffusionSteps: 16, blockSize: 32, blockSteps: 8 };
  assert.equal(generationPasses({ ...args, mode: 'autoregressive' }), 128);
  assert.equal(generationPasses({ ...args, mode: 'full-diffusion' }), 16);
  assert.equal(generationPasses({ ...args, mode: 'block-diffusion' }), 32);
});

test('parallelism metric is positions finalized per model pass, not claimed wall-clock speedup', () => {
  assert.equal(averagePositionsFinalizedPerPass(128, 16), 8);
});

test('masked cross entropy only averages selected masked positions', () => {
  const probs = [0.5, 0.25, 1];
  const expected = (-Math.log(0.5) - Math.log(0.25)) / 2;
  assert.ok(Math.abs(maskedCrossEntropy(probs, [0, 1]) - expected) < 1e-12);
  assert.equal(maskedCrossEntropy(probs, []), 0);
});

test('confidence reveal chooses highest-confidence masked positions', () => {
  assert.deepEqual(revealHighestConfidence([0, 2, 3], [0.2, 0.1, 0.9, 0.5], 2), [2, 3]);
});

test('lab accounting remains internally consistent', () => {
  const lab = buildDiffusionLab({ sequenceLength: 128, diffusionSteps: 16, blockSize: 32, blockSteps: 8, corruptionProbability: 0.5, seed: 7, sampleTokens: DIFFUSION_SAMPLE_TOKENS });
  assert.equal(lab.totalRevealed, 128);
  assert.equal(lab.passReductionVsAr, 8);
});
