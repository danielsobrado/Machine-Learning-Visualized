import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateAssessmentCompetencyEvidence,
  validateAssessmentCompetencyRegistry,
} from './assessmentCompetencies.js';
import {
  CURRICULUM_REVIEW_GAP_AUDITED_LESSON_IDS,
  CURRICULUM_REVIEW_GAP_COMPETENCIES,
  CURRICULUM_REVIEW_GAP_SCENARIO_SOURCES,
} from './curriculumReviewGapCoverage.js';
import { ASSESSMENT_COMPETENCY_SOURCES } from './assessmentCompetencyRegistry.js';
import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import { getLessonAssessment } from './lessonAssessments.js';

const APPLIED_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'comparison', 'mechanism']);

test('review gap pack has broad explicit competency coverage', () => {
  assert.ok(CURRICULUM_REVIEW_GAP_AUDITED_LESSON_IDS.length >= 40);
  assert.ok(CURRICULUM_REVIEW_GAP_COMPETENCIES.length >= 60);

  assert.deepEqual(
    validateAssessmentCompetencyRegistry({
      auditedLessonIds: CURRICULUM_REVIEW_GAP_AUDITED_LESSON_IDS,
      competencies: CURRICULUM_REVIEW_GAP_COMPETENCIES,
    }),
    [],
  );
});

test('every review competency resolves to live scenario evidence', () => {
  assert.deepEqual(
    validateAssessmentCompetencyEvidence({
      competencies: CURRICULUM_REVIEW_GAP_COMPETENCIES,
      getAssessment: getLessonAssessment,
    }),
    [],
  );
});

test('review scenarios are substantive applied questions rather than count padding', () => {
  const ids = new Set();

  for (const source of CURRICULUM_REVIEW_GAP_SCENARIO_SOURCES) {
    for (const [lessonId, questions] of Object.entries(source.questionsByLesson)) {
      assert.ok(questions.length >= 1, `${lessonId}: expected review scenarios`);

      for (const item of questions) {
        assert.equal(ids.has(item.id), false, `duplicate scenario id: ${item.id}`);
        ids.add(item.id);

        assert.equal(APPLIED_LEVELS.has(item.level), true, `${item.id}: unsupported reasoning level`);
        assert.ok(item.scenario.length >= 100, `${item.id}: scenario context is too shallow`);
        assert.ok(item.prompt.length >= 30, `${item.id}: prompt is too shallow`);
        assert.equal(item.choices.length, 3, `${item.id}: expected three choices`);
        assert.ok(item.answerIndex >= 0 && item.answerIndex < item.choices.length);
        assert.ok(item.explanation.length >= 100, `${item.id}: explanation is too shallow`);
        assert.ok(item.misconceptionTested.length >= 50, `${item.id}: misconception contract is too shallow`);
        assert.ok(item.relatedComparison.length >= 20, `${item.id}: comparison contract is too shallow`);
      }
    }
  }
});


test('review scenario packs are registered exactly once and protected by the central registry', () => {
  const expectedScenarioSources = new Map([
    ['p1-review-statistics-causal', 'statistics-causal'],
    ['p1-review-math-classical', 'math-classical'],
    ['p1-review-neural-training', 'neural-training'],
    ['p1-review-transformer-rag', 'transformer-rag'],
    ['p1-review-rl-diffusion-systems', 'rl-diffusion-systems'],
  ]);

  for (const [extensionId, coverageId] of expectedScenarioSources) {
    const extensions = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.filter(({ id }) => id === extensionId);
    assert.equal(extensions.length, 1, `${extensionId}: expected one live scenario source`);

    const coverageSource = CURRICULUM_REVIEW_GAP_SCENARIO_SOURCES.find(({ id }) => id === coverageId);
    assert.ok(coverageSource, `${coverageId}: missing coverage source`);
    assert.equal(extensions[0].questionsByLesson, coverageSource.questionsByLesson);
  }

  const registrySources = ASSESSMENT_COMPETENCY_SOURCES.filter(({ id }) => id === 'curriculum-review-gaps');
  assert.equal(registrySources.length, 1);
  assert.equal(registrySources[0].competencies, CURRICULUM_REVIEW_GAP_COMPETENCIES);
  assert.equal(registrySources[0].auditedLessonIds, CURRICULUM_REVIEW_GAP_AUDITED_LESSON_IDS);
});
