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
    'losslik-categorical-nll-calculation',
    ['losslik-014-cross-entropy'],
    ['losslik-categorical-nll-worked'],
  ),
  competency(
    'losslik-stable-logits-crossentropy',
    ['losslik-045-logits'],
    ['losslik-logsumexp-stability-diagnosis'],
  ),
  competency(
    'losslik-gaussian-predicted-variance-nll',
    ['losslik-024-variance-scale'],
    ['losslik-gaussian-variance-nll-worked'],
  ),
  competency(
    'losslik-huber-outlier-robustness',
    ['losslik-039-huber'],
    ['loss-huber-outlier-worked'],
  ),
  competency(
    'losslik-quantile-asymmetric-objective',
    ['losslik-040-quantile'],
    ['losslik-quantile-pinball-worked'],
  ),
  competency(
    'losslik-weighted-reduction-scale',
    ['losslik-046-reduction'],
    ['losslik-weighted-reduction-scale-worked'],
  ),
  competency(
    'losslik-surrogate-metric-alignment',
    ['losslik-043-metric-mismatch'],
    ['losslik-surrogate-metric-mismatch-decision'],
  ),
  competency(
    'losslik-output-loss-representation-pairing',
    ['losslik-044-probability-output'],
    ['losslik-bce-logits-double-sigmoid-diagnosis'],
  ),
  competency(
    'losslik-label-smoothing-not-calibration',
    ['losslik-037-label-smoothing'],
    ['loss-label-smoothing'],
  ),
]);
