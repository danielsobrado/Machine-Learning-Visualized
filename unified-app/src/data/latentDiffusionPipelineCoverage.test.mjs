import assert from 'node:assert/strict';
import test from 'node:test';

import { ASSESSMENT_SCENARIO_EXTENSION_SOURCES } from './assessmentScenarioExtensions.js';
import {
  LATENT_DIFFUSION_PIPELINE_AUDITED_LESSON_IDS,
  LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS,
} from './latentDiffusionPipelineCoverage.js';
import { getLessonAssessment } from './lessonAssessments.js';
import { P1_LATENT_DIFFUSION_PIPELINE_APPLIED_SCENARIOS_BY_LESSON } from './p1LatentDiffusionPipelineAppliedScenarioQuestions.js';

const DEPTH_LEVELS = new Set(['calculation', 'decision', 'design', 'diagnosis', 'application']);

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function scenariosById(items) {
  return new Map((items || []).map((item) => [item.id, item]));
}

test('latent diffusion pipeline depth contract covers every audited pipeline lesson once', () => {
  assert.deepEqual(
    LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS.map(({ lessonId }) => lessonId),
    LATENT_DIFFUSION_PIPELINE_AUDITED_LESSON_IDS,
  );
  assert.equal(new Set(LATENT_DIFFUSION_PIPELINE_AUDITED_LESSON_IDS).size, 7);
  assert.equal(new Set(LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS.map(({ competency }) => competency)).size, 7);
  assert.equal(new Set(LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS.map(({ scenarioId }) => scenarioId)).size, 7);
});

test('latent diffusion applied source is registered in the live extension resolver', () => {
  const source = ASSESSMENT_SCENARIO_EXTENSION_SOURCES.find(({ id }) => id === 'p1-latent-diffusion-pipeline-applied');
  assert.ok(source, 'missing p1-latent-diffusion-pipeline-applied scenario source');
  assert.equal(source.priority, 'P1');
  assert.equal(source.questionsByLesson, P1_LATENT_DIFFUSION_PIPELINE_APPLIED_SCENARIOS_BY_LESSON);
});

test('latent diffusion protected scenarios require evidence-based pipeline reasoning', () => {
  for (const requirement of LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS) {
    const source = scenariosById(P1_LATENT_DIFFUSION_PIPELINE_APPLIED_SCENARIOS_BY_LESSON[requirement.lessonId]);
    const scenario = source.get(requirement.scenarioId);

    assert.ok(scenario, `${requirement.lessonId} missing protected scenario ${requirement.scenarioId}`);
    assert.equal(DEPTH_LEVELS.has(scenario.level), true, `${scenario.id} should be a depth question`);
    assert.ok(scenario.scenario.length >= 180, `${scenario.id} needs sufficient pipeline evidence`);
    assert.ok(scenario.prompt.length >= 55, `${scenario.id} prompt is too shallow`);
    assert.equal(scenario.choices.length, 3, `${scenario.id} should have three choices`);
    assert.equal(new Set(scenario.choices.map(normalize)).size, 3, `${scenario.id} choices must be distinct`);
    assert.equal(scenario.answerIndex, 0, `${scenario.id} source answer should use the canonical first slot`);
    assert.ok(scenario.explanation.length >= 180, `${scenario.id} explanation should teach the derivation or diagnosis`);
    assert.ok(scenario.misconceptionTested.length >= 90, `${scenario.id} should state the misconception explicitly`);
    assert.ok(scenario.relatedComparison.length >= 20, `${scenario.id} should identify the relevant pipeline comparison`);

    if (scenario.level === 'calculation') {
      assert.match(
        `${scenario.scenario} ${scenario.prompt} ${scenario.choices.join(' ')} ${scenario.explanation}`,
        /\d/,
        `${scenario.id} calculation should contain numerical evidence`,
      );
    }
  }
});

test('latent diffusion protected scenarios survive live assessment assembly', () => {
  for (const requirement of LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(requirement.lessonId).scenarioQuestions);
    const scenario = live.get(requirement.scenarioId);
    assert.ok(scenario, `${requirement.scenarioId} missing from live ${requirement.lessonId} assessment`);
    assert.equal(DEPTH_LEVELS.has(scenario.level), true);
    assert.ok(scenario.answerIndex >= 0 && scenario.answerIndex < 3);
  }
});

test('latent diffusion depth spans compression, conditioning, transport, fusion, and transformer cost', () => {
  const combined = LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS.map(({ lessonId, scenarioId }) => {
    const source = scenariosById(P1_LATENT_DIFFUSION_PIPELINE_APPLIED_SCENARIOS_BY_LESSON[lessonId]);
    const scenario = source.get(scenarioId);
    return `${scenario.scenario} ${scenario.prompt} ${scenario.explanation}`;
  }).join(' ');

  assert.match(combined, /VAE|latent/i);
  assert.match(combined, /flow|velocity|Euler/i);
  assert.match(combined, /CLIP|EOS|cosine/i);
  assert.match(combined, /T5|padding|mask/i);
  assert.match(combined, /joint attention|cross-modal/i);
  assert.match(combined, /patch|DiT/i);
  assert.match(combined, /quadratic|score matrix|score entries/i);
});

test('latent diffusion protected scenarios use every live answer position without domination', () => {
  const counts = [0, 0, 0];

  for (const { lessonId, scenarioId } of LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS) {
    const live = scenariosById(getLessonAssessment(lessonId).scenarioQuestions);
    counts[live.get(scenarioId).answerIndex] += 1;
  }

  assert.deepEqual(counts, [2, 3, 2], `expected balanced live answer positions, got ${counts.join(',')}`);
});
