function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'coconut-latent-reasoning',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const COCONUT_LATENT_REASONING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'coconut-latent-reasoning',
]);

export const COCONUT_LATENT_REASONING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'coconut-visible-vs-latent-compute',
    ['coconut-009', 'coconut-067'],
    ['coconut-visible-vs-compute-worked'],
  ),
  competency(
    'coconut-hidden-state-feedback-path',
    ['coconut-021', 'coconut-022'],
    ['coconut-latent-feedback-path-diagnosis'],
  ),
  competency(
    'coconut-curriculum-latent-supervision',
    ['coconut-013', 'coconut-068'],
    ['coconut-curriculum-loss-mask-diagnosis'],
  ),
  competency(
    'coconut-delayed-branch-commitment',
    ['coconut-032', 'coconut-065'],
    ['coconut-delayed-commitment-threshold-worked'],
  ),
  competency(
    'coconut-probe-vs-causal-faithfulness',
    ['coconut-040', 'coconut-079'],
    ['coconut-probe-vs-causal-faithfulness-diagnosis'],
  ),
  competency(
    'coconut-shortcut-robustness',
    ['coconut-069', 'coconut-085'],
    ['coconut-shortcut-latent-dependence-diagnosis'],
  ),
  competency(
    'coconut-deployment-auditability',
    ['coconut-060', 'coconut-073'],
    ['coconut-auditability-deployment-decision'],
  ),
]);
