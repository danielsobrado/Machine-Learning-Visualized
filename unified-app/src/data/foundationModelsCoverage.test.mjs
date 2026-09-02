import assert from 'node:assert/strict';
import test from 'node:test';

import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import {
  FOUNDATION_MODELS_AUDITED_LESSON_IDS,
  FOUNDATION_MODELS_DEPTH_REQUIREMENTS,
} from './foundationModelsCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';
import { P1_FOUNDATION_MODELS_APPLIED_SCENARIOS_BY_LESSON } from './p1FoundationModelsAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scenariosById(items) {
  return new Map((items || []).map((item) => [item.id, item]));
}

test('foundation model depth contract covers three audited architectures with two competencies each', () => {
  assert.deepEqual(
    FOUNDATION_MODELS_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId),
    FOUNDATION_MODELS_AUDITED_LESSON_IDS,
  );
  assert.equal(new Set(FOUNDATION_MODELS_AUDITED_LESSON_IDS).size, 3);

  const competencies = FOUNDATION_MODELS_DEPTH_REQUIREMENTS.flatMap(({ competencies: items }) => items);
  assert.equal(competencies.length, 6);
  assert.equal(new Set(competencies.map(({ competency }) => competency)).size, 6);
  assert.equal(new Set(competencies.map(({ scenarioId }) => scenarioId)).size, 6);
  assert.equal(FOUNDATION_MODELS_DEPTH_REQUIREMENTS.every(({ competencies: items }) => items.length === 2), true);
});

test('foundation model applied source is registered in the live extension resolver', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(({ id }) => id === 'p1-foundation-models-applied');
  assert.ok(source, 'missing p1-foundation-models-applied scenario source');
  assert.equal(source.priority, 'P1');
  assert.equal(source.questionsByLesson, P1_FOUNDATION_MODELS_APPLIED_SCENARIOS_BY_LESSON);
});

test('foundation model protected scenarios are evidence-rich worked questions', () => {
  for (const requirement of FOUNDATION_MODELS_DEPTH_REQUIREMENTS) {
    const sourceScenarios = scenariosById(P1_FOUNDATION_MODELS_APPLIED_SCENARIOS_BY_LESSON[requirement.lessonId]);

    for (const { scenarioId } of requirement.competencies) {
      const scenario = sourceScenarios.get(scenarioId);
      assert.ok(scenario, `${requirement.lessonId} missing protected scenario ${scenarioId}`);
      assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenarioId} should be a depth question`);
      assert.ok(scenario.scenario.length >= 180, `${scenarioId} needs sufficient architecture evidence`);
      assert.ok(scenario.prompt.length >= 55, `${scenarioId} prompt is too shallow`);
      assert.equal(scenario.choices.length, 3, `${scenarioId} should have three choices`);
      assert.equal(new Set(scenario.choices.map(normalize)).size, 3, `${scenarioId} choices must be distinct`);
      assert.equal(scenario.answerIndex, 0, `${scenarioId} source answer should use the canonical first slot`);
      assert.ok(scenario.explanation.length >= 180, `${scenarioId} explanation should teach the derivation`);
      assert.ok(scenario.misconceptionTested.length >= 90, `${scenarioId} should explicitly identify the misconception`);
      assert.ok(scenario.relatedComparison.length >= 20, `${scenarioId} should name the architectural comparison`);
      assert.match(
        `${scenario.scenario} ${scenario.prompt} ${scenario.choices.join(' ')} ${scenario.explanation}`,
        /\d/,
        `${scenarioId} should contain numerical evidence`,
      );
    }
  }
});

test('foundation model protected scenarios survive live assessment assembly', () => {
  for (const requirement of FOUNDATION_MODELS_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);

    for (const { scenarioId } of requirement.competencies) {
      const scenario = live.get(scenarioId);
      assert.ok(scenario, `${scenarioId} missing from live ${requirement.lessonId} assessment`);
      assert.equal(DEPTH_LEVELS.has(scenario.level), true);
      assert.ok(scenario.answerIndex >= 0 && scenario.answerIndex < 3);
    }
  }
});

test('foundation model depth spans encoder pretraining, decoder generation, and multimodal integration', () => {
  const combined = FOUNDATION_MODELS_DEPTH_REQUIREMENTS.flatMap(({ lessonId, competencies }) => {
    const source = scenariosById(P1_FOUNDATION_MODELS_APPLIED_SCENARIOS_BY_LESSON[lessonId]);
    return competencies.map(({ scenarioId }) => source.get(scenarioId));
  }).map((scenario) => `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`).join(' ');

  assert.match(combined, /masked-language-model|masked language model|\[MASK\]/i);
  assert.match(combined, /classification head|task head|five-class/i);
  assert.match(combined, /next-token|causal/i);
  assert.match(combined, /quadratic|squared|L²/i);
  assert.match(combined, /vision.*language|projector/i);
  assert.match(combined, /patch|resolution|visual token/i);
});

test('foundation model protected scenarios use live answer positions evenly', () => {
  const counts = [0, 0, 0];

  for (const requirement of FOUNDATION_MODELS_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const { scenarioId } of requirement.competencies) counts[live.get(scenarioId).answerIndex] += 1;
  }

  assert.deepEqual(counts, [2, 2, 2], `expected exact answer-position balance, got ${counts.join(',')}`);
});
