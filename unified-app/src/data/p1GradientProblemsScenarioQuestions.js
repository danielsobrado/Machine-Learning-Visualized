export const P1_GRADIENT_PROBLEMS_SCENARIOS_BY_LESSON = Object.freeze({
  'gradient-problems': [
    {
      id: 'gradient-depth-product-worked',
      level: 'calculation',
      relatedComparison: 'short-vs-deep-chain-gradient-decay',
      scenario: 'Assume an upstream gradient of 1.0 passes through a simplified chain where every local derivative has magnitude 0.8. Compare a path with 5 such factors against one with 20 factors.',
      prompt: 'What gradient magnitudes reach the beginning of the two paths, and what does the comparison show?',
      choices: [
        'About 0.328 for depth 5 and 0.0115 for depth 20; repeating the same sub-unit multiplier over more layers makes the early gradient roughly 28 times smaller',
        'About 4.0 for depth 5 and 16.0 for depth 20 because local derivatives add across depth during backpropagation',
        'Exactly 0.8 for both paths because the chain rule uses only the final local derivative regardless of depth',
      ],
      answerIndex: 0,
      explanation: 'The simplified chain-rule magnitude is 0.8^d. At depth 5 that is 0.32768, while at depth 20 it is about 0.01153. The local derivative did not change, but the longer product greatly weakened the signal reaching the early part of the network.',
      misconceptionTested: 'If each local derivative is only moderately below one, increasing depth has little effect on the gradient that reaches early layers.',
    },
    {
      id: 'gradient-scale-root-cause-stabilization',
      level: 'decision',
      relatedComparison: 'clipping-guardrail-vs-signal-scale-root-cause',
      scenario: 'A deep ReLU network starts with activation standard deviations of roughly 1.1, 2.5, 6, 15, and 40 across successive blocks. Gradient clipping prevents the largest optimizer steps from producing NaNs, but the forward activations still grow rapidly before clipping is applied.',
      prompt: 'Which intervention best addresses the underlying signal-scale problem rather than only limiting its final update?',
      choices: [
        'Revisit variance-aware initialization and appropriate normalization or residual scaling so forward and backward magnitudes stay controlled, while keeping clipping only as an optional guardrail',
        'Lower the clipping threshold until every gradient is nearly zero because clipping directly repairs exploding forward activations',
        'Increase the initial weight variance further so later layers receive even larger activations and therefore become easier to normalize automatically',
      ],
      answerIndex: 0,
      explanation: 'Clipping acts on the gradient after the unstable forward and backward computations have already produced extreme scale. Layerwise activation growth points to a signal-propagation problem, so initialization, normalization, residual scaling, or related architectural controls should be checked at the source. Clipping can still limit rare update spikes, but it is not a substitute for healthy signal scale.',
      misconceptionTested: 'Gradient clipping fixes the root cause of exploding activations and gradients, so initialization and normalization no longer matter once clipping is enabled.',
    },
  ],
});
