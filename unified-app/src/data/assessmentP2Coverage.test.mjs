import assert from 'node:assert/strict';
import test from 'node:test';

import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import { P2_SCENARIOS_BY_LESSON } from './p2ScenarioQuestions.js';
import { getLessonAssessment } from './lessonAssessments.js';

const EXPECTED_P2_COUNTS = Object.freeze({
  'determinant-volume': 2,
  'sequential-testing-peeking': 1,
  'spearman-correlation': 2,
  relu: 1,
  'leaky-relu': 1,
  'conv-relu': 1,
  'max-pooling': 1,
  'native-sparse-attention': 1,
  'dapo-reasoning-rl': 1,
  'coconut-latent-reasoning': 1,
  'frontier-moe-systems': 1,
});

const ALLOWED_LEVELS = new Set(['mechanism', 'comparison', 'diagnosis', 'paper-reading']);

function normalizeLevel(level) {
  return String(level || '').toLowerCase();
}

test('P2 scenario catalog is registered exactly once', () => {
  const p2Sources = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.filter(({ priority }) => priority === 'P2');

  assert.equal(p2Sources.length, 1, 'P2 scenarios should have one centralized extension source');
  assert.equal(p2Sources[0].id, 'p2-cleanup');
  assert.equal(p2Sources[0].questionsByLesson, P2_SCENARIOS_BY_LESSON);
});

test('P2 scenario catalog covers the intended cleanup topics', () => {
  assert.deepEqual(
    Object.keys(P2_SCENARIOS_BY_LESSON).sort(),
    Object.keys(EXPECTED_P2_COUNTS).sort(),
  );

  for (const [lessonId, expectedCount] of Object.entries(EXPECTED_P2_COUNTS)) {
    const scenarios = P2_SCENARIOS_BY_LESSON[lessonId] || [];
    assert.equal(scenarios.length, expectedCount, `${lessonId}: unexpected P2 scenario count`);
  }
});

test('P2 scenarios are diagnostic or comparative and remain live', async (t) => {
  for (const [lessonId, sourceScenarios] of Object.entries(P2_SCENARIOS_BY_LESSON)) {
    await t.test(lessonId, () => {
      const liveById = new Map(
        (getLessonAssessment(lessonId).scenarioQuestions || []).map((question) => [question.id, question]),
      );

      for (const sourceScenario of sourceScenarios) {
        assert.ok(
          ALLOWED_LEVELS.has(normalizeLevel(sourceScenario.level)),
          `${sourceScenario.id}: P2 should add reasoning depth rather than foundation trivia`,
        );
        assert.ok(sourceScenario.misconceptionTested, `${sourceScenario.id}: misconceptionTested is required`);
        assert.ok(liveById.has(sourceScenario.id), `${lessonId}: ${sourceScenario.id} is not live`);
      }
    });
  }
});
