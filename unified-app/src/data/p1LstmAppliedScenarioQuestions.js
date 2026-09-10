export const P1_LSTM_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  lstm: Object.freeze([
    Object.freeze({
      id: 'lstm-cell-state-hidden-update-worked',
      level: 'calculation',
      relatedComparison: 'forget-retention-vs-candidate-write-vs-output-exposure',
      scenario: 'For one scalar LSTM component, the previous cell state is c_prev = 1.6. The forget gate is f = 0.75, the input gate is i = 0.40, the candidate value is g = -0.50, and the output gate is o = 0.60. Use c_t = f*c_prev + i*g and tanh(1.0) ~= 0.762.',
      prompt: 'What are the updated cell state c_t and hidden state h_t?',
      choices: Object.freeze([
        'c_t = 1.0 and h_t is about 0.457, because 0.75*1.6 + 0.40*(-0.50) = 1.0 and 0.60*tanh(1.0) is about 0.457',
        'c_t = 1.4 and h_t = 0.84, because gate values should be added to the previous memory rather than multiplied elementwise',
        'c_t = -0.20 and h_t is about -0.119, because the forget contribution should be discarded whenever the candidate is negative',
      ]),
      answerIndex: 0,
      explanation: 'The retained memory is 0.75*1.6 = 1.2 and the gated candidate write is 0.40*(-0.50) = -0.2, so c_t = 1.0. The exposed hidden state is o*tanh(c_t) = 0.60*0.762, about 0.457. The cell can preserve internal memory while the output gate controls how much is exposed.',
      misconceptionTested: 'LSTM gates are labels or additive switches rather than multiplicative controls over retained memory, candidate writes, and exposed hidden state.',
    }),
    Object.freeze({
      id: 'lstm-padding-mask-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'real-sequence-steps-vs-padding-state-and-loss-contamination',
      scenario: 'A batch contains sequences of lengths 3 and 7, padded to length 7. The implementation feeds all seven positions through the LSTM for both examples and also includes all padded positions in the token-level loss. Validation quality changes noticeably when the padding token value changes, even though the real sequence tokens are identical.',
      prompt: 'What should be fixed first?',
      choices: Object.freeze([
        'Mask or pack padded positions so they do not update sequence semantics or contribute to the loss as real observations',
        'Increase the hidden size because a larger LSTM should learn to interpret every arbitrary padding value as useful evidence',
        'Keep the current logic because padding is guaranteed to be harmless once an LSTM has forget gates',
      ]),
      answerIndex: 0,
      explanation: 'Padding is an batching artifact, not sequence evidence. If padded positions update state or receive ordinary loss, predictions can depend on arbitrary padding length or value. Packing, masking, or an equivalent length-aware implementation should keep padded steps outside the modeled sequence and objective.',
      misconceptionTested: 'LSTM gates automatically make padding semantically invisible, so padding masks and loss masks are unnecessary.',
    }),
    Object.freeze({
      id: 'lstm-truncated-bptt-state-detach-design',
      level: 'design',
      relatedComparison: 'stream-state-continuity-vs-truncated-gradient-history',
      scenario: 'A continuous sensor stream is trained in 64-step truncated-BPTT windows. Resetting h and c at every window destroys useful cross-window context. Keeping the exact autograd graph attached across every window eventually causes memory use to grow as if the whole stream were fully unrolled.',
      prompt: 'Which state policy preserves the intended truncated-BPTT behavior?',
      choices: Object.freeze([
        'Carry the numerical hidden and cell states across contiguous windows but detach them from the previous autograd graph at each truncation boundary; reset only at real independent-stream boundaries',
        'Reset hidden and cell states every 64 steps because truncating gradients means all forward-state information must also be erased',
        'Keep every state connected to the complete historical computation graph because truncated BPTT should backpropagate through the full stream eventually',
      ]),
      answerIndex: 0,
      explanation: 'Truncated BPTT limits gradient history, not necessarily forward-state continuity. Detaching h and c cuts the autograd graph while retaining their values as context for the next contiguous window. True sequence boundaries still require a state reset to prevent leakage between independent streams.',
      misconceptionTested: 'Truncating recurrent gradients requires resetting recurrent state, or state can be carried only by retaining the entire historical autograd graph.',
    }),
  ]),
});
