import { computeSoftmax } from '../../data/softmaxModel.js';
import {
  BASE_CONTEXT,
  TOKEN_GENERATION_VOCABULARY,
} from './tokenGenerationConstants.js';

function requireProbability(value, name, includeZero = true) {
  const minimum = includeZero ? 0 : Number.EPSILON;
  if (!Number.isFinite(value) || value < minimum || value > 1) {
    throw new RangeError(`${name} must be between ${includeZero ? 0 : 'greater than 0'} and 1`);
  }
}

function requirePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

function normalizeRows(rows, probabilityKey, outputKey) {
  const total = rows.reduce((sum, row) => sum + row[probabilityKey], 0);
  if (!(total > 0)) throw new RangeError('candidate probability mass must be positive');
  return rows.map((row) => ({ ...row, [outputKey]: row[probabilityKey] / total }));
}

export function samplingUnitForStep(step) {
  if (!Number.isInteger(step) || step < 0) throw new RangeError('step must be a non-negative integer');
  const raw = Math.sin((step + 1) * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

export function filterDistribution({ probabilities, topK, topP }) {
  if (!Array.isArray(probabilities) || probabilities.length === 0 || probabilities.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new TypeError('probabilities must be a non-empty array of non-negative finite values');
  }
  if (!Number.isInteger(topK) || topK < 1 || topK > probabilities.length) {
    throw new RangeError('topK must be between 1 and the number of candidates');
  }
  requireProbability(topP, 'topP', false);

  const ranked = probabilities
    .map((probability, index) => ({ index, probability }))
    .sort((left, right) => right.probability - left.probability || left.index - right.index);
  const topKRows = normalizeRows(ranked.slice(0, topK), 'probability', 'topKProbability');

  let cumulative = 0;
  const nucleus = [];
  for (const row of topKRows) {
    nucleus.push(row);
    cumulative += row.topKProbability;
    if (cumulative >= topP) break;
  }

  const kept = normalizeRows(nucleus, 'probability', 'sampleProbability');
  const byIndex = new Map(kept.map((row) => [row.index, row]));

  return ranked.map((row) => {
    const keptRow = byIndex.get(row.index);
    return {
      ...row,
      keptByTopK: ranked.findIndex((candidate) => candidate.index === row.index) < topK,
      kept: Boolean(keptRow),
      sampleProbability: keptRow?.sampleProbability ?? 0,
    };
  });
}

export function selectToken(rows, strategy, sampleUnit = 0.5) {
  if (!Array.isArray(rows) || rows.length === 0) throw new TypeError('rows must be a non-empty array');
  const kept = rows.filter((row) => row.kept);
  if (kept.length === 0) throw new RangeError('at least one candidate must be kept');

  if (strategy === 'greedy') {
    return kept.reduce((best, row) => (
      row.sampleProbability > best.sampleProbability ? row : best
    ), kept[0]);
  }
  if (strategy !== 'sample') throw new RangeError(`unsupported strategy: ${strategy}`);
  if (!Number.isFinite(sampleUnit) || sampleUnit < 0 || sampleUnit >= 1) {
    throw new RangeError('sampleUnit must be in [0, 1)');
  }

  let cumulative = 0;
  for (const row of kept) {
    cumulative += row.sampleProbability;
    if (sampleUnit < cumulative) return row;
  }
  return kept[kept.length - 1];
}

export function buildDistribution({
  generated,
  temperature,
  topK,
  topP,
  strategy,
  sampleUnit = null,
  vocabulary = TOKEN_GENERATION_VOCABULARY,
}) {
  if (!Array.isArray(generated)) throw new TypeError('generated must be an array');
  requirePositive(temperature, 'temperature');
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) throw new TypeError('vocabulary must be non-empty');

  const step = generated.length;
  const logits = vocabulary.map((item, index) => (
    item.logit
    + Math.sin((step + 1) * (index + 1)) * 0.35
    - generated.filter((token) => token === item.token).length * 0.6
  ));
  const probabilities = computeSoftmax(logits, temperature);
  const filtered = filterDistribution({ probabilities, topK, topP });
  const rows = filtered.map((row) => ({
    ...row,
    ...vocabulary[row.index],
    logit: logits[row.index],
  }));
  const activeSampleUnit = sampleUnit ?? samplingUnitForStep(step);
  const selected = selectToken(rows, strategy, activeSampleUnit);

  return { rows, selected, sampleUnit: activeSampleUnit };
}

export function generationPhase(generatedCount, baseContextLength = BASE_CONTEXT.length) {
  if (!Number.isInteger(generatedCount) || generatedCount < 0) {
    throw new RangeError('generatedCount must be a non-negative integer');
  }
  if (!Number.isInteger(baseContextLength) || baseContextLength <= 0) {
    throw new RangeError('baseContextLength must be a positive integer');
  }

  if (generatedCount === 0) {
    return {
      phase: 'prefill',
      forwardInputRows: baseContextLength,
      cacheRowsRead: 0,
      cacheRowsWritten: baseContextLength,
      totalCacheRowsBeforeNextToken: baseContextLength,
    };
  }

  return {
    phase: 'decode',
    forwardInputRows: 1,
    cacheRowsRead: baseContextLength + generatedCount - 1,
    cacheRowsWritten: 1,
    totalCacheRowsBeforeNextToken: baseContextLength + generatedCount,
  };
}
