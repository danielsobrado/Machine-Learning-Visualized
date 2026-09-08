function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'svd',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const SVD_P1_AUDITED_LESSON_IDS = Object.freeze([
  'svd',
]);

export const SVD_P1_REQUIREMENTS = Object.freeze([
  competency(
    'svd-energy-rank-selection',
    ['svd-036-energy-ratio', 'svd-057-scenario-energy'],
    ['svd-energy-rank-selection-worked-case'],
  ),
  competency(
    'svd-spectral-vs-frobenius-error',
    ['svd-034-spectral-error', 'svd-035-frobenius-error'],
    ['svd-error-norms-worked'],
  ),
  competency(
    'svd-pseudoinverse-regularization',
    ['svd-038-pseudoinverse-form', 'svd-040-regularization'],
    ['svd-pseudoinverse-cutoff-diagnosis'],
  ),
  competency(
    'svd-condition-number-sensitivity',
    ['svd-041-condition-number', 'svd-063-scenario-condition'],
    ['svd-condition-number-worked'],
  ),
  competency(
    'svd-numerical-rank-tolerance',
    ['svd-039-tolerance', 'svd-052-scenario-rank'],
    ['svd-rank-tolerance-diagnosis'],
  ),
  competency(
    'svd-economy-factor-storage',
    ['svd-027-economy-shapes', 'svd-045-low-rank-storage'],
    ['svd-economy-storage-worked'],
  ),
  competency(
    'svd-scalable-leading-components',
    ['svd-046-randomized-svd', 'svd-050-cost-tradeoff'],
    ['svd-randomized-topk-decision'],
  ),
]);
