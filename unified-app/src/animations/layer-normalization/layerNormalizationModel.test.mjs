import assert from 'node:assert/strict';
import test from 'node:test';
import {
  batchNormalizeColumns,
  layerNormalize,
  layerNormalizeRows,
  transformerNormStep,
  vectorStats,
} from './layerNormalizationModel.js';
import { BATCH_CONTEXTS } from './layerNormalizationConstants.js';

const TOKEN = [0.2, 4.5, -2.8, 1.1, 0.7, 3.6];
const IDENTITY = {
  gamma: [1, 1, 1, 1, 1, 1],
  beta: [0, 0, 0, 0, 0, 0],
};

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

function closeVector(actual, expected, tolerance = 1e-9) {
  assert.equal(actual.length, expected.length);
  actual.forEach((value, index) => close(value, expected[index], tolerance));
}

test('LayerNorm centers one token independently across its features', () => {
  const result = layerNormalize(TOKEN, IDENTITY);
  close(result.normalizedStats.mean, 0, 1e-12);
});

test('epsilon makes normalized variance slightly below one', () => {
  const result = layerNormalize(TOKEN, IDENTITY);
  const expected = result.inputStats.variance / (result.inputStats.variance + 1e-5);
  close(result.normalizedStats.variance, expected, 1e-12);
  assert.ok(result.normalizedStats.variance < 1);
});

test('featurewise gamma and beta can destroy zero-mean unit-variance output statistics', () => {
  const result = layerNormalize(TOKEN, {
    gamma: [2, 0.5, 1.8, 0.4, 1.6, 0.7],
    beta: [0.2, -0.25, 0.05, 0.4, -0.1, 0.25],
  });
  assert.ok(Math.abs(result.outputStats.mean) > 0.01);
  assert.ok(Math.abs(result.outputStats.variance - 1) > 0.01);
});

test('changing another batch row does not change a token LayerNorm result', () => {
  const ordinary = [TOKEN, ...BATCH_CONTEXTS.ordinary.neighbors];
  const outlier = [TOKEN, ...BATCH_CONTEXTS.outlier.neighbors];
  const ordinarySelected = layerNormalizeRows(ordinary, IDENTITY)[0].normalized;
  const outlierSelected = layerNormalizeRows(outlier, IDENTITY)[0].normalized;
  closeVector(ordinarySelected, outlierSelected);
});

test('changing another batch row changes the same token BatchNorm result', () => {
  const ordinary = [TOKEN, ...BATCH_CONTEXTS.ordinary.neighbors];
  const outlier = [TOKEN, ...BATCH_CONTEXTS.outlier.neighbors];
  const ordinarySelected = batchNormalizeColumns(ordinary).rows[0];
  const outlierSelected = batchNormalizeColumns(outlier).rows[0];
  assert.ok(ordinarySelected.some((value, index) => Math.abs(value - outlierSelected[index]) > 0.1));
});

test('constant vectors stay finite because epsilon protects the denominator', () => {
  const result = layerNormalize([2, 2, 2, 2, 2, 2], IDENTITY);
  assert.deepEqual(result.normalized, [0, 0, 0, 0, 0, 0]);
  assert.ok(Number.isFinite(result.denominator));
  assert.ok(result.denominator > 0);
});

test('pre-norm branch consumes the affine LayerNorm output', () => {
  const identity = transformerNormStep(TOKEN, { mode: 'pre', ...IDENTITY, branchStrength: 1 });
  const shaped = transformerNormStep(TOKEN, {
    mode: 'pre',
    gamma: [2, 0.5, 1.8, 0.4, 1.6, 0.7],
    beta: [0.2, -0.25, 0.05, 0.4, -0.1, 0.25],
    branchStrength: 1,
  });
  assert.notDeepEqual(identity.branchOutput, shaped.branchOutput);
  assert.notDeepEqual(identity.output, shaped.output);
});

test('post-norm applies normalization after the residual update', () => {
  const result = transformerNormStep(TOKEN, { mode: 'post', ...IDENTITY, branchStrength: 1 });
  closeVector(result.output, result.normalization.output);
  assert.notDeepEqual(result.residualInput, TOKEN);
});

test('vector statistics use population variance across normalized dimensions', () => {
  const stats = vectorStats([1, 2, 3]);
  close(stats.mean, 2);
  close(stats.variance, 2 / 3);
});

test('invalid epsilon and affine shapes are rejected', () => {
  assert.throws(() => layerNormalize(TOKEN, { ...IDENTITY, epsilon: 0 }), /epsilon/);
  assert.throws(() => layerNormalize(TOKEN, { gamma: [1], beta: [0] }), /feature dimension/);
});
