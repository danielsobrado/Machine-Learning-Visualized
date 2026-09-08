function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'feature-scaling-preprocessing',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const FEATURE_SCALING_PREPROCESSING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'feature-scaling-preprocessing',
]);

export const FEATURE_SCALING_PREPROCESSING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'scaling-evaluation-boundary-leakage',
    ['scale-006-train-only-fit', 'scale-035-cv-pipeline'],
    ['scaling-train-only-fit-leakage-diagnosis'],
  ),
  competency(
    'scaling-robust-outlier-geometry',
    ['scale-004-robust', 'scale-013-minmax-outlier'],
    ['scaling-robust-outliers'],
  ),
  competency(
    'scaling-model-family-sensitivity',
    ['scale-009-distance', 'scale-019-tree-models'],
    ['scaling-model-family'],
  ),
  competency(
    'scaling-skew-transform-domain',
    ['scale-027-log-transform', 'scale-059-scenario-log'],
    ['scaling-skew-transform-decision'],
  ),
  competency(
    'scaling-sparse-centering-memory',
    ['scale-028-sparse-centering', 'scale-057-scenario-sparse'],
    ['scaling-sparse-centering-memory-worked'],
  ),
  competency(
    'scaling-regularization-penalty-geometry',
    ['scale-011-regularization', 'scale-038-penalty-geometry'],
    ['scaling-regularization-penalty-geometry-worked'],
  ),
  competency(
    'scaling-train-serve-state-parity',
    ['scale-034-train-serving', 'scale-047-online-learning'],
    ['scaling-train-serve-state-parity-diagnosis'],
  ),
]);
