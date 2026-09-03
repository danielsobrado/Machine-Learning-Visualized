import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AFFINE_STACK,
  XOR_INPUTS,
  affineStackExperiment,
  applyAffine,
  composeAffineLayers,
  xorExpressivityTable,
  xorWithRelu,
} from './neuralNetworkExpressivityModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('two affine layers collapse to one affine transform', () => {
  for (const input of [[0, 0], [1, 0], [0, 1], [2, -3]]) {
    const experiment = affineStackExperiment(input, AFFINE_STACK);
    close(experiment.stackedOutput[0], experiment.collapsedOutput[0]);
  }
});

test('composed affine parameters reproduce the explicit stack', () => {
  const collapsed = composeAffineLayers(
    AFFINE_STACK.firstWeights,
    AFFINE_STACK.firstBias,
    AFFINE_STACK.secondWeights,
    AFFINE_STACK.secondBias,
  );
  const input = [1.25, -0.75];
  const explicit = applyAffine(
    applyAffine(input, AFFINE_STACK.firstWeights, AFFINE_STACK.firstBias),
    AFFINE_STACK.secondWeights,
    AFFINE_STACK.secondBias,
  );
  const compact = applyAffine(input, collapsed.weights, collapsed.bias);
  close(explicit[0], compact[0]);
});

test('a tiny ReLU hidden layer represents XOR exactly on binary inputs', () => {
  for (const input of XOR_INPUTS) {
    const result = xorWithRelu(input);
    assert.equal(result.output, input[0] ^ input[1]);
  }
});

test('XOR expressivity table has four exact predictions', () => {
  const table = xorExpressivityTable();
  assert.equal(table.length, 4);
  assert.equal(table.every((row) => row.output === row.target), true);
});

test('ReLU XOR representation activates one hidden unit for unequal bits', () => {
  assert.deepEqual(xorWithRelu([1, 0]).hidden, [1, 0]);
  assert.deepEqual(xorWithRelu([0, 1]).hidden, [0, 1]);
  assert.deepEqual(xorWithRelu([1, 1]).hidden, [0, 0]);
});

test('invalid affine and XOR shapes fail explicitly', () => {
  assert.throws(() => applyAffine([1, 2], [[1]], [0]), RangeError);
  assert.throws(() => xorWithRelu([1]), RangeError);
  assert.throws(() => xorWithRelu([1, Number.NaN]), TypeError);
});
