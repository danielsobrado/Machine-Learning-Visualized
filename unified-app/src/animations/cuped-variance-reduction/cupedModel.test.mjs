import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './cupedConfig.js';
import { applyCuped, buildCupedLab, generateExperiment } from './cupedModel.js';

test('experiment generation is deterministic and balanced', () => {
  const first = generateExperiment(DEFAULT_SCENARIO, 42);
  const second = generateExperiment(DEFAULT_SCENARIO, 42);
  assert.deepEqual(first, second);
  assert.equal(first.filter((row) => row.treatment === 0).length, DEFAULT_SCENARIO.samplePerArm);
  assert.equal(first.filter((row) => row.treatment === 1).length, DEFAULT_SCENARIO.samplePerArm);
});

test('CUPED computes one pooled theta and finite adjusted outcomes', () => {
  const rows = generateExperiment(DEFAULT_SCENARIO);
  const adjusted = applyCuped(rows, 'pre');
  assert.ok(Number.isFinite(adjusted[0].theta));
  assert.ok(adjusted.every((row) => Number.isFinite(row.adjustedOutcome)));
  assert.ok(adjusted.every((row) => row.theta === adjusted[0].theta));
});

test('a strong pre-treatment covariate reduces standard error', () => {
  const weak = buildCupedLab({ ...DEFAULT_SCENARIO, preCorrelation: 0.05, covariateMode: 'pre' });
  const strong = buildCupedLab({ ...DEFAULT_SCENARIO, preCorrelation: 0.85, covariateMode: 'pre' });
  assert.ok(strong.adjusted.standardError < strong.raw.standardError * 0.65);
  assert.ok(strong.metrics.varianceReduction > weak.metrics.varianceReduction);
});

test('valid pre-treatment adjustment is unbiased across repeated randomizations', () => {
  const estimates = Array.from({ length: 80 }, (_, index) =>
    buildCupedLab(
      { ...DEFAULT_SCENARIO, samplePerArm: 600, preCorrelation: 0.75, covariateMode: 'pre' },
      1000 + index * 97,
    ).adjusted.estimate,
  );
  const average = estimates.reduce((sum, value) => sum + value, 0) / estimates.length;
  assert.ok(Math.abs(average - DEFAULT_SCENARIO.effect) < 0.025);
});

test('adjusting for a treatment-affected covariate can bias away the treatment effect', () => {
  const valid = buildCupedLab({ ...DEFAULT_SCENARIO, samplePerArm: 1800, covariateMode: 'pre' });
  const invalid = buildCupedLab({ ...DEFAULT_SCENARIO, samplePerArm: 1800, covariateMode: 'post', postTreatmentShift: 1.2 });
  assert.ok(Math.abs(invalid.metrics.biasFromTruthAdjusted) > Math.abs(valid.metrics.biasFromTruthAdjusted) + 0.08);
});
