export const ORDER_COLLISION_SENTENCES = {
  first: 'dog bites man',
  second: 'man bites dog',
};

function validateNgramSize(ngramSize) {
  if (!Number.isInteger(ngramSize) || ngramSize < 1) {
    throw new RangeError('ngramSize must be a positive integer.');
  }
}

export function tokenizeText(text) {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string.');
  }

  return text
    .toLowerCase()
    .match(/[\p{L}\p{N}']+/gu) || [];
}

export function toNgrams(tokens, ngramSize = 1) {
  if (!Array.isArray(tokens) || tokens.some((token) => typeof token !== 'string')) {
    throw new TypeError('tokens must be an array of strings.');
  }
  validateNgramSize(ngramSize);

  if (tokens.length < ngramSize) return [];

  return Array.from(
    { length: tokens.length - ngramSize + 1 },
    (_, index) => tokens.slice(index, index + ngramSize).join(' '),
  );
}

export function buildVocabulary(documents, ngramSize = 1) {
  if (!Array.isArray(documents) || documents.some((document) => typeof document !== 'string')) {
    throw new TypeError('documents must be an array of strings.');
  }
  validateNgramSize(ngramSize);

  return [...new Set(documents.flatMap((document) => (
    toNgrams(tokenizeText(document), ngramSize)
  )))].sort();
}

export function countVector(text, vocabulary, ngramSize = 1) {
  if (!Array.isArray(vocabulary) || vocabulary.some((term) => typeof term !== 'string')) {
    throw new TypeError('vocabulary must be an array of strings.');
  }
  validateNgramSize(ngramSize);

  const counts = new Map();
  for (const term of toNgrams(tokenizeText(text), ngramSize)) {
    counts.set(term, (counts.get(term) || 0) + 1);
  }

  return vocabulary.map((term) => counts.get(term) || 0);
}

export function vectorsEqual(first, second) {
  if (!Array.isArray(first) || !Array.isArray(second)) {
    throw new TypeError('vectors must be arrays.');
  }
  return first.length === second.length && first.every((value, index) => value === second[index]);
}

export function orderCollisionExperiment(
  firstSentence = ORDER_COLLISION_SENTENCES.first,
  secondSentence = ORDER_COLLISION_SENTENCES.second,
) {
  const documents = [firstSentence, secondSentence];
  const unigramVocabulary = buildVocabulary(documents, 1);
  const bigramVocabulary = buildVocabulary(documents, 2);
  const firstUnigram = countVector(firstSentence, unigramVocabulary, 1);
  const secondUnigram = countVector(secondSentence, unigramVocabulary, 1);
  const firstBigram = countVector(firstSentence, bigramVocabulary, 2);
  const secondBigram = countVector(secondSentence, bigramVocabulary, 2);

  return {
    unigramVocabulary,
    bigramVocabulary,
    firstUnigram,
    secondUnigram,
    firstBigram,
    secondBigram,
    unigramCollision: vectorsEqual(firstUnigram, secondUnigram),
    bigramCollision: vectorsEqual(firstBigram, secondBigram),
  };
}
