import { FASTTEXT_SUBWORD_DEFAULTS } from './fastTextConstants.js';

function assertWord(word, label = 'word') {
  if (typeof word !== 'string') throw new TypeError(`${label} must be a string.`);
  const normalized = word.trim().toLowerCase();
  if (!normalized) throw new RangeError(`${label} must not be empty.`);
  return normalized;
}

function assertSubwordRange(minN, maxN) {
  if (!Number.isInteger(minN) || !Number.isInteger(maxN) || minN < 1 || maxN < minN) {
    throw new RangeError('minN and maxN must be positive integers with maxN >= minN.');
  }
}

export function characterNgrams(word, {
  minN = FASTTEXT_SUBWORD_DEFAULTS.minN,
  maxN = FASTTEXT_SUBWORD_DEFAULTS.maxN,
} = {}) {
  const normalized = assertWord(word);
  assertSubwordRange(minN, maxN);
  const bounded = `<${normalized}>`;
  const ngrams = [];
  for (let size = minN; size <= maxN; size += 1) {
    for (let start = 0; start <= bounded.length - size; start += 1) {
      ngrams.push(bounded.slice(start, start + size));
    }
  }
  return ngrams;
}

export function fnv1a32(text) {
  if (typeof text !== 'string') throw new TypeError('text must be a string.');
  const bytes = new TextEncoder().encode(text);
  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function bucketIndex(ngram, bucketCount) {
  if (!Number.isInteger(bucketCount) || bucketCount < 1) {
    throw new RangeError('bucketCount must be a positive integer.');
  }
  return fnv1a32(ngram) % bucketCount;
}

export function crossWordBucketCollisions(firstWord, secondWord, bucketCount, options = {}) {
  const first = characterNgrams(firstWord, options);
  const second = characterNgrams(secondWord, options);
  const collisions = [];
  for (const firstNgram of first) {
    for (const secondNgram of second) {
      if (firstNgram === secondNgram) continue;
      const firstBucket = bucketIndex(firstNgram, bucketCount);
      if (firstBucket === bucketIndex(secondNgram, bucketCount)) {
        collisions.push({ firstNgram, secondNgram, bucket: firstBucket });
      }
    }
  }
  return collisions;
}

export function subwordSupportExperiment({
  trainingWords,
  word,
  bucketCount = FASTTEXT_SUBWORD_DEFAULTS.bucketCount,
  minN = FASTTEXT_SUBWORD_DEFAULTS.minN,
  maxN = FASTTEXT_SUBWORD_DEFAULTS.maxN,
}) {
  if (!Array.isArray(trainingWords) || trainingWords.length === 0) {
    throw new TypeError('trainingWords must be a non-empty array.');
  }
  const normalizedTraining = trainingWords.map((item, index) => assertWord(item, `trainingWords[${index}]`));
  const targetWord = assertWord(word);
  const options = { minN, maxN };
  const trainedNgrams = new Set(normalizedTraining.flatMap((item) => characterNgrams(item, options)));
  const trainedBuckets = new Set([...trainedNgrams].map((ngram) => bucketIndex(ngram, bucketCount)));
  const targetNgrams = characterNgrams(targetWord, options);
  const exactSupported = targetNgrams.filter((ngram) => trainedNgrams.has(ngram));
  const bucketSupported = targetNgrams.filter((ngram) => trainedBuckets.has(bucketIndex(ngram, bucketCount)));
  const collisionOnly = bucketSupported.filter((ngram) => !trainedNgrams.has(ngram));

  return {
    word: targetWord,
    bucketCount,
    ngrams: targetNgrams,
    exactSupported,
    bucketSupported,
    collisionOnly,
    exactSupportRatio: exactSupported.length / targetNgrams.length,
    bucketSupportRatio: bucketSupported.length / targetNgrams.length,
  };
}
