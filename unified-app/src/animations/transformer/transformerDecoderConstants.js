export const DECODER_SUBLAYERS = Object.freeze([
  Object.freeze({
    id: 'self-attention',
    label: '1. Causal self-attention',
    detail: 'Q, K, and V come from target-prefix states. Query position t cannot read target positions greater than t.',
  }),
  Object.freeze({
    id: 'cross-attention',
    label: '2. Cross-attention',
    detail: 'Q comes from the decoder; K and V come from encoder source states. This branch is specific to encoder–decoder models.',
  }),
  Object.freeze({
    id: 'ffn',
    label: '3. Position-wise FFN',
    detail: 'Each target position is transformed independently, then projected back to the residual-stream width.',
  }),
]);

export const CAUSAL_MASK = Object.freeze([
  Object.freeze([1, 0, 0, 0, 0]),
  Object.freeze([1, 1, 0, 0, 0]),
  Object.freeze([1, 1, 1, 0, 0]),
  Object.freeze([1, 1, 1, 1, 0]),
  Object.freeze([1, 1, 1, 1, 1]),
]);

export const TRAINING_TARGET_INPUT = Object.freeze(['<BOS>', 'I', 'am', 'a', 'cat']);
export const TRAINING_TARGET_LABELS = Object.freeze(['I', 'am', 'a', 'cat', '.']);
export const INFERENCE_PREFIX = Object.freeze(['<BOS>', 'The', 'cat']);

export const DECODER_EXECUTION = Object.freeze({
  training: Object.freeze({
    label: 'Teacher-forced training',
    inputLabel: 'Decoder input rows',
    input: TRAINING_TARGET_INPUT,
    outputLabel: 'Next-token labels',
    output: TRAINING_TARGET_LABELS,
    explanation: 'The target sequence is shifted once to form input/label pairs. The decoder evaluates all target positions in parallel inside the forward pass while the causal mask prevents position t from reading later target tokens.',
  }),
  inference: Object.freeze({
    label: 'Autoregressive inference',
    inputLabel: 'Generated prefix',
    input: INFERENCE_PREFIX,
    outputLabel: 'Next action',
    output: Object.freeze(['score next token', 'select', 'append', 'repeat']),
    explanation: 'There is no ground-truth target sequence to shift. The model consumes the available prefix, selects one next token, appends it, and repeats. KV caching can avoid recomputing old target self-attention keys and values.',
  }),
});
