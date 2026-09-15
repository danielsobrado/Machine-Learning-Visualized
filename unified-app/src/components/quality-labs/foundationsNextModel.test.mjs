import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GRADIENT_DESCENT_NEXT_DEFAULTS,
  IMBALANCE_LOSS_NEXT_DEFAULTS,
  MLE_NEXT_DEFAULTS,
  PROBABILITY_NEXT_DEFAULTS,
} from './foundationsNextConstants.js';
import {
  analyzeBernoulliPosterior,
  analyzeGaussianMixture,
  compareImbalanceLosses,
  compareOptimizationTrajectories,
  sweepPriorStrength,
} from './foundationsNextModel.js';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('momentum and diagonal preconditioning improve the same ill-conditioned valley for the default run', () => {
  const comparison = compareOptimizationTrajectories(GRADIENT_DESCENT_NEXT_DEFAULTS);
  const byMethod = Object.fromEntries(comparison.results.map((result) => [result.method, result]));

  closeTo(comparison.startLoss, 125);
  assert.ok(byMethod.momentum.final.loss < byMethod.gradient.final.loss);
  assert.ok(byMethod['diagonal-preconditioned'].final.loss < byMethod.momentum.final.loss);
  assert.ok(byMethod['diagonal-preconditioned'].lossReduction > 0.999);
});

test('moment-matched Gaussian preserves first two moments but misses the separated mixture modes', () => {
  const result = analyzeGaussianMixture(PROBABILITY_NEXT_DEFAULTS);

  closeTo(result.mixtureMean, 0);
  closeTo(result.mixtureVariance, 4.49);
  closeTo(result.matchedStandardDeviation, Math.sqrt(4.49));
  assert.ok(result.mixtureModeVsCenter > 0);
  assert.ok(result.gaussianModeVsCenter < 0);
  assert.ok(result.probes[0].mixtureDensity > result.probes[0].matchedGaussianDensity);
});

test('focal loss with gamma zero reduces to ordinary NLL', () => {
  const result = compareImbalanceLosses({ ...IMBALANCE_LOSS_NEXT_DEFAULTS, gamma: 0 });
  closeTo(result.focal.total, result.nll.total);
  closeTo(result.focal.minorityShare, result.nll.minorityShare);
});

test('class weighting and focal loss emphasize hard minority examples for different reasons', () => {
  const result = compareImbalanceLosses(IMBALANCE_LOSS_NEXT_DEFAULTS);

  assert.ok(result.weightedNll.minorityShare > result.nll.minorityShare);
  assert.ok(result.focal.minorityShare > result.nll.minorityShare);
  assert.ok(result.focal.total < result.nll.total);
});

test('posterior mean and MAP are distinct shrinkage summaries and both move toward the prior as strength grows', () => {
  const baseline = analyzeBernoulliPosterior(MLE_NEXT_DEFAULTS);
  const sweep = sweepPriorStrength(MLE_NEXT_DEFAULTS);
  const weakest = sweep[0];
  const strongest = sweep.at(-1);

  closeTo(baseline.mle, 0.7);
  closeTo(baseline.map, 0.625);
  closeTo(baseline.posteriorMean, 11 / 18);
  assert.notEqual(baseline.map, baseline.posteriorMean);
  assert.ok(Math.abs(strongest.map - MLE_NEXT_DEFAULTS.priorMean) < Math.abs(weakest.map - MLE_NEXT_DEFAULTS.priorMean));
  assert.ok(Math.abs(strongest.posteriorMean - MLE_NEXT_DEFAULTS.priorMean) < Math.abs(weakest.posteriorMean - MLE_NEXT_DEFAULTS.priorMean));
});
