import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  BLOOM_FILTER_AUDITED_LESSON_IDS,
  BLOOM_FILTER_COVERAGE,
  BLOOM_FILTER_DEPTH_REQUIREMENTS,
} from './bloomFilterCoverage.js';
import {
  getLessonAssessment,
  PRIORITY_ASSESSMENT_LESSON_IDS,
} from './lessonAssessments.js';

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);
const MAX_DEPTH_ANSWER_SHARE = 0.5;
const MIN_DEPTH_SCENARIO_LENGTH = 100;
const MIN_DEPTH_EXPLANATION_LENGTH = 80;
const MIN_MISCONCEPTION_LENGTH = 40;
const MIN_DEPTH_COMPETENCIES = 4;

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

test('Bloom filter audit remains aligned with the priority assessment manifest', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);
  assert.deepEqual(BLOOM_FILTER_AUDITED_LESSON_IDS, ['bloom-filter']);
  assert.ok(priorityIds.has('bloom-filter'), 'bloom-filter must remain a priority assessment lesson');
});

test('Bloom filter keeps all protected applied scenarios', () => {
  const assessment = getLessonAssessment('bloom-filter');
  const liveIds = ids(assessment.scenarioQuestions);
  const required = BLOOM_FILTER_COVERAGE['bloom-filter'];

  assert.ok(required, 'Bloom filter coverage requirement must exist');
  for (const scenarioId of required.scenarioIds) {
    assert.ok(liveIds.has(scenarioId), `bloom-filter: missing scenario ${scenarioId}`);
  }
});

test('Bloom filter retains multiple independent depth competencies', () => {
  assert.ok(
    BLOOM_FILTER_DEPTH_REQUIREMENTS.length >= MIN_DEPTH_COMPETENCIES,
    `Bloom filter should protect at least ${MIN_DEPTH_COMPETENCIES} applied competencies`,
  );

  const competencyIds = BLOOM_FILTER_DEPTH_REQUIREMENTS.map(({ id }) => id);
  const scenarioIds = BLOOM_FILTER_DEPTH_REQUIREMENTS.flatMap(({ scenarioIds: values }) => values);
  assert.equal(new Set(competencyIds).size, competencyIds.length, 'Bloom filter competency ids must be unique');
  assert.equal(new Set(scenarioIds).size, scenarioIds.length, 'Bloom filter scenarios must not be reused as competency shortcuts');
});

test('Bloom filter depth competencies remain evidence-based', async (t) => {
  const liveScenarios = scenariosById(getLessonAssessment('bloom-filter').scenarioQuestions);
  const coverageIds = new Set(BLOOM_FILTER_COVERAGE['bloom-filter'].scenarioIds);

  for (const requirement of BLOOM_FILTER_DEPTH_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      assert.equal(requirement.lessonId, 'bloom-filter');
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(coverageIds.has(scenarioId), `${requirement.id}: ${scenarioId} must also be topic-protected`);
        const scenario = liveScenarios.get(scenarioId);
        assert.ok(scenario, `${requirement.id}: missing scenario ${scenarioId}`);
        validateDepthScenario(requirement.id, scenario);
      }
    });
  }
});

test('Bloom filter depth covers both quantitative tuning and structural design', () => {
  const liveScenarios = scenariosById(getLessonAssessment('bloom-filter').scenarioQuestions);
  const levels = new Set();

  for (const requirement of BLOOM_FILTER_DEPTH_REQUIREMENTS) {
    for (const scenarioId of requirement.scenarioIds) {
      levels.add(liveScenarios.get(scenarioId)?.level);
    }
  }

  assert.ok(levels.has('calculation'), 'Bloom filter depth should include quantitative tuning calculations');
  assert.ok(levels.has('design'), 'Bloom filter depth should include deletion/system-design reasoning');
});

test('Bloom filter protected scenarios use all answer positions without a dominant slot', () => {
  const liveScenarios = scenariosById(getLessonAssessment('bloom-filter').scenarioQuestions);
  const counts = [0, 0, 0];

  for (const requirement of BLOOM_FILTER_DEPTH_REQUIREMENTS) {
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
