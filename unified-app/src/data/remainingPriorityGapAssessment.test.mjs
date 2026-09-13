import assert from 'node:assert/strict';
import test from 'node:test';

import { getLessonAssessment } from './lessonAssessments.js';

const REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'optimization',
    scenarioId: 'optimization-objective-vs-update-rule-diagnosis',
    answerPattern: /objective and its geometry/i,
  }),
  Object.freeze({
    lessonId: 'transformer',
    scenarioId: 'transformer-block-parameter-ledger-worked',
    answerPattern: /3,145,728 total/i,
  }),
  Object.freeze({
    lessonId: 'fine-tuning',
    scenarioId: 'fine-tuning-evaluation-contamination-diagnosis',
    answerPattern: /no longer independent evidence/i,
  }),
  Object.freeze({
    lessonId: 'rag-vector-indexing',
    scenarioId: 'rag-index-embedding-version-migration-diagnosis',
    answerPattern: /compatible embedding space/i,
  }),
  Object.freeze({
    lessonId: 'attention-mechanism',
    scenarioId: 'attention-scaled-qk-score-worked',
    answerPattern: /2\.83/i,
  }),
  Object.freeze({
    lessonId: 'self-attention',
    scenarioId: 'self-attention-causal-vs-bidirectional-decision',
    answerPattern: /causal self-attention for Model A and bidirectional self-attention for Model B/i,
  }),
  Object.freeze({
    lessonId: 'layer-normalization',
    scenarioId: 'layernorm-rmsnorm-comparison-worked',
    answerPattern: /RMSNorm produces approximately \[0\.447,1\.342\]/i,
  }),
  Object.freeze({
    lessonId: 'policy-gradients',
    scenarioId: 'policy-gradient-baseline-variance-diagnosis',
    answerPattern: /reduce gradient-estimator variance/i,
  }),
  Object.freeze({
    lessonId: 'actor-critic',
    scenarioId: 'actor-critic-critic-error-propagation-diagnosis',
    answerPattern: /biased critic is corrupting the actor advantage signal/i,
  }),
  Object.freeze({
    lessonId: 'rl-exploration',
    scenarioId: 'exploration-nonstationary-environment-decision',
    answerPattern: /Maintain or adapt some exploration/i,
  }),
]);

const DEPTH_LEVELS = new Set(['application', 'calculation', 'decision', 'design', 'diagnosis']);

function scenarioFor(requirement) {
  return getLessonAssessment(requirement.lessonId).scenarioQuestions.find(
    ({ id }) => id === requirement.scenarioId,
  );
}

test('remaining priority gap scenarios remain live and substantive', async (t) => {
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
      assert.match(
        scenario.choices[scenario.answerIndex],
        requirement.answerPattern,
        `${requirement.scenarioId}: defining answer changed`,
      );
    });
  }
});

test('remaining priority gap contract keeps one independent competency per lesson', () => {
  assert.equal(new Set(REQUIREMENTS.map(({ lessonId }) => lessonId)).size, REQUIREMENTS.length);
  assert.equal(new Set(REQUIREMENTS.map(({ scenarioId }) => scenarioId)).size, REQUIREMENTS.length);
});

test('remaining priority scenarios exercise all answer positions', () => {
  const answerPositions = new Set(REQUIREMENTS.map((requirement) => scenarioFor(requirement).answerIndex));
  assert.deepEqual([...answerPositions].sort(), [0, 1, 2]);
});
