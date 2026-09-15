import assert from 'node:assert/strict';
import test from 'node:test';
import { buildFlashAttentionStats } from './flashAttentionModel.js';

test('working set includes the output accumulator vectors', () => {
  const stats = buildFlashAttentionStats({
    sequenceLength: 4096,
    tileSize: 128,
    headDim: 128,
    dtype: 'fp16',
  });

  assert.equal(stats.outputAccumulatorElements, 16_384);
  assert.equal(stats.scoreTileElements, 16_384);
  assert.equal(stats.workingSetElements, 82_176);
  assert.equal(stats.workingSetBytes, 164_352);
});

test('full score storage remains quadratic while a score tile is bounded by tile size', () => {
  const small = buildFlashAttentionStats({
    sequenceLength: 2048,
    tileSize: 128,
    headDim: 128,
    dtype: 'fp16',
  });
  const large = buildFlashAttentionStats({
    sequenceLength: 4096,
    tileSize: 128,
    headDim: 128,
    dtype: 'fp16',
  });

  assert.equal(large.fullScoreBytes, small.fullScoreBytes * 4);
  assert.equal(large.scoreTileBytes, small.scoreTileBytes);
  assert.equal(large.workingSetBytes, small.workingSetBytes);
});

test('FlashAttention does not remove dense attention matmul arithmetic', () => {
  const stats = buildFlashAttentionStats({
    sequenceLength: 1024,
    tileSize: 64,
    headDim: 64,
    dtype: 'bf16',
  });

  assert.equal(stats.denseAttentionMatmulFlops, 134_217_728);
});
