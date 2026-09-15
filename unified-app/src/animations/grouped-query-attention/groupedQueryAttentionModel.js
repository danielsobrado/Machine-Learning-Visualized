import { CACHE_BYTES_PER_ELEMENT, GROUP_COLORS, KV_OPTIONS } from './groupedQueryAttentionConstants.js';

export function validKvHeadOptions(queryHeads) {
  validatePositiveInteger(queryHeads, 'queryHeads');
  return KV_OPTIONS.filter((heads) => heads <= queryHeads && queryHeads % heads === 0);
}

export function modeLabel(queryHeads, kvHeads) {
  validateHeadConfiguration(queryHeads, kvHeads);
  if (kvHeads === queryHeads) return 'Multi-head attention';
  if (kvHeads === 1) return 'Multi-query attention';
  return 'Grouped-query attention';
}

export function buildGroupedQueryStats({ queryHeads, kvHeads, sequenceLength, headDim }) {
  validateHeadConfiguration(queryHeads, kvHeads);
  validatePositiveInteger(sequenceLength, 'sequenceLength');
  validatePositiveInteger(headDim, 'headDim');

  const groupSize = queryHeads / kvHeads;
  const kvElements = sequenceLength * kvHeads * headDim * 2;
  const mhaElements = sequenceLength * queryHeads * headDim * 2;
  const memoryRatio = kvElements / mhaElements;
  const savedPercent = (1 - memoryRatio) * 100;
  const kvCacheBytes = kvElements * CACHE_BYTES_PER_ELEMENT;
  const mhaCacheBytes = mhaElements * CACHE_BYTES_PER_ELEMENT;

  const groups = Array.from({ length: kvHeads }, (_, groupIndex) => {
    const start = groupIndex * groupSize;
    return {
      id: groupIndex,
      color: GROUP_COLORS[groupIndex % GROUP_COLORS.length],
      kvLabel: `KV ${groupIndex + 1}`,
      queryHeads: Array.from({ length: groupSize }, (_, offset) => start + offset + 1),
    };
  });

  return {
    queryHeads,
    kvHeads,
    sequenceLength,
    headDim,
    groupSize,
    kvElements,
    mhaElements,
    memoryRatio,
    savedPercent,
    kvCacheBytes,
    mhaCacheBytes,
    uniqueKvReadRatio: memoryRatio,
    groups,
    label: modeLabel(queryHeads, kvHeads),
  };
}

function validateHeadConfiguration(queryHeads, kvHeads) {
  validatePositiveInteger(queryHeads, 'queryHeads');
  validatePositiveInteger(kvHeads, 'kvHeads');
  if (kvHeads > queryHeads || queryHeads % kvHeads !== 0) {
    throw new RangeError('kvHeads must divide queryHeads and cannot exceed it');
  }
}

function validatePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}
