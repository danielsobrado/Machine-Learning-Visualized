import assert from 'node:assert/strict';
import test from 'node:test';

import {
  INFLUENCE_SCENARIOS,
  RESIDUAL_SCENARIOS,
} from './linearRegressionConstants.js';
import {
  LINEAR_REGRESSION_DEMO_DATA,
  calculateFitMetrics,
  calculateInfluence,
  calculateMSE,
  calculateOLS,
  calculateResiduals,
  diagnoseResidualPattern,
  influenceThresholds,
  predict,
} from './linearRegressionModel.js';

const closeTo = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} to be within ${tolerance} of ${expected}`);
};

test('linear regression demo model computes predictions, residuals, and MSE', () => {
  const model = { slope: 1, intercept: 0 };
  const { residuals, mse } = calculateResiduals(LINEAR_REGRESSION_DEMO_DATA, model);

  assert.equal(predict(model, 4), 4);
  assert.deepEqual(residuals.map((point) => point.error), [1, 1, 2, 0, 1]);
  assert.equal(mse, 7 / 5);
  assert.equal(calculateMSE(LINEAR_REGRESSION_DEMO_DATA, model), 7 / 5);
});

test('OLS fitter handles exact lines and vertical point sets', () => {
  const model = calculateOLS([{ x: 0, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 5 }]);
  assert.ok(model);
  closeTo(model.slope, 2);
  closeTo(model.intercept, 1);
  assert.equal(calculateOLS([{ x: 2, y: 1 }, { x: 2, y: 3 }]), null);
});

test('healthy scenario has excellent fit without a diagnostic failure pattern', () => {
  const diagnosis = diagnoseResidualPattern(RESIDUAL_SCENARIOS.wellBehaved.points);
  assert.equal(diagnosis.status, 'well-behaved');
  assert.ok(diagnosis.r2 > 0.99);
  assert.ok(diagnosis.spreadRatio < 2.5);
  assert.ok(Math.abs(diagnosis.curvatureCorrelation) < 0.3);
});

test('heteroscedastic scenario keeps a strong R2 while residual spread fans out', () => {
  const diagnosis = diagnoseResidualPattern(RESIDUAL_SCENARIOS.heteroscedastic.points);
  assert.equal(diagnosis.status, 'heteroscedastic');
  assert.ok(diagnosis.r2 > 0.9);
  assert.ok(diagnosis.spreadRatio > 5);
});

test('nonlinear scenario proves a high R2 can hide systematic curvature', () => {
  const diagnosis = diagnoseResidualPattern(RESIDUAL_SCENARIOS.nonlinear.points);
  assert.equal(diagnosis.status, 'nonlinear');
  assert.ok(diagnosis.r2 > 0.9);
  assert.ok(Math.abs(diagnosis.curvatureCorrelation) > 0.9);
});

test('vertical outlier has a large standardized residual without high leverage', () => {
  const scenario = INFLUENCE_SCENARIOS.verticalOutlier;
  const special = calculateInfluence(scenario.points).find((point) => point.id === scenario.specialId);
  const thresholds = influenceThresholds(scenario.points.length);

  assert.ok(Math.abs(special.standardizedResidual) > thresholds.standardizedResidual);
  assert.ok(special.leverage < thresholds.leverage);
  assert.ok(Math.abs(special.slopeShift) < 0.05);
});

test('aligned high-leverage point is not automatically an influential bad point', () => {
  const scenario = INFLUENCE_SCENARIOS.highLeverageAligned;
  const special = calculateInfluence(scenario.points).find((point) => point.id === scenario.specialId);
  const thresholds = influenceThresholds(scenario.points.length);

  assert.ok(special.leverage > thresholds.leverage);
  assert.ok(Math.abs(special.standardizedResidual) < 1);
  assert.ok(Math.abs(special.slopeShift) < 0.05);
});

test('high-leverage off-trend point becomes strongly influential', () => {
  const scenario = INFLUENCE_SCENARIOS.influential;
  const fit = calculateFitMetrics(scenario.points);
  const special = calculateInfluence(scenario.points, fit.model).find((point) => point.id === scenario.specialId);
  const thresholds = influenceThresholds(scenario.points.length);

  assert.ok(special.leverage > thresholds.leverage);
  assert.ok(Math.abs(special.standardizedResidual) > thresholds.standardizedResidual);
  assert.ok(special.cooksDistance > thresholds.cooksDistance);
  assert.ok(Math.abs(special.slopeShift) > 0.5);
});
