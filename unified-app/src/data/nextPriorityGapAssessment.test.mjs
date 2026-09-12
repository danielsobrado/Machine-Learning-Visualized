import assert from 'node:assert/strict';
import test from 'node:test';

import { getLessonAssessment } from './lessonAssessments.js';

const REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'hypothesis-testing-intuition',
    scenarioId: 'hypothesis-equivalence-tost-decision',
    assessment: () => getLessonAssessment('hypothesis-testing-intuition'),
    answerPattern: /support equivalence/i,
  }),
  Object.freeze({
    lessonId: 'calibration',
    scenarioId: 'calibration-ece-binning-sensitivity-diagnosis',
    assessment: () => getLessonAssessment('calibration'),
    answerPattern: /hide substantial local over- and under-confidence/i,
  }),
  Object.freeze({
    lessonId: 'cross-validation',
    scenarioId: 'cv-preprocessing-fit-inside-folds-diagnosis',
    assessment: () => getLessonAssessment('cross-validation'),
    answerPattern: /each training fold/i,
  }),
  Object.freeze({
    lessonId: 'probability-distributions',
    scenarioId: 'probability-zero-inflation-count-model-diagnosis',
    assessment: () => getLessonAssessment('probability-distributions'),
    answerPattern: /zero-inflated or hurdle-style process/i,
  }),
  Object.freeze({
    lessonId: 'classification-metrics',
    scenarioId: 'metrics-prevalence-shift-ppv-worked',
    assessment: () => getLessonAssessment('classification-metrics'),
    answerPattern: /about 15%/i,
  }),
  Object.freeze({
    lessonId: 'propensity-scores',
    scenarioId: 'propensity-doubly-robust-estimator-decision',
    assessment: () => getLessonAssessment('propensity-scores'),
    answerPattern: /either the propensity model or the outcome model is correctly specified/i,
  }),
]);

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);

function scenarioFor(requirement) {
  return requirement.assessment().scenarioQuestions.find(({ id }) => id === requirement.scenarioId);
}

test('next priority gap scenarios remain live and substantive', async (t) => {
  for (const requirement of REQUIREMENTS) {
    await t.test(`${requirement.lessonId}:${requirement.scenarioId}`, () => {
      const scenario = scenarioFor(requirement);
      assert.ok(scenario, `${requirement.lessonId}: missing scenario ${requirement.scenarioId}`);
      assert.ok(DEPTH_LEVELS.has(scenario.level), `${requirement.scenarioId}: expected a reasoning level`);
      assert.ok(scenario.scenario?.length >= 120, `${requirement.scenarioId}: scenario context is too shallow`);
      assert.ok(scenario.prompt?.length >= 20, `${requirement.scenarioId}: prompt is too shallow`);
      assert.equal(scenario.choices?.length, 3, `${requirement.scenarioId}: exactly three choices are required`);
      assert.equal(new Set(scenario.choices).size, 3, `${requirement.scenarioId}: choices must be unique`);
      assert.ok(scenario.relatedComparison?.length >= 10, `${requirement.scenarioId}: comparison contract is required`);
      assert.ok(scenario.explanation?.length >= 120, `${requirement.scenarioId}: explanation must preserve the reasoning`);
      assert.ok(scenario.misconceptionTested?.length >= 60, `${requirement.scenarioId}: misconception contract is required`);
      assert.match(scenario.choices[scenario.answerIndex], requirement.answerPattern, `${requirement.scenarioId}: defining answer changed`);
    });
  }
});

test('next priority gap contract keeps one independent competency per lesson', () => {
  assert.equal(new Set(REQUIREMENTS.map(({ lessonId }) => lessonId)).size, REQUIREMENTS.length);
  assert.equal(new Set(REQUIREMENTS.map(({ scenarioId }) => scenarioId)).size, REQUIREMENTS.length);
});

test('next priority scenarios exercise all answer positions', () => {
  const answerPositions = new Set(REQUIREMENTS.map((requirement) => scenarioFor(requirement).answerIndex));
  assert.deepEqual([...answerPositions].sort(), [0, 1, 2]);
});
