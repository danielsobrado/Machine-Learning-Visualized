import test from 'node:test';
import assert from 'node:assert/strict';

import { CLASSICAL_ML_NEXT_LESSON_IDS } from '../components/quality-labs/classicalMlNextConstants.js';
import { EFFECTIVE_MANUAL_LESSON_QUALITY } from './effectiveLessonQuality.js';
import { MANUAL_LESSON_QUALITY } from './lessonQualityManifest.js';
import { LESSON_QUALITY_NEXT_OVERRIDES } from './lessonQualityNextOverrides.js';
import { P1_COMPLETED_QUALITY_OVERRIDES } from './lessonQualityP1Overrides.js';

test('every advanced classical ML lab has matching quality metadata', () => {
  assert.deepEqual(
    [...CLASSICAL_ML_NEXT_LESSON_IDS].sort(),
    Object.keys(LESSON_QUALITY_NEXT_OVERRIDES).sort(),
  );
});

test('advanced quality overrides layer on registered lessons and previous P1 completion', () => {
  for (const id of CLASSICAL_ML_NEXT_LESSON_IDS) {
    assert.ok(MANUAL_LESSON_QUALITY[id], `Missing base quality entry for ${id}`);
    assert.ok(P1_COMPLETED_QUALITY_OVERRIDES[id], `Missing previous P1 completion for ${id}`);
    const effective = EFFECTIVE_MANUAL_LESSON_QUALITY[id];
    const override = LESSON_QUALITY_NEXT_OVERRIDES[id];
    assert.equal(effective.reason, override.reason);
    assert.equal(effective.nextAction, override.nextAction);
    assert.equal(effective.tier, MANUAL_LESSON_QUALITY[id].tier);
  }
});
