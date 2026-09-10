import assert from 'node:assert/strict';
import test from 'node:test';

import { FULL_ASSESSMENT_QUESTION_COUNT } from './assessmentQuality.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS,
  PRODUCTION_ML_SYSTEMS_REQUIREMENTS,
} from './productionMlSystemsCoverage.js';

function assertRegistryIntegrity() {
  assert.equal(
    new Set(PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS).size,
    PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS.length,
    'audited lesson ids must be unique',
  );

  const competencyIds = PRODUCTION_ML_SYSTEMS_REQUIREMENTS.map(({ id }) => id);
  assert.equal(new Set(competencyIds).size, competencyIds.length, 'competency ids must be unique');

  const evidenceIds = PRODUCTION_ML_SYSTEMS_REQUIREMENTS.flatMap(({ quizIds }) => quizIds);
  assert.equal(new Set(evidenceIds).size, evidenceIds.length, 'quiz evidence ids must be unique');

  const coveredLessonIds = [...new Set(PRODUCTION_ML_SYSTEMS_REQUIREMENTS.map(({ lessonId }) => lessonId))].sort();
  assert.deepEqual(
    coveredLessonIds,
    [...PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS].sort(),
    'every audited lesson must have explicit competency protection',
  );
}

test('production ML systems registry is internally complete', () => {
  assertRegistryIntegrity();
});

test('production ML systems lessons remain complete curated assessments', () => {
  for (const lessonId of PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS) {
    const assessment = getLessonAssessment(lessonId);
    assert.equal(assessment.source, 'curated', `${lessonId}: assessment must remain curated`);
    assert.equal(
      assessment.quiz.length,
      FULL_ASSESSMENT_QUESTION_COUNT,
      `${lessonId}: assessment must remain a complete ${FULL_ASSESSMENT_QUESTION_COUNT}-question quiz`,
    );
  }
});

test('production ML systems competencies retain explicit reasoning evidence', async (t) => {
  for (const requirement of PRODUCTION_ML_SYSTEMS_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const quizIds = new Set(getLessonAssessment(requirement.lessonId).quiz.map(({ id }) => id));
      for (const quizId of requirement.quizIds) {
        assert.ok(quizIds.has(quizId), `${requirement.lessonId}: missing ${requirement.id} evidence ${quizId}`);
      }
    });
  }
});
