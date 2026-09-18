import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ASSESSMENT_COVERAGE_DIMENSION,
  REVIEW_DEPTH_REQUIRED_DIMENSIONS,
  assessmentCoverageDimensions,
  validateAssessmentCoverageDimensions,
} from './assessmentCoverageDimensions.js';
import { CURRICULUM_REVIEW_GAP_AUDITED_LESSON_IDS } from './curriculumReviewGapCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

test('reviewed gap lessons have applied tradeoff and boundary depth', () => {
  assert.deepEqual(
    validateAssessmentCoverageDimensions({
      lessonIds: CURRICULUM_REVIEW_GAP_AUDITED_LESSON_IDS,
      getAssessment: getLessonAssessment,
      requiredDimensions: REVIEW_DEPTH_REQUIRED_DIMENSIONS,
    }),
    [],
  );
});

test('question count alone cannot satisfy depth coverage', () => {
  const shallow = {
    quiz: Array.from({ length: 100 }, (_, index) => ({
      id: `q-${index}`,
      level: 'Foundation',
      skill: 'recall',
    })),
    scenarioQuestions: [],
  };

  const dimensions = assessmentCoverageDimensions(shallow);
  assert.equal(dimensions.includes(ASSESSMENT_COVERAGE_DIMENSION.FOUNDATION), true);
  assert.equal(dimensions.includes(ASSESSMENT_COVERAGE_DIMENSION.APPLIED), false);

  const errors = validateAssessmentCoverageDimensions({
    lessonIds: ['shallow'],
    getAssessment: () => shallow,
  });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /applied/);
  assert.match(errors[0], /tradeoff/);
  assert.match(errors[0], /boundary/);
});

test('visual-state scenarios expose the visual coverage dimension', () => {
  const dimensions = assessmentCoverageDimensions(getLessonAssessment('classification-metrics'));
  assert.equal(dimensions.includes(ASSESSMENT_COVERAGE_DIMENSION.VISUAL), true);
});

test('representative review lessons include real visual-state evidence', () => {
  const lessonIds = [
    'bayes-rule-ml',
    'condition-number',
    'conv2d',
    'kv-cache',
    'rag-retrieval-evaluation',
    'q-learning',
  ];

  for (const lessonId of lessonIds) {
    const dimensions = assessmentCoverageDimensions(getLessonAssessment(lessonId));
    assert.equal(
      dimensions.includes(ASSESSMENT_COVERAGE_DIMENSION.VISUAL),
      true,
      `${lessonId}: expected visual-state review evidence`,
    );
  }
});
