function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'lstm',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const LSTM_P1_REQUIREMENTS = Object.freeze([
  competency(
    'lstm-gated-cell-hidden-update',
    ['lstm-025-cell-update', 'lstm-026-output-equation'],
    ['lstm-cell-state-hidden-update-worked'],
  ),
  competency(
    'lstm-sequence-boundary-padding-truncation',
    ['lstm-038-truncation', 'lstm-039-masking', 'lstm-046-stateful', 'lstm-047-reset-boundary'],
    ['recurrent-state-boundary-diagnosis', 'lstm-padding-mask-diagnosis', 'lstm-truncated-bptt-state-detach-design'],
  ),
  competency(
    'lstm-long-dependency-gradient-path',
    ['lstm-027-additive-path', 'lstm-028-gradient', 'lstm-045-clipping'],
    ['recurrent-long-dependency-mechanism', 'recurrent-gradient-pathology-diagnosis'],
  ),
  competency(
    'lstm-architecture-efficiency-tradeoff',
    ['lstm-015-long-context', 'lstm-016-not-perfect', 'lstm-049-computation-cost'],
    ['recurrent-rnn-lstm-gru-model-choice'],
  ),
]);
