import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeAssessmentText } from './assessmentQuality.js';
import { P0_EXPERIMENTATION_SCENARIOS_BY_LESSON } from './p0ExperimentationScenarioQuestions.js';
import { P0_SCENARIO_QUESTIONS_BY_LESSON } from './p0ScenarioQuestions.js';
import { P1_GENERATIVE_RL_SCENARIOS_BY_LESSON } from './p1GenerativeRlScenarioQuestions.js';
import { P1_MATH_SCENARIOS_BY_LESSON } from './p1MathScenarioQuestions.js';
import { P1_NEURAL_SCENARIOS_BY_LESSON } from './p1NeuralScenarioQuestions.js';
import { P1_NLP_TRANSFORMER_SCENARIOS_BY_LESSON } from './p1NlpTransformerScenarioQuestions.js';
import { P1_PRODUCTION_SCENARIOS_BY_LESSON } from './p1ProductionScenarioQuestions.js';
import { P1_SCENARIO_QUESTIONS_BY_LESSON } from './p1ScenarioQuestions.js';
import { P1_STATISTICS_SCENARIOS_BY_LESSON } from './p1StatisticsScenarioQuestions.js';
import { getLessonAssessment } from './lessonAssessments.js';

const EXTENSION_SOURCES = Object.freeze([
  P0_SCENARIO_QUESTIONS_BY_LESSON,
  P0_EXPERIMENTATION_SCENARIOS_BY_LESSON,
  P1_SCENARIO_QUESTIONS_BY_LESSON,
  P1_STATISTICS_SCENARIOS_BY_LESSON,
  P1_MATH_SCENARIOS_BY_LESSON,
  P1_NEURAL_SCENARIOS_BY_LESSON,
  P1_NLP_TRANSFORMER_SCENARIOS_BY_LESSON,
  P1_GENERATIVE_RL_SCENARIOS_BY_LESSON,
  P1_PRODUCTION_SCENARIOS_BY_LESSON,
]);

const MAX_SCENARIO_ANSWER_SHARE = 0.6;

function collectExtensions() {
  const byLesson = new Map();

  for (const source of EXTENSION_SOURCES) {
    for (const [lessonId, questions] of Object.entries(source)) {
      const existing = byLesson.get(lessonId) || [];
      byLesson.set(lessonId, [...existing, ...questions]);
    }
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

test('all assessment scenario extensions are live and collision-free', async (t) => {
  const byLesson = collectExtensions();

  for (const [lessonId, extensionQuestions] of byLesson.entries()) {
    await t.test(lessonId, () => {
      const extensionIds = extensionQuestions.map((question) => question.id);
      assert.equal(
        new Set(extensionIds).size,
        extensionIds.length,
        `${lessonId}: extension sources contain duplicate scenario ids`,
      );

      const assessment = getLessonAssessment(lessonId);
      const liveScenarioIds = new Set((assessment.scenarioQuestions || []).map((question) => question.id));
      const quizIds = new Set((assessment.quiz || []).map((question) => question.id));

      for (const question of extensionQuestions) {
        validateQuestion(lessonId, question);
        assert.ok(liveScenarioIds.has(question.id), `${lessonId}: ${question.id} is not merged into the public assessment`);
        assert.ok(!quizIds.has(question.id), `${lessonId}: ${question.id} collides with a quiz id`);
      }
    });
  }
});

test('live extension scenarios do not expose a dominant correct-answer position', () => {
  const byLesson = collectExtensions();
  const counts = [0, 0, 0];

  for (const [lessonId, extensionQuestions] of byLesson.entries()) {
    const liveById = new Map(
      (getLessonAssessment(lessonId).scenarioQuestions || []).map((question) => [question.id, question]),
    );

    for (const extension of extensionQuestions) {
      const live = liveById.get(extension.id);
      assert.ok(live, `${lessonId}: missing live scenario ${extension.id}`);
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
