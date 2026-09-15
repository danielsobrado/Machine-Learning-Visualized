import test from 'node:test';
import assert from 'node:assert/strict';

import {
  analyzeRobustRegression,
  analyzeSelectionReplay,
  calculateRegressionIntervals,
  compareTemporalCv,
  compareThresholdPolicies,
  scoreForecastRows,
  shiftProbabilityByLogit,
} from './classicalMlNextModel.js';
import {
  FORECAST_SCORING_DEFAULTS,
  LINEAR_REGRESSION_NEXT_DEFAULTS,
  LOGISTIC_REGRESSION_NEXT_DEFAULTS,
  SELECTION_REPLAY_DEFAULTS,
  TEMPORAL_CV_DEFAULTS,
} from './classicalMlNextConstants.js';

const closeTo = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

test('prediction intervals are wider than confidence intervals for a future observation', () => {
  const result = calculateRegressionIntervals(LINEAR_REGRESSION_NEXT_DEFAULTS);
  closeTo(result.leverage, 0.13);
  closeTo(result.confidenceHalfWidth, 1.491977117786999);
  closeTo(result.predictionHalfWidth, 4.398754337309597);
  assert.ok(result.predictionHalfWidth > result.confidenceHalfWidth);
});

test('Theil-Sen fit resists the high-leverage response outlier better than OLS', () => {
  const result = analyzeRobustRegression(
    LINEAR_REGRESSION_NEXT_DEFAULTS.points,
    LINEAR_REGRESSION_NEXT_DEFAULTS.probeX,
  );
  closeTo(result.robust.slope, 2);
  closeTo(result.robust.intercept, 1);
  assert.ok(result.ordinary.slope > 3);
  assert.ok(result.ordinaryPrediction > result.robustPrediction);
});

test('calibration shift can move a previously confident score near the decision boundary', () => {
  const shifted = shiftProbabilityByLogit(
    LOGISTIC_REGRESSION_NEXT_DEFAULTS.probability,
    LOGISTIC_REGRESSION_NEXT_DEFAULTS.logitShift,
  );
  closeTo(shifted, 0.5111135714627574);
  assert.ok(shifted < LOGISTIC_REGRESSION_NEXT_DEFAULTS.probability);
});

test('subgroup-specific cost thresholds can beat one global threshold without becoming a fairness claim', () => {
  const result = compareThresholdPolicies(LOGISTIC_REGRESSION_NEXT_DEFAULTS);
  assert.equal(result.global.totalCost, 7);
  assert.equal(result.groupSpecificCost, 2);
  assert.equal(result.costReduction, 5);
  assert.deepEqual(
    result.groupPolicies.map(({ group, threshold }) => [group, threshold]),
    [['A', 0.6], ['B', 0.7]],
  );
});

test('reusing validation data creates an optimistic winner while nested evaluation stays external', () => {
  const result = analyzeSelectionReplay(SELECTION_REPLAY_DEFAULTS);
  assert.equal(result.selected.id, 'M5');
  closeTo(result.optimismGap, 0.1);
  closeTo(result.nestedEstimate, 0.21666666666666667);
  assert.ok(result.nestedEstimate > result.naiveValidationEstimate);
});

test('blocked temporal CV adapts faster to the regime shift and still reports horizon-specific errors', () => {
  const result = compareTemporalCv(TEMPORAL_CV_DEFAULTS);
  closeTo(result.expanding.overallMae, 9.308333333333334);
  closeTo(result.blocked.overallMae, 6.083333333333333);
  assert.equal(result.blocked.byHorizon.length, 2);
  assert.ok(result.blocked.byHorizon[1].mae > result.blocked.byHorizon[0].mae);
});

test('forecast scoring keeps asymmetric business cost separate from interval calibration', () => {
  const result = scoreForecastRows(FORECAST_SCORING_DEFAULTS);
  assert.equal(result.totalCost, 152);
  closeTo(result.overallCoverage, 2 / 3);
  assert.deepEqual(
    result.byHorizon.map(({ horizon, averageCost, coverage }) => [horizon, averageCost, coverage]),
    [[1, 11, 1], [2, 25.5, 0.5], [3, 39.5, 0.5]],
  );
});
