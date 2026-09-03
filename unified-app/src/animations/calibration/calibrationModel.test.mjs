import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REFERENCE_BINS,
  SHIFT_SCENARIOS,
} from './calibrationConstants.js';
import { CALIBRATION_SLICE_EXAMPLE } from './calibrationSliceConstants.js';
import {
  aggregateCalibrationSlices,
  baseRate,
  brierScore,
  diagnoseShift,
  expectedCalibrationError,
  groupedAuc,
  logLoss,
  thresholdStats,
  totalCount,
} from './calibrationModel.js';
import {
  applyRecalibrator,
  evaluateRecalibration,
  fitRecalibrator,
} from './calibrationRecalibration.js';

const closeTo = (actual, expected, tolerance = 1e-8) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} to be within ${tolerance} of ${expected}`);
};

test('reference and shift samples keep equal support', () => {
  assert.equal(totalCount(REFERENCE_BINS), 110);
  for (const scenario of Object.values(SHIFT_SCENARIOS)) {
    assert.equal(totalCount(scenario.calibrationBins), 110);
    assert.equal(totalCount(scenario.evaluationBins), 110);
  }
});

test('reference population is well calibrated and has useful discrimination', () => {
  assert.ok(expectedCalibrationError(REFERENCE_BINS) < 0.02);
  assert.ok(groupedAuc(REFERENCE_BINS) > 0.75);
  assert.ok(brierScore(REFERENCE_BINS) < 0.2);
  assert.ok(logLoss(REFERENCE_BINS) < 0.6);
});

test('base-rate shift preserves ranking while breaking probability levels', () => {
  const shifted = SHIFT_SCENARIOS.priorShift.evaluationBins;
  assert.ok(Math.abs(groupedAuc(REFERENCE_BINS) - groupedAuc(shifted)) < 0.03);
  assert.ok(expectedCalibrationError(shifted) > 0.12);
  assert.ok(baseRate(shifted) < baseRate(REFERENCE_BINS) - 0.1);
});

test('intercept correction fixes most base-rate calibration error on untouched evaluation bins', () => {
  const scenario = SHIFT_SCENARIOS.priorShift;
  const result = evaluateRecalibration('intercept', scenario.calibrationBins, scenario.evaluationBins);
  assert.ok(result.calibratedMetrics.ece < result.rawMetrics.ece * 0.25);
  assert.ok(result.calibratedMetrics.brier < result.rawMetrics.brier);
  assert.ok(result.calibratedMetrics.logLoss < result.rawMetrics.logLoss);
  closeTo(result.calibratedMetrics.auc, result.rawMetrics.auc);
});

test('temperature scaling repairs confidence sharpness without changing ranking', () => {
  const scenario = SHIFT_SCENARIOS.confidenceDrift;
  const result = evaluateRecalibration('temperature', scenario.calibrationBins, scenario.evaluationBins);
  assert.ok(result.parameters.temperature > 1.3);
  assert.ok(result.calibratedMetrics.ece < 0.02);
  closeTo(result.calibratedMetrics.auc, result.rawMetrics.auc);
});

test('monotonic Platt scaling cannot recover AUC lost to concept drift', () => {
  const scenario = SHIFT_SCENARIOS.conceptDrift;
  const result = evaluateRecalibration('platt', scenario.calibrationBins, scenario.evaluationBins);
  assert.ok(result.calibratedMetrics.ece < result.rawMetrics.ece);
  closeTo(result.calibratedMetrics.auc, result.rawMetrics.auc);
  assert.ok(result.rawMetrics.auc < groupedAuc(REFERENCE_BINS) - 0.1);
});

test('shift diagnosis distinguishes calibration drift from model drift', () => {
  assert.equal(diagnoseShift(REFERENCE_BINS, SHIFT_SCENARIOS.priorShift.evaluationBins).severity, 'calibration-drift');
  assert.equal(diagnoseShift(REFERENCE_BINS, SHIFT_SCENARIOS.conceptDrift.evaluationBins).severity, 'model-drift');
  assert.equal(diagnoseShift(REFERENCE_BINS, SHIFT_SCENARIOS.stable.evaluationBins).severity, 'stable');
});

test('recalibrator is fitted on calibration bins and can change fixed-threshold decisions', () => {
  const scenario = SHIFT_SCENARIOS.priorShift;
  const parameters = fitRecalibrator('intercept', scenario.calibrationBins);
  const calibrated = applyRecalibrator('intercept', scenario.evaluationBins, parameters);
  const rawDecision = thresholdStats(scenario.evaluationBins, 0.5);
  const calibratedDecision = thresholdStats(calibrated, 0.5);
  assert.ok(calibratedDecision.predictedPositive < rawDecision.predictedPositive);
});

test('aggregate calibration can hide large opposing slice errors', () => {
  const slices = CALIBRATION_SLICE_EXAMPLE.slices;
  const aggregate = aggregateCalibrationSlices(slices);

  assert.ok(expectedCalibrationError(aggregate) < 1e-8);
  assert.ok(slices.every((slice) => expectedCalibrationError(slice.bins) > 0.13));
  assert.equal(totalCount(aggregate), slices.reduce((sum, slice) => sum + totalCount(slice.bins), 0));
});
