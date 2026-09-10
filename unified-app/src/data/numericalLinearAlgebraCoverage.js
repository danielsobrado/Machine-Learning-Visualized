function competency(id, lessonId, quizIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
  });
}

export const NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS = Object.freeze([
  'change-of-basis',
  'condition-number',
  'determinant-volume',
  'eigenvalue',
  'least-squares-projection',
  'low-rank-approximation',
  'pseudoinverse',
  'projection-matrices',
]);

export const NUMERICAL_LINEAR_ALGEBRA_REQUIREMENTS = Object.freeze([
  competency('change-of-basis-conversion-direction', 'change-of-basis', [
    'cob-074-hidden-bug-case',
    'cob-095-operator-answer',
  ]),
  competency('change-of-basis-invertibility', 'change-of-basis', [
    'cob-081-false-dependent-basis',
    'cob-098-limitation-answer',
  ]),
  competency('conditioning-residual-vs-solution-stability', 'condition-number', [
    'cond-070-small-residual-case',
    'cond-097-residual-answer',
  ]),
  competency('conditioning-stable-solver-choice', 'condition-number', [
    'cond-062-solver-choice',
    'cond-080-false-normal-equations',
  ]),
  competency('determinant-near-singular-stability', 'determinant-volume', [
    'detv-067-near-zero-case',
    'detv-098-stability-answer',
  ]),
  competency('determinant-local-volume-change', 'determinant-volume', [
    'detv-070-flow-case',
    'detv-087-dangerous-global-nonlinear',
  ]),
  competency('eigenvalue-invariant-direction', 'eigenvalue', [
    'eig-067-debug-alignment',
    'eig-081-false-scale-factor',
  ]),
  competency('eigendecomposition-assumption-boundaries', 'eigenvalue', [
    'eig-079-false-diagonalize',
    'eig-086-dangerous-complex',
  ]),
  competency('least-squares-residual-optimality', 'least-squares-projection', [
    'lsp-058-check-answer',
    'lsp-092-derive-answer',
  ]),
  competency('least-squares-rank-and-numerical-stability', 'least-squares-projection', [
    'lsp-073-rank-caveat',
    'lsp-096-implementation-answer',
  ]),
  competency('low-rank-best-approximation-scope', 'low-rank-approximation', [
    'lra-081-false-eckart',
    'lra-090-false-best-any-norm',
  ]),
  competency('low-rank-compression-needs-task-validation', 'low-rank-approximation', [
    'lra-074-validation-case',
    'lra-086-dangerous-energy-only',
  ]),
  competency('pseudoinverse-zero-vs-tiny-singular-directions', 'pseudoinverse', [
    'pinv-054-zero-bar-case',
    'pinv-056-small-positive-case',
  ]),
  competency('pseudoinverse-least-squares-vs-minimum-norm', 'pseudoinverse', [
    'pinv-057-inconsistent-data-case',
    'pinv-058-many-solutions-case',
  ]),
  competency('projection-idempotence-vs-orthogonality', 'projection-matrices', [
    'pmat-061-check-idempotent',
    'pmat-080-wrong-orthogonal-from-idempotent',
  ]),
  competency('projection-rank-and-metric-boundaries', 'projection-matrices', [
    'pmat-068-rank-deficient-case',
    'pmat-084-false-metric-free',
  ]),
]);
