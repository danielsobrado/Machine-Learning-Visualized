import {
  MLM_CORRUPTION_PROBABILITIES,
  MLM_EXAMPLE_SELECTIONS,
  MLM_EXAMPLE_TOKENS,
  MLM_SELECTION_RATE,
} from './bertPretrainingConstants.js';

function validateProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be in [0, 1]`);
}

export function expectedMlmCounts(totalTokens, selectionRate = MLM_SELECTION_RATE, probabilities = MLM_CORRUPTION_PROBABILITIES) {
  if (!Number.isInteger(totalTokens) || totalTokens <= 0) throw new RangeError('totalTokens must be a positive integer');
  validateProbability(selectionRate, 'selectionRate');
  const entries = Object.entries(probabilities);
  entries.forEach(([name, value]) => validateProbability(value, name));
  const corruptionTotal = entries.reduce((sum, [, value]) => sum + value, 0);
  if (Math.abs(corruptionTotal - 1) > 1e-12) throw new RangeError('corruption probabilities must sum to one');

  const selected = totalTokens * selectionRate;
  return {
    totalTokens,
    selected,
    mask: selected * probabilities.mask,
    random: selected * probabilities.random,
    unchanged: selected * probabilities.unchanged,
  };
}

export function applyMlmCorruption(tokens, selections) {
  if (!Array.isArray(tokens) || tokens.length === 0 || tokens.some((token) => typeof token !== 'string')) {
    throw new TypeError('tokens must be a non-empty string array');
  }
  if (!Array.isArray(selections)) throw new TypeError('selections must be an array');

  const byIndex = new Map();
  selections.forEach((selection) => {
    if (!Number.isInteger(selection.index) || selection.index < 0 || selection.index >= tokens.length) {
      throw new RangeError('selection index is out of range');
    }
    if (!['mask', 'random', 'unchanged'].includes(selection.corruption)) {
      throw new RangeError(`Unknown corruption type: ${selection.corruption}`);
    }
    if (byIndex.has(selection.index)) throw new RangeError('selection indices must be unique');
    if (selection.corruption === 'random' && typeof selection.replacement !== 'string') {
      throw new TypeError('random corruption requires a replacement token');
    }
    byIndex.set(selection.index, selection);
  });

  const corrupted = tokens.map((token, index) => {
    const selection = byIndex.get(index);
    if (!selection) return token;
    if (selection.corruption === 'mask') return '[MASK]';
    if (selection.corruption === 'random') return selection.replacement;
    return token;
  });

  return {
    original: [...tokens],
    corrupted,
    selectedIndices: selections.map((selection) => selection.index),
    literalMaskIndices: selections.filter((selection) => selection.corruption === 'mask').map((selection) => selection.index),
    randomIndices: selections.filter((selection) => selection.corruption === 'random').map((selection) => selection.index),
    unchangedIndices: selections.filter((selection) => selection.corruption === 'unchanged').map((selection) => selection.index),
    selectionRate: selections.length / tokens.length,
  };
}

export function defaultMlmExperiment() {
  return applyMlmCorruption(MLM_EXAMPLE_TOKENS, MLM_EXAMPLE_SELECTIONS);
}

export function mlmLossMask(totalTokens, selectedIndices) {
  if (!Number.isInteger(totalTokens) || totalTokens <= 0) throw new RangeError('totalTokens must be a positive integer');
  if (!Array.isArray(selectedIndices)) throw new TypeError('selectedIndices must be an array');
  const selected = new Set(selectedIndices);
  selected.forEach((index) => {
    if (!Number.isInteger(index) || index < 0 || index >= totalTokens) throw new RangeError('selected index is out of range');
  });
  return Array.from({ length: totalTokens }, (_, index) => selected.has(index));
}
