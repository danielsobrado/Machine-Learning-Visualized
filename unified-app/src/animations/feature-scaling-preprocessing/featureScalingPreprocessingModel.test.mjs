import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BASE_POINTS,
  OUTLIER,
  bounds,
  buildPoints,
  distanceBreakdown,
  fitScaler,
  projectIsotropic,
  scaleMagnitude,
  transformPoint,
  transformValue,
} from './featureScalingPreprocessingModel.js';

function closeTo(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

test('buildPoints makes outlier membership explicit', () => {
  const trainingOutlier = buildPoints(true, 'train').find((point) => point.id === OUTLIER.id);
  const validationOutlier = buildPoints(true, 'validation').find((point) => point.id === OUTLIER.id);

  assert.equal(trainingOutlier.split, 'train');
  assert.equal(validationOutlier.split, 'validation');
  assert.equal(buildPoints(false, 'train').length, BASE_POINTS.length);
  assert.throws(() => buildPoints(true, 'test'), /Unsupported outlier split/);
});

test('training-only scaler reproduces the baseline fitted statistics', () => {
  const scaler = fitScaler(buildPoints(false), false);

  closeTo(scaler.age.mean, 37.25);
  closeTo(scaler.age.std, Math.sqrt(128.1875));
  closeTo(scaler.income.mean, 65000);
  closeTo(scaler.income.std, Math.sqrt(465000000));
  assert.equal(scaler.income.max, 94000);
  assert.equal(scaler.income.median, 64000);
  assert.equal(scaler.income.iqr, 32000);
});

test('a training outlier changes a safe fitted scaler while a validation outlier does not', () => {
  const baseline = fitScaler(buildPoints(false), false);
  const trainingOutlier = fitScaler(buildPoints(true, 'train'), false);
  const validationOutlier = fitScaler(buildPoints(true, 'validation'), false);

  assert.equal(trainingOutlier.income.max, OUTLIER.income);
  assert.ok(trainingOutlier.income.mean > baseline.income.mean);
  assert.deepEqual(validationOutlier, baseline);
});

test('fitting on all data lets a validation outlier contaminate preprocessing parameters', () => {
  const safe = fitScaler(buildPoints(true, 'validation'), false);
  const leaky = fitScaler(buildPoints(true, 'validation'), true);

  assert.equal(safe.income.max, 94000);
  assert.equal(leaky.income.max, OUTLIER.income);
  assert.ok(leaky.income.mean > safe.income.mean);
  assert.ok(leaky.income.std > safe.income.std);
});

test('min-max scaling anchors training endpoints while held-out values may exceed the fitted range', () => {
  const scaler = fitScaler(buildPoints(false), false);
  const trainMinimum = BASE_POINTS.find((point) => point.id === 'A');
  const trainMaximum = BASE_POINTS.find((point) => point.id === 'D');

  assert.equal(transformPoint(trainMinimum, scaler, 'minmax').x, 0);
  assert.equal(transformPoint(trainMaximum, scaler, 'minmax').x, 1);
  assert.ok(transformValue(112000, scaler.income, 'minmax') > 1);
});

test('robust scale magnitude moves less than standard deviation or range under a training outlier', () => {
  const baseline = fitScaler(buildPoints(false), false).income;
  const contaminated = fitScaler(buildPoints(true, 'train'), false).income;

  const robustRatio = scaleMagnitude(contaminated, 'robust') / scaleMagnitude(baseline, 'robust');
  const standardRatio = scaleMagnitude(contaminated, 'standard') / scaleMagnitude(baseline, 'standard');
  const minmaxRatio = scaleMagnitude(contaminated, 'minmax') / scaleMagnitude(baseline, 'minmax');

  assert.ok(robustRatio < standardRatio);
  assert.ok(robustRatio < minmaxRatio);
});

test('standardization changes which feature dominates Euclidean distance', () => {
  const scaler = fitScaler(buildPoints(false), false);
  const pointB = BASE_POINTS.find((point) => point.id === 'B');
  const pointF = BASE_POINTS.find((point) => point.id === 'F');
  const raw = distanceBreakdown(
    transformPoint(pointB, scaler, 'raw'),
    transformPoint(pointF, scaler, 'raw'),
  );
  const standardized = distanceBreakdown(
    transformPoint(pointB, scaler, 'standard'),
    transformPoint(pointF, scaler, 'standard'),
  );

  assert.ok(raw.yShare > 0.99999);
  assert.ok(standardized.yShare < 0.5);
  assert.ok(standardized.xShare > 0.5);
});

test('isotropic projection preserves equal metric units on both axes', () => {
  const box = bounds([
    { x: 0, y: 0 },
    { x: 2, y: 4 },
  ]);
  const viewport = { width: 200, height: 200, pad: 20 };
  const origin = projectIsotropic({ x: 0, y: 0 }, box, viewport);
  const twoX = projectIsotropic({ x: 2, y: 0 }, box, viewport);
  const twoY = projectIsotropic({ x: 0, y: 2 }, box, viewport);

  closeTo(Math.abs(twoX.cx - origin.cx), Math.abs(twoY.cy - origin.cy));
});

test('robust scaling uses median and iqr rather than mean and standard deviation', () => {
  const scaler = fitScaler(buildPoints(false), false);
  const analyst = BASE_POINTS.find((point) => point.id === 'F');

  closeTo(transformPoint(analyst, scaler, 'standard').y, (58000 - 65000) / Math.sqrt(465000000));
  closeTo(transformPoint(analyst, scaler, 'robust').y, (58000 - 64000) / 32000);
});
