import assert from 'node:assert/strict';
import test from 'node:test';
import { ECE_BINNING_ROWS } from './calibrationBinningConstants.js';
import { REFERENCE_BINS, SHIFT_SCENARIOS } from './calibrationConstants.js';
import { CALIBRATION_SLICE_EXAMPLE } from './calibrationSliceConstants.js';
import {
  aggregateCalibrationSlices,
  baseRate,
  brierDecomposition,
  brierScore,
  calibrationBinsFromRows,
  diagnoseShift,
  expectedCalibrationError,
  groupedAuc,
  logLoss,
  rowBrierScore,
  rowLogLoss,
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

test('Brier decomposition reconstructs the grouped Brier score', () => {
  const parts = brierDecomposition(REFERENCE_BINS);
  closeTo(parts.reconstructed, brierScore(REFERENCE_BINS));
  assert.ok(parts.reliability < 0.001);
  assert.ok(parts.resolution > 0.05);
  assert.ok(parts.uncertainty > 0.24);
});

test('the same raw predictions can look perfect or poor under different ECE binning', () => {
  const coarse = calibrationBinsFromRows(ECE_BINNING_ROWS, 2);
  const fine = calibrationBinsFromRows(ECE_BINNING_ROWS, 4);

  closeTo(expectedCalibrationError(coarse), 0);
  closeTo(expectedCalibrationError(fine), 0.2);
  assert.equal(ECE_BINNING_ROWS.length, 40);
});

test('row-wise proper scores do not depend on reliability-diagram bin count', () => {
  closeTo(rowBrierScore(ECE_BINNING_ROWS), 0.24);
  closeTo(rowLogLoss(ECE_BINNING_ROWS), 0.6847899705748948);

  const twoBins = calibrationBinsFromRows(ECE_BINNING_ROWS, 2);
  const eightBins = calibrationBinsFromRows(ECE_BINNING_ROWS, 8);
  assert.notEqual(expectedCalibrationError(twoBins), expectedCalibrationError(eightBins));
  closeTo(rowBrierScore(ECE_BINNING_ROWS), 0.24);
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
  closeTo(result.calibratedMetrics.brierComponents.resolution, result.rawMetrics.brierComponents.resolution);
  closeTo(result.calibratedMetrics.brierComponents.uncertainty, result.rawMetrics.brierComponents.uncertainty);
  assert.ok(result.calibratedMetrics.brierComponents.reliability < result.rawMetrics.brierComponents.reliability);
});

test('temperature scaling repairs confidence sharpness without changing ranking', () => {
  const scenario = SHIFT_SCENARIOS.confidenceDrift;
  const result = evaluateRecalibration('temperature', scenario.calibrationBins, scenario.evaluationBins);
  assert.ok(result.parameters.temperature > 1.3);
  assert.ok(result.calibratedMetrics.ece < 0.02);
  closeTo(result.calibratedMetrics.auc, result.rawMetrics.auc);
});

test('isotonic regression repairs nonlinear monotone reliability drift', () => {
  const scenario = SHIFT_SCENARIOS.nonlinearDrift;
  const result = evaluateRecalibration('isotonic', scenario.calibrationBins, scenario.evaluationBins);
  assert.ok(result.parameters.blocks.length >= 4);
  assert.ok(result.calibratedMetrics.ece < result.rawMetrics.ece * 0.3);
  closeTo(result.calibratedMetrics.auc, result.rawMetrics.auc);

  const probabilities = result.calibratedBins.map((bin) => bin.confidence);
  probabilities.slice(1).forEach((probability, index) => {
    assert.ok(probability >= probabilities[index]);
  });
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
  assert.equal(diagnoseShift(REFERENCE_BINS, SHIFT_SCENARIOS.nonlinearDrift.evaluationBins).severity, 'calibration-drift');
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

test('threshold metrics report undefined precision when no cases are predicted positive', () => {
  const summary = thresholdStats(REFERENCE_BINS, 1);
  assert.equal(summary.predictedPositive, 0);
  assert.equal(summary.precision, null);
  assert.ok(summary.recall === 0);
});

test('aggregate calibration can hide large opposing slice errors', () => {
  const slices = CALIBRATION_SLICE_EXAMPLE.slices;
  const aggregate = aggregateCalibrationSlices(slices);

  assert.ok(expectedCalibrationError(aggregate) < 1e-8);
  assert.ok(slices.every((slice) => expectedCalibrationError(slice.bins) > 0.13));
  assert.equal(totalCount(aggregate), slices.reduce((sum, slice) => sum + totalCount(slice.bins), 0));
});

test('degenerate AUC and malformed calibration inputs fail honestly', () => {
  assert.equal(groupedAuc([{ confidence: 0.5, observed: 1, count: 10 }]), null);
  assert.throws(() => calibrationBinsFromRows(ECE_BINNING_ROWS, 1), RangeError);
  assert.throws(() => calibrationBinsFromRows([{ probability: 1.2, label: 1 }], 4), RangeError);
  assert.throws(() => thresholdStats(REFERENCE_BINS, 1.1), RangeError);
  assert.throws(() => expectedCalibrationError([{ confidence: 0.5, observed: 1.2, count: 10 }]), RangeError);
});
