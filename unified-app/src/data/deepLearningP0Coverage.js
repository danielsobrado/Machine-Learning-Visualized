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
  'initialization',
  'gradient-problems',
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
  competency(
    'initialization-symmetry-breaking',
    'initialization',
    ['init-055-same-weight-case', 'init-095-interview-symmetry'],
    ['initialization-symmetry-breaking-diagnosis'],
    1,
  ),
  competency(
    'initialization-xavier-vs-he',
    'initialization',
    ['init-053-relu-case', 'init-078-trap-xavier'],
    ['initialization-xavier-he-activation-choice'],
    1,
  ),
  competency(
    'initialization-activation-dependent-scaling',
    'initialization',
    ['init-016-activation-match', 'init-097-interview-activation'],
    ['init-he-fan-in-worked'],
    1,
  ),
  competency(
    'gradient-pathology-diagnosis',
    'gradient-problems',
    ['grp-051-diagnose-flat-early', 'grp-052-diagnose-nans'],
    ['gradient-depth-profile-diagnosis'],
    1,
  ),
  competency(
    'gradient-depth-effects',
    'gradient-problems',
    ['grp-053-depth-change', 'grp-054-multiplier-below-one', 'grp-055-multiplier-above-one'],
  ),
  competency(
    'gradient-clipping-guardrail',
    'gradient-problems',
    ['grp-057-use-clipping', 'grp-058-clip-not-enough', 'grp-068-clip-threshold-tune'],
    ['gradient-clipping-norm-worked'],
    1,
  ),
  competency(
    'gradient-initialization-normalization-remediation',
    'gradient-problems',
    ['grp-061-weight-init-small', 'grp-062-weight-init-large', 'grp-066-layer-localization'],
    ['gradient-stabilization-mechanism-choice'],
    1,
  ),
]);
