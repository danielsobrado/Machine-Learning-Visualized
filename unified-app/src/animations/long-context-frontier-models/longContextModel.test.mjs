import assert from 'node:assert/strict';
import {
  buildLongContextLab,
  causalAttentionPairs,
  gqaKvReduction,
  kvCacheBytes,
  packedChunkCount,
  pairReductionRatio,
} from './longContextModel.js';
import { LONG_CONTEXT_ARCHITECTURES } from './longContextConfig.js';

assert.equal(kvCacheBytes({ tokens: 1, layers: 1, kvHeads: 1, headDim: 1, bytesPerElement: 2 }), 4);
assert.equal(kvCacheBytes({ tokens: 2, layers: 1, kvHeads: 1, headDim: 1, bytesPerElement: 2 }), 8);
assert.equal(causalAttentionPairs(1), 1);
assert.equal(causalAttentionPairs(3), 6);
assert.equal(gqaKvReduction(32, 8), 4);
assert.equal(gqaKvReduction(32, 4), 8);

assert.equal(packedChunkCount({
  contextWindowTokens: 8192,
  promptTokens: 1024,
  outputReserveTokens: 2048,
  chunkTokens: 1024,
  topK: 12,
}), 5);

const ratio = pairReductionRatio(1000, 100);
assert.ok(ratio > 0 && ratio < 0.02);

const architecture = LONG_CONTEXT_ARCHITECTURES.find((item) => item.id === 'gqa-8');
const lab = buildLongContextLab({
  architecture,
  contextTokens: 1000000,
  corpusTokens: 1000000,
  chunkTokens: 1024,
  topK: 12,
  promptTokens: 1024,
  outputReserveTokens: 2048,
});
assert.ok(Math.abs(lab.cacheGiB - 122.0703125) < 1e-9);
assert.equal(lab.kvReductionFactor, 4);
assert.equal(lab.fullCorpusFits, false);
assert.equal(lab.decodePairsPerNewTokenPerHead, 1000000);
assert.equal(lab.prefillCausalPairsPerHead, 500000500000);
assert.ok(lab.packedVsCorpusPairRatio < 0.001);

console.log('longContextModel: all tests passed');
