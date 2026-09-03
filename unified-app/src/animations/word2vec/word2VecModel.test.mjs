import assert from 'node:assert/strict';
import test from 'node:test';

import { NEGATIVE_SAMPLING_COUNTS } from './word2VecConstants.js';
import {
  negativeSamplingExperiment,
  noiseDistribution,
  sampleNoise,
} from './word2VecModel.js';

function byToken(distribution) {
  return Object.fromEntries(distribution.map((item) => [item.token, item.probability]));
}

test('noise distribution probabilities sum to one', () => {
  const total = noiseDistribution(NEGATIVE_SAMPLING_COUNTS, 0.75)
    .reduce((sum, item) => sum + item.probability, 0);
  assert.ok(Math.abs(total - 1) < 1e-12);
});

test('exponent zero produces a uniform distribution over positive-count words', () => {
  const probabilities = byToken(noiseDistribution(NEGATIVE_SAMPLING_COUNTS, 0));
  Object.values(probabilities).forEach((probability) => assert.equal(probability, 0.25));
});

test('exponent one reproduces the raw unigram distribution', () => {
  const probabilities = byToken(noiseDistribution({ common: 9, rare: 1 }, 1));
  assert.equal(probabilities.common, 0.9);
  assert.equal(probabilities.rare, 0.1);
});

test('the 0.75 exponent flattens raw unigram frequency without becoming uniform', () => {
  const raw = byToken(noiseDistribution({ common: 1000, rare: 1 }, 1));
  const smoothed = byToken(noiseDistribution({ common: 1000, rare: 1 }, 0.75));
  assert.ok(smoothed.common < raw.common);
  assert.ok(smoothed.common > 0.5);
  assert.ok(smoothed.rare > raw.rare);
});

test('seeded noise sampling is deterministic', () => {
  const distribution = noiseDistribution(NEGATIVE_SAMPLING_COUNTS, 0.75);
  assert.deepEqual(sampleNoise(distribution, 12, 17), sampleNoise(distribution, 12, 17));
});

test('default experiment gives common words more noise mass than rare words', () => {
  const experiment = negativeSamplingExperiment();
  const probabilities = byToken(experiment.distribution);
  assert.ok(probabilities.the > probabilities.model);
  assert.ok(probabilities.model > probabilities.tensor);
  assert.ok(probabilities.tensor > probabilities.quokka);
});

test('invalid negative sampling inputs fail explicitly', () => {
  assert.throws(() => noiseDistribution({}, 0.75), RangeError);
  assert.throws(() => noiseDistribution({ a: -1 }, 0.75), RangeError);
  assert.throws(() => noiseDistribution({ a: 1 }, -0.1), RangeError);
  assert.throws(() => sampleNoise([], 2, 1), TypeError);
});
