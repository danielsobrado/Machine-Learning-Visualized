import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEEP_LEARNING_P0_AUDITED_LESSON_IDS,
  DEEP_LEARNING_P0_REQUIREMENTS,
} from './deepLearningP0Coverage.js';
import {
  getLessonAssessment,
  PRIORITY_ASSESSMENT_LESSON_IDS,
} from './lessonAssessments.js';

const TRANSFER_QUIZ_LEVELS = new Set(['Application', 'Tricky', 'Interview']);
const DEPTH_SCENARIO_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);
const MIN_QUIZ_EVIDENCE_PER_COMPETENCY = 2;
const REQUIRED_P0_COMPETENCY_IDS = Object.freeze([
  'backprop-chain-rule',
  'backprop-local-global-gradients',
  'backprop-broken-gradient-flow',
  'backprop-incorrect-gradient-debugging',
  'activation-saturation',
  'activation-dead-relu',
  'activation-sigmoid-tanh-limitations',
  'activation-gelu-leaky-relu-tradeoffs',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('deep learning P0 audit remains aligned with priority curated assessments', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);

  for (const lessonId of DEEP_LEARNING_P0_AUDITED_LESSON_IDS) {
    assert.ok(
      priorityIds.has(lessonId),
      `${lessonId}: P0 deep learning audit lesson must remain a priority assessment`,
    );
    assert.equal(
      getLessonAssessment(lessonId).source,
      'curated',
      `${lessonId}: P0 deep learning assessment must remain curated`,
    );
  }
});

test('deep learning P0 audit keeps every required competency explicit', () => {
  assert.deepEqual(
    DEEP_LEARNING_P0_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_P0_COMPETENCY_IDS].sort(),
  );
});

test('deep learning P0 competencies resolve to explicit live assessment ids', async (t) => {
  for (const requirement of DEEP_LEARNING_P0_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const quiz = itemsById(assessment.quiz);
      const scenarios = itemsById(assessment.scenarioQuestions);

      assert.ok(
        requirement.quizIds.length >= MIN_QUIZ_EVIDENCE_PER_COMPETENCY,
        `${requirement.id}: protect at least ${MIN_QUIZ_EVIDENCE_PER_COMPETENCY} quiz signals`,
      );
      assert.ok(
        Number.isInteger(requirement.minScenarioEvidence) && requirement.minScenarioEvidence >= 0,
        `${requirement.id}: minScenarioEvidence must be a nonnegative integer`,
      );
      assert.ok(
        requirement.scenarioIds.length >= requirement.minScenarioEvidence,
        `${requirement.id}: protect at least ${requirement.minScenarioEvidence} scenario signals`,
      );

      for (const quizId of requirement.quizIds) {
        assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      }
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarios.has(scenarioId), `${requirement.id}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('deep learning P0 competencies protect reasoning depth rather than recall only', () => {
  for (const requirement of DEEP_LEARNING_P0_REQUIREMENTS) {
    const assessment = getLessonAssessment(requirement.lessonId);
    const quiz = itemsById(assessment.quiz);
    const scenarios = itemsById(assessment.scenarioQuestions);

    const hasTransferQuiz = requirement.quizIds.some(
      (quizId) => TRANSFER_QUIZ_LEVELS.has(quiz.get(quizId)?.level),
    );
    const hasDepthScenario = requirement.scenarioIds.some(
      (scenarioId) => DEPTH_SCENARIO_LEVELS.has(scenarios.get(scenarioId)?.level),
    );

    assert.ok(
      hasTransferQuiz || hasDepthScenario,
      `${requirement.id}: must protect at least one transfer or depth assessment`,
    );
  }
});

test('deep learning P0 contract covers audited lessons without evidence reuse', () => {
  const requirementIds = DEEP_LEARNING_P0_REQUIREMENTS.map(({ id }) => id);
  assert.equal(
    new Set(requirementIds).size,
    requirementIds.length,
    'P0 deep learning competency ids must be unique',
  );

  const requirementLessonIds = [...new Set(
    DEEP_LEARNING_P0_REQUIREMENTS.map(({ lessonId }) => lessonId),
  )].sort();
  assert.deepEqual(
    requirementLessonIds,
    [...DEEP_LEARNING_P0_AUDITED_LESSON_IDS].sort(),
    'P0 deep learning requirements must stay aligned with the audited lesson list',
  );

  const evidenceIds = [];
  for (const requirement of DEEP_LEARNING_P0_REQUIREMENTS) {
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
    'P0 deep learning evidence ids should protect one explicit competency each',
  );
});
