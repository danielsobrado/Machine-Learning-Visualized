function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'matrix-decompositions',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const MATRIX_DECOMPOSITIONS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'matrix-decompositions',
]);

export const MATRIX_DECOMPOSITIONS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'decomp-specialized-structure-cost-choice',
    ['md-050-cost-vs-robustness', 'md-069-scenario-speed'],
    ['decomp-structure-cost-decision'],
  ),
  competency(
    'decomp-lu-pivoting-correctness',
    ['md-005-pivoting', 'md-082-pivot-trap'],
    ['decomp-lu-pivoting-worked'],
  ),
  competency(
    'decomp-cholesky-spd-validation',
    ['md-066-scenario-positive-definite-check', 'md-077-cholesky-trap'],
    ['decomp-cholesky-indefinite-diagnosis'],
  ),
  competency(
    'decomp-normal-equations-conditioning',
    ['md-067-scenario-normal-equation-risk', 'md-079-normal-equation-trap'],
    ['decomp-normal-equations-conditioning-worked'],
  ),
  competency(
    'decomp-svd-numerical-rank-policy',
    ['md-039-conditioning', 'md-068-scenario-small-singular'],
    ['decomp-svd-tolerance-rank-worked'],
  ),
  competency(
    'decomp-defective-eigenbasis-failure',
    ['md-029-eigen-risk', 'md-083-diagonalizable-trap'],
    ['decomp-defective-eigenbasis-diagnosis'],
  ),
  competency(
    'decomp-nmf-multistart-stability',
    ['md-036-nmf-nonconvex', 'md-087-nmf-unique-trap'],
    ['decomp-nmf-multistart-stability-design'],
  ),
]);
