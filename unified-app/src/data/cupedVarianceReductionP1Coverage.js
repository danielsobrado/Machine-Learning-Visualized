function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'cuped-variance-reduction',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CUPED_VARIANCE_REDUCTION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'cuped-variance-reduction',
]);

export const CUPED_VARIANCE_REDUCTION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'cuped-rho-squared-variance-reduction',
    ['cuped-010-rho-squared', 'cuped-024-variance-left'],
    ['cuped-variance-reduction-worked'],
  ),
  competency(
    'cuped-theta-centered-adjustment',
    ['cuped-023-optimal-theta', 'cuped-030-mean-centering'],
    ['cuped-theta-centered-adjustment-worked'],
  ),
  competency(
    'cuped-sample-equivalent-precision',
    ['cuped-014-sample-equivalent', 'cuped-065-scenario-sample-equivalent'],
    ['cuped-sample-equivalent-worked'],
  ),
  competency(
    'cuped-bad-adjustment-can-increase-variance',
    ['cuped-018-no-gain', 'cuped-072-scenario-implementation'],
    ['cuped-wrong-theta-variance-increase-worked'],
  ),
  competency(
    'cuped-post-treatment-mediator-safety',
    ['cuped-041-mediator', 'cuped-064-scenario-mediator'],
    ['cuped-post-treatment-mediator-diagnosis'],
  ),
  competency(
    'cuped-flexible-adjustment-cross-fitting',
    ['cuped-039-cross-fitting', 'cuped-069-scenario-flexible'],
    ['cuped-cross-fitting-flexible-adjustment-design'],
  ),
  competency(
    'cuped-aa-inference-calibration',
    ['cuped-043-aa-test', 'cuped-060-scenario-aa'],
    ['cuped-aa-calibration-diagnosis'],
  ),
  competency(
    'cuped-missing-baseline-validity',
    ['cuped-033-missing-covariate', 'cuped-056-scenario-missing'],
    ['cuped-differential-missing-baseline-diagnosis'],
  ),
]);
