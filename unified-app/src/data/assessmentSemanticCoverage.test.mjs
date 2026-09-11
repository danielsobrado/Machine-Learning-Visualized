import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ASSESSMENT_SEMANTIC_PROTECTION,
  classifyAssessmentSemanticProtection,
  isSemanticallyProtectedClassification,
  validateAssessmentSemanticCoverage,
} from './assessmentSemanticCoverage.js';
import {
  buildAssessmentSemanticCoverageInventory,
  formatAssessmentSemanticCoverageJson,
  formatAssessmentSemanticCoverageMarkdown,
} from '../../scripts/audit-assessment-semantic-coverage.mjs';

const baseInput = Object.freeze({
  lessonId: 'lesson-a',
  source: 'curated',
  priorityLessonIds: new Set(['lesson-a']),
  competencyLessonIds: new Set(),
  topicTestLessonIds: new Set(),
  legacyCoverageLessonIds: new Set(),
  intentionallyNonPriorityLessonIds: new Set(),
});

function classify(overrides = {}) {
  return classifyAssessmentSemanticProtection({ ...baseInput, ...overrides });
}

test('semantic coverage classification has deterministic precedence', () => {
  assert.equal(
    classify({ competencyLessonIds: new Set(['lesson-a']), topicTestLessonIds: new Set(['lesson-a']) }),
    ASSESSMENT_SEMANTIC_PROTECTION.COMPETENCY_PROTECTED,
  );
  assert.equal(
    classify({ topicTestLessonIds: new Set(['lesson-a']), legacyCoverageLessonIds: new Set(['lesson-a']) }),
    ASSESSMENT_SEMANTIC_PROTECTION.TOPIC_TEST_PROTECTED,
  );
  assert.equal(
    classify({ legacyCoverageLessonIds: new Set(['lesson-a']) }),
    ASSESSMENT_SEMANTIC_PROTECTION.LEGACY_COVERAGE_PROTECTED,
  );
  assert.equal(
    classify({ intentionallyNonPriorityLessonIds: new Set(['lesson-a']) }),
    ASSESSMENT_SEMANTIC_PROTECTION.INTENTIONALLY_NON_PRIORITY,
  );
  assert.equal(classify(), ASSESSMENT_SEMANTIC_PROTECTION.STRUCTURE_ONLY);
  assert.equal(
    classify({ priorityLessonIds: new Set() }),
    ASSESSMENT_SEMANTIC_PROTECTION.STRUCTURE_ONLY,
  );
  assert.equal(
    classify({ source: 'fallback', priorityLessonIds: new Set() }),
    ASSESSMENT_SEMANTIC_PROTECTION.LEGACY_OR_INCOMPLETE,
  );
});

test('semantic coverage validation rejects priority structural-only regressions', () => {
  const errors = validateAssessmentSemanticCoverage([
    { lessonId: 'protected', priority: true, classification: ASSESSMENT_SEMANTIC_PROTECTION.COMPETENCY_PROTECTED },
    { lessonId: 'missing', priority: true, classification: ASSESSMENT_SEMANTIC_PROTECTION.STRUCTURE_ONLY },
  ]);

  assert.deepEqual(errors, ['missing: priority assessment lacks semantic protection (STRUCTURE_ONLY)']);
});

test('repository semantic coverage inventory protects every priority lesson', async () => {
  const report = await buildAssessmentSemanticCoverageInventory();
  const errors = validateAssessmentSemanticCoverage(report.records);

  assert.deepEqual(errors, []);
  assert.deepEqual(report.priorityGaps, []);
  assert.ok(report.dedicatedAssessmentModuleFiles.length > 0);

  const dedicatedRecords = report.records.filter(({ dedicated }) => dedicated);
  assert.ok(dedicatedRecords.length > 0);
  assert.ok(dedicatedRecords.every(({ classification }) => typeof classification === 'string'));
  assert.ok(
    report.records
      .filter(({ priority }) => priority)
      .every(({ classification }) => isSemanticallyProtectedClassification(classification)),
  );
});

test('semantic coverage inventory emits deterministic markdown and JSON summaries', async () => {
  const report = await buildAssessmentSemanticCoverageInventory();
  const markdown = formatAssessmentSemanticCoverageMarkdown(report);
  const json = formatAssessmentSemanticCoverageJson(report);

  assert.match(markdown, /^# Assessment semantic coverage/m);
  assert.match(markdown, /## Priority coverage/);
  assert.deepEqual(JSON.parse(json), report);
});
