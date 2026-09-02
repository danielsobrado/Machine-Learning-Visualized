export const LATENT_DIFFUSION_PIPELINE_AUDITED_LESSON_IDS = Object.freeze([
  'diffusion-vae',
  'sd3-overview',
  'flow-matching',
  'clip-encoder',
  't5-encoder',
  'joint-attention',
  'dit',
]);

export const LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'diffusion-vae',
    competency: 'latent-shape-and-scaling-contract',
    scenarioId: 'diffusion-vae-latent-scale-contract',
  }),
  Object.freeze({
    lessonId: 'sd3-overview',
    competency: 'end-to-end-latent-and-conditioning-shape-ledger',
    scenarioId: 'sd3-overview-conditioning-shape-ledger',
  }),
  Object.freeze({
    lessonId: 'flow-matching',
    competency: 'flow-path-velocity-and-euler-integration',
    scenarioId: 'flow-matching-euler-step',
  }),
  Object.freeze({
    lessonId: 'clip-encoder',
    competency: 'eos-pooling-normalization-and-cosine-matching',
    scenarioId: 'clip-encoder-eos-pooling-normalization',
  }),
  Object.freeze({
    lessonId: 't5-encoder',
    competency: 'padding-mask-to-attention-bias-semantics',
    scenarioId: 't5-encoder-mask-bias-contract',
  }),
  Object.freeze({
    lessonId: 'joint-attention',
    competency: 'cross-modal-score-matrix-accounting',
    scenarioId: 'joint-attention-shared-attention-ledger',
  }),
  Object.freeze({
    lessonId: 'dit',
    competency: 'latent-patch-token-and-attention-scaling',
    scenarioId: 'dit-patchify-ledger',
  }),
]);
