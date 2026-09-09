function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'pca',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const PCA_P1_AUDITED_LESSON_IDS = Object.freeze([
  'pca',
]);

export const PCA_P1_REQUIREMENTS = Object.freeze([
  competency(
    'pca-whitening-variance-normalization',
    ['pca-048-whitening'],
    ['pca-whitening-variance-worked'],
  ),
  competency(
    'pca-cumulative-explained-variance-selection',
    ['pca-038-cumulative-variance', 'pca-056-choose-k-threshold'],
    ['pca-explained-variance-threshold-worked'],
  ),
  competency(
    'pca-reconstruction-residual-energy',
    ['pca-039-reconstruction-error', 'pca-073-reconstruction-review'],
    ['pca-reconstruction-error-worked'],
  ),
  competency(
    'pca-feature-scale-geometry',
    ['pca-032-scale-impact', 'pca-061-standardize-example'],
    ['pca-scale-dominance-diagnosis'],
  ),
  competency(
    'pca-train-fit-leakage-boundary',
    ['pca-055-preprocessing-pipeline', 'pca-067-data-leakage'],
    ['pca-train-fit-leakage-diagnosis'],
  ),
  competency(
    'pca-component-vs-subspace-stability',
    ['pca-078-sign-trap', 'pca-087-equal-eigenvalues'],
    ['pca-near-equal-eigenspace-diagnosis'],
  ),
  competency(
    'pca-downstream-label-signal-preservation',
    ['pca-069-classification-features', 'pca-093-debug-poor-results'],
    ['pca-low-variance-label-signal-decision'],
  ),
]);
