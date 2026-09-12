import test from 'node:test';
import assert from 'node:assert/strict';

import {
  POINTS,
  VALIDATION_POINTS,
  binaryLogLoss,
  boundaryLine,
  brierScore,
  calibratedCostThreshold,
  classifyPoint,
  evaluateThreshold,
  findCostOptimalThreshold,
  findCostOptimalThresholdRanges,
  fitLogisticRegression,
  fitPresetModel,
  logit,
  metricPercent,
  modelLogit,
  modelProbability,
  normalizeFeature,
  safeRatio,
  scorePoint,
  scorePoints,
  separationExperiment,
  sigmoid,
  summarize,
  thresholdSweep,
} from './logisticRegressionModel.js';

function closeTo(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

function learnedModel() {
  return fitPresetModel('balanced');
}

function learnedValidationScores() {
  return scorePoints(VALIDATION_POINTS, learnedModel());
}

test('sigmoid and logit are stable inverse transforms around valid probabilities', () => {
  for (const probability of [0.1, 0.25, 0.5, 0.75, 0.9]) closeTo(sigmoid(logit(probability)), probability);
  assert.equal(sigmoid(1000), 1);
  assert.equal(sigmoid(-1000), 0);
  assert.throws(() => logit(0), RangeError);
  assert.throws(() => logit(1), RangeError);
});

test('mild-ridge coefficients are actually learned from the training sample', () => {
  const fitted = learnedModel();

  assert.equal(fitted.converged, true);
  closeTo(fitted.bias, 1.10769753, 1e-5);
  closeTo(fitted.weightRisk, 2.68124146, 1e-5);
  closeTo(fitted.weightEngagement, 0.76043368, 1e-5);
  assert.ok(fitted.weightEngagement > 0, 'the learned engagement direction should come from data, not a hand-authored preset');
  assert.ok(fitted.iterations < 15);
});

test('point scoring and surface probabilities share the learned logit definition', () => {
  const fitted = learnedModel();
  const point = POINTS.find((candidate) => candidate.id === 'J');
  const scored = scorePoint(point, fitted.weightRisk, fitted.weightEngagement, fitted.bias);

  closeTo(scored.z, modelLogit(point.risk, point.engagement, fitted.weightRisk, fitted.weightEngagement, fitted.bias));
  closeTo(scored.probability, modelProbability(point.risk, point.engagement, fitted.weightRisk, fitted.weightEngagement, fitted.bias));
  closeTo(normalizeFeature(50), 0);
});

test('training fit has deliberate overlap rather than perfect classroom separation', () => {
  const fitted = learnedModel();
  const classified = scorePoints(POINTS, fitted).map((point) => classifyPoint(point, fitted.threshold));
  const counts = summarize(classified);

  assert.deepEqual(counts, { tp: 9, fp: 1, fn: 1, tn: 5 });
  assert.equal(counts.tp + counts.fp + counts.fn + counts.tn, POINTS.length);
});

test('validation metrics are measured on rows that were not used to fit coefficients', () => {
  const scored = learnedValidationScores();
  const counts = summarize(scored.map((point) => classifyPoint(point, 0.5)));

  assert.deepEqual(counts, { tp: 9, fp: 2, fn: 0, tn: 5 });
  closeTo(binaryLogLoss(scored), 0.3252657546, 1e-5);
  closeTo(brierScore(scored), 0.1047284359, 1e-5);
});

test('raising threshold trades false positives for false negatives on fixed validation scores', () => {
  const scored = learnedValidationScores();
  const balancedCounts = summarize(scored.map((point) => classifyPoint(point, 0.5)));
  const cautiousCounts = summarize(scored.map((point) => classifyPoint(point, 0.7)));

  assert.ok(cautiousCounts.fp < balancedCounts.fp);
  assert.ok(cautiousCounts.fn > balancedCounts.fn);
});

test('strong ridge shrinks learned coefficients and compresses validation probabilities', () => {
  const mild = fitPresetModel('balanced');
  const strong = fitPresetModel('underfit');
  const mildScores = scorePoints(VALIDATION_POINTS, mild);
  const strongScores = scorePoints(VALIDATION_POINTS, strong);

  assert.ok(strong.coefficientNorm < mild.coefficientNorm / 2);
  assert.ok(binaryLogLoss(strongScores) > binaryLogLoss(mildScores));
  const mildExtremity = mildScores.reduce((sum, point) => sum + Math.abs(point.probability - 0.5), 0);
  const strongExtremity = strongScores.reduce((sum, point) => sum + Math.abs(point.probability - 0.5), 0);
  assert.ok(strongExtremity < mildExtremity);
});

test('perfect separation drives unregularized coefficients outward while ridge stays finite', () => {
  const experiment = separationExperiment();

  assert.ok(experiment.unregularized.coefficientNorm > 30);
  assert.ok(experiment.regularized.coefficientNorm < 5);
  assert.ok(experiment.unregularized.coefficientNorm > experiment.regularized.coefficientNorm * 5);
  assert.ok(experiment.unregularized.logLoss < 0.001);
  assert.ok(experiment.regularized.converged);
  assert.ok(experiment.unregularized.trace.at(-1).coefficientNorm > experiment.unregularized.trace[4].coefficientNorm);
});

test('deployment prevalence changes projected precision without changing measured recall', () => {
  const scored = learnedValidationScores();
  const lowPrevalence = evaluateThreshold(scored, 0.5, 0.05, 1000, 10, 10);
  const highPrevalence = evaluateThreshold(scored, 0.5, 0.5, 1000, 10, 10);

  assert.equal(lowPrevalence.recall, highPrevalence.recall);
  assert.ok(lowPrevalence.precision < highPrevalence.precision);
});

test('asymmetric deployment costs choose a validation threshold region rather than a universal 0.5', () => {
  const scored = learnedValidationScores();
  const sweep = thresholdSweep(scored, 0.05, 1000, 1, 200);
  const optimal = findCostOptimalThreshold(sweep, 0.5);
  const ranges = findCostOptimalThresholdRanges(sweep);

  assert.equal(optimal.threshold, 0.5);
  assert.deepEqual(ranges, [{ min: 0.34, max: 0.53 }]);
  assert.ok(optimal.cost < evaluateThreshold(scored, 0.7, 0.05, 1000, 1, 200).cost);
});

test('calibrated cost threshold follows the false-positive over total-error-cost rule', () => {
  closeTo(calibratedCostThreshold(1, 4), 0.2);
  closeTo(calibratedCostThreshold(4, 1), 0.8);
});

test('decision boundary is the visible probability-threshold crossing', () => {
  const fitted = learnedModel();
  const boundary = boundaryLine(fitted.weightRisk, fitted.weightEngagement, fitted.bias, fitted.threshold);
  assert.ok(boundary);

  for (const endpoint of [boundary.featureStart, boundary.featureEnd]) {
    const probability = modelProbability(
      endpoint.risk,
      endpoint.engagement,
      fitted.weightRisk,
      fitted.weightEngagement,
      fitted.bias,
    );
    closeTo(probability, fitted.threshold, 1e-9);
    assert.ok(endpoint.risk >= 0 && endpoint.risk <= 100);
    assert.ok(endpoint.engagement >= 0 && endpoint.engagement <= 100);
  }

  assert.equal(boundaryLine(0, 0, 0, 0.5), null);
});

test('invalid fitting, threshold, and scoring inputs fail explicitly', () => {
  assert.throws(() => fitLogisticRegression([], { lambda: 0.1 }), RangeError);
  assert.throws(() => fitLogisticRegression([{ risk: 1, engagement: 2, y: 1 }], { lambda: 0.1 }), RangeError);
  assert.throws(() => fitLogisticRegression(POINTS, { lambda: -1 }), RangeError);
  assert.throws(() => fitPresetModel('missing'), RangeError);
  assert.throws(() => classifyPoint({ probability: 0.5 }, 1), RangeError);
  assert.throws(() => scorePoint({ risk: Number.NaN, engagement: 2, y: 0 }, 1, 1, 0), TypeError);
  assert.equal(safeRatio(3, 0), 0);
  assert.equal(metricPercent(0.625), '63%');
});
