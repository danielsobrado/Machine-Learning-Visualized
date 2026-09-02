import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  INFORMATION_THEORY_AUDITED_LESSON_IDS,
  INFORMATION_THEORY_COVERAGE,
  INFORMATION_THEORY_DEPTH_REQUIREMENTS,
} from './informationTheoryCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);
const MAX_DEPTH_ANSWER_SHARE = 1 / 3;
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

test('information theory audit lessons remain registered assessments', () => {
  assert.equal(new Set(INFORMATION_THEORY_AUDITED_LESSON_IDS).size, INFORMATION_THEORY_AUDITED_LESSON_IDS.length);
  for (const lessonId of INFORMATION_THEORY_AUDITED_LESSON_IDS) {
    const assessment = getLessonAssessment(lessonId);
    assert.ok(assessment.quiz?.length > 0, `${lessonId}: information theory lesson must remain registered with a quiz`);
  }
});

test('every audited information theory lesson remains covered', async (t) => {
  assert.deepEqual(
    Object.keys(INFORMATION_THEORY_COVERAGE),
    [...INFORMATION_THEORY_AUDITED_LESSON_IDS],
    'information theory coverage should preserve the conceptual softmax -> entropy -> cross-entropy chain',
  );

  for (const [lessonId, requirement] of Object.entries(INFORMATION_THEORY_COVERAGE)) {
    await t.test(lessonId, () => {
      const scenarioIds = ids(getLessonAssessment(lessonId).scenarioQuestions);
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarioIds.has(scenarioId), `${lessonId}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('each information theory lesson has one explicit protected depth competency', () => {
  const depthLessonIds = INFORMATION_THEORY_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId);
  assert.deepEqual(depthLessonIds, [...INFORMATION_THEORY_AUDITED_LESSON_IDS]);
});

test('information theory depth competencies remain evidence-based', async (t) => {
  for (const requirement of INFORMATION_THEORY_DEPTH_REQUIREMENTS) {
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

test('information theory competencies are uniquely linked and topic-protected', () => {
  const competencyIds = [];
  const scenarioIds = [];

  for (const requirement of INFORMATION_THEORY_DEPTH_REQUIREMENTS) {
    competencyIds.push(requirement.id);
    const coverageIds = new Set(INFORMATION_THEORY_COVERAGE[requirement.lessonId].scenarioIds);
    for (const scenarioId of requirement.scenarioIds) {
      assert.ok(coverageIds.has(scenarioId), `${requirement.id}: ${scenarioId} must also be topic-protected`);
      scenarioIds.push(scenarioId);
    }
  }

  assert.equal(new Set(competencyIds).size, competencyIds.length, 'information theory competency ids must be unique');
  assert.equal(new Set(scenarioIds).size, scenarioIds.length, 'information theory depth scenarios must not be reused');
});

test('information theory depth scenarios use every answer position exactly once', () => {
  const counts = [0, 0, 0];
  for (const requirement of INFORMATION_THEORY_DEPTH_REQUIREMENTS) {
    const liveScenarios = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) {
      const scenario = liveScenarios.get(scenarioId);
      assert.ok(scenario, `${requirement.id}: missing live scenario ${scenarioId}`);
      counts[scenario.answerIndex] += 1;
    }
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  assert.deepEqual(counts, [1, 1, 1], `expected one protected answer in each position, got ${counts.join(', ')}`);
  assert.ok(Math.max(...counts) / total <= MAX_DEPTH_ANSWER_SHARE);
});
