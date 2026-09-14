import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDoublyRobustLab } from './doublyRobustModel.js';

const close = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be close to ${expected}`);
};

test('all estimators recover the ATE when both nuisance models are correct', () => {
  const lab = buildDoublyRobustLab({ highRiskShare: 0.4, propensityMisspecification: 0, outcomeMisspecification: 0 });
  close(lab.metrics.outcomeRegression, lab.metrics.trueAte);
  close(lab.metrics.ipw, lab.metrics.trueAte);
  close(lab.metrics.aipw, lab.metrics.trueAte);
});

test('AIPW remains correct when the outcome model is wrong but propensity is correct', () => {
  const lab = buildDoublyRobustLab({ highRiskShare: 0.4, propensityMisspecification: 0, outcomeMisspecification: 1 });
  assert.ok(Math.abs(lab.metrics.outcomeBias) > 0.5);
  close(lab.metrics.aipw, lab.metrics.trueAte);
});

test('AIPW remains correct when propensity is wrong but outcome model is correct', () => {
  const lab = buildDoublyRobustLab({ highRiskShare: 0.4, propensityMisspecification: 1, outcomeMisspecification: 0 });
  assert.ok(Math.abs(lab.metrics.ipwBias) > 0.5);
  close(lab.metrics.aipw, lab.metrics.trueAte);
});

test('AIPW is not generally protected when both nuisance models are wrong', () => {
  const lab = buildDoublyRobustLab({ highRiskShare: 0.4, propensityMisspecification: 1, outcomeMisspecification: 1 });
  assert.ok(Math.abs(lab.metrics.aipwBias) > 0.1);
  assert.equal(lab.metrics.doubleRobustCondition, false);
});
