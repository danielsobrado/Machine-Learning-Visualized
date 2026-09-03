import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SCALE_TRAP_POINTS,
  TASK_SIGNAL_POINTS,
} from './pcaConstants.js';
import {
  classMeanGapOnComponent,
  covariance,
  explainedVarianceRatio,
  principalLoadings,
  standardize,
} from './pcaModel.js';

function closeTo(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

function sampleVariance(points, dimension) {
  const mean = points.reduce((sum, point) => sum + point[dimension], 0) / points.length;
  return points.reduce((sum, point) => sum + (point[dimension] - mean) ** 2, 0) / (points.length - 1);
}

test('PCA requires enough observations for covariance', () => {
  assert.throws(() => covariance([[1, 2]]), RangeError);
  assert.throws(() => standardize([[1, 2]]), RangeError);
});

test('standardization gives non-constant features unit sample variance', () => {
  const standardized = standardize(SCALE_TRAP_POINTS);
  closeTo(sampleVariance(standardized, 0), 1);
  closeTo(sampleVariance(standardized, 1), 1);
});

test('raw feature units can dominate PCA loadings while standardization balances this example', () => {
  const rawPca = covariance(SCALE_TRAP_POINTS);
  const standardizedPca = covariance(standardize(SCALE_TRAP_POINTS));
  const rawLoadings = principalLoadings(rawPca.angle).map(Math.abs);
  const standardizedLoadings = principalLoadings(standardizedPca.angle).map(Math.abs);

  assert.ok(rawLoadings[1] > 0.99);
  assert.ok(rawLoadings[0] < 0.01);
  closeTo(standardizedLoadings[0], standardizedLoadings[1]);
});

test('high explained variance can erase task-relevant class separation', () => {
  const points = TASK_SIGNAL_POINTS.map((item) => item.point);
  const pca = covariance(points);
  const pc1Gap = classMeanGapOnComponent(TASK_SIGNAL_POINTS, pca.angle);
  const pc2Gap = classMeanGapOnComponent(TASK_SIGNAL_POINTS, pca.angle + Math.PI / 2);

  assert.ok(explainedVarianceRatio(pca) > 0.98);
  closeTo(pc1Gap, 0);
  assert.ok(pc2Gap >= 0.5 - 1e-10);
});
