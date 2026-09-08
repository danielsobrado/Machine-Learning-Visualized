function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'test-time-compute-thinking-budgets',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TEST_TIME_COMPUTE_THINKING_BUDGETS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'test-time-compute-thinking-budgets',
]);

export const TEST_TIME_COMPUTE_THINKING_BUDGETS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'ttc-marginal-cost-quality-frontier',
    ['ttc-022', 'ttc-061'],
    ['ttc-marginal-budget-value'],
  ),
  competency(
    'ttc-parallel-batching-vs-total-compute',
    ['ttc-007', 'ttc-024'],
    ['ttc-best-of-n-total-compute-worked'],
  ),
  competency(
    'ttc-adaptive-budget-workload-economics',
    ['ttc-031', 'ttc-065'],
    ['ttc-adaptive-routing-expected-cost-worked'],
  ),
  competency(
    'ttc-hard-cap-routing-and-escalation',
    ['ttc-028', 'ttc-073'],
    ['ttc-hard-cap-misrouting-diagnosis'],
  ),
  competency(
    'ttc-verifier-selection-quality',
    ['ttc-023', 'ttc-054'],
    ['ttc-verifier-selection-gap-diagnosis'],
  ),
  competency(
    'ttc-prm-guided-search-pruning',
    ['ttc-027', 'ttc-064'],
    ['ttc-prm-pruning-failure-diagnosis'],
  ),
  competency(
    'ttc-tail-latency-sla-design',
    ['ttc-034', 'ttc-060'],
    ['ttc-tail-latency-budget-decision'],
  ),
]);
