import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentScenarioExtensionEntries } from './assessmentScenarioExtensions.js';
import { getLessonAssessment, PRIORITY_ASSESSMENT_LESSON_IDS } from './lessonAssessments.js';
import {
  RAG_CORE_P1_AUDITED_LESSON_IDS,
  RAG_CORE_P1_REQUIREMENTS,
} from './ragCoreP1Coverage.js';

const DEPTH_SCENARIO_LEVELS = new Set([
  'application', 'calculation', 'comparison', 'decision', 'design', 'diagnosis', 'mechanism', 'visual-state',
]);

const REQUIRED_COMPETENCY_IDS = Object.freeze([
  'rag-chunking-boundary-structure',
  'rag-overlap-context-cost',
  'rag-ann-recall-latency-operating-point',
  'rag-reranker-candidate-recall-budget',
  'rag-claim-grounding-temporal-conflict',
  'rag-grounded-abstention-no-support',
  'rag-first-broken-stage-attribution',
  'rag-retrieval-metric-semantics',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('RAG core lessons remain priority curated P1 assessments', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);
  for (const lessonId of RAG_CORE_P1_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: lesson must remain a priority assessment`);
    assert.equal(getLessonAssessment(lessonId).source, 'curated', `${lessonId}: assessment must remain curated`);
  }
});

test('RAG core P1 contract keeps required competencies explicit', () => {
  assert.deepEqual(
    RAG_CORE_P1_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_COMPETENCY_IDS].sort(),
  );
});

test('RAG core P1 competencies resolve to live applied P1 evidence', async (t) => {
  const priorityByScenarioId = new Map(
    getAssessmentScenarioExtensionEntries().map(({ priority, question }) => [question.id, priority]),
  );
  const evidenceIds = [];

  for (const requirement of RAG_CORE_P1_REQUIREMENTS) {
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
