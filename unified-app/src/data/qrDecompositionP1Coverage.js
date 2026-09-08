function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'qr-decomposition',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const QR_DECOMPOSITION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'qr-decomposition',
]);

export const QR_DECOMPOSITION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'qr-least-squares-triangular-solve',
    ['qr-029-least-squares-derivation'],
    ['qr-least-squares-worked-case'],
  ),
  competency(
    'qr-rank-revelation-pivoting',
    ['qr-035-pivoted-qr'],
    ['qr-pivoted-rank-revelation-diagnosis'],
  ),
  competency(
    'qr-orthogonality-floating-point-stability',
    ['qr-043-orthogonality-check'],
    ['qr-orthogonality-loss-diagnosis'],
  ),
  competency(
    'qr-normal-equation-conditioning',
    ['qr-037-condition-link'],
    ['qr-normal-equation-conditioning-worked'],
  ),
  competency(
    'qr-least-squares-residual-optimality',
    ['qr-030-residual-orthogonal'],
    ['qr-residual-optimality-diagnosis'],
  ),
  competency(
    'qr-reduced-factor-storage',
    ['qr-032-reduced-vs-full'],
    ['qr-reduced-storage-worked'],
  ),
  competency(
    'qr-factor-reuse-many-right-sides',
    ['qr-047-multiple-right-sides'],
    ['qr-factor-reuse-decision'],
  ),
]);
