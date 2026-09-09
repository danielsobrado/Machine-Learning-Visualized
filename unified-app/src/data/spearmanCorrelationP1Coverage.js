function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'spearman-correlation',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const SPEARMAN_CORRELATION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'spearman-correlation',
]);

export const SPEARMAN_CORRELATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'spearman-tied-rank-calculation',
    ['sp-031-tied-ranks'],
    ['spearman-tied-ranks-worked'],
  ),
  competency(
    'spearman-nonmonotonic-dependence-limit',
    ['sp-027-nonmonotonic'],
    ['spearman-u-shape-dependence-diagnosis'],
  ),
  competency(
    'spearman-monotonic-transform-invariance',
    ['sp-041-monotonic-transform'],
    ['spearman-monotonic-transform-invariance'],
  ),
  competency(
    'spearman-outlier-rank-order-sensitivity',
    ['sp-030-outlier-order'],
    ['spearman-outlier-order-vs-magnitude'],
  ),
  competency(
    'spearman-finite-sample-uncertainty',
    ['sp-036-confidence'],
    ['spearman-small-sample-uncertainty-decision'],
  ),
  competency(
    'spearman-paired-missing-data',
    ['sp-037-missing'],
    ['spearman-paired-missing-data-design'],
  ),
]);
