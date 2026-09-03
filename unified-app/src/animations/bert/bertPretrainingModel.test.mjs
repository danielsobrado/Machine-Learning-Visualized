import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyMlmCorruption,
  defaultMlmExperiment,
  expectedMlmCounts,
  mlmLossMask,
} from './bertPretrainingModel.js';

test('BERT MLM selects fifteen percent of tokens in expectation', () => {
  const counts = expectedMlmCounts(100);
  assert.equal(counts.selected, 15);
});

test('80/10/10 corruption probabilities apply within selected positions', () => {
  const counts = expectedMlmCounts(100);
  assert.equal(counts.mask, 12);
  assert.equal(counts.random, 1.5);
  assert.equal(counts.unchanged, 1.5);
});

test('default teaching example selects exactly three of twenty tokens', () => {
  const experiment = defaultMlmExperiment();
  assert.equal(experiment.original.length, 20);
  assert.equal(experiment.selectedIndices.length, 3);
  assert.equal(experiment.selectionRate, 0.15);
});

test('selected positions can be mask, random replacement, or unchanged', () => {
  const experiment = defaultMlmExperiment();
  assert.deepEqual(experiment.literalMaskIndices, [3]);
  assert.deepEqual(experiment.randomIndices, [10]);
  assert.deepEqual(experiment.unchangedIndices, [17]);
  assert.equal(experiment.corrupted[3], '[MASK]');
  assert.equal(experiment.corrupted[10], 'banana');
  assert.equal(experiment.corrupted[17], experiment.original[17]);
});

test('MLM loss applies to every selected prediction position, not only literal MASK tokens', () => {
  const experiment = defaultMlmExperiment();
  const lossMask = mlmLossMask(experiment.original.length, experiment.selectedIndices);
  assert.equal(lossMask[3], true);
  assert.equal(lossMask[10], true);
  assert.equal(lossMask[17], true);
  assert.equal(experiment.literalMaskIndices.length, 1);
  assert.equal(lossMask.filter(Boolean).length, 3);
});

test('unchanged selected tokens still receive prediction loss', () => {
  const experiment = applyMlmCorruption(['a', 'b', 'c'], [{ index: 1, corruption: 'unchanged' }]);
  assert.equal(experiment.corrupted[1], 'b');
  assert.equal(mlmLossMask(3, experiment.selectedIndices)[1], true);
});

test('invalid MLM configurations fail explicitly', () => {
  assert.throws(() => expectedMlmCounts(0), RangeError);
  assert.throws(() => expectedMlmCounts(100, 1.2), RangeError);
  assert.throws(() => applyMlmCorruption(['a'], [{ index: 2, corruption: 'mask' }]), RangeError);
  assert.throws(() => applyMlmCorruption(['a'], [{ index: 0, corruption: 'random' }]), TypeError);
});
