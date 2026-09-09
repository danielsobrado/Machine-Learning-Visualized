function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'recommender-systems-ranking-track',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RECOMMENDER_SYSTEMS_RANKING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'recommender-systems-ranking-track',
]);

export const RECOMMENDER_SYSTEMS_RANKING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rec-ndcg-ranked-list-arithmetic',
    ['rec-043-ndcg'],
    ['rec-ndcg-worked-calculation'],
  ),
  competency(
    'rec-matrix-factorization-learning',
    ['rec-013-matrix-factorization'],
    ['rec-mf-latent-sgd-worked'],
  ),
  competency(
    'rec-exposure-aware-off-policy-evaluation',
    ['rec-035-exposure-bias'],
    ['rec-offpolicy-ips-worked'],
  ),
  competency(
    'rec-offline-online-release-alignment',
    ['rec-048-online-ab-test'],
    ['rec-offline-online-regression-decision'],
  ),
  competency(
    'rec-candidate-generation-recall-bottleneck',
    ['rec-008-candidate-generation'],
    ['rec-candidate-recall-bottleneck-diagnosis'],
  ),
  competency(
    'rec-unobserved-pair-negative-semantics',
    ['rec-022-sparsity'],
    ['rec-unexposed-is-not-negative-decision'],
  ),
  competency(
    'rec-cold-item-content-exploration',
    ['rec-016-cold-start'],
    ['rec-cold-item-launch-strategy-decision'],
  ),
  competency(
    'rec-temporal-interaction-leakage',
    ['rec-038-leakage'],
    ['rec-temporal-interaction-leakage-diagnosis'],
  ),
]);
