import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getLessonAssessment,
  PRIORITY_ASSESSMENT_LESSON_IDS,
} from './lessonAssessments.js';
import {
  TRANSFORMER_P0_AUDITED_LESSON_IDS,
  TRANSFORMER_P0_REQUIREMENTS,
} from './transformerP0Coverage.js';

const DEPTH_SCENARIO_LEVELS = new Set([
  'application',
  'calculation',
  'comparison',
  'decision',
  'design',
  'diagnosis',
  'mechanism',
  'visual-state',
]);

const REQUIRED_TRANSFORMER_P0_COMPETENCY_IDS = Object.freeze([
  'transformer-block-dataflow',
  'transformer-causal-mask-semantics',
  'transformer-residual-shape-contract',
  'transformer-normalization-order',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('transformer P0 audit remains priority and curated', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);

  for (const lessonId of TRANSFORMER_P0_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: P0 lesson must remain a priority assessment`);
    assert.equal(
      getLessonAssessment(lessonId).source,
      'curated',
      `${lessonId}: P0 transformer assessment must remain curated`,
    );
  }
});

test('transformer P0 contract keeps every required competency explicit', () => {
  assert.deepEqual(
    TRANSFORMER_P0_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_TRANSFORMER_P0_COMPETENCY_IDS].sort(),
  );
});

test('transformer P0 competencies resolve to live quiz and scenario evidence', async (t) => {
  for (const requirement of TRANSFORMER_P0_REQUIREMENTS) {
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

test('transformer P0 competencies require applied reasoning evidence', () => {
  for (const requirement of TRANSFORMER_P0_REQUIREMENTS) {
    const scenarios = itemsById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    assert.ok(
      requirement.scenarioIds.some((scenarioId) => DEPTH_SCENARIO_LEVELS.has(scenarios.get(scenarioId)?.level)),
      `${requirement.id}: must protect applied evidence`,
    );
  }
});

test('transformer P0 contract keeps ids unique and lesson scope exact', () => {
  const requirementIds = TRANSFORMER_P0_REQUIREMENTS.map(({ id }) => id);
  assert.equal(new Set(requirementIds).size, requirementIds.length, 'P0 competency ids must be unique');
  assert.deepEqual(
    [...new Set(TRANSFORMER_P0_REQUIREMENTS.map(({ lessonId }) => lessonId))],
    [...TRANSFORMER_P0_AUDITED_LESSON_IDS],
  );

  const evidenceIds = TRANSFORMER_P0_REQUIREMENTS.flatMap(
    ({ quizIds, scenarioIds }) => [...quizIds, ...scenarioIds],
  );
  assert.equal(new Set(evidenceIds).size, evidenceIds.length, 'P0 evidence ids must be unique');
});
