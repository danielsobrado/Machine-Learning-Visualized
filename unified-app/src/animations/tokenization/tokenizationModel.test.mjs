import assert from 'node:assert/strict';
import test from 'node:test';

import {
  TOKENIZATION_BOUNDARY_VOCABULARY,
  contextBudgetUsage,
  greedyLongestMatchTokenize,
  leadingBoundaryExperiment,
  tokenCount,
  unicodeNormalizationExperiment,
} from './tokenizationModel.js';

test('greedy tokenizer prefers longest known token', () => {
  const tokens = greedyLongestMatchTokenize(' hello', [' h', ' hello', 'e']);
  assert.deepEqual(tokens.map((item) => item.token), [' hello']);
});

test('unknown text falls back by Unicode code point', () => {
  const tokens = greedyLongestMatchTokenize('🙂', [' hello']);
  assert.equal(tokens.length, 1);
  assert.equal(tokens[0].known, false);
  assert.equal(tokens[0].token, '🙂');
});

test('leading boundary can change token count dramatically', () => {
  const result = leadingBoundaryExperiment();
  assert.equal(result.withCount, 2);
  assert.equal(result.withoutCount, 6);
  assert.equal(result.inflation, 3);
});

test('canonically equivalent Unicode strings can have different raw tokenizations', () => {
  const result = unicodeNormalizationExperiment();
  assert.equal(result.rawEqual, false);
  assert.equal(result.visuallyEqualAfterNfc, true);
  assert.equal(result.composedCount, 1);
  assert.equal(result.decomposedCount, 2);
});

test('token budget is based on tokenizer output rather than character count', () => {
  const text = 'hello world';
  const budget = contextBudgetUsage(text, 5);
  assert.equal(budget.count, 6);
  assert.equal(budget.overflow, 1);
});

test('token count reuses the same deterministic vocabulary', () => {
  assert.equal(tokenCount(' hello world', TOKENIZATION_BOUNDARY_VOCABULARY), 2);
});

test('invalid tokenizer inputs fail explicitly', () => {
  assert.throws(() => greedyLongestMatchTokenize(null, ['a']), TypeError);
  assert.throws(() => greedyLongestMatchTokenize('a', []), TypeError);
  assert.throws(() => contextBudgetUsage('a', 0), RangeError);
});
