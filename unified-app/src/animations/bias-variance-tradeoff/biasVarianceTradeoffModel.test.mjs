import assert from 'node:assert/strict';
import test from 'node:test';
import { RESAMPLING_SEEDS } from './biasVarianceResamplingConstants.js';
import {
  decompositionProfile,
  fitModel,
  fittedCurvePath,
  makePoints,
  meanResampledCurvePath,
  meanSquaredError,
  predictFitted,
  project,
  recommendationForProfile,
  resampledPrediction,
  resamplingProfile,
  truth,
  truthCurvePath,
} from './biasVarianceTradeoffModel.js';

function closeTo(actual, expected, tolerance = 1e-8) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

test('sample generation is deterministic per seed and changes across retraining samples', () => {
  const small = makePoints('small', 0.45, 11);
  const repeated = makePoints('small', 0.45, 11);
  const different = makePoints('small', 0.45, 23);

  assert.equal(small.length, 10);
  assert.equal(makePoints('medium', 0.45, 11).length, 22);
  assert.equal(makePoints('large', 0.45, 11).length, 42);
  assert.deepEqual(small, repeated);
  assert.notDeepEqual(small.map((point) => point.y), different.map((point) => point.y));
  assert.throws(() => makePoints('unknown', 0.4), RangeError);
  assert.throws(() => makePoints('small', -0.1), RangeError);
});

test('model choices fit genuinely different polynomial capacities', () => {
  const points = makePoints('medium', 0.45, 0);
  const simple = fitModel(points, 'simple');
  const balanced = fitModel(points, 'balanced');
  const flexible = fitModel(points, 'flexible');

  assert.equal(simple.degree, 1);
  assert.equal(simple.coefficients.length, 2);
  assert.equal(balanced.degree, 5);
  assert.equal(balanced.coefficients.length, 6);
  assert.equal(flexible.degree, 8);
  assert.equal(flexible.coefficients.length, 9);
  assert.ok(meanSquaredError(points, flexible) < meanSquaredError(points, simple));
  assert.throws(() => fitModel(points, 'unknown'), RangeError);
});

test('simple model is stable across retraining but systematically biased', () => {
  const profile = decompositionProfile('simple', 'medium', 0.45);

  assert.ok(profile.biasSquared > profile.variance * 100);
  assert.match(recommendationForProfile(profile), /Bias dominates/);
});

test('flexible model on scarce noisy data is variance-heavy', () => {
  const profile = decompositionProfile('flexible', 'small', 0.8);

  assert.ok(profile.variance > profile.biasSquared * 4);
  assert.match(recommendationForProfile(profile), /Variance dominates/);
});

test('larger samples reduce measured flexible-model variance', () => {
  const small = decompositionProfile('flexible', 'small', 0.7);
  const large = decompositionProfile('flexible', 'large', 0.7);

  assert.ok(small.variance > large.variance * 5);
});

test('irreducible noise is separate from model bias and variance', () => {
  const quiet = decompositionProfile('balanced', 'medium', 0);
  const noisy = decompositionProfile('balanced', 'medium', 0.9);

  closeTo(quiet.irreducibleVariance, 0);
  assert.ok(noisy.irreducibleVariance > quiet.irreducibleVariance);
  assert.equal(
    noisy.expectedSquaredError,
    noisy.biasSquared + noisy.variance + noisy.irreducibleVariance,
  );
});

test('zero outcome noise produces essentially identical retraining fits', () => {
  const profile = resamplingProfile('flexible', 'small', 0);

  assert.ok(profile.variance < 1e-12);
  assert.ok(profile.predictionStd < 1e-6);
});

test('retraining the same flexible specification on different noisy samples changes predictions', () => {
  const predictions = RESAMPLING_SEEDS.map((seed) => (
    resampledPrediction(58, 'flexible', 'small', 0.7, seed)
  ));

  assert.ok(Math.max(...predictions) - Math.min(...predictions) > 5);
  assert.equal(new Set(predictions.map((value) => value.toFixed(8))).size, RESAMPLING_SEEDS.length);
});

test('probe decomposition adds bias squared variance and irreducible noise exactly', () => {
  const profile = resamplingProfile('balanced', 'medium', 0.55);

  assert.equal(
    profile.expectedSquaredError,
    profile.biasSquared + profile.variance + profile.irreducibleVariance,
  );
  assert.equal(profile.predictions.length, RESAMPLING_SEEDS.length);
  assert.ok(profile.irreducibleVariance > 0);
});

test('fitted predictions and chart paths remain finite', () => {
  const fit = fitModel(makePoints('medium', 0.45, 0), 'balanced');
  const prediction = predictFitted(50, fit);
  const projected = project({ x: 50, y: prediction });
  const fittedPath = fittedCurvePath(fit);
  const truthPath = truthCurvePath();
  const meanPath = meanResampledCurvePath('balanced', 'medium', 0.4);

  assert.ok(Number.isFinite(prediction));
  assert.ok(Number.isFinite(projected.cx));
  assert.ok(Number.isFinite(projected.cy));
  assert.equal((fittedPath.match(/[ML]/g) || []).length, 70);
  assert.equal((truthPath.match(/[ML]/g) || []).length, 70);
  assert.equal((meanPath.match(/[ML]/g) || []).length, 70);
  assert.ok(!meanPath.includes('NaN'));
  assert.ok(Number.isFinite(truth(50)));
});

test('resampling helpers reject empty seed sets', () => {
  assert.throws(() => resamplingProfile('balanced', 'medium', 0.4, 58, []), RangeError);
  assert.throws(() => decompositionProfile('balanced', 'medium', 0.4, []), RangeError);
  assert.throws(() => meanResampledCurvePath('balanced', 'medium', 0.4, []), RangeError);
});
