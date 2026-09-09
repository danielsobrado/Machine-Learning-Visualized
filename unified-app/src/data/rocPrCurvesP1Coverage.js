function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'roc-pr-curves',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const ROC_PR_CURVES_P1_AUDITED_LESSON_IDS = Object.freeze([
  'roc-pr-curves',
]);

export const ROC_PR_CURVES_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rocpr-rare-positive-precision-burden',
    ['rocpr-030-rare-roc-risk'],
    ['roc-pr-rare-positive-worked'],
  ),
  competency(
    'rocpr-operating-region-vs-global-auc',
    ['rocpr-033-auc-limits'],
    ['roc-pr-threshold-operating-point'],
  ),
  competency(
    'rocpr-prevalence-sensitive-precision',
    ['rocpr-018-baseline'],
    ['rocpr-prevalence-shift-precision-worked'],
  ),
  competency(
    'rocpr-ranking-vs-calibration',
    ['rocpr-037-calibration'],
    ['rocpr-ranking-calibration-separation-diagnosis'],
  ),
  competency(
    'rocpr-low-fpr-constrained-selection',
    ['rocpr-034-partial-region'],
    ['rocpr-low-fpr-region-model-selection'],
  ),
  competency(
    'rocpr-crossing-curves-decision-context',
    ['rocpr-041-crossing-curves'],
    ['rocpr-crossing-curves-operating-decision'],
  ),
  competency(
    'rocpr-small-slice-sampling-uncertainty',
    ['rocpr-044-confidence'],
    ['rocpr-small-slice-uncertainty-decision'],
  ),
]);
