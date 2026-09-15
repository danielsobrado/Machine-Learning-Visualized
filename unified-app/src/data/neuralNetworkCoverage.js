function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    scenarioIds: Object.freeze(scenarioIds),
  });
}

export const NEURAL_NETWORK_AUDITED_LESSON_IDS = Object.freeze([
  "gradient-descent",
  "neural-network",
  "initialization",
  "optimizers",
  "training-loop-dynamics",
  "dropout-batchnorm",
  "gradient-problems",
  "layer-normalization",
  "relu",
  "leaky-relu",
  "softmax",
  "conv2d",
  "conv-relu",
  "max-pooling",
  "computation-graph-backprop",
]);

export const NEURAL_NETWORK_COVERAGE = Object.freeze({
  "gradient-descent": requirement(["gd-quadratic-step-worked"]),
  "neural-network": requirement([
    "nn-fundamentals-xor-nonlinearity",
    "nn-fundamentals-tensor-shape-worked",
    "nn-fundamentals-parameter-count-worked",
    "nn-fundamentals-forward-pass-worked",
    "nn-capacity-serving-tradeoff-worked",
  ]),
  "initialization": requirement([
    "init-he-fan-in-worked",
    "init-symmetry-breaking-diagnosis",
    "init-rectangular-fan-direction-diagnosis",
  ]),
  "optimizers": requirement([
    "optimizer-resume-state-diagnosis",
    "optimizer-sgd-momentum-adam-choice",
    "optimizer-learning-rate-overshoot-worked",
    "optimizer-schedule-phase-choice",
  ]),
  "training-loop-dynamics": requirement([
    "loop-batch-lr-interaction",
    "loop-gradient-accumulation-equivalence",
    "training-loop-scheduler-accumulation-diagnosis",
  ]),
  "dropout-batchnorm": requirement([
    "dropout-batchnorm-eval-mode-diagnosis",
    "dropout-module-mode-vs-autograd-diagnosis",
  ]),
  "gradient-problems": requirement([
    "gradient-problem-differential-diagnosis",
    "gradient-clipping-norm-worked",
  ]),
  "layer-normalization": requirement([
    "layernorm-vs-batchnorm",
    "layernorm-token-axis-worked",
  ]),
  "relu": requirement([
    "relu-dead-units-lr-decision",
    "activation-saturation-layer-role-decision",
  ]),
  "leaky-relu": requirement(["leaky-relu-negative-gradient-worked"]),
  "softmax": requirement(["softmax-jacobian-coupling-diagnosis"]),
  "conv2d": requirement(["conv2d-stacked-receptive-field-worked"]),
  "conv-relu": requirement(["conv-relu-polarity-design"]),
  "max-pooling": requirement(["max-pooling-window-worked"]),
  "computation-graph-backprop": requirement([
    "backprop-branch-gradient-worked",
    "backprop-gradient-vs-optimizer-decision",
  ]),
});

export const NEURAL_NETWORK_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement("gradient-step-size-calculation", "gradient-descent", ["gd-quadratic-step-worked"]),
  depthRequirement("xor-nonlinearity-diagnosis", "neural-network", ["nn-fundamentals-xor-nonlinearity"]),
  depthRequirement("dense-tensor-shape-calculation", "neural-network", ["nn-fundamentals-tensor-shape-worked"]),
  depthRequirement("dense-parameter-count-calculation", "neural-network", ["nn-fundamentals-parameter-count-worked"]),
  depthRequirement("dense-forward-pass-calculation", "neural-network", ["nn-fundamentals-forward-pass-worked"]),
  depthRequirement("capacity-generalization-serving-decision", "neural-network", ["nn-capacity-serving-tradeoff-worked"]),
  depthRequirement("fan-in-initialization-scale-calculation", "initialization", ["init-he-fan-in-worked"]),
  depthRequirement("initialization-symmetry-breaking-diagnosis", "initialization", ["init-symmetry-breaking-diagnosis"]),
  depthRequirement("initialization-forward-backward-geometry-diagnosis", "initialization", ["init-rectangular-fan-direction-diagnosis"]),
  depthRequirement("stateful-optimizer-resume-diagnosis", "optimizers", ["optimizer-resume-state-diagnosis"]),
  depthRequirement("optimizer-mechanism-comparison", "optimizers", ["optimizer-sgd-momentum-adam-choice"]),
  depthRequirement("optimizer-learning-rate-overshoot-calculation", "optimizers", ["optimizer-learning-rate-overshoot-worked"]),
  depthRequirement("optimizer-schedule-phase-decision", "optimizers", ["optimizer-schedule-phase-choice"]),
  depthRequirement("batch-size-learning-rate-interaction", "training-loop-dynamics", ["loop-batch-lr-interaction"]),
  depthRequirement("gradient-accumulation-equivalence", "training-loop-dynamics", ["loop-gradient-accumulation-equivalence"]),
  depthRequirement("accumulation-scheduler-step-diagnosis", "training-loop-dynamics", ["training-loop-scheduler-accumulation-diagnosis"]),
  depthRequirement("train-eval-mode-diagnosis", "dropout-batchnorm", ["dropout-batchnorm-eval-mode-diagnosis"]),
  depthRequirement("module-mode-vs-autograd-diagnosis", "dropout-batchnorm", ["dropout-module-mode-vs-autograd-diagnosis"]),
  depthRequirement("gradient-failure-differential-diagnosis", "gradient-problems", ["gradient-problem-differential-diagnosis"]),
  depthRequirement("gradient-clipping-norm-calculation", "gradient-problems", ["gradient-clipping-norm-worked"]),
  depthRequirement("layernorm-vs-batchnorm-comparison", "layer-normalization", ["layernorm-vs-batchnorm"]),
  depthRequirement("layernorm-axis-calculation", "layer-normalization", ["layernorm-token-axis-worked"]),
  depthRequirement("dead-relu-root-cause-decision", "relu", ["relu-dead-units-lr-decision"]),
  depthRequirement("activation-saturation-layer-role-diagnosis", "relu", ["activation-saturation-layer-role-decision"]),
  depthRequirement("leaky-relu-backward-calculation", "leaky-relu", ["leaky-relu-negative-gradient-worked"]),
  depthRequirement("softmax-coupled-jacobian-calculation", "softmax", ["softmax-jacobian-coupling-diagnosis"]),
  depthRequirement("stacked-convolution-receptive-field-calculation", "conv2d", ["conv2d-stacked-receptive-field-worked"]),
  depthRequirement("conv-relu-feature-polarity-design", "conv-relu", ["conv-relu-polarity-design"]),
  depthRequirement("max-pooling-output-information-calculation", "max-pooling", ["max-pooling-window-worked"]),
  depthRequirement("branched-backprop-gradient-calculation", "computation-graph-backprop", ["backprop-branch-gradient-worked"]),
  depthRequirement("backprop-gradient-check-debugging", "computation-graph-backprop", ["backprop-gradient-vs-optimizer-decision"]),
]);
