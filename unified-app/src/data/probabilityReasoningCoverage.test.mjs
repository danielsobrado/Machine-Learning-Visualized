import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  PROBABILITY_REASONING_AUDITED_LESSON_IDS,
  PROBABILITY_REASONING_COVERAGE,
  PROBABILITY_REASONING_DEPTH_REQUIREMENTS,
} from './probabilityReasoningCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);
const MAX_DEPTH_ANSWER_SHARE = 0.5;
const MIN_DEPTH_SCENARIO_LENGTH = 100;
const MIN_DEPTH_EXPLANATION_LENGTH = 80;
const MIN_MISCONCEPTION_LENGTH = 40;
const REQUIRED_COMPETENCIES_PER_LESSON = 2;

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
  assert.ok(scenario.relatedComparison?.length >= 5, `${requirementId}: ${scenario.id} must make the comparison explicit`);
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

test('probability reasoning coverage stays aligned with the audited lesson list', () => {
  assert.deepEqual(
    Object.keys(PROBABILITY_REASONING_COVERAGE).sort(),
    [...PROBABILITY_REASONING_AUDITED_LESSON_IDS].sort(),
  );
  assert.equal(
    new Set(PROBABILITY_REASONING_AUDITED_LESSON_IDS).size,
    PROBABILITY_REASONING_AUDITED_LESSON_IDS.length,
    'audited probability lesson ids must be unique',
  );
});

test('every audited probability lesson keeps its protected scenarios live', async (t) => {
  for (const [lessonId, requirement] of Object.entries(PROBABILITY_REASONING_COVERAGE)) {
    await t.test(lessonId, () => {
      const scenarioIds = ids(getLessonAssessment(lessonId).scenarioQuestions);
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarioIds.has(scenarioId), `${lessonId}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('each probability lesson retains two independent depth competencies', () => {
  const counts = new Map(PROBABILITY_REASONING_AUDITED_LESSON_IDS.map((lessonId) => [lessonId, 0]));
  for (const requirement of PROBABILITY_REASONING_DEPTH_REQUIREMENTS) {
    assert.ok(counts.has(requirement.lessonId), `${requirement.id}: unexpected lesson ${requirement.lessonId}`);
    counts.set(requirement.lessonId, counts.get(requirement.lessonId) + 1);
  }

  for (const [lessonId, count] of counts.entries()) {
    assert.equal(
      count,
      REQUIRED_COMPETENCIES_PER_LESSON,
      `${lessonId}: expected ${REQUIRED_COMPETENCIES_PER_LESSON} protected competencies, got ${count}`,
    );
  }
});

test('probability reasoning depth scenarios remain evidence-based', async (t) => {
  for (const requirement of PROBABILITY_REASONING_DEPTH_REQUIREMENTS) {
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

test('probability competencies use unique scenarios and stay topic-protected', () => {
  const competencyIds = [];
  const scenarioIds = [];

  for (const requirement of PROBABILITY_REASONING_DEPTH_REQUIREMENTS) {
    competencyIds.push(requirement.id);
    const coverageIds = new Set(PROBABILITY_REASONING_COVERAGE[requirement.lessonId].scenarioIds);
    for (const scenarioId of requirement.scenarioIds) {
      assert.ok(coverageIds.has(scenarioId), `${requirement.id}: ${scenarioId} must also be protected by topic coverage`);
      scenarioIds.push(scenarioId);
    }
  }

  assert.equal(new Set(competencyIds).size, competencyIds.length, 'probability competency ids must be unique');
  assert.equal(new Set(scenarioIds).size, scenarioIds.length, 'depth scenarios must not be reused as competency shortcuts');
});

test('probability reasoning covers expectation, dispersion, conditioning, and independence', () => {
  const ids = new Set(PROBABILITY_REASONING_DEPTH_REQUIREMENTS.map(({ id }) => id));
  assert.ok(ids.has('expected-value-from-discrete-outcomes'));
  assert.ok(ids.has('variance-and-operational-risk'));
  assert.ok(ids.has('conditional-probability-from-counts'));
  assert.ok(ids.has('independence-from-joint-factorization'));
});

test('probability depth scenarios use all answer positions without a dominant slot', () => {
  const counts = [0, 0, 0];
  for (const requirement of PROBABILITY_REASONING_DEPTH_REQUIREMENTS) {
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
