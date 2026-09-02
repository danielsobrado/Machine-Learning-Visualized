export const RECOMMENDER_SYSTEMS_AUDITED_LESSON_IDS = Object.freeze([
  'recommender-systems-ranking-track',
]);

export const RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    id: 'recommender-ranking-metric',
    lessonId: 'recommender-systems-ranking-track',
    competency: 'ndcg-worked-calculation',
    scenarioId: 'rec-ndcg-worked-calculation',
  }),
  Object.freeze({
    id: 'recommender-matrix-factorization-learning',
    lessonId: 'recommender-systems-ranking-track',
    competency: 'matrix-factorization-sgd-update',
    scenarioId: 'rec-mf-latent-sgd-worked',
  }),
  Object.freeze({
    id: 'recommender-off-policy-evaluation',
    lessonId: 'recommender-systems-ranking-track',
    competency: 'inverse-propensity-off-policy-estimation',
    scenarioId: 'rec-offpolicy-ips-worked',
  }),
  Object.freeze({
    id: 'recommender-exploration-feedback',
    lessonId: 'recommender-systems-ranking-track',
    competency: 'exploration-budget-and-data-coverage',
    scenarioId: 'rec-exploration-budget-worked',
  }),
  Object.freeze({
    id: 'recommender-offline-online-release',
    lessonId: 'recommender-systems-ranking-track',
    competency: 'offline-online-metric-release-decision',
    scenarioId: 'rec-offline-online-regression-decision',
  }),
]);

export const RECOMMENDER_SYSTEMS_NEW_APPLIED_SCENARIO_IDS = Object.freeze([
  'rec-mf-latent-sgd-worked',
  'rec-offpolicy-ips-worked',
  'rec-exploration-budget-worked',
  'rec-offline-online-regression-decision',
]);
