export const P1_MULTI_HEAD_POSITIONAL_SCENARIOS_BY_LESSON = Object.freeze({
  'grouped-query-attention': [
    {
      id: 'multihead-diverse-subspaces-decision',
      level: 'decision',
      relatedComparison: 'single-head-vs-multiple-projected-heads',
      scenario: 'A transformer uses one wide attention head and reaches acceptable loss, but analysis suggests some tokens need syntactic relationships while others need long-range entity links at the same layer. The team considers splitting the same model width across several independently projected heads.',
      prompt: 'What is the strongest reason to try multiple heads?',
      choices: [
        'Independent Q/K/V projections let different heads learn different matching subspaces and relationships in parallel, while acknowledging that specialization is learned rather than guaranteed',
        'Every head is guaranteed to discover one unique human-interpretable linguistic rule',
        'Multiple heads remove the need for an output projection because their outputs are already one scalar each',
      ],
      answerIndex: 0,
      explanation: 'Multi-head attention gives the layer several learned projection spaces so different query-key relationships and value mixtures can coexist. This increases representational flexibility, but heads can still overlap or become redundant, so specialization should be measured rather than assumed.',
      misconceptionTested: 'Multiple heads are useful only because each head is guaranteed to learn one distinct interpretable concept.',
    },
    {
      id: 'multihead-dimension-accounting-worked',
      level: 'calculation',
      relatedComparison: 'model-width-vs-head-width',
      scenario: 'A standard attention block has d_model = 768 and H = 12 equal-width heads. The implementation splits the projected query, key, and value width evenly across heads.',
      prompt: 'What is the per-head width, and what width is recovered after concatenating all 12 head outputs?',
      choices: [
        'Each head has width 64, and concatenating 12 heads recovers width 768',
        'Each head has width 768, so concatenation produces width 9,216 by definition',
        'Each head has width 12, and concatenation produces width 144',
      ],
      answerIndex: 0,
      explanation: 'For the common equal split, d_head = d_model / H = 768 / 12 = 64. Concatenating the 12 per-head outputs restores 12 * 64 = 768 features before the output projection.',
      misconceptionTested: 'Each attention head normally keeps the entire model width, causing concatenated width to multiply by the number of heads.',
    },
    {
      id: 'multihead-concat-output-projection-worked',
      level: 'calculation',
      relatedComparison: 'head-concatenation-vs-output-mixing',
      scenario: 'An attention layer has 8 heads, each producing a 64-dimensional value mixture for every token. The head outputs are concatenated and passed through W_O. Assume d_model = 512.',
      prompt: 'What shape does the concatenated vector have per token, and what role does W_O play?',
      choices: [
        'The concatenated vector has width 512; W_O maps and mixes information across those concatenated head features back into the model representation',
        'The concatenated vector has width 64; W_O merely chooses which single head survives',
        'The concatenated vector has width 4,096; W_O is required only to divide by the number of heads',
      ],
      answerIndex: 0,
      explanation: 'Eight 64-dimensional head outputs concatenate to 512 dimensions. The learned output projection W_O combines information across head feature blocks and produces the representation consumed by the residual stream or next layer.',
      misconceptionTested: 'Concatenation itself mixes head information, or the output projection simply selects one winning head.',
    },
    {
      id: 'multihead-redundant-heads-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'useful-specialization-vs-redundant-heads',
      scenario: 'Two attention heads have highly correlated attention outputs across the evaluation set. Zeroing either head alone barely changes task quality, and pruning one head followed by a short recovery fine-tune preserves performance.',
      prompt: 'What is the best interpretation?',
      choices: [
        'The heads are likely providing redundant capacity for this task; head diversity is not guaranteed, so ablation and pruning evidence are stronger than assuming every head is uniquely necessary',
        'The model is invalid because two heads are mathematically forbidden from learning similar functions',
        'The heads must be unique because they have different parameter tensors, regardless of their measured outputs and ablation effect',
      ],
      answerIndex: 0,
      explanation: 'Separate parameters make specialization possible, not mandatory. Correlated behavior plus negligible ablation cost is evidence of redundancy. Head-importance and pruning studies should use task metrics rather than treating head count as a guarantee of distinct functionality.',
      misconceptionTested: 'Every attention head necessarily contributes a unique indispensable function simply because it has separate parameters.',
    },
  ],
  'positional-encoding': [
    {
      id: 'position-order-necessity-permutation-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'content-only-attention-vs-position-aware-attention',
      scenario: 'A self-attention encoder receives the same multiset of token embeddings in two different orders. The implementation supplies no positional embeddings, rotary positions, relative biases, or other position signal.',
      prompt: 'What order-related limitation should you expect?',
      choices: [
        'The attention computation has no explicit signal telling it which occurrence came first or second, so reordering tokens mainly permutes the corresponding representations rather than encoding sequence order by itself',
        'Softmax automatically recovers the original word order from tensor memory addresses',
        'Causal or padding masks are always sufficient to encode the exact absolute position of every token even when neither mask is present',
      ],
      answerIndex: 0,
      explanation: 'Vanilla self-attention operates on token content without an inherent recurrence or convolutional scan. A positional mechanism is needed when the task depends on order. Masks and positions solve different problems: visibility constraints are not a general replacement for position representation.',
      misconceptionTested: 'Self-attention automatically knows token order solely from the row order of the input tensor.',
    },
    {
      id: 'position-sinusoidal-vs-learned-decision',
      level: 'decision',
      relatedComparison: 'fixed-sinusoidal-vs-learned-absolute-position',
      scenario: 'A team is choosing between classic sinusoidal positions and a learned absolute position table. They want to understand the real trade-off rather than assume one is universally better.',
      prompt: 'Which comparison is technically sound?',
      choices: [
        'Sinusoidal positions are parameter-free and formula-defined at arbitrary indices, while learned absolute positions use trainable rows and can adapt to the training distribution; neither choice alone guarantees reliable long-context extrapolation',
        'Learned absolute positions are always better because they mathematically generalize to unseen indices without additional rows',
        'Sinusoidal positions guarantee unchanged model quality at any sequence length because the sine and cosine formulas can be evaluated there',
      ],
      answerIndex: 0,
      explanation: 'Fixed sinusoidal encodings have no learned table and can be computed beyond observed positions. Learned absolute embeddings provide flexible trainable position vectors but have a finite learned index set unless extended. In both cases, model behavior outside the training context still requires empirical validation.',
      misconceptionTested: 'Formula-defined positions guarantee long-context generalization, or learned absolute positions automatically define unseen position rows.',
    },
  ],
});

export function getP1MultiHeadPositionalScenariosForLesson(lessonId) {
  return P1_MULTI_HEAD_POSITIONAL_SCENARIOS_BY_LESSON[lessonId] || [];
}
