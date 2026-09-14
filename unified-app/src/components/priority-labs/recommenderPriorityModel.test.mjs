import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMatrixFactorizationLab,
  buildNdcgLab,
  discountedCumulativeGain,
} from './recommenderPriorityModel.js';

test('matrix factorization prediction decomposes into biases and latent dot product', () => {
  const lab = buildMatrixFactorizationLab({
    userFactors: [0.9, 0.2],
    itemFactors: [0.8, -0.1],
    globalBias: 3.2,
    userBias: 0.15,
    itemBias: 0.05,
  });
  assert.ok(Math.abs(lab.latentScore - 0.7) < 1e-12);
  assert.ok(Math.abs(lab.prediction - 4.1) < 1e-12);
});

test('DCG rewards moving high relevance earlier', () => {
  const strongEarly = discountedCumulativeGain([3, 0, 2], 3);
  const strongLate = discountedCumulativeGain([0, 2, 3], 3);
  assert.ok(strongEarly > strongLate);
});

test('nDCG is one for the ideal ordering and lower for a worse ordering', () => {
  const ideal = buildNdcgLab({ relevances: [3, 2, 1, 0], topK: 4 });
  const worse = buildNdcgLab({ relevances: [0, 1, 2, 3], topK: 4 });
  assert.ok(Math.abs(ideal.ndcg - 1) < 1e-12);
  assert.ok(worse.ndcg < ideal.ndcg);
});
