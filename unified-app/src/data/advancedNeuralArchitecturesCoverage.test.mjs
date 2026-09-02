import assert from 'node:assert/strict';
import test from 'node:test';

import { getLessonAssessment } from './lessonAssessments.js';
import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import {
  ADVANCED_NEURAL_ARCHITECTURES_AUDITED_LESSON_IDS,
  ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS,
} from './advancedNeuralArchitecturesCoverage.js';
import { P1_ADVANCED_NEURAL_ARCHITECTURES_APPLIED_SCENARIOS_BY_LESSON } from './p1AdvancedNeuralArchitecturesAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scenariosById(items) {
  return new Map((items || []).map((item) => [item.id, item]));
}

test('advanced neural architecture contract gives every audited lesson two independent competencies', () => {
  assert.deepEqual(ADVANCED_NEURAL_ARCHITECTURES_AUDITED_LESSON_IDS, ['lstm', 'vae', 'moe']);

  const requirementsByLesson = new Map();
  for (const requirement of ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS) {
    const existing = requirementsByLesson.get(requirement.lessonId) || [];
    existing.push(requirement);
    requirementsByLesson.set(requirement.lessonId, existing);
  }

  assert.equal(new Set(ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS.map(({ competency }) => competency)).size, 6);
  for (const lessonId of ADVANCED_NEURAL_ARCHITECTURES_AUDITED_LESSON_IDS) {
    assert.equal(requirementsByLesson.get(lessonId)?.length, 2, `${lessonId} should have two protected competencies`);
  }
});

test('advanced neural architecture applied source is registered in the live extension resolver', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(({ id }) => id === 'p1-advanced-neural-architectures-applied');
  assert.ok(source, 'missing p1-advanced-neural-architectures-applied source');
  assert.equal(source.priority, 'P1');
  assert.equal(source.questionsByLesson, P1_ADVANCED_NEURAL_ARCHITECTURES_APPLIED_SCENARIOS_BY_LESSON);
});

test('advanced neural architecture protected scenarios are evidence-rich worked questions', () => {
  const seenScenarioIds = new Set();

  for (const requirement of ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS) {
    const sourceScenarios = scenariosById(P1_ADVANCED_NEURAL_ARCHITECTURES_APPLIED_SCENARIOS_BY_LESSON[requirement.lessonId]);
    assert.equal(requirement.scenarioIds.length, 1, `${requirement.competency} should protect one focused scenario`);

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
      assert.equal(scenario.answerIndex, 0, `${scenarioId} source answer should use canonical first slot before live rotation`);
      assert.ok(scenario.explanation.length >= 180, `${scenarioId} explanation should teach the mechanism`);
      assert.ok(scenario.misconceptionTested.length >= 100, `${scenarioId} should state the misconception explicitly`);
      assert.ok(scenario.relatedComparison.length >= 20, `${scenarioId} should identify the relevant comparison`);
      assert.match(
        `${scenario.scenario} ${scenario.prompt} ${scenario.choices.join(' ')} ${scenario.explanation}`,
        /\d/,
        `${scenarioId} calculation should contain numerical evidence`,
      );
    }
  }
});

test('advanced neural architecture protected scenarios survive live assessment assembly', () => {
  for (const requirement of ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) {
      const scenario = live.get(scenarioId);
      assert.ok(scenario, `${scenarioId} missing from live ${requirement.lessonId} assessment`);
      assert.equal(DEPTH_LEVELS.has(scenario.level), true);
      assert.ok(scenario.answerIndex >= 0 && scenario.answerIndex < 3);
    }
  }
});

test('advanced neural architecture scenarios cover state, latent distributions, and sparse routing', () => {
  const combined = ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS.flatMap(({ lessonId, scenarioIds }) => {
    const source = scenariosById(P1_ADVANCED_NEURAL_ARCHITECTURES_APPLIED_SCENARIOS_BY_LESSON[lessonId]);
    return scenarioIds.map((id) => source.get(id));
  }).map((scenario) => `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`).join(' ');

  assert.match(combined, /forget gate|cell state/i);
  assert.match(combined, /gradient|backpropagation/i);
  assert.match(combined, /reparameterization|epsilon/i);
  assert.match(combined, /KL|prior/i);
  assert.match(combined, /top-2|expert parameters/i);
  assert.match(combined, /capacity factor|overflow|overloaded/i);
});

test('advanced neural architecture protected scenarios use every answer position evenly', () => {
  const counts = [0, 0, 0];

  for (const requirement of ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    for (const scenarioId of requirement.scenarioIds) counts[live.get(scenarioId).answerIndex] += 1;
  }

  assert.deepEqual(counts, [2, 2, 2], `expected exact 2/2/2 answer balance, got ${counts.join(',')}`);
});
