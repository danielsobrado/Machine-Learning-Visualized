export const P1_TRANSFORMER_COMPLEXITY_SCENARIOS_BY_LESSON = Object.freeze({
  transformer: [
    {
      id: 'transformer-complexity-sequence-doubling-worked',
      level: 'calculation',
      relatedComparison: 'linear-token-work-vs-quadratic-attention-pairs',
      scenario: 'A dense self-attention layer increases sequence length from 2,048 tokens to 4,096 tokens while model width and head count remain fixed.',
      prompt: 'How does the number of query-key score pairs change?',
      choices: [
        'It grows by about 4x because the score matrix changes from n by n to 2n by 2n',
        'It grows by about 2x because every transformer operation is linear in sequence length',
        'It stays constant because model width and head count did not change',
      ],
      answerIndex: 0,
      explanation: 'Dense self-attention forms interactions across token pairs. Doubling n changes n^2 pairwise scores to (2n)^2 = 4n^2. This is the source of the quadratic sequence-length term in attention compute.',
      misconceptionTested: 'Dense self-attention cost grows only linearly with sequence length.',
    },
    {
      id: 'transformer-complexity-attention-vs-mlp-decision',
      level: 'decision',
      relatedComparison: 'quadratic-sequence-term-vs-linear-sequence-projections',
      scenario: 'An engineer says attention must dominate transformer compute at every sequence length because attention contains an n-squared term. Another engineer notes that Q/K/V/output projections and the MLP perform large matrix multiplications involving d_model.',
      prompt: 'Which statement is the best complexity interpretation?',
      choices: [
        'Dense attention includes an O(n^2 d_model) token-pair term, while projections and the MLP contribute terms roughly O(n d_model^2); which dominates depends on sequence length, model width, and MLP expansion',
        'Attention always dominates regardless of n and d_model because any quadratic term is automatically larger than every linear term',
        'The MLP is quadratic in sequence length because its hidden dimension is wider than d_model',
      ],
      answerIndex: 0,
      explanation: 'Big-O terms have different variables and constants. Attention pair mixing grows quadratically with n, while dense projections and FFN layers are linear in n but often quadratic in model width. The dominant cost is regime-dependent.',
      misconceptionTested: 'The n-squared attention term proves attention is always the largest compute component in every transformer configuration.',
    },
    {
      id: 'transformer-complexity-parameters-vs-context-worked',
      level: 'mechanism',
      relatedComparison: 'fixed-parameters-vs-growing-activations',
      scenario: 'A fixed transformer checkpoint is evaluated first with 1,000 tokens and then with 8,000 tokens. No layers, widths, vocabulary entries, or learned position-table rows are added.',
      prompt: 'What changes purely because the input sequence is longer?',
      choices: [
        'The parameter count stays fixed, while runtime work and activation or cache memory grow with the number of processed token positions',
        'The model automatically creates eight times as many learned weights because every input token needs its own transformer block parameters',
        'Both parameter count and attention pair count remain fixed because the checkpoint file is unchanged',
      ],
      answerIndex: 0,
      explanation: 'Transformer layer weights are reused across token positions. Longer context therefore increases computation and runtime state, not the number of trained parameters in the fixed architecture.',
      misconceptionTested: 'Longer context increases transformer parameter count because each token position needs separate layer weights.',
    },
    {
      id: 'transformer-complexity-kv-cache-decode-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'cached-decode-vs-full-prefix-recomputation',
      scenario: 'A decoder uses a correct KV cache. An engineer claims the next-token attention step is now O(1) in context length because previous keys and values are cached.',
      prompt: 'What is wrong with that claim?',
      choices: [
        'Caching avoids recomputing historical K/V projections, but the new query still attends over the cached prefix, so per-token dense attention work grows roughly linearly with current context length and cache storage also grows with context',
        'Nothing; a KV cache removes the need to read previous keys and values during attention',
        'The cache makes decoding quadratic per generated token because it permanently stores the full n by n attention matrix',
      ],
      answerIndex: 0,
      explanation: 'KV caching removes repeated projection work for old tokens, which is a major decode optimization. It does not eliminate the need for the current query to score the visible cached keys and mix their values. Dense per-step attention therefore still scales with prefix length.',
      misconceptionTested: 'KV caching makes autoregressive attention constant-time with respect to context length.',
    },
    {
      id: 'transformer-complexity-attention-memory-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'naive-attention-materialization-vs-memory-efficient-kernel',
      scenario: 'A profiler shows that a naive attention implementation materializes an attention-score or probability tensor for every head. The team later switches to a tiled memory-efficient attention kernel.',
      prompt: 'Which memory statement is accurate?',
      choices: [
        'Naively materializing per-head attention matrices can require O(H n^2) intermediate storage, while memory-efficient kernels can avoid storing the full matrix even though exact dense attention still performs the token-pair computation',
        'Any exact dense attention implementation must permanently store every n by n matrix, so kernels cannot improve intermediate-memory complexity',
        'Memory-efficient attention removes the quadratic token-pair computation entirely and therefore becomes sparse attention automatically',
      ],
      answerIndex: 0,
      explanation: 'Memory-efficient exact attention kernels change how intermediates are tiled and recomputed, substantially reducing materialized activation memory. They do not by themselves change dense attention into a sparse algorithm or remove all pairwise score work.',
      misconceptionTested: 'Reducing attention activation memory necessarily changes the mathematical attention pattern or eliminates quadratic dense compute.',
    },
  ],
});

export function getP1TransformerComplexityScenariosForLesson(lessonId) {
  return P1_TRANSFORMER_COMPLEXITY_SCENARIOS_BY_LESSON[lessonId] || [];
}
