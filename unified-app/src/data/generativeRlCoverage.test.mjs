import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  GENERATIVE_RL_AUDITED_LESSON_IDS,
  GENERATIVE_RL_COVERAGE,
  GENERATIVE_RL_DEPTH_REQUIREMENTS,
} from './generativeRlCoverage.js';
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

test('generative AI and RL audit remains aligned with priority assessment lessons', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);

  for (const lessonId of GENERATIVE_RL_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: audited generative/RL lesson must remain a priority assessment`);
  }

  assert.equal(
    new Set(GENERATIVE_RL_AUDITED_LESSON_IDS).size,
    GENERATIVE_RL_AUDITED_LESSON_IDS.length,
    'audited generative/RL lesson ids must be unique',
  );
});

test('every audited generative AI and RL lesson remains covered', async (t) => {
  const expectedLessonIds = [...GENERATIVE_RL_AUDITED_LESSON_IDS].sort();
  assert.deepEqual(
    Object.keys(GENERATIVE_RL_COVERAGE).sort(),
    expectedLessonIds,
    'generative/RL topic coverage must stay aligned with the explicit audited lesson list',
  );

  for (const [lessonId, requirement] of Object.entries(GENERATIVE_RL_COVERAGE)) {
    await t.test(lessonId, () => {
      const assessment = getLessonAssessment(lessonId);
      const scenarioIds = ids(assessment.scenarioQuestions);

      assert.ok(
        (assessment.quiz?.length || 0) + (assessment.scenarioQuestions?.length || 0) > 0,
        `${lessonId}: assessment must exist`,
      );

      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarioIds.has(scenarioId), `${lessonId}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('every audited generative AI and RL lesson has an explicit depth competency', () => {
  const coveredLessonIds = Object.keys(GENERATIVE_RL_COVERAGE).sort();
  const depthLessonIds = [...new Set(
    GENERATIVE_RL_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId),
  )].sort();

  assert.deepEqual(
    depthLessonIds,
    coveredLessonIds,
    'generative/RL topic coverage and depth coverage must stay aligned lesson-for-lesson',
  );
});

test('generative AI and RL depth competencies remain evidence-based', async (t) => {
  for (const requirement of GENERATIVE_RL_DEPTH_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const liveScenarios = scenariosById(
        getLessonAssessment(requirement.lessonId).scenarioQuestions,
      );

      for (const scenarioId of requirement.scenarioIds) {
        const scenario = liveScenarios.get(scenarioId);
        assert.ok(scenario, `${requirement.id}: missing scenario ${scenarioId}`);
        validateDepthScenario(requirement.id, scenario);
      }
    });
  }
});

test('generative AI and RL depth competencies are linked without scenario reuse', () => {
  const competencyIds = [];
  const depthScenarioIds = [];

  for (const requirement of GENERATIVE_RL_DEPTH_REQUIREMENTS) {
    competencyIds.push(requirement.id);
    assert.ok(
      GENERATIVE_RL_COVERAGE[requirement.lessonId],
      `${requirement.id}: lesson ${requirement.lessonId} must exist in generative/RL topic coverage`,
    );
    assert.ok(requirement.scenarioIds.length > 0, `${requirement.id}: scenario ids are required`);
    assert.equal(
      new Set(requirement.scenarioIds).size,
      requirement.scenarioIds.length,
      `${requirement.id}: duplicate scenario id`,
    );

    const coveredScenarioIds = new Set(
      GENERATIVE_RL_COVERAGE[requirement.lessonId].scenarioIds,
    );
    for (const scenarioId of requirement.scenarioIds) {
      assert.ok(
        coveredScenarioIds.has(scenarioId),
        `${requirement.id}: ${scenarioId} must also be protected by generative/RL topic coverage`,
      );
      depthScenarioIds.push(scenarioId);
    }
  }

  assert.equal(
    new Set(competencyIds).size,
    competencyIds.length,
    'generative/RL depth competency ids must be unique',
  );
  assert.equal(
    new Set(depthScenarioIds).size,
    depthScenarioIds.length,
    'a generative/RL depth scenario should protect one explicit competency rather than be reused as a shortcut',
  );
});

test('generative AI and RL depth scenarios do not expose a dominant correct-answer position', () => {
  const counts = [0, 0, 0];

  for (const requirement of GENERATIVE_RL_DEPTH_REQUIREMENTS) {
    const liveScenarios = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) {
      const scenario = liveScenarios.get(scenarioId);
      assert.ok(scenario, `${requirement.id}: missing live scenario ${scenarioId}`);
      counts[scenario.answerIndex] += 1;
    }
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  assert.ok(total > 0, 'generative/RL depth scenarios should exist');
  assert.ok(counts.every((count) => count > 0), `all answer positions should be used, got ${counts.join(', ')}`);
  assert.ok(
    Math.max(...counts) / total <= MAX_DEPTH_ANSWER_SHARE,
    `no generative/RL depth answer position should exceed ${MAX_DEPTH_ANSWER_SHARE * 100}% of scenarios, got ${counts.join(', ')}`,
  );
});

test('generative AI and RL coverage contract does not duplicate required ids within a lesson', () => {
  for (const [lessonId, requirement] of Object.entries(GENERATIVE_RL_COVERAGE)) {
    assert.equal(
      new Set(requirement.scenarioIds).size,
      requirement.scenarioIds.length,
      `${lessonId}: duplicate required scenario id`,
    );
  }
});
