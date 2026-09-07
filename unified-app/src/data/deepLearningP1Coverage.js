function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DEEP_LEARNING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'neural-network',
  'optimizers',
  'regularization',
  'dropout-batchnorm',
  'layer-normalization',
]);

export const DEEP_LEARNING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'fundamentals-xor-nonlinearity',
    'neural-network',
    ['nn-051-xor-case', 'nn-053-no-activation-case'],
    ['nn-fundamentals-xor-nonlinearity'],
  ),
  competency(
    'fundamentals-tensor-shapes',
    'neural-network',
    ['nn-022-shapes', 'nn-052-shape-error-case'],
    ['nn-fundamentals-tensor-shape-worked'],
  ),
  competency(
    'fundamentals-parameter-counting',
    'neural-network',
    ['nn-013-parameters'],
    ['nn-fundamentals-parameter-count-worked'],
  ),
  competency(
    'fundamentals-forward-pass-reasoning',
    'neural-network',
    ['nn-021-dense-equation', 'nn-064-learning-case'],
    ['nn-fundamentals-forward-pass-worked'],
  ),
  competency(
    'optimization-sgd-momentum-adam',
    'optimizers',
    ['opt-004-sgd', 'opt-011-momentum', 'opt-013-adam'],
    ['optimizer-sgd-momentum-adam-choice'],
  ),
  competency(
    'optimization-learning-rate',
    'optimizers',
    ['opt-005-learning-rate', 'opt-006-too-large', 'opt-007-too-small'],
    ['optimizer-learning-rate-overshoot-worked'],
  ),
  competency(
    'optimization-schedules',
    'optimizers',
    ['opt-052-slow-case', 'opt-057-momentum-case', 'opt-061-late-oscillation-case'],
    ['optimizer-schedule-phase-choice'],
  ),
  competency(
    'optimization-weight-decay-vs-l2',
    'regularization',
    ['reg-023-l2-gradient', 'reg-026-weight-decay', 'reg-027-decoupled-weight-decay'],
    ['optimizer-weight-decay-vs-l2-adamw'],
  ),
  competency(
    'normalization-batchnorm-vs-layernorm',
    'layer-normalization',
    ['ln-012-batchnorm-difference', 'ln-040-batchnorm-contrast', 'ln-093-interview-batchnorm'],
    ['layernorm-vs-batchnorm'],
  ),
  competency(
    'normalization-small-batch-behavior',
    'dropout-batchnorm',
    ['dbn-028-batch-size', 'dbn-055-small-batch-finetune'],
    ['batchnorm-small-batch'],
  ),
  competency(
    'normalization-train-eval-statistics',
    'dropout-batchnorm',
    ['dbn-011-bn-training', 'dbn-012-bn-eval', 'dbn-054-bn-inference-bug'],
    ['dropout-batchnorm-eval-mode-diagnosis'],
  ),
]);
