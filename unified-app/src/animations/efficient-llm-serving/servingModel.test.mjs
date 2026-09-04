import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildServingLab,
  contiguousReservation,
  expectedAcceptedDraftPrefix,
  kvBytesPerToken,
  pagedAllocation,
  prefixCacheTokenSavings,
  simulateContinuousBatching,
  simulateStaticBatching,
} from './servingModel.js';
import { MODEL_PRESETS, SERVING_REQUESTS } from './servingConfig.js';

test('KV bytes per token follows K and V across every layer/head', () => {
  assert.equal(kvBytesPerToken({ layers: 32, kvHeads: 8, headDim: 128, bytesPerElement: 2 }), 131072);
});

test('paged allocation wastes at most blockSize - 1 tokens per request', () => {
  const allocation = pagedAllocation(33, 16);
  assert.deepEqual(allocation, { blocks: 3, allocatedTokens: 48, wastedTokens: 15 });
});

test('contiguous reservation exposes large unused maximum-sequence capacity', () => {
  assert.deepEqual(contiguousReservation(1000, 4096), { allocatedTokens: 4096, wastedTokens: 3096 });
});

test('prefix caching stores a shared prefix once', () => {
  const result = prefixCacheTokenSavings([
    { promptTokens: 1000, sharedPrefixTokens: 800 },
    { promptTokens: 1200, sharedPrefixTokens: 800 },
    { promptTokens: 900, sharedPrefixTokens: 800 },
  ]);
  assert.equal(result.savedTokens, 1600);
});

test('continuous batching removes sequence-slot padding waste', () => {
  const staticBatch = simulateStaticBatching(SERVING_REQUESTS, 3);
  const continuous = simulateContinuousBatching(SERVING_REQUESTS, 3);
  assert.ok(staticBatch.wastedSlots > 0);
  assert.equal(continuous.wastedSlots, 0);
  assert.equal(staticBatch.usefulSlots, continuous.usefulSlots);
});

test('continuous batching can finish queued mixed-length work sooner', () => {
  const staticBatch = simulateStaticBatching(SERVING_REQUESTS, 3);
  const continuous = simulateContinuousBatching(SERVING_REQUESTS, 3);
  assert.ok(continuous.makespan <= staticBatch.makespan);
});

test('expected accepted speculative prefix handles boundary probabilities', () => {
  assert.equal(expectedAcceptedDraftPrefix(6, 0), 0);
  assert.equal(expectedAcceptedDraftPrefix(6, 1), 6);
  assert.ok(Math.abs(expectedAcceptedDraftPrefix(2, 0.5) - 0.75) < 1e-12);
});

test('serving lab compares memory policies from exact token accounting', () => {
  const model = MODEL_PRESETS.find((item) => item.id === 'gqa-8b');
  const lab = buildServingLab({ model, blockSize: 16, maxSequenceTokens: 4096, maxBatchSize: 3, speculativeDraftLength: 6, speculativeAcceptance: 0.75, requests: SERVING_REQUESTS });
  assert.ok(lab.contiguousWasteTokens > lab.pagedWasteTokens);
  assert.ok(lab.prefix.savedTokens > 0);
  assert.ok(lab.expectedAcceptedDraftTokens > 0);
});
