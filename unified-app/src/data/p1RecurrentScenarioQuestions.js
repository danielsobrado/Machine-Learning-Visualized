export const P1_RECURRENT_SCENARIOS_BY_LESSON = Object.freeze({
  lstm: [
    {
      id: 'recurrent-state-boundary-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'stateful-stream-vs-independent-sequences',
      scenario: 'A stateful recurrent model processes one customer session after another without resetting hidden or cell state. Predictions for the first event of a new customer depend on what the previous customer did.',
      prompt: 'What is the first bug to investigate?',
      choices: [
        'State is leaking across unrelated sequence boundaries; carry recurrent state only across truly contiguous steps and reset it when a new independent sequence begins',
        'Recurrent models are supposed to mix state across unrelated examples because hidden state replaces the training labels',
        'Increase the hidden-state size so information from the previous customer can be preserved even more accurately',
      ],
      answerIndex: 0,
      explanation: 'Recurrent state represents prior context from the same logical sequence. Carrying it across independent examples creates cross-example leakage and makes predictions depend on processing order.',
      misconceptionTested: 'Stateful recurrence means hidden state should persist across every batch and every unrelated sequence.',
    },
    {
      id: 'recurrent-long-dependency-mechanism',
      level: 'mechanism',
      relatedComparison: 'plain-rnn-overwrite-vs-gated-memory',
      scenario: 'A sequence contains an important event near the beginning whose effect must remain available 150 time steps later. A plain tanh RNN repeatedly rewrites one hidden state, while an LSTM or GRU can learn gates that regulate how much prior information is retained or replaced.',
      prompt: 'Why can gated recurrent units help on this dependency?',
      choices: [
        'Their learned gates create controlled update paths that can preserve useful state for longer instead of forcing a full nonlinear overwrite at every step, although long-term memory is still not guaranteed',
        'LSTMs and GRUs bypass backpropagation entirely, so sequence length no longer affects learning',
        'A plain RNN, LSTM, and GRU have identical state-update equations; only their names differ',
      ],
      answerIndex: 0,
      explanation: 'Gating gives the model mechanisms for retaining and updating state selectively. LSTMs use a distinct cell-state path, while GRUs use update/reset gates around a simpler state representation. Both can reduce the pressure to overwrite relevant context every step.',
      misconceptionTested: 'Gated recurrent architectures guarantee perfect memory or are mathematically equivalent to a plain RNN.',
    },
    {
      id: 'recurrent-gradient-pathology-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'vanishing-vs-exploding-recurrent-gradients',
      scenario: 'When a plain tanh RNN is unrolled for 200 steps, gradient norms associated with early time steps fall from about 1e-2 near the loss to below 1e-10 near the beginning. The team proposes gradient clipping as the main fix.',
      prompt: 'What is the diagnosis and why is clipping not the primary remedy here?',
      choices: [
        'This is vanishing-gradient behavior through the long recurrent chain; clipping limits overly large gradients but cannot restore gradients that have already decayed toward zero, so gated state paths, initialization, normalization, truncation choices, or architecture changes should be considered',
        'This is exploding-gradient behavior, and clipping is guaranteed to reconstruct the missing early-step learning signal',
        'The tiny early gradients prove the recurrent model has fully converged and no diagnostic action is needed',
      ],
      answerIndex: 0,
      explanation: 'Repeated Jacobian products can shrink gradients exponentially through time. Gradient clipping is useful for explosions, not for resurrecting vanished gradients. LSTM/GRU gating can improve gradient retention but does not eliminate every recurrent optimization problem.',
      misconceptionTested: 'Gradient clipping is a universal fix for both exploding and vanishing gradients in recurrent networks.',
    },
    {
      id: 'recurrent-rnn-lstm-gru-model-choice',
      level: 'decision',
      relatedComparison: 'plain-rnn-vs-gru-vs-lstm',
      scenario: 'A streaming sensor task has moderate long-range dependencies, limited training data, and a strict latency/parameter budget. A plain RNN is smallest but forgets useful context in initial experiments. Both GRU and LSTM reach similar validation quality, while the GRU uses fewer gates and parameters.',
      prompt: 'What is the strongest model-selection conclusion?',
      choices: [
        'Prefer the GRU as the current engineering baseline because it meets quality with lower recurrent complexity, while benchmarking the LSTM if harder dependencies appear; model choice should follow measured task trade-offs rather than a universal architecture ranking',
        'Always choose the LSTM because it is categorically more accurate than every GRU and plain RNN on every sequence task',
        'Return to the plain RNN because fewer parameters automatically compensate for its observed inability to retain the required context',
      ],
      answerIndex: 0,
      explanation: 'GRUs combine gating with a simpler state update than LSTMs and can be a good efficiency/quality trade-off. LSTMs provide a separate cell state and more explicit gating capacity. The right choice depends on dependency length, data, latency, memory, and measured validation behavior.',
      misconceptionTested: 'RNN, GRU, and LSTM have a fixed universal ranking that makes task-specific benchmarking unnecessary.',
    },
  ],
});

export function getP1RecurrentScenariosForLesson(lessonId) {
  return P1_RECURRENT_SCENARIOS_BY_LESSON[lessonId] || [];
}
