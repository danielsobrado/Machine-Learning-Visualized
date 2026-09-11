export const ASSESSMENT_SEMANTIC_PROTECTION = Object.freeze({
  COMPETENCY_PROTECTED: 'COMPETENCY_PROTECTED',
  TOPIC_TEST_PROTECTED: 'TOPIC_TEST_PROTECTED',
  LEGACY_COVERAGE_PROTECTED: 'LEGACY_COVERAGE_PROTECTED',
  STRUCTURE_ONLY: 'STRUCTURE_ONLY',
  INTENTIONALLY_NON_PRIORITY: 'INTENTIONALLY_NON_PRIORITY',
  LEGACY_OR_INCOMPLETE: 'LEGACY_OR_INCOMPLETE',
});

const SEMANTICALLY_PROTECTED = new Set([
  ASSESSMENT_SEMANTIC_PROTECTION.COMPETENCY_PROTECTED,
  ASSESSMENT_SEMANTIC_PROTECTION.TOPIC_TEST_PROTECTED,
  ASSESSMENT_SEMANTIC_PROTECTION.LEGACY_COVERAGE_PROTECTED,
]);

function contains(values, lessonId) {
  return values instanceof Set ? values.has(lessonId) : (values || []).includes(lessonId);
}

export function isSemanticallyProtectedClassification(classification) {
  return SEMANTICALLY_PROTECTED.has(classification);
}

export function classifyAssessmentSemanticProtection({
  lessonId,
  source,
  priorityLessonIds,
  competencyLessonIds,
  topicTestLessonIds,
  legacyCoverageLessonIds,
}) {
  if (contains(competencyLessonIds, lessonId)) {
    return ASSESSMENT_SEMANTIC_PROTECTION.COMPETENCY_PROTECTED;
  }
  if (contains(topicTestLessonIds, lessonId)) {
    return ASSESSMENT_SEMANTIC_PROTECTION.TOPIC_TEST_PROTECTED;
  }
  if (contains(legacyCoverageLessonIds, lessonId)) {
    return ASSESSMENT_SEMANTIC_PROTECTION.LEGACY_COVERAGE_PROTECTED;
  }
  if (source === 'curated' && contains(priorityLessonIds, lessonId)) {
    return ASSESSMENT_SEMANTIC_PROTECTION.STRUCTURE_ONLY;
  }
  if (source === 'curated') {
    return ASSESSMENT_SEMANTIC_PROTECTION.INTENTIONALLY_NON_PRIORITY;
  }
  return ASSESSMENT_SEMANTIC_PROTECTION.LEGACY_OR_INCOMPLETE;
}

export function validateAssessmentSemanticCoverage(records) {
  const errors = [];

  for (const record of records) {
    if (record.priority && !isSemanticallyProtectedClassification(record.classification)) {
      errors.push(
        `${record.lessonId}: priority assessment lacks semantic protection (${record.classification})`,
      );
    }
  }

  return errors;
}
