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
  findCostOptimalThresholdRanges,
  logit,
  metricPercent,
  modelLogit,
  modelProbability,
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
  assert.equal(sigmoid(1000), 1);
  assert.equal(sigmoid(-1000), 0);
  assert.throws(() => logit(0), RangeError);
  assert.throws(() => logit(1), RangeError);
});

test('point scoring and surface probabilities share one logit definition', () => {
  const preset = PRESETS.balanced;
  const point = POINTS.find((candidate) => candidate.id === 'J');
  const scored = scorePoint(point, preset.weightRisk, preset.weightEngagement, preset.bias);

  closeTo(scored.z, modelLogit(point.risk, point.engagement, preset.weightRisk, preset.weightEngagement, preset.bias));
  closeTo(scored.probability, modelProbability(point.risk, point.engagement, preset.weightRisk, preset.weightEngagement, preset.bias));
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

test('asymmetric costs move the empirical optimum below the default threshold without pretending it is unique', () => {
  const scored = balancedScores();
  const sweep = thresholdSweep(scored, 0.05, 1000, 1, 200);
  const optimal = findCostOptimalThreshold(sweep, 0.5);
  const ranges = findCostOptimalThresholdRanges(sweep);

  assert.equal(optimal.threshold, 0.19);
  assert.deepEqual(ranges, [{ min: 0.17, max: 0.19 }]);
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

test('decision boundary is the visible threshold crossing, not a clamped fake line', () => {
  const preset = PRESETS.balanced;
  const boundary = boundaryLine(preset.weightRisk, preset.weightEngagement, preset.bias, preset.threshold);
  assert.ok(boundary);

  for (const endpoint of [boundary.featureStart, boundary.featureEnd]) {
    const probability = modelProbability(
      endpoint.risk,
      endpoint.engagement,
      preset.weightRisk,
      preset.weightEngagement,
      preset.bias,
    );
    closeTo(probability, preset.threshold, 1e-10);
    assert.ok(endpoint.risk >= 0 && endpoint.risk <= 100);
    assert.ok(endpoint.engagement >= 0 && endpoint.engagement <= 100);
  }

  assert.equal(boundaryLine(0, 0, 0, 0.5), null);
  assert.equal(boundaryLine(0.001, 0, 10, 0.5), null);
});

test('vertical decision boundaries remain exact when engagement weight is zero', () => {
  const boundary = boundaryLine(1.35, 0, 0.1, 0.5);
  assert.ok(boundary);
  closeTo(boundary.featureStart.risk, boundary.featureEnd.risk);
  closeTo(modelProbability(boundary.featureStart.risk, 25, 1.35, 0, 0.1), 0.5, 1e-10);
});
