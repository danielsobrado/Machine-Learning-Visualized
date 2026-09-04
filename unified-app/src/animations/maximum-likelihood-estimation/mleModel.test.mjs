import assert from 'node:assert/strict';
import test from 'node:test';
import { bernoulliLogLikelihood, buildBernoulliLab, buildGaussianLab, gaussianLogLikelihood, gaussianMle } from './mleModel.js';

const bernoulli = { successes: 6, failures: 4 };
const gaussian = { values: [4.7, 5.0, 5.2, 4.9, 5.1, 5.4] };

test('Bernoulli MLE is the observed success proportion', () => {
  const lab = buildBernoulliLab(bernoulli, 0.4);
  assert.equal(lab.metrics.mle, 0.6);
  assert.ok(bernoulliLogLikelihood(0.6, 6, 4) > bernoulliLogLikelihood(0.4, 6, 4));
});

test('Bernoulli score is zero at the interior MLE', () => {
  const lab = buildBernoulliLab(bernoulli, 0.6);
  assert.ok(Math.abs(lab.metrics.score) < 1e-10);
  assert.ok(Math.abs(lab.metrics.relativeLikelihood - 1) < 1e-12);
});

test('same Bernoulli MLE with more data produces more information and lower SE', () => {
  const small = buildBernoulliLab({ successes: 6, failures: 4 }, 0.55);
  const large = buildBernoulliLab({ successes: 60, failures: 40 }, 0.55);
  assert.equal(small.metrics.mle, large.metrics.mle);
  assert.ok(large.metrics.informationAtMle > small.metrics.informationAtMle);
  assert.ok(large.metrics.asymptoticSe < small.metrics.asymptoticSe);
  assert.ok(large.metrics.relativeLikelihood < small.metrics.relativeLikelihood);
});

test('Gaussian MLE jointly estimates mean and variance with denominator n', () => {
  const mle = gaussianMle(gaussian.values);
  const expectedMean = gaussian.values.reduce((sum, value) => sum + value, 0) / gaussian.values.length;
  assert.ok(Math.abs(mle.mu - expectedMean) < 1e-12);
  assert.ok(mle.unbiasedVariance > mle.variance);
  assert.ok(Math.abs(mle.unbiasedVariance / mle.variance - gaussian.values.length / (gaussian.values.length - 1)) < 1e-12);
});

test('Gaussian joint MLE beats nearby candidate parameters', () => {
  const mle = gaussianMle(gaussian.values);
  const atMle = gaussianLogLikelihood(mle.mu, mle.sigma, gaussian.values);
  assert.ok(atMle > gaussianLogLikelihood(mle.mu + 0.4, mle.sigma, gaussian.values));
  assert.ok(atMle > gaussianLogLikelihood(mle.mu, mle.sigma * 1.5, gaussian.values));
});

test('Gaussian scores are zero at the joint MLE', () => {
  const mle = gaussianMle(gaussian.values);
  const lab = buildGaussianLab(gaussian, mle.mu, mle.sigma);
  assert.ok(Math.abs(lab.metrics.scoreMu) < 1e-9);
  assert.ok(Math.abs(lab.metrics.scoreSigma) < 1e-9);
  assert.ok(Math.abs(lab.metrics.relativeLikelihood - 1) < 1e-12);
});

test('Gaussian likelihood surface remains finite and bounded', () => {
  const lab = buildGaussianLab(gaussian, 5.4, 0.7);
  assert.ok(lab.surface.cells.length > 100);
  for (const cell of lab.surface.cells) {
    assert.ok(Number.isFinite(cell.relative));
    assert.ok(cell.relative >= 0 && cell.relative <= 1);
  }
});
