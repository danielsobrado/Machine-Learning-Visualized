import assert from 'node:assert/strict';
import test from 'node:test';

import { findAssessmentNearDuplicates } from './assessmentNearDuplicates.js';

const assessments = Object.freeze({
  lesson: Object.freeze({
    quiz: Object.freeze([
      Object.freeze({
        id: 'q-a',
        prompt: 'Which deployment threshold should minimize false negative business cost for this classifier?',
      }),
      Object.freeze({
        id: 'q-b',
        prompt: 'Which classifier deployment threshold should minimize business cost from false negatives?',
      }),
      Object.freeze({
        id: 'q-c',
        prompt: 'How does feature scaling change nearest-neighbor distance geometry?',
      }),
    ]),
    scenarioQuestions: Object.freeze([]),
  }),
});

test('near-duplicate audit reports strongly overlapping prompts deterministically', () => {
  const first = findAssessmentNearDuplicates(assessments, { threshold: 0.65 });
  const second = findAssessmentNearDuplicates(assessments, { threshold: 0.65 });

  assert.deepEqual(first, second);
  assert.equal(first.length, 1);
  assert.equal(first[0].leftId, 'q-a');
  assert.equal(first[0].rightId, 'q-b');
  assert.ok(first[0].similarity >= 0.65);
});

test('near-duplicate audit ignores unrelated prompts and supports narrow allowlisting', () => {
  assert.equal(findAssessmentNearDuplicates(assessments, { threshold: 0.9 }).length, 0);
  assert.equal(
    findAssessmentNearDuplicates(assessments, {
      threshold: 0.65,
      allowlist: ['lesson:q-a|q-b'],
    }).length,
    0,
  );
});
