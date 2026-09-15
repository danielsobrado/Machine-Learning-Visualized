import test from 'node:test';
import assert from 'node:assert/strict';

import { LINEAR_ALGEBRA_NEXT_LESSON_IDS } from '../components/quality-labs/linearAlgebraNextConstants.js';
import { EFFECTIVE_MANUAL_LESSON_QUALITY } from './effectiveLessonQuality.js';
import { MANUAL_LESSON_QUALITY } from './lessonQualityManifest.js';
import { LINEAR_ALGEBRA_NEXT_QUALITY_OVERRIDES } from './lessonQualityLinearAlgebraNextOverrides.js';

test('every numerical linear algebra next-depth lab has matching quality metadata', () => {
  assert.deepEqual(
    [...LINEAR_ALGEBRA_NEXT_LESSON_IDS].sort(),
    Object.keys(LINEAR_ALGEBRA_NEXT_QUALITY_OVERRIDES).sort(),
  );
});

test('numerical linear algebra overrides advance the base lesson quality action', () => {
  for (const id of LINEAR_ALGEBRA_NEXT_LESSON_IDS) {
    const base = MANUAL_LESSON_QUALITY[id];
    const override = LINEAR_ALGEBRA_NEXT_QUALITY_OVERRIDES[id];
    const effective = EFFECTIVE_MANUAL_LESSON_QUALITY[id];
    assert.ok(base, `Missing base quality entry for ${id}`);
    assert.equal(base.tier, 'B');
    assert.equal(base.status, 'stable');
    assert.equal(effective.reason, override.reason);
    assert.equal(effective.nextAction, override.nextAction);
    assert.equal(effective.tier, base.tier);
    assert.equal(effective.status, base.status);
    assert.notEqual(effective.nextAction, base.nextAction, `${id} still advertises the completed numerical gap`);
  }
});
