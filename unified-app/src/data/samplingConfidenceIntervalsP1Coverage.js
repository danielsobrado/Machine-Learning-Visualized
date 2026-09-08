function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'sampling-confidence-intervals',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const SAMPLING_CONFIDENCE_INTERVALS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'sampling-confidence-intervals',
]);

export const SAMPLING_CONFIDENCE_INTERVALS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'ci-mean-t-interval-arithmetic',
    ['ci-021-mean-se', 'ci-025-t-degrees'],
    ['ci-mean-t-interval-worked'],
  ),
  competency(
    'ci-proportion-boundary-method-choice',
    ['ci-027-wald-risk', 'ci-028-wilson'],
    ['ci-wald-boundary-diagnosis'],
  ),
  competency(
    'ci-clustered-independence-unit',
    ['ci-041-clustering', 'ci-042-design-effect'],
    ['ci-clustered-sampling-unit-decision'],
  ),
  competency(
    'ci-bootstrap-skewed-estimator',
    ['ci-029-bootstrap-purpose', 'ci-032-bootstrap-limits'],
    ['ci-bootstrap-skewed-statistic'],
  ),
  competency(
    'ci-paired-difference-analysis',
    ['ci-040-paired-data', 'ci-061-scenario-paired'],
    ['ci-paired-difference-worked'],
  ),
  competency(
    'ci-direct-contrast-interval',
    ['ci-038-overlap-warning', 'ci-039-difference-interval'],
    ['ci-direct-difference-interval-worked'],
  ),
  competency(
    'ci-one-sided-decision-bound',
    ['ci-045-one-sided', 'ci-072-scenario-sla'],
    ['ci-one-sided-sla-bound-worked'],
  ),
  competency(
    'ci-familywise-multiple-interval-coverage',
    ['ci-046-multiple-intervals', 'ci-066-scenario-many-segments'],
    ['ci-familywise-coverage-worked'],
  ),
]);
