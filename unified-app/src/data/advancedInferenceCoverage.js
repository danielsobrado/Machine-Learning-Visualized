export const ADVANCED_INFERENCE_AUDITED_LESSON_IDS = Object.freeze([
  'multi-head-latent-attention',
  'eagle-3-1-speculative-decoding',
  'spec-sparse-attention',
  'turboquant',
]);

export const ADVANCED_INFERENCE_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'multi-head-latent-attention',
    competencies: Object.freeze([
      Object.freeze({ competency: 'latent-kv-cache-compression-ratio', scenarioId: 'mla-cache-latent-ratio' }),
      Object.freeze({ competency: 'decoupled-rope-cache-design', scenarioId: 'mla-decoupled-rope-cache-design' }),
    ]),
  }),
  Object.freeze({
    lessonId: 'eagle-3-1-speculative-decoding',
    competencies: Object.freeze([
      Object.freeze({ competency: 'accepted-prefix-target-pass-amortization', scenarioId: 'eagle-accepted-prefix-efficiency' }),
      Object.freeze({ competency: 'end-to-end-speculative-speedup', scenarioId: 'eagle-end-to-end-speedup' }),
    ]),
  }),
  Object.freeze({
    lessonId: 'spec-sparse-attention',
    competencies: Object.freeze([
      Object.freeze({ competency: 'merged-union-kv-block-reuse', scenarioId: 'specsa-union-block-reuse' }),
      Object.freeze({ competency: 'strict-versus-shared-index-scheduling', scenarioId: 'specsa-strict-exact-merge-choice' }),
    ]),
  }),
  Object.freeze({
    lessonId: 'turboquant',
    competencies: Object.freeze([
      Object.freeze({ competency: 'effective-bit-kv-memory-calculation', scenarioId: 'turboquant-effective-bit-memory' }),
      Object.freeze({ competency: 'attention-ranking-versus-reconstruction-error', scenarioId: 'turboquant-ranking-over-mse-choice' }),
    ]),
  }),
]);
