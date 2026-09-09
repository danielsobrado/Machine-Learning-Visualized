function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'maximum-likelihood-estimation',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const MAXIMUM_LIKELIHOOD_ESTIMATION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'maximum-likelihood-estimation',
]);

export const MAXIMUM_LIKELIHOOD_ESTIMATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'mle-bernoulli-log-likelihood-comparison',
    ['mle-022-log-bernoulli'],
    ['mle-bernoulli-log-likelihood-worked'],
  ),
  competency(
    'mle-gaussian-mean-variance-estimation',
    ['mle-030-sample-mean'],
    ['mle-gaussian-mean-variance-worked'],
  ),
  competency(
    'mle-likelihood-ratio-interpretation',
    ['mle-042-likelihood-ratio'],
    ['mle-log-likelihood-ratio-worked'],
  ),
  competency(
    'mle-log-space-numerical-stability',
    ['mle-032-products'],
    ['mle-log-space-underflow-diagnosis'],
  ),
  competency(
    'mle-iid-dependence-assumption',
    ['mle-033-independent'],
    ['mle-iid-dependence-diagnosis'],
  ),
  competency(
    'mle-model-misspecification-diagnostics',
    ['mle-036-misspecification'],
    ['mle-poisson-overdispersion-diagnosis'],
  ),
  competency(
    'mle-complexity-aware-model-selection',
    ['mle-046-comparing-models'],
    ['mle-aic-complexity-worked-decision'],
  ),
  competency(
    'mle-map-vs-mle-prior',
    ['mle-039-map'],
    ['mle-map-bernoulli-worked'],
  ),
  competency(
    'mle-boundary-estimate-vs-numerical-clamp',
    ['mle-023-boundary'],
    ['mle-boundary-estimate-diagnosis'],
  ),
  competency(
    'mle-identifiability-likelihood-ridge',
    ['mle-027-flatness'],
    ['mle-likelihood-ridge-identifiability-diagnosis'],
  ),
]);
