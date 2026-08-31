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

export const NLP_TRANSFORMER_AUDITED_LESSON_IDS = Object.freeze([
  'tokenization',
  'embeddings',
  'cosine-similarity',
  'attention-mechanism',
  'self-attention',
  'kv-cache',
  'grouped-query-attention',
  'flash-attention',
  'native-sparse-attention',
  'attention-masks',
  'positional-encoding',
  'rope',
  'residual-stream',
  'transformer',
  'transformer-architecture-families',
  'llm-training-objectives',
  'transformer-token-generation',
  'sampling-strategies',
  'fine-tuning',
]);

export const NLP_TRANSFORMER_COVERAGE = Object.freeze({
  'tokenization': requirement(['tokenization-budget-worked']),
  'embeddings': requirement(['embedding-anisotropy-ablation-decision']),
  'cosine-similarity': requirement(['cosine-ranking-worked']),
  'attention-mechanism': requirement(['attention-weighted-value-worked']),
  'self-attention': requirement(['self-attention-length-memory-decision']),
  'kv-cache': requirement(['kv-cache-memory-worked']),
  'grouped-query-attention': requirement(['gqa-kv-cache-reduction-worked']),
  'flash-attention': requirement(['flash-attention-io-diagnosis']),
  'native-sparse-attention': requirement(['native-sparse-long-range-design']),
  'attention-masks': requirement(['attention-mask-padding-leak-diagnosis']),
  'positional-encoding': requirement(['position-shift-generalization-design']),
  'rope': requirement(['rope-position-interpolation-worked']),
  'residual-stream': requirement(['residual-stream-additive-update-worked']),
  'transformer': requirement(['transformer-prenorm-stability-diagnosis']),
  'transformer-architecture-families': requirement(['transformer-family-workload-decision']),
  'llm-training-objectives': requirement(['causal-objective-target-shift-diagnosis']),
  'transformer-token-generation': requirement(['generation-temperature-worked']),
  'sampling-strategies': requirement(['sampling-top-p-worked']),
  'fine-tuning': requirement(['finetune-catastrophic-forgetting-decision']),
});

export const NLP_TRANSFORMER_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('multilingual-token-budget-calculation', 'tokenization', ['tokenization-budget-worked']),
  depthRequirement('embedding-geometry-ablation-decision', 'embeddings', ['embedding-anisotropy-ablation-decision']),
  depthRequirement('cosine-ranking-calculation', 'cosine-similarity', ['cosine-ranking-worked']),
  depthRequirement('attention-weighted-value-calculation', 'attention-mechanism', ['attention-weighted-value-worked']),
  depthRequirement('quadratic-context-memory-decision', 'self-attention', ['self-attention-length-memory-decision']),
  depthRequirement('kv-cache-memory-calculation', 'kv-cache', ['kv-cache-memory-worked']),
  depthRequirement('gqa-cache-reduction-calculation', 'grouped-query-attention', ['gqa-kv-cache-reduction-worked']),
  depthRequirement('io-aware-attention-diagnosis', 'flash-attention', ['flash-attention-io-diagnosis']),
  depthRequirement('sparse-long-range-connectivity-design', 'native-sparse-attention', ['native-sparse-long-range-design']),
  depthRequirement('padding-mask-leak-diagnosis', 'attention-masks', ['attention-mask-padding-leak-diagnosis']),
  depthRequirement('position-shift-generalization-design', 'positional-encoding', ['position-shift-generalization-design']),
  depthRequirement('rope-position-interpolation-calculation', 'rope', ['rope-position-interpolation-worked']),
  depthRequirement('residual-additive-update-calculation', 'residual-stream', ['residual-stream-additive-update-worked']),
  depthRequirement('deep-transformer-normalization-diagnosis', 'transformer', ['transformer-prenorm-stability-diagnosis']),
  depthRequirement('architecture-family-workload-decision', 'transformer-architecture-families', ['transformer-family-workload-decision']),
  depthRequirement('causal-target-alignment-diagnosis', 'llm-training-objectives', ['causal-objective-target-shift-diagnosis']),
  depthRequirement('temperature-softmax-decision', 'transformer-token-generation', ['generation-temperature-worked']),
  depthRequirement('nucleus-candidate-set-calculation', 'sampling-strategies', ['sampling-top-p-worked']),
  depthRequirement('catastrophic-forgetting-adaptation-decision', 'fine-tuning', ['finetune-catastrophic-forgetting-decision']),
]);
