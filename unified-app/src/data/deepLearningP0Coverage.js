function competency(id, lessonId, quizIds, scenarioIds = [], minScenarioEvidence = 0) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
    minScenarioEvidence,
  });
}

export const DEEP_LEARNING_P0_AUDITED_LESSON_IDS = Object.freeze([
  'computation-graph-backprop',
  'neural-network',
  'relu',
  'leaky-relu',
]);

export const DEEP_LEARNING_P0_REQUIREMENTS = Object.freeze([
  competency(
    'backprop-chain-rule',
    'computation-graph-backprop',
    ['cgb-010-chain-rule', 'cgb-029-chain-to-z', 'cgb-030-chain-to-w'],
    ['backprop-branch-gradient-worked'],
  ),
  competency(
    'backprop-local-global-gradients',
    'computation-graph-backprop',
    ['cgb-008-local-derivative', 'cgb-009-upstream-gradient', 'cgb-047-input-gradient-use', 'cgb-060-two-branches'],
  ),
  competency(
    'backprop-broken-gradient-flow',
    'computation-graph-backprop',
    ['cgb-061-debug-no-update', 'cgb-063-debug-relu-silent', 'cgb-064-debug-disconnected'],
  ),
  competency(
    'backprop-incorrect-gradient-debugging',
    'computation-graph-backprop',
    ['cgb-062-debug-wrong-sign', 'cgb-066-debug-missing-factor', 'cgb-067-debug-relu-state', 'cgb-068-gradient-check-use'],
  ),
  competency(
    'activation-saturation',
    'relu',
    ['relu-033-positive-nonsaturation', 'relu-097-interview-saturation'],
    ['activation-saturation-gradient-diagnosis'],
    1,
  ),
  competency(
    'activation-dead-relu',
    'relu',
    ['relu-056-dead-diagnosis', 'relu-073-gradient-check'],
    ['relu-dead-units-lr-decision'],
    1,
  ),
  competency(
    'activation-sigmoid-tanh-limitations',
    'neural-network',
    ['nn-017-nonlinearity', 'nn-044-activation-choice'],
    ['activation-sigmoid-hidden-limitations', 'activation-tanh-hidden-limitations'],
    2,
  ),
  competency(
    'activation-gelu-leaky-relu-tradeoffs',
    'leaky-relu',
    ['lrelu-029-alpha-small-tradeoff', 'lrelu-096-interview-tradeoff'],
    ['activation-gelu-leaky-tradeoff'],
    1,
  ),
]);
