export const P1_NEURAL_APPLIED_ARCHITECTURE_SCENARIOS_BY_LESSON = Object.freeze({
  "relu": [
    {
      id: "relu-dead-units-lr-decision",
      level: "decision",
      relatedComparison: "activation-substitution-vs-optimization-root-cause",
      scenario: "After a learning-rate increase from 0.001 to 0.05, 78% of ReLU units in one hidden layer become zero on every batch and their incoming gradients remain zero. Validation quality drops at the same update. Before the learning-rate change, the same layer had a healthy activation distribution.",
      prompt: "What is the strongest first corrective experiment if the goal is to diagnose the cause rather than merely mask the symptom?",
      choices: [
        "Restore a stable learning rate and inspect activation/pre-activation distributions; then compare ReLU with a nonzero-negative-slope activation only if persistent dead units remain",
        "Keep the 0.05 learning rate and replace every ReLU immediately, because activation choice is proven to be the only possible cause",
        "Increase the learning rate again so negative pre-activations cross zero faster even though their local ReLU gradients are already zero",
      ],
      answerIndex: 0,
      explanation: "The failure begins exactly when the learning rate jumps, so the optimizer change is strong causal evidence to test first. Large updates can push many units into a persistently negative region. A Leaky ReLU can reduce dead-unit risk, but changing the activation before testing the triggering optimization change would confound the diagnosis.",
      misconceptionTested: "Whenever dead ReLUs appear, replacing the activation is automatically the best first fix regardless of what changed in training.",
    },
  ],
  "leaky-relu": [
    {
      id: "leaky-relu-negative-gradient-worked",
      level: "calculation",
      relatedComparison: "relu-zero-gradient-vs-leaky-negative-gradient",
      scenario: "A Leaky ReLU uses negative-side slope alpha = 0.01. For a unit with pre-activation x = -4, the upstream gradient arriving from the next layer is 3. Compare the gradient passed back through this activation with standard ReLU at the same negative input.",
      prompt: "What gradient reaches the pre-activation in each case?",
      choices: [
        "Leaky ReLU passes 3 * 0.01 = 0.03, while standard ReLU passes 0 for x < 0",
        "Leaky ReLU passes -12 and standard ReLU passes 3 because both derivatives equal the activation value",
        "Both pass 3 because activation functions affect only the forward pass and never the backward derivative",
      ],
      answerIndex: 0,
      explanation: "On its negative branch, Leaky ReLU has derivative alpha, so the chain rule multiplies the upstream gradient 3 by 0.01 to give 0.03. Standard ReLU has derivative zero for a negative pre-activation, so it passes no gradient through that branch on this example.",
      misconceptionTested: "Leaky ReLU and standard ReLU propagate the same gradient whenever the pre-activation is negative.",
    },
  ],
  "conv2d": [
    {
      id: "conv2d-stacked-receptive-field-worked",
      level: "calculation",
      relatedComparison: "spatial-downsampling-vs-receptive-field-growth",
      scenario: "A 64 x 64 feature map passes through two 3 x 3 convolutions. Both use stride 2, padding 1, and dilation 1. Starting with receptive field 1 and input jump 1, use r_next = r + (k - 1) * jump and jump_next = jump * stride.",
      prompt: "After both convolutions, what are the spatial size and receptive field along one dimension?",
      choices: [
        "The spatial size is 16 and the receptive field is 7: 64 -> 32 -> 16, while receptive field grows 1 -> 3 -> 7",
        "The spatial size is 16 and the receptive field is 9 because two 3 x 3 kernels always multiply to a 9-wide receptive field",
        "The spatial size remains 64 and the receptive field is 3 because padding 1 prevents both downsampling and receptive-field growth",
      ],
      answerIndex: 0,
      explanation: "Each stride-2 padded 3 x 3 convolution halves the 64-wide map, giving 32 then 16. The first layer grows receptive field from 1 to 3 with jump 2. The second adds 2 times the previous jump 2, giving receptive field 7, while the final jump becomes 4.",
      misconceptionTested: "Stacked convolution receptive fields can be inferred by multiplying kernel sizes, and padding always preserves spatial size.",
    },
  ],
  "conv-relu": [
    {
      id: "conv-relu-polarity-design",
      level: "design",
      relatedComparison: "single-sign-gating-vs-complementary-feature-detectors",
      scenario: "An image task needs to distinguish both bright-to-dark and dark-to-bright vertical edges. One learned convolution filter responds strongly positive to one polarity and equally negative to the opposite polarity. A ReLU immediately follows the filter and clips all negative responses to zero.",
      prompt: "What representation change best preserves evidence for both edge polarities after the nonlinearity?",
      choices: [
        "Learn complementary filters/channels so opposite edge polarities can produce positive responses in separate channels before ReLU gating",
        "Keep only the single filter because ReLU converts its negative responses into equally strong positive evidence automatically",
        "Replace the convolution with max pooling because pooling learns the missing opposite-polarity filter weights during training",
      ],
      answerIndex: 0,
      explanation: "ReLU preserves positive responses and discards negative ones, so a single signed filter can lose evidence for the opposite polarity. Separate learned channels can represent complementary patterns with positive activations, allowing the network to retain both types of edge evidence after the nonlinearity.",
      misconceptionTested: "A Conv+ReLU channel automatically preserves equally useful information about both positive and negative filter responses.",
    },
  ],
  "max-pooling": [
    {
      id: "max-pooling-window-worked",
      level: "calculation",
      relatedComparison: "local-shift-robustness-vs-spatial-information-loss",
      scenario: "A 4 x 4 activation map is pooled with a 2 x 2 max-pool using stride 2: [[1, 5, 2, 4], [3, 0, 6, 1], [7, 2, 8, 3], [1, 4, 0, 9]]. The four non-overlapping windows are pooled independently.",
      prompt: "What 2 x 2 output is produced, and what information is lost by that output?",
      choices: [
        "[[5, 6], [7, 9]]; each window keeps only its maximum, so the exact locations and values of the non-maximal activations are discarded",
        "[[3, 5], [7, 8]]; max pooling averages each window and therefore preserves every activation value implicitly",
        "[[1, 2], [1, 0]]; max pooling selects the upper-left value of each window so exact spatial detail is preserved",
      ],
      answerIndex: 0,
      explanation: "The maxima of the four windows are 5, 6, 7, and 9, producing the stated 2 x 2 map. Max pooling retains the strongest activation per window but throws away where within the window that maximum occurred and all other activation magnitudes, which explains both some local robustness and spatial information loss.",
      misconceptionTested: "Max pooling reduces spatial resolution without discarding meaningful within-window location or activation information.",
    },
  ],
  "computation-graph-backprop": [
    {
      id: "backprop-branch-gradient-worked",
      level: "calculation",
      relatedComparison: "branch-gradient-sum-vs-single-path-gradient",
      scenario: "A computation graph branches from x into a = x^2 and b = 3x, then recombines as y = a + b. At x = 2, one implementation backpropagates only through a and reports dy/dx = 4, ignoring the second branch.",
      prompt: "What is the correct gradient, and why is the implementation wrong?",
      choices: [
        "dy/dx = 2x + 3 = 7; gradients from both downstream branches must be accumulated when they reconverge at x",
        "dy/dx = 4; backpropagation follows only the numerically largest branch and ignores additive paths",
        "dy/dx = 12; gradients from separate branches are multiplied together whenever the forward graph contains an addition",
      ],
      answerIndex: 0,
      explanation: "The square branch contributes da/dx = 2x = 4 at x = 2, while the linear branch contributes db/dx = 3. Because y adds the branch outputs, the derivative with respect to their shared ancestor x is the sum of both contributions, 4 + 3 = 7. Following only one branch underestimates the gradient.",
      misconceptionTested: "When a computation graph branches and later recombines by addition, backpropagation only needs one downstream path.",
    },
  ],
});

export function getP1NeuralAppliedArchitectureScenariosForLesson(lessonId) {
  return P1_NEURAL_APPLIED_ARCHITECTURE_SCENARIOS_BY_LESSON[lessonId] || [];
}
