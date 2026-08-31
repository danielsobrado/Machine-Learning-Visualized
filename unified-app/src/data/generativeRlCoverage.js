function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    scenarioIds: Object.freeze(scenarioIds),
  });
}

export const GENERATIVE_RL_AUDITED_LESSON_IDS = Object.freeze([
  'diffusion-basics',
  'diffusion-sampling',
  'classifier-free-guidance',
  'unet-vs-dit',
  'diffusion-language-models',
  'rl-foundations',
  'q-learning',
  'rl-exploration',
  'grpo-reasoning',
  'dapo-reasoning-rl',
  'coconut-latent-reasoning',
  'reasoning-rlvr-grpo',
]);

export const GENERATIVE_RL_COVERAGE = Object.freeze({
  'diffusion-basics': requirement(['diffusion-forward-noise-worked']),
  'diffusion-sampling': requirement(['diffusion-sampler-budget-decision']),
  'classifier-free-guidance': requirement(['cfg-guidance-combination-worked']),
  'unet-vs-dit': requirement(['dit-patch-attention-cost-worked']),
  'diffusion-language-models': requirement(['difflm-locking-threshold-decision']),
  'rl-foundations': requirement(['rl-discounted-return-worked']),
  'q-learning': requirement(['qlearn-terminal-update-worked']),
  'rl-exploration': requirement(['epsilon-greedy-action-probability-worked']),
  'grpo-reasoning': requirement(['grpo-group-advantage-worked']),
  'dapo-reasoning-rl': requirement(['dapo-dynamic-sampling-worked']),
  'coconut-latent-reasoning': requirement(['coconut-visible-vs-compute-worked']),
  'reasoning-rlvr-grpo': requirement(['rlvr-verifier-generalization-decision']),
});

export const GENERATIVE_RL_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('diffusion-forward-process-calculation', 'diffusion-basics', ['diffusion-forward-noise-worked']),
  depthRequirement('diffusion-sampler-operating-point-decision', 'diffusion-sampling', ['diffusion-sampler-budget-decision']),
  depthRequirement('classifier-free-guidance-calculation', 'classifier-free-guidance', ['cfg-guidance-combination-worked']),
  depthRequirement('dit-patch-attention-scaling-calculation', 'unet-vs-dit', ['dit-patch-attention-cost-worked']),
  depthRequirement('diffusion-lm-locking-threshold-decision', 'diffusion-language-models', ['difflm-locking-threshold-decision']),
  depthRequirement('discounted-return-calculation', 'rl-foundations', ['rl-discounted-return-worked']),
  depthRequirement('terminal-q-learning-update-calculation', 'q-learning', ['qlearn-terminal-update-worked']),
  depthRequirement('epsilon-greedy-action-probability-calculation', 'rl-exploration', ['epsilon-greedy-action-probability-worked']),
  depthRequirement('grpo-relative-advantage-calculation', 'grpo-reasoning', ['grpo-group-advantage-worked']),
  depthRequirement('dapo-dynamic-sampling-effectiveness-calculation', 'dapo-reasoning-rl', ['dapo-dynamic-sampling-worked']),
  depthRequirement('latent-reasoning-compute-accounting-calculation', 'coconut-latent-reasoning', ['coconut-visible-vs-compute-worked']),
  depthRequirement('rlvr-verifier-generalization-decision', 'reasoning-rlvr-grpo', ['rlvr-verifier-generalization-decision']),
]);
