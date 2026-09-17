export const RL_TRANSFORMER_NEXT_QUALITY_OVERRIDES = Object.freeze({
  'self-attention': Object.freeze({
    reason: 'Self-attention already computes fixed learned Q/K/V projections from token embeddings, traces scaled dot products through masking and softmax into value mixing, and exposes a full attention matrix. Multi-head behavior is already taught in the separate attention-mechanism lesson rather than needing to be duplicated here.',
    nextAction: 'Add explicit curriculum links from single-head self-attention into the existing multi-head lesson, then bridge onward to MQA/GQA so the architecture progression is visible without duplicating labs.',
  }),
  'rl-foundations': Object.freeze({
    reason: 'RL foundations already includes stochastic action outcomes, probability-weighted expected return, deterministic seeded episode sampling, sampled-versus-expected return comparison, and discount-horizon controls.',
    nextAction: 'Add a compact state-action-transition policy diagram that updates after each sampled action so the agent-environment loop becomes spatially explicit.',
  }),
  'q-learning': Object.freeze({
    reason: 'Q-learning now includes a seeded cliff-style TD-control lab comparing off-policy Q-learning with on-policy SARSA under the same configurable epsilon-greedy setup. Learners can change epsilon, alpha, gamma, and episode count, compare final policies and cliff failures, and replay every target, TD error, and Q-value update.',
    nextAction: 'Add Expected SARSA and Double Q-learning on the same environment, then bridge from tabular control to function approximation and DQN target networks.',
  }),
});
