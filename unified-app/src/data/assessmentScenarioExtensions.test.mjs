import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import {
  ASSESSMENT_SCENARIO_EXTENSION_SOURCES,
  getAssessmentScenarioExtensionEntries,
} from './assessmentScenarioExtensions.js';
import { getLessonAssessment } from './lessonAssessments.js';

const MAX_SCENARIO_ANSWER_SHARE = 0.6;
const VALID_PRIORITIES = new Set(['P0', 'P1', 'P2']);

function collectExtensionsByLesson() {
  const byLesson = new Map();

  for (const entry of getAssessmentScenarioExtensionEntries()) {
    const existing = byLesson.get(entry.lessonId) || [];
    byLesson.set(entry.lessonId, [...existing, entry]);
  }

  return byLesson;
}

function validateQuestion(lessonId, question) {
  assert.ok(question.id && /\S/.test(question.id), `${lessonId}: extension scenario needs an id`);
  assert.ok(question.scenario && /\S/.test(question.scenario), `${question.id}: scenario is required`);
  assert.ok(question.prompt && /\S/.test(question.prompt), `${question.id}: prompt is required`);
  assert.equal(question.choices?.length, 3, `${question.id}: exactly three choices are required`);
  assert.equal(
    new Set(question.choices.map(normalizeAssessmentText)).size,
    3,
    `${question.id}: choices must be distinct after normalization`,
  );
  assert.ok(Number.isInteger(question.answerIndex), `${question.id}: answerIndex must be an integer`);
  assert.ok(question.answerIndex >= 0 && question.answerIndex < 3, `${question.id}: invalid answerIndex`);
  assert.ok(question.explanation?.length >= 30, `${question.id}: explanation is too short`);

  if (question.kind === 'visual-state') {
    assert.ok(question.visualState && typeof question.visualState === 'object', `${question.id}: visual state is required`);
    assert.ok(Object.keys(question.visualState).length > 0, `${question.id}: visual state cannot be empty`);
  }
}

test('scenario extension sources have unique ids and valid priorities', () => {
  const sourceIds = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.map((source) => source.id);
  assert.equal(new Set(sourceIds).size, sourceIds.length, 'scenario extension source ids must be unique');

  for (const source of ASSESSMENT_SCENARIO_EXTENSION_SOURCES) {
    assert.ok(VALID_PRIORITIES.has(source.priority), `${source.id}: invalid priority ${source.priority}`);
    assert.ok(source.questionsByLesson && typeof source.questionsByLesson === 'object', `${source.id}: questionsByLesson is required`);
  }
});

test('all assessment scenario extensions are live and collision-free', async (t) => {
  const byLesson = collectExtensionsByLesson();

  for (const [lessonId, entries] of byLesson.entries()) {
    await t.test(lessonId, () => {
      const extensionIds = entries.map(({ question }) => question.id);
      const extensionPrompts = entries.map(({ question }) => normalizeAssessmentText(question.prompt));
      assert.equal(
        new Set(extensionIds).size,
        extensionIds.length,
        `${lessonId}: extension sources contain duplicate scenario ids`,
      );
      assert.equal(
        new Set(extensionPrompts).size,
        extensionPrompts.length,
        `${lessonId}: extension sources contain duplicate normalized prompts`,
      );

      const assessment = getLessonAssessment(lessonId);
      const liveScenarios = assessment.scenarioQuestions || [];
      const liveScenarioIds = liveScenarios.map((question) => question.id);
      const liveScenarioIdSet = new Set(liveScenarioIds);
      const quizIds = new Set((assessment.quiz || []).map((question) => question.id));

      assert.equal(
        liveScenarioIdSet.size,
        liveScenarioIds.length,
        `${lessonId}: live scenario ids must be unique across base and extension sources`,
      );

      for (const { sourceId, priority, question } of entries) {
        validateQuestion(lessonId, question);
        assert.ok(liveScenarioIdSet.has(question.id), `${lessonId}: ${question.id} from ${sourceId} is not merged into the public assessment`);
        assert.ok(!quizIds.has(question.id), `${lessonId}: ${question.id} collides with a quiz id`);
        assert.ok(VALID_PRIORITIES.has(priority), `${lessonId}: ${question.id} has invalid priority ${priority}`);
      }
    });
  }
});

test('live extension scenarios do not expose a dominant correct-answer position', () => {
  const byLesson = collectExtensionsByLesson();
  const counts = [0, 0, 0];

  for (const [lessonId, entries] of byLesson.entries()) {
    const liveById = new Map(
      (getLessonAssessment(lessonId).scenarioQuestions || []).map((question) => [question.id, question]),
    );

    for (const { question } of entries) {
      const live = liveById.get(question.id);
      assert.ok(live, `${lessonId}: missing live scenario ${question.id}`);
      counts[live.answerIndex] += 1;
    }
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  assert.ok(total > 0, 'extension scenarios should exist');
  assert.ok(counts.every((count) => count > 0), `all answer positions should be used, got ${counts.join(', ')}`);
  assert.ok(
    Math.max(...counts) / total <= MAX_SCENARIO_ANSWER_SHARE,
    `no answer position should exceed ${MAX_SCENARIO_ANSWER_SHARE * 100}% of scenarios, got ${counts.join(', ')}`,
  );
});
