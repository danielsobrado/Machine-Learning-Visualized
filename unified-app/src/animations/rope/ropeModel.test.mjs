import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRoPEStats, inverseFrequency } from './ropeModel.js';

const CONFIG = {
  queryPosition: 8,
  keyPosition: 3,
  rotaryDimension: 64,
  base: 10000,
  pairIndex: 5,
};

test('direct rotation equals the relative-position dot-product identity', () => {
  const stats = buildRoPEStats(CONFIG);
  assert.ok(Math.abs(stats.directPairScore - stats.relativePairScore) < 1e-12);
});

test('shifting query and key by the same amount preserves the positional pair score', () => {
  const baseline = buildRoPEStats(CONFIG);
  const shifted = buildRoPEStats({
    ...CONFIG,
    queryPosition: CONFIG.queryPosition + 11,
    keyPosition: CONFIG.keyPosition + 11,
  });

  assert.equal(shifted.relativeDistance, baseline.relativeDistance);
  assert.ok(Math.abs(shifted.directPairScore - baseline.directPairScore) < 1e-12);
});

test('later rotary pairs use lower inverse frequencies', () => {
  const first = inverseFrequency(10000, 0, 64);
  const later = inverseFrequency(10000, 12, 64);
  assert.ok(later < first);
});
