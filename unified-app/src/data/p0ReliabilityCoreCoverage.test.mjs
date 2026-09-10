import assert from 'node:assert/strict';
import test from 'node:test';

import { getAssessmentScenarioExtensionEntries } from './assessmentScenarioExtensions.js';
import { P0_PRIORITY_ASSESSMENT_LESSON_IDS } from './assessmentQualityManifest.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  P0_RELIABILITY_CORE_AUDITED_LESSON_IDS,
  P0_RELIABILITY_CORE_REQUIREMENTS,
} from './p0ReliabilityCoreCoverage.js';

const REQUIRED_COMPETENCY_IDS = Object.freeze([
  'probability-standardized-normal-reasoning',
  'probability-poisson-dispersion-diagnosis',
  'debugging-slice-first-localization',
  'debugging-online-offline-serving-boundary',
  'monitoring-concept-drift-separation',
  'monitoring-delayed-label-data-incident',
  'interpretability-correlation-predictive-not-causal',
]);

function itemsById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

test('P0 reliability lessons remain curated P0 priorities', () => {
  const p0Ids = new Set(P0_PRIORITY_ASSESSMENT_LESSON_IDS);
  for (const lessonId of P0_RELIABILITY_CORE_AUDITED_LESSON_IDS) {
    assert.ok(p0Ids.has(lessonId), `${lessonId}: lesson must remain P0 priority`);
    assert.equal(getLessonAssessment(lessonId).source, 'curated', `${lessonId}: assessment must remain curated`);
  }
});

test('P0 reliability contract keeps required competencies explicit', () => {
  assert.deepEqual(
    P0_RELIABILITY_CORE_REQUIREMENTS.map(({ id }) => id).sort(),
    [...REQUIRED_COMPETENCY_IDS].sort(),
  );
});

test('P0 reliability competencies retain live diagnostic evidence and a P0 anchor per lesson', async (t) => {
  const scenarioEntries = getAssessmentScenarioExtensionEntries();
  const priorityByScenarioId = new Map(scenarioEntries.map(({ priority, question }) => [question.id, priority]));
  const p0EvidenceByLesson = new Map(P0_RELIABILITY_CORE_AUDITED_LESSON_IDS.map((lessonId) => [lessonId, 0]));
  const evidenceIds = [];

  for (const requirement of P0_RELIABILITY_CORE_REQUIREMENTS) {
    await t.test(requirement.id, () => {
      const assessment = getLessonAssessment(requirement.lessonId);
      const quiz = itemsById(assessment.quiz);
      const scenarios = itemsById(assessment.scenarioQuestions);

      for (const quizId of requirement.quizIds) {
        assert.ok(quiz.has(quizId), `${requirement.id}: missing quiz ${quizId}`);
      }
      for (const scenarioId of requirement.scenarioIds) {
        assert.ok(scenarios.has(scenarioId), `${requirement.id}: missing scenario ${scenarioId}`);
        const priority = priorityByScenarioId.get(scenarioId);
        assert.ok(priority === 'P0' || priority === 'P1', `${scenarioId}: expected P0/P1 scenario evidence, got ${priority}`);
        if (priority === 'P0') {
          p0EvidenceByLesson.set(requirement.lessonId, p0EvidenceByLesson.get(requirement.lessonId) + 1);
        }
      }
    });
    evidenceIds.push(...requirement.quizIds, ...requirement.scenarioIds);
  }

  for (const [lessonId, p0Count] of p0EvidenceByLesson) {
    assert.ok(p0Count > 0, `${lessonId}: must retain at least one true P0 scenario anchor`);
  }
  assert.equal(new Set(evidenceIds).size, evidenceIds.length, 'evidence ids should protect one explicit competency each');
});
