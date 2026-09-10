import assert from 'node:assert/strict';
import test from 'node:test';

import { FULL_ASSESSMENT_QUESTION_COUNT } from './assessmentQuality.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  FOUNDATION_MODEL_ARCHITECTURE_AUDITED_LESSON_IDS,
  FOUNDATION_MODEL_ARCHITECTURE_REQUIREMENTS,
} from './foundationModelArchitectureCoverage.js';

function assertRegistryCoverage() {
  const requirementLessonIds = [...new Set(FOUNDATION_MODEL_ARCHITECTURE_REQUIREMENTS.map(({ lessonId }) => lessonId))].sort();
  assert.deepEqual(
    requirementLessonIds,
    [...FOUNDATION_MODEL_ARCHITECTURE_AUDITED_LESSON_IDS].sort(),
    'every audited lesson must have at least one explicit competency contract',
  );
}

function assertUniqueEvidenceIds() {
  const evidenceIds = FOUNDATION_MODEL_ARCHITECTURE_REQUIREMENTS.flatMap(({ quizIds }) => quizIds);
  assert.equal(
    new Set(evidenceIds).size,
    evidenceIds.length,
    'quiz evidence ids should protect one explicit competency each',
  );
}

test('foundation-model architecture registry is internally complete', () => {
  assertRegistryCoverage();
  assertUniqueEvidenceIds();
});

test('foundation-model architecture audited lessons remain complete curated assessments', () => {
  for (const lessonId of FOUNDATION_MODEL_ARCHITECTURE_AUDITED_LESSON_IDS) {
    const assessment = getLessonAssessment(lessonId);
    assert.equal(assessment.source, 'curated', `${lessonId}: assessment must remain curated`);
    assert.equal(
      assessment.quiz.length,
      FULL_ASSESSMENT_QUESTION_COUNT,
      `${lessonId}: assessment must remain a complete ${FULL_ASSESSMENT_QUESTION_COUNT}-question quiz`,
    );
  }
});

test('foundation-model architecture competencies retain explicit reasoning evidence', async (t) => {
  for (const requirement of FOUNDATION_MODEL_ARCHITECTURE_REQUIREMENTS) {
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
