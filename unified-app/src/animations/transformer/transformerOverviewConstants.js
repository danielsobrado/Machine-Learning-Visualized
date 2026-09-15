export const ORIGINAL_TRANSFORMER_STACKS = Object.freeze([
  Object.freeze({
    id: 'encoder',
    label: 'Encoder stack',
    input: 'Source token embeddings + position signal',
    sublayers: Object.freeze([
      'Full self-attention over valid source tokens',
      'Position-wise feed-forward network',
    ]),
    output: 'Contextual source representations',
  }),
  Object.freeze({
    id: 'decoder',
    label: 'Decoder stack',
    input: 'Target-prefix embeddings + position signal',
    sublayers: Object.freeze([
      'Causal target self-attention',
      'Cross-attention: decoder Q, encoder K/V',
      'Position-wise feed-forward network',
    ]),
    output: 'Target hidden states → vocabulary logits',
  }),
]);

export const ORIGINAL_TRANSFORMER_FLOW = Object.freeze([
  Object.freeze({ id: 'source', label: 'Source tokens', detail: 'The encoder receives the full source sequence.' }),
  Object.freeze({ id: 'encode', label: 'Encode', detail: 'Bidirectional source self-attention builds contextual source states.' }),
  Object.freeze({ id: 'target', label: 'Target prefix', detail: 'Training uses shifted ground-truth targets; inference uses generated tokens so far.' }),
  Object.freeze({ id: 'decode', label: 'Decode', detail: 'Causal self-attention reads the target prefix; cross-attention reads encoder states.' }),
  Object.freeze({ id: 'logits', label: 'Vocabulary logits', detail: 'A projection scores the vocabulary at each target position.' }),
]);

export const EXECUTION_MODES = Object.freeze({
  training: Object.freeze({
    label: 'Training',
    targetInput: 'Shifted ground-truth target sequence',
    parallelism: 'All target positions can be evaluated in parallel inside a training forward pass because the causal mask blocks future target information.',
    output: 'A next-token loss can be computed at every target position in the same forward pass.',
  }),
  inference: Object.freeze({
    label: 'Autoregressive inference',
    targetInput: 'Prompt / generated prefix',
    parallelism: 'Generation has a serial outer loop: select one next token, append it, then run the next decode step.',
    output: 'Only the newest-position logits are needed to choose the next token; KV caching can reuse prior keys and values.',
  }),
});

export const ARCHITECTURE_SCOPE_NOTE = 'The diagram below is the original encoder–decoder pattern. Encoder-only models omit the decoder; decoder-only language models omit the encoder and cross-attention.';
