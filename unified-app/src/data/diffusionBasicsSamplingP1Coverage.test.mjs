import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentScenarioExtensionEntries } from './assessmentScenarioExtensions.js';
import {
  getLessonAssessment,
  PRIORITY_ASSESSMENT_LESSON_IDS,
} from './lessonAssessments.js';
import {
  DIFFUSION_BASICS_SAMPLING_P1_AUDITED_LESSON_IDS,
  DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS,
} from './diffusionBasicsSamplingP1Coverage.js';

const DEPTH_SCENARIO_LEVELS = new Set([
  'application',
  'calculation',
  'comparison',
  'decision',
  'design',
  'diagnosis',
  'mechanism',
  'visual-state',
]);

const REQUIRED_COMPETENCY_IDS = Object.freeze([
  'diffusion-forward-process-signal-noise-math',
  'diffusion-timestep-noise-level-conditioning',
  'diffusion-training-generation-supervision-boundary',
  'diffusion-noise-prediction-error-direction',
  'diffusion-latent-denoising-decoding-contract',
  'diffusion-sampling-ddpm-vs-ddim-stochasticity',
  'diffusion-sampling-step-count-operating-point',
  'diffusion-sampling-seed-determinism-boundary',
  'diffusion-sampling-coarse-schedule-discretization',
  'diffusion-sampling-denoiser-error-step-interaction',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('diffusion basics and sampling P1 lessons remain priority curated assessments', () => {
  const priorityIds = new Set(PRIORITY_ASSESSMENT_LESSON_IDS);

  for (const lessonId of DIFFUSION_BASICS_SAMPLING_P1_AUDITED_LESSON_IDS) {
    assert.ok(priorityIds.has(lessonId), `${lessonId}: lesson must remain a priority assessment`);
    assert.equal(
      getLessonAssessment(lessonId).source,
      'curated',
      `${lessonId}: assessment must remain curated`,
    );
  }
});

test('diffusion basics and sampling P1 contract keeps required competencies explicit', () => {
  assert.deepEqual(
    DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_COMPETENCY_IDS].sort(),
  );
});

test('diffusion basics and sampling P1 competencies resolve to live assessment evidence', async (t) => {
  for (const requirement of DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const quiz = itemsById(assessment.quiz);
      const scenarios = itemsById(assessment.scenarioQuestions);

      assert.ok(requirement.quizIds.length >= 1, `${requirement.id}: protect at least one quiz signal`);
      assert.ok(requirement.scenarioIds.length >= 1, `${requirement.id}: protect at least one scenario signal`);

      for (const quizId of requirement.quizIds) {
        assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      }
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarios.has(scenarioId), `${requirement.id}: missing scenario ${scenarioId}`);
      }
    });
  }
});

test('diffusion basics and sampling P1 competencies require applied reasoning', () => {
  for (const requirement of DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS) {
    const scenarios = itemsById(getLessonAssessment(requirement.lessonId).scenarioQuestions);

    assert.ok(
      requirement.scenarioIds.some((scenarioId) => DEPTH_SCENARIO_LEVELS.has(scenarios.get(scenarioId)?.level)),
      `${requirement.id}: must protect applied reasoning evidence`,
    );
  }
});

test('diffusion basics and sampling scenario evidence remains tagged P1', () => {
  const extensionPriorityByScenarioId = new Map(
    getAssessmentScenarioExtensionEntries().map(({ priority, question }) => [question.id, priority]),
  );

  for (const requirement of DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS) {
    for (const scenarioId of requirement.scenarioIds) {
      assert.equal(
        extensionPriorityByScenarioId.get(scenarioId),
        'P1',
        `${scenarioId}: scenario evidence must remain in a P1 extension source`,
      );
    }
  }
});

test('diffusion basics and sampling P1 contract keeps evidence independent', () => {
  const requirementIds = DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS.map(({ id }) => id);
  assert.equal(new Set(requirementIds).size, requirementIds.length, 'competency ids must be unique');

  const requirementLessonIds = [...new Set(
    DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS.map(({ lessonId }) => lessonId),
  )].sort();
  assert.deepEqual(
    requirementLessonIds,
    [...DIFFUSION_BASICS_SAMPLING_P1_AUDITED_LESSON_IDS].sort(),
    'requirements must stay aligned with the audited lesson list',
  );

  const evidenceIds = [];
  for (const requirement of DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS) {
    const requirementEvidenceIds = [...requirement.quizIds, ...requirement.scenarioIds];
    assert.equal(
      new Set(requirementEvidenceIds).size,
      requirementEvidenceIds.length,
      `${requirement.id}: duplicate evidence id`,
    );
    evidenceIds.push(...requirementEvidenceIds);
  }

  assert.equal(
    new Set(evidenceIds).size,
    evidenceIds.length,
    'evidence ids should protect one explicit competency each',
  );
});
