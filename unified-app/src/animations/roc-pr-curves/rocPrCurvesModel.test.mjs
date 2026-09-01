import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEPLOYMENT_POPULATION,
  MAJORITY_SLICE_BANDS,
  MINORITY_SLICE_BANDS,
  REFERENCE_BANDS,
} from './rocPrCurvesConstants.js';
import {
  confusionAt,
  curvePoints,
  findCapacityThreshold,
  mergeBands,
  metricPercent,
  metrics,
  prAuc,
  prevalenceOf,
  reweightForPrevalence,
  rocAuc,
  totalCounts,
} from './rocPrCurvesModel.js';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
};

test('reference score bands have stable support and strong ranking', () => {
  assert.deepEqual(totalCounts(REFERENCE_BANDS), { positives: 151, negatives: 237 });
  assert.ok(rocAuc(REFERENCE_BANDS) > 0.94);
  assert.ok(prAuc(REFERENCE_BANDS) > 0.9);
});

test('threshold metrics use the correct ROC and PR denominators', () => {
  const counts = confusionAt(0.8, REFERENCE_BANDS);
  const summary = metrics(counts);

  assert.deepEqual(counts, { tp: 70, fp: 3, fn: 81, tn: 234 });
  closeTo(summary.precision, 70 / 73);
  closeTo(summary.recall, 70 / 151);
  closeTo(summary.fpr, 3 / 237);
});

test('prevalence reweighting preserves ROC AUC while changing PR AUC', () => {
  const rare = reweightForPrevalence(REFERENCE_BANDS, 0.02);
  const common = reweightForPrevalence(REFERENCE_BANDS, 0.3);

  closeTo(rocAuc(rare), rocAuc(common));
  assert.ok(prAuc(rare) < prAuc(common));
  closeTo(prevalenceOf(rare), 0.02);
  closeTo(prevalenceOf(common), 0.3);
});

test('rare positives turn a small FPR into many false alarms', () => {
  const rare = reweightForPrevalence(REFERENCE_BANDS, 0.02, DEPLOYMENT_POPULATION);
  const counts = confusionAt(0.5, rare);
  const summary = metrics(counts);

  assert.ok(summary.fpr < 0.12);
  assert.ok(counts.fp > 1000);
  assert.ok(summary.precision < 0.15);
});

test('capacity threshold maximizes recall without exceeding alert budget', () => {
  const rare = reweightForPrevalence(REFERENCE_BANDS, 0.02, DEPLOYMENT_POPULATION);
  const candidate = findCapacityThreshold(rare, 300);

  assert.ok(candidate);
  assert.ok(candidate.summary.predictedPositives <= 300);
  assert.equal(candidate.threshold, 0.8);
});

test('aggregate metrics can hide catastrophic minority ranking', () => {
  const aggregate = mergeBands(MAJORITY_SLICE_BANDS, MINORITY_SLICE_BANDS);

  assert.ok(rocAuc(aggregate) > 0.9);
  assert.ok(rocAuc(MINORITY_SLICE_BANDS) < 0.55);
  assert.ok(prAuc(MINORITY_SLICE_BANDS) < 0.2);
});

test('curve points include empty and full prediction anchors', () => {
  const points = curvePoints(REFERENCE_BANDS);
  const first = points[0];
  const last = points.at(-1);

  assert.equal(first.predictedPositives, 0);
  assert.equal(first.precisionPlot, 1);
  assert.equal(last.recall, 1);
  assert.equal(last.fpr, 1);
});

test('metric formatting handles undefined precision', () => {
  assert.equal(metricPercent(null), 'N/A');
  assert.equal(metricPercent(0.1234, 1), '12.3%');
});
