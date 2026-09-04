import test from 'node:test';
import assert from 'node:assert/strict';
import {
  binomialPmf,
  buildDistributionLab,
  distributionMoments,
  exponentialCdf,
  intervalProbability,
  normalCdf,
  poissonPmf,
  simulateDistribution,
} from './distributionModel.js';
import { DEFAULT_SCENARIO } from './distributionConfig.js';

const close = (actual, expected, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

test('binomial PMF normalizes', () => {
  const total = Array.from({ length: 13 }, (_, k) => binomialPmf(k, 12, 0.35)).reduce((a, b) => a + b, 0);
  close(total, 1, 1e-12);
});

test('poisson PMF captures essentially all mass over a wide support', () => {
  const total = Array.from({ length: 35 }, (_, k) => poissonPmf(k, 3)).reduce((a, b) => a + b, 0);
  close(total, 1, 1e-10);
});

test('normal one-sigma interval has the expected probability', () => {
  const probability = normalCdf(1) - normalCdf(-1);
  close(probability, 0.682689, 2e-5);
});

test('exponential CDF matches the analytic identity', () => {
  close(exponentialCdf(1, 2), 1 - Math.exp(-2), 1e-12);
});

test('distribution moments match closed forms', () => {
  assert.deepEqual(distributionMoments({ ...DEFAULT_SCENARIO, family: 'poisson', poissonRate: 4 }), { mean: 4, variance: 4 });
  assert.deepEqual(distributionMoments({ ...DEFAULT_SCENARIO, family: 'normal', mean: 2, sigma: 3 }), { mean: 2, variance: 9 });
});

test('reversed interval bounds produce the same probability', () => {
  const a = intervalProbability({ ...DEFAULT_SCENARIO, family: 'normal', lower: -1, upper: 2 });
  const b = intervalProbability({ ...DEFAULT_SCENARIO, family: 'normal', lower: 2, upper: -1 });
  close(a, b, 1e-12);
});

test('continuous density can exceed one without becoming a probability', () => {
  const lab = buildDistributionLab({ ...DEFAULT_SCENARIO, family: 'normal', sigma: 0.25, lower: -0.1, upper: 0.1 });
  assert.ok(lab.densityReference > 1);
  assert.ok(lab.analyticProbability <= 1);
});

test('simulation is deterministic and tracks the analytic mean', () => {
  const scenario = { ...DEFAULT_SCENARIO, family: 'binomial', sampleSize: 3000, seed: 91 };
  const first = simulateDistribution(scenario);
  const second = simulateDistribution(scenario);
  assert.deepEqual(first.values.slice(0, 20), second.values.slice(0, 20));
  close(first.mean, scenario.trials * scenario.probability, 0.12);
});
