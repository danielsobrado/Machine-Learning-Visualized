import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NEURAL_CNN_NEXT_LAB_LESSON_IDS,
  NEURAL_CNN_NEXT_QUALITY_LESSON_IDS,
} from '../components/quality-labs/neuralCnnNextConstants.js';
import { EFFECTIVE_MANUAL_LESSON_QUALITY } from './effectiveLessonQuality.js';
import { MANUAL_LESSON_QUALITY } from './lessonQualityManifest.js';
import { NEURAL_CNN_NEXT_QUALITY_OVERRIDES } from './lessonQualityNeuralCnnNextOverrides.js';

test('every neural CNN next-depth quality lesson has matching metadata', () => {
  assert.deepEqual(
    [...NEURAL_CNN_NEXT_QUALITY_LESSON_IDS].sort(),
    Object.keys(NEURAL_CNN_NEXT_QUALITY_OVERRIDES).sort(),
  );
});

test('native ReLU and LayerNorm depth is protected without duplicate external labs', () => {
  assert.equal(NEURAL_CNN_NEXT_LAB_LESSON_IDS.has('relu'), false);
  assert.equal(NEURAL_CNN_NEXT_LAB_LESSON_IDS.has('layer-normalization'), false);
  assert.equal(NEURAL_CNN_NEXT_QUALITY_LESSON_IDS.has('relu'), true);
  assert.equal(NEURAL_CNN_NEXT_QUALITY_LESSON_IDS.has('layer-normalization'), true);
});

test('neural CNN overrides advance the base lesson quality action', () => {
  for (const id of NEURAL_CNN_NEXT_QUALITY_LESSON_IDS) {
    const base = MANUAL_LESSON_QUALITY[id];
    const override = NEURAL_CNN_NEXT_QUALITY_OVERRIDES[id];
    const effective = EFFECTIVE_MANUAL_LESSON_QUALITY[id];

    assert.ok(base, `Missing base quality entry for ${id}`);
    assert.equal(base.tier, 'B');
    assert.equal(base.status, 'stable');
    assert.equal(effective.reason, override.reason);
    assert.equal(effective.nextAction, override.nextAction);
    assert.equal(effective.tier, base.tier);
    assert.equal(effective.status, base.status);
    assert.notEqual(effective.nextAction, base.nextAction, `${id} still advertises a completed neural/CNN gap`);
  }
});
