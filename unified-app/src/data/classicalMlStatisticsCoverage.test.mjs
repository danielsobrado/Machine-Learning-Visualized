import assert from 'node:assert/strict';
import test from 'node:test';

import { CLASSICAL_ML_STATISTICS_COVERAGE } from './classicalMlStatisticsCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

function ids(questions = []) {
  return new Set(questions.map((question) => question.id));
}

test('classical ML and statistics assessment gaps remain covered', async (t) => {
  for (const [lessonId, requirement] of Object.entries(CLASSICAL_ML_STATISTICS_COVERAGE)) {
    await t.test(lessonId, () => {
      const assessment = getLessonAssessment(lessonId);
      const scenarioIds = ids(assessment.scenarioQuestions);
      const quizIds = ids(assessment.quiz);

      assert.ok(
        (assessment.quiz?.length || 0) + (assessment.scenarioQuestions?.length || 0) > 0,
        `${lessonId}: assessment must exist`,
      );

      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarioIds.has(scenarioId), `${lessonId}: missing scenario ${scenarioId}`);
      }

      for (const quizId of requirement.quizIds) {
        assert.ok(quizIds.has(quizId), `${lessonId}: missing quiz question ${quizId}`);
      }
    });
  }
});

test('coverage contract does not duplicate required ids within a lesson', () => {
  for (const [lessonId, requirement] of Object.entries(CLASSICAL_ML_STATISTICS_COVERAGE)) {
    assert.equal(
      new Set(requirement.scenarioIds).size,
      requirement.scenarioIds.length,
      `${lessonId}: duplicate required scenario id`,
    );
    assert.equal(
      new Set(requirement.quizIds).size,
      requirement.quizIds.length,
      `${lessonId}: duplicate required quiz id`,
    );
  }
});
