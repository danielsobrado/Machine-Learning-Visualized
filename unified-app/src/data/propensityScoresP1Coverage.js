function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'propensity-scores',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const PROPENSITY_SCORES_P1_AUDITED_LESSON_IDS = Object.freeze([
  'propensity-scores',
]);

export const PROPENSITY_SCORES_P1_REQUIREMENTS = Object.freeze([
  competency(
    'propensity-covariate-balance-smd',
    ['ps-028-smd'],
    ['propensity-balance-smd'],
  ),
  competency(
    'propensity-extreme-ipw-instability',
    ['ps-026-extreme-weights'],
    ['propensity-extreme-weight-trim'],
  ),
  competency(
    'propensity-positivity-overlap-estimand',
    ['ps-030-positivity'],
    ['propensity-positivity-overlap-decision'],
  ),
  competency(
    'propensity-worked-ate-ipw',
    ['ps-010-treated-weight', 'ps-011-control-weight'],
    ['propensity-ipw-ate-worked'],
  ),
  competency(
    'propensity-att-estimand-selection',
    ['ps-036-att'],
    ['propensity-att-estimand-selection'],
  ),
  competency(
    'propensity-balance-over-treatment-auc',
    ['ps-039-model-choice'],
    ['propensity-balance-over-auc-model-selection'],
  ),
  competency(
    'propensity-pretreatment-covariate-timing',
    ['ps-032-covariate-timing'],
    ['propensity-post-treatment-covariate-diagnosis'],
  ),
  competency(
    'propensity-negative-control-hidden-bias',
    ['ps-042-negative-control'],
    ['propensity-negative-control-residual-bias'],
  ),
]);
