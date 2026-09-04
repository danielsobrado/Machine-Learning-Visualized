import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './powerConfig.js';
import { achievedPower, buildPowerLab, inverseNormalCdf, normalCdf, requiredSampleSize } from './powerModel.js';

test('inverse normal CDF matches standard critical values continuously', () => {
  assert.ok(Math.abs(inverseNormalCdf(0.975) - 1.95996) < 0.001);
  assert.ok(Math.abs(inverseNormalCdf(0.95) - 1.64485) < 0.001);
  assert.ok(Math.abs(normalCdf(inverseNormalCdf(0.913)) - 0.913) < 1e-4);
});

test('power increases with sample size', () => {
  const small = achievedPower(DEFAULT_SCENARIO, 5000);
  const large = achievedPower(DEFAULT_SCENARIO, 30000);
  assert.ok(large > small);
});

test('power increases with effect size', () => {
  const small = achievedPower({ ...DEFAULT_SCENARIO, relativeLift: 3 });
  const large = achievedPower({ ...DEFAULT_SCENARIO, relativeLift: 12 });
  assert.ok(large > small);
});

test('stricter alpha requires more sample for the same target power', () => {
  const standard = requiredSampleSize({ ...DEFAULT_SCENARIO, alpha: 5 });
  const strict = requiredSampleSize({ ...DEFAULT_SCENARIO, alpha: 1 });
  assert.ok(strict > standard);
});

test('unbalanced allocation requires more total sample than 50/50 allocation', () => {
  const balanced = requiredSampleSize({ ...DEFAULT_SCENARIO, treatmentAllocation: 50 });
  const unbalanced = requiredSampleSize({ ...DEFAULT_SCENARIO, treatmentAllocation: 25 });
  assert.ok(unbalanced > balanced);
});

test('design effect inflates required sample approximately proportionally', () => {
  const base = requiredSampleSize({ ...DEFAULT_SCENARIO, designEffect: 1 });
  const doubled = requiredSampleSize({ ...DEFAULT_SCENARIO, designEffect: 2 });
  assert.ok(doubled / base > 1.95 && doubled / base < 2.05);
});

test('required sample reaches the requested power boundary', () => {
  const required = requiredSampleSize(DEFAULT_SCENARIO);
  const target = DEFAULT_SCENARIO.targetPower / 100;
  assert.ok(achievedPower(DEFAULT_SCENARIO, required) >= target);
  assert.ok(achievedPower(DEFAULT_SCENARIO, required - 1) < target);
});

test('lab outputs stay internally consistent', () => {
  const lab = buildPowerLab(DEFAULT_SCENARIO);
  assert.equal(lab.metrics.treatmentN + lab.metrics.controlN, DEFAULT_SCENARIO.plannedTotal);
  assert.ok(lab.metrics.achievedPower >= 0 && lab.metrics.achievedPower <= 1);
  assert.ok(lab.metrics.detectableRelativeLift > 0);
  assert.ok(lab.curve.every((point, index) => index === 0 || point.power >= lab.curve[index - 1].power));
});
