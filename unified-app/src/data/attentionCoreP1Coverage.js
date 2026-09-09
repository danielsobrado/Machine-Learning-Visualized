function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const ATTENTION_CORE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'attention-mechanism',
  'self-attention',
  'kv-cache',
  'grouped-query-attention',
  'flash-attention',
  'native-sparse-attention',
  'attention-masks',
]);

export const ATTENTION_CORE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'attention-qkv-role-separation',
    'attention-mechanism',
    ['attn-004-query-role', 'attn-005-key-role', 'attn-006-value-role'],
    ['attention-qkv-role'],
  ),
  competency(
    'attention-softmax-weighted-value-arithmetic',
    'attention-mechanism',
    ['attn-021-step-one', 'attn-022-step-two', 'attn-023-step-three'],
    ['attention-weighted-value-worked'],
  ),
  competency(
    'self-attention-quadratic-sequence-scaling',
    'self-attention',
    ['selfattn-010-full-matrix'],
    ['self-attention-quadratic-pairs', 'self-attention-length-memory-decision'],
  ),
  competency(
    'kv-cache-memory-arithmetic-and-context-scaling',
    'kv-cache',
    ['kvc-025-memory-formula', 'kvc-029-context-scaling'],
    ['kv-cache-memory-worked'],
  ),
  competency(
    'kv-cache-bandwidth-tpot-floor',
    'kv-cache',
    ['kvc-031-bandwidth'],
    ['kv-cache-bandwidth-tpot-worked'],
  ),
  competency(
    'kv-cache-prefix-reuse-boundary',
    'kv-cache',
    ['kvc-037-cache-invalidation', 'kvc-039-prompt-edit'],
    ['kv-cache-prefix-reuse-boundary-design'],
  ),
  competency(
    'gqa-kv-cache-width-reduction',
    'grouped-query-attention',
    ['gqa-008-cache-memory-basic', 'gqa-031-cache-ratio'],
    ['gqa-kv-cache-reduction-worked'],
  ),
  competency(
    'gqa-head-group-mapping-correctness',
    'grouped-query-attention',
    ['gqa-022-group-size-formula', 'gqa-023-head-index-map'],
    ['gqa-group-mapping-broadcast-diagnosis'],
  ),
  competency(
    'gqa-sharing-quality-tradeoff',
    'grouped-query-attention',
    ['gqa-009-tradeoff-basic', 'gqa-037-quality-capacity'],
    ['gqa-aggressive-sharing-quality-diagnosis'],
  ),
  competency(
    'flash-attention-exact-io-aware-tiling',
    'flash-attention',
    ['flash-001-purpose', 'flash-002-large-intermediate', 'flash-003-exactness'],
    ['flash-attention-io-diagnosis'],
  ),
  competency(
    'native-sparse-long-range-connectivity',
    'native-sparse-attention',
    ['nsa-005-window-role', 'nsa-017-quality-basic'],
    ['native-sparse-long-range-design'],
  ),
  competency(
    'attention-mask-causal-padding-separation',
    'attention-masks',
    ['amask-006-causal-basic', 'amask-007-padding-basic', 'amask-029-combined-mask'],
    ['mask-causal-vs-padding', 'attention-mask-padding-leak-diagnosis'],
  ),
]);
