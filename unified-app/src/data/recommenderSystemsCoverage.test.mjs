import assert from 'node:assert/strict';
import test from 'node:test';

import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import { getLessonAssessment, PRIORITY_ASSESSMENT_LESSON_IDS } from './lessonAssessments.js';
import { P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON } from './p1ClassicalMlAppliedDecisionScenarioQuestions.js';
import {
  RECOMMENDER_SYSTEMS_AUDITED_LESSON_IDS,
  RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS,
  RECOMMENDER_SYSTEMS_NEW_APPLIED_SCENARIO_IDS,
} from './recommenderSystemsCoverage.js';

const LESSON_ID = 'recommender-systems-ranking-track';
const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scenariosById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('recommender systems depth contract remains aligned with the priority assessment lesson', () => {
  assert.deepEqual(RECOMMENDER_SYSTEMS_AUDITED_LESSON_IDS, [LESSON_ID]);
  assert.equal(PRIORITY_ASSESSMENT_LESSON_IDS.includes(LESSON_ID), true);
  assert.equal(new Set(RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS.map(({ id }) => id)).size, 5);
  assert.equal(new Set(RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS.map(({ competency }) => competency)).size, 5);
  assert.equal(new Set(RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS.map(({ scenarioId }) => scenarioId)).size, 5);
  assert.equal(RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS.every(({ lessonId }) => lessonId === LESSON_ID), true);
});

test('new recommender applied scenarios remain owned by the registered classical ML applied source', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(
    ({ id }) => id === 'p1-classical-ml-applied-decisions',
  );
  assert.ok(source, 'missing p1-classical-ml-applied-decisions scenario source');
  assert.equal(source.questionsByLesson, P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON);

  const sourceScenarios = scenariosById(
    P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON[LESSON_ID],
  );
  for (const scenarioId of RECOMMENDER_SYSTEMS_NEW_APPLIED_SCENARIO_IDS) {
    assert.ok(sourceScenarios.has(scenarioId), `missing applied recommender scenario ${scenarioId}`);
  }
});

test('new recommender scenarios require worked evidence rather than terminology recall', () => {
  const sourceScenarios = scenariosById(
    P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON[LESSON_ID],
  );

  for (const scenarioId of RECOMMENDER_SYSTEMS_NEW_APPLIED_SCENARIO_IDS) {
    const scenario = sourceScenarios.get(scenarioId);
    assert.ok(scenario, `missing source scenario ${scenarioId}`);
    assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenarioId} must require applied reasoning`);
    assert.ok(scenario.scenario.length >= 180, `${scenarioId} needs enough evidence/context`);
    assert.ok(scenario.prompt.length >= 55, `${scenarioId} prompt is too shallow`);
    assert.equal(scenario.choices.length, 3, `${scenarioId} should have three choices`);
    assert.equal(new Set(scenario.choices.map(normalize)).size, 3, `${scenarioId} choices must remain distinct`);
    assert.equal(scenario.answerIndex, 0, `${scenarioId} source answer should use the canonical first slot`);
    assert.ok(scenario.relatedComparison.length >= 20, `${scenarioId} should state the comparison being tested`);
    assert.ok(scenario.explanation.length >= 170, `${scenarioId} explanation should show the reasoning`);
    assert.ok(scenario.misconceptionTested.length >= 90, `${scenarioId} should identify the misconception`);

    if (scenario.level === 'calculation') {
      assert.match(
        `${scenario.scenario} ${scenario.prompt}`,
        /\d/,
        `${scenarioId} calculation must contain numeric evidence`,
      );
    }
  }
});

test('all five recommender depth competencies survive live assessment assembly', () => {
  const liveScenarios = scenariosById(getLessonAssessment(LESSON_ID).scenarioQuestions);

  for (const { scenarioId } of RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS) {
    const scenario = liveScenarios.get(scenarioId);
    assert.ok(scenario, `missing live recommender scenario ${scenarioId}`);
    assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenarioId} must remain a depth question`);
    assert.ok(scenario.answerIndex >= 0 && scenario.answerIndex < 3, `${scenarioId} answer index must remain valid`);
  }
});

test('recommender depth spans ranking, latent factors, off-policy evaluation, exploration, and online outcomes', () => {
  const liveScenarios = scenariosById(getLessonAssessment(LESSON_ID).scenarioQuestions);
  const combined = RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS.map(({ scenarioId }) => {
    const scenario = liveScenarios.get(scenarioId);
    assert.ok(scenario, `missing live recommender scenario ${scenarioId}`);
    return `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`;
  }).join(' ');

  assert.match(combined, /nDCG|discounted cumulative gain/i);
  assert.match(combined, /matrix.factor|latent factor|SGD/i);
  assert.match(combined, /propensity|off-policy|IPS/i);
  assert.match(combined, /exploration|cold-start|long-tail|feedback/i);
  assert.match(combined, /offline|online|conversion|catalog coverage/i);
});

test('new recommender scenarios use both calculation and decision reasoning modes', () => {
  const sourceScenarios = scenariosById(
    P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON[LESSON_ID],
  );
  const levels = new Set(
    RECOMMENDER_SYSTEMS_NEW_APPLIED_SCENARIO_IDS.map((scenarioId) => sourceScenarios.get(scenarioId).level),
  );

  assert.equal(levels.has('calculation'), true);
  assert.equal(levels.has('decision'), true);
});

test('new recommender scenarios do not expose a dominant live answer position', () => {
  const liveScenarios = scenariosById(getLessonAssessment(LESSON_ID).scenarioQuestions);
  const counts = [0, 0, 0];

  for (const scenarioId of RECOMMENDER_SYSTEMS_NEW_APPLIED_SCENARIO_IDS) {
    const scenario = liveScenarios.get(scenarioId);
    assert.ok(scenario, `missing live recommender scenario ${scenarioId}`);
    counts[scenario.answerIndex] += 1;
  }

  assert.equal(counts.every((count) => count > 0), true, `all answer positions should be used, got ${counts.join(',')}`);
  assert.ok(Math.max(...counts) / 4 <= 0.5, `no answer position should dominate the new set, got ${counts.join(',')}`);
});
