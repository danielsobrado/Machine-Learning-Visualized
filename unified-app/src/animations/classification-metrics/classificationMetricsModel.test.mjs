import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CALIBRATION_ROWS,
  CLASSIFICATION_ROWS,
  MULTICLASS_CONFUSION,
  MULTICLASS_LABELS,
  THRESHOLD_GRID,
} from './classificationMetricsConstants.js';
import {
  bestThresholdBy,
  bestThresholdsBy,
  brierScore,
  confusionMatrix,
  expectedCalibrationError,
  logLoss,
  maxMetricGap,
  metricsByGroup,
  metricsFromCounts,
  multiclassMetricsFromConfusion,
  projectFromRates,
  thresholdSweep,
  wilsonInterval,
} from './classificationMetricsModel.js';

function closeTo(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

test('confusion matrix and core metrics are correct at the default threshold', () => {
  const counts = confusionMatrix(CLASSIFICATION_ROWS, 0.5);
  const metrics = metricsFromCounts(counts);

  assert.deepEqual(counts, { tp: 9, fp: 3, fn: 3, tn: 13 });
  assert.equal(metrics.precision, 0.75);
  assert.equal(metrics.recall, 0.75);
  assert.equal(metrics.f1, 0.75);
  assert.equal(metrics.accuracy, 22 / 28);
});

test('undefined denominators stay undefined instead of becoming fake zero metrics', () => {
  const noPredictedPositives = metricsFromCounts({ tp: 0, fp: 0, fn: 5, tn: 10 });
  assert.equal(noPredictedPositives.precision, null);
  assert.equal(noPredictedPositives.recall, 0);
  assert.equal(noPredictedPositives.f1, 0);
  assert.equal(noPredictedPositives.mcc, null);

  const noActualPositives = metricsFromCounts({ tp: 0, fp: 2, fn: 0, tn: 8 });
  assert.equal(noActualPositives.recall, null);
  assert.equal(noActualPositives.balancedAccuracy, null);
});

test('subgroup audit exposes a large recall gap hidden by aggregate recall', () => {
  const groups = metricsByGroup(CLASSIFICATION_ROWS, 0.5);
  const aggregate = metricsFromCounts(confusionMatrix(CLASSIFICATION_ROWS, 0.5));

  assert.equal(groups.find((group) => group.group === 'Core').metrics.recall, 1);
  assert.equal(groups.find((group) => group.group === 'Edge').metrics.recall, 0.5);
  assert.equal(maxMetricGap(groups, 'recall'), 0.5);
  assert.equal(aggregate.recall, 0.75);
});

test('Wilson intervals expose uncertainty from the six-positive subgroup denominators', () => {
  const perfectSix = wilsonInterval(6, 6);
  const halfSix = wilsonInterval(3, 6);

  closeTo(perfectSix.lower, 0.6096569663469354, 1e-12);
  closeTo(perfectSix.upper, 1, 1e-12);
  closeTo(halfSix.lower, 0.18761280689940868, 1e-12);
  closeTo(halfSix.upper, 0.8123871931005913, 1e-12);
  assert.equal(wilsonInterval(0, 0), null);
});

test('cost-optimal threshold differs from F1-optimal threshold under asymmetric harm', () => {
  const sweep = thresholdSweep(CLASSIFICATION_ROWS, THRESHOLD_GRID, 1, 8);
  const costBest = bestThresholdBy(sweep, 'cost');
  const f1Best = bestThresholdBy(sweep, 'f1');

  assert.equal(costBest.threshold, 0.35);
  assert.equal(f1Best.threshold, 0.4);
  assert.ok(costBest.cost < f1Best.cost);
});

test('threshold optimization reports all tied optima and chooses a representative nearest 0.5', () => {
  const sweep = [
    { threshold: 0.2, cost: 7, metrics: { f1: 0.7 } },
    { threshold: 0.35, cost: 5, metrics: { f1: 0.8 } },
    { threshold: 0.45, cost: 5, metrics: { f1: 0.8 } },
    { threshold: 0.6, cost: 9, metrics: { f1: 0.6 } },
  ];

  assert.deepEqual(bestThresholdsBy(sweep, 'cost').map((item) => item.threshold), [0.35, 0.45]);
  assert.deepEqual(bestThresholdsBy(sweep, 'f1').map((item) => item.threshold), [0.35, 0.45]);
  assert.equal(bestThresholdBy(sweep, 'cost').threshold, 0.45);
});

test('precision and accuracy change with prevalence while balanced accuracy stays fixed', () => {
  const rare = projectFromRates({ tpr: 0.8, fpr: 0.1, prevalence: 0.02, population: 10000 });
  const balanced = projectFromRates({ tpr: 0.8, fpr: 0.1, prevalence: 0.5, population: 10000 });

  assert.ok(rare.metrics.precision < balanced.metrics.precision);
  assert.ok(rare.metrics.accuracy > balanced.metrics.accuracy);
  closeTo(rare.metrics.balancedAccuracy, balanced.metrics.balancedAccuracy);
});

test('rare prevalence turns a respectable FPR into many more false positives than true positives', () => {
  const projected = projectFromRates({ tpr: 0.8, fpr: 0.1, prevalence: 0.02, population: 10000 });

  assert.equal(projected.counts.tp, 160);
  assert.equal(projected.counts.fp, 980);
  assert.ok(projected.counts.fp > projected.counts.tp * 6);
});

test('multiclass averaging exposes minority-class weakness hidden by micro and weighted scores', () => {
  const summary = multiclassMetricsFromConfusion(MULTICLASS_CONFUSION, MULTICLASS_LABELS);
  const critical = summary.perClass.find((item) => item.label === 'Critical');

  closeTo(summary.accuracy, 0.65);
  closeTo(summary.micro.f1, 0.65);
  closeTo(summary.macro.f1, 0.5341880341880342);
  closeTo(summary.weighted.f1, 0.6365384615384616);
  closeTo(critical.f1, 1 / 3);
  assert.ok(summary.macro.f1 < summary.weighted.f1);
  assert.deepEqual(summary.perClass.map((item) => item.support), [12, 5, 3]);
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

test('invalid probabilities, matrices, and confidence-interval counts fail explicitly', () => {
  assert.throws(() => projectFromRates({ tpr: 1.1, fpr: 0.1, prevalence: 0.2, population: 100 }), RangeError);
  assert.throws(() => multiclassMetricsFromConfusion([[1, 2]], ['A', 'B']), RangeError);
  assert.throws(() => wilsonInterval(7, 6), RangeError);
  assert.throws(() => expectedCalibrationError(CALIBRATION_ROWS, 'calibrated', 0), RangeError);
});
