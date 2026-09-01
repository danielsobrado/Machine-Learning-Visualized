function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({ id, lessonId, scenarioIds: Object.freeze(scenarioIds) });
}

export const LINEAR_ALGEBRA_AUDITED_LESSON_IDS = Object.freeze([
  'matrix-multiplication',
  'pca',
  'fundamental-subspaces',
  'matrix-decompositions',
  'qr-decomposition',
  'svd',
]);

export const LINEAR_ALGEBRA_COVERAGE = Object.freeze({
  'matrix-multiplication': requirement(['matmul-batched-linear-layer-worked']),
  pca: requirement(['pca-whitening-variance-worked']),
  'fundamental-subspaces': requirement(['subspaces-consistency-diagnosis-worked-scenario']),
  'matrix-decompositions': requirement(['decomp-structure-cost-decision']),
  'qr-decomposition': requirement(['qr-least-squares-worked-case']),
  svd: requirement(['svd-energy-rank-selection-worked-case']),
});

export const LINEAR_ALGEBRA_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('batched-matrix-shape-and-compute-calculation', 'matrix-multiplication', ['matmul-batched-linear-layer-worked']),
  depthRequirement('pca-whitening-variance-calculation', 'pca', ['pca-whitening-variance-worked']),
  depthRequirement('left-null-space-consistency-diagnosis', 'fundamental-subspaces', ['subspaces-consistency-diagnosis-worked-scenario']),
  depthRequirement('decomposition-structure-cost-decision', 'matrix-decompositions', ['decomp-structure-cost-decision']),
  depthRequirement('qr-least-squares-back-substitution-calculation', 'qr-decomposition', ['qr-least-squares-worked-case']),
  depthRequirement('svd-energy-rank-selection-calculation', 'svd', ['svd-energy-rank-selection-worked-case']),
]);
