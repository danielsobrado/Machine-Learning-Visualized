import assert from 'node:assert/strict';
import test from 'node:test';

import {
  glovePairLoss,
  gloveWeight,
  gloveWeightingExperiment,
  logCooccurrenceTarget,
} from './gloveModel.js';

test('GloVe downweights rare positive counts and caps frequent counts at one', () => {
  assert.ok(gloveWeight(1) < gloveWeight(10));
  assert.ok(gloveWeight(10) < gloveWeight(100));
  assert.equal(gloveWeight(100), 1);
  assert.equal(gloveWeight(1000), 1);
});

test('zero co-occurrence has zero weight but no log target', () => {
  assert.equal(gloveWeight(0), 0);
  assert.throws(() => logCooccurrenceTarget(0), RangeError);
});

test('zero-count pairs are excluded rather than evaluating log zero', () => {
  const pair = glovePairLoss({ count: 0, prediction: 3 });
  assert.equal(pair.included, false);
  assert.equal(pair.target, null);
  assert.equal(pair.contribution, 0);
});

test('equal residuals contribute less loss when the co-occurrence is rare', () => {
  const rows = gloveWeightingExperiment({ counts: [1, 10, 100, 1000], residual: 2 });
  assert.ok(rows[0].contribution < rows[1].contribution);
  assert.ok(rows[1].contribution < rows[2].contribution);
  assert.equal(rows[2].contribution, rows[3].contribution);
});

test('log targets compress multiplicative count differences', () => {
  const firstGap = logCooccurrenceTarget(10) - logCooccurrenceTarget(1);
  const secondGap = logCooccurrenceTarget(100) - logCooccurrenceTarget(10);
  assert.ok(Math.abs(firstGap - secondGap) < 1e-12);
});

test('pair loss uses weighted squared residual against log count', () => {
  const target = logCooccurrenceTarget(10);
  const pair = glovePairLoss({ count: 10, prediction: target + 2 });
  assert.ok(Math.abs(pair.residual - 2) < 1e-12);
  assert.ok(Math.abs(pair.contribution - gloveWeight(10) * 4) < 1e-12);
});

test('invalid GloVe configurations fail explicitly', () => {
  assert.throws(() => gloveWeight(-1), RangeError);
  assert.throws(() => gloveWeight(1, { xMax: 0 }), RangeError);
  assert.throws(() => gloveWeight(1, { alpha: 0 }), RangeError);
  assert.throws(() => glovePairLoss({ count: 1, prediction: Number.NaN }), TypeError);
});
