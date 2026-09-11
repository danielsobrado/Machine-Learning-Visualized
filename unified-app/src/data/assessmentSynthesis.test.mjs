import assert from 'node:assert/strict';
import test from 'node:test';

import { getLessonAssessment } from './lessonAssessments.js';
import {
  ASSESSMENT_SYNTHESIS_REQUIREMENTS,
  validateAssessmentSynthesis,
} from './assessmentSynthesis.js';

test('assessment synthesis contract has the required stable families', () => {
  assert.deepEqual(
    ASSESSMENT_SYNTHESIS_REQUIREMENTS.map(({ id }) => id),
    [
      'synthesis.classification.decision-policy',
      'synthesis.linear-algebra.decomposition-choice',
      'synthesis.training.failure-localization',
      'synthesis.attention.memory-vs-compute',
      'synthesis.rag.failure-localization',
      'synthesis.production-ml.failure-localization',
    ],
  );
});

test('every synthesis family resolves live evidence across multiple lessons', () => {
  assert.deepEqual(
    validateAssessmentSynthesis({ getAssessment: getLessonAssessment }),
    [],
  );

  for (const requirement of ASSESSMENT_SYNTHESIS_REQUIREMENTS) {
    assert.ok(requirement.evidence.length >= 3, `${requirement.id} should have multiple evidence points`);
    assert.ok(
      new Set(requirement.evidence.map(({ lessonId }) => lessonId)).size >= 2,
      `${requirement.id} should span multiple lessons`,
    );
  }
});

test('synthesis validator fails deterministically when evidence disappears', () => {
  const broken = [
    {
      id: 'synthesis.test.broken',
      evidence: [
        { lessonId: 'classification-metrics', type: 'scenario', id: 'missing-scenario' },
        { lessonId: 'calibration', type: 'scenario', id: 'calibration-shift-recalibration' },
      ],
    },
  ];

  const errors = validateAssessmentSynthesis({
    requirements: broken,
    getAssessment: getLessonAssessment,
  });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /missing-scenario/);
});
