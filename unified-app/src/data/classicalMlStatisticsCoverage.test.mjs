import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CLASSICAL_ML_STATISTICS_COVERAGE,
  CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS,
} from './classicalMlStatisticsCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);

function ids(questions = []) {
  return new Set(questions.map((question) => question.id));
}

function scenariosById(questions = []) {
  return new Map(questions.map((question) => [question.id, question]));
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

test('classical ML and statistics depth competencies remain explicit', async (t) => {
  for (const requirement of CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const liveScenarios = scenariosById(assessment.scenarioQuestions);

      for (const scenarioId of requirement.scenarioIds) {
        const scenario = liveScenarios.get(scenarioId);
        assert.ok(scenario, `${requirement.id}: missing scenario ${scenarioId}`);
        assert.ok(
          DEPTH_LEVELS.has(scenario.level),
          `${requirement.id}: ${scenarioId} must require application, calculation, decision, design, or diagnosis`,
        );
        assert.ok(
          scenario.misconceptionTested?.length >= 20,
          `${requirement.id}: ${scenarioId} must state the misconception being tested`,
        );
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

test('depth competency ids are unique and reference covered lessons', () => {
  const competencyIds = CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS.map(({ id }) => id);
  assert.equal(
    new Set(competencyIds).size,
    competencyIds.length,
    'depth competency ids must be unique',
  );

  for (const requirement of CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS) {
    assert.ok(
      CLASSICAL_ML_STATISTICS_COVERAGE[requirement.lessonId],
      `${requirement.id}: lesson ${requirement.lessonId} must exist in the topic coverage contract`,
    );
    assert.ok(requirement.scenarioIds.length > 0, `${requirement.id}: scenario ids are required`);
    assert.equal(
      new Set(requirement.scenarioIds).size,
      requirement.scenarioIds.length,
      `${requirement.id}: duplicate scenario id`,
    );
  }
});
