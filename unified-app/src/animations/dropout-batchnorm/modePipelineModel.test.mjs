import assert from 'node:assert/strict';
import test from 'node:test';
import { modePipelinePasses } from './modePipelineModel.js';

const batch = [3, 1, 2, 4];
const runningState = { mean: 0, variance: 1 };

function build(trainingMode) {
  return modePipelinePasses({
    batch,
    selectedIndex: 0,
    runningState,
    dropoutRate: 0.4,
    trainingMode,
    passes: 24,
    seed: 17,
  });
}

test('training pipeline uses current batch statistics and stochastic dropout', () => {
  const result = build(true);
  assert.ok(result.dropoutSummary.std > 0);
  assert.ok(result.dropoutSummary.keptCount > 0);
  assert.ok(result.dropoutSummary.droppedCount > 0);
});

test('evaluation pipeline uses running state and disables dropout', () => {
  const result = build(false);
  assert.equal(result.dropoutSummary.std, 0);
  assert.ok(result.dropoutSamples.every((sample) => sample.output === result.batchNormOutput));
});

test('train and eval can produce different BatchNorm outputs for the same selected value', () => {
  const training = build(true);
  const evaluation = build(false);
  assert.notEqual(training.batchNormOutput, evaluation.batchNormOutput);
  assert.equal(training.selectedValue, evaluation.selectedValue);
});
