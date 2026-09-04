import assert from 'node:assert/strict';
import test from 'node:test';

import { analyzeAdjustment, analyzePreset, isPathActive } from './causalGraphModel.js';

test('unadjusted confounding backdoor stays open', () => {
  const result = analyzeAdjustment([]);
  assert.equal(result.openBackdoors.length, 1);
  assert.equal(result.validForTotalEffect, false);
});

test('adjusting the true confounder closes the backdoor without blocking causal paths', () => {
  const result = analyzeAdjustment(['C']);
  assert.equal(result.openBackdoors.length, 0);
  assert.equal(result.openedColliders.length, 0);
  assert.equal(result.blockedCausalPaths.length, 0);
  assert.equal(result.validForTotalEffect, true);
});

test('conditioning on the mediator blocks part of the total causal effect', () => {
  const result = analyzeAdjustment(['C', 'M']);
  assert.deepEqual(result.blockedCausalPaths.map((path) => path.id), ['mediated']);
  assert.equal(result.totalEffectPreserved, false);
  assert.equal(result.validForTotalEffect, false);
});

test('conditioning on the collider opens a previously blocked non-causal path', () => {
  const result = analyzeAdjustment(['C', 'S']);
  assert.deepEqual(result.openedColliders.map((path) => path.id), ['collider']);
  assert.equal(result.validForTotalEffect, false);
});

test('collider path is blocked when the collider is not conditioned on', () => {
  assert.equal(isPathActive(['T', 'S', 'U', 'Y'], []), false);
});

test('adjusting only the mediator neither closes confounding nor preserves the total effect', () => {
  const result = analyzePreset('mediator');
  assert.equal(result.openBackdoors.length, 1);
  assert.equal(result.blockedCausalPaths.length, 1);
});

test('invalid adjustment nodes fail explicitly', () => {
  assert.throws(() => analyzeAdjustment(['Y']), RangeError);
  assert.throws(() => analyzePreset('magic'), RangeError);
  assert.throws(() => isPathActive(['T'], []), TypeError);
});
