import assert from 'node:assert/strict';
import test from 'node:test';

import { allAnimations } from '../../data/animations.js';
import {
  LESSON_CODE_LAB_GROUPS,
  LESSON_CODE_LABS,
} from './lessonCodeLabs.js';
import {
  validateLessonCodeLabCoverage,
  validateLessonCodeLabGroup,
} from './lessonCodeLabQuality.js';

test('every active lesson has a real executable code lab', () => {
  const lessonIds = allAnimations.map(({ id }) => id);

  assert.deepEqual(
    validateLessonCodeLabCoverage({
      lessonIds,
      groups: LESSON_CODE_LAB_GROUPS,
    }),
    [],
  );
});

test('production code labs never expose generic scaffolding exercises', () => {
  const forbidden = /keyword-check|focus-term-count|best-candidate|pipeline-stage-check/i;

  assert.ok(LESSON_CODE_LABS.length >= allAnimations.length);
  for (const exercise of LESSON_CODE_LABS) {
    assert.equal(forbidden.test(exercise.id), false, `${exercise.id}: generic scaffold leaked`);
    assert.equal(/recognize the lesson keyword|count focus terms|select the best candidate|check required stages/i.test(exercise.title), false);
  }
});

test('code lab quality validator rejects placeholder and non-executable exercises', () => {
  const errors = validateLessonCodeLabGroup({
    lessonId: 'broken',
    exercises: [{
      id: 'broken-keyword-check',
      title: 'Recognize the lesson keyword',
      concept: 'thin',
      objective: 'thin',
      starterCode: 'return null;',
      testCode: '',
      solution: '',
      hints: [],
      explanation: 'thin',
    }],
  });

  assert.ok(errors.some((error) => /placeholder/.test(error)));
  assert.ok(errors.some((error) => /TODO/.test(error)));
  assert.ok(errors.some((error) => /tests/.test(error)));
  assert.ok(errors.some((error) => /hints/.test(error)));
});
