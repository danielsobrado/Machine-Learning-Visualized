import assert from 'node:assert/strict';
import test from 'node:test';
import { bernoulliLikelihoodStability, boundaryMleExperiment } from './mleFailureModel.js';

test('all successes put the Bernoulli MLE on the p=1 boundary', () => {
  const result = boundaryMleExperiment({ successes: 20, failures: 0 });
  assert.equal(result.mle, 1);
  assert.equal(result.atBoundary, true);
  assert.equal(result.interiorScoreConditionApplies, false);
  assert.equal(result.direction, 'increase-p');
});

test('one failure moves the Bernoulli MLE into the interior', () => {
  const result = boundaryMleExperiment({ successes: 20, failures: 1 });
  assert.ok(result.mle < 1 && result.mle > 0);
  assert.equal(result.atBoundary, false);
  assert.equal(result.interiorScoreConditionApplies, true);
});

test('direct likelihood underflows while log-likelihood still ranks candidates', () => {
  const result = bernoulliLikelihoodStability({ successes: 1200, failures: 800, candidateA: 0.6, candidateB: 0.58 });
  assert.equal(result.bothDirectUnderflow, true);
  assert.equal(result.preferred, 'A');
  assert.ok(Number.isFinite(result.candidateA.logLikelihood));
  assert.ok(result.logLikelihoodGap > 0);
});

test('invalid counts and probabilities fail explicitly', () => {
  assert.throws(() => boundaryMleExperiment({ successes: 0, failures: 0 }), RangeError);
  assert.throws(() => bernoulliLikelihoodStability({ successes: 1, failures: 1, candidateA: 1, candidateB: 0.5 }), RangeError);
});
