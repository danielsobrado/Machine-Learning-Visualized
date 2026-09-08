function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'bayes-rule-ml',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const BAYES_RULE_ML_P1_AUDITED_LESSON_IDS = Object.freeze([
  'bayes-rule-ml',
]);

export const BAYES_RULE_ML_P1_REQUIREMENTS = Object.freeze([
  competency(
    'bayes-base-rate-posterior',
    ['bayes-010-rare-class', 'bayes-023-false-positive-mass'],
    ['bayes-base-rate-worked'],
  ),
  competency(
    'bayes-odds-likelihood-ratio-update',
    ['bayes-024-likelihood-ratio', 'bayes-025-odds-update'],
    ['bayes-odds-likelihood-ratio-worked'],
  ),
  competency(
    'bayes-negative-evidence-update',
    ['bayes-047-negative-update', 'bayes-061-scenario-negative'],
    ['bayes-negative-evidence-worked'],
  ),
  competency(
    'bayes-prior-shift-posterior-mapping',
    ['bayes-026-prior-shift', 'bayes-041-prior-shift-deploy'],
    ['bayes-prior-shift-recalibration-diagnosis'],
  ),
  competency(
    'bayes-cost-sensitive-action-threshold',
    ['bayes-042-threshold', 'bayes-043-costs'],
    ['bayes-cost-sensitive-threshold-worked'],
  ),
  competency(
    'bayes-dependent-evidence-overcount',
    ['bayes-037-naive-risk', 'bayes-046-evidence-dependence'],
    ['bayes-dependent-evidence-overcount-diagnosis'],
  ),
  competency(
    'bayes-live-probability-calibration',
    ['bayes-044-calibration-check', 'bayes-057-scenario-calibration'],
    ['bayes-live-calibration-monitoring-decision'],
  ),
]);
