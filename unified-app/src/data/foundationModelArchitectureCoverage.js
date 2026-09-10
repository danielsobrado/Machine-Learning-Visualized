function competency(id, lessonId, quizIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
  });
}

export const FOUNDATION_MODEL_ARCHITECTURE_AUDITED_LESSON_IDS = Object.freeze([
  'bert',
  'gpt2-comprehensive',
  'moe',
  'multi-head-latent-attention',
  'multimodal-llm',
  'frontier-llm-architecture-overview',
  'frontier-moe-systems',
  'eagle-3-1-speculative-decoding',
  'spec-sparse-attention',
  'turboquant',
]);

export const FOUNDATION_MODEL_ARCHITECTURE_REQUIREMENTS = Object.freeze([
  competency('bert-bidirectional-encoder-vs-generation', 'bert', [
    'bert-039-mlm-context',
    'bert-054-generation-choice',
  ]),
  competency('bert-task-output-and-pretraining-boundaries', 'bert', [
    'bert-061-subword-labels',
    'bert-073-mlm-limits',
  ]),
  competency('gpt2-causal-mask-and-token-mixing', 'gpt2-comprehensive', [
    'gpt2-033-ffn-not-mixing',
    'gpt2-055-leakage-eval',
  ]),
  competency('gpt2-cache-and-inference-tradeoff', 'gpt2-comprehensive', [
    'gpt2-070-cache-memory',
    'gpt2-074-train-vs-infer',
  ]),
  competency('moe-active-vs-total-footprint', 'moe', [
    'moe-044-active-params',
    'moe-064-memory-caveat',
  ]),
  competency('moe-routing-balance-controls-throughput', 'moe', [
    'moe-066-one-expert-hot',
    'moe-068-throughput',
  ]),
  competency('mla-cache-layout-vs-explicit-head-sharing', 'multi-head-latent-attention', [
    'mhla-047-gqa-vs-mla',
    'mhla-064-compute-case',
  ]),
  competency('mla-rope-limits-naive-absorption', 'multi-head-latent-attention', [
    'mhla-060-rope-case',
    'mhla-079-dangerous-absorption',
  ]),
  competency('multimodal-alignment-and-grounding', 'multimodal-llm', [
    'mmlm-047-weak-alignment',
    'mmlm-084-dangerous-seeing',
  ]),
  competency('multimodal-token-budget-and-fusion-tradeoff', 'multimodal-llm', [
    'mmlm-061-token-budget-case',
    'mmlm-089-misleading-architecture-names',
  ]),
  competency('frontier-overview-architecture-vs-decoding-control', 'frontier-llm-architecture-overview', [
    'flao-046-qwen-card',
    'flao-072-architecture-vs-decoding',
  ]),
  competency('frontier-overview-hybrid-tradeoff-audit', 'frontier-llm-architecture-overview', [
    'flao-073-classify-hybrid',
    'flao-074-tradeoff-note',
  ]),
  competency('frontier-moe-active-footprint-includes-storage-and-shared-paths', 'frontier-moe-systems', [
    'fmoe-052-shared-calc',
    'fmoe-071-memory-claim',
  ]),
  competency('frontier-moe-tail-latency-and-capacity-failures', 'frontier-moe-systems', [
    'fmoe-072-throughput-claim',
    'fmoe-073-fix-priority',
  ]),
  competency('speculative-decoding-keeps-target-verification', 'eagle-3-1-speculative-decoding', [
    'eagle31-051-product-quality',
    'eagle31-079-dangerous-no-target',
  ]),
  competency('speculative-depth-needs-acceptance-measurement', 'eagle-3-1-speculative-decoding', [
    'eagle31-059-depth-tuning',
    'eagle31-087-dangerous-more-depth',
  ]),
  competency('sparse-speculation-is-end-to-end-throughput-tradeoff', 'spec-sparse-attention', [
    'specsa-051-long-context-choice',
    'specsa-078-wrong-all-sparse',
  ]),
  competency('sparse-speculation-preserves-verifier-authority', 'spec-sparse-attention', [
    'specsa-054-strict-deploy',
    'specsa-077-misleading-no-verifier',
  ]),
  competency('kv-quantization-preserves-attention-scores-not-only-mse', 'turboquant', [
    'tq-056-mse-regression',
    'tq-077-misleading-mse',
  ]),
  competency('kv-quantization-memory-savings-need-kernel-and-quality-validation', 'turboquant', [
    'tq-067-dequant-overhead',
    'tq-089-dangerous-eval',
  ]),
]);
