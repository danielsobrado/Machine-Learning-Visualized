import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cosineSimilarity,
  dotProduct,
  euclideanDistance,
  normalizeVector,
  rankItems,
  scaleVector,
  vectorNorm,
} from './cosineModel.js';
import { SEARCH_ITEMS, SEARCH_QUERY } from './cosineConfig.js';

test('dot product and norm match basic geometry', () => {
  assert.equal(dotProduct([1, 2], [3, 4]), 11);
  assert.equal(vectorNorm([3, 4]), 5);
});

test('cosine is one for same direction and minus one for opposite direction', () => {
  assert.ok(Math.abs(cosineSimilarity([1, 2], [2, 4]) - 1) < 1e-12);
  assert.ok(Math.abs(cosineSimilarity([1, 2], [-2, -4]) + 1) < 1e-12);
});

test('cosine is zero for orthogonal non-zero vectors', () => {
  assert.ok(Math.abs(cosineSimilarity([1, 0], [0, 4])) < 1e-12);
});

test('cosine is undefined for a zero vector rather than falsely returning zero', () => {
  assert.equal(cosineSimilarity([0, 0], [1, 0]), null);
  assert.equal(normalizeVector([0, 0]), null);
});

test('positive magnitude scaling leaves cosine unchanged', () => {
  const a = [2, -1, 4];
  const b = [1, 3, 2];
  const baseline = cosineSimilarity(a, b);
  const scaled = cosineSimilarity(scaleVector(a, 7), scaleVector(b, 0.2));
  assert.ok(Math.abs(baseline - scaled) < 1e-12);
});

test('cosine equals dot product after L2 normalization', () => {
  const a = normalizeVector([2, 1, 3]);
  const b = normalizeVector([4, -2, 1]);
  assert.ok(Math.abs(cosineSimilarity(a, b) - dotProduct(a, b)) < 1e-12);
});

test('cosine is symmetric', () => {
  assert.equal(cosineSimilarity([2, 5], [-1, 4]), cosineSimilarity([-1, 4], [2, 5]));
});

test('cosine and Euclidean distance can rank the same vectors differently', () => {
  const cosine = rankItems(SEARCH_QUERY, SEARCH_ITEMS, 'cosine');
  const euclidean = rankItems(SEARCH_QUERY, SEARCH_ITEMS, 'euclidean');
  assert.equal(cosine[0].id, 'far-same');
  assert.equal(euclidean[0].id, 'near');
});

test('dot product is magnitude sensitive even when cosine is not', () => {
  const small = [2, 0];
  const large = [20, 0];
  assert.equal(cosineSimilarity([1, 0], small), cosineSimilarity([1, 0], large));
  assert.ok(dotProduct([1, 0], large) > dotProduct([1, 0], small));
  assert.ok(euclideanDistance([1, 0], large) > euclideanDistance([1, 0], small));
});
