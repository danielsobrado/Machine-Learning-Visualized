import assert from 'node:assert/strict';
import test from 'node:test';

import { FULL_ASSESSMENT_QUESTION_COUNT } from './assessmentQuality.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS,
  NUMERICAL_LINEAR_ALGEBRA_REQUIREMENTS,
} from './numericalLinearAlgebraCoverage.js';

function assertRegistryCoverage() {
  const requirementLessonIds = [...new Set(NUMERICAL_LINEAR_ALGEBRA_REQUIREMENTS.map(({ lessonId }) => lessonId))].sort();
  assert.deepEqual(
    requirementLessonIds,
    [...NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS].sort(),
    'every audited lesson must have at least one explicit competency contract',
  );
}

function assertUniqueEvidenceIds() {
  const evidenceIds = NUMERICAL_LINEAR_ALGEBRA_REQUIREMENTS.flatMap(({ quizIds }) => quizIds);
  assert.equal(
    new Set(evidenceIds).size,
    evidenceIds.length,
    'quiz evidence ids should protect one explicit competency each',
  );
}

test('numerical linear algebra registry is internally complete', () => {
  assertRegistryCoverage();
  assertUniqueEvidenceIds();
});

test('numerical linear algebra audited lessons remain complete curated assessments', () => {
  for (const lessonId of NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS) {
    const assessment = getLessonAssessment(lessonId);
    assert.equal(assessment.source, 'curated', `${lessonId}: assessment must remain curated`);
    assert.equal(
      assessment.quiz.length,
      FULL_ASSESSMENT_QUESTION_COUNT,
      `${lessonId}: assessment must remain a complete ${FULL_ASSESSMENT_QUESTION_COUNT}-question quiz`,
    );
  }
});

test('numerical linear algebra competencies retain explicit reasoning evidence', async (t) => {
  for (const requirement of NUMERICAL_LINEAR_ALGEBRA_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const quizIds = new Set(getLessonAssessment(requirement.lessonId).quiz.map(({ id }) => id));
      for (const quizId of requirement.quizIds) {
        assert.ok(
          quizIds.has(quizId),
          `${requirement.lessonId}: missing ${requirement.id} evidence ${quizId}`,
        );
      }
    });
  }
});
