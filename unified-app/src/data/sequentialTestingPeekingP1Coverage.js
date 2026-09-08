function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'sequential-testing-peeking',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const SEQUENTIAL_TESTING_PEEKING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'sequential-testing-peeking',
]);

export const SEQUENTIAL_TESTING_PEEKING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'sequential-peeking-any-look-error',
    ['seq-022-any-look-formula', 'seq-023-five-percent'],
    ['sequential-naive-peeking-any-look-worked'],
  ),
  competency(
    'sequential-alpha-spending-boundaries',
    ['seq-028-spending-function', 'seq-029-obrien-fleming-boundary'],
    ['sequential-three-look-boundary-worked'],
  ),
  competency(
    'sequential-design-sample-tradeoffs',
    ['seq-033-expected-sample', 'seq-034-max-sample'],
    ['sequential-monitoring-design-choice'],
  ),
  competency(
    'sequential-futility-conditional-power',
    ['seq-035-futility-nonbinding', 'seq-036-conditional-power'],
    ['sequential-futility-conditional-power-decision'],
  ),
  competency(
    'sequential-early-stop-estimation',
    ['seq-037-estimation-after-stop', 'seq-039-confidence-interval'],
    ['sequential-early-stop-estimate-bias-diagnosis'],
  ),
  competency(
    'sequential-metric-monitoring-multiplicity',
    ['seq-040-multiple-metrics', 'seq-041-subgroups'],
    ['sequential-multi-metric-peeking-diagnosis'],
  ),
  competency(
    'sequential-efficacy-guardrail-policy',
    ['seq-042-guardrail-harm', 'seq-043-operational-alerts'],
    ['sequential-efficacy-vs-guardrail-decision'],
  ),
]);
