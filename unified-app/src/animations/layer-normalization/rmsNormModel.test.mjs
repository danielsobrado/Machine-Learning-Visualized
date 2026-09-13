import assert from 'node:assert/strict';
import test from 'node:test';
import {
  layerNormalize,
  rmsNormalize,
  rootMeanSquare,
} from './layerNormalizationModel.js';

test('RMSNorm scales a vector to approximately unit RMS before gamma', () => {
  const result = rmsNormalize([3, 4], { epsilon: 1e-12 });
  assert.ok(Math.abs(rootMeanSquare(result.normalized) - 1) < 1e-9);
});

test('LayerNorm removes a constant shift while RMSNorm does not', () => {
  const base = [1, 2, 4, 8];
  const shifted = base.map((value) => value + 5);
  const layerBase = layerNormalize(base, { epsilon: 1e-12 }).normalized;
  const layerShifted = layerNormalize(shifted, { epsilon: 1e-12 }).normalized;
  const rmsBase = rmsNormalize(base, { epsilon: 1e-12 }).normalized;
  const rmsShifted = rmsNormalize(shifted, { epsilon: 1e-12 }).normalized;

  layerBase.forEach((value, index) => assert.ok(Math.abs(value - layerShifted[index]) < 1e-9));
  assert.ok(rmsBase.some((value, index) => Math.abs(value - rmsShifted[index]) > 1e-3));
});

test('RMSNorm applies featurewise gamma without beta', () => {
  const result = rmsNormalize([1, 2], { gamma: [2, 0.5], epsilon: 1e-12 });
  assert.equal(result.output[0], result.normalized[0] * 2);
  assert.equal(result.output[1], result.normalized[1] * 0.5);
});
