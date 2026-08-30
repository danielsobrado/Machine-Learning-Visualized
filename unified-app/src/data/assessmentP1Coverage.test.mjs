import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import { P1_ASSESSMENT_COVERAGE } from './assessmentP1Coverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

function validateScenario(question) {
  assert.ok(question.id && /\S/.test(question.id), 'scenario id is required');
  assert.ok(question.scenario && /\S/.test(question.scenario), `${question.id}: scenario text is required`);
  assert.ok(question.prompt && /\S/.test(question.prompt), `${question.id}: prompt is required`);
  assert.equal(question.choices?.length, 3, `${question.id}: exactly three choices are required`);
  assert.equal(
    new Set(question.choices.map(normalizeAssessmentText)).size,
    3,
    `${question.id}: choices must be distinct after normalization`,
  );
  assert.ok(Number.isInteger(question.answerIndex), `${question.id}: answerIndex must be an integer`);
  assert.ok(question.answerIndex >= 0 && question.answerIndex < 3, `${question.id}: answerIndex is out of range`);
  assert.ok(question.explanation?.length >= 30, `${question.id}: explanation is too short`);

  if (question.kind === 'visual-state') {
    assert.ok(question.visualState && Object.keys(question.visualState).length > 0, `${question.id}: visual state is required`);
  }
}

test('P1 assessment scenarios cover the first improvement batch', async (t) => {
  for (const [lessonId, requirement] of Object.entries(P1_ASSESSMENT_COVERAGE)) {
    await t.test(lessonId, () => {
      const assessment = getLessonAssessment(lessonId);
      const scenarios = assessment.scenarioQuestions || [];
      const scenarioMap = new Map(scenarios.map((question) => [question.id, question]));
      const quizIds = new Set((assessment.quiz || []).map((question) => question.id));

      assert.equal(scenarioMap.size, scenarios.length, `${lessonId}: scenario ids must be unique`);

      for (const scenarioId of requirement.scenarioIds) {
        const question = scenarioMap.get(scenarioId);
        assert.ok(question, `${lessonId}: missing P1 scenario ${scenarioId}`);
        validateScenario(question);
        assert.ok(!quizIds.has(scenarioId), `${lessonId}: scenario id ${scenarioId} collides with quiz id`);
      }

      if (requirement.minVisualStateQuestions) {
        const visualCount = requirement.scenarioIds
          .map((scenarioId) => scenarioMap.get(scenarioId))
          .filter((question) => question?.kind === 'visual-state')
          .length;
        assert.ok(
          visualCount >= requirement.minVisualStateQuestions,
          `${lessonId}: requires at least ${requirement.minVisualStateQuestions} P1 visual-state question(s)`,
        );
      }

      if (requirement.minComparisonQuestions) {
        const comparisonCount = requirement.scenarioIds
          .map((scenarioId) => scenarioMap.get(scenarioId))
          .filter((question) => Boolean(question?.relatedComparison))
          .length;
        assert.ok(
          comparisonCount >= requirement.minComparisonQuestions,
          `${lessonId}: requires at least ${requirement.minComparisonQuestions} P1 comparison question(s)`,
        );
      }
    });
  }
});
