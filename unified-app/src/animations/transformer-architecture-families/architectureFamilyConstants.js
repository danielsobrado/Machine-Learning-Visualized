export const TRANSFORMER_ARCHITECTURE_FAMILIES = Object.freeze({
  encoder: Object.freeze({
    label: 'Encoder-only',
    example: 'BERT',
    objectiveLabel: 'Representation / masked token',
    objective: 'Masked-token, classification, ranking, or other representation-learning objectives',
    attention: 'Bidirectional self-attention over visible input tokens',
    output: 'Contextual representations for classification, search, extraction, reranking, or other downstream heads',
    execution: 'The full input is available to the encoder in one forward pass.',
    prompt: Object.freeze(['[CLS]', 'the', 'movie', '[MASK]', 'great', '[SEP]']),
    target: Object.freeze(['was']),
    targetLabel: 'Predicted masked content',
    visible: 'All valid input tokens are mutually visible under the standard full-attention encoder pattern.',
    color: 'cyan',
  }),
  decoder: Object.freeze({
    label: 'Decoder-only',
    example: 'GPT-2',
    objectiveLabel: 'Causal LM',
    objective: 'Autoregressive next-token prediction under a causal mask',
    attention: 'Causal self-attention over the token prefix',
    output: 'Training can score next-token logits at all positions in parallel; autoregressive inference selects and appends one token per decode step',
    execution: 'Causal masking preserves prefix-only visibility during training, while inference has a serial outer generation loop.',
    prompt: Object.freeze(['The', 'model', 'writes']),
    target: Object.freeze(['the', 'next', 'token']),
    targetLabel: 'Example continuation',
    visible: 'Each query sees its own position and earlier prefix positions, never future tokens.',
    color: 'emerald',
  }),
  encoderDecoder: Object.freeze({
    label: 'Encoder-decoder',
    example: 'T5',
    objectiveLabel: 'Conditional seq2seq',
    objective: 'Conditional target prediction from an encoded source sequence',
    attention: 'Encoder full self-attention plus decoder causal self-attention and cross-attention',
    output: 'Training can score target positions in parallel under causal masking; inference generates target tokens autoregressively while cross-attending to source states',
    execution: 'The source is encoded once; the target decoder uses the visible target prefix plus encoder source states.',
    prompt: Object.freeze(['translate:', 'good', 'morning']),
    target: Object.freeze(['buenos', 'dias']),
    targetLabel: 'Example target sequence',
    visible: 'Decoder self-attention sees the target prefix; cross-attention can read valid encoded source positions.',
    color: 'violet',
  }),
});

export const FAMILY_COLORS = Object.freeze({
  cyan: Object.freeze({
    active: 'border-cyan-500 bg-cyan-600 text-white',
    soft: 'border-cyan-200 bg-cyan-50 text-cyan-950',
    line: '#0891b2',
  }),
  emerald: Object.freeze({
    active: 'border-emerald-500 bg-emerald-600 text-white',
    soft: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    line: '#059669',
  }),
  violet: Object.freeze({
    active: 'border-violet-500 bg-violet-600 text-white',
    soft: 'border-violet-200 bg-violet-50 text-violet-950',
    line: '#7c3aed',
  }),
});

export const FULL_ATTENTION_MATRIX = Object.freeze(
  Array.from({ length: 5 }, () => Object.freeze([1, 1, 1, 1, 1])),
);

export const CAUSAL_ATTENTION_MATRIX = Object.freeze([
  Object.freeze([1, 0, 0, 0, 0]),
  Object.freeze([1, 1, 0, 0, 0]),
  Object.freeze([1, 1, 1, 0, 0]),
  Object.freeze([1, 1, 1, 1, 0]),
  Object.freeze([1, 1, 1, 1, 1]),
]);
