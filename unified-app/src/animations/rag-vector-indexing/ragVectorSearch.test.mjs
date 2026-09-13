import assert from 'node:assert/strict';
import test from 'node:test';

import { runVectorSearchExperiment } from './ragVectorSearch.js';

test('exact aligned search recovers semantic ground truth', () => {
  const result = runVectorSearchExperiment({ method: 'exact', embeddingMode: 'aligned-v1' });
  assert.equal(result.recall, 1);
  assert.equal(result.results.length, 5);
});

test('reindexing both corpus and query preserves exact neighbors under the v2 rotation', () => {
  const result = runVectorSearchExperiment({ method: 'exact', embeddingMode: 'reindexed-v2' });
  assert.equal(result.recall, 1);
});

test('query-only embedding migration can break retrieval despite matching dimensions', () => {
  const result = runVectorSearchExperiment({ method: 'exact', embeddingMode: 'mismatch-v2-query' });
  assert.ok(result.recall < 1);
  assert.equal(result.embeddedQuery.length, 2);
});

test('IVF breadth increases work and does not reduce recall for the deterministic corpus', () => {
  const narrow = runVectorSearchExperiment({ method: 'ivf', breadth: 0 });
  const wide = runVectorSearchExperiment({ method: 'ivf', breadth: 1 });
  assert.ok(wide.distanceChecks > narrow.distanceChecks);
  assert.ok(wide.recall >= narrow.recall);
});

test('graph breadth increases work and can recover exact neighbors', () => {
  const narrow = runVectorSearchExperiment({ method: 'hnsw', breadth: 0 });
  const wide = runVectorSearchExperiment({ method: 'hnsw', breadth: 1 });
  assert.ok(wide.distanceChecks >= narrow.distanceChecks);
  assert.equal(wide.recall, 1);
});

test('metadata filtering changes the semantic target set', () => {
  const result = runVectorSearchExperiment({ method: 'exact', filterGroup: 'access' });
  assert.ok(result.truth.every((point) => point.group === 'access'));
  assert.ok(result.results.every((point) => point.group === 'access'));
});
