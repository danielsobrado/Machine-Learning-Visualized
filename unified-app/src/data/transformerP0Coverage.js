function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'transformer',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TRANSFORMER_P0_AUDITED_LESSON_IDS = Object.freeze([
  'transformer',
]);

export const TRANSFORMER_P0_REQUIREMENTS = Object.freeze([
  competency(
    'transformer-block-dataflow',
    ['transformer-003-block-combines', 'transformer-028-attn-residual', 'transformer-029-ffn-residual'],
    ['transformer-block-dataflow-diagnosis'],
  ),
  competency(
    'transformer-causal-mask-semantics',
    ['transformer-025-mask-role', 'transformer-040-causal-decoding'],
    ['transformer-causal-mask-leak-diagnosis'],
  ),
  competency(
    'transformer-residual-shape-contract',
    ['transformer-033-mlp-expansion', 'transformer-042-residual-width'],
    ['transformer-residual-width-worked'],
  ),
  competency(
    'transformer-normalization-order',
    ['transformer-030-layernorm-placement', 'transformer-031-pre-norm'],
    ['transformer-prenorm-order-worked'],
  ),
]);
