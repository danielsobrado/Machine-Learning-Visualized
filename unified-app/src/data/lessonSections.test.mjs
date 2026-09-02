import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_LESSON_SECTION_ID,
  LESSON_SECTIONS,
  getLessonSectionId,
  getLessonSectionPath,
  getLessonStaticRouteParts,
} from './lessonSections.js';

test('lesson sections keep the standard learning-mode order', () => {
  assert.deepEqual(
    LESSON_SECTIONS.map((section) => section.id),
    ['lesson', 'questions', 'glossary', 'code', 'deep-dive'],
  );
});

test('lesson section paths round-trip through the route parser', () => {
  const lessonId = 'linear-regression';

  for (const section of LESSON_SECTIONS) {
    const path = getLessonSectionPath(lessonId, section.id);
    assert.equal(getLessonSectionId(path, lessonId), section.id);
  }

  assert.equal(getLessonSectionPath(lessonId), `/animation/${lessonId}`);
  assert.equal(getLessonSectionId(`/animation/${lessonId}/`, lessonId), DEFAULT_LESSON_SECTION_ID);
  assert.equal(getLessonSectionId(`/animation/${lessonId}/unknown`, lessonId), null);
});

test('static lesson routes include every learning mode', () => {
  assert.deepEqual(getLessonStaticRouteParts('linear-regression'), [
    ['animation', 'linear-regression'],
    ['animation', 'linear-regression', 'questions'],
    ['animation', 'linear-regression', 'glossary'],
    ['animation', 'linear-regression', 'code'],
    ['animation', 'linear-regression', 'deep-dive'],
  ]);
});
