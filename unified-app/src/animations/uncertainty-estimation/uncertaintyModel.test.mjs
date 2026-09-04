import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './uncertaintyConfig.js';
import { buildConformalLab, calibrateConformal, conformalQuantile } from './uncertaintyModel.js';

test('conformal quantile uses a finite-sample upper order statistic', () => {
  assert.equal(conformalQuantile([1, 2, 3, 4, 5], 0.8), 5);
});

test('calibration is deterministic', () => {
  assert.deepEqual(calibrateConformal(DEFAULT_SCENARIO), calibrateConformal(DEFAULT_SCENARIO));
});

test('higher target coverage never narrows the calibrated interval multiplier', () => {
  const low = calibrateConformal({ ...DEFAULT_SCENARIO, targetCoverage: 0.8 }).qHat;
  const high = calibrateConformal({ ...DEFAULT_SCENARIO, targetCoverage: 0.95 }).qHat;
  assert.ok(high >= low);
});

test('exchangeable test coverage is close to the requested 90 percent', () => {
  const lab = buildConformalLab(DEFAULT_SCENARIO);
  assert.ok(lab.metrics.empiricalCoverage >= 0.86);
  assert.ok(lab.metrics.empiricalCoverage <= 0.96);
});

test('distribution shift breaks the exchangeability guarantee and reduces coverage', () => {
  const iid = buildConformalLab(DEFAULT_SCENARIO);
  const shifted = buildConformalLab({ ...DEFAULT_SCENARIO, distributionShift: 10 });
  assert.ok(shifted.metrics.empiricalCoverage < iid.metrics.empiricalCoverage - 0.08);
});

test('tight width policy defers more predictions than a loose policy', () => {
  const tight = buildConformalLab({ ...DEFAULT_SCENARIO, abstainWidth: 10 });
  const loose = buildConformalLab({ ...DEFAULT_SCENARIO, abstainWidth: 30 });
  assert.ok(tight.metrics.deferRate > loose.metrics.deferRate);
});
