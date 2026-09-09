import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentScenarioExtensionEntries } from './assessmentScenarioExtensions.js';
import { getLessonAssessment, PRIORITY_ASSESSMENT_LESSON_IDS } from './lessonAssessments.js';
import {
  DATA_ENGINEERING_FOR_ML_P1_AUDITED_LESSON_IDS,
  DATA_ENGINEERING_FOR_ML_P1_REQUIREMENTS,
} from './dataEngineeringForMlP1Coverage.js';

const DEPTH_SCENARIO_LEVELS = new Set([
  'application', 'calculation', 'comparison', 'decision', 'design', 'diagnosis', 'mechanism', 'visual-state',
]);

const REQUIRED_COMPETENCY_IDS = Object.freeze([
  'de-point-in-time-asof-join',
  'de-train-serve-transformation-version-parity',
  'de-event-vs-availability-time',
  'de-feature-freshness-slo',
  'de-semantic-schema-unit-contract',
  'de-backfill-historical-time-correctness',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('data engineering for ML remains a priority curated P1 assessment', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);
  for (const lessonId of DATA_ENGINEERING_FOR_ML_P1_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: lesson must remain a priority assessment`);
    assert.equal(getLessonAssessment(lessonId).source, 'curated', `${lessonId}: assessment must remain curated`);
  }
});

test('data engineering for ML P1 contract keeps required competencies explicit', () => {
  assert.deepEqual(
    DATA_ENGINEERING_FOR_ML_P1_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_COMPETENCY_IDS].sort(),
  );
});

test('data engineering for ML P1 competencies resolve to live assessment evidence', async (t) => {
  for (const requirement of DATA_ENGINEERING_FOR_ML_P1_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const quiz = itemsById(assessment.quiz);
      const scenarios = itemsById(assessment.scenarioQuestions);
      for (const quizId of requirement.quizIds) assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      for (const scenarioId of requirement.scenarioIds) assert.ok(scenarios.has(scenarioId), `${requirement.id}: missing scenario ${scenarioId}`);
      assert.ok(requirement.quizIds.length && requirement.scenarioIds.length, `${requirement.id}: evidence must cover quiz and scenario`);
    });
  }
});

test('data engineering for ML P1 competencies require applied P1 scenarios', () => {
  const priorityByScenarioId = new Map(
    getAssessmentScenarioExtensionEntries().map(({ priority, question }) => [question.id, priority]),
  );
  const evidenceIds = [];
  for (const requirement of DATA_ENGINEERING_FOR_ML_P1_REQUIREMENTS) {
    const scenarios = itemsById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    assert.ok(
      requirement.scenarioIds.some((scenarioId) => DEPTH_SCENARIO_LEVELS.has(scenarios.get(scenarioId)?.level)),
      `${requirement.id}: must protect applied reasoning evidence`,
    );
    for (const scenarioId of requirement.scenarioIds) {
      assert.equal(priorityByScenarioId.get(scenarioId), 'P1', `${scenarioId}: scenario evidence must remain P1`);
    }
    evidenceIds.push(...requirement.quizIds, ...requirement.scenarioIds);
  }
  assert.equal(new Set(evidenceIds).size, evidenceIds.length, 'evidence ids should protect one explicit competency each');
});
