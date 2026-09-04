import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './propensityConfig.js';
import { applyPropensityWeights, buildPropensityLab, generateObservationalRows } from './propensityModel.js';

test('observational simulation is deterministic', () => {
  assert.deepEqual(buildPropensityLab(DEFAULT_SCENARIO), buildPropensityLab(DEFAULT_SCENARIO));
});

test('estimated propensity scores and weights stay finite', () => {
  const rows = applyPropensityWeights(generateObservationalRows(DEFAULT_SCENARIO), DEFAULT_SCENARIO.weightCap);
  rows.forEach((row) => {
    assert.ok(row.estimatedPropensity > 0 && row.estimatedPropensity < 1);
    assert.ok(Number.isFinite(row.rawWeight) && row.rawWeight > 0);
    assert.ok(Number.isFinite(row.weight) && row.weight > 0);
  });
});

test('IPW strongly reduces observed covariate imbalance', () => {
  const lab = buildPropensityLab({ ...DEFAULT_SCENARIO, observedSelection: 1.6, hiddenConfounding: 0, weightCap: 30 });
  assert.ok(Math.abs(lab.metrics.afterObservedSmd) < Math.abs(lab.metrics.beforeObservedSmd) * 0.35);
});

test('with measured confounding and overlap IPW recovers the treatment effect', () => {
  const lab = buildPropensityLab({ ...DEFAULT_SCENARIO, populationSize: 3000, observedSelection: 0.9, hiddenConfounding: 0, weightCap: 20 });
  assert.ok(Math.abs(lab.metrics.weightedEstimate - lab.metrics.trueAte) < 0.8);
  assert.ok(Math.abs(lab.metrics.weightedBias) < Math.abs(lab.metrics.naiveBias));
});

test('poor overlap reduces effective sample size and creates larger weights', () => {
  const good = buildPropensityLab({ ...DEFAULT_SCENARIO, observedSelection: 0.6, hiddenConfounding: 0, weightCap: 30 });
  const poor = buildPropensityLab({ ...DEFAULT_SCENARIO, observedSelection: 2.6, hiddenConfounding: 0, weightCap: 30 });
  assert.ok(poor.metrics.overlapRate < good.metrics.overlapRate);
  assert.ok(poor.metrics.effectiveSampleSize < good.metrics.effectiveSampleSize);
  assert.ok(poor.metrics.maxRawWeight > good.metrics.maxRawWeight);
});

test('unobserved confounding can survive excellent observed balance', () => {
  const measured = buildPropensityLab({ ...DEFAULT_SCENARIO, populationSize: 3000, hiddenConfounding: 0, weightCap: 20 });
  const hidden = buildPropensityLab({ ...DEFAULT_SCENARIO, populationSize: 3000, hiddenConfounding: 1.4, weightCap: 20 });
  assert.ok(Math.abs(hidden.metrics.afterObservedSmd) < 0.1);
  assert.ok(Math.abs(hidden.metrics.afterHiddenSmd) > 0.25);
  assert.ok(Math.abs(hidden.metrics.weightedBias) > Math.abs(measured.metrics.weightedBias) + 1);
});
