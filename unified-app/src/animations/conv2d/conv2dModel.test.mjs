import assert from 'node:assert/strict';
import test from 'node:test';

import {
  conventionExperiment,
  conv2dLayerSummary,
  conv2dParameterCount,
  convOutputSize,
  crossCorrelate2d,
  effectiveKernelSize,
  flipKernel180,
  mathematicalConvolve2d,
  outputShape,
  padInput,
  stackedReceptiveField,
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

test('dilation expands the effective kernel footprint', () => {
  assert.equal(effectiveKernelSize(3, 2), 5);
  assert.equal(convOutputSize({ inputSize: 15, kernelSize: 3, stride: 2, padding: 2, dilation: 2 }), 8);
});

test('stacked stride-two 3x3 convolutions grow receptive field from 1 to 3 to 7', () => {
  assert.deepEqual(stackedReceptiveField([
    { kernelSize: 3, stride: 2, dilation: 1 },
    { kernelSize: 3, stride: 2, dilation: 1 },
  ]), {
    receptiveField: 7,
    jump: 4,
    trace: [
      { layer: 1, effectiveKernel: 3, receptiveField: 3, jump: 2 },
      { layer: 2, effectiveKernel: 3, receptiveField: 7, jump: 4 },
    ],
  });
});

test('Conv2D parameter count spans all input channels but not spatial locations', () => {
  assert.deepEqual(conv2dParameterCount({
    inputChannels: 3,
    outputChannels: 32,
    kernelHeight: 3,
    kernelWidth: 3,
    useBias: true,
  }), { weights: 864, biases: 32, total: 896 });
});

test('full layer summary preserves batch and sets channels from filter count', () => {
  assert.deepEqual(conv2dLayerSummary({
    batchSize: 10,
    inputChannels: 3,
    inputHeight: 32,
    inputWidth: 40,
    outputChannels: 24,
    kernelSize: 5,
    stride: 2,
    padding: 2,
    dilation: 1,
    useBias: true,
  }), {
    inputShape: [10, 3, 32, 40],
    weightShape: [24, 3, 5, 5],
    outputShape: [10, 24, 16, 20],
    effectiveKernel: 5,
    parameters: { weights: 1800, biases: 24, total: 1824 },
  });
});

test('invalid convolution configurations fail explicitly', () => {
  assert.throws(() => crossCorrelate2d([[1, 2]], [[1], [2]], 1), RangeError);
  assert.throws(() => outputShape([[1, 2], [3, 4]], [[1]], 0), RangeError);
  assert.throws(() => padInput([[1, Number.NaN]], 1), TypeError);
  assert.throws(() => convOutputSize({ inputSize: 3, kernelSize: 5 }), RangeError);
  assert.throws(() => conv2dParameterCount({ inputChannels: 3, outputChannels: 2, kernelHeight: 3, kernelWidth: 3, useBias: 'yes' }), TypeError);
  assert.throws(() => stackedReceptiveField([]), TypeError);
});
