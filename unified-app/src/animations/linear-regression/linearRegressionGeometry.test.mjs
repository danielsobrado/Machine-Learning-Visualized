import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LINEAR_REGRESSION_COST_LANDSCAPE,
  LINEAR_REGRESSION_INTERACTIVE_PLOT,
} from './linearRegressionConstants.js';
import {
  costLandscapeWorldPosition,
  costParameterFromSurfaceCoordinate,
  interactivePlotBounds,
  regressionPointFromViewBox,
  regressionPointToViewBox,
} from './linearRegressionGeometry.js';

const closeTo = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} to be within ${tolerance} of ${expected}`);
};

test('interactive plot maps data corners to the visible plotting rectangle', () => {
  const bounds = interactivePlotBounds();
  const bottomLeft = regressionPointToViewBox({ x: 0, y: 0 });
  const topRight = regressionPointToViewBox({ x: 10, y: 10 });

  assert.deepEqual(bottomLeft, { x: bounds.left, y: bounds.bottom });
  assert.deepEqual(topRight, { x: bounds.right, y: bounds.top });
  assert.deepEqual(regressionPointFromViewBox(bounds.left, bounds.bottom), { x: 0, y: 0 });
  assert.deepEqual(regressionPointFromViewBox(bounds.right, bounds.top), { x: 10, y: 10 });
});

test('interactive plot rejects pointer positions in axes and margins', () => {
  const { margin, viewBox } = LINEAR_REGRESSION_INTERACTIVE_PLOT;

  assert.equal(regressionPointFromViewBox(margin.left - 1, viewBox.height / 2), null);
  assert.equal(regressionPointFromViewBox(viewBox.width / 2, viewBox.height - margin.bottom + 1), null);
});

test('cost landscape maps surface coordinates to the configured parameter ranges', () => {
  const { surface, slope, intercept } = LINEAR_REGRESSION_COST_LANDSCAPE;
  const halfSize = surface.size / 2;

  closeTo(costParameterFromSurfaceCoordinate(-halfSize, slope), slope.min);
  closeTo(costParameterFromSurfaceCoordinate(halfSize, slope), slope.max);
  closeTo(costParameterFromSurfaceCoordinate(0, intercept), (intercept.min + intercept.max) / 2);
});

test('cost marker uses the same parameter-to-world mapping as the surface', () => {
  const { surface, slope, intercept } = LINEAR_REGRESSION_COST_LANDSCAPE;
  const halfSize = surface.size / 2;
  const position = costLandscapeWorldPosition({ slope: slope.min, intercept: intercept.max, mse: 10 });

  assert.deepEqual(position, { x: -halfSize, y: 2, z: -halfSize });
});
