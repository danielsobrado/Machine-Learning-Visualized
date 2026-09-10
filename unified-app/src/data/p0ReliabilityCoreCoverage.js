function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const P0_RELIABILITY_CORE_AUDITED_LESSON_IDS = Object.freeze([
  'probability-distributions',
  'model-debugging',
  'model-monitoring',
  'model-interpretability',
]);

export const P0_RELIABILITY_CORE_REQUIREMENTS = Object.freeze([
  competency(
    'probability-standardized-normal-reasoning',
    'probability-distributions',
    ['prob-035-normal-z', 'prob-036-normal-68', 'prob-037-normal-95'],
    ['prob-visual-normal-spread'],
  ),
  competency(
    'probability-poisson-dispersion-diagnosis',
    'probability-distributions',
    ['prob-033-poisson-mean-var', 'prob-052-count-model'],
    ['prob-visual-poisson-dispersion'],
  ),
  competency(
    'debugging-slice-first-localization',
    'model-debugging',
    ['dbg-008-slice-basic', 'dbg-021-checklist-flow', 'dbg-049-fix-scope'],
    ['debugging-slice-first'],
  ),
  competency(
    'debugging-online-offline-serving-boundary',
    'model-debugging',
    ['dbg-002-production-first-check', 'dbg-007-serving-stage', 'dbg-044-serving-contract'],
    ['debugging-online-offline-divergence'],
  ),
  competency(
    'monitoring-concept-drift-separation',
    'model-monitoring',
    ['mon-005-concept-drift', 'mon-025-drift-performance', 'mon-027-concept-drift-mechanism'],
    ['monitoring-drift-types'],
  ),
  competency(
    'monitoring-delayed-label-data-incident',
    'model-monitoring',
    ['mon-045-data-quality', 'mon-049-feedback-labels'],
    ['monitoring-delayed-label-incident-triage'],
  ),
  competency(
    'interpretability-correlation-predictive-not-causal',
    'model-interpretability',
    ['interp-017-correlation-caveat', 'interp-039-descriptive-not-causal', 'interp-046-global-ablation-risk'],
    ['interpretability-correlated-features', 'interpretability-grouped-correlation-worked'],
  ),
]);
