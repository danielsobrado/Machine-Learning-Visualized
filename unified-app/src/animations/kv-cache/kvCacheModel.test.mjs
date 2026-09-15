import assert from 'node:assert/strict';
import test from 'node:test';
import {
  attentionFamily,
  formatBytes,
  kvCacheBytes,
  kvCacheMetrics,
  validKvHeadOptions,
} from './kvCacheModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('MHA GQA and MQA are determined by KV head sharing', () => {
  assert.equal(attentionFamily(16, 16), 'MHA');
  assert.equal(attentionFamily(16, 4), 'GQA');
  assert.equal(attentionFamily(16, 1), 'MQA');
  assert.deepEqual(validKvHeadOptions(8), [1, 2, 4, 8]);
});

test('KV cache bytes include K and V, layers, batch, token count, KV heads, head dimension and dtype', () => {
  assert.equal(kvCacheBytes({
    batchSize: 2,
    tokens: 1024,
    layers: 24,
    kvHeads: 8,
    headDim: 64,
    bytesPerElement: 2,
  }), 100663296);
  assert.equal(formatBytes(100663296), '96.0 MiB');
});

test('GQA reduces KV memory without reducing query-head attention score count', () => {
  const mha = kvCacheMetrics({
    contextLength: 8,
    decodeStep: 7,
    queryHeads: 16,
    kvHeads: 16,
    headDim: 64,
    layers: 24,
    batchSize: 2,
    bytesPerElement: 2,
    windowSize: 8,
    useCache: true,
  });
  const gqa = kvCacheMetrics({
    contextLength: 8,
    decodeStep: 7,
    queryHeads: 16,
    kvHeads: 4,
    headDim: 64,
    layers: 24,
    batchSize: 2,
    bytesPerElement: 2,
    windowSize: 8,
    useCache: true,
  });
  assert.equal(gqa.activeCacheBytes, mha.activeCacheBytes / 4);
  assert.equal(gqa.attentionScorePairs, mha.attentionScorePairs);
  assert.equal(gqa.queriesPerKvHead, 4);
});

test('sliding window reduces active cache bytes and attention reads', () => {
  const full = kvCacheMetrics({
    contextLength: 8,
    decodeStep: 7,
    queryHeads: 8,
    kvHeads: 8,
    headDim: 64,
    layers: 12,
    batchSize: 1,
    bytesPerElement: 2,
    windowSize: 8,
    useCache: true,
  });
  const windowed = kvCacheMetrics({
    contextLength: 8,
    decodeStep: 7,
    queryHeads: 8,
    kvHeads: 8,
    headDim: 64,
    layers: 12,
    batchSize: 1,
    bytesPerElement: 2,
    windowSize: 4,
    useCache: true,
  });
  assert.equal(windowed.activeCacheBytes, full.activeCacheBytes / 2);
  assert.equal(windowed.attentionScorePairs, full.attentionScorePairs / 2);
});

test('KV caching changes projection work but not attention over visible cached tokens', () => {
  const metrics = kvCacheMetrics({
    contextLength: 6,
    decodeStep: 4,
    queryHeads: 16,
    kvHeads: 4,
    headDim: 64,
    layers: 24,
    batchSize: 1,
    bytesPerElement: 2,
    windowSize: 6,
    useCache: true,
  });
  close(metrics.projectionSavings, 0.8);
  assert.equal(metrics.visibleCount, 5);
  assert.equal(metrics.attentionScorePairs, 80);
});

test('invalid grouped-query geometry fails explicitly', () => {
  assert.throws(() => attentionFamily(12, 5), RangeError);
  assert.throws(() => kvCacheMetrics({
    contextLength: 4,
    decodeStep: 1,
    queryHeads: 12,
    kvHeads: 5,
    headDim: 64,
    layers: 2,
    batchSize: 1,
    bytesPerElement: 2,
    windowSize: 4,
    useCache: true,
  }), RangeError);
});
