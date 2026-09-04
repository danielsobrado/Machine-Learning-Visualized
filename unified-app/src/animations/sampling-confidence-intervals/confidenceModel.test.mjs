import assert from 'node:assert/strict';
import test from 'node:test';
import { buildConfidenceLab, inverseNormalCdf, proportionInterval, sampleBinomial } from './confidenceModel.js';

const scenario = { trueRate: 58, sampleSize: 160, confidence: 95, runs: 120, method: 'wilson', seed: 17 };

test('critical values vary continuously with confidence', () => {
  const z94 = inverseNormalCdf(0.97);
  const z95 = inverseNormalCdf(0.975);
  assert.ok(z95 > z94);
  assert.ok(z95 - z94 < 0.1);
});

test('binomial sampling is deterministic for a fixed seed', () => {
  assert.equal(sampleBinomial(0.4, 100, 123), sampleBinomial(0.4, 100, 123));
  assert.notEqual(sampleBinomial(0.4, 100, 123), sampleBinomial(0.4, 100, 124));
});

test('Wilson remains informative when a sample has zero successes', () => {
  const interval = proportionInterval(0, 40, 95, 'wilson');
  assert.equal(interval.low, 0);
  assert.ok(interval.high > 0);
  assert.ok(interval.width > 0);
});

test('Wald collapses at zero successes', () => {
  const interval = proportionInterval(0, 40, 95, 'wald');
  assert.equal(interval.low, 0);
  assert.equal(interval.high, 0);
  assert.equal(interval.width, 0);
});

test('quadrupling n roughly halves interval width', () => {
  const lab = buildConfidenceLab(scenario);
  const ratio = lab.metrics.fourXReferenceWidth / lab.metrics.referenceWidth;
  assert.ok(ratio > 0.45 && ratio < 0.55);
});

test('Wilson coverage beats Wald in a rare-event small-sample scenario', () => {
  const rare = { trueRate: 5, sampleSize: 40, confidence: 95, runs: 4000, seed: 31 };
  const wilson = buildConfidenceLab({ ...rare, method: 'wilson' });
  const wald = buildConfidenceLab({ ...rare, method: 'wald' });
  assert.ok(Math.abs(wilson.metrics.coverage - 0.95) < Math.abs(wald.metrics.coverage - 0.95));
  assert.ok(wald.metrics.collapsed > 0);
});

test('all simulated proportions and interval bounds stay valid', () => {
  const lab = buildConfidenceLab(scenario);
  for (const interval of lab.intervals) {
    assert.ok(interval.pHat >= 0 && interval.pHat <= 1);
    assert.ok(interval.low >= 0 && interval.high <= 1);
    assert.ok(interval.low <= interval.high);
  }
});
