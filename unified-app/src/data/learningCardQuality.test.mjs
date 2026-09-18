import assert from 'node:assert/strict';
import test from 'node:test';

import { allAnimations } from './animations.js';
import {
  GENERIC_LEARNING_CARD_PHRASES,
  REQUIRED_LEARNING_CARD_TYPES,
  validateLearningCardCoverage,
  validateLearningCardOverride,
} from './learningCardQuality.js';
import {
  LEARNING_CARD_OVERRIDES,
  createLearningModel,
} from './animationLearning.js';

test('every active lesson has a complete explicit learning narrative', () => {
  const lessonIds = allAnimations.map(({ id }) => id);

  assert.equal(new Set(lessonIds).size, lessonIds.length);
  assert.equal(Object.keys(LEARNING_CARD_OVERRIDES).length, lessonIds.length);
  assert.deepEqual(
    validateLearningCardCoverage({
      lessonIds,
      overrides: LEARNING_CARD_OVERRIDES,
    }),
    [],
  );
});

test('live learning cards never fall back to generic placeholder teaching copy', () => {
  for (const animation of allAnimations) {
    const model = createLearningModel(animation, allAnimations);
    const primaryCards = model.learningCards.slice(0, REQUIRED_LEARNING_CARD_TYPES.length);

    assert.deepEqual(
      primaryCards.map(({ type }) => type),
      REQUIRED_LEARNING_CARD_TYPES,
      `${animation.id}: unexpected primary learning-card order`,
    );

    const text = primaryCards.map(({ body }) => body).join(' ').toLowerCase();
    for (const phrase of GENERIC_LEARNING_CARD_PHRASES) {
      assert.equal(
        text.includes(phrase.toLowerCase()),
        false,
        `${animation.id}: generic fallback phrase leaked into the live lesson`,
      );
    }
  }
});

test('quality validator rejects thin generic and passive card sets', () => {
  const broken = Object.fromEntries(REQUIRED_LEARNING_CARD_TYPES.map((type) => [
    type,
    { body: 'Short generic text.' },
  ]));

  const errors = validateLearningCardOverride('broken-lesson', broken);
  assert.ok(errors.length >= REQUIRED_LEARNING_CARD_TYPES.length);
  assert.ok(errors.some((error) => /too thin/.test(error)));
  assert.ok(errors.some((error) => /distinct/.test(error)));
  assert.ok(errors.some((error) => /Mistake to avoid/.test(error)));
  assert.ok(errors.some((error) => /active learner action/.test(error)));
});
