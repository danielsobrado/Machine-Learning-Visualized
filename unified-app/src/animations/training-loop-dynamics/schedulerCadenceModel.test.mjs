import assert from 'node:assert/strict';
import test from 'node:test';
import {
  learningRateAtStep,
  schedulerCadenceSummary,
  warmupProgress,
} from './schedulerCadenceModel.js';

test('micro-batch scheduler stepping compresses warmup by accumulation factor', () => {
  const summary = schedulerCadenceSummary({ accumulationSteps: 8, warmupOptimizerSteps: 1000 });
  assert.equal(summary.correct.optimizerStepsUntilTarget, 1000);
  assert.equal(summary.correct.microBatchesUntilTarget, 8000);
  assert.equal(summary.microBatchBug.completedOptimizerStepsAtTarget, 125);
  assert.equal(summary.microBatchBug.microBatchesIntoNextStep, 0);
  assert.equal(summary.compressionFactor, 8);
});

test('correct and broken cadence produce different warmup progress at the same optimizer step', () => {
  assert.equal(warmupProgress({ optimizerStep: 125, accumulationSteps: 8, warmupOptimizerSteps: 1000, cadence: 'optimizer-step' }), 0.125);
  assert.equal(warmupProgress({ optimizerStep: 125, accumulationSteps: 8, warmupOptimizerSteps: 1000, cadence: 'micro-batch' }), 1);
});

test('learning rate follows scheduler progress rather than micro-batch count in the correct loop', () => {
  const learningRate = learningRateAtStep({
    optimizerStep: 100,
    accumulationSteps: 4,
    warmupOptimizerSteps: 1000,
    cadence: 'optimizer-step',
    targetLearningRate: 0.002,
  });
  assert.equal(learningRate, 0.0002);
});

test('non-divisible warmup exposes a partial accumulation group', () => {
  const summary = schedulerCadenceSummary({ accumulationSteps: 6, warmupOptimizerSteps: 1000 });
  assert.equal(summary.microBatchBug.completedOptimizerStepsAtTarget, 166);
  assert.equal(summary.microBatchBug.microBatchesIntoNextStep, 4);
});

test('invalid cadence fails explicitly', () => {
  assert.throws(() => warmupProgress({ optimizerStep: 1, accumulationSteps: 1, warmupOptimizerSteps: 10, cadence: 'epoch' }), RangeError);
});
