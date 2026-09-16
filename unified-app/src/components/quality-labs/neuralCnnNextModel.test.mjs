import test from 'node:test';
import assert from 'node:assert/strict';

import {
  activationFamilyPoint,
  buildActivationChainComparison,
  buildConvReluBackward,
  buildMultiChannelConv,
  buildPoolingComparison,
} from './neuralCnnNextModel.js';

test('activation presets expose vanishing and dead-gradient behavior', () => {
  const rows = buildActivationChainComparison();
  const byId = Object.fromEntries(rows.map((row) => [row.id, row]));

  assert.ok(byId.sigmoid.finalGradient < 1e-10);
  assert.ok(byId.tanh.finalGradient < 1e-10);
  assert.equal(byId['relu-active'].finalGradient, 1);
  assert.equal(byId['relu-dead'].finalGradient, 0);
  assert.ok(byId.gelu.finalGradient > byId.sigmoid.finalGradient);
});

test('PReLU learns a negative slope while ELU keeps a smooth positive derivative', () => {
  const point = activationFamilyPoint({ x: -2, preluSlope: 0.25, leakySlope: 0.1, eluAlpha: 1 });

  assert.equal(point.relu.derivative, 0);
  assert.equal(point.leakyRelu.derivative, 0.1);
  assert.equal(point.prelu.derivative, 0.25);
  assert.ok(point.elu.derivative > 0 && point.elu.derivative < 1);
  assert.ok(point.elu.value > -1 && point.elu.value < 0);
});

test('multi-channel convolution sums channel contributions and separates filters', () => {
  const filters = buildMultiChannelConv();
  assert.equal(filters.length, 2);

  for (const filter of filters) {
    const expected = filter.channelContributions[0][0][0]
      + filter.channelContributions[1][0][0]
      + filter.bias;
    assert.equal(filter.output[0][0], expected);
  }
  assert.notDeepEqual(filters[0].output, filters[1].output);
});

test('Conv plus ReLU backward blocks clipped cells and accumulates active gradients', () => {
  const result = buildConvReluBackward();
  const flatConv = result.convolution.flat();
  const flatGate = result.gate.flat();

  flatConv.forEach((value, index) => {
    assert.equal(flatGate[index], value > 0 ? 1 : 0);
  });
  assert.equal(result.dBias, result.dPreActivation.flat().reduce((sum, value) => sum + value, 0));
  assert.ok(result.dPreActivation.flat().some((value) => value === 0));
  assert.ok(result.dPreActivation.flat().some((value) => value !== 0));
});

test('pooling families route the same upstream gradient differently', () => {
  const result = buildPoolingComparison();

  assert.equal(result.max.value, 4);
  assert.equal(result.average.value, 2.5);
  assert.equal(result.stridedConv.value, 3);
  assert.equal(result.max.inputGradient.flat().filter(Boolean).length, 1);
  assert.deepEqual(result.average.inputGradient, [[0.25, 0.25], [0.25, 0.25]]);
  assert.deepEqual(result.stridedConv.inputGradient, [[0.1, 0.4], [0.2, 0.3]]);
});
