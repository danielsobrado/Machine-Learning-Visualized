import assert from 'node:assert/strict';
import test from 'node:test';

import { getLessonAssessment } from './lessonAssessments.js';
import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import {
  CLASSIC_NLP_AUDITED_LESSON_IDS,
  CLASSIC_NLP_DEPTH_REQUIREMENTS,
} from './classicNlpCoverage.js';
import { P1_CLASSIC_NLP_APPLIED_SCENARIOS_BY_LESSON } from './p1ClassicNlpAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scenariosById(items) {
  return new Map((items || []).map((item) => [item.id, item]));
}

test('classic NLP depth contract covers every audited representation lesson once', () => {
  assert.deepEqual(
    CLASSIC_NLP_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId),
    CLASSIC_NLP_AUDITED_LESSON_IDS,
  );

  assert.equal(new Set(CLASSIC_NLP_AUDITED_LESSON_IDS).size, 4);
  assert.equal(new Set(CLASSIC_NLP_DEPTH_REQUIREMENTS.map(({ competency }) => competency)).size, 4);
});

test('classic NLP applied source is registered in the live extension resolver', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(({ id }) => id === 'p1-classic-nlp-applied');
  assert.ok(source, 'missing p1-classic-nlp-applied scenario source');
  assert.equal(source.priority, 'P1');
  assert.equal(source.questionsByLesson, P1_CLASSIC_NLP_APPLIED_SCENARIOS_BY_LESSON);
});

test('classic NLP protected scenarios are evidence-rich worked questions', () => {
  const seenScenarioIds = new Set();

  for (const requirement of CLASSIC_NLP_DEPTH_REQUIREMENTS) {
    const sourceScenarios = scenariosById(P1_CLASSIC_NLP_APPLIED_SCENARIOS_BY_LESSON[requirement.lessonId]);
    assert.equal(requirement.scenarioIds.length, 1, `${requirement.lessonId} should protect one focused scenario`);

    for (const scenarioId of requirement.scenarioIds) {
      assert.equal(seenScenarioIds.has(scenarioId), false, `scenario ${scenarioId} reused across competencies`);
      seenScenarioIds.add(scenarioId);

      const scenario = sourceScenarios.get(scenarioId);
      assert.ok(scenario, `${requirement.lessonId} missing protected scenario ${scenarioId}`);
      assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenarioId} should be a depth question`);
      assert.ok(scenario.scenario.length >= 180, `${scenarioId} needs enough evidence-rich context`);
      assert.ok(scenario.prompt.length >= 55, `${scenarioId} prompt is too shallow`);
      assert.equal(scenario.choices.length, 3, `${scenarioId} should have three choices`);
      assert.equal(new Set(scenario.choices.map(normalize)).size, 3, `${scenarioId} choices must be distinct`);
      assert.equal(scenario.answerIndex, 0, `${scenarioId} source answer should use the canonical first slot before live rotation`);
      assert.ok(scenario.explanation.length >= 180, `${scenarioId} explanation should teach the mechanism, not just name the answer`);
      assert.ok(scenario.misconceptionTested.length >= 100, `${scenarioId} should state the misconception explicitly`);
      assert.ok(scenario.relatedComparison.length >= 20, `${scenarioId} should identify the relevant comparison`);

      if (scenario.level === 'calculation') {
        assert.match(
          `${scenario.scenario} ${scenario.prompt} ${scenario.choices.join(' ')} ${scenario.explanation}`,
          /\d/,
          `${scenarioId} calculation should contain numerical evidence`,
        );
      }
    }
  }
});

test('classic NLP protected scenarios survive live assessment assembly', () => {
  for (const requirement of CLASSIC_NLP_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) {
      const scenario = live.get(scenarioId);
      assert.ok(scenario, `${scenarioId} missing from live ${requirement.lessonId} assessment`);
      assert.equal(DEPTH_LEVELS.has(scenario.level), true);
      assert.ok(scenario.answerIndex >= 0 && scenario.answerIndex < 3);
    }
  }
});

test('classic NLP depth questions collectively test sparse, predictive, global, and subword reasoning', () => {
  const combined = CLASSIC_NLP_DEPTH_REQUIREMENTS.flatMap(({ lessonId, scenarioIds }) => {
    const source = scenariosById(P1_CLASSIC_NLP_APPLIED_SCENARIOS_BY_LESSON[lessonId]);
    return scenarioIds.map((id) => source.get(id));
  }).map((scenario) => `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`).join(' ');

  assert.match(combined, /sparse/i);
  assert.match(combined, /negative sampling/i);
  assert.match(combined, /co-occurrence/i);
  assert.match(combined, /subword|n-gram/i);
});

test('classic NLP protected scenarios use every live answer position without domination', () => {
  const counts = [0, 0, 0];

  for (const requirement of CLASSIC_NLP_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) counts[live.get(scenarioId).answerIndex] += 1;
  }

  assert.ok(counts.every((count) => count > 0), `all answer positions should appear: ${counts.join(',')}`);
  assert.ok(Math.max(...counts) <= 2, `no answer position should exceed half the protected set: ${counts.join(',')}`);
});
