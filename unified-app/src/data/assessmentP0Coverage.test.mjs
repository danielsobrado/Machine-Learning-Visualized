import assert from 'node:assert/strict';
import test from 'node:test';

import {
  P0_ASSESSMENT_COVERAGE,
  P0_PRIORITY_ASSESSMENT_LESSON_IDS,
} from './assessmentQualityManifest.js';
import {
  PRIORITY_ASSESSMENT_LESSON_IDS,
  getLessonAssessment,
} from './lessonAssessments.js';

function scenarioIds(assessment) {
  return new Set((assessment.scenarioQuestions || []).map((question) => question.id));
}

function validateScenarioSchema(lessonId, question) {
  assert.ok(question.id && /\S/.test(question.id), `${lessonId}: scenario question needs an id`);
  assert.ok(question.scenario && /\S/.test(question.scenario), `${question.id}: scenario text is required`);
  assert.ok(question.prompt && /\S/.test(question.prompt), `${question.id}: prompt is required`);
  assert.ok(Array.isArray(question.choices), `${question.id}: choices must be an array`);
  assert.equal(question.choices.length, 3, `${question.id}: exactly three choices are required`);
  assert.equal(new Set(question.choices).size, 3, `${question.id}: choices must be distinct`);
  assert.ok(Number.isInteger(question.answerIndex), `${question.id}: answerIndex must be an integer`);
  assert.ok(question.answerIndex >= 0 && question.answerIndex < 3, `${question.id}: answerIndex is out of range`);
  assert.ok(question.explanation && question.explanation.length >= 30, `${question.id}: explanation is too short`);

  if (question.kind === 'visual-state') {
    assert.ok(question.visualState && typeof question.visualState === 'object', `${question.id}: visual-state metadata is required`);
    assert.ok(Object.keys(question.visualState).length > 0, `${question.id}: visual-state metadata cannot be empty`);
  }
}

test('P0 promoted assessments are included in the shared priority contract', () => {
  const priority = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);

  for (const lessonId of P0_PRIORITY_ASSESSMENT_LESSON_IDS) {
    assert.ok(priority.has(lessonId), `${lessonId} must be a priority assessment`);
    assert.equal(getLessonAssessment(lessonId).source, 'curated', `${lessonId} must resolve to curated questions`);
  }
});

test('P0 assessment scenarios cover required gaps', async (t) => {
  for (const [lessonId, requirement] of Object.entries(P0_ASSESSMENT_COVERAGE)) {
    await t.test(lessonId, () => {
      const assessment = getLessonAssessment(lessonId);
      const scenarios = assessment.scenarioQuestions || [];
      const ids = scenarioIds(assessment);

      assert.equal(ids.size, scenarios.length, `${lessonId}: scenario ids must be unique`);
      for (const question of scenarios) validateScenarioSchema(lessonId, question);

      for (const scenarioId of requirement.scenarioIds || []) {
        assert.ok(ids.has(scenarioId), `${lessonId}: missing required P0 scenario ${scenarioId}`);
      }

      if (requirement.minVisualStateQuestions) {
        const visualCount = scenarios.filter((question) => question.kind === 'visual-state').length;
        assert.ok(
          visualCount >= requirement.minVisualStateQuestions,
          `${lessonId}: requires at least ${requirement.minVisualStateQuestions} visual-state question(s), got ${visualCount}`,
        );
      }

      if (requirement.minComparisonQuestions) {
        const comparisonCount = scenarios.filter((question) => Boolean(question.relatedComparison)).length;
        assert.ok(
          comparisonCount >= requirement.minComparisonQuestions,
          `${lessonId}: requires at least ${requirement.minComparisonQuestions} cross-topic/comparison question(s), got ${comparisonCount}`,
        );
      }
    });
  }
});
