import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateAssessmentCompetencyEvidence,
  validateAssessmentCompetencyRegistry,
} from './assessmentCompetencies.js';
import { FULL_ASSESSMENT_QUESTION_COUNT } from './assessmentQuality.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS,
  CORE_MODEL_MECHANICS_REQUIREMENTS,
} from './coreModelMechanicsCoverage.js';

test('core model mechanics registry is internally complete', () => {
  assert.deepEqual(
    validateAssessmentCompetencyRegistry({
      auditedLessonIds: CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS,
      competencies: CORE_MODEL_MECHANICS_REQUIREMENTS,
    }),
    [],
  );
});

test('core model mechanics lessons remain complete curated assessments', () => {
  for (const lessonId of CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS) {
    const assessment = getLessonAssessment(lessonId);
    assert.equal(assessment.source, 'curated', `${lessonId}: assessment must remain curated`);
    assert.equal(
      assessment.quiz.length,
      FULL_ASSESSMENT_QUESTION_COUNT,
      `${lessonId}: assessment must remain a complete ${FULL_ASSESSMENT_QUESTION_COUNT}-question quiz`,
    );
  }
});

test('core model mechanics competencies retain explicit reasoning evidence', () => {
  assert.deepEqual(
    validateAssessmentCompetencyEvidence({
      competencies: CORE_MODEL_MECHANICS_REQUIREMENTS,
      getAssessment: getLessonAssessment,
    }),
    [],
  );
});
