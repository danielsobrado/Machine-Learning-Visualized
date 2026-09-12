import assert from 'node:assert/strict';
import test from 'node:test';

import { getLessonAssessment } from './lessonAssessments.js';

const REQUIREMENTS = Object.freeze([
  Object.freeze({ lessonId: 'ab-testing-foundations', scenarioId: 'ab-sample-ratio-mismatch-randomization-diagnosis' }),
  Object.freeze({ lessonId: 'knn-naive-bayes-svm', scenarioId: 'classifier-knn-distance-concentration-diagnosis' }),
  Object.freeze({ lessonId: 'computation-graph-backprop', scenarioId: 'backprop-detached-branch-gradient-check' }),
  Object.freeze({ lessonId: 'attention-masks', scenarioId: 'attention-mask-before-softmax-composition' }),
  Object.freeze({ lessonId: 'kv-cache', scenarioId: 'kv-cache-beam-memory-worked' }),
  Object.freeze({ lessonId: 'model-fairness', scenarioId: 'fairness-base-rate-objective-tradeoff' }),
  Object.freeze({ lessonId: 'q-learning', scenarioId: 'qlearn-max-overestimation-diagnosis' }),
  Object.freeze({ lessonId: 'ppo-clipped-policy-gradient', scenarioId: 'ppo-clipping-not-kl-guarantee' }),
  Object.freeze({ lessonId: 'least-squares-projection', scenarioId: 'least-squares-qr-vs-normal-equations-stability' }),
]);

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);

function scenarioById(lessonId, scenarioId) {
  return getLessonAssessment(lessonId).scenarioQuestions.find(({ id }) => id === scenarioId);
}

test('high-priority gap scenarios stay live', async (t) => {
  for (const { lessonId, scenarioId } of REQUIREMENTS) {
    await t.test(`${lessonId}:${scenarioId}`, () => {
      const scenario = scenarioById(lessonId, scenarioId);
      assert.ok(scenario, `${lessonId}: missing scenario ${scenarioId}`);
      assert.ok(DEPTH_LEVELS.has(scenario.level), `${scenarioId}: expected a depth reasoning level`);
      assert.ok(scenario.scenario?.length >= 120, `${scenarioId}: scenario context is too shallow`);
      assert.ok(scenario.prompt?.length >= 20, `${scenarioId}: prompt is too shallow`);
      assert.equal(scenario.choices?.length, 3, `${scenarioId}: exactly three choices are required`);
      assert.ok(scenario.relatedComparison?.length >= 10, `${scenarioId}: comparison contract is required`);
      assert.ok(scenario.explanation?.length >= 120, `${scenarioId}: explanation must preserve the reasoning`);
      assert.ok(scenario.misconceptionTested?.length >= 60, `${scenarioId}: misconception contract is required`);
    });
  }
});

test('high-priority gap contract has one stable scenario per competency', () => {
  assert.equal(new Set(REQUIREMENTS.map(({ lessonId }) => lessonId)).size, REQUIREMENTS.length);
  assert.equal(new Set(REQUIREMENTS.map(({ scenarioId }) => scenarioId)).size, REQUIREMENTS.length);
});

test('high-priority gap scenarios keep their defining decision semantics', () => {
  const expectedAnswerPatterns = new Map([
    ['ab-sample-ratio-mismatch-randomization-diagnosis', /experiment-integrity failure/i],
    ['classifier-knn-distance-concentration-diagnosis', /curse of dimensionality/i],
    ['backprop-detached-branch-gradient-check', /missing a gradient path/i],
    ['attention-mask-before-softmax-composition', /before softmax/i],
    ['kv-cache-beam-memory-worked', /about 6 GiB/i],
    ['fairness-base-rate-objective-tradeoff', /mutually incompatible/i],
    ['qlearn-max-overestimation-diagnosis', /maximization bias/i],
    ['ppo-clipping-not-kl-guarantee', /not a hard global KL constraint/i],
    ['least-squares-qr-vs-normal-equations-stability', /prefer QR/i],
  ]);

  for (const { lessonId, scenarioId } of REQUIREMENTS) {
    const scenario = scenarioById(lessonId, scenarioId);
    assert.ok(scenario, `${lessonId}: missing scenario ${scenarioId}`);
    const correctAnswer = scenario.choices[scenario.answerIndex];
    assert.match(correctAnswer, expectedAnswerPatterns.get(scenarioId), `${scenarioId}: defining answer changed`);
  }
});
