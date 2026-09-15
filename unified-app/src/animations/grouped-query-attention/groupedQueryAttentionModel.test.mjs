import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildGroupedQueryStats,
  modeLabel,
  validKvHeadOptions,
} from './groupedQueryAttentionModel.js';

test('GQA cache size scales with KV heads rather than query heads', () => {
  const stats = buildGroupedQueryStats({
    queryHeads: 32,
    kvHeads: 8,
    sequenceLength: 4096,
    headDim: 128,
  });

  assert.equal(stats.groupSize, 4);
  assert.equal(stats.memoryRatio, 0.25);
  assert.equal(stats.savedPercent, 75);
  assert.equal(stats.kvCacheBytes, 16_777_216);
  assert.equal(stats.mhaCacheBytes, 67_108_864);
});

test('MQA and MHA are the endpoint cases of KV sharing', () => {
  assert.equal(modeLabel(16, 1), 'Multi-query attention');
  assert.equal(modeLabel(16, 16), 'Multi-head attention');
  assert.equal(modeLabel(16, 4), 'Grouped-query attention');
});

test('valid KV head options must divide query-head count', () => {
  assert.deepEqual(validKvHeadOptions(8), [1, 2, 4, 8]);
  assert.throws(
    () => buildGroupedQueryStats({ queryHeads: 16, kvHeads: 6, sequenceLength: 1024, headDim: 64 }),
    /must divide/,
  );
});
