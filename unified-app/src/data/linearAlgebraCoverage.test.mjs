import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  LINEAR_ALGEBRA_AUDITED_LESSON_IDS,
  LINEAR_ALGEBRA_COVERAGE,
  LINEAR_ALGEBRA_DEPTH_REQUIREMENTS,
} from './linearAlgebraCoverage.js';
import {
  getLessonAssessment,
  PRIORITY_ASSESSMENT_LESSON_IDS,
} from './lessonAssessments.js';

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
  assert.ok(DEPTH_LEVELS.has(scenario.level), `${requirementId}: ${scenario.id} must require applied reasoning`);
  assert.ok(scenario.scenario?.length >= MIN_DEPTH_SCENARIO_LENGTH, `${requirementId}: ${scenario.id} needs enough evidence/context`);
  assert.ok(scenario.prompt?.length >= 20, `${requirementId}: ${scenario.id} prompt is too shallow`);
  assert.equal(scenario.choices?.length, 3, `${requirementId}: ${scenario.id} must have three choices`);
  assert.equal(
    new Set(scenario.choices.map(normalizeAssessmentText)).size,
    3,
    `${requirementId}: ${scenario.id} choices must remain distinct`,
  );
  assert.ok(scenario.relatedComparison?.length >= 5, `${requirementId}: ${scenario.id} must make the trade-off explicit`);
  assert.ok(
    scenario.explanation?.length >= MIN_DEPTH_EXPLANATION_LENGTH,
    `${requirementId}: ${scenario.id} explanation must show the reasoning`,
  );
  assert.ok(
    scenario.misconceptionTested?.length >= MIN_MISCONCEPTION_LENGTH,
    `${requirementId}: ${scenario.id} must state the misconception being tested`,
  );

  if (scenario.level === 'calculation') {
    assert.match(`${scenario.scenario} ${scenario.prompt}`, /\d/, `${requirementId}: calculation requires numeric evidence`);
  }
}

test('linear algebra audit remains aligned with priority assessment lessons', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);
  for (const lessonId of LINEAR_ALGEBRA_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: audited linear algebra lesson must remain a priority assessment`);
  }
  assert.equal(new Set(LINEAR_ALGEBRA_AUDITED_LESSON_IDS).size, LINEAR_ALGEBRA_AUDITED_LESSON_IDS.length);
});

test('every audited linear algebra lesson remains covered', async (t) => {
  assert.deepEqual(
    Object.keys(LINEAR_ALGEBRA_COVERAGE).sort(),
    [...LINEAR_ALGEBRA_AUDITED_LESSON_IDS].sort(),
    'linear algebra topic coverage must stay aligned with the audited lesson list',
  );

  for (const [lessonId, requirement] of Object.entries(LINEAR_ALGEBRA_COVERAGE)) {
    await t.test(lessonId, () => {
      const scenarioIds = ids(getLessonAssessment(lessonId).scenarioQuestions);
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarioIds.has(scenarioId), `${lessonId}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('every audited linear algebra lesson has one explicit protected depth competency', () => {
  const depthLessonIds = LINEAR_ALGEBRA_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId).sort();
  assert.deepEqual(depthLessonIds, [...LINEAR_ALGEBRA_AUDITED_LESSON_IDS].sort());
});

test('linear algebra depth competencies remain evidence-based', async (t) => {
  for (const requirement of LINEAR_ALGEBRA_DEPTH_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const liveScenarios = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
      for (const scenarioId of requirement.scenarioIds) {
        const scenario = liveScenarios.get(scenarioId);
        assert.ok(scenario, `${requirement.id}: missing scenario ${scenarioId}`);
        validateDepthScenario(requirement.id, scenario);
      }
    });
  }
});

test('linear algebra competencies are uniquely linked and protected by topic coverage', () => {
  const competencyIds = [];
  const scenarioIds = [];

  for (const requirement of LINEAR_ALGEBRA_DEPTH_REQUIREMENTS) {
    competencyIds.push(requirement.id);
    const coverageIds = new Set(LINEAR_ALGEBRA_COVERAGE[requirement.lessonId].scenarioIds);
    for (const scenarioId of requirement.scenarioIds) {
      assert.ok(coverageIds.has(scenarioId), `${requirement.id}: ${scenarioId} must also be topic-protected`);
      scenarioIds.push(scenarioId);
    }
  }

  assert.equal(new Set(competencyIds).size, competencyIds.length, 'linear algebra competency ids must be unique');
  assert.equal(new Set(scenarioIds).size, scenarioIds.length, 'depth scenarios must not be reused as competency shortcuts');
});

test('linear algebra depth scenarios use all answer positions without a dominant slot', () => {
  const counts = [0, 0, 0];
  for (const requirement of LINEAR_ALGEBRA_DEPTH_REQUIREMENTS) {
    const liveScenarios = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) {
      const scenario = liveScenarios.get(scenarioId);
      assert.ok(scenario, `${requirement.id}: missing live scenario ${scenarioId}`);
      counts[scenario.answerIndex] += 1;
    }
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  assert.ok(counts.every((count) => count > 0), `all answer positions should be used, got ${counts.join(', ')}`);
  assert.ok(
    Math.max(...counts) / total <= MAX_DEPTH_ANSWER_SHARE,
    `no answer position should exceed ${MAX_DEPTH_ANSWER_SHARE * 100}% of scenarios, got ${counts.join(', ')}`,
  );
});
