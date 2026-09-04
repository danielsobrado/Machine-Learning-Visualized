import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bernoulliNllFromLogit,
  gaussianNll,
  gaussianScaleMle,
  laplaceNll,
  laplaceScaleMle,
  negativeLogLikelihoodToRelativeLikelihood,
  regressionNll,
  regressionRows,
  sigmoid,
} from './lossModel.js';
import { REGRESSION_POINTS } from './lossConfig.js';

test('Gaussian NLL includes normalization and residual penalty', () => {
  const sigma = 2;
  const expected = 0.5 * Math.log(2 * Math.PI) + Math.log(sigma) + 9 / 8;
  assert.ok(Math.abs(gaussianNll(3, sigma) - expected) < 1e-12);
});

test('Laplace NLL includes scale normalization and absolute residual penalty', () => {
  const scale = 2;
  assert.ok(Math.abs(laplaceNll(-3, scale) - (Math.log(4) + 1.5)) < 1e-12);
});

test('Gaussian scale MLE is root mean squared residual', () => {
  assert.ok(Math.abs(gaussianScaleMle([3, 4]) - Math.sqrt(12.5)) < 1e-12);
});

test('Laplace scale MLE is mean absolute residual', () => {
  assert.equal(laplaceScaleMle([-1, 2, -3]), 2);
});

test('scale MLE minimizes Gaussian NLL over nearby scales', () => {
  const residuals = [0.2, -0.7, 1.1, -0.4];
  const mle = gaussianScaleMle(residuals);
  const nll = residuals.reduce((sum, r) => sum + gaussianNll(r, mle), 0);
  const small = residuals.reduce((sum, r) => sum + gaussianNll(r, mle * 0.7), 0);
  const large = residuals.reduce((sum, r) => sum + gaussianNll(r, mle * 1.4), 0);
  assert.ok(nll < small && nll < large);
});

test('stable Bernoulli NLL handles extreme logits', () => {
  assert.ok(bernoulliNllFromLogit(1, 1000) < 1e-10);
  assert.ok(Math.abs(bernoulliNllFromLogit(0, 1000) - 1000) < 1e-9);
  assert.ok(sigmoid(1000) <= 1 && sigmoid(-1000) >= 0);
});

test('Laplace model is less dominated by a large outlier than Gaussian at fixed scale', () => {
  const base = regressionRows(REGRESSION_POINTS, 0.9, 0.7, false);
  const outlier = regressionRows(REGRESSION_POINTS, 0.9, 0.7, true);
  const gaussianIncrease = regressionNll(outlier, 'gaussian', 0.7) - regressionNll(base, 'gaussian', 0.7);
  const laplaceIncrease = regressionNll(outlier, 'laplace', 0.7) - regressionNll(base, 'laplace', 0.7);
  assert.ok(gaussianIncrease > laplaceIncrease);
});

test('relative likelihood equals exp of NLL difference and never exceeds one', () => {
  assert.ok(Math.abs(negativeLogLikelihoodToRelativeLikelihood(12, 10) - Math.exp(-2)) < 1e-12);
  assert.equal(negativeLogLikelihoodToRelativeLikelihood(9, 10), 1);
});
