function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'calibration',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CALIBRATION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'calibration',
]);

export const CALIBRATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'calibration-reliability-gap',
    ['cal-015-calibration-gap'],
    ['calibration-reliability-gap-worked'],
  ),
  competency(
    'calibration-frequency-weighted-ece',
    ['cal-027-ece-purpose'],
    ['calibration-ece-weighted-worked'],
  ),
  competency(
    'calibration-ranking-vs-probability-quality',
    ['cal-006-discrimination-distinction'],
    ['calibration-ranking-stable-probability-drift'],
  ),
  competency(
    'calibration-shift-recalibration',
    ['cal-067-recalibration-trigger'],
    ['calibration-shift-recalibration-decision'],
  ),
  competency(
    'calibration-method-flexibility-overfit',
    ['cal-044-nonmonotonic-risk'],
    ['calibration-isotonic-small-sample-overfit'],
  ),
  competency(
    'calibration-subgroup-reliability',
    ['cal-049-subgroup-check'],
    ['calibration-subgroup-cancellation-diagnosis'],
  ),
  competency(
    'calibration-data-role-leakage',
    ['cal-037-validation-split'],
    ['calibration-final-test-leakage-decision'],
  ),
]);
