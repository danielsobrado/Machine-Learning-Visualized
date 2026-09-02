import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CALIBRATION_ROWS,
  CLASSIFICATION_ROWS,
  THRESHOLD_GRID,
} from './classificationMetricsConstants.js';
import {
  bestThresholdBy,
  brierScore,
  confusionMatrix,
  expectedCalibrationError,
  logLoss,
  maxMetricGap,
  metricsByGroup,
  metricsFromCounts,
  projectFromRates,
  thresholdSweep,
} from './classificationMetricsModel.js';

test('confusion matrix and core metrics are correct at the default threshold', () => {
  const counts = confusionMatrix(CLASSIFICATION_ROWS, 0.5);
  const metrics = metricsFromCounts(counts);

  assert.deepEqual(counts, { tp: 9, fp: 3, fn: 3, tn: 13 });
  assert.equal(metrics.precision, 0.75);
  assert.equal(metrics.recall, 0.75);
  assert.equal(metrics.f1, 0.75);
  assert.equal(metrics.accuracy, 22 / 28);
});

test('subgroup audit exposes a large recall gap hidden by aggregate recall', () => {
  const groups = metricsByGroup(CLASSIFICATION_ROWS, 0.5);
  const aggregate = metricsFromCounts(confusionMatrix(CLASSIFICATION_ROWS, 0.5));

  assert.equal(groups.find((group) => group.group === 'Core').metrics.recall, 1);
  assert.equal(groups.find((group) => group.group === 'Edge').metrics.recall, 0.5);
  assert.equal(maxMetricGap(groups, 'recall'), 0.5);
  assert.equal(aggregate.recall, 0.75);
});

test('cost-optimal threshold differs from F1-optimal threshold under asymmetric harm', () => {
  const sweep = thresholdSweep(CLASSIFICATION_ROWS, THRESHOLD_GRID, 1, 8);
  const costBest = bestThresholdBy(sweep, 'cost');
  const f1Best = bestThresholdBy(sweep, 'f1');

  assert.equal(costBest.threshold, 0.35);
  assert.equal(f1Best.threshold, 0.4);
  assert.ok(costBest.cost < f1Best.cost);
});

test('precision and accuracy change with prevalence while balanced accuracy stays fixed', () => {
  const rare = projectFromRates({ tpr: 0.8, fpr: 0.1, prevalence: 0.02, population: 10000 });
  const balanced = projectFromRates({ tpr: 0.8, fpr: 0.1, prevalence: 0.5, population: 10000 });

  assert.ok(rare.metrics.precision < balanced.metrics.precision);
  assert.ok(rare.metrics.accuracy > balanced.metrics.accuracy);
  assert.ok(Math.abs(rare.metrics.balancedAccuracy - balanced.metrics.balancedAccuracy) < 1e-12);
});

test('rare prevalence turns a respectable FPR into many more false positives than true positives', () => {
  const projected = projectFromRates({ tpr: 0.8, fpr: 0.1, prevalence: 0.02, population: 10000 });

  assert.equal(projected.counts.tp, 160);
  assert.equal(projected.counts.fp, 980);
  assert.ok(projected.counts.fp > projected.counts.tp * 6);
});

test('identical hard predictions can hide very different probability quality', () => {
  const calibratedCounts = confusionMatrix(CALIBRATION_ROWS, 0.5, 'calibrated');
  const overconfidentCounts = confusionMatrix(CALIBRATION_ROWS, 0.5, 'overconfident');

  assert.deepEqual(calibratedCounts, overconfidentCounts);
  assert.ok(brierScore(CALIBRATION_ROWS, 'calibrated') < brierScore(CALIBRATION_ROWS, 'overconfident'));
  assert.ok(logLoss(CALIBRATION_ROWS, 'calibrated') < logLoss(CALIBRATION_ROWS, 'overconfident'));
});

test('ECE distinguishes the calibrated-looking score groups from overconfidence', () => {
  const calibratedEce = expectedCalibrationError(CALIBRATION_ROWS, 'calibrated');
  const overconfidentEce = expectedCalibrationError(CALIBRATION_ROWS, 'overconfident');

  assert.ok(calibratedEce < 0.03);
  assert.ok(overconfidentEce > 0.25);
});

test('MCC remains bounded and positive for the default non-trivial classifier', () => {
  const metrics = metricsFromCounts(confusionMatrix(CLASSIFICATION_ROWS, 0.5));

  assert.ok(metrics.mcc > 0);
  assert.ok(metrics.mcc <= 1);
});
