import test from 'node:test';
import assert from 'node:assert/strict';
import { P1_LAB_LESSON_IDS } from '../components/priority-labs/p1PriorityConstants.js';
import { EFFECTIVE_MANUAL_LESSON_QUALITY } from './effectiveLessonQuality.js';
import { MANUAL_LESSON_QUALITY } from './lessonQualityManifest.js';
import { LESSON_QUALITY_NEXT_OVERRIDES } from './lessonQualityNextOverrides.js';
import { P1_COMPLETED_QUALITY_OVERRIDES } from './lessonQualityP1Overrides.js';

test('every completed P1 override refers to a registered manual quality entry', () => {
  for (const id of Object.keys(P1_COMPLETED_QUALITY_OVERRIDES)) {
    assert.ok(MANUAL_LESSON_QUALITY[id], `Missing base quality entry for ${id}`);
  }
});

test('every shared P1 lesson lab has completed quality metadata', () => {
  for (const id of P1_LAB_LESSON_IDS) {
    assert.ok(P1_COMPLETED_QUALITY_OVERRIDES[id], `Missing P1 quality override for ${id}`);
  }
});

test('effective quality metadata advances beyond stale P1 actions', () => {
  for (const [id, p1Override] of Object.entries(P1_COMPLETED_QUALITY_OVERRIDES)) {
    const base = MANUAL_LESSON_QUALITY[id];
    const effective = EFFECTIVE_MANUAL_LESSON_QUALITY[id];
    const latestOverride = LESSON_QUALITY_NEXT_OVERRIDES[id] || p1Override;
    assert.equal(effective.tier, base.tier, `${id} should not be promoted only because a quality gap closed`);
    assert.equal(effective.status, base.status);
    assert.equal(effective.reason, latestOverride.reason);
    assert.equal(effective.nextAction, latestOverride.nextAction);
    assert.notEqual(effective.nextAction, base.nextAction, `${id} still advertises its completed P1 gap`);
  }
});
