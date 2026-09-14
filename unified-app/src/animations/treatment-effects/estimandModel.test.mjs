import assert from 'node:assert/strict';
import test from 'node:test';
import { buildEstimandLab } from './estimandModel.js';

const base = {
  responsiveShare: 0.4,
  highEffect: 12,
  lowEffect: 2,
  responsiveTreatmentRate: 0.5,
  otherTreatmentRate: 0.5,
};

test('equal treatment propensities make ATE ATT and ATC coincide', () => {
  const { metrics } = buildEstimandLab(base);
  assert.ok(Math.abs(metrics.ate - metrics.att) < 1e-12);
  assert.ok(Math.abs(metrics.ate - metrics.atc) < 1e-12);
});

test('preferentially treating high-response units raises ATT above ATE', () => {
  const { metrics } = buildEstimandLab({
    ...base,
    responsiveTreatmentRate: 0.9,
    otherTreatmentRate: 0.2,
  });
  assert.ok(metrics.highAmongTreated > metrics.highPopulation);
  assert.ok(metrics.att > metrics.ate);
  assert.ok(metrics.atc < metrics.ate);
});

test('reversing uptake reverses which estimand is enriched for high responders', () => {
  const { metrics } = buildEstimandLab({
    ...base,
    responsiveTreatmentRate: 0.1,
    otherTreatmentRate: 0.8,
  });
  assert.ok(metrics.highAmongTreated < metrics.highPopulation);
  assert.ok(metrics.att < metrics.ate);
  assert.ok(metrics.atc > metrics.ate);
});

test('homogeneous treatment effects collapse all estimands even under selection', () => {
  const { metrics } = buildEstimandLab({
    ...base,
    highEffect: 5,
    lowEffect: 5,
    responsiveTreatmentRate: 0.9,
    otherTreatmentRate: 0.1,
  });
  assert.equal(metrics.ate, 5);
  assert.equal(metrics.att, 5);
  assert.equal(metrics.atc, 5);
});
