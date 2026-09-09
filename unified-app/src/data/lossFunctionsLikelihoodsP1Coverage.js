function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'loss-functions-likelihoods',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const LOSS_FUNCTIONS_LIKELIHOODS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'loss-functions-likelihoods',
]);

export const LOSS_FUNCTIONS_LIKELIHOODS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'losslik-categorical-nll-arithmetic',
    ['losslik-014-cross-entropy', 'losslik-053-scenario-wrong-confident'],
    ['losslik-categorical-nll-worked'],
  ),
  competency(
    'losslik-logits-numerical-stability',
    ['losslik-045-logits', 'losslik-063-scenario-logits'],
    ['losslik-logsumexp-stability-diagnosis'],
  ),
  competency(
    'losslik-gaussian-scale-nll',
    ['losslik-017-mse-gaussian', 'losslik-024-variance-scale'],
    ['losslik-gaussian-variance-nll-worked'],
  ),
  competency(
    'losslik-robust-huber-outliers',
    ['losslik-039-huber', 'losslik-056-scenario-huber'],
    ['loss-huber-outlier-worked'],
  ),
  competency(
    'losslik-quantile-asymmetric-cost',
    ['losslik-040-quantile', 'losslik-072-scenario-quantile'],
    ['losslik-quantile-pinball-worked'],
  ),
  competency(
    'losslik-weighting-reduction-scale',
    ['losslik-035-weights', 'losslik-046-reduction'],
    ['losslik-weighted-reduction-scale-worked'],
  ),
  competency(
    'losslik-surrogate-metric-alignment',
    ['losslik-043-metric-mismatch', 'losslik-062-scenario-metric'],
    ['losslik-surrogate-metric-mismatch-decision'],
  ),
  competency(
    'losslik-label-smoothing-tradeoff',
    ['losslik-037-label-smoothing', 'losslik-060-scenario-smoothing'],
    ['loss-label-smoothing'],
  ),
  competency(
    'losslik-output-loss-representation-pairing',
    ['losslik-044-probability-output'],
    ['losslik-bce-logits-double-sigmoid-diagnosis'],
  ),
]);
