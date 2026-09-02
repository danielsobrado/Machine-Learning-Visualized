export const ADVANCED_NEURAL_ARCHITECTURES_AUDITED_LESSON_IDS = Object.freeze([
  'lstm',
  'vae',
  'moe',
]);

export const ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'lstm',
    competency: 'gated-cell-state-update',
    scenarioIds: Object.freeze(['lstm-cell-state-update-worked']),
  }),
  Object.freeze({
    lessonId: 'lstm',
    competency: 'recurrent-gradient-retention',
    scenarioIds: Object.freeze(['lstm-bptt-gradient-retention-worked']),
  }),
  Object.freeze({
    lessonId: 'vae',
    competency: 'reparameterized-latent-sampling',
    scenarioIds: Object.freeze(['vae-reparameterization-worked']),
  }),
  Object.freeze({
    lessonId: 'vae',
    competency: 'kl-regularized-objective',
    scenarioIds: Object.freeze(['vae-kl-regularization-worked']),
  }),
  Object.freeze({
    lessonId: 'moe',
    competency: 'conditional-expert-capacity',
    scenarioIds: Object.freeze(['moe-routing-capacity-worked']),
  }),
  Object.freeze({
    lessonId: 'moe',
    competency: 'expert-load-capacity-overflow',
    scenarioIds: Object.freeze(['moe-load-balance-worked']),
  }),
]);
