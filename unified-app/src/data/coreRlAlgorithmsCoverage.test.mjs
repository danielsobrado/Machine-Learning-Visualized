import assert from 'node:assert/strict';
import test from 'node:test';

import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import {
  CORE_RL_ALGORITHMS_AUDITED_LESSON_IDS,
  CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS,
} from './coreRlAlgorithmsCoverage.js';
import { HUB_LEARNING_PATHS } from './learningPaths.js';
import { getLessonAssessment } from './lessonAssessments.js';
import { P1_CORE_RL_ALGORITHMS_APPLIED_SCENARIOS_BY_LESSON } from './p1CoreRlAlgorithmsAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scenariosById(items) {
  return new Map((items || []).map((item) => [item.id, item]));
}

test('core RL algorithm depth contract covers nine audited lessons exactly once', () => {
  assert.deepEqual(
    CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId),
    CORE_RL_ALGORITHMS_AUDITED_LESSON_IDS,
  );
  assert.equal(new Set(CORE_RL_ALGORITHMS_AUDITED_LESSON_IDS).size, 9);
  assert.equal(new Set(CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS.map(({ competency }) => competency)).size, 9);
  assert.equal(new Set(CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS.map(({ scenarioId }) => scenarioId)).size, 9);
});

test('core RL algorithm lessons remain on the RL And Algorithms learning path', () => {
  const path = HUB_LEARNING_PATHS.find(({ id }) => id === 'rl-path');
  assert.ok(path, 'missing rl-path');

  for (const lessonId of CORE_RL_ALGORITHMS_AUDITED_LESSON_IDS) {
    assert.equal(path.nodes.includes(lessonId), true, `${lessonId} should remain on rl-path`);
  }
});

test('core RL algorithms applied source is registered in the live extension resolver', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(({ id }) => id === 'p1-core-rl-algorithms-applied');
  assert.ok(source, 'missing p1-core-rl-algorithms-applied scenario source');
  assert.equal(source.priority, 'P1');
  assert.equal(source.questionsByLesson, P1_CORE_RL_ALGORITHMS_APPLIED_SCENARIOS_BY_LESSON);
});

test('core RL protected scenarios require worked algorithmic reasoning', () => {
  for (const { lessonId, scenarioId } of CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS) {
    const scenario = scenariosById(P1_CORE_RL_ALGORITHMS_APPLIED_SCENARIOS_BY_LESSON[lessonId]).get(scenarioId);
    assert.ok(scenario, `${lessonId} missing protected scenario ${scenarioId}`);
    assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenarioId} should be a depth question`);
    assert.ok(scenario.scenario.length >= 170, `${scenarioId} needs enough state/action evidence`);
    assert.ok(scenario.prompt.length >= 55, `${scenarioId} prompt is too shallow`);
    assert.equal(scenario.choices.length, 3, `${scenarioId} should have three choices`);
    assert.equal(new Set(scenario.choices.map(normalize)).size, 3, `${scenarioId} choices must be distinct`);
    assert.equal(scenario.answerIndex, 0, `${scenarioId} source answer should use the canonical first slot`);
    assert.ok(scenario.explanation.length >= 170, `${scenarioId} explanation should teach the derivation`);
    assert.ok(scenario.misconceptionTested.length >= 90, `${scenarioId} should identify the misconception`);
    assert.ok(scenario.relatedComparison.length >= 20, `${scenarioId} should name the algorithmic comparison`);
    assert.match(
      `${scenario.scenario} ${scenario.prompt} ${scenario.choices.join(' ')} ${scenario.explanation}`,
      /\d/,
      `${scenarioId} should include numerical evidence`,
    );
  }
});

test('core RL protected scenarios survive live assessment assembly', () => {
  for (const { lessonId, scenarioId } of CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(lessonId).scenarioQuestions).get(scenarioId);
    assert.ok(live, `${scenarioId} missing from live ${lessonId} assessment`);
    assert.equal(DEPTH_LEVELS.has(live.level), true);
    assert.ok(live.answerIndex >= 0 && live.answerIndex < 3);
  }
});

test('core RL depth spans dynamics, planning, policy optimization, shaping, and graph ranking', () => {
  const combined = CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS.map(({ lessonId, scenarioId }) => {
    const scenario = scenariosById(P1_CORE_RL_ALGORITHMS_APPLIED_SCENARIOS_BY_LESSON[lessonId]).get(scenarioId);
    return `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`;
  }).join(' ');

  assert.match(combined, /Markov|transition matrix/i);
  assert.match(combined, /Bellman|value iteration|policy improvement/i);
  assert.match(combined, /REINFORCE|policy-gradient|actor-critic|PPO/i);
  assert.match(combined, /potential-based|reward shaping/i);
  assert.match(combined, /PageRank|damping|rank/i);
});

test('core RL protected scenarios avoid a dominant live answer position', () => {
  const counts = [0, 0, 0];

  for (const { lessonId, scenarioId } of CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(lessonId).scenarioQuestions).get(scenarioId);
    counts[live.answerIndex] += 1;
  }

  assert.deepEqual(counts, [2, 3, 4], `expected stable 2/3/4 answer distribution, got ${counts.join(',')}`);
  assert.equal(counts.every((count) => count > 0), true, 'all answer positions should be represented');
  assert.ok(Math.max(...counts) / 9 < 0.5, 'no answer position should dominate half the protected set');
});
