function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const REINFORCEMENT_LEARNING_CORE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'rl-foundations',
  'q-learning',
  'rl-exploration',
  'grpo-reasoning',
  'dapo-reasoning-rl',
]);

export const REINFORCEMENT_LEARNING_CORE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rl-discounted-return-semantics',
    'rl-foundations',
    ['rlfound-031', 'rlfound-037'],
    ['rl-discounted-return-worked'],
  ),
  competency(
    'rl-terminal-objective-reward-contract',
    'rl-foundations',
    ['rlfound-024', 'rlfound-040', 'rlfound-043'],
    ['rlfound-terminal-reward-loop-exploit', 'rlfound-proxy-alignment-evaluation'],
  ),
  competency(
    'qlearning-bellman-terminal-update',
    'q-learning',
    ['qlearn-021', 'qlearn-023', 'qlearn-033'],
    ['qlearn-nonterminal-update-worked', 'qlearn-terminal-update-worked'],
  ),
  competency(
    'qlearning-offpolicy-coverage-safety',
    'q-learning',
    ['qlearn-030', 'qlearn-031', 'qlearn-036'],
    ['qlearn-off-policy-exploration-target', 'qlearn-neutral-value-coverage-trap', 'qlearn-reward-safety-failure'],
  ),
  competency(
    'rl-exploration-probability-lifecycle',
    'rl-exploration',
    ['rlexplore-021', 'rlexplore-023', 'rlexplore-037'],
    ['epsilon-greedy-action-probability-worked', 'rlexplore-short-sample-frequency-trap', 'rlexplore-decay-lifecycle-decision'],
  ),
  competency(
    'rl-exploration-risk-execution-safety',
    'rl-exploration',
    ['rlexplore-028', 'rlexplore-030', 'rlexplore-046'],
    ['rlexplore-cliff-risk-worked', 'rlexplore-deployment-noise-gap', 'rlexplore-safe-real-world-exploration'],
  ),
  competency(
    'grpo-group-relative-advantage-signal',
    'grpo-reasoning',
    ['grpo-007', 'grpo-027', 'grpo-030'],
    ['grpo-group-advantage-worked', 'grpo-normalized-advantage-worked', 'grpo-zero-variance-group-diagnosis'],
  ),
  competency(
    'grpo-grouping-correctness-reward-guardrails',
    'grpo-reasoning',
    ['grpo-029', 'grpo-032', 'grpo-038', 'grpo-049'],
    ['grpo-same-prompt-grouping-bug', 'grpo-all-wrong-relative-winner-risk', 'grpo-format-reward-guardrail-failure', 'grpo-prompt-difficulty-contrast-choice'],
  ),
  competency(
    'dapo-dynamic-sampling-frontier-signal',
    'dapo-reasoning-rl',
    ['dapo-007', 'dapo-008', 'dapo-021', 'dapo-024'],
    ['dapo-dynamic-sampling-worked', 'dapo-bad-verifier-survives-dynamic-sampling'],
  ),
  competency(
    'dapo-clip-token-length-mechanics',
    'dapo-reasoning-rl',
    ['dapo-009', 'dapo-012', 'dapo-014', 'dapo-032', 'dapo-033'],
    ['dapo-clip-higher-worked', 'dapo-token-level-credit-diagnosis', 'dapo-overlong-soft-margin-worked'],
  ),
  competency(
    'dapo-training-health-diagnostics',
    'dapo-reasoning-rl',
    ['dapo-018', 'dapo-019'],
    ['dapo-entropy-collapse-diagnosis', 'dapo-dashboard-health-decision'],
  ),
]);
