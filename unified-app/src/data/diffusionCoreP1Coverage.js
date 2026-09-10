function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DIFFUSION_CORE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'diffusion-basics',
  'diffusion-sampling',
  'classifier-free-guidance',
  'unet-vs-dit',
]);

export const DIFFUSION_CORE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'diffusion-forward-noise-timestep-conditioning',
    'diffusion-basics',
    ['diffbas-021-equation', 'diffbas-025-t-embedding'],
    ['diffusion-forward-noise-worked', 'diffusion-timestep-conditioning-mismatch'],
  ),
  competency(
    'diffusion-noise-prediction-error-direction',
    'diffusion-basics',
    ['diffbas-028-error-propagation', 'diffbas-029-underestimate', 'diffbas-030-overestimate-mechanism'],
    ['diffusion-noise-prediction-error-direction'],
  ),
  competency(
    'diffusion-latent-denoise-decode-boundary',
    'diffusion-basics',
    ['diffbas-038-latent', 'diffbas-039-vae-bridge'],
    ['diffusion-latent-decoding-contract'],
  ),
  competency(
    'diffusion-sampler-stochasticity-reproducibility',
    'diffusion-sampling',
    ['diffsamp-022-ddpm-noise', 'diffsamp-023-ddim-zero', 'diffsamp-040-reproducibility'],
    ['diffusion-ddpm-ddim-reproducibility-choice', 'diffusion-sampling-seed-boundary'],
  ),
  competency(
    'diffusion-sampler-step-quality-latency-frontier',
    'diffusion-sampling',
    ['diffsamp-027-discretization', 'diffsamp-028-prediction-error'],
    ['diffusion-sampler-budget-decision', 'diffusion-sampling-coarse-schedule-instability'],
  ),
  competency(
    'cfg-guidance-equation-quality-operating-point',
    'classifier-free-guidance',
    ['cfg-021-equation', 'cfg-025-scale-large'],
    ['cfg-guidance-combination-worked', 'cfg-scale-quality-operating-point'],
  ),
  competency(
    'cfg-conditioning-dropout-overshoot-control',
    'classifier-free-guidance',
    ['cfg-027-dropout-conditioning', 'cfg-034-rescale'],
    ['cfg-conditioning-dropout-training-contract', 'cfg-overshoot-rescale-diagnosis'],
  ),
  competency(
    'dit-patch-token-attention-scaling',
    'unet-vs-dit',
    ['unetdit-029-token-count', 'unetdit-043-resolution-change', 'unetdit-044-patch-halving'],
    ['dit-patch-attention-cost-worked'],
  ),
  competency(
    'unet-dit-architecture-tradeoff-ablation',
    'unet-vs-dit',
    ['unetdit-009-skip-connections', 'unetdit-032-global-mixing', 'unetdit-047-backbone-choice', 'unetdit-049-ablation'],
    ['unet-skip-detail-loss-diagnosis', 'dit-global-mixing-architecture-choice', 'unet-dit-fair-ablation-design'],
  ),
]);
