import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEEP_LEARNING_P1_AUDITED_LESSON_IDS,
  DEEP_LEARNING_P1_REQUIREMENTS,
} from './deepLearningP1Coverage.js';
import {
  getLessonAssessment,
  PRIORITY_ASSESSMENT_LESSON_IDS,
} from './lessonAssessments.js';

const DEPTH_SCENARIO_LEVELS = new Set(['application', 'calculation', 'comparison', 'decision', 'design', 'diagnosis', 'mechanism', 'visual-state']);
const REQUIRED_P1_COMPETENCY_IDS = Object.freeze([
  'fundamentals-xor-nonlinearity',
  'fundamentals-tensor-shapes',
  'fundamentals-parameter-counting',
  'fundamentals-forward-pass-reasoning',
  'optimization-sgd-momentum-adam',
  'optimization-learning-rate',
  'optimization-schedules',
  'optimization-weight-decay-vs-l2',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('deep learning P1 audit remains aligned with priority curated assessments', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);

  for (const lessonId of DEEP_LEARNING_P1_AUDITED_LESSON_IDS) {
    assert.ok(
      priorityIds.has(lessonId),
      `${lessonId}: P1 deep learning audit lesson must remain a priority assessment`,
    );
    assert.equal(
      getLessonAssessment(lessonId).source,
      'curated',
      `${lessonId}: P1 deep learning assessment must remain curated`,
    );
  }
});

test('deep learning P1 audit keeps every required competency explicit', () => {
  assert.deepEqual(
    DEEP_LEARNING_P1_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_P1_COMPETENCY_IDS].sort(),
  );
});

test('deep learning P1 competencies resolve to explicit live assessment ids', async (t) => {
  for (const requirement of DEEP_LEARNING_P1_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const quiz = itemsById(assessment.quiz);
      const scenarios = itemsById(assessment.scenarioQuestions);

      assert.ok(requirement.quizIds.length >= 1, `${requirement.id}: protect at least one quiz signal`);
      assert.ok(requirement.scenarioIds.length >= 1, `${requirement.id}: protect at least one scenario signal`);

      for (const quizId of requirement.quizIds) {
        assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      }
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarios.has(scenarioId), `${requirement.id}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('deep learning P1 fundamentals require applied reasoning evidence', () => {
  for (const requirement of DEEP_LEARNING_P1_REQUIREMENTS) {
    const assessment = getLessonAssessment(requirement.lessonId);
    const scenarios = itemsById(assessment.scenarioQuestions);

    assert.ok(
      requirement.scenarioIds.some((scenarioId) => DEPTH_SCENARIO_LEVELS.has(scenarios.get(scenarioId)?.level)),
      `${requirement.id}: must protect applied or calculation evidence`,
    );
  }
});

test('deep learning P1 contract keeps competency and evidence ids unique', () => {
  const requirementIds = DEEP_LEARNING_P1_REQUIREMENTS.map(({ id }) => id);
  assert.equal(new Set(requirementIds).size, requirementIds.length, 'P1 competency ids must be unique');

  const requirementLessonIds = [...new Set(
    DEEP_LEARNING_P1_REQUIREMENTS.map(({ lessonId }) => lessonId),
  )].sort();
  assert.deepEqual(
    requirementLessonIds,
    [...DEEP_LEARNING_P1_AUDITED_LESSON_IDS].sort(),
    'P1 requirements must stay aligned with the audited lesson list',
  );

  const evidenceIds = [];
  for (const requirement of DEEP_LEARNING_P1_REQUIREMENTS) {
    const requirementEvidenceIds = [...requirement.quizIds, ...requirement.scenarioIds];
    assert.equal(
      new Set(requirementEvidenceIds).size,
      requirementEvidenceIds.length,
      `${requirement.id}: duplicate evidence id`,
    );
    evidenceIds.push(...requirementEvidenceIds);
  }

  assert.equal(
    new Set(evidenceIds).size,
    evidenceIds.length,
    'P1 deep learning evidence ids should protect one explicit competency each',
  );
});
