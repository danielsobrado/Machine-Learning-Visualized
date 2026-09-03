export const TOKENIZATION_BOUNDARY_VOCABULARY = Object.freeze([
  ' hello',
  ' world',
  ' café',
  ' cafe',
  '\u0301',
]);

function requireString(value, name) {
  if (typeof value !== 'string') throw new TypeError(`${name} must be a string`);
}

function requireVocabulary(vocabulary) {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0 || vocabulary.some((token) => typeof token !== 'string' || token.length === 0)) {
    throw new TypeError('vocabulary must be a non-empty array of non-empty strings');
  }
}

export function greedyLongestMatchTokenize(text, vocabulary = TOKENIZATION_BOUNDARY_VOCABULARY) {
  requireString(text, 'text');
  requireVocabulary(vocabulary);
  const orderedVocabulary = [...new Set(vocabulary)].sort((a, b) => b.length - a.length || a.localeCompare(b));
  const tokens = [];
  let offset = 0;

  while (offset < text.length) {
    const remaining = text.slice(offset);
    const match = orderedVocabulary.find((token) => remaining.startsWith(token));
    if (match) {
      tokens.push({ token: match, known: true, start: offset, end: offset + match.length });
      offset += match.length;
      continue;
    }

    const [codePoint] = Array.from(remaining);
    tokens.push({ token: codePoint, known: false, start: offset, end: offset + codePoint.length });
    offset += codePoint.length;
  }

  return tokens;
}

export function tokenCount(text, vocabulary = TOKENIZATION_BOUNDARY_VOCABULARY) {
  return greedyLongestMatchTokenize(text, vocabulary).length;
}

export function leadingBoundaryExperiment() {
  const withBoundary = ' hello world';
  const withoutBoundary = 'hello world';
  const withTokens = greedyLongestMatchTokenize(withBoundary);
  const withoutTokens = greedyLongestMatchTokenize(withoutBoundary);
  return {
    withBoundary,
    withoutBoundary,
    withTokens,
    withoutTokens,
    withCount: withTokens.length,
    withoutCount: withoutTokens.length,
    inflation: withoutTokens.length / withTokens.length,
  };
}

export function unicodeNormalizationExperiment() {
  const composed = ' café';
  const decomposed = ' cafe\u0301';
  const composedTokens = greedyLongestMatchTokenize(composed);
  const decomposedTokens = greedyLongestMatchTokenize(decomposed);
  return {
    composed,
    decomposed,
    visuallyEqualAfterNfc: composed.normalize('NFC') === decomposed.normalize('NFC'),
    rawEqual: composed === decomposed,
    composedCodePoints: Array.from(composed).map((character) => `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`),
    decomposedCodePoints: Array.from(decomposed).map((character) => `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`),
    composedTokens,
    decomposedTokens,
    composedCount: composedTokens.length,
    decomposedCount: decomposedTokens.length,
  };
}

export function contextBudgetUsage(text, contextLimit, vocabulary = TOKENIZATION_BOUNDARY_VOCABULARY) {
  if (!Number.isInteger(contextLimit) || contextLimit <= 0) throw new RangeError('contextLimit must be a positive integer');
  const count = tokenCount(text, vocabulary);
  return {
    count,
    contextLimit,
    remaining: Math.max(0, contextLimit - count),
    overflow: Math.max(0, count - contextLimit),
    utilization: count / contextLimit,
  };
}
