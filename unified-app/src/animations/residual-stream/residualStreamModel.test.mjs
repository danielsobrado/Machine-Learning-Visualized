import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_WRITE_STRENGTHS } from './residualStreamConstants.js';
import {
  addVectors,
  buildResidualLedger,
  layerNorm,
  meanVariance,
  normalizationPlacement,
  vectorNorm,
} from './residualStreamModel.js';

test('residual writes are purely additive', () => {
  const ledger = buildResidualLedger(DEFAULT_WRITE_STRENGTHS);
  ledger.writes.forEach((step) => {
    assert.deepEqual(step.after, addVectors(step.before, step.write));
  });
});

test('LayerNorm standardizes features rather than unit-normalizing the vector', () => {
  const normalized = layerNorm([2, 0, -1, 3]);
  const { mean, variance } = meanVariance(normalized);

  assert.ok(Math.abs(mean) < 1e-12);
  assert.ok(Math.abs(variance - 1) < 1e-4);
  assert.ok(Math.abs(vectorNorm(normalized) - 1) > 0.5);
});

test('pre-norm preserves the direct residual path around the normalized sublayer', () => {
  const result = normalizationPlacement('pre');
  assert.deepEqual(result.output, addVectors(result.input, result.write));
  assert.equal(result.equation, 'y = x + F(LN(x))');
});

test('post-norm normalizes after residual addition', () => {
  const result = normalizationPlacement('post');
  assert.equal(result.equation, 'y = LN(x + F(x))');
  assert.ok(Math.abs(result.outputStats.mean) < 1e-12);
  assert.ok(Math.abs(result.outputStats.variance - 1) < 1e-4);
});
