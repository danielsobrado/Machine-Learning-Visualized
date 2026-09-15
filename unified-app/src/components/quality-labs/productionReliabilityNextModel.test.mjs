import test from 'node:test';
import assert from 'node:assert/strict';

import {
  chooseIncidentAction,
  compareDebuggingHypotheses,
  deduplicateAlerts,
  evaluateFairnessThresholdPair,
  evaluateTemperature,
  fitTemperatureScaling,
  sweepFairnessThresholdPairs,
} from './productionReliabilityNextModel.js';
import {
  DEBUGGING_NEXT_DEFAULTS,
  FAIRNESS_NEXT_DEFAULTS,
  MONITORING_NEXT_DEFAULTS,
  UNCERTAINTY_NEXT_DEFAULTS,
} from './productionReliabilityNextConstants.js';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('debugging replay distinguishes a targeted fix from a broad threshold workaround', () => {
  const result = compareDebuggingHypotheses(DEBUGGING_NEXT_DEFAULTS);
  const targeted = result.evaluated.find(({ id }) => id === 'targeted-data');
  const threshold = result.evaluated.find(({ id }) => id === 'lower-threshold');
  closeTo(targeted.targetGain, 0.18);
  closeTo(targeted.guardrailDrop, 0.01);
  assert.equal(targeted.passes, true);
  assert.equal(threshold.passes, false);
  assert.equal(result.best.id, 'targeted-data');
});

test('monitoring deduplicates repeated alert fingerprints and favors rollback for a broad risky incident', () => {
  const dedupe = deduplicateAlerts(MONITORING_NEXT_DEFAULTS);
  assert.equal(dedupe.rawCount, 4);
  assert.equal(dedupe.notificationCount, 2);
  assert.equal(dedupe.suppressedCount, 2);
  assert.equal(dedupe.notifications[0].count, 3);

  const decision = chooseIncidentAction(MONITORING_NEXT_DEFAULTS.decision);
  assert.equal(decision.recommendation, 'rollback');
  assert.ok(decision.rollbackScore > decision.forwardFixScore);
});

test('temperature scaling fits the held-out split without changing classification accuracy', () => {
  const fitted = fitTemperatureScaling(UNCERTAINTY_NEXT_DEFAULTS);
  assert.equal(fitted.best.temperature, 2.5);
  assert.ok(fitted.best.nll < fitted.baseline.nll);
  assert.ok(Math.abs(fitted.best.calibrationGap) < Math.abs(fitted.baseline.calibrationGap));
  closeTo(fitted.best.accuracy, fitted.baseline.accuracy);

  const manual = evaluateTemperature(UNCERTAINTY_NEXT_DEFAULTS.rows, fitted.best.temperature);
  closeTo(manual.nll, fitted.best.nll);
});

test('fairness sweep exposes different thresholds for equalized-odds and calibration objectives', () => {
  const sweep = sweepFairnessThresholdPairs(FAIRNESS_NEXT_DEFAULTS);
  assert.deepEqual(
    [sweep.bestEqualizedOdds.thresholdA, sweep.bestEqualizedOdds.thresholdB],
    [0.5, 0.7],
  );
  assert.deepEqual(
    [sweep.bestCalibration.thresholdA, sweep.bestCalibration.thresholdB],
    [0.5, 0.6],
  );
  assert.ok(sweep.bestEqualizedOdds.equalizedOddsGap < sweep.bestCalibration.equalizedOddsGap);
  assert.ok(sweep.bestCalibration.calibrationError < sweep.bestEqualizedOdds.calibrationError);

  const current = evaluateFairnessThresholdPair(FAIRNESS_NEXT_DEFAULTS);
  closeTo(current.equalizedOddsGap, 0.4);
});
