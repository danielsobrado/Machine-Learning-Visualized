import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FASTTEXT_COLLISION_WORDS,
  FASTTEXT_TRAINING_WORDS,
} from './fastTextConstants.js';
import {
  bucketIndex,
  characterNgrams,
  crossWordBucketCollisions,
  fnv1a32,
  subwordSupportExperiment,
} from './fastTextModel.js';

test('character n-grams include boundary-marked pieces', () => {
  const ngrams = characterNgrams('cat', { minN: 3, maxN: 3 });
  assert.deepEqual(ngrams, ['<ca', 'cat', 'at>']);
});

test('FNV-1a hashing and bucket assignment are deterministic', () => {
  assert.equal(fnv1a32('cat'), fnv1a32('cat'));
  assert.equal(bucketIndex('cat', 256), bucketIndex('cat', 256));
});

test('morphologically related OOV words receive more exact subword support', () => {
  const related = subwordSupportExperiment({ trainingWords: FASTTEXT_TRAINING_WORDS, word: 'kingship' });
  const unrelated = subwordSupportExperiment({ trainingWords: FASTTEXT_TRAINING_WORDS, word: 'xylophone' });
  assert.ok(related.exactSupportRatio > unrelated.exactSupportRatio);
  assert.equal(unrelated.exactSupportRatio, 0);
});

test('tiny hash tables create collisions between unrelated subwords', () => {
  const collisions = crossWordBucketCollisions(
    FASTTEXT_COLLISION_WORDS.first,
    FASTTEXT_COLLISION_WORDS.second,
    8,
  );
  assert.ok(collisions.length > 0);
});

test('larger bucket tables reduce the selected collision counterexample', () => {
  const tiny = crossWordBucketCollisions('cat', 'zoo', 8);
  const larger = crossWordBucketCollisions('cat', 'zoo', 256);
  assert.ok(tiny.length > larger.length);
  assert.equal(larger.length, 0);
});

test('bucket support can exceed exact support because of collisions', () => {
  const experiment = subwordSupportExperiment({
    trainingWords: ['cat'],
    word: 'zoo',
    bucketCount: 8,
  });
  assert.equal(experiment.exactSupported.length, 0);
  assert.ok(experiment.collisionOnly.length > 0);
  assert.ok(experiment.bucketSupportRatio > experiment.exactSupportRatio);
});

test('invalid FastText subword configurations fail explicitly', () => {
  assert.throws(() => characterNgrams('', { minN: 3, maxN: 6 }), RangeError);
  assert.throws(() => characterNgrams('cat', { minN: 0, maxN: 3 }), RangeError);
  assert.throws(() => bucketIndex('cat', 0), RangeError);
  assert.throws(() => subwordSupportExperiment({ trainingWords: [], word: 'cat' }), TypeError);
});
