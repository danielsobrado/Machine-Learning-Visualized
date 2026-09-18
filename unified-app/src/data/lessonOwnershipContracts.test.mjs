import assert from 'node:assert/strict';
import test from 'node:test';

import { allAnimations } from './animations.js';
import {
  COMPARISON_SYNTHESIS_LESSON_CONTRACTS,
  LESSON_OWNERSHIP_CONTRACTS,
  lessonOwnershipContract,
} from './lessonOwnershipContracts.js';

const activeLessonIds = new Set(allAnimations.map(({ id }) => id));

function normalized(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

test('ownership contracts reference active lessons and unique family roles', () => {
  for (const family of LESSON_OWNERSHIP_CONTRACTS) {
    assert.ok(family.id);
    assert.ok(family.lessons.length >= 2, `${family.id}: overlapping family should contain multiple lessons`);

    const lessonIds = family.lessons.map(({ lessonId }) => lessonId);
    const roles = family.lessons.map(({ role }) => role);
    assert.equal(new Set(lessonIds).size, lessonIds.length, `${family.id}: duplicate lesson contract`);
    assert.equal(new Set(roles).size, roles.length, `${family.id}: roles should be distinct within the family`);

    const ownedConcepts = new Set();
    for (const lesson of family.lessons) {
      assert.equal(activeLessonIds.has(lesson.lessonId), true, `${lesson.lessonId}: ownership references an inactive lesson`);
      assert.ok(lesson.owns.length >= 2, `${lesson.lessonId}: ownership must be substantive`);
      assert.ok(lesson.excludes.length >= 1, `${lesson.lessonId}: overlap families must declare exclusions`);

      for (const concept of lesson.owns) {
        const key = normalized(concept);
        assert.equal(ownedConcepts.has(key), false, `${family.id}: duplicate owned concept "${concept}"`);
        ownedConcepts.add(key);
      }
    }
  }
});

test('bundled lessons are explicitly comparison or synthesis lessons', () => {
  const expected = new Map([
    ['knn-naive-bayes-svm', 'comparison'],
    ['dropout-batchnorm', 'comparison'],
    ['loss-functions-likelihoods', 'synthesis'],
  ]);

  assert.equal(COMPARISON_SYNTHESIS_LESSON_CONTRACTS.length, expected.size);

  for (const contract of COMPARISON_SYNTHESIS_LESSON_CONTRACTS) {
    assert.equal(activeLessonIds.has(contract.lessonId), true);
    assert.equal(contract.role, expected.get(contract.lessonId));
    assert.ok(contract.owns.length >= 2);
    assert.equal(lessonOwnershipContract(contract.lessonId), contract);
  }
});

test('ownership lookup resolves every overlapping lesson', () => {
  for (const family of LESSON_OWNERSHIP_CONTRACTS) {
    for (const lesson of family.lessons) {
      assert.equal(lessonOwnershipContract(lesson.lessonId), lesson);
    }
  }
  assert.equal(lessonOwnershipContract('does-not-exist'), null);
});
