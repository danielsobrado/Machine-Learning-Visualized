export const P0_ATTENTION_SCENARIOS_BY_LESSON = Object.freeze({
  'attention-mechanism': [
    {
      id: 'attention-qkv-role-transfer',
      level: 'diagnosis',
      relatedComparison: 'query-key-matching-vs-value-content',
      scenario: 'An attention implementation computes similarity between the current token query and candidate key vectors correctly, but then returns a weighted sum of the key vectors themselves even though separate value vectors contain the information intended for downstream layers.',
      prompt: 'What conceptual bug is present?',
      choices: [
        'Queries should match against keys to produce weights, but those weights should mix the value vectors; keys identify what matches while values carry the retrieved content',
        'Queries should be compared directly with values and keys should never participate in attention scoring',
        'The weighted sum should always return the query vector because attention does not retrieve content from other positions',
      ],
      answerIndex: 0,
      explanation: 'The query-key interaction determines relevance. The resulting normalized weights are then applied to value vectors. Keeping key and value roles distinct is essential because the representation used for matching need not be the representation whose content is aggregated.',
      misconceptionTested: 'Keys and values are interchangeable because both are associated with the same source positions.',
    },
  ],
  'self-attention': [
    {
      id: 'attention-scaled-dot-product-worked',
      level: 'calculation',
      relatedComparison: 'raw-dot-product-vs-scaled-dot-product',
      scenario: 'For one query-key pair, q dot k = 12 and the key dimension d_k = 16. Scaled dot-product attention uses score = (q dot k) / sqrt(d_k) before softmax.',
      prompt: 'What score enters softmax, and why is the scaling used?',
      choices: [
        'The score is 3 because sqrt(16) = 4; scaling keeps large dot-product magnitudes from making softmax unnecessarily saturated as key dimension grows',
        'The score is 48 because attention multiplies by sqrt(d_k) so larger models always produce sharper distributions',
        'The score remains 12 because d_k affects only value vectors and never attention logits',
      ],
      answerIndex: 0,
      explanation: 'Scaled dot-product attention divides by sqrt(d_k), so 12 / 4 = 3. Without scaling, dot-product variance tends to grow with dimension, which can push softmax toward overly sharp distributions and weak gradients.',
      misconceptionTested: 'The sqrt(d_k) term is cosmetic or multiplies attention scores instead of scaling them down.',
    },
    {
      id: 'attention-softmax-key-axis-worked',
      level: 'calculation',
      relatedComparison: 'per-query-key-distribution-vs-global-matrix-normalization',
      scenario: 'Attention scores have shape [batch=2, heads=4, queries=3, keys=5]. Each query position must distribute its attention mass over the five candidate key positions independently.',
      prompt: 'Along which axis should softmax be applied, and what normalization property should hold?',
      choices: [
        'Across the key axis of length 5, so for every fixed batch, head, and query row the five attention weights sum to 1',
        'Across the query axis of length 3, so each key distributes one probability mass over all queries regardless of which token is querying',
        'Across all 120 score cells at once, so the entire attention tensor sums to 1 globally',
      ],
      answerIndex: 0,
      explanation: 'For each query, attention defines a distribution over keys it can read. Therefore softmax normalizes the key dimension independently for each batch/head/query combination rather than normalizing queries or the whole tensor together.',
      misconceptionTested: 'Attention softmax can be applied over any tensor axis without changing the meaning of the operation.',
    },
    {
      id: 'attention-shape-flow-worked',
      level: 'calculation',
      relatedComparison: 'qk-score-shape-vs-value-output-shape',
      scenario: 'For one multi-head self-attention layer, Q and K each have shape [B, H, T, d_k] = [2, 4, 6, 8]. V has shape [2, 4, 6, 10]. Ignore the later head concatenation and output projection.',
      prompt: 'What are the shapes of the attention score tensor QK^T and the per-head weighted-value output?',
      choices: [
        'Scores have shape [2, 4, 6, 6], and weights times V produce [2, 4, 6, 10]',
        'Scores have shape [2, 4, 8, 8], and the output remains [2, 4, 6, 8] because value dimension cannot differ from key dimension',
        'Scores have shape [2, 6, 4, 8], and the output collapses the token axis to [2, 4, 10]',
      ],
      answerIndex: 0,
      explanation: 'For each batch/head, Q has T query rows and K contributes T key rows, so QK^T creates a T by T score matrix. Multiplying those [T,T] weights by V [T,d_v] returns one d_v-dimensional mixture per query position, preserving B, H, and T.',
      misconceptionTested: 'Attention score shape is determined by d_k rather than query/key sequence lengths, or output width must equal d_k instead of d_v.',
    },
  ],
  'attention-masks': [
    {
      id: 'attention-mask-causal-padding-composition',
      level: 'calculation',
      relatedComparison: 'causal-time-visibility-vs-padding-validity',
      scenario: 'A right-padded decoder sequence has real tokens at positions 0, 1, 2 and padding at positions 3, 4. For query position 1, causal masking permits keys at positions at most 1, while padding masking permits only real-token keys.',
      prompt: 'Which key positions should remain visible after combining both masks?',
      choices: [
        'Only positions 0 and 1, because a key must be both non-padding and not in the query future',
        'Positions 0, 1, and 2, because padding masking automatically disables causal masking for real tokens',
        'Positions 3 and 4 only, because padding positions are needed to preserve the fixed tensor width',
      ],
      answerIndex: 0,
      explanation: 'Causal and padding masks enforce different constraints. Position 2 is real but future relative to query 1, while positions 3 and 4 are padding. The legal intersection is therefore positions 0 and 1.',
      misconceptionTested: 'A causal mask and a padding mask are interchangeable, or applying one makes the other unnecessary.',
    },
    {
      id: 'attention-mask-axis-leakage-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'correct-query-key-mask-vs-transposed-or-inverted-mask',
      scenario: 'A decoder training run reports suspiciously low loss. Inspecting the attention matrix shows query row 2 assigning substantial probability to key positions 3 and 4. The intended causal mask was created correctly, but a refactor transposed its query/key axes before broadcasting it into the score tensor.',
      prompt: 'What is the primary failure and validation check?',
      choices: [
        'Future-token leakage caused by applying the mask on the wrong query/key axes; verify row-by-row that every blocked future score receives a large negative penalty before softmax and near-zero probability afterward',
        'Expected causal behavior because transposing a triangular mask never changes which query-key pairs are legal',
        'A value-projection problem only; masks can be applied after value mixing without affecting information leakage',
      ],
      answerIndex: 0,
      explanation: 'Causal masking is directional. Transposing its query/key axes reverses the triangular visibility pattern and can expose future keys. The safest check is to inspect score rows before softmax and confirm illegal cells are blocked, then verify their probabilities are zero or numerically negligible.',
      misconceptionTested: 'Mask orientation and keep/block polarity are harmless implementation details that cannot create future information leakage.',
    },
  ],
});

export function getP0AttentionScenariosForLesson(lessonId) {
  return P0_ATTENTION_SCENARIOS_BY_LESSON[lessonId] || [];
}
