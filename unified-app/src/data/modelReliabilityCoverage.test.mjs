import assert from 'node:assert/strict';
import test from 'node:test';

import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import { HUB_LEARNING_PATHS } from './learningPaths.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  MODEL_RELIABILITY_AUDITED_LESSON_IDS,
  MODEL_RELIABILITY_DEPTH_REQUIREMENTS,
} from './modelReliabilityCoverage.js';
import { P1_MODEL_RELIABILITY_APPLIED_SCENARIOS_BY_LESSON } from './p1ModelReliabilityAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function byId(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

test('model reliability depth protects two independent competencies per audited lesson', () => {
  assert.equal(new Set(MODEL_RELIABILITY_AUDITED_LESSON_IDS).size, 2);
  assert.equal(MODEL_RELIABILITY_DEPTH_REQUIREMENTS.length, 4);

  for (const lessonId of MODEL_RELIABILITY_AUDITED_LESSON_IDS) {
    assert.equal(
      MODEL_RELIABILITY_DEPTH_REQUIREMENTS.filter((item) => item.lessonId === lessonId).length,
      2,
      `${lessonId} should keep two protected competencies`,
    );
  }

  assert.equal(new Set(MODEL_RELIABILITY_DEPTH_REQUIREMENTS.map(({ competency }) => competency)).size, 4);
  assert.equal(new Set(MODEL_RELIABILITY_DEPTH_REQUIREMENTS.map(({ scenarioId }) => scenarioId)).size, 4);
});

test('model reliability audited lessons remain on the Model Reliability learning path', () => {
  const path = HUB_LEARNING_PATHS.find(({ id }) => id === 'model-reliability-path');
  assert.ok(path, 'missing model-reliability-path');
  for (const lessonId of MODEL_RELIABILITY_AUDITED_LESSON_IDS) {
    assert.equal(path.nodes.includes(lessonId), true, `${lessonId} should remain on model-reliability-path`);
  }
});

test('model reliability applied source is registered in the live resolver', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(({ id }) => id === 'p1-model-reliability-applied');
  assert.ok(source, 'missing p1-model-reliability-applied source');
  assert.equal(source.priority, 'P1');
  assert.equal(source.questionsByLesson, P1_MODEL_RELIABILITY_APPLIED_SCENARIOS_BY_LESSON);
});

test('protected model reliability scenarios require evidence-based reasoning', () => {
  for (const { lessonId, scenarioId } of MODEL_RELIABILITY_DEPTH_REQUIREMENTS) {
    const scenario = byId(P1_MODEL_RELIABILITY_APPLIED_SCENARIOS_BY_LESSON[lessonId]).get(scenarioId);
    assert.ok(scenario, `${lessonId} missing ${scenarioId}`);
    assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenarioId} should require depth reasoning`);
    assert.ok(scenario.scenario.length >= 180, `${scenarioId} needs enough evidence`);
    assert.ok(scenario.prompt.length >= 60, `${scenarioId} prompt is too shallow`);
    assert.equal(scenario.choices.length, 3);
    assert.equal(new Set(scenario.choices.map(normalize)).size, 3, `${scenarioId} choices must be distinct`);
    assert.ok(scenario.relatedComparison.length >= 25);
    assert.ok(scenario.explanation.length >= 180, `${scenarioId} explanation should show reasoning`);
    assert.ok(scenario.misconceptionTested.length >= 100, `${scenarioId} should state the misconception`);
    assert.match(`${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`, /\d/);
  }
});

test('protected model reliability scenarios survive live assessment assembly', () => {
  for (const { lessonId, scenarioId } of MODEL_RELIABILITY_DEPTH_REQUIREMENTS) {
    const live = byId(getLessonAssessment(lessonId).scenarioQuestions).get(scenarioId);
    assert.ok(live, `${scenarioId} missing from live ${lessonId} assessment`);
    assert.ok(live.answerIndex >= 0 && live.answerIndex < 3);
  }
});

test('model reliability depth spans uncertainty, selective prediction, group error rates, and intersectional slices', () => {
  const combined = MODEL_RELIABILITY_DEPTH_REQUIREMENTS.map(({ lessonId, scenarioId }) => {
    const scenario = byId(P1_MODEL_RELIABILITY_APPLIED_SCENARIOS_BY_LESSON[lessonId]).get(scenarioId);
    return `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`;
  }).join(' ');

  assert.match(combined, /ensemble|epistemic/i);
  assert.match(combined, /abstention|coverage/i);
  assert.match(combined, /TPR|FPR|equalized/i);
  assert.match(combined, /intersectional|aggregate/i);
});

test('model reliability protected scenarios avoid an answer-position shortcut', () => {
  const counts = [0, 0, 0];
  for (const { lessonId, scenarioId } of MODEL_RELIABILITY_DEPTH_REQUIREMENTS) {
    const live = byId(getLessonAssessment(lessonId).scenarioQuestions).get(scenarioId);
    counts[live.answerIndex] += 1;
  }
  assert.equal(counts.every((count) => count > 0), true, `all positions should be used, got ${counts.join(',')}`);
  assert.ok(Math.max(...counts) / 4 <= 0.5, `no position should exceed 50%, got ${counts.join(',')}`);
});
