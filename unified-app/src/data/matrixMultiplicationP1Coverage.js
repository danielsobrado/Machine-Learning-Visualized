function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'matrix-multiplication',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const MATRIX_MULTIPLICATION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'matrix-multiplication',
]);

export const MATRIX_MULTIPLICATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'matmul-batched-shape-and-compute',
    ['mm-053-batch-layer', 'mm-066-performance-view'],
    ['matmul-batched-linear-layer-worked'],
  ),
  competency(
    'matmul-transform-composition-order',
    ['mm-043-composition-meaning', 'mm-044-rightmost-first'],
    ['matmul-composed-transform'],
  ),
  competency(
    'matmul-chain-association-cost',
    ['mm-038-associative-rule', 'mm-081-association-cost'],
    ['matmul-chain-association-cost-worked'],
  ),
  competency(
    'matmul-batch-axis-layout',
    ['mm-049-batch-inputs', 'mm-085-batch-axis-trap'],
    ['matmul-batch-axis-layout-diagnosis'],
  ),
  competency(
    'matmul-elementwise-broadcast-operator',
    ['mm-067-broadcasting-confusion', 'mm-084-broadcasting-trap'],
    ['matmul-elementwise-broadcast-diagnosis'],
  ),
  competency(
    'matmul-transpose-product-order',
    ['mm-039-transpose-product', 'mm-080-transpose-trap'],
    ['matmul-transpose-product-order-diagnosis'],
  ),
  competency(
    'matmul-floating-reduction-precision',
    ['mm-069-numeric-precision', 'mm-096-production-caveat'],
    ['matmul-floating-reduction-order-diagnosis'],
  ),
]);
