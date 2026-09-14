import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNonCollapsibilityLab } from './nonCollapsibilityModel.js';

const base = {
  lowBaseline: 0.10,
  highBaseline: 0.60,
  commonOddsRatio: 2,
  highRiskShare: 0.50,
};

test('balanced randomization keeps risk composition identical across treatment arms', () => {
  const lab = buildNonCollapsibilityLab(base);
  assert.equal(lab.metrics.treatedHighRiskShare, lab.metrics.controlHighRiskShare);
  assert.equal(lab.metrics.noConfounding, true);
});

test('common conditional odds ratio is preserved within each stratum', () => {
  const lab = buildNonCollapsibilityLab(base);
  assert.ok(Math.abs(lab.strata.low.oddsRatio - 2) < 1e-12);
  assert.ok(Math.abs(lab.strata.high.oddsRatio - 2) < 1e-12);
});

test('marginal odds ratio can differ without confounding', () => {
  const lab = buildNonCollapsibilityLab(base);
  assert.ok(Math.abs(lab.metrics.marginalOddsRatio - lab.metrics.conditionalOddsRatio) > 0.1);
});

test('with no baseline heterogeneity the marginal and conditional odds ratios coincide', () => {
  const lab = buildNonCollapsibilityLab({ ...base, highBaseline: base.lowBaseline });
  assert.ok(Math.abs(lab.metrics.marginalOddsRatio - lab.metrics.conditionalOddsRatio) < 1e-12);
});
