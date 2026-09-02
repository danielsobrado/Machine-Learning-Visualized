import assert from 'node:assert/strict';
import test from 'node:test';

import { allAnimations } from './animations.js';
import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import { FULL_ASSESSMENT_QUESTION_COUNT } from './assessmentQuality.js';
import {
  CURRICULUM_REVIEWED_LESSON_IDS,
  CURRICULUM_TAIL_AUDITED_LESSON_IDS,
  CURRICULUM_TAIL_DEPTH_REQUIREMENTS,
} from './curriculumReviewCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';
import { P1_CURRICULUM_TAIL_APPLIED_SCENARIOS_BY_LESSON } from './p1CurriculumTailAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);

function activeLessonIds() {
  return [...new Set(allAnimations.map(({ id }) => id))].sort();
}

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function byId(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('review coverage equals the complete active curriculum', () => {
  const active = activeLessonIds();

  assert.deepEqual(
    CURRICULUM_REVIEWED_LESSON_IDS,
    active,
    'Every active lesson must be curated/reviewed or protected by an explicit depth contract',
  );
});

test('every active lesson still has a full assessment bank', () => {
  for (const lessonId of activeLessonIds()) {
    const assessment = getLessonAssessment(lessonId);
    assert.equal(
      assessment.quiz?.length,
      FULL_ASSESSMENT_QUESTION_COUNT,
      `${lessonId}: active lessons must keep a complete assessment bank`,
    );
  }
});

test('curriculum tail source is registered once and owns exactly the final five lessons', () => {
  const sources = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.filter(
    ({ id }) => id === 'p1-curriculum-tail-applied',
  );

  assert.equal(sources.length, 1, 'curriculum tail scenarios should have one registered source');
  assert.equal(sources[0].questionsByLesson, P1_CURRICULUM_TAIL_APPLIED_SCENARIOS_BY_LESSON);
  assert.deepEqual(
    Object.keys(P1_CURRICULUM_TAIL_APPLIED_SCENARIOS_BY_LESSON).sort(),
    [...CURRICULUM_TAIL_AUDITED_LESSON_IDS].sort(),
  );
});

test('final curriculum tail questions require applied reasoning and remain live', () => {
  for (const { lessonId, scenarioIds } of CURRICULUM_TAIL_DEPTH_REQUIREMENTS) {
    const sourceById = byId(P1_CURRICULUM_TAIL_APPLIED_SCENARIOS_BY_LESSON[lessonId]);
    const liveById = byId(getLessonAssessment(lessonId).scenarioQuestions);

    for (const scenarioId of scenarioIds) {
      const source = sourceById.get(scenarioId);
      const live = liveById.get(scenarioId);

      assert.ok(source, `${lessonId}: missing source scenario ${scenarioId}`);
      assert.ok(live, `${lessonId}: missing live scenario ${scenarioId}`);
      assert.equal(DEPTH_LEVELS.has(source.level), true, `${scenarioId}: level must require applied reasoning`);
      assert.ok(source.scenario.length >= 180, `${scenarioId}: scenario needs substantive evidence/context`);
      assert.ok(source.prompt.length >= 40, `${scenarioId}: prompt is too shallow`);
      assert.equal(source.choices.length, 3, `${scenarioId}: expected three decision choices`);
      assert.equal(new Set(source.choices.map(normalize)).size, 3, `${scenarioId}: choices must be distinct`);
      assert.equal(source.answerIndex, 0, `${scenarioId}: source uses canonical first answer before live rotation`);
      assert.ok(source.relatedComparison.length >= 25, `${scenarioId}: missing comparison/tradeoff contract`);
      assert.ok(source.explanation.length >= 180, `${scenarioId}: explanation must show the reasoning`);
      assert.ok(source.misconceptionTested.length >= 90, `${scenarioId}: misconception must be substantive`);
      assert.ok(live.answerIndex >= 0 && live.answerIndex < live.choices.length, `${scenarioId}: live answer index is invalid`);
    }
  }
});

test('final curriculum tail spans calculations plus deployment/design decisions', () => {
  const levels = new Set(
    Object.values(P1_CURRICULUM_TAIL_APPLIED_SCENARIOS_BY_LESSON)
      .flat()
      .map(({ level }) => level),
  );

  assert.equal(levels.has('calculation'), true);
  assert.equal(levels.has('decision'), true);
});
