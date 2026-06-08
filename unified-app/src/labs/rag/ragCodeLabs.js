export const RAG_CODE_LABS = [
  {
    id: 'rag-count-tokens',
    stepLabel: '56.1',
    group: 'Token counts and chunking',
    title: 'Count tokens',
    concept: 'A simple token budget starts by counting how many tokens a piece of text uses.',
    objective: 'Return the number of whitespace-separated tokens.',
    difficulty: 'warmup',
    starterCode: `/**
 * Count whitespace-separated tokens in a text string.
 * @param {string} text - Raw text (e.g. 'the cat sat').
 * @returns {number} Token count; 0 for empty or whitespace-only text.
 */
function countTokens(text) {
  // trimmed: string — text with leading/trailing whitespace removed
  const trimmed = text.trim();

  if (trimmed === '') return 0;

  // TODO: split on whitespace and return the number of pieces.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('three words', countTokens('the cat sat'), 3);
check('extra spaces', countTokens('  the   cat   sat  '), 3);
check('empty string', countTokens(''), 0);
check('one token', countTokens('hello'), 1);

return results;`,
    hints: [
      'Use a regular expression that matches one or more whitespace characters.',
      'trimmed.split(/\\\\s+/) gives an array of simple tokens.',
      'return trimmed.split(/\\\\s+/).length;',
    ],
    solution: `/**
 * Count whitespace-separated tokens in a text string.
 * @param {string} text - Raw text (e.g. 'the cat sat').
 * @returns {number} Token count; 0 for empty or whitespace-only text.
 */
function countTokens(text) {
  // trimmed: string — text with leading/trailing whitespace removed
  const trimmed = text.trim();

  if (trimmed === '') return 0;

  return trimmed.split(/\\s+/).length;
}`,
    explanation: 'Real tokenizers are more complex than whitespace splitting, but token-budget reasoning starts with counting how much context each text piece consumes.',
  },

  {
    id: 'rag-chunk-fits-budget',
    stepLabel: '56.2',
    group: 'Token counts and chunking',
    title: 'Does this chunk fit?',
    concept: 'A chunk can be packed only if its token count is within the remaining context budget.',
    objective: 'Return whether chunkTokens is less than or equal to remainingBudget.',
    difficulty: 'warmup',
    starterCode: `/**
 * Check whether a chunk fits in the remaining context budget.
 * @param {number} chunkTokens - Token count of the candidate chunk.
 * @param {number} remainingBudget - Tokens still available in the context window.
 * @returns {boolean} True when chunkTokens <= remainingBudget.
 */
function chunkFits(chunkTokens, remainingBudget) {
  // TODO: return true when the chunk fits in the remaining budget.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('fits exactly', chunkFits(100, 100), true);
check('fits under budget', chunkFits(80, 100), true);
check('too large', chunkFits(120, 100), false);

return results;`,
    hints: [
      'A chunk fits when it is not larger than the remaining budget.',
      'Use <=.',
      'return chunkTokens <= remainingBudget;',
    ],
    solution: `/**
 * Check whether a chunk fits in the remaining context budget.
 * @param {number} chunkTokens - Token count of the candidate chunk.
 * @param {number} remainingBudget - Tokens still available in the context window.
 * @returns {boolean} True when chunkTokens <= remainingBudget.
 */
function chunkFits(chunkTokens, remainingBudget) {
  return chunkTokens <= remainingBudget;
}`,
    explanation: 'RAG systems often fail not because evidence is unavailable, but because the right chunks do not fit into the final prompt.',
  },

  {
    id: 'rag-fixed-size-chunks',
    stepLabel: '56.3',
    group: 'Token counts and chunking',
    title: 'Fixed-size chunks',
    concept: 'Chunking splits a token list into smaller windows.',
    objective: 'Push slices of size chunkSize.',
    difficulty: 'core',
    starterCode: `/**
 * Split a token list into fixed-size windows.
 * @param {string[]} tokens - Ordered tokens from a document.
 * @param {number} chunkSize - Maximum tokens per chunk (last chunk may be smaller).
 * @returns {string[][]} Array of token slices.
 */
function fixedChunks(tokens, chunkSize) {
  // chunks: string[][] — starts empty; each entry is one token window
  const chunks = [];

  for (let start = 0; start < tokens.length; start += chunkSize) {
    // TODO: push tokens from start to start + chunkSize.
    chunks.push([]);
  }

  return chunks;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('chunks of 2', fixedChunks(['a', 'b', 'c', 'd', 'e'], 2), [['a', 'b'], ['c', 'd'], ['e']]);
check('chunks of 3', fixedChunks(['a', 'b', 'c', 'd'], 3), [['a', 'b', 'c'], ['d']]);
check('one chunk', fixedChunks(['a', 'b'], 5), [['a', 'b']]);

return results;`,
    hints: [
      'Array.slice(start, end) extracts a window.',
      'The end should be start + chunkSize.',
      'chunks.push(tokens.slice(start, start + chunkSize));',
    ],
    solution: `/**
 * Split a token list into fixed-size windows.
 * @param {string[]} tokens - Ordered tokens from a document.
 * @param {number} chunkSize - Maximum tokens per chunk (last chunk may be smaller).
 * @returns {string[][]} Array of token slices.
 */
function fixedChunks(tokens, chunkSize) {
  // chunks: string[][] — starts empty; each entry is one token window
  const chunks = [];

  for (let start = 0; start < tokens.length; start += chunkSize) {
    chunks.push(tokens.slice(start, start + chunkSize));
  }

  return chunks;
}`,
    explanation: 'Fixed chunks are simple, but they can split important evidence across boundaries.',
  },

  {
    id: 'rag-overlapping-chunks',
    stepLabel: '56.4',
    group: 'Token counts and chunking',
    title: 'Overlapping chunks',
    concept: 'Overlap preserves context near chunk boundaries.',
    objective: 'Advance by chunkSize - overlap instead of chunkSize.',
    difficulty: 'challenge',
    starterCode: `/**
 * Split tokens into overlapping windows to preserve boundary context.
 * @param {string[]} tokens - Ordered tokens from a document.
 * @param {number} chunkSize - Maximum tokens per chunk.
 * @param {number} overlap - Shared tokens between consecutive chunks.
 * @returns {string[][]} Overlapping token slices.
 */
function overlappingChunks(tokens, chunkSize, overlap) {
  // chunks: string[][] — starts empty; each entry is one overlapping window
  const chunks = [];
  // step: number — how far to advance the window start each iteration
  const step = chunkSize - overlap;

  for (let start = 0; start < tokens.length; start += step) {
    // TODO: push a chunk from start to start + chunkSize.
    chunks.push([]);
  }

  return chunks;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('chunk size 3 overlap 1', overlappingChunks(['a', 'b', 'c', 'd', 'e'], 3, 1), [['a', 'b', 'c'], ['c', 'd', 'e'], ['e']]);
check('chunk size 4 overlap 2', overlappingChunks(['a', 'b', 'c', 'd', 'e'], 4, 2), [['a', 'b', 'c', 'd'], ['c', 'd', 'e'], ['e']]);

return results;`,
    hints: [
      'The step is already computed.',
      'Each chunk is still tokens.slice(start, start + chunkSize).',
      'chunks.push(tokens.slice(start, start + chunkSize));',
    ],
    solution: `/**
 * Split tokens into overlapping windows to preserve boundary context.
 * @param {string[]} tokens - Ordered tokens from a document.
 * @param {number} chunkSize - Maximum tokens per chunk.
 * @param {number} overlap - Shared tokens between consecutive chunks.
 * @returns {string[][]} Overlapping token slices.
 */
function overlappingChunks(tokens, chunkSize, overlap) {
  // chunks: string[][] — starts empty; each entry is one overlapping window
  const chunks = [];
  // step: number — how far to advance the window start each iteration
  const step = chunkSize - overlap;

  for (let start = 0; start < tokens.length; start += step) {
    chunks.push(tokens.slice(start, start + chunkSize));
  }

  return chunks;
}`,
    explanation: 'Overlap reduces boundary loss, but it also increases total retrieved token cost.',
  },

  {
    id: 'bow-build-vocabulary',
    stepLabel: '57.1',
    group: 'Bag-of-words vectors',
    title: 'Build vocabulary',
    concept: 'A bag-of-words vector needs a fixed vocabulary of known terms.',
    objective: 'Return the unique words in first-seen order.',
    difficulty: 'core',
    starterCode: `/**
 * Build a vocabulary from a tokenized document.
 * @param {string[]} tokens - Ordered words from one document (e.g. ['cat', 'dog', 'cat']).
 * @returns {string[]} Unique words in first-seen order.
 */
function buildVocabulary(tokens) {
  // vocab: string[] — starts empty; collect each distinct word once, in first-seen order
  const vocab = [];

  for (let i = 0; i < tokens.length; i++) {
    // token: string — current word at position i in tokens
    const token = tokens[i];

    // TODO: push token only if it is not already in vocab.
  }

  return vocab;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('unique words', buildVocabulary(['cat', 'dog', 'cat', 'fish']), ['cat', 'dog', 'fish']);
check('one word repeated', buildVocabulary(['a', 'a', 'a']), ['a']);
check('already unique', buildVocabulary(['a', 'b', 'c']), ['a', 'b', 'c']);

return results;`,
    hints: [
      'Use vocab.includes(token) to check if it is already present.',
      'Only push when it is not included.',
      'if (!vocab.includes(token)) vocab.push(token);',
    ],
    solution: `/**
 * Build a vocabulary from a tokenized document.
 * @param {string[]} tokens - Ordered words from one document (e.g. ['cat', 'dog', 'cat']).
 * @returns {string[]} Unique words in first-seen order.
 */
function buildVocabulary(tokens) {
  // vocab: string[] — starts empty; collect each distinct word once, in first-seen order
  const vocab = [];

  for (let i = 0; i < tokens.length; i++) {
    // token: string — current word at position i in tokens
    const token = tokens[i];

    if (!vocab.includes(token)) vocab.push(token);
  }

  return vocab;
}`,
    explanation: 'Vocabulary fixes the coordinate system for text vectors.',
  },

  {
    id: 'bow-count-word',
    stepLabel: '57.2',
    group: 'Bag-of-words vectors',
    title: 'Count one word',
    concept: 'A bag-of-words entry counts how often a vocabulary word appears.',
    objective: 'Count occurrences of target in tokens.',
    difficulty: 'warmup',
    starterCode: `/**
 * Count how many times a target word appears in a token list.
 * @param {string[]} tokens - Ordered words from one document.
 * @param {string} target - Vocabulary word to count (e.g. 'cat').
 * @returns {number} Occurrence count of target in tokens.
 */
function countWord(tokens, target) {
  // count: number — running tally of matches; starts at 0
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    // TODO: increment count when tokens[i] equals target.
  }

  return count;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('cat count', countWord(['cat', 'dog', 'cat'], 'cat'), 2);
check('dog count', countWord(['cat', 'dog', 'cat'], 'dog'), 1);
check('missing count', countWord(['cat', 'dog'], 'fish'), 0);

return results;`,
    hints: [
      'Use an if statement.',
      'If tokens[i] === target, add one.',
      'if (tokens[i] === target) count += 1;',
    ],
    solution: `/**
 * Count how many times a target word appears in a token list.
 * @param {string[]} tokens - Ordered words from one document.
 * @param {string} target - Vocabulary word to count (e.g. 'cat').
 * @returns {number} Occurrence count of target in tokens.
 */
function countWord(tokens, target) {
  // count: number — running tally of matches; starts at 0
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}`,
    explanation: 'Bag-of-words ignores order and keeps only word counts.',
  },

  {
    id: 'bow-vectorize-document',
    stepLabel: '57.3',
    group: 'Bag-of-words vectors',
    title: 'Vectorize document',
    concept: 'A bag-of-words vector has one count per vocabulary word.',
    objective: 'Push countWord(tokens, vocab[i]) for each vocabulary word.',
    difficulty: 'core',
    starterCode: `/**
 * Count how many times a target word appears in a token list.
 * @param {string[]} tokens - Ordered words from one document.
 * @param {string} target - Vocabulary word to count.
 * @returns {number} Occurrence count of target in tokens.
 */
function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}

/**
 * Turn a tokenized document into a bag-of-words count vector.
 * @param {string[]} tokens - Ordered words from one document.
 * @param {string[]} vocab - Fixed vocabulary; vector index i matches vocab[i].
 * @returns {number[]} Count per vocabulary word (same length as vocab).
 */
function bowVector(tokens, vocab) {
  // vector: number[] — starts empty; one count per vocab word
  const vector = [];

  for (let i = 0; i < vocab.length; i++) {
    // TODO: push the count of vocab[i] in tokens.
    vector.push(0);
  }

  return vector;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

const vocab = ['cat', 'dog', 'fish'];

check('cat dog cat', bowVector(['cat', 'dog', 'cat'], vocab), [2, 1, 0]);
check('fish fish', bowVector(['fish', 'fish'], vocab), [0, 0, 2]);
check('empty document', bowVector([], vocab), [0, 0, 0]);

return results;`,
    hints: [
      'Each vector coordinate corresponds to one vocabulary word.',
      'Use countWord(tokens, vocab[i]).',
      'vector.push(countWord(tokens, vocab[i]));',
    ],
    solution: `/**
 * Count how many times a target word appears in a token list.
 * @param {string[]} tokens - Ordered words from one document.
 * @param {string} target - Vocabulary word to count.
 * @returns {number} Occurrence count of target in tokens.
 */
function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}

/**
 * Turn a tokenized document into a bag-of-words count vector.
 * @param {string[]} tokens - Ordered words from one document.
 * @param {string[]} vocab - Fixed vocabulary; vector index i matches vocab[i].
 * @returns {number[]} Count per vocabulary word (same length as vocab).
 */
function bowVector(tokens, vocab) {
  // vector: number[] — starts empty; one count per vocab word
  const vector = [];

  for (let i = 0; i < vocab.length; i++) {
    vector.push(countWord(tokens, vocab[i]));
  }

  return vector;
}`,
    explanation: 'Text becomes a vector by counting vocabulary terms.',
  },

  {
    id: 'bow-normalize-counts',
    stepLabel: '57.4',
    group: 'Bag-of-words vectors',
    title: 'Normalize counts',
    concept: 'Normalizing counts can reduce the effect of document length.',
    objective: 'Divide each count by total count.',
    difficulty: 'core',
    starterCode: `/**
 * Scale raw word counts into proportions that sum to 1.
 * @param {number[]} counts - Non-negative bag-of-words counts (e.g. [2, 1, 0]).
 * @returns {number[]} Each count divided by the total; all zeros when total is 0.
 */
function normalizeCounts(counts) {
  // total: number — sum of all counts in the document
  const total = counts.reduce((sum, value) => sum + value, 0);

  if (total === 0) return counts.map(() => 0);

  // normalized: number[] — starts empty; proportional counts
  const normalized = [];

  for (let i = 0; i < counts.length; i++) {
    // TODO: divide counts[i] by total.
    normalized.push(counts[i]);
  }

  return normalized;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('normalize [2,1,0]', normalizeCounts([2, 1, 0]), [2 / 3, 1 / 3, 0]);
check('normalize [0,0,2]', normalizeCounts([0, 0, 2]), [0, 0, 1]);
check('normalize empty counts', normalizeCounts([0, 0, 0]), [0, 0, 0]);

return results;`,
    hints: [
      'total is already computed.',
      'Each normalized value is counts[i] / total.',
      'normalized.push(counts[i] / total);',
    ],
    solution: `/**
 * Scale raw word counts into proportions that sum to 1.
 * @param {number[]} counts - Non-negative bag-of-words counts (e.g. [2, 1, 0]).
 * @returns {number[]} Each count divided by the total; all zeros when total is 0.
 */
function normalizeCounts(counts) {
  // total: number — sum of all counts in the document
  const total = counts.reduce((sum, value) => sum + value, 0);

  if (total === 0) return counts.map(() => 0);

  // normalized: number[] — starts empty; proportional counts
  const normalized = [];

  for (let i = 0; i < counts.length; i++) {
    normalized.push(counts[i] / total);
  }

  return normalized;
}`,
    explanation: 'Normalized vectors compare word proportions rather than raw document length.',
  },

  {
    id: 'retrieval-dot-score',
    stepLabel: '58.1',
    group: 'Cosine retrieval',
    title: 'Dot retrieval score',
    concept: 'A simple retrieval score compares a query vector with a document vector.',
    objective: 'Return dot(query, document).',
    difficulty: 'warmup',
    starterCode: `/** @param {number[]} a @param {number[]} b @returns {number} */
function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

/**
 * Score a document by dot product with the query embedding.
 * @param {number[]} query - Query vector.
 * @param {number[]} document - Document embedding (same length as query).
 * @returns {number} Dot-product similarity score.
 */
function retrievalDotScore(query, document) {
  // TODO: return query dotted with document.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 1', retrievalDotScore([1, 2], [3, 4]), 11);
check('orthogonal', retrievalDotScore([1, 0], [0, 1]), 0);
check('negative value', retrievalDotScore([-1, 2], [3, 5]), 7);

return results;`,
    hints: [
      'Use the dot helper.',
      'Retrieval score is a similarity score.',
      'return dot(query, document);',
    ],
    solution: `/** @param {number[]} a @param {number[]} b @returns {number} */
function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

/**
 * Score a document by dot product with the query embedding.
 * @param {number[]} query - Query vector.
 * @param {number[]} document - Document embedding (same length as query).
 * @returns {number} Dot-product similarity score.
 */
function retrievalDotScore(query, document) {
  return dot(query, document);
}`,
    explanation: 'Embedding retrieval ranks documents by similarity to the query vector.',
  },

  {
    id: 'retrieval-cosine-score',
    stepLabel: '58.2',
    group: 'Cosine retrieval',
    title: 'Cosine retrieval score',
    concept: 'Cosine similarity compares direction instead of raw vector length.',
    objective: 'Return dot(query, document) divided by both norms.',
    difficulty: 'core',
    starterCode: `/** @param {number[]} a @param {number[]} b @returns {number} */
function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

/** @param {number[]} v @returns {number} L2 norm of v */
function norm(v) {
  return Math.sqrt(dot(v, v));
}

/**
 * Cosine similarity between query and document embeddings.
 * @param {number[]} query - Query vector.
 * @param {number[]} document - Document embedding (same length as query).
 * @returns {number} Value in [-1, 1]; 1 means same direction.
 */
function cosineScore(query, document) {
  // TODO: return cosine similarity.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('same direction', cosineScore([1, 0], [5, 0]), 1);
check('perpendicular', cosineScore([1, 0], [0, 1]), 0);
check('opposite', cosineScore([1, 0], [-2, 0]), -1);
check('classic', cosineScore([1, 2], [3, 4]), 11 / (Math.sqrt(5) * 5));

return results;`,
    hints: [
      'Cosine = dot / (norm(query) * norm(document)).',
      'Use the dot and norm helpers.',
      'return dot(query, document) / (norm(query) * norm(document));',
    ],
    solution: `/** @param {number[]} a @param {number[]} b @returns {number} */
function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

/** @param {number[]} v @returns {number} L2 norm of v */
function norm(v) {
  return Math.sqrt(dot(v, v));
}

/**
 * Cosine similarity between query and document embeddings.
 * @param {number[]} query - Query vector.
 * @param {number[]} document - Document embedding (same length as query).
 * @returns {number} Value in [-1, 1]; 1 means same direction.
 */
function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}`,
    explanation: 'Cosine retrieval is useful when vector direction matters more than vector magnitude.',
  },

  {
    id: 'retrieval-score-all-documents',
    stepLabel: '58.3',
    group: 'Cosine retrieval',
    title: 'Score all documents',
    concept: 'A retriever scores every candidate document before ranking.',
    objective: 'Push cosineScore(query, documents[i]) for each document.',
    difficulty: 'core',
    starterCode: `/** @param {number[]} a @param {number[]} b @returns {number} */
function dot(a, b) {
  return a.reduce((total, value, i) => total + value * b[i], 0);
}

/** @param {number[]} v @returns {number} */
function norm(v) {
  return Math.sqrt(dot(v, v));
}

/** @param {number[]} query @param {number[]} document @returns {number} */
function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}

/**
 * Score every candidate document against one query.
 * @param {number[]} query - Query embedding.
 * @param {number[][]} documents - One embedding per document (same dimension as query).
 * @returns {number[]} Cosine score per document, same order as documents.
 */
function scoreDocuments(query, documents) {
  // scores: number[] — starts empty; one similarity per document
  const scores = [];

  for (let i = 0; i < documents.length; i++) {
    // TODO: push cosine score for this document.
    scores.push(0);
  }

  return scores;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('score three documents', scoreDocuments([1, 0], [[1, 0], [0, 1], [-1, 0]]), [1, 0, -1]);

return results;`,
    hints: [
      'Loop through the documents.',
      'Use cosineScore(query, documents[i]).',
      'scores.push(cosineScore(query, documents[i]));',
    ],
    solution: `/** @param {number[]} a @param {number[]} b @returns {number} */
function dot(a, b) {
  return a.reduce((total, value, i) => total + value * b[i], 0);
}

/** @param {number[]} v @returns {number} */
function norm(v) {
  return Math.sqrt(dot(v, v));
}

/** @param {number[]} query @param {number[]} document @returns {number} */
function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}

/**
 * Score every candidate document against one query.
 * @param {number[]} query - Query embedding.
 * @param {number[][]} documents - One embedding per document (same dimension as query).
 * @returns {number[]} Cosine score per document, same order as documents.
 */
function scoreDocuments(query, documents) {
  // scores: number[] — starts empty; one similarity per document
  const scores = [];

  for (let i = 0; i < documents.length; i++) {
    scores.push(cosineScore(query, documents[i]));
  }

  return scores;
}`,
    explanation: 'Retrieval turns a query into a ranked list by scoring every candidate document.',
  },

  {
    id: 'retrieval-rank-documents',
    stepLabel: '58.4',
    group: 'Cosine retrieval',
    title: 'Rank documents',
    concept: 'Retrieval returns document IDs sorted by descending score.',
    objective: 'Return document IDs sorted from highest score to lowest.',
    difficulty: 'challenge',
    starterCode: `/**
 * Rank document IDs by descending retrieval score.
 * @param {number[]} scores - Similarity score per document (index = document ID).
 * @returns {number[]} Document indices sorted best-first.
 */
function rankDocuments(scores) {
  // indexed: {score: number, index: number}[] — pairs score with original document index
  const indexed = scores.map((score, index) => ({ score, index }));

  indexed.sort((a, b) => b.score - a.score);

  // TODO: return the sorted document indices.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('simple ranking', rankDocuments([0.2, 0.9, 0.4]), [1, 2, 0]);
check('negative scores', rankDocuments([-1, 0, 1]), [2, 1, 0]);
check('already sorted', rankDocuments([3, 2, 1]), [0, 1, 2]);

return results;`,
    hints: [
      'The array is already sorted by score.',
      'Map each item to item.index.',
      'return indexed.map((item) => item.index);',
    ],
    solution: `/**
 * Rank document IDs by descending retrieval score.
 * @param {number[]} scores - Similarity score per document (index = document ID).
 * @returns {number[]} Document indices sorted best-first.
 */
function rankDocuments(scores) {
  // indexed: {score: number, index: number}[] — pairs score with original document index
  const indexed = scores.map((score, index) => ({ score, index }));

  indexed.sort((a, b) => b.score - a.score);

  return indexed.map((item) => item.index);
}`,
    explanation: 'The ranker converts similarity scores into retrieval order.',
  },

  {
    id: 'retrieval-hit-at-k',
    stepLabel: '59.1',
    group: 'Retrieval metrics',
    title: 'Hit@k',
    concept: 'Hit@k checks whether at least one relevant document appears in the top k.',
    objective: 'Return true if any of the top-k retrieved IDs are relevant.',
    difficulty: 'core',
    starterCode: `/**
 * Hit@k: did at least one relevant document appear in the top k results?
 * @param {string[]} retrievedIds - Ranked document IDs (best first).
 * @param {string[]} relevantIds - Ground-truth relevant document IDs.
 * @param {number} k - Cutoff rank (top k only).
 * @returns {boolean} True when any top-k ID is in relevantIds.
 */
function hitAtK(retrievedIds, relevantIds, k) {
  // topK: string[] — first k retrieved IDs
  const topK = retrievedIds.slice(0, k);

  for (let i = 0; i < topK.length; i++) {
    // TODO: return true if topK[i] is relevant.
  }

  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('hit at 1', hitAtK(['a', 'b', 'c'], ['a'], 1), true);
check('miss at 1 hit at 2', hitAtK(['a', 'b', 'c'], ['b'], 1), false);
check('hit at 2', hitAtK(['a', 'b', 'c'], ['b'], 2), true);
check('no hit', hitAtK(['a', 'b'], ['z'], 2), false);

return results;`,
    hints: [
      'Use relevantIds.includes(topK[i]).',
      'If you find a relevant item, return true immediately.',
      'if (relevantIds.includes(topK[i])) return true;',
    ],
    solution: `/**
 * Hit@k: did at least one relevant document appear in the top k results?
 * @param {string[]} retrievedIds - Ranked document IDs (best first).
 * @param {string[]} relevantIds - Ground-truth relevant document IDs.
 * @param {number} k - Cutoff rank (top k only).
 * @returns {boolean} True when any top-k ID is in relevantIds.
 */
function hitAtK(retrievedIds, relevantIds, k) {
  // topK: string[] — first k retrieved IDs
  const topK = retrievedIds.slice(0, k);

  for (let i = 0; i < topK.length; i++) {
    if (relevantIds.includes(topK[i])) return true;
  }

  return false;
}`,
    explanation: 'Hit@k is simple: did retrieval put at least one useful document in the top k?',
  },

  {
    id: 'retrieval-recall-at-k',
    stepLabel: '59.2',
    group: 'Retrieval metrics',
    title: 'Recall@k',
    concept: 'Recall@k measures how many relevant documents were retrieved in the top k.',
    objective: 'Count relevant docs in top-k and divide by total relevant docs.',
    difficulty: 'core',
    starterCode: `/**
 * Recall@k: fraction of relevant documents found in the top k.
 * @param {string[]} retrievedIds - Ranked document IDs (best first).
 * @param {string[]} relevantIds - Ground-truth relevant document IDs.
 * @param {number} k - Cutoff rank (top k only).
 * @returns {number} found / relevantIds.length.
 */
function recallAtK(retrievedIds, relevantIds, k) {
  // topK: string[] — first k retrieved IDs
  const topK = retrievedIds.slice(0, k);
  // found: number — count of relevant docs in topK; starts at 0
  let found = 0;

  for (let i = 0; i < topK.length; i++) {
    // TODO: increment found if topK[i] is relevant.
  }

  return found / relevantIds.length;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one of two relevant', recallAtK(['a', 'b', 'c'], ['a', 'z'], 2), 0.5);
check('two of two relevant', recallAtK(['a', 'b', 'c'], ['a', 'b'], 2), 1);
check('zero of two relevant', recallAtK(['a', 'b', 'c'], ['x', 'y'], 3), 0);
check('top k matters', recallAtK(['a', 'b', 'c'], ['c'], 2), 0);

return results;`,
    hints: [
      'Use relevantIds.includes(topK[i]).',
      'Increment found for each relevant retrieved doc.',
      'if (relevantIds.includes(topK[i])) found += 1;',
    ],
    solution: `/**
 * Recall@k: fraction of relevant documents found in the top k.
 * @param {string[]} retrievedIds - Ranked document IDs (best first).
 * @param {string[]} relevantIds - Ground-truth relevant document IDs.
 * @param {number} k - Cutoff rank (top k only).
 * @returns {number} found / relevantIds.length.
 */
function recallAtK(retrievedIds, relevantIds, k) {
  // topK: string[] — first k retrieved IDs
  const topK = retrievedIds.slice(0, k);
  // found: number — count of relevant docs in topK; starts at 0
  let found = 0;

  for (let i = 0; i < topK.length; i++) {
    if (relevantIds.includes(topK[i])) found += 1;
  }

  return found / relevantIds.length;
}`,
    explanation: 'Recall@k matters because a generator cannot use relevant evidence that retrieval failed to include.',
  },

  {
    id: 'retrieval-mrr',
    stepLabel: '59.3',
    group: 'Retrieval metrics',
    title: 'Mean reciprocal rank for one query',
    concept: 'MRR rewards placing the first relevant result early.',
    objective: 'Return 1 / rank of the first relevant result.',
    difficulty: 'challenge',
    starterCode: `/**
 * Reciprocal rank of the first relevant result (MRR for one query).
 * @param {string[]} retrievedIds - Ranked document IDs (best first).
 * @param {string[]} relevantIds - Ground-truth relevant document IDs.
 * @returns {number} 1/rank of first hit, or 0 when none found.
 */
function reciprocalRank(retrievedIds, relevantIds) {
  for (let i = 0; i < retrievedIds.length; i++) {
    // TODO: if retrievedIds[i] is relevant, return 1 / (i + 1).
  }

  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('first result relevant', reciprocalRank(['a', 'b', 'c'], ['a']), 1);
check('second result relevant', reciprocalRank(['a', 'b', 'c'], ['b']), 0.5);
check('third result relevant', reciprocalRank(['a', 'b', 'c'], ['c']), 1 / 3);
check('no relevant result', reciprocalRank(['a', 'b'], ['z']), 0);

return results;`,
    hints: [
      'Rank is i + 1 because arrays are zero-indexed.',
      'Use relevantIds.includes(retrievedIds[i]).',
      'if (relevantIds.includes(retrievedIds[i])) return 1 / (i + 1);',
    ],
    solution: `/**
 * Reciprocal rank of the first relevant result (MRR for one query).
 * @param {string[]} retrievedIds - Ranked document IDs (best first).
 * @param {string[]} relevantIds - Ground-truth relevant document IDs.
 * @returns {number} 1/rank of first hit, or 0 when none found.
 */
function reciprocalRank(retrievedIds, relevantIds) {
  for (let i = 0; i < retrievedIds.length; i++) {
    if (relevantIds.includes(retrievedIds[i])) return 1 / (i + 1);
  }

  return 0;
}`,
    explanation: 'MRR focuses on how soon the first useful result appears.',
  },

  {
    id: 'retrieval-dcg-at-k',
    stepLabel: '59.4',
    group: 'Retrieval metrics',
    title: 'DCG@k',
    concept: 'DCG gives more credit to relevant documents that appear earlier in the ranking.',
    objective: 'Add relevance / log2(rank + 1) for each top-k result.',
    difficulty: 'challenge',
    starterCode: `/**
 * Discounted cumulative gain at rank k.
 * @param {number[]} relevances - Graded relevance per rank position (index 0 = rank 1).
 * @param {number} k - Maximum rank to include.
 * @returns {number} Sum of relevance / log2(rank + 1).
 */
function dcgAtK(relevances, k) {
  // total: number — accumulated DCG; starts at 0
  let total = 0;

  for (let i = 0; i < Math.min(k, relevances.length); i++) {
    // rank: number — 1-based position (i=0 → rank 1)
    const rank = i + 1;

    // TODO: add discounted relevance.
    total += 0;
  }

  return total;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('single relevant first', dcgAtK([1, 0, 0], 3), 1);
check('single relevant second', dcgAtK([0, 1, 0], 3), 1 / Math.log2(3));
check('graded relevance', dcgAtK([3, 2], 2), 3 / Math.log2(2) + 2 / Math.log2(3));

return results;`,
    hints: [
      'Rank starts at 1, not 0.',
      'Discount denominator is Math.log2(rank + 1).',
      'total += relevances[i] / Math.log2(rank + 1);',
    ],
    solution: `/**
 * Discounted cumulative gain at rank k.
 * @param {number[]} relevances - Graded relevance per rank position (index 0 = rank 1).
 * @param {number} k - Maximum rank to include.
 * @returns {number} Sum of relevance / log2(rank + 1).
 */
function dcgAtK(relevances, k) {
  // total: number — accumulated DCG; starts at 0
  let total = 0;

  for (let i = 0; i < Math.min(k, relevances.length); i++) {
    // rank: number — 1-based position (i=0 → rank 1)
    const rank = i + 1;
    total += relevances[i] / Math.log2(rank + 1);
  }

  return total;
}`,
    explanation: 'DCG rewards both relevance and good ordering.',
  },

  {
    id: 'rerank-by-score',
    stepLabel: '60.1',
    group: 'Reranking and grounding checks',
    title: 'Rerank by score',
    concept: 'A reranker reorders retrieved chunks using a more expensive relevance score.',
    objective: 'Return chunk IDs sorted by descending reranker score.',
    difficulty: 'core',
    starterCode: `/**
 * Rerank chunks by descending reranker score.
 * @param {{ id: string, score: number }[]} chunkScores - Chunk ID and reranker score pairs.
 * @returns {string[]} Chunk IDs sorted best-first.
 */
function rerank(chunkScores) {
  // indexed: {id: string, score: number}[] — copy for sorting
  const indexed = chunkScores.map((item) => ({
    id: item.id,
    score: item.score,
  }));

  indexed.sort((a, b) => b.score - a.score);

  // TODO: return sorted chunk IDs.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('rerank chunks', rerank([{ id: 'a', score: 0.2 }, { id: 'b', score: 0.9 }, { id: 'c', score: 0.4 }]), ['b', 'c', 'a']);

return results;`,
    hints: [
      'The array is already sorted by score.',
      'Map each item to item.id.',
      'return indexed.map((item) => item.id);',
    ],
    solution: `/**
 * Rerank chunks by descending reranker score.
 * @param {{ id: string, score: number }[]} chunkScores - Chunk ID and reranker score pairs.
 * @returns {string[]} Chunk IDs sorted best-first.
 */
function rerank(chunkScores) {
  // indexed: {id: string, score: number}[] — copy for sorting
  const indexed = chunkScores.map((item) => ({
    id: item.id,
    score: item.score,
  }));

  indexed.sort((a, b) => b.score - a.score);

  return indexed.map((item) => item.id);
}`,
    explanation: 'Retrieval often uses a fast first pass, then reranks a smaller candidate set more carefully.',
  },

  {
    id: 'grounding-answer-phrase-check',
    stepLabel: '60.2',
    group: 'Reranking and grounding checks',
    title: 'Answer phrase support',
    concept: 'A simple grounding check asks whether the cited chunk contains the answer phrase.',
    objective: 'Return whether chunkText includes answerPhrase.',
    difficulty: 'warmup',
    starterCode: `/**
 * Simple grounding check: does the cited chunk contain the answer phrase?
 * @param {string} chunkText - Retrieved evidence text.
 * @param {string} answerPhrase - Substring the answer should be grounded in.
 * @returns {boolean} True when answerPhrase appears in chunkText.
 */
function chunkContainsAnswer(chunkText, answerPhrase) {
  // TODO: return whether answerPhrase appears in chunkText.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('contains phrase', chunkContainsAnswer('The cancellation fee is waived after 12 months.', '12 months'), true);
check('missing phrase', chunkContainsAnswer('The cancellation fee is waived after 24 months.', '12 months'), false);
check('exact phrase', chunkContainsAnswer('refund policy', 'refund'), true);

return results;`,
    hints: [
      'Use string includes.',
      'chunkText.includes(answerPhrase) checks for substring support.',
      'return chunkText.includes(answerPhrase);',
    ],
    solution: `/**
 * Simple grounding check: does the cited chunk contain the answer phrase?
 * @param {string} chunkText - Retrieved evidence text.
 * @param {string} answerPhrase - Substring the answer should be grounded in.
 * @returns {boolean} True when answerPhrase appears in chunkText.
 */
function chunkContainsAnswer(chunkText, answerPhrase) {
  return chunkText.includes(answerPhrase);
}`,
    explanation: 'This is a toy grounding check. Real grounding needs entailment, not just substring matching.',
  },

  {
    id: 'grounding-detect-unsupported-citation',
    stepLabel: '60.3',
    group: 'Reranking and grounding checks',
    title: 'Unsupported citation',
    concept: 'A citation is suspicious when the cited chunk does not contain the required answer evidence.',
    objective: 'Return true when the citation is unsupported.',
    difficulty: 'core',
    starterCode: `/**
 * Flag a citation when the chunk does not support the answer phrase.
 * @param {string} chunkText - Retrieved evidence text.
 * @param {string} answerPhrase - Substring the answer claims.
 * @returns {boolean} True when the chunk does not contain answerPhrase.
 */
function isUnsupportedCitation(chunkText, answerPhrase) {
  // supports: boolean — whether chunkText contains the answer phrase
  const supports = chunkText.includes(answerPhrase);

  // TODO: return true when supports is false.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('supported citation', isUnsupportedCitation('Fee waived after 12 months.', '12 months'), false);
check('unsupported citation', isUnsupportedCitation('Fee waived after 24 months.', '12 months'), true);
check('missing answer entirely', isUnsupportedCitation('No fee details here.', '12 months'), true);

return results;`,
    hints: [
      'Unsupported means not supported.',
      'supports is already computed.',
      'return !supports;',
    ],
    solution: `/**
 * Flag a citation when the chunk does not support the answer phrase.
 * @param {string} chunkText - Retrieved evidence text.
 * @param {string} answerPhrase - Substring the answer claims.
 * @returns {boolean} True when the chunk does not contain answerPhrase.
 */
function isUnsupportedCitation(chunkText, answerPhrase) {
  // supports: boolean — whether chunkText contains the answer phrase
  const supports = chunkText.includes(answerPhrase);
  return !supports;
}`,
    explanation: 'Unsupported citations are dangerous because they make hallucinations look grounded.',
  },

  {
    id: 'grounding-conflict-check',
    stepLabel: '60.4',
    group: 'Reranking and grounding checks',
    title: 'Conflicting evidence',
    concept: 'RAG systems should detect when retrieved chunks disagree.',
    objective: 'Return true when two chunks contain different claimed values.',
    difficulty: 'challenge',
    starterCode: `/**
 * Detect conflicting evidence between two retrieved values.
 * @param {string|number} valueA - Claimed value from one chunk.
 * @param {string|number} valueB - Claimed value from another chunk.
 * @returns {boolean} True when valueA and valueB differ.
 */
function hasConflict(valueA, valueB) {
  // TODO: return true when values disagree.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same value no conflict', hasConflict('12 months', '12 months'), false);
check('different values conflict', hasConflict('12 months', '24 months'), true);
check('same number no conflict', hasConflict(5, 5), false);
check('different number conflict', hasConflict(5, 7), true);

return results;`,
    hints: [
      'Conflict means the values are not equal.',
      'Use !==.',
      'return valueA !== valueB;',
    ],
    solution: `/**
 * Detect conflicting evidence between two retrieved values.
 * @param {string|number} valueA - Claimed value from one chunk.
 * @param {string|number} valueB - Claimed value from another chunk.
 * @returns {boolean} True when valueA and valueB differ.
 */
function hasConflict(valueA, valueB) {
  return valueA !== valueB;
}`,
    explanation: 'A good RAG system should not silently choose one source when retrieved evidence conflicts.',
  },

  {
    id: 'prompt-packing-reserve-answer-budget',
    stepLabel: '61.1',
    group: 'Prompt packing / context budget',
    title: 'Reserve answer budget',
    concept: 'A prompt packer should leave room for the model response.',
    objective: 'Return totalContext - answerBudget.',
    difficulty: 'warmup',
    starterCode: `/**
 * Reserve tokens for the model answer; return what remains for input.
 * @param {number} totalContext - Full context window size in tokens.
 * @param {number} answerBudget - Tokens reserved for the model response.
 * @returns {number} Tokens available for retrieved chunks and prompt.
 */
function inputBudget(totalContext, answerBudget) {
  // TODO: return how many tokens are available for input.
  return totalContext;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('reserve 1000 from 8000', inputBudget(8000, 1000), 7000);
check('reserve 500 from 4096', inputBudget(4096, 500), 3596);
check('reserve zero', inputBudget(1000, 0), 1000);

return results;`,
    hints: [
      'Input and output share the context window.',
      'Subtract answerBudget from totalContext.',
      'return totalContext - answerBudget;',
    ],
    solution: `/**
 * Reserve tokens for the model answer; return what remains for input.
 * @param {number} totalContext - Full context window size in tokens.
 * @param {number} answerBudget - Tokens reserved for the model response.
 * @returns {number} Tokens available for retrieved chunks and prompt.
 */
function inputBudget(totalContext, answerBudget) {
  return totalContext - answerBudget;
}`,
    explanation: 'If you fill the whole context with input, there may be no room left for the answer.',
  },

  {
    id: 'prompt-packing-greedy-chunks',
    stepLabel: '61.2',
    group: 'Prompt packing / context budget',
    title: 'Greedy chunk packing',
    concept: 'A simple prompt packer adds chunks until the budget is exhausted.',
    objective: 'Add a chunk only if it fits.',
    difficulty: 'core',
    starterCode: `/**
 * Greedily pack chunks in order until the token budget is exhausted.
 * @param {{ id: string, tokens: number }[]} chunks - Candidate chunks with token counts.
 * @param {number} budget - Maximum total tokens for packed chunks.
 * @returns {string[]} IDs of chunks that fit, in original order.
 */
function packChunksGreedy(chunks, budget) {
  // packed: string[] — IDs of chunks added so far
  const packed = [];
  // used: number — tokens consumed; starts at 0
  let used = 0;

  for (let i = 0; i < chunks.length; i++) {
    // chunk: {id: string, tokens: number} — current candidate
    const chunk = chunks[i];

    // TODO: if used + chunk.tokens <= budget, pack the chunk and update used.
  }

  return packed;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

const chunks = [
  { id: 'a', tokens: 100 },
  { id: 'b', tokens: 200 },
  { id: 'c', tokens: 300 },
];

check('budget 250', packChunksGreedy(chunks, 250), ['a']);
check('budget 500', packChunksGreedy(chunks, 500), ['a', 'b']);
check('budget 600', packChunksGreedy(chunks, 600), ['a', 'b', 'c']);

return results;`,
    hints: [
      'Check whether used + chunk.tokens is within budget.',
      'If it fits, push chunk.id and add chunk.tokens to used.',
      `if (used + chunk.tokens <= budget) {
  packed.push(chunk.id);
  used += chunk.tokens;
}`,
    ],
    solution: `/**
 * Greedily pack chunks in order until the token budget is exhausted.
 * @param {{ id: string, tokens: number }[]} chunks - Candidate chunks with token counts.
 * @param {number} budget - Maximum total tokens for packed chunks.
 * @returns {string[]} IDs of chunks that fit, in original order.
 */
function packChunksGreedy(chunks, budget) {
  // packed: string[] — IDs of chunks added so far
  const packed = [];
  // used: number — tokens consumed; starts at 0
  let used = 0;

  for (let i = 0; i < chunks.length; i++) {
    // chunk: {id: string, tokens: number} — current candidate
    const chunk = chunks[i];

    if (used + chunk.tokens <= budget) {
      packed.push(chunk.id);
      used += chunk.tokens;
    }
  }

  return packed;
}`,
    explanation: 'Greedy packing is simple, but it may skip a smaller useful chunk after a large chunk consumes the budget.',
  },

  {
    id: 'prompt-packing-sort-by-relevance',
    stepLabel: '61.3',
    group: 'Prompt packing / context budget',
    title: 'Sort by relevance',
    concept: 'Prompt packing usually prioritizes high-relevance chunks before filling the budget.',
    objective: 'Sort chunks by descending relevance.',
    difficulty: 'core',
    starterCode: `/**
 * Sort chunks by descending relevance score.
 * @param {{ id: string, relevance: number }[]} chunks - Candidate chunks with relevance scores.
 * @returns {{ id: string, relevance: number }[]} New array sorted best-first.
 */
function sortByRelevance(chunks) {
  // sorted: object[] — shallow copy of chunks to sort in place
  const sorted = chunks.slice();

  // TODO: sort highest relevance first.
  return sorted;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a.map((x) => x.id)) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual.map((x) => x.id)),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('sort chunks', sortByRelevance([{ id: 'a', relevance: 0.2 }, { id: 'b', relevance: 0.9 }, { id: 'c', relevance: 0.4 }]), ['b', 'c', 'a']);

return results;`,
    hints: [
      'Use Array.sort.',
      'Descending means b.relevance - a.relevance.',
      'sorted.sort((a, b) => b.relevance - a.relevance);',
    ],
    solution: `/**
 * Sort chunks by descending relevance score.
 * @param {{ id: string, relevance: number }[]} chunks - Candidate chunks with relevance scores.
 * @returns {{ id: string, relevance: number }[]} New array sorted best-first.
 */
function sortByRelevance(chunks) {
  // sorted: object[] — shallow copy of chunks to sort in place
  const sorted = chunks.slice();

  sorted.sort((a, b) => b.relevance - a.relevance);

  return sorted;
}`,
    explanation: 'RAG systems often rerank or sort chunks before packing them into the final prompt.',
  },

  {
    id: 'prompt-packing-relevance-budget',
    stepLabel: '61.4',
    group: 'Prompt packing / context budget',
    title: 'Pack relevant chunks within budget',
    concept: 'A practical packer sorts by relevance, then greedily adds chunks that fit.',
    objective: 'Sort by relevance and pack fitting chunks.',
    difficulty: 'challenge',
    starterCode: `/**
 * Sort by relevance, then greedily pack chunks that fit the budget.
 * @param {{ id: string, tokens: number, relevance: number }[]} chunks - Candidates with size and score.
 * @param {number} budget - Maximum total tokens for packed chunks.
 * @returns {string[]} IDs of packed chunks, highest relevance first.
 */
function packRelevantChunks(chunks, budget) {
  // sorted: object[] — chunks ordered by descending relevance
  const sorted = chunks.slice();
  sorted.sort((a, b) => b.relevance - a.relevance);

  // packed: string[] — IDs of chunks added so far
  const packed = [];
  // used: number — tokens consumed; starts at 0
  let used = 0;

  for (let i = 0; i < sorted.length; i++) {
    // chunk: {id, tokens, relevance} — current candidate (already sorted)
    const chunk = sorted[i];

    // TODO: pack this chunk if it fits.
  }

  return packed;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

const chunks = [
  { id: 'a', tokens: 100, relevance: 0.2 },
  { id: 'b', tokens: 300, relevance: 0.9 },
  { id: 'c', tokens: 200, relevance: 0.8 },
  { id: 'd', tokens: 100, relevance: 0.7 },
];

check('budget 300', packRelevantChunks(chunks, 300), ['b']);
check('budget 400', packRelevantChunks(chunks, 400), ['b', 'd']);
check('budget 500', packRelevantChunks(chunks, 500), ['b', 'c']);

return results;`,
    hints: [
      'The chunks are already sorted by relevance.',
      'Use the same budget check as greedy packing.',
      'If it fits, push chunk.id and update used.',
      `if (used + chunk.tokens <= budget) {
  packed.push(chunk.id);
  used += chunk.tokens;
}`,
    ],
    solution: `/**
 * Sort by relevance, then greedily pack chunks that fit the budget.
 * @param {{ id: string, tokens: number, relevance: number }[]} chunks - Candidates with size and score.
 * @param {number} budget - Maximum total tokens for packed chunks.
 * @returns {string[]} IDs of packed chunks, highest relevance first.
 */
function packRelevantChunks(chunks, budget) {
  // sorted: object[] — chunks ordered by descending relevance
  const sorted = chunks.slice();
  sorted.sort((a, b) => b.relevance - a.relevance);

  // packed: string[] — IDs of chunks added so far
  const packed = [];
  // used: number — tokens consumed; starts at 0
  let used = 0;

  for (let i = 0; i < sorted.length; i++) {
    // chunk: {id, tokens, relevance} — current candidate (already sorted)
    const chunk = sorted[i];

    if (used + chunk.tokens <= budget) {
      packed.push(chunk.id);
      used += chunk.tokens;
    }
  }

  return packed;
}`,
    explanation: 'Prompt packing balances relevance against token budget. The best chunk is not useful if it crowds out required evidence.',
  },
];
