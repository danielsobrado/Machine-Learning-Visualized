function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'unet-vs-dit',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const UNET_VS_DIT_P1_AUDITED_LESSON_IDS = Object.freeze([
  'unet-vs-dit',
]);

export const UNET_VS_DIT_P1_REQUIREMENTS = Object.freeze([
  competency(
    'unet-multiscale-skip-detail-preservation',
    ['unetdit-009-skip-connections', 'unetdit-022-unet-decoder'],
    ['unet-skip-detail-loss-diagnosis'],
  ),
  competency(
    'dit-global-patch-token-mixing',
    ['unetdit-010-attention', 'unetdit-032-global-mixing'],
    ['dit-global-mixing-architecture-choice'],
  ),
  competency(
    'dit-patch-size-attention-cost',
    ['unetdit-012-patch-size', 'unetdit-028-attention-square', 'unetdit-044-patch-halving'],
    ['dit-patch-attention-cost-worked'],
  ),
  competency(
    'unet-dit-data-compute-regime-choice',
    ['unetdit-041-data-scale', 'unetdit-042-small-data', 'unetdit-047-backbone-choice'],
    ['unet-dit-data-scale-choice'],
  ),
  competency(
    'unet-dit-shared-diffusion-interface',
    ['unetdit-038-timestep', 'unetdit-039-output-shape'],
    ['unet-dit-output-contract-debugging'],
  ),
  competency(
    'unet-dit-controlled-architecture-ablation',
    ['unetdit-048-metric', 'unetdit-049-ablation'],
    ['unet-dit-fair-ablation-design'],
  ),
]);
