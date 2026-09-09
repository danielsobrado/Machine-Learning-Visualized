import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentScenarioExtensionEntries } from './assessmentScenarioExtensions.js';
import { getLessonAssessment, PRIORITY_ASSESSMENT_LESSON_IDS } from './lessonAssessments.js';
import {
  GRADIENT_DESCENT_P1_AUDITED_LESSON_IDS,
  GRADIENT_DESCENT_P1_REQUIREMENTS,
} from './gradientDescentP1Coverage.js';

const DEPTH_SCENARIO_LEVELS = new Set([
  'application', 'calculation', 'comparison', 'decision', 'design', 'diagnosis', 'mechanism', 'visual-state',
]);

const REQUIRED_COMPETENCY_IDS = Object.freeze([
  'gd-learning-rate-overshoot',
  'gd-saddle-vs-convergence',
  'gd-update-sign-correctness',
  'gd-gradient-reset-accumulation',
  'gd-feature-scale-conditioning',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('gradient descent remains a priority curated P1 assessment', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);
  for (const lessonId of GRADIENT_DESCENT_P1_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: lesson must remain a priority assessment`);
    assert.equal(getLessonAssessment(lessonId).source, 'curated', `${lessonId}: assessment must remain curated`);
  }
});

test('gradient descent P1 contract keeps required competencies explicit', () => {
  assert.deepEqual(
    GRADIENT_DESCENT_P1_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_COMPETENCY_IDS].sort(),
  );
});

test('gradient descent P1 competencies resolve to live applied P1 evidence', async (t) => {
  const priorityByScenarioId = new Map(
    getAssessmentScenarioExtensionEntries().map(({ priority, question }) => [question.id, priority]),
  );
  const evidenceIds = [];
  for (const requirement of GRADIENT_DESCENT_P1_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const quiz = itemsById(assessment.quiz);
      const scenarios = itemsById(assessment.scenarioQuestions);
      for (const quizId of requirement.quizIds) assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarios.has(scenarioId), `${requirement.id}: missing scenario ${scenarioId}`);
        assert.equal(priorityByScenarioId.get(scenarioId), 'P1', `${scenarioId}: scenario evidence must remain P1`);
      }
      assert.ok(
        requirement.scenarioIds.some((scenarioId) => DEPTH_SCENARIO_LEVELS.has(scenarios.get(scenarioId)?.level)),
        `${requirement.id}: must protect applied reasoning evidence`,
      );
    });
    evidenceIds.push(...requirement.quizIds, ...requirement.scenarioIds);
  }
  assert.equal(new Set(evidenceIds).size, evidenceIds.length, 'evidence ids should protect one explicit competency each');
});
