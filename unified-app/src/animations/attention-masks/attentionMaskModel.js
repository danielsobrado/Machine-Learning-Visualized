import {
  ATTENTION_MASK_MODES,
  DECODER_TOKENS,
  ENCODER_TOKENS,
  MASK_ORDER_EXAMPLE,
  SELF_TOKENS,
} from './attentionMaskConstants.js';

export function softmax(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError('values must be a non-empty array of finite numbers');
  }
  const max = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

export function rawScore(row, col) {
  if (!Number.isInteger(row) || row < 0 || !Number.isInteger(col) || col < 0) {
    throw new RangeError('row and col must be non-negative integers');
  }
  return 1.25 - Math.abs(row - col) * 0.35 + Math.sin((row + 1) * (col + 2)) * 0.18;
}

function tokensForMode(mode) {
  if (!Object.hasOwn(ATTENTION_MASK_MODES, mode)) throw new RangeError(`Unknown mask mode: ${mode}`);
  return mode === 'cross'
    ? { queryTokens: DECODER_TOKENS, keyTokens: ENCODER_TOKENS }
    : { queryTokens: SELF_TOKENS, keyTokens: SELF_TOKENS };
}

function visibility({ mode, row, col, queryTokens, keyTokens, maskPadding }) {
  const keyIsPad = keyTokens[col] === '[PAD]';
  const queryIsPad = queryTokens[row] === '[PAD]';
  if (queryIsPad) return { allowed: false, reason: 'Padding query ignored' };
  if (mode === 'causal' && col > row) return { allowed: false, reason: 'Future token hidden' };
  if ((mode === 'padding' || mode === 'cross' || maskPadding) && keyIsPad) {
    return { allowed: false, reason: 'Padding token removed' };
  }
  return { allowed: true, reason: 'Visible context' };
}

export function buildMaskMatrix({ mode, maskPadding = true }) {
  const { queryTokens, keyTokens } = tokensForMode(mode);
  const rows = queryTokens.map((queryToken, row) => {
    const cells = keyTokens.map((keyToken, col) => {
      const state = visibility({ mode, row, col, queryTokens, keyTokens, maskPadding });
      return { row, col, queryToken, keyToken, score: rawScore(row, col), ...state };
    });
    const allowed = cells.filter((cell) => cell.allowed);
    const weights = allowed.length ? softmax(allowed.map((cell) => cell.score)) : [];
    let allowedIndex = 0;
    const enriched = cells.map((cell) => ({
      ...cell,
      probability: cell.allowed ? weights[allowedIndex++] : 0,
    }));
    return {
      row,
      queryToken,
      cells: enriched,
      probabilitySum: enriched.reduce((sum, cell) => sum + cell.probability, 0),
    };
  });
  return { queryTokens, keyTokens, rows, cells: rows.flatMap((row) => row.cells) };
}

export function maskBeforeSoftmax({ scores, allowed }) {
  if (!Array.isArray(scores) || !Array.isArray(allowed) || scores.length !== allowed.length || scores.length === 0) {
    throw new RangeError('scores and allowed must be non-empty arrays of equal length');
  }
  const visible = scores.filter((_, index) => allowed[index]);
  if (visible.length === 0) return scores.map(() => 0);
  const visibleWeights = softmax(visible);
  let visibleIndex = 0;
  return scores.map((_, index) => (allowed[index] ? visibleWeights[visibleIndex++] : 0));
}

export function zeroAfterSoftmax({ scores, allowed }) {
  const weights = softmax(scores);
  if (!Array.isArray(allowed) || allowed.length !== scores.length) throw new RangeError('allowed must match scores');
  return weights.map((weight, index) => (allowed[index] ? weight : 0));
}

export function weightedSum(weights, values) {
  if (!Array.isArray(weights) || !Array.isArray(values) || weights.length !== values.length || weights.some((value) => !Number.isFinite(value)) || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError('weights and values must be finite arrays of equal length');
  }
  return weights.reduce((sum, weight, index) => sum + weight * values[index], 0);
}

export function maskOrderExperiment(example = MASK_ORDER_EXAMPLE) {
  const correctWeights = maskBeforeSoftmax(example);
  const naiveWeights = zeroAfterSoftmax(example);
  return {
    ...example,
    correctWeights,
    naiveWeights,
    correctWeightSum: correctWeights.reduce((sum, value) => sum + value, 0),
    naiveWeightSum: naiveWeights.reduce((sum, value) => sum + value, 0),
    correctOutput: weightedSum(correctWeights, example.values),
    naiveOutput: weightedSum(naiveWeights, example.values),
  };
}
