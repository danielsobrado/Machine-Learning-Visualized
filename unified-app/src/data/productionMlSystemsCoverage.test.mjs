import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateAssessmentCompetencyEvidence,
  validateAssessmentCompetencyRegistry,
} from './assessmentCompetencies.js';
import { FULL_ASSESSMENT_QUESTION_COUNT } from './assessmentQuality.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS,
  PRODUCTION_ML_SYSTEMS_REQUIREMENTS,
} from './productionMlSystemsCoverage.js';

test('production ML systems registry is internally complete', () => {
  assert.deepEqual(
    validateAssessmentCompetencyRegistry({
      auditedLessonIds: PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS,
      competencies: PRODUCTION_ML_SYSTEMS_REQUIREMENTS,
    }),
    [],
  );
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

test('production ML systems competencies retain explicit reasoning evidence', () => {
  assert.deepEqual(
    validateAssessmentCompetencyEvidence({
      competencies: PRODUCTION_ML_SYSTEMS_REQUIREMENTS,
      getAssessment: getLessonAssessment,
    }),
    [],
  );
});
