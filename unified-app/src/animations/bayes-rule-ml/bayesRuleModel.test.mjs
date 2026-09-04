import assert from 'node:assert/strict';
import test from 'node:test';

import {
  computeBayes,
  maxFalsePositiveForPosterior,
  populationCounts,
  posteriorAcrossPriors,
} from './bayesRuleModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('Bayes posterior matches the direct numerator-over-evidence calculation', () => {
  const result = computeBayes({ prior: 0.08, sensitivity: 0.86, falsePositive: 0.12 });
  close(result.posterior, (0.86 * 0.08) / ((0.86 * 0.08) + (0.12 * 0.92)));
});

test('posterior odds equal prior odds times the positive likelihood ratio', () => {
  const result = computeBayes({ prior: 0.2, sensitivity: 0.9, falsePositive: 0.1 });
  close(result.posteriorOdds, result.priorOdds * result.likelihoodRatioPositive);
});

test('exact false-positive boundary lands on the requested posterior threshold', () => {
  const threshold = 0.7;
  const falsePositive = maxFalsePositiveForPosterior({ prior: 0.08, sensitivity: 0.86, threshold });
  const result = computeBayes({ prior: 0.08, sensitivity: 0.86, falsePositive });
  close(result.posterior, threshold);
});

test('rates below the exact boundary meet the action threshold and rates above fail it', () => {
  const threshold = 0.7;
  const boundary = maxFalsePositiveForPosterior({ prior: 0.08, sensitivity: 0.86, threshold });
  assert.ok(computeBayes({ prior: 0.08, sensitivity: 0.86, falsePositive: boundary * 0.9 }).posterior > threshold);
  assert.ok(computeBayes({ prior: 0.08, sensitivity: 0.86, falsePositive: boundary * 1.1 }).posterior < threshold);
});

test('same test evidence produces different posteriors under prevalence shift', () => {
  const results = posteriorAcrossPriors({ priors: [0.01, 0.1, 0.5], sensitivity: 0.9, falsePositive: 0.1 });
  assert.ok(results[0].posterior < results[1].posterior);
  assert.ok(results[1].posterior < results[2].posterior);
  close(results[1].likelihoodRatioPositive, results[2].likelihoodRatioPositive);
});

test('population counts agree with probability-space posterior', () => {
  const result = populationCounts({ prior: 0.08, sensitivity: 0.86, falsePositive: 0.12, population: 1000 });
  close(result.posterior, result.truePositive / result.positiveTotal);
});

test('boundary caps at one only when the formula allows every false-positive rate', () => {
  close(maxFalsePositiveForPosterior({ prior: 0.4, sensitivity: 0.8, threshold: 0.3 }), 1);
});

test('a threshold below the prior can still constrain FPR when the signal is weak', () => {
  const boundary = maxFalsePositiveForPosterior({ prior: 0.4, sensitivity: 0.1, threshold: 0.3 });
  assert.ok(boundary < 1);
  close(computeBayes({ prior: 0.4, sensitivity: 0.1, falsePositive: boundary }).posterior, 0.3);
});

test('invalid probabilities fail explicitly', () => {
  assert.throws(() => computeBayes({ prior: -0.1, sensitivity: 0.8, falsePositive: 0.1 }), RangeError);
  assert.throws(() => maxFalsePositiveForPosterior({ prior: 0.1, sensitivity: 0.8, threshold: 0 }), RangeError);
  assert.throws(() => populationCounts({ prior: 0.1, sensitivity: 0.8, falsePositive: 0.1, population: 0 }), RangeError);
});
