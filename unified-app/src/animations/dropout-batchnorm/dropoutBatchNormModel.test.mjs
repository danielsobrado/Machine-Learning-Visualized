import assert from 'node:assert/strict';
import test from 'node:test';

import {
  batchNorm,
  batchNormModeComparison,
  dropoutPasses,
  invertedDropout,
  layerFlow,
  normalize,
  summarizePasses,
} from './dropoutBatchNormModel.js';

test('batch normalization follows the displayed normalize, scale, and shift calculation', () => {
  assert.equal(normalize(3, 1, 2), 1);
  const result = batchNorm(3, { mean: 1, std: 2, gamma: 1.5, beta: -0.5 });

  assert.equal(result.normalized, 1);
  assert.equal(result.output, 1);
});

test('training and inference BatchNorm use different statistics sources', () => {
  const comparison = batchNormModeComparison({
    activation: 3,
    batchMean: 1,
    batchStd: 2,
    runningMean: 0,
    runningStd: 1,
    gamma: 1,
    beta: 0,
  });

  assert.equal(comparison.training.output, 1);
  assert.equal(comparison.inference.output, 3);
  assert.equal(comparison.modeGap, 2);
});

test('inverted dropout scales kept activations and masks dropped activations', () => {
  assert.equal(invertedDropout(2, 0.5, true), 4);
  assert.equal(invertedDropout(2, 0.5, false), 0);
});

test('training dropout produces stochastic sampled outputs rather than only an expectation', () => {
  const passes = dropoutPasses({
    value: 2,
    dropoutRate: 0.4,
    trainingMode: true,
    passes: 12,
    seed: 17,
  });
  const outputs = new Set(passes.map((pass) => pass.output));
  const summary = summarizePasses(passes);

  assert.ok(outputs.has(0));
  assert.ok(outputs.has(2 / 0.6));
  assert.ok(summary.droppedCount > 0);
  assert.ok(summary.keptCount > 0);
  assert.ok(summary.std > 0);
});

test('normal inference disables dropout and is repeatable', () => {
  const passes = dropoutPasses({
    value: 2.75,
    dropoutRate: 0.8,
    trainingMode: false,
    passes: 12,
    seed: 17,
  });
  const summary = summarizePasses(passes);

  assert.ok(passes.every((pass) => pass.kept));
  assert.ok(passes.every((pass) => pass.output === 2.75));
  assert.equal(summary.std, 0);
  assert.equal(summary.droppedCount, 0);
});

test('layer flow switches both BatchNorm statistics and dropout behavior with mode', () => {
  const training = layerFlow({
    activation: 3,
    batchMean: 1,
    batchStd: 2,
    runningMean: 0,
    runningStd: 1,
    dropoutRate: 0.4,
    trainingMode: true,
  });
  const inference = layerFlow({
    activation: 3,
    batchMean: 1,
    batchStd: 2,
    runningMean: 0,
    runningStd: 1,
    dropoutRate: 0.4,
    trainingMode: false,
  });

  assert.equal(training.statsSource, 'current batch');
  assert.equal(training.batchNormOutput, 1);
  assert.ok(training.passSummary.std > 0);
  assert.equal(inference.statsSource, 'running statistics');
  assert.equal(inference.batchNormOutput, 3);
  assert.equal(inference.passSummary.std, 0);
});

test('expected dropout output is distinct from individual training samples', () => {
  const flow = layerFlow({
    activation: 3,
    batchMean: 1,
    batchStd: 2,
    dropoutRate: 0.4,
    trainingMode: true,
  });

  assert.equal(flow.expectedDropoutOutput, flow.batchNormOutput);
  assert.ok(flow.passes.some((pass) => pass.output !== flow.expectedDropoutOutput));
});

test('model helpers reject invalid normalization and dropout inputs', () => {
  assert.throws(() => normalize(1, 0, 0), RangeError);
  assert.throws(() => invertedDropout(1, -0.1, true), RangeError);
  assert.throws(() => invertedDropout(1, 0.9, true), RangeError);
  assert.throws(() => invertedDropout(1, 0.2, 'yes'), TypeError);
  assert.throws(() => dropoutPasses({ value: 1, dropoutRate: 0.2, trainingMode: true, passes: 0 }), RangeError);
  assert.throws(() => dropoutPasses({ value: 1, dropoutRate: 0.2, trainingMode: true, seed: 1.5 }), TypeError);
});
