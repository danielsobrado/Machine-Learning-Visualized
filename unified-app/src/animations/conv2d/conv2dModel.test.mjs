import assert from 'node:assert/strict';
import test from 'node:test';

import {
  conventionExperiment,
  crossCorrelate2d,
  flipKernel180,
  mathematicalConvolve2d,
  outputShape,
  padInput,
} from './conv2dModel.js';

const patch = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const kernel = [
  [1, 2, 0],
  [0, 0, 0],
  [0, -1, -2],
];

test('180 degree kernel flip reverses rows and columns', () => {
  assert.deepEqual(flipKernel180(kernel), [[-2, -1, 0], [0, 0, 0], [0, 2, 1]]);
});

test('framework-style cross-correlation uses the stored kernel orientation', () => {
  assert.deepEqual(crossCorrelate2d(patch, kernel), [[-21]]);
});

test('mathematical convolution flips an asymmetric kernel and changes the result', () => {
  assert.deepEqual(mathematicalConvolve2d(patch, kernel), [[21]]);
  const experiment = conventionExperiment({ input: patch, kernel });
  assert.equal(experiment.identical, false);
});

test('symmetric kernels make convolution and correlation agree', () => {
  const symmetric = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];
  const experiment = conventionExperiment({ input: patch, kernel: symmetric });
  assert.equal(experiment.identical, true);
});

test('padding and output shape follow standard discrete operator geometry', () => {
  const input = [[1, 2], [3, 4]];
  const padded = padInput(input, 1);
  assert.deepEqual(padded, [[0, 0, 0, 0], [0, 1, 2, 0], [0, 3, 4, 0], [0, 0, 0, 0]]);
  assert.deepEqual(outputShape(padded, [[1, 1], [1, 1]], 2), { rows: 2, cols: 2 });
});

test('invalid convolution configurations fail explicitly', () => {
  assert.throws(() => crossCorrelate2d([[1, 2]], [[1], [2]], 1), RangeError);
  assert.throws(() => outputShape([[1, 2], [3, 4]], [[1]], 0), RangeError);
  assert.throws(() => padInput([[1, Number.NaN]], 1), TypeError);
});
