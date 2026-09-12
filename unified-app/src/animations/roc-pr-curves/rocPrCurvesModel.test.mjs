import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEPLOYMENT_POPULATION,
  MAJORITY_SLICE_BANDS,
  MINORITY_SLICE_BANDS,
  REFERENCE_BANDS,
} from './rocPrCurvesConstants.js';
import {
  averagePrecision,
  bestPointUnderFpr,
  confusionAt,
  curvePoints,
  exactThresholds,
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

const OFF_GRID_BANDS = Object.freeze([
  { score: 0.83, positives: 1, negatives: 0 },
  { score: 0.81, positives: 0, negatives: 1 },
  { score: 0.79, positives: 1, negatives: 0 },
  { score: 0.77, positives: 0, negatives: 1 },
]);

test('reference score bands have stable support and strong ranking', () => {
  assert.deepEqual(totalCounts(REFERENCE_BANDS), { positives: 151, negatives: 237 });
  assert.ok(rocAuc(REFERENCE_BANDS) > 0.94);
  assert.ok(prAuc(REFERENCE_BANDS) > 0.9);
  assert.ok(averagePrecision(REFERENCE_BANDS) > 0.9);
});

test('curve thresholds come from observed score breakpoints rather than a fixed grid', () => {
  const thresholds = exactThresholds(OFF_GRID_BANDS);
  const points = curvePoints(OFF_GRID_BANDS);

  assert.equal(thresholds.length, 5);
  assert.deepEqual(thresholds.slice(1), [0.83, 0.81, 0.79, 0.77]);
  assert.equal(points.length, 5);
  closeTo(rocAuc(OFF_GRID_BANDS), 0.75);
});

test('ROC AUC handles tied positive-negative scores as half a ranking win', () => {
  const tied = [
    { score: 0.9, positives: 1, negatives: 1 },
    { score: 0.1, positives: 0, negatives: 1 },
  ];
  closeTo(rocAuc(tied), 0.75);
});

test('threshold metrics use the correct ROC and PR denominators', () => {
  const counts = confusionAt(0.8, REFERENCE_BANDS);
  const summary = metrics(counts);

  assert.deepEqual(counts, { tp: 70, fp: 3, fn: 81, tn: 234 });
  closeTo(summary.precision, 70 / 73);
  closeTo(summary.recall, 70 / 151);
  closeTo(summary.fpr, 3 / 237);
});

test('trapezoidal PR area and average precision are explicitly different summaries', () => {
  const trapezoidal = prAuc(REFERENCE_BANDS);
  const ap = averagePrecision(REFERENCE_BANDS);

  closeTo(trapezoidal, 0.9198231933757378);
  closeTo(ap, 0.9016362818235804);
  assert.ok(trapezoidal > ap);
});

test('prevalence reweighting preserves ROC AUC while changing PR summaries', () => {
  const rare = reweightForPrevalence(REFERENCE_BANDS, 0.02);
  const common = reweightForPrevalence(REFERENCE_BANDS, 0.3);

  closeTo(rocAuc(rare), rocAuc(common));
  assert.ok(prAuc(rare) < prAuc(common));
  assert.ok(averagePrecision(rare) < averagePrecision(common));
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

test('capacity threshold uses exact score breakpoints and maximizes recall within budget', () => {
  const rare = reweightForPrevalence(REFERENCE_BANDS, 0.02, DEPLOYMENT_POPULATION);
  const candidate = findCapacityThreshold(rare, 300);

  assert.ok(candidate);
  assert.ok(candidate.summary.predictedPositives <= 300);
  assert.equal(candidate.threshold, 0.85);
});

test('low-FPR operating region exposes the best recall available under a strict false-alarm cap', () => {
  const candidate = bestPointUnderFpr(REFERENCE_BANDS, 0.05);

  assert.ok(candidate);
  assert.equal(candidate.threshold, 0.75);
  closeTo(candidate.recall, 96 / 151);
  closeTo(candidate.fpr, 7 / 237);
});

test('aggregate metrics can hide catastrophic minority ranking', () => {
  const aggregate = mergeBands(MAJORITY_SLICE_BANDS, MINORITY_SLICE_BANDS);

  assert.ok(rocAuc(aggregate) > 0.9);
  assert.ok(rocAuc(MINORITY_SLICE_BANDS) < 0.55);
  assert.ok(averagePrecision(MINORITY_SLICE_BANDS) < 0.2);
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

test('invalid curve inputs fail instead of producing misleading areas', () => {
  assert.throws(() => totalCounts([]), /non-empty array/);
  assert.throws(() => totalCounts([{ score: 0.5, positives: -1, negatives: 2 }]), /non-negative/);
  assert.throws(() => confusionAt(Number.NaN, REFERENCE_BANDS), /finite/);
  assert.throws(() => reweightForPrevalence(REFERENCE_BANDS, 1.2), /between 0 and 1/);
  assert.throws(() => reweightForPrevalence(REFERENCE_BANDS, 0.2, 0), /positive and finite/);
  assert.throws(() => bestPointUnderFpr(REFERENCE_BANDS, -0.1), /between 0 and 1/);
  assert.throws(() => findCapacityThreshold(REFERENCE_BANDS, -1), /non-negative/);
});

test('metric formatting handles undefined precision', () => {
  assert.equal(metricPercent(null), 'N/A');
  assert.equal(metricPercent(0.1234, 1), '12.3%');
});
