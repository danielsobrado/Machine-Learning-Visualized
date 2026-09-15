import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildDistribution,
  filterDistribution,
  generationPhase,
  selectToken,
} from './tokenGenerationModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('top-k and top-p filtering renormalizes the final sampling distribution', () => {
  const rows = filterDistribution({ probabilities: [0.5, 0.3, 0.15, 0.05], topK: 3, topP: 0.8 });
  const kept = rows.filter((row) => row.kept);
  assert.deepEqual(kept.map((row) => row.index), [0, 1]);
  close(kept.reduce((sum, row) => sum + row.sampleProbability, 0), 1);
  close(kept[0].sampleProbability, 0.625);
  close(kept[1].sampleProbability, 0.375);
});

test('probability-weighted sampling uses the renormalized mass instead of a candidate index', () => {
  const rows = filterDistribution({ probabilities: [0.6, 0.3, 0.1], topK: 3, topP: 1 });
  assert.equal(selectToken(rows, 'sample', 0.59).index, 0);
  assert.equal(selectToken(rows, 'sample', 0.61).index, 1);
  assert.equal(selectToken(rows, 'sample', 0.95).index, 2);
});

test('greedy selection chooses the largest surviving probability', () => {
  const rows = filterDistribution({ probabilities: [0.2, 0.5, 0.3], topK: 2, topP: 1 });
  assert.equal(selectToken(rows, 'greedy').index, 1);
});

test('distribution builder returns only normalized kept sampling probabilities', () => {
  const distribution = buildDistribution({
    generated: [],
    temperature: 0.9,
    topK: 3,
    topP: 0.9,
    strategy: 'sample',
    sampleUnit: 0.7,
  });
  const keptMass = distribution.rows.reduce((sum, row) => sum + row.sampleProbability, 0);
  close(keptMass, 1);
  assert.ok(distribution.selected.kept);
});

test('prefill computes the full prompt and writes its cache once', () => {
  assert.deepEqual(generationPhase(0, 3), {
    phase: 'prefill',
    forwardInputRows: 3,
    cacheRowsRead: 0,
    cacheRowsWritten: 3,
    totalCacheRowsBeforeNextToken: 3,
  });
});

test('decode computes only the newest token while reading prior cached K and V rows', () => {
  assert.deepEqual(generationPhase(2, 3), {
    phase: 'decode',
    forwardInputRows: 1,
    cacheRowsRead: 4,
    cacheRowsWritten: 1,
    totalCacheRowsBeforeNextToken: 5,
  });
});

test('invalid sampling configuration fails explicitly', () => {
  assert.throws(() => filterDistribution({ probabilities: [0.5, 0.5], topK: 0, topP: 1 }), RangeError);
  assert.throws(() => selectToken([{ kept: true, sampleProbability: 1 }], 'sample', 1), RangeError);
  assert.throws(() => generationPhase(-1), RangeError);
});
