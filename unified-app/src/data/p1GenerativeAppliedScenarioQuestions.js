export const P1_GENERATIVE_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'diffusion-basics': [
    {
      id: 'diffusion-forward-noise-worked',
      level: 'calculation',
      relatedComparison: 'clean-sample-vs-noised-timestep',
      scenario: 'A scalar training example uses x0 = 1.0, cumulative noise coefficient alpha_bar_t = 0.64, and sampled noise epsilon = -0.5. The forward process is x_t = sqrt(alpha_bar_t) * x0 + sqrt(1 - alpha_bar_t) * epsilon.',
      prompt: 'What noisy value x_t should be given to the denoiser at this timestep?',
      choices: [
        '0.50 because 0.8 * 1.0 + 0.6 * (-0.5) = 0.50',
        '0.30 because alpha_bar_t should be multiplied directly by epsilon',
        '1.10 because both clean signal and noise magnitudes should be added as positive values',
      ],
      answerIndex: 0,
      explanation: 'sqrt(0.64) = 0.8 and sqrt(0.36) = 0.6, so the noised sample is 0.8 * 1.0 + 0.6 * (-0.5) = 0.50. The forward process mixes signal and sampled noise with square-root coefficients.',
      misconceptionTested: 'The diffusion forward equation uses alpha values directly or ignores the sign of sampled noise.',
    },
  ],
  'diffusion-sampling': [
    {
      id: 'diffusion-sampler-budget-decision',
      level: 'decision',
      relatedComparison: 'denoising-steps-quality-latency-budget',
      scenario: 'On representative prompts, 8 denoising steps take 220 ms with 12% artifact rate, 20 steps take 510 ms with 4% artifacts, and 50 steps take 1250 ms with 3.5% artifacts. The product requires at most 600 ms latency and at most 5% artifacts.',
      prompt: 'Which tested operating point satisfies both requirements with the least unnecessary work?',
      choices: [
        '20 steps, because it meets both the latency and artifact targets without paying for 50-step sampling',
        '8 steps, because minimum latency should override the explicit artifact-quality requirement',
        '50 steps, because the lowest artifact rate is always optimal even when it violates the latency budget',
      ],
      answerIndex: 0,
      explanation: 'The 20-step sampler is the only tested point that meets both constraints: 510 ms is below 600 ms and 4% artifacts are below 5%. The 8-step point misses quality, while 50 steps violates latency for only a small quality gain.',
      misconceptionTested: 'Sampling-step selection should blindly maximize quality or minimize latency instead of satisfying the product frontier.',
    },
  ],
  'classifier-free-guidance': [
    {
      id: 'cfg-guidance-combination-worked',
      level: 'calculation',
      relatedComparison: 'conditional-vs-unconditional-guidance-combination',
      scenario: 'At one denoising state, the unconditional prediction is 0.20 and the conditional prediction is 0.50. The sampler uses classifier-free guidance epsilon_cfg = epsilon_uncond + s * (epsilon_cond - epsilon_uncond) with guidance scale s = 3.',
      prompt: 'What guided prediction does the sampler use before the next update?',
      choices: [
        '1.10 because 0.20 + 3 * (0.50 - 0.20) = 1.10',
        '0.90 because guidance multiplies only the conditional prediction by the scale',
        '0.70 because the conditional and unconditional predictions should simply be added',
      ],
      answerIndex: 0,
      explanation: 'The conditional-unconditional direction is 0.30. Scaling it by 3 gives 0.90, then adding the unconditional baseline 0.20 gives 1.10. CFG extrapolates along the conditioning direction rather than merely scaling one prediction.',
      misconceptionTested: 'Classifier-free guidance is just conditional prediction multiplied by the guidance scale.',
    },
  ],
  'unet-vs-dit': [
    {
      id: 'dit-patch-attention-cost-worked',
      level: 'calculation',
      relatedComparison: 'dit-patch-size-detail-vs-attention-cost',
      scenario: 'A DiT processes a 256 x 256 representation with non-overlapping square patches. With 16 x 16 patches it has 256 tokens; changing to 8 x 8 patches gives 1024 tokens. Assume dense attention cost is proportional to the square of token count.',
      prompt: 'How does the dense attention-pair count change after halving the patch width?',
      choices: [
        'It becomes 16 times larger because token count grows 4x and dense pair count grows with n squared',
        'It becomes 4 times larger because attention cost grows only linearly with token count',
        'It stays unchanged because image resolution did not change',
      ],
      answerIndex: 0,
      explanation: 'Halving patch width doubles patch count along each spatial axis, so token count grows from 256 to 1024, a 4x increase. Dense attention pairs therefore grow by 4 squared = 16x.',
      misconceptionTested: 'Reducing DiT patch size changes detail granularity without a quadratic attention-cost consequence.',
    },
  ],
  'diffusion-language-models': [
    {
      id: 'difflm-locking-threshold-decision',
      level: 'decision',
      relatedComparison: 'confidence-locking-quality-vs-denoising-passes',
      scenario: 'A diffusion LM is evaluated with three token-lock thresholds. At 0.60 it finishes in 4 passes but freezes 14% wrong tokens; at 0.80 it finishes in 7 passes with 4% frozen errors; at 0.95 it needs 12 passes with 1% frozen errors. The serving target is at most 8 passes and at most 5% frozen errors.',
      prompt: 'Which tested locking threshold best satisfies the serving target?',
      choices: [
        '0.80, because it stays within both the 8-pass latency proxy and the 5% frozen-error limit',
        '0.60, because locking as early as possible should dominate correctness constraints',
        '0.95, because the lowest frozen-error rate should be chosen even when the pass budget is exceeded',
      ],
      answerIndex: 0,
      explanation: 'The 0.80 threshold meets both constraints with 7 passes and 4% frozen errors. The lower threshold commits too aggressively, while the higher threshold is safer but misses the sequential-pass budget.',
      misconceptionTested: 'Confidence locking has one universally best threshold independent of revision quality and serving latency.',
    },
  ],
});
