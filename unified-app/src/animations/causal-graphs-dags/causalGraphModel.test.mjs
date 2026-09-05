import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyzeAdjustment,
  analyzeFrontDoor,
  analyzeMBias,
  analyzePreset,
  isPathActive,
} from './causalGraphModel.js';

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

test('M-bias path is created by conditioning on its collider', () => {
  assert.equal(analyzeMBias(false).active, false);
  assert.equal(analyzeMBias(true).active, true);
});

test('front-door criteria all pass only in the valid graph', () => {
  const valid = analyzeFrontDoor('valid');
  assert.equal(valid.identified, true);
  assert.ok(valid.criteria.every((criterion) => criterion.pass));

  for (const scenarioId of ['directBypass', 'treatmentMediatorConfounding', 'mediatorOutcomeConfounding']) {
    const result = analyzeFrontDoor(scenarioId);
    assert.equal(result.identified, false);
    assert.ok(result.criteria.some((criterion) => !criterion.pass));
  }
});

test('adjusting only the mediator neither closes confounding nor preserves the total effect', () => {
  const result = analyzePreset('mediator');
  assert.equal(result.openBackdoors.length, 1);
  assert.equal(result.blockedCausalPaths.length, 1);
});

test('invalid adjustment nodes and front-door scenarios fail explicitly', () => {
  assert.throws(() => analyzeAdjustment(['Y']), RangeError);
  assert.throws(() => analyzePreset('magic'), RangeError);
  assert.throws(() => analyzeFrontDoor('magic'), RangeError);
  assert.throws(() => isPathActive(['T'], []), TypeError);
});
