import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS,
  NUMERICAL_LINEAR_ALGEBRA_COVERAGE,
  NUMERICAL_LINEAR_ALGEBRA_DEPTH_REQUIREMENTS,
} from './numericalLinearAlgebraCoverage.js';
import {
  getLessonAssessment,
  lessonAssessments,
} from './lessonAssessments.js';

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);
const MAX_DEPTH_ANSWER_SHARE = 0.5;
const MIN_DEPTH_SCENARIO_LENGTH = 100;
const MIN_DEPTH_EXPLANATION_LENGTH = 80;
const MIN_MISCONCEPTION_LENGTH = 40;
const MIN_CALCULATION_COMPETENCIES = 6;

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

test('numerical linear algebra audit remains aligned with registered assessments', () => {
  assert.equal(
    new Set(NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS).size,
    NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS.length,
    'audited lesson ids must be unique',
  );

  for (const lessonId of NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS) {
    assert.ok(lessonAssessments[lessonId], `${lessonId}: audited lesson must remain registered in lessonAssessments`);
  }
});

test('every audited numerical linear algebra lesson remains covered', async (t) => {
  assert.deepEqual(
    Object.keys(NUMERICAL_LINEAR_ALGEBRA_COVERAGE).sort(),
    [...NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS].sort(),
    'numerical linear algebra topic coverage must stay aligned with the audited lesson list',
  );

  for (const [lessonId, requirement] of Object.entries(NUMERICAL_LINEAR_ALGEBRA_COVERAGE)) {
    await t.test(lessonId, () => {
      const scenarioIds = ids(getLessonAssessment(lessonId).scenarioQuestions);
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarioIds.has(scenarioId), `${lessonId}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('every audited numerical linear algebra lesson has one explicit protected depth competency', () => {
  const depthLessonIds = NUMERICAL_LINEAR_ALGEBRA_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId).sort();
  assert.deepEqual(depthLessonIds, [...NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS].sort());
});

test('numerical linear algebra depth competencies remain evidence-based', async (t) => {
  for (const requirement of NUMERICAL_LINEAR_ALGEBRA_DEPTH_REQUIREMENTS) {
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

test('numerical linear algebra competencies are uniquely linked and topic-protected', () => {
  const competencyIds = [];
  const scenarioIds = [];

  for (const requirement of NUMERICAL_LINEAR_ALGEBRA_DEPTH_REQUIREMENTS) {
    competencyIds.push(requirement.id);
    const coverageIds = new Set(NUMERICAL_LINEAR_ALGEBRA_COVERAGE[requirement.lessonId].scenarioIds);
    for (const scenarioId of requirement.scenarioIds) {
      assert.ok(coverageIds.has(scenarioId), `${requirement.id}: ${scenarioId} must also be topic-protected`);
      scenarioIds.push(scenarioId);
    }
  }

  assert.equal(new Set(competencyIds).size, competencyIds.length, 'competency ids must be unique');
  assert.equal(new Set(scenarioIds).size, scenarioIds.length, 'depth scenarios must not be reused as competency shortcuts');
});

test('numerical linear algebra depth includes worked computation and diagnosis', () => {
  const scenarios = NUMERICAL_LINEAR_ALGEBRA_DEPTH_REQUIREMENTS.flatMap((requirement) => {
    const liveScenarios = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    return requirement.scenarioIds.map((scenarioId) => liveScenarios.get(scenarioId));
  });

  assert.ok(
    scenarios.filter((scenario) => scenario?.level === 'calculation').length >= MIN_CALCULATION_COMPETENCIES,
    `expected at least ${MIN_CALCULATION_COMPETENCIES} calculation competencies`,
  );
  assert.ok(scenarios.some((scenario) => scenario?.level === 'diagnosis'), 'expected at least one diagnosis competency');
});

test('numerical linear algebra depth scenarios use all answer positions without a dominant slot', () => {
  const counts = [0, 0, 0];
  for (const requirement of NUMERICAL_LINEAR_ALGEBRA_DEPTH_REQUIREMENTS) {
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
