import assert from 'node:assert/strict';
import test from 'node:test';
import {
  actionProbability,
  bernoulliKl,
  buildPpoCounterexamples,
  clippedSurrogate,
  evaluatePpoBatch,
  policyRatio,
  sigmoid,
} from './ppoModel.js';
import { PPO_PRESETS } from './ppoConfig.js';

const preset = (id) => PPO_PRESETS.find((item) => item.id === id);

test('sigmoid is stable and produces valid probabilities', () => {
  assert.ok(sigmoid(1000) <= 1 && sigmoid(1000) > 0.999);
  assert.ok(sigmoid(-1000) >= 0 && sigmoid(-1000) < 0.001);
});

test('action probabilities for a binary policy sum to one', () => {
  const logit = 0.7;
  assert.ok(Math.abs(actionProbability(logit, 0) + actionProbability(logit, 1) - 1) < 1e-12);
});

test('policy ratio is derived from a feasible old and new policy', () => {
  const result = policyRatio({ oldLogit: -0.4, newLogit: 0.9, action: 1 });
  assert.ok(result.oldProbability > 0 && result.newProbability < 1);
  assert.ok(Math.abs(result.ratio - result.newProbability / result.oldProbability) < 1e-12);
});

test('positive advantage clips excessive helpful ratio increases', () => {
  const row = clippedSurrogate({ ratio: 1.8, advantage: 2, epsilon: 0.2 });
  assert.equal(row.clippingActive, true);
  assert.ok(Math.abs(row.objective - 2.4) < 1e-12);
});

test('negative advantage clips excessive helpful ratio decreases', () => {
  const row = clippedSurrogate({ ratio: 0.3, advantage: -2, epsilon: 0.2 });
  assert.equal(row.clippingActive, true);
  assert.ok(Math.abs(row.objective + 1.6) < 1e-12);
});

test('wrong-way large ratio moves are not necessarily clipped', () => {
  const examples = buildPpoCounterexamples(0.2);
  assert.equal(examples.positiveWrongWay.clippingActive, false);
  assert.equal(examples.negativeWrongWay.clippingActive, false);
});

test('KL is zero for identical policies and non-negative otherwise', () => {
  assert.ok(Math.abs(bernoulliKl(0.5, 0.5)) < 1e-12);
  assert.ok(bernoulliKl(-1, 1) > 0);
});

test('batch metrics stay finite and clip fraction stays bounded', () => {
  for (const scenario of PPO_PRESETS) {
    const batch = evaluatePpoBatch(scenario.samples, 0.2);
    assert.ok(Number.isFinite(batch.meanObjective));
    assert.ok(Number.isFinite(batch.meanKl));
    assert.ok(batch.clipFraction >= 0 && batch.clipFraction <= 1);
  }
});
