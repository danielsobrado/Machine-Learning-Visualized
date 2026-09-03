import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cosineSimilarity,
  dotProduct,
  euclideanDistance,
  l2Norm,
  metricTrapExperiment,
  scaleVector,
  scalingInvarianceExperiment,
} from './embeddingMetricsModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('cosine is invariant to positive vector scaling', () => {
  close(cosineSimilarity([1, 2], [10, 20]), 1);
});

test('positive scaling changes norm and Euclidean distance even when cosine stays one', () => {
  const result = scalingInvarianceExperiment([0.6, 0.8], 20);
  close(result.cosine, 1);
  close(result.originalNorm, 1);
  close(result.scaledNorm, 20);
  assert.ok(result.distance > 18);
});

test('cosine and Euclidean distance can rank candidates differently', () => {
  const result = metricTrapExperiment(100);
  assert.ok(result.collinearCosine > result.nearbyCosine);
  assert.ok(result.collinearDistance > result.nearbyDistance);
});

test('dot product is sensitive to vector magnitude', () => {
  assert.ok(dotProduct([1, 0], [100, 0]) > dotProduct([1, 0], [0.8, 0.2]));
});

test('Euclidean distance measures absolute geometric separation', () => {
  close(euclideanDistance([0, 0], [3, 4]), 5);
});

test('zero-vector cosine is undefined rather than semantically unrelated', () => {
  assert.throws(() => cosineSimilarity([0, 0], [1, 0]), RangeError);
});

test('vector helpers validate shapes and finite values', () => {
  assert.throws(() => dotProduct([1], [1, 2]), RangeError);
  assert.throws(() => l2Norm([]), TypeError);
  assert.throws(() => scaleVector([1], Number.NaN), TypeError);
});
