import assert from 'node:assert/strict';
import test from 'node:test';
import { buildHypothesisLab, inverseNormalCdf, normalCdf, powerForEffect, twoSidedPValue } from './hypothesisModel.js';

const base = { observedEffect: 4, designEffect: 5, noiseSd: 18, sampleSize: 180, alpha: 5, meaningfulThreshold: 5 };

test('inverse normal is continuous and accurate around common confidence levels', () => {
  assert.ok(Math.abs(inverseNormalCdf(0.975) - 1.95996) < 0.001);
  assert.notEqual(inverseNormalCdf(0.975), inverseNormalCdf(0.98));
  assert.ok(Math.abs(normalCdf(inverseNormalCdf(0.93)) - 0.93) < 1e-4);
});

test('two-sided p-value matches the standard normal definition', () => {
  assert.ok(Math.abs(twoSidedPValue(1.95996) - 0.05) < 0.001);
  assert.equal(twoSidedPValue(0), 1);
});

test('significance and the confidence interval agree', () => {
  const lab = buildHypothesisLab({ ...base, observedEffect: 6 });
  const excludesZero = lab.metrics.confidenceInterval[0] > 0 || lab.metrics.confidenceInterval[1] < 0;
  assert.equal(lab.metrics.statisticallySignificant, excludesZero);
});

test('design power is based on the declared design effect, not the observed estimate', () => {
  const a = buildHypothesisLab({ ...base, observedEffect: 1 });
  const b = buildHypothesisLab({ ...base, observedEffect: 12 });
  assert.equal(a.metrics.designPower, b.metrics.designPower);
  assert.notEqual(a.metrics.pValue, b.metrics.pValue);
});

test('power increases with sample size and effect magnitude', () => {
  const small = powerForEffect({ effect: 3, standardError: 2, alpha: 5 });
  const largeEffect = powerForEffect({ effect: 6, standardError: 2, alpha: 5 });
  const lowerSe = powerForEffect({ effect: 3, standardError: 1, alpha: 5 });
  assert.ok(largeEffect > small);
  assert.ok(lowerSe > small);
});

test('practical significance remains separate from statistical significance', () => {
  const lab = buildHypothesisLab({ ...base, observedEffect: 2, noiseSd: 8, sampleSize: 1200, meaningfulThreshold: 5 });
  assert.equal(lab.metrics.statisticallySignificant, true);
  assert.equal(lab.metrics.practicallyMeaningful, false);
});
