function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DIFFUSION_BASICS_SAMPLING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'diffusion-basics',
  'diffusion-sampling',
]);

export const DIFFUSION_BASICS_SAMPLING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'diffusion-forward-process-signal-noise-math',
    'diffusion-basics',
    ['diffbas-021-equation', 'diffbas-022-weighting'],
    ['diffusion-forward-noise-worked'],
  ),
  competency(
    'diffusion-timestep-noise-level-conditioning',
    'diffusion-basics',
    ['diffbas-004-timestep', 'diffbas-025-t-embedding'],
    ['diffusion-timestep-conditioning-mismatch'],
  ),
  competency(
    'diffusion-training-generation-supervision-boundary',
    'diffusion-basics',
    ['diffbas-015-training-pair', 'diffbas-031-training-vs-generation'],
    ['diffusion-training-generation-target-boundary'],
  ),
  competency(
    'diffusion-noise-prediction-error-direction',
    'diffusion-basics',
    ['diffbas-029-underestimate', 'diffbas-030-overestimate-mechanism'],
    ['diffusion-noise-prediction-error-direction'],
  ),
  competency(
    'diffusion-latent-denoising-decoding-contract',
    'diffusion-basics',
    ['diffbas-038-latent', 'diffbas-039-vae-bridge'],
    ['diffusion-latent-decoding-contract'],
  ),
  competency(
    'diffusion-sampling-ddpm-vs-ddim-stochasticity',
    'diffusion-sampling',
    ['diffsamp-006-ddpm-basic', 'diffsamp-007-ddim-basic', 'diffsamp-024-same-model'],
    ['diffusion-ddpm-ddim-reproducibility-choice'],
  ),
  competency(
    'diffusion-sampling-step-count-operating-point',
    'diffusion-sampling',
    ['diffsamp-011-step-count', 'diffsamp-015-speed', 'diffsamp-048-quality-metric'],
    ['diffusion-sampler-budget-decision'],
  ),
  competency(
    'diffusion-sampling-seed-determinism-boundary',
    'diffusion-sampling',
    ['diffsamp-039-seed', 'diffsamp-040-reproducibility'],
    ['diffusion-sampling-seed-boundary'],
  ),
  competency(
    'diffusion-sampling-coarse-schedule-discretization',
    'diffusion-sampling',
    ['diffsamp-026-subsequence', 'diffsamp-027-discretization', 'diffsamp-037-stability'],
    ['diffusion-sampling-coarse-schedule-instability'],
  ),
  competency(
    'diffusion-sampling-denoiser-error-step-interaction',
    'diffusion-sampling',
    ['diffsamp-014-prediction-quality', 'diffsamp-028-prediction-error'],
    ['diffusion-sampling-denoiser-error-step-interaction'],
  ),
]);
