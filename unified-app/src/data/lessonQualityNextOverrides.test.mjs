import test from 'node:test';
import assert from 'node:assert/strict';

import { CAUSAL_ADVANCED_LESSON_IDS } from '../components/priority-labs/causalAdvancedDefaults.js';
import { CLASSICAL_ML_NEXT_LESSON_IDS } from '../components/quality-labs/classicalMlNextConstants.js';
import { FOUNDATIONS_NEXT_LESSON_IDS } from '../components/quality-labs/foundationsNextConstants.js';
import { PRODUCTION_RELIABILITY_NEXT_LESSON_IDS } from '../components/quality-labs/productionReliabilityNextConstants.js';
import { EFFECTIVE_MANUAL_LESSON_QUALITY } from './effectiveLessonQuality.js';
import { MANUAL_LESSON_QUALITY } from './lessonQualityManifest.js';
import { LESSON_QUALITY_NEXT_OVERRIDES } from './lessonQualityNextOverrides.js';
import { P1_COMPLETED_QUALITY_OVERRIDES } from './lessonQualityP1Overrides.js';
import { PRODUCTION_RELIABILITY_NEXT_QUALITY_OVERRIDES } from './lessonQualityProductionNextOverrides.js';

const NEXT_QUALITY_LESSON_IDS = Object.freeze(new Set([
  ...CLASSICAL_ML_NEXT_LESSON_IDS,
  ...CAUSAL_ADVANCED_LESSON_IDS,
  ...FOUNDATIONS_NEXT_LESSON_IDS,
  ...PRODUCTION_RELIABILITY_NEXT_LESSON_IDS,
]));

const EFFECTIVE_NEXT_OVERRIDES = Object.freeze({
  ...LESSON_QUALITY_NEXT_OVERRIDES,
  ...PRODUCTION_RELIABILITY_NEXT_QUALITY_OVERRIDES,
});

test('every advanced lesson lab has matching quality metadata', () => {
  assert.deepEqual(
    [...NEXT_QUALITY_LESSON_IDS].sort(),
    Object.keys(EFFECTIVE_NEXT_OVERRIDES).sort(),
  );
});

test('advanced quality overrides layer on registered lessons and previous P1 completion', () => {
  for (const id of NEXT_QUALITY_LESSON_IDS) {
    assert.ok(MANUAL_LESSON_QUALITY[id], `Missing base quality entry for ${id}`);
    assert.ok(P1_COMPLETED_QUALITY_OVERRIDES[id], `Missing previous P1 completion for ${id}`);
    const effective = EFFECTIVE_MANUAL_LESSON_QUALITY[id];
    const override = EFFECTIVE_NEXT_OVERRIDES[id];
    assert.equal(effective.reason, override.reason);
    assert.equal(effective.nextAction, override.nextAction);
    assert.equal(effective.tier, MANUAL_LESSON_QUALITY[id].tier);
    assert.equal(effective.status, MANUAL_LESSON_QUALITY[id].status);
    assert.notEqual(
      effective.nextAction,
      P1_COMPLETED_QUALITY_OVERRIDES[id].nextAction,
      `${id} still advertises the completed advanced gap`,
    );
  }
});
