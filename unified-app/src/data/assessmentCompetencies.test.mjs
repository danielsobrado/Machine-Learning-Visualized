import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ASSESSMENT_COMPETENCY_EVIDENCE_TYPES,
  defineAssessmentCompetency,
  defineScenarioCompetenciesFromRequirements,
  quizEvidence,
  scenarioEvidence,
  validateAssessmentCompetencyEvidence,
  validateAssessmentCompetencyRegistry,
} from './assessmentCompetencies.js';
import {
  ASSESSMENT_COMPETENCIES,
  ASSESSMENT_COMPETENCY_AUDITED_LESSON_IDS,
  ASSESSMENT_COMPETENCY_SOURCES,
} from './assessmentCompetencyRegistry.js';
import { getLessonAssessment } from './lessonAssessments.js';

test('assessment competency sources have stable unique ids', () => {
  const sourceIds = ASSESSMENT_COMPETENCY_SOURCES.map(({ id }) => id);
  assert.equal(new Set(sourceIds).size, sourceIds.length);
});

test('global assessment competency registry is valid', () => {
  assert.deepEqual(
    validateAssessmentCompetencyRegistry({
      auditedLessonIds: ASSESSMENT_COMPETENCY_AUDITED_LESSON_IDS,
      competencies: ASSESSMENT_COMPETENCIES,
    }),
    [],
  );
});

test('all registered competency evidence resolves in the public assessment registry', () => {
  assert.deepEqual(
    validateAssessmentCompetencyEvidence({
      competencies: ASSESSMENT_COMPETENCIES,
      getAssessment: getLessonAssessment,
    }),
    [],
  );
});

test('competency evidence supports quiz and scenario references', () => {
  const evidenceTypes = new Set(
    ASSESSMENT_COMPETENCIES.flatMap(({ evidence }) => evidence.map(({ type }) => type)),
  );

  assert.ok(evidenceTypes.has(ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.QUIZ));
  assert.ok(evidenceTypes.has(ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.SCENARIO));
});

test('scenario competency adapter supports flat and nested legacy requirements', () => {
  const competencies = defineScenarioCompetenciesFromRequirements([
    {
      id: 'flat-depth',
      lessonId: 'flat-lesson',
      scenarioIds: ['flat-scenario'],
    },
    {
      lessonId: 'nested-lesson',
      competencies: [
        { competency: 'nested-depth-a', scenarioId: 'nested-scenario-a' },
        { competency: 'nested-depth-b', scenarioId: 'nested-scenario-b' },
      ],
    },
  ], { idPrefix: 'migrated.' });

  assert.deepEqual(
    competencies.map(({ id, lessonId, evidence }) => ({ id, lessonId, evidence })),
    [
      {
        id: 'migrated.flat-depth',
        lessonId: 'flat-lesson',
        evidence: [{ type: 'scenario', id: 'flat-scenario' }],
      },
      {
        id: 'migrated.nested-depth-a',
        lessonId: 'nested-lesson',
        evidence: [{ type: 'scenario', id: 'nested-scenario-a' }],
      },
      {
        id: 'migrated.nested-depth-b',
        lessonId: 'nested-lesson',
        evidence: [{ type: 'scenario', id: 'nested-scenario-b' }],
      },
    ],
  );
});

test('generic validator rejects malformed semantic contracts', () => {
  const malformed = [
    defineAssessmentCompetency({
      id: 'duplicate-id',
      lessonId: 'lesson-a',
      evidence: [quizEvidence('q-1')],
    }),
    defineAssessmentCompetency({
      id: 'duplicate-id',
      lessonId: 'lesson-b',
      evidence: [scenarioEvidence('scenario-1')],
    }),
  ];

  const errors = validateAssessmentCompetencyRegistry({
    auditedLessonIds: ['lesson-a', 'lesson-b'],
    competencies: malformed,
  });

  assert.ok(errors.some((error) => error.includes('competency ids must be globally unique')));
});
