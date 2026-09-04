import test from 'node:test';
import assert from 'node:assert/strict';
import { buildConditionalLab, buildJointTable, conditionalMetrics, expectedCounts } from './conditionalModel.js';
import { DEFAULT_SCENARIO } from './conditionalConfig.js';

const close = (actual, expected, tolerance = 1e-12) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

test('joint table sums to one', () => {
  const table = buildJointTable(DEFAULT_SCENARIO);
  close(table.both + table.conditionOnly + table.eventOnly + table.neither, 1);
});

test('conditionals recover configured probabilities', () => {
  const metrics = conditionalMetrics(DEFAULT_SCENARIO);
  close(metrics.eventGivenCondition, DEFAULT_SCENARIO.eventGivenCondition);
  close(metrics.eventGivenNotCondition, DEFAULT_SCENARIO.eventGivenNotCondition);
});

test('law of total probability reconstructs event prevalence', () => {
  const metrics = conditionalMetrics(DEFAULT_SCENARIO);
  close(metrics.totalProbabilityReconstruction, metrics.eventRate);
});

test('Bayes rule reconstructs reverse conditional', () => {
  const metrics = conditionalMetrics(DEFAULT_SCENARIO);
  close(metrics.bayesReconstruction, metrics.conditionGivenEvent);
});

test('equal conditional rates imply independence', () => {
  const metrics = conditionalMetrics({
    ...DEFAULT_SCENARIO,
    eventGivenCondition: 0.4,
    eventGivenNotCondition: 0.4,
  });
  assert.equal(metrics.independent, true);
  close(metrics.both, metrics.eventRate * metrics.conditionRate);
});

test('P(A|B) and P(B|A) are generally different', () => {
  const metrics = conditionalMetrics(DEFAULT_SCENARIO);
  assert.ok(Math.abs(metrics.eventGivenCondition - metrics.conditionGivenEvent) > 0.05);
});

test('a rarer condition lowers P(B|A) when conditional rates stay fixed', () => {
  const common = conditionalMetrics({
    ...DEFAULT_SCENARIO,
    conditionRate: 0.5,
    eventGivenCondition: 0.9,
    eventGivenNotCondition: 0.1,
  });
  const rare = conditionalMetrics({
    ...DEFAULT_SCENARIO,
    conditionRate: 0.05,
    eventGivenCondition: 0.9,
    eventGivenNotCondition: 0.1,
  });
  assert.ok(rare.conditionGivenEvent < common.conditionGivenEvent);
});

test('expected count table preserves the requested population', () => {
  const counts = expectedCounts(DEFAULT_SCENARIO);
  close(counts.both + counts.conditionOnly + counts.eventOnly + counts.neither, DEFAULT_SCENARIO.population, 1e-9);
});

test('build lab reports association magnitude from conditional contrast', () => {
  const lab = buildConditionalLab(DEFAULT_SCENARIO);
  close(lab.associationStrength, Math.abs(DEFAULT_SCENARIO.eventGivenCondition - DEFAULT_SCENARIO.eventGivenNotCondition));
});
