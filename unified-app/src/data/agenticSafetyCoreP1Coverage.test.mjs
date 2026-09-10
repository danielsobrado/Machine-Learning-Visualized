import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentScenarioExtensionEntries } from './assessmentScenarioExtensions.js';
import { getLessonAssessment, PRIORITY_ASSESSMENT_LESSON_IDS } from './lessonAssessments.js';
import {
  AGENTIC_SAFETY_CORE_P1_AUDITED_LESSON_IDS,
  AGENTIC_SAFETY_CORE_P1_REQUIREMENTS,
} from './agenticSafetyCoreP1Coverage.js';

const DEPTH_SCENARIO_LEVELS = new Set([
  'application', 'calculation', 'comparison', 'decision', 'design', 'diagnosis', 'mechanism', 'visual-state',
]);

const REQUIRED_COMPETENCY_IDS = Object.freeze([
  'tool-routing-evidence-computation-grounding',
  'tool-injection-loop-side-effect-training-boundary',
  'agent-target-fix-regression-scope-evidence',
  'agent-recovery-approval-verification-reporting',
  'frontier-safe-success-guardrail-reliability-metrics',
  'frontier-action-evidence-oversight-release-gating',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('agentic and safety core lessons remain priority curated P1 assessments', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);
  for (const lessonId of AGENTIC_SAFETY_CORE_P1_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: lesson must remain a priority assessment`);
    assert.equal(getLessonAssessment(lessonId).source, 'curated', `${lessonId}: assessment must remain curated`);
  }
});

test('agentic and safety core P1 contract keeps required competencies explicit', () => {
  assert.deepEqual(
    AGENTIC_SAFETY_CORE_P1_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_COMPETENCY_IDS].sort(),
  );
});

test('agentic and safety core P1 competencies resolve to live applied P1 evidence', async (t) => {
  const priorityByScenarioId = new Map(
    getAssessmentScenarioExtensionEntries().map(({ priority, question }) => [question.id, priority]),
  );
  const evidenceIds = [];

  for (const requirement of AGENTIC_SAFETY_CORE_P1_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const quiz = itemsById(assessment.quiz);
      const scenarios = itemsById(assessment.scenarioQuestions);

      for (const quizId of requirement.quizIds) {
        assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      }
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
