import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCupedHeterogeneityLab } from './heterogeneityModel.js';
import { HETEROGENEITY_DEFAULTS } from './heterogeneityConstants.js';

test('interaction changes subgroup effects while preserving the balanced ATE', () => {
  const lab = buildCupedHeterogeneityLab({ ...HETEROGENEITY_DEFAULTS, averageEffect: 0.3, interaction: 0.6 });
  assert.equal(lab.effects.low, -0.3);
  assert.equal(lab.effects.high, 0.9);
  assert.ok(Math.abs(lab.effects.ate - 0.3) < 1e-12);
});

test('global CUPED adjustment improves precision without erasing heterogeneity', () => {
  const lab = buildCupedHeterogeneityLab(HETEROGENEITY_DEFAULTS);
  assert.ok(lab.metrics.adjustedSe < lab.metrics.rawSe);
  assert.ok(lab.metrics.varianceReduction > 0);
  assert.ok(lab.metrics.interactionGap > 0);
});

test('zero interaction collapses subgroup effects to the ATE', () => {
  const lab = buildCupedHeterogeneityLab({ ...HETEROGENEITY_DEFAULTS, interaction: 0 });
  assert.equal(lab.effects.low, lab.effects.ate);
  assert.equal(lab.effects.high, lab.effects.ate);
  assert.equal(lab.metrics.theta, HETEROGENEITY_DEFAULTS.baselineSlope);
  assert.equal(lab.metrics.heterogeneous, false);
});

test('opposite-sign subgroup effects are flagged even when the ATE is positive', () => {
  const lab = buildCupedHeterogeneityLab({ ...HETEROGENEITY_DEFAULTS, averageEffect: 0.2, interaction: 0.5 });
  assert.equal(lab.metrics.crossesZero, true);
  assert.ok(lab.effects.ate > 0);
});
