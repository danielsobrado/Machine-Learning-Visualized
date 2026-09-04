import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bloomIndices,
  deletionExperiment,
  falsePositiveApproximation,
  insertIntoBits,
  queryBits,
} from './bloomFilterModel.js';

test('Bloom indices are deterministic', () => {
  assert.deepEqual(bloomIndices('Cat', 8), bloomIndices('Cat', 8));
});

test('inserted items always query as possibly present before deletion', () => {
  let bits = Array(8).fill(0);
  bits = insertIntoBits(bits, 'Cat');
  assert.equal(queryBits(bits, 'Cat'), true);
});

test('naive deletion can create a false negative for another inserted item', () => {
  const result = deletionExperiment();
  assert.equal(result.protectedPresentBefore, true);
  assert.equal(result.protectedPresentAfterNaiveDelete, false);
});

test('the default deletion failure is caused by a shared bit', () => {
  const result = deletionExperiment();
  assert.ok(result.deletedIndices.some((index) => result.protectedIndices.includes(index)));
});

test('counting Bloom deletion preserves the other inserted item', () => {
  const result = deletionExperiment();
  assert.equal(result.protectedPresentAfterCountingDelete, true);
});

test('counting filter keeps shared counters above zero after one item is deleted', () => {
  const result = deletionExperiment();
  const shared = result.deletedIndices.find((index) => result.protectedIndices.includes(index));
  assert.ok(result.beforeCounts[shared] >= 2);
  assert.ok(result.afterCountingDelete[shared] >= 1);
});

test('false-positive approximation matches the standard formula', () => {
  const actual = falsePositiveApproximation({ bits: 100, items: 10, hashes: 3 });
  const expected = (1 - Math.exp(-0.3)) ** 3;
  assert.ok(Math.abs(actual - expected) < 1e-12);
});

test('invalid Bloom inputs fail explicitly', () => {
  assert.throws(() => bloomIndices('', 8), TypeError);
  assert.throws(() => bloomIndices('Cat', 0), RangeError);
  assert.throws(() => falsePositiveApproximation({ bits: 0, items: 10, hashes: 3 }), RangeError);
});
