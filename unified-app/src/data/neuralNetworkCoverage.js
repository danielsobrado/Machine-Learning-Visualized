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
  "conv2d",
  "conv-relu",
  "max-pooling",
  "computation-graph-backprop",
]);

export const NEURAL_NETWORK_COVERAGE = Object.freeze({
  "gradient-descent": requirement(["gd-quadratic-step-worked"]),
  "neural-network": requirement(["nn-capacity-serving-tradeoff-worked"]),
  "initialization": requirement(["init-he-fan-in-worked"]),
  "optimizers": requirement(["optimizer-resume-state-diagnosis"]),
  "training-loop-dynamics": requirement(["training-loop-scheduler-accumulation-diagnosis"]),
  "dropout-batchnorm": requirement(["dropout-batchnorm-eval-mode-diagnosis"]),
  "gradient-problems": requirement(["gradient-clipping-norm-worked"]),
  "layer-normalization": requirement(["layernorm-token-axis-worked"]),
  "relu": requirement(["relu-dead-units-lr-decision"]),
  "leaky-relu": requirement(["leaky-relu-negative-gradient-worked"]),
  "conv2d": requirement(["conv2d-stacked-receptive-field-worked"]),
  "conv-relu": requirement(["conv-relu-polarity-design"]),
  "max-pooling": requirement(["max-pooling-window-worked"]),
  "computation-graph-backprop": requirement(["backprop-branch-gradient-worked"]),
});

export const NEURAL_NETWORK_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement("gradient-step-size-calculation", "gradient-descent", ["gd-quadratic-step-worked"]),
  depthRequirement("capacity-generalization-serving-decision", "neural-network", ["nn-capacity-serving-tradeoff-worked"]),
  depthRequirement("fan-in-initialization-scale-calculation", "initialization", ["init-he-fan-in-worked"]),
  depthRequirement("stateful-optimizer-resume-diagnosis", "optimizers", ["optimizer-resume-state-diagnosis"]),
  depthRequirement("accumulation-scheduler-step-diagnosis", "training-loop-dynamics", ["training-loop-scheduler-accumulation-diagnosis"]),
  depthRequirement("train-eval-mode-diagnosis", "dropout-batchnorm", ["dropout-batchnorm-eval-mode-diagnosis"]),
  depthRequirement("gradient-clipping-norm-calculation", "gradient-problems", ["gradient-clipping-norm-worked"]),
  depthRequirement("layernorm-axis-calculation", "layer-normalization", ["layernorm-token-axis-worked"]),
  depthRequirement("dead-relu-root-cause-decision", "relu", ["relu-dead-units-lr-decision"]),
  depthRequirement("leaky-relu-backward-calculation", "leaky-relu", ["leaky-relu-negative-gradient-worked"]),
  depthRequirement("stacked-convolution-receptive-field-calculation", "conv2d", ["conv2d-stacked-receptive-field-worked"]),
  depthRequirement("conv-relu-feature-polarity-design", "conv-relu", ["conv-relu-polarity-design"]),
  depthRequirement("max-pooling-output-information-calculation", "max-pooling", ["max-pooling-window-worked"]),
  depthRequirement("branched-backprop-gradient-calculation", "computation-graph-backprop", ["backprop-branch-gradient-worked"]),
]);
