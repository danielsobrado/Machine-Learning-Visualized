import { BLOOM_DEFAULTS } from './bloomFilterConstants.js';

function requireSize(size) {
  if (!Number.isInteger(size) || size <= 0) throw new RangeError('size must be a positive integer');
}

function requireItem(item) {
  if (typeof item !== 'string' || item.length === 0) throw new TypeError('item must be a non-empty string');
}

function hash1(item) {
  let hash = 0;
  for (let index = 0; index < item.length; index += 1) {
    hash = (Math.imul(hash, 31) + item.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function hash2(item) {
  let hash = 5381;
  for (let index = 0; index < item.length; index += 1) {
    hash = (Math.imul(hash, 33) ^ item.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function bloomIndices(item, size = BLOOM_DEFAULTS.size) {
  requireItem(item);
  requireSize(size);
  return [hash1(item) % size, hash2(item) % size];
}

export function insertIntoBits(bits, item) {
  if (!Array.isArray(bits) || bits.some((value) => value !== 0 && value !== 1)) throw new TypeError('bits must contain only 0/1');
  const next = [...bits];
  bloomIndices(item, bits.length).forEach((index) => { next[index] = 1; });
  return next;
}

export function queryBits(bits, item) {
  if (!Array.isArray(bits) || bits.length === 0) throw new TypeError('bits must be non-empty');
  return bloomIndices(item, bits.length).every((index) => bits[index] === 1);
}

export function naiveDeleteBits(bits, item) {
  if (!Array.isArray(bits) || bits.length === 0) throw new TypeError('bits must be non-empty');
  const next = [...bits];
  bloomIndices(item, bits.length).forEach((index) => { next[index] = 0; });
  return next;
}

export function insertIntoCounts(counts, item) {
  if (!Array.isArray(counts) || counts.some((value) => !Number.isInteger(value) || value < 0)) throw new TypeError('counts must contain non-negative integers');
  const next = [...counts];
  bloomIndices(item, counts.length).forEach((index) => { next[index] += 1; });
  return next;
}

export function deleteFromCounts(counts, item) {
  if (!Array.isArray(counts) || counts.some((value) => !Number.isInteger(value) || value < 0)) throw new TypeError('counts must contain non-negative integers');
  const next = [...counts];
  bloomIndices(item, counts.length).forEach((index) => { next[index] = Math.max(0, next[index] - 1); });
  return next;
}

export function queryCounts(counts, item) {
  if (!Array.isArray(counts) || counts.length === 0) throw new TypeError('counts must be non-empty');
  return bloomIndices(item, counts.length).every((index) => counts[index] > 0);
}

export function deletionExperiment({
  size = BLOOM_DEFAULTS.size,
  deletedItem = BLOOM_DEFAULTS.deletedItem,
  protectedItem = BLOOM_DEFAULTS.protectedItem,
} = {}) {
  requireSize(size);
  let bits = Array(size).fill(0);
  bits = insertIntoBits(bits, deletedItem);
  bits = insertIntoBits(bits, protectedItem);
  const beforeBits = [...bits];
  const afterNaiveDelete = naiveDeleteBits(bits, deletedItem);

  let counts = Array(size).fill(0);
  counts = insertIntoCounts(counts, deletedItem);
  counts = insertIntoCounts(counts, protectedItem);
  const beforeCounts = [...counts];
  const afterCountingDelete = deleteFromCounts(counts, deletedItem);

  return {
    size,
    deletedItem,
    protectedItem,
    deletedIndices: bloomIndices(deletedItem, size),
    protectedIndices: bloomIndices(protectedItem, size),
    beforeBits,
    afterNaiveDelete,
    protectedPresentBefore: queryBits(beforeBits, protectedItem),
    protectedPresentAfterNaiveDelete: queryBits(afterNaiveDelete, protectedItem),
    beforeCounts,
    afterCountingDelete,
    protectedPresentAfterCountingDelete: queryCounts(afterCountingDelete, protectedItem),
  };
}

export function falsePositiveApproximation({ bits, items, hashes }) {
  [bits, items, hashes].forEach((value) => {
    if (!Number.isFinite(value) || value <= 0) throw new RangeError('Bloom tuning values must be positive');
  });
  return (1 - Math.exp((-hashes * items) / bits)) ** hashes;
}
