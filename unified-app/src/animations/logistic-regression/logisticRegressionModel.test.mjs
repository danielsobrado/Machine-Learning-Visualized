import test from 'node:test';
import assert from 'node:assert/strict';

import {
  POINTS,
  PRESETS,
  boundaryLine,
  calibratedCostThreshold,
  classifyPoint,
  evaluateThreshold,
  findCostOptimalThreshold,
  logit,
  metricPercent,
  safeRatio,
  scorePoint,
  sigmoid,
  summarize,
  thresholdSweep,
} from './logisticRegressionModel.js';

function closeTo(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

function balancedScores() {
  const preset = PRESETS.balanced;
  return POINTS.map((point) => scorePoint(point, preset.weightRisk, preset.weightEngagement, preset.bias));
}

test('sigmoid and logit are inverse transforms around valid probabilities', () => {
  for (const probability of [0.1, 0.25, 0.5, 0.75, 0.9]) {
    closeTo(sigmoid(logit(probability)), probability);
  }
});

test('balanced preset includes deliberate overlap instead of a perfect false-positive story', () => {
  const scored = balancedScores().map((point) => classifyPoint(point, PRESETS.balanced.threshold));
  const counts = summarize(scored);

  assert.equal(scored.length, 16);
  assert.deepEqual(counts, { tp: 8, fp: 1, fn: 2, tn: 5 });
  assert.equal(counts.tp + counts.fp + counts.fn + counts.tn, POINTS.length);
});

test('raising threshold trades false positives for false negatives on the same fitted scores', () => {
  const scored = balancedScores();
  const balancedCounts = summarize(scored.map((point) => classifyPoint(point, PRESETS.balanced.threshold)));
  const cautiousCounts = summarize(scored.map((point) => classifyPoint(point, PRESETS.cautious.threshold)));

  assert.ok(cautiousCounts.fp < balancedCounts.fp);
  assert.ok(cautiousCounts.fn > balancedCounts.fn);
});

test('deployment prevalence changes projected precision without changing measured recall', () => {
  const scored = balancedScores();
  const lowPrevalence = evaluateThreshold(scored, 0.5, 0.05, 1000, 10, 10);
  const highPrevalence = evaluateThreshold(scored, 0.5, 0.5, 1000, 10, 10);

  assert.equal(lowPrevalence.recall, highPrevalence.recall);
  assert.ok(lowPrevalence.precision < highPrevalence.precision);
});

test('asymmetric costs can move the empirical optimum far below the default threshold', () => {
  const scored = balancedScores();
  const sweep = thresholdSweep(scored, 0.05, 1000, 1, 200);
  const optimal = findCostOptimalThreshold(sweep, 0.5);

  assert.equal(optimal.threshold, 0.19);
  assert.ok(optimal.cost < evaluateThreshold(scored, 0.5, 0.05, 1000, 1, 200).cost);
});

test('calibrated cost threshold follows the false-positive over total-error-cost rule', () => {
  closeTo(calibratedCostThreshold(1, 4), 0.2);
  closeTo(calibratedCostThreshold(4, 1), 0.8);
});

test('safe ratios and percent formatting handle empty denominators', () => {
  assert.equal(safeRatio(3, 0), 0);
  assert.equal(metricPercent(0.625), '63%');
});

test('decision boundary remains finite for regular, vertical, and near-constant models', () => {
  const lines = [
    boundaryLine(1.35, -0.45, 0.1, 0.5),
    boundaryLine(1.35, 0, 0.1, 0.5),
    boundaryLine(0, 0, 0, 0.5),
  ];

  for (const line of lines) {
    for (const value of Object.values(line)) {
      assert.ok(Number.isFinite(value), `boundary coordinate should be finite, got ${value}`);
    }
  }
});
