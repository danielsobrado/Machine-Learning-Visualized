export const P0_TRANSFORMER_ARCHITECTURE_SCENARIOS_BY_LESSON = Object.freeze({
  transformer: [
    {
      id: 'transformer-block-dataflow-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'complete-block-vs-attention-only',
      scenario: 'A decoder block computes self-attention correctly, but the implementation replaces the residual stream with the attention output and then sends that tensor directly to the next layer. The MLP branch and its residual update are missing.',
      prompt: 'What is the core architecture failure?',
      choices: [
        'The code implemented an attention layer rather than a complete transformer block; the residual stream must preserve the prior state while attention and the positionwise MLP contribute width-matched updates',
        'The block is complete because attention is the only required learned component in a transformer',
        'The missing MLP matters only for tokenization and does not affect hidden-state computation',
      ],
      answerIndex: 0,
      explanation: 'A transformer block is not attention alone. Attention mixes information across positions, the MLP performs a nonlinear per-position transform, and residual paths preserve the existing stream while both branches add updates.',
      misconceptionTested: 'A transformer block is just self-attention, so residual and MLP paths are optional implementation details.',
    },
    {
      id: 'transformer-causal-mask-leak-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'causal-visibility-vs-future-leakage',
      scenario: 'During teacher-forced decoder training, token position 5 places substantial attention weight on target positions 6 and 7. The labels and optimizer are otherwise correct.',
      prompt: 'What should be checked first?',
      choices: [
        'Verify that the causal mask blocks future query-key scores before softmax and that the input-target shift is aligned',
        'Increase the MLP expansion ratio because feed-forward width determines which future tokens are visible',
        'Remove positional information because positions are what create future-token leakage',
      ],
      answerIndex: 0,
      explanation: 'Autoregressive decoder training must prevent each query position from reading later target positions. The visibility constraint is applied to attention logits before softmax, and an off-by-one input-target shift can create a second leakage path.',
      misconceptionTested: 'Teacher forcing allows decoder self-attention to read future target tokens during next-token training.',
    },
    {
      id: 'transformer-residual-width-worked',
      level: 'calculation',
      relatedComparison: 'mlp-expansion-vs-residual-width',
      scenario: 'A transformer uses d_model = 768 and an MLP expansion ratio of 4. The first MLP projection maps each token from 768 to 3,072 features before the activation.',
      prompt: 'What width must the second MLP projection return before the residual addition, and why?',
      choices: [
        '768, because the MLP branch must return to the residual-stream width so its output can be added elementwise to the existing hidden state',
        '3,072, because a residual connection always expands to the widest intermediate tensor',
        '4, because the expansion ratio becomes the output width after the activation',
      ],
      answerIndex: 0,
      explanation: 'The expansion is internal to the positionwise MLP. Its second projection contracts back to d_model so the branch output has the same width as the residual stream.',
      misconceptionTested: 'The expanded FFN width becomes the permanent transformer hidden width after the MLP.',
    },
    {
      id: 'transformer-prenorm-order-worked',
      level: 'mechanism',
      relatedComparison: 'pre-norm-vs-post-norm-block-order',
      scenario: 'A model configuration specifies a pre-norm attention sublayer. Let x be the incoming residual stream and A be the attention function.',
      prompt: 'Which update matches the stated architecture?',
      choices: [
        'x_next = x + A(LN(x)); normalization feeds the sublayer and the sublayer result is added back to the untouched residual path',
        'x_next = LN(x + A(x)); this is the defining pre-norm update',
        'x_next = A(x); pre-norm means the residual connection is removed',
      ],
      answerIndex: 0,
      explanation: 'In a pre-norm block the normalized stream is passed into the sublayer, while the skip path carries x directly to the residual addition. Post-norm instead normalizes after the residual update.',
      misconceptionTested: 'Pre-norm and post-norm are interchangeable names for the same ordering.',
    },
  ],
});

export function getP0TransformerArchitectureScenariosForLesson(lessonId) {
  return P0_TRANSFORMER_ARCHITECTURE_SCENARIOS_BY_LESSON[lessonId] || [];
}
