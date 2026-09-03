import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ORDER_COLLISION_SENTENCES,
  buildVocabulary,
  countVector,
  orderCollisionExperiment,
  toNgrams,
  tokenizeText,
  vectorsEqual,
} from './bagOfWordsModel.js';

test('tokenization normalizes case and punctuation', () => {
  assert.deepEqual(tokenizeText("Dog, BITES man's shoe."), ['dog', 'bites', "man's", 'shoe']);
});

test('unigram Bag of Words collides for reordered sentences', () => {
  const result = orderCollisionExperiment();
  assert.equal(result.unigramCollision, true);
  assert.deepEqual(result.firstUnigram, result.secondUnigram);
});

test('bigrams separate the reordered meaning', () => {
  const result = orderCollisionExperiment();
  assert.equal(result.bigramCollision, false);
  assert.notDeepEqual(result.firstBigram, result.secondBigram);
});

test('vocabulary is deterministic and sorted', () => {
  const vocab = buildVocabulary([
    ORDER_COLLISION_SENTENCES.first,
    ORDER_COLLISION_SENTENCES.second,
  ]);
  assert.deepEqual(vocab, ['bites', 'dog', 'man']);
});

test('count vectors preserve multiplicity but not order', () => {
  const vocabulary = ['dog', 'man'];
  assert.deepEqual(countVector('dog dog man', vocabulary), [2, 1]);
  assert.equal(vectorsEqual(
    countVector('dog man dog', vocabulary),
    countVector('dog dog man', vocabulary),
  ), true);
});

test('n-gram construction uses contiguous order', () => {
  assert.deepEqual(toNgrams(['dog', 'bites', 'man'], 2), ['dog bites', 'bites man']);
});

test('invalid Bag of Words inputs fail explicitly', () => {
  assert.throws(() => tokenizeText(null), TypeError);
  assert.throws(() => toNgrams(['a'], 0), RangeError);
  assert.throws(() => buildVocabulary([1, 2]), TypeError);
});
