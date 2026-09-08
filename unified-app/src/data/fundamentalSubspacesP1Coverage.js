function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'fundamental-subspaces',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const FUNDAMENTAL_SUBSPACES_P1_AUDITED_LESSON_IDS = Object.freeze([
  'fundamental-subspaces',
]);

export const FUNDAMENTAL_SUBSPACES_P1_REQUIREMENTS = Object.freeze([
  competency(
    'subspaces-rank-dimension-budget',
    ['fs-012-nullity', 'fs-013-left-nullity'],
    ['subspaces-dimension-budget-worked'],
  ),
  competency(
    'subspaces-left-null-consistency',
    ['fs-057-constraint-check', 'fs-061-network-flow'],
    ['subspaces-consistency-diagnosis-worked-scenario'],
  ),
  competency(
    'subspaces-null-family-nonidentifiability',
    ['fs-052-underdetermined', 'fs-058-rank-deficient-model'],
    ['subspaces-null-family-nonidentifiability-worked'],
  ),
  competency(
    'subspaces-least-squares-output-decomposition',
    ['fs-054-least-squares-use', 'fs-055-residual-diagnosis'],
    ['subspaces-least-squares-residual-worked'],
  ),
  competency(
    'subspaces-original-pivot-column-basis',
    ['fs-035-pivot-columns', 'fs-069-row-operations-use'],
    ['subspaces-pivot-column-basis-diagnosis'],
  ),
  competency(
    'subspaces-minimum-norm-row-space-solution',
    ['fs-059-minimum-norm', 'fs-060-pseudoinverse'],
    ['subspaces-minimum-norm-row-space-worked'],
  ),
  competency(
    'subspaces-svd-zero-direction-mapping',
    ['fs-039-svd-null-space', 'fs-040-svd-left-null'],
    ['subspaces-svd-zero-direction-diagnosis'],
  ),
]);
