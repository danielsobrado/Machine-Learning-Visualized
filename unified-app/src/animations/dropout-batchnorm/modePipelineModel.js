import {
  dropoutPasses,
  inferenceBatchNorm,
  summarizePasses,
  trainingBatchNorm,
} from './dropoutBatchNormModel.js';

export function modePipelinePasses({
  batch,
  selectedIndex,
  runningState,
  dropoutRate,
  trainingMode,
  passes,
  seed,
}) {
  if (!Array.isArray(batch) || batch.length === 0) throw new RangeError('batch must be non-empty');
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= batch.length) {
    throw new RangeError('selectedIndex must identify a batch observation');
  }
  if (typeof trainingMode !== 'boolean') throw new TypeError('trainingMode must be boolean');

  const selectedValue = batch[selectedIndex];
  const batchNormResult = trainingMode
    ? trainingBatchNorm(batch, { selectedIndex }).selected
    : inferenceBatchNorm(selectedValue, runningState);
  const samples = dropoutPasses({
    value: batchNormResult.output,
    dropoutRate,
    trainingMode,
    passes,
    seed,
  });

  return {
    trainingMode,
    selectedValue,
    batchNormOutput: batchNormResult.output,
    dropoutSamples: samples,
    dropoutSummary: summarizePasses(samples),
  };
}
