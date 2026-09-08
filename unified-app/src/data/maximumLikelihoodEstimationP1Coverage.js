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
    'mle-bernoulli-log-likelihood-arithmetic',
    ['mle-021-bernoulli-form', 'mle-051-scenario-80'],
    ['mle-bernoulli-log-likelihood-worked'],
  ),
  competency(
    'mle-gaussian-mean-variance-estimation',
    ['mle-029-sigma', 'mle-030-sample-mean'],
    ['mle-gaussian-mean-variance-worked'],
  ),
  competency(
    'mle-log-likelihood-ratio-interpretation',
    ['mle-042-likelihood-ratio', 'mle-063-scenario-relative'],
    ['mle-log-likelihood-ratio-worked'],
  ),
  competency(
    'mle-log-space-numerical-stability',
    ['mle-032-products', 'mle-069-scenario-log-space'],
    ['mle-log-space-underflow-diagnosis'],
  ),
  competency(
    'mle-iid-dependence-assumption',
    ['mle-033-independent', 'mle-034-iid'],
    ['mle-iid-dependence-diagnosis'],
  ),
  competency(
    'mle-model-family-misspecification',
    ['mle-035-model-family', 'mle-036-misspecification'],
    ['mle-poisson-overdispersion-diagnosis'],
  ),
  competency(
    'mle-model-complexity-selection',
    ['mle-046-comparing-models', 'mle-067-scenario-overfit'],
    ['mle-aic-complexity-worked-decision'],
  ),
  competency(
    'mle-vs-map-prior-distinction',
    ['mle-039-map', 'mle-066-scenario-map'],
    ['mle-vs-map-prior'],
  ),
]);
