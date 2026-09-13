import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildClusteredSamplingLab,
  designEffect,
  effectiveSampleSize,
} from './clusteredSamplingModel.js';

test('independent rows have design effect one', () => {
  assert.equal(designEffect(20, 0), 1);
  assert.equal(effectiveSampleSize(50, 20, 0), 1000);
});

test('positive intraclass correlation reduces effective sample size', () => {
  const effect = designEffect(20, 0.1);
  assert.ok(Math.abs(effect - 2.9) < 1e-12);
  assert.ok(effectiveSampleSize(50, 20, 0.1) < 350);
});

test('cluster-aware uncertainty is wider than naive row-level uncertainty', () => {
  const lab = buildClusteredSamplingLab({
    eventRate: 0.25,
    clusterCount: 50,
    observationsPerCluster: 20,
    intraclassCorrelation: 0.1,
    confidenceZ: 1.96,
  });

  assert.ok(lab.clusterAwareSe > lab.naiveSe);
  assert.ok(lab.clusterAwareInterval.width > lab.naiveInterval.width);
  assert.ok(Math.abs(lab.standardErrorInflation - Math.sqrt(lab.designEffect)) < 1e-12);
});

test('one observation per cluster removes the clustering penalty', () => {
  const lab = buildClusteredSamplingLab({
    eventRate: 0.4,
    clusterCount: 80,
    observationsPerCluster: 1,
    intraclassCorrelation: 0.5,
    confidenceZ: 1.96,
  });

  assert.equal(lab.designEffect, 1);
  assert.equal(lab.effectiveSampleSize, 80);
  assert.equal(lab.naiveSe, lab.clusterAwareSe);
});
