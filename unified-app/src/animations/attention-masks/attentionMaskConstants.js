export const SELF_TOKENS = ['The', 'model', 'predicts', '[PAD]', '[PAD]'];
export const DECODER_TOKENS = ['The', 'cat', 'sat'];
export const ENCODER_TOKENS = ['Le', 'chat', 'assis', '[PAD]'];

export const ATTENTION_MASK_MODES = {
  bidirectional: {
    label: 'Bidirectional',
    detail: 'Encoder-style self-attention can read every real token in the sequence.',
  },
  causal: {
    label: 'Causal',
    detail: 'Decoder self-attention hides future tokens so next-token prediction cannot cheat.',
  },
  padding: {
    label: 'Padding',
    detail: 'Padding masks remove artificial [PAD] keys from attention.',
  },
  cross: {
    label: 'Cross-attention',
    detail: 'Decoder queries read encoder keys and values while source padding stays masked.',
  },
};

export const MASK_ORDER_EXAMPLE = {
  scores: [3, 2, 5],
  allowed: [true, true, false],
  values: [1, 3, 100],
};
