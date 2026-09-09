function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'hypothesis-testing-intuition',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const HYPOTHESIS_TESTING_INTUITION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'hypothesis-testing-intuition',
]);

export const HYPOTHESIS_TESTING_INTUITION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'hypothesis-standardized-test-statistic',
    ['ht-007-test-statistic', 'ht-021-statistic-formula'],
    ['hypothesis-z-statistic-decision-worked'],
  ),
  competency(
    'hypothesis-direction-precommitment',
    ['ht-018-one-two-sided', 'ht-042-direction-choice'],
    ['hypothesis-one-vs-two-sided'],
  ),
  competency(
    'hypothesis-familywise-error-inflation',
    ['ht-037-multiple-tests', 'ht-084-trap-multiple'],
    ['hypothesis-familywise-error-worked'],
  ),
  competency(
    'hypothesis-fdr-vs-fwer-objective',
    ['ht-038-adjustment', 'ht-060-scenario-multiple'],
    ['hypothesis-fdr-vs-fwer-decision'],
  ),
  competency(
    'hypothesis-clustered-inference-unit',
    ['ht-048-test-family', 'ht-068-scenario-assumptions'],
    ['hypothesis-clustered-unit-diagnosis'],
  ),
  competency(
    'hypothesis-statistical-vs-practical-threshold',
    ['ht-041-practical-threshold', 'ht-064-scenario-practical-threshold'],
    ['hypothesis-practical-threshold-decision'],
  ),
  competency(
    'hypothesis-low-power-nonrejection',
    ['ht-044-low-power', 'ht-071-scenario-fail-reject'],
    ['hypothesis-low-power-nonrejection-diagnosis'],
  ),
]);
