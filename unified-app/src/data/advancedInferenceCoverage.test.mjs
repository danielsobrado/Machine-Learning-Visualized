import assert from 'node:assert/strict';
import test from 'node:test';

import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import {
  ADVANCED_INFERENCE_AUDITED_LESSON_IDS,
  ADVANCED_INFERENCE_DEPTH_REQUIREMENTS,
} from './advancedInferenceCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';
import { P1_ADVANCED_INFERENCE_APPLIED_SCENARIOS_BY_LESSON } from './p1AdvancedInferenceAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scenariosById(items) {
  return new Map((items || []).map((item) => [item.id, item]));
}

test('advanced inference depth contract covers four lessons with two competencies each', () => {
  assert.deepEqual(
    ADVANCED_INFERENCE_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId),
    ADVANCED_INFERENCE_AUDITED_LESSON_IDS,
  );
  assert.equal(new Set(ADVANCED_INFERENCE_AUDITED_LESSON_IDS).size, 4);

  const competencies = ADVANCED_INFERENCE_DEPTH_REQUIREMENTS.flatMap(({ competencies: items }) => items);
  assert.equal(competencies.length, 8);
  assert.equal(new Set(competencies.map(({ competency }) => competency)).size, 8);
  assert.equal(new Set(competencies.map(({ scenarioId }) => scenarioId)).size, 8);
  assert.equal(ADVANCED_INFERENCE_DEPTH_REQUIREMENTS.every(({ competencies: items }) => items.length === 2), true);
});

test('advanced inference applied source is registered in the live extension resolver', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(({ id }) => id === 'p1-advanced-inference-applied');
  assert.ok(source, 'missing p1-advanced-inference-applied scenario source');
  assert.equal(source.priority, 'P1');
  assert.equal(source.questionsByLesson, P1_ADVANCED_INFERENCE_APPLIED_SCENARIOS_BY_LESSON);
});

test('advanced inference protected scenarios are evidence-rich worked questions', () => {
  for (const requirement of ADVANCED_INFERENCE_DEPTH_REQUIREMENTS) {
    const sourceScenarios = scenariosById(P1_ADVANCED_INFERENCE_APPLIED_SCENARIOS_BY_LESSON[requirement.lessonId]);

    for (const { scenarioId } of requirement.competencies) {
      const scenario = sourceScenarios.get(scenarioId);
      assert.ok(scenario, `${requirement.lessonId} missing protected scenario ${scenarioId}`);
      assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenarioId} should be a depth question`);
      assert.ok(scenario.scenario.length >= 180, `${scenarioId} needs sufficient systems evidence`);
      assert.ok(scenario.prompt.length >= 55, `${scenarioId} prompt is too shallow`);
      assert.equal(scenario.choices.length, 3, `${scenarioId} should have three choices`);
      assert.equal(new Set(scenario.choices.map(normalize)).size, 3, `${scenarioId} choices must be distinct`);
      assert.equal(scenario.answerIndex, 0, `${scenarioId} source answer should use the canonical first slot`);
      assert.ok(scenario.explanation.length >= 180, `${scenarioId} explanation should teach the derivation or decision`);
      assert.ok(scenario.misconceptionTested.length >= 90, `${scenarioId} should explicitly identify the misconception`);
      assert.ok(scenario.relatedComparison.length >= 20, `${scenarioId} should name the relevant systems comparison`);
    }
  }
});

test('advanced inference calculation scenarios contain numerical evidence', () => {
  for (const requirement of ADVANCED_INFERENCE_DEPTH_REQUIREMENTS) {
    const sourceScenarios = scenariosById(P1_ADVANCED_INFERENCE_APPLIED_SCENARIOS_BY_LESSON[requirement.lessonId]);
    for (const { scenarioId } of requirement.competencies) {
      const scenario = sourceScenarios.get(scenarioId);
      if (scenario.level !== 'calculation') continue;
      assert.match(
        `${scenario.scenario} ${scenario.prompt} ${scenario.choices.join(' ')} ${scenario.explanation}`,
        /\d/,
        `${scenarioId} calculation should contain numerical evidence`,
      );
    }
  }
});

test('advanced inference protected scenarios survive live assessment assembly', () => {
  for (const requirement of ADVANCED_INFERENCE_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const { scenarioId } of requirement.competencies) {
      const scenario = live.get(scenarioId);
      assert.ok(scenario, `${scenarioId} missing from live ${requirement.lessonId} assessment`);
      assert.equal(DEPTH_LEVELS.has(scenario.level), true);
      assert.ok(scenario.answerIndex >= 0 && scenario.answerIndex < 3);
    }
  }
});

test('advanced inference depth spans cache compression, speculative decoding, sparse scheduling, and KV quantization', () => {
  const combined = ADVANCED_INFERENCE_DEPTH_REQUIREMENTS.flatMap(({ lessonId, competencies }) => {
    const source = scenariosById(P1_ADVANCED_INFERENCE_APPLIED_SCENARIOS_BY_LESSON[lessonId]);
    return competencies.map(({ scenarioId }) => source.get(scenarioId));
  }).map((scenario) => `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`).join(' ');

  assert.match(combined, /compressed KV latent|MLA|RoPE/i);
  assert.match(combined, /speculative|draft|verification/i);
  assert.match(combined, /union|per-query masks|shared-index/i);
  assert.match(combined, /effective.*bits|quantizer|rank correlation/i);
});

test('advanced inference protected scenarios use every live answer position without domination', () => {
  const counts = [0, 0, 0];

  for (const requirement of ADVANCED_INFERENCE_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const { scenarioId } of requirement.competencies) counts[live.get(scenarioId).answerIndex] += 1;
  }

  assert.deepEqual(counts, [2, 3, 3], `expected balanced live answer positions, got ${counts.join(',')}`);
});
