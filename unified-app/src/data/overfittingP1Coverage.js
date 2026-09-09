function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'overfitting',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const OVERFITTING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'overfitting',
]);

export const OVERFITTING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'overfit-train-validation-divergence',
    ['overfit-001-core-signal'],
    ['overfit-validation-divergence-checkpoint-worked'],
  ),
  competency(
    'overfit-early-stopping-patience',
    ['overfit-049-early-stop-patience'],
    ['overfit-early-stopping-patience-decision'],
  ),
  competency(
    'overfit-adaptive-validation-reuse',
    ['overfit-031-validation-overfit'],
    ['overfit-model-selection-reuse-worked'],
  ),
  competency(
    'overfit-final-untouched-test',
    ['overfit-019-final-test'],
    ['overfit-final-untouched-test'],
  ),
  competency(
    'overfit-near-duplicate-split-contamination',
    ['overfit-017-duplicate-risk'],
    ['overfit-near-duplicate-split-contamination'],
  ),
  competency(
    'overfit-learning-curve-data-benefit',
    ['overfit-030-learning-curve'],
    ['overfit-learning-curve-more-data-decision'],
  ),
  competency(
    'overfit-validation-score-uncertainty',
    ['overfit-046-uncertainty'],
    ['overfit-small-validation-win-uncertainty'],
  ),
]);
