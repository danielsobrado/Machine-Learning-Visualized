import assert from 'node:assert/strict';
import test from 'node:test';

import { allAnimations } from './animations.js';
import {
  FRONTIER_CASE_STUDY_METADATA,
  FRONTIER_CASE_STUDY_REVIEW_DATE,
} from './frontierCaseStudyMetadata.js';

const activeLessonIds = new Set(allAnimations.map(({ id }) => id));

test('named frontier case studies are versioned and review-dated', () => {
  assert.match(FRONTIER_CASE_STUDY_REVIEW_DATE, /^\\d{4}-\\d{2}-\\d{2}$/);

  for (const [lessonId, metadata] of Object.entries(FRONTIER_CASE_STUDY_METADATA)) {
    assert.equal(activeLessonIds.has(lessonId), true, `${lessonId}: case-study metadata must reference an active lesson`);
    assert.equal(metadata.lessonType, 'case-study');
    assert.ok(metadata.versionLabel.length >= 3);
    assert.equal(metadata.reviewedAt, FRONTIER_CASE_STUDY_REVIEW_DATE);
    assert.ok(metadata.mechanismFocus.length >= 25);
    assert.match(metadata.maintenancePolicy, /durable mechanism/i);
  }
});

test('all active Qwen case-study chapters have maintenance metadata', () => {
  const qwenLessonIds = [...activeLessonIds].filter((lessonId) => lessonId.startsWith('qwen-'));

  assert.ok(qwenLessonIds.length >= 6);
  for (const lessonId of qwenLessonIds) {
    assert.ok(FRONTIER_CASE_STUDY_METADATA[lessonId], `${lessonId}: missing frontier case-study metadata`);
  }
});
