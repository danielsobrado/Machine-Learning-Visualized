export const P0_DEEP_LEARNING_SCENARIOS_BY_LESSON = Object.freeze({
  'gradient-problems': [
    {
      id: 'gradient-depth-profile-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'depth-product-vanishing-vs-learning-rate-symptom',
      scenario: 'A 24-layer network has gradient norms of 0.8 near the output, 0.09 around layer 18, 0.006 around layer 12, 0.0004 around layer 6, and 0.00003 in the first layer. A 12-layer version of the same architecture does not show the same collapse. Lowering the learning rate makes parameter updates smaller but leaves this layerwise gradient profile almost unchanged.',
      prompt: 'What is the strongest diagnosis from the evidence?',
      choices: [
        'The network has a depth-dependent vanishing-gradient problem: repeated local contractions are shrinking the backward signal, and changing learning rate alone does not repair the raw gradient path',
        'The learning rate is proven to be the root cause because every small early-layer gradient is created directly by a small optimizer step',
        'The first layer is already converged because any gradient below 0.001 proves that earlier features no longer need to learn',
      ],
      answerIndex: 0,
      explanation: 'The monotonic drop in raw gradient norm toward earlier layers, combined with a worse profile in the deeper model, is direct evidence of depth-amplified contraction in the backward path. Learning rate scales the parameter update after gradients are computed; reducing it can limit update size but does not restore a gradient that has already vanished through repeated chain-rule factors.',
      misconceptionTested: 'A small learning rate is the same mechanism as vanishing gradients and therefore explains a collapsing raw gradient profile.',
    },
    {
      id: 'gradient-stabilization-mechanism-choice',
      level: 'decision',
      relatedComparison: 'root-cause-scale-control-vs-clipping-guardrail',
      scenario: 'Before the first optimizer step, a deep ReLU model already shows activation variance increasing sharply with depth and very large gradients in later blocks. Global-norm clipping prevents NaNs, but almost every step is clipped and training remains unstable. The current initializer ignores fan-in, and the architecture supports normalization layers that are currently disabled.',
      prompt: 'Which remediation plan best targets the mechanism rather than only the symptom?',
      choices: [
        'Fix the variance-aware initialization and evaluate appropriate normalization to stabilize forward and backward scale, while retaining clipping as a guardrail for residual spikes rather than treating it as the root-cause fix',
        'Keep the bad initializer and lower the clipping threshold until every gradient has the same tiny norm, because clipping is designed to repair both exploding and vanishing gradients at their source',
        'Remove all normalization and increase the learning rate so large updates counteract the exploding gradients before they reach the optimizer',
      ],
      answerIndex: 0,
      explanation: 'The instability is visible before any optimizer update, which strongly implicates forward/backward scale rather than only step size. Variance-aware initialization addresses the starting signal scale, and suitable normalization can keep activations in healthier ranges through depth. Clipping is still useful for exceptional spikes, but if nearly every step is clipped it is masking an unresolved scale problem rather than solving it.',
      misconceptionTested: 'If clipping stops NaNs, the underlying exploding-gradient mechanism no longer needs initialization or normalization diagnosis.',
    },
  ],
  initialization: [
    {
      id: 'initialization-symmetry-breaking-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'identical-hidden-weights-vs-random-symmetry-breaking',
      scenario: 'A dense hidden layer has 64 units. Every unit starts with the same weight vector and the same bias. On the first batch, the units produce identical activations and receive identical gradients. A developer argues that SGD noise alone will quickly make the units specialize even if the parameters remain mathematically symmetric.',
      prompt: 'What is the correct diagnosis and initialization fix?',
      choices: [
        'The hidden units are symmetry-locked and can keep learning the same feature; initialize their weights with independent variance-scaled random draws so units can specialize, while zero biases can still be acceptable',
        'Keep all hidden weights identical because backpropagation automatically assigns different gradients to otherwise identical units in the same layer',
        'Randomize only the target labels because symmetry is caused by the dataset rather than by equal hidden-unit parameters',
      ],
      answerIndex: 0,
      explanation: 'Hidden units with identical parameters receive the same inputs, produce the same outputs, and under the same downstream structure can receive identical gradients, preserving the symmetry across updates. Independent random weight initialization breaks that symmetry so units can follow different optimization paths. Biases do not generally need the same symmetry-breaking role and are often initialized to zero.',
      misconceptionTested: 'Optimization noise by itself reliably breaks exact hidden-unit symmetry when all corresponding parameters start identically.',
    },
    {
      id: 'initialization-xavier-he-activation-choice',
      level: 'decision',
      relatedComparison: 'xavier-tanh-vs-he-relu',
      scenario: 'Two deep MLPs have the same layer widths. Model A uses tanh hidden activations and Model B uses ReLU. Both currently use Xavier initialization, but Model B shows shrinking activation variance through depth. The team proposes switching both models to He initialization simply because it works better for Model B.',
      prompt: 'Which initialization decision best matches the activation behavior?',
      choices: [
        'Keep Xavier or another suitable variance rule as the natural starting point for the tanh network, use He-style scaling for the ReLU network, and verify both with layerwise activation and gradient statistics',
        'Use He for both because the newest initializer is universally better regardless of whether the activation saturates, clips, or zeros part of its input distribution',
        'Use Xavier for both because fan-in and fan-out alone determine the correct variance and activation behavior should never affect initialization',
      ],
      answerIndex: 0,
      explanation: 'Xavier-style scaling is a common match for tanh-like activations under its variance assumptions, while He scaling increases variance to account for ReLU-style gating that zeros many negative pre-activations. Initialization should therefore be chosen with the activation and architecture in mind, then checked empirically through forward and backward signal statistics rather than treated as a universal rule.',
      misconceptionTested: 'Xavier and He are interchangeable global defaults whose choice does not depend on the activation function.',
    },
  ],
  relu: [
    {
      id: 'activation-saturation-gradient-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'saturating-hidden-activations-vs-relu-gradient-flow',
      scenario: 'A deep MLP uses sigmoid hidden activations. In several early layers, most pre-activations have magnitude above 8, outputs sit close to 0 or 1, and gradient norms shrink by orders of magnitude toward the input. The team proposes switching every hidden unit to ReLU and claims this removes activation-related gradient failure entirely.',
      prompt: 'Which diagnosis is technically strongest?',
      choices: [
        'The sigmoid units are operating in saturated regions with tiny local derivatives; ReLU avoids positive-side saturation but still has a zero-gradient negative branch that can create dead units',
        'The small gradients prove the loss function is disconnected because sigmoid derivatives become exactly one whenever the output approaches 0 or 1',
        'ReLU removes every activation-related gradient risk because its derivative is one for both positive and negative pre-activations',
      ],
      answerIndex: 0,
      explanation: 'Sigmoid becomes nearly flat at large positive or negative pre-activations, so repeated local derivatives can make upstream gradients very small. ReLU keeps derivative one on its positive branch, but its negative branch has derivative zero, so it trades saturation risk for a different failure mode rather than eliminating activation-related gradient problems.',
      misconceptionTested: 'Replacing a saturating activation with ReLU guarantees healthy gradient flow on every branch.',
    },
  ],
  'neural-network': [
    {
      id: 'activation-sigmoid-hidden-limitations',
      level: 'decision',
      relatedComparison: 'sigmoid-hidden-layer-vs-output-probability-use',
      scenario: 'A team uses sigmoid in every hidden layer because its outputs lie between 0 and 1. During training, many hidden pre-activations move far from zero, gradients become small in early layers, and the hidden activations are mostly positive rather than centered around zero. The binary output layer also uses a sigmoid-compatible loss.',
      prompt: 'What is the best architectural conclusion from this evidence?',
      choices: [
        'Keep sigmoid where a binary probability interpretation is appropriate at the output, but reconsider it for deep hidden layers because saturation and non-zero-centered hidden activations can make optimization harder',
        'Remove sigmoid from the binary output because sigmoid can never represent probabilities, while keeping it in all hidden layers specifically to avoid saturation',
        'Keep sigmoid everywhere because bounding activations to 0 through 1 guarantees larger hidden-layer gradients than ReLU, tanh, GELU, or Leaky ReLU',
      ],
      answerIndex: 0,
      explanation: 'Sigmoid is often a natural output transform for a binary probability model when paired correctly with the loss, but that does not make it an ideal default hidden activation. Deep hidden sigmoid stacks can suffer from saturation, small derivatives, and consistently positive activations that can complicate optimization.',
      misconceptionTested: 'An activation that is appropriate for a binary output layer is automatically a good default for every hidden layer.',
    },
    {
      id: 'activation-tanh-hidden-limitations',
      level: 'diagnosis',
      relatedComparison: 'tanh-zero-centered-vs-saturation',
      scenario: 'A recurrent block replaces sigmoid hidden activations with tanh. The hidden states are now centered around zero more naturally, but many pre-activations reach magnitudes of 6 to 10 and gradients through long paths are still extremely small. One engineer argues that zero-centered outputs prove tanh cannot cause vanishing gradients.',
      prompt: 'What is the correct diagnosis?',
      choices: [
        'Tanh being zero-centered is useful, but it still saturates near minus one and plus one at large magnitudes, so its local derivatives can become tiny and contribute to vanishing gradients',
        'The engineer is correct because zero-centered activations always have derivative one regardless of input magnitude',
        'Tanh can only cause exploding gradients because its outputs are bounded and therefore its derivative grows without limit near saturation',
      ],
      answerIndex: 0,
      explanation: 'Tanh improves on sigmoid in one respect because its output is centered around zero, but it remains a saturating bounded nonlinearity. At large absolute pre-activation values, tanh is nearly flat, making local derivatives small and allowing gradients to decay through repeated composition.',
      misconceptionTested: 'Zero-centered activations cannot saturate or contribute to vanishing gradients.',
    },
  ],
  'leaky-relu': [
    {
      id: 'activation-gelu-leaky-tradeoff',
      level: 'decision',
      relatedComparison: 'gelu-smooth-gating-vs-leaky-relu-fixed-negative-slope',
      scenario: 'Two teams are choosing a hidden activation. Team A is extending a transformer-style MLP whose baseline uses smooth GELU gating and wants to stay close to that architecture family. Team B has a small feedforward model with many persistently negative ReLU units and wants the simplest ReLU-like change that preserves a fixed nonzero gradient on the negative branch.',
      prompt: 'Which choice best matches the two requirements without pretending the activations are interchangeable?',
      choices: [
        'GELU is the more natural baseline-preserving choice for Team A, while Leaky ReLU directly addresses Team B requirement with a simple fixed negative slope; the final choice should still be validated empirically',
        'Leaky ReLU and GELU are mathematically identical whenever inputs are negative, so either team can swap them with no representation or optimization change',
        'GELU is the only valid choice for Team B because it guarantees a constant negative-side derivative equal to the Leaky ReLU alpha hyperparameter',
      ],
      answerIndex: 0,
      explanation: 'GELU provides smooth input-dependent gating and is common in transformer-style MLPs, while Leaky ReLU is a piecewise-linear ReLU variant with an explicit fixed negative slope. Leaky ReLU therefore maps directly to the requirement of preserving a simple nonzero negative-side gradient, while GELU may be preferable when matching an established transformer architecture. Neither choice guarantees better validation results in every model.',
      misconceptionTested: 'GELU and Leaky ReLU have the same negative-side derivative and can be substituted without trade-offs.',
    },
  ],
});

export function getP0DeepLearningScenariosForLesson(lessonId) {
  return P0_DEEP_LEARNING_SCENARIOS_BY_LESSON[lessonId] || [];
}
