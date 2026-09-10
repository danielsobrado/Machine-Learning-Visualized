import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentScenarioExtensionEntries } from './assessmentScenarioExtensions.js';
import { getLessonAssessment, PRIORITY_ASSESSMENT_LESSON_IDS } from './lessonAssessments.js';
import { LSTM_P1_REQUIREMENTS } from './lstmP1Coverage.js';

const REQUIRED_COMPETENCY_IDS = Object.freeze([
  'lstm-gated-cell-hidden-update',
  'lstm-sequence-boundary-padding-truncation',
  'lstm-long-dependency-gradient-path',
  'lstm-architecture-efficiency-tradeoff',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('LSTM remains a priority curated P1 assessment', () => {
  assert.ok(new Set(PRIORITY_ASSESSMENT_LESSON_IDS).has('lstm'));
  assert.equal(getLessonAssessment('lstm').source, 'curated');
});

test('LSTM P1 contract keeps required competencies explicit', () => {
  assert.deepEqual(
    LSTM_P1_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_COMPETENCY_IDS].sort(),
  );
});

test('LSTM P1 competencies resolve to live applied P1 evidence', async (t) => {
  const assessment = getLessonAssessment('lstm');
  const quiz = itemsById(assessment.quiz);
  const scenarios = itemsById(assessment.scenarioQuestions);
  const priorityByScenarioId = new Map(
    getAssessmentScenarioExtensionEntries().map(({ priority, question }) => [question.id, priority]),
  );
  const evidenceIds = [];

  for (const requirement of LSTM_P1_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      for (const quizId of requirement.quizIds) {
        assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      }
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarios.has(scenarioId), `${requirement.id}: missing scenario ${scenarioId}`);
        assert.equal(priorityByScenarioId.get(scenarioId), 'P1', `${scenarioId}: scenario evidence must remain P1`);
      }
    });
    evidenceIds.push(...requirement.quizIds, ...requirement.scenarioIds);
  }

  assert.equal(new Set(evidenceIds).size, evidenceIds.length, 'evidence ids should protect one explicit competency each');
});
