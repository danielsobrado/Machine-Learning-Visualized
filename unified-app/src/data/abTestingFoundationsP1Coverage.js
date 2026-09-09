function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'ab-testing-foundations',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const AB_TESTING_FOUNDATIONS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'ab-testing-foundations',
]);

export const AB_TESTING_FOUNDATIONS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'ab-srm-quantitative-diagnosis',
    ['ab-023-srm', 'ab-052-scenario-srm'],
    ['ab-srm-chi-square-worked'],
  ),
  competency(
    'ab-proportion-effect-confidence-interval',
    ['ab-013-confidence-interval', 'ab-055-scenario-noisy'],
    ['ab-proportion-ci-worked'],
  ),
  competency(
    'ab-practical-threshold-vs-zero-null',
    ['ab-014-practical-significance', 'ab-054-lift-threshold'],
    ['ab-practical-threshold-ci-decision'],
  ),
  competency(
    'ab-post-treatment-trigger-selection',
    ['ab-026-triggered', 'ab-063-scenario-triggered'],
    ['ab-trigger-post-treatment-selection'],
  ),
  competency(
    'ab-cluster-randomization-effective-sample',
    ['ab-029-cluster-randomization', 'ab-062-scenario-cluster'],
    ['ab-cluster-design-effect-worked'],
  ),
  competency(
    'ab-confirmatory-multiplicity-control',
    ['ab-042-multiple-metrics', 'ab-058-scenario-many-metrics'],
    ['ab-confirmatory-bonferroni-worked'],
  ),
  competency(
    'ab-interference-aware-randomization-design',
    ['ab-028-interference', 'ab-061-scenario-interference'],
    ['ab-marketplace-interference-design'],
  ),
  competency(
    'ab-time-varying-novelty-effect',
    ['ab-039-novelty', 'ab-066-scenario-novelty'],
    ['ab-novelty-effect-visual-state'],
  ),
]);
