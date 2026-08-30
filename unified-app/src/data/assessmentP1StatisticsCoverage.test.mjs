import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import { P1_STATISTICS_COVERAGE } from './assessmentP1StatisticsCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

function validateScenario(question) {
  assert.ok(question?.scenario && question?.prompt, `${question?.id || 'scenario'}: scenario and prompt are required`);
  assert.equal(question.choices?.length, 3, `${question.id}: exactly three choices are required`);
  assert.equal(new Set(question.choices.map(normalizeAssessmentText)).size, 3, `${question.id}: choices must be distinct`);
  assert.ok(Number.isInteger(question.answerIndex), `${question.id}: answerIndex must be an integer`);
  assert.ok(question.answerIndex >= 0 && question.answerIndex < 3, `${question.id}: invalid answerIndex`);
  assert.ok(question.explanation?.length >= 30, `${question.id}: explanation is too short`);
}

test('confirmed P1 statistics and causal gaps stay covered', async (t) => {
  for (const [lessonId, requiredIds] of Object.entries(P1_STATISTICS_COVERAGE)) {
    await t.test(lessonId, () => {
      const assessment = getLessonAssessment(lessonId);
      const scenarioMap = new Map((assessment.scenarioQuestions || []).map((question) => [question.id, question]));
      const quizIds = new Set((assessment.quiz || []).map((question) => question.id));

      for (const scenarioId of requiredIds) {
        const question = scenarioMap.get(scenarioId);
        assert.ok(question, `${lessonId}: missing scenario ${scenarioId}`);
        validateScenario(question);
        assert.ok(!quizIds.has(scenarioId), `${lessonId}: scenario id ${scenarioId} collides with quiz id`);
      }
    });
  }
});
