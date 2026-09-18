export const ASSESSMENT_COVERAGE_DIMENSION = Object.freeze({
  FOUNDATION: 'foundation',
  MECHANISM: 'mechanism',
  APPLIED: 'applied',
  CALCULATION: 'calculation',
  DECISION: 'decision',
  DIAGNOSIS: 'diagnosis',
  TRADEOFF: 'tradeoff',
  BOUNDARY: 'boundary',
  VISUAL: 'visual',
});

const SCENARIO_LEVEL_DIMENSIONS = Object.freeze({
  calculation: ASSESSMENT_COVERAGE_DIMENSION.CALCULATION,
  decision: ASSESSMENT_COVERAGE_DIMENSION.DECISION,
  design: ASSESSMENT_COVERAGE_DIMENSION.DECISION,
  diagnosis: ASSESSMENT_COVERAGE_DIMENSION.DIAGNOSIS,
  comparison: ASSESSMENT_COVERAGE_DIMENSION.TRADEOFF,
  mechanism: ASSESSMENT_COVERAGE_DIMENSION.MECHANISM,
});

export const REVIEW_DEPTH_REQUIRED_DIMENSIONS = Object.freeze([
  ASSESSMENT_COVERAGE_DIMENSION.APPLIED,
  ASSESSMENT_COVERAGE_DIMENSION.TRADEOFF,
  ASSESSMENT_COVERAGE_DIMENSION.BOUNDARY,
]);

export function assessmentCoverageDimensions(assessment) {
  const dimensions = new Set();
  const quiz = assessment?.quiz || [];
  const scenarios = assessment?.scenarioQuestions || [];

  if (quiz.some(({ level, skill }) => level === 'Foundation' || skill === 'recall')) {
    dimensions.add(ASSESSMENT_COVERAGE_DIMENSION.FOUNDATION);
  }
  if (quiz.some(({ level, skill }) => level === 'Mechanism' || skill === 'mechanism')) {
    dimensions.add(ASSESSMENT_COVERAGE_DIMENSION.MECHANISM);
  }

  for (const item of scenarios) {
    dimensions.add(ASSESSMENT_COVERAGE_DIMENSION.APPLIED);

    const levelDimension = SCENARIO_LEVEL_DIMENSIONS[item.level];
    if (levelDimension) dimensions.add(levelDimension);
    if (item.relatedComparison) dimensions.add(ASSESSMENT_COVERAGE_DIMENSION.TRADEOFF);
    if (item.misconceptionTested) dimensions.add(ASSESSMENT_COVERAGE_DIMENSION.BOUNDARY);
    if (item.kind === 'visual-state' || item.visualState) dimensions.add(ASSESSMENT_COVERAGE_DIMENSION.VISUAL);
  }

  return Object.freeze([...dimensions].sort());
}

export function validateAssessmentCoverageDimensions({
  lessonIds,
  getAssessment,
  requiredDimensions = REVIEW_DEPTH_REQUIRED_DIMENSIONS,
}) {
  const errors = [];

  for (const lessonId of lessonIds) {
    const dimensions = new Set(assessmentCoverageDimensions(getAssessment(lessonId)));
    const missing = requiredDimensions.filter((dimension) => !dimensions.has(dimension));
    if (missing.length > 0) {
      errors.push(`${lessonId}: missing assessment coverage dimensions: ${missing.join(', ')}`);
    }
  }

  return errors;
}
