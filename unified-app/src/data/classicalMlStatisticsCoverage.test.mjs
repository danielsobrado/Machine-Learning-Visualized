import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  CLASSICAL_ML_STATISTICS_COVERAGE,
  CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS,
} from './classicalMlStatisticsCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);
const MAX_DEPTH_ANSWER_SHARE = 0.5;
const MIN_DEPTH_SCENARIO_LENGTH = 100;
const MIN_DEPTH_EXPLANATION_LENGTH = 80;
const MIN_MISCONCEPTION_LENGTH = 40;

function ids(questions = []) {
  return new Set(questions.map((question) => question.id));
}

function scenariosById(questions = []) {
  return new Map(questions.map((question) => [question.id, question]));
}

function validateDepthScenario(requirementId, scenario) {
  assert.ok(
    DEPTH_LEVELS.has(scenario.level),
    `${requirementId}: ${scenario.id} must require application, calculation, decision, design, or diagnosis`,
  );
  assert.ok(
    scenario.scenario?.length >= MIN_DEPTH_SCENARIO_LENGTH,
    `${requirementId}: ${scenario.id} needs enough evidence/context to require reasoning`,
  );
  assert.ok(scenario.prompt?.length >= 20, `${requirementId}: ${scenario.id} prompt is too shallow`);
  assert.equal(scenario.choices?.length, 3, `${requirementId}: ${scenario.id} must have three choices`);
  assert.equal(
    new Set(scenario.choices.map(normalizeAssessmentText)).size,
    3,
    `${requirementId}: ${scenario.id} choices must remain distinct`,
  );
  assert.ok(
    scenario.relatedComparison?.length >= 5,
    `${requirementId}: ${scenario.id} must make the tested trade-off/comparison explicit`,
  );
  assert.ok(
    scenario.explanation?.length >= MIN_DEPTH_EXPLANATION_LENGTH,
    `${requirementId}: ${scenario.id} explanation must show the reasoning, not only state the answer`,
  );
  assert.ok(
    scenario.misconceptionTested?.length >= MIN_MISCONCEPTION_LENGTH,
    `${requirementId}: ${scenario.id} must state the misconception being tested`,
  );

  if (scenario.level === 'calculation') {
    assert.match(
      `${scenario.scenario} ${scenario.prompt}`,
      /\d/,
      `${requirementId}: ${scenario.id} calculation questions must include numeric evidence`,
    );
  }
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

test('every audited lesson has an explicit depth competency', () => {
  const coveredLessonIds = Object.keys(CLASSICAL_ML_STATISTICS_COVERAGE).sort();
  const depthLessonIds = [...new Set(
    CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId),
  )].sort();

  assert.deepEqual(
    depthLessonIds,
    coveredLessonIds,
    'topic coverage and depth coverage must stay aligned lesson-for-lesson',
  );
});

test('classical ML and statistics depth competencies remain explicit', async (t) => {
  for (const requirement of CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const liveScenarios = scenariosById(assessment.scenarioQuestions);

      for (const scenarioId of requirement.scenarioIds) {
        const scenario = liveScenarios.get(scenarioId);
        assert.ok(scenario, `${requirement.id}: missing scenario ${scenarioId}`);
        validateDepthScenario(requirement.id, scenario);
      }
    });
  }
});

test('depth competencies are linked to the lesson coverage contract without scenario reuse', () => {
  const competencyIds = [];
  const depthScenarioIds = [];

  for (const requirement of CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS) {
    competencyIds.push(requirement.id);
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

    const coveredScenarioIds = new Set(
      CLASSICAL_ML_STATISTICS_COVERAGE[requirement.lessonId].scenarioIds,
    );
    for (const scenarioId of requirement.scenarioIds) {
      assert.ok(
        coveredScenarioIds.has(scenarioId),
        `${requirement.id}: ${scenarioId} must also be protected by topic coverage`,
      );
      depthScenarioIds.push(scenarioId);
    }
  }

  assert.equal(new Set(competencyIds).size, competencyIds.length, 'depth competency ids must be unique');
  assert.equal(
    new Set(depthScenarioIds).size,
    depthScenarioIds.length,
    'a depth scenario should protect one explicit competency rather than being reused as a shortcut',
  );
});

test('depth scenarios do not expose a dominant correct-answer position', () => {
  const counts = [0, 0, 0];

  for (const requirement of CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS) {
    const liveScenarios = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) {
      const scenario = liveScenarios.get(scenarioId);
      assert.ok(scenario, `${requirement.id}: missing live scenario ${scenarioId}`);
      counts[scenario.answerIndex] += 1;
    }
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  assert.ok(total > 0, 'depth scenarios should exist');
  assert.ok(counts.every((count) => count > 0), `all answer positions should be used, got ${counts.join(', ')}`);
  assert.ok(
    Math.max(...counts) / total <= MAX_DEPTH_ANSWER_SHARE,
    `no depth answer position should exceed ${MAX_DEPTH_ANSWER_SHARE * 100}% of scenarios, got ${counts.join(', ')}`,
  );
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
