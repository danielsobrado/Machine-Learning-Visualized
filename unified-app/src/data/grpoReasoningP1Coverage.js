function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'grpo-reasoning',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const GRPO_REASONING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'grpo-reasoning',
]);

export const GRPO_REASONING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'grpo-group-relative-mean-baseline',
    ['grpo-003', 'grpo-004'],
    ['grpo-group-advantage-worked'],
  ),
  competency(
    'grpo-standardized-advantage-spread',
    ['grpo-007', 'grpo-008'],
    ['grpo-normalized-advantage-worked'],
  ),
  competency(
    'grpo-same-prompt-grouping',
    ['grpo-001', 'grpo-002'],
    ['grpo-same-prompt-grouping-bug'],
  ),
  competency(
    'grpo-zero-variance-group-handling',
    ['grpo-027', 'grpo-051'],
    ['grpo-zero-variance-group-diagnosis'],
  ),
  competency(
    'grpo-all-wrong-relative-winner-risk',
    ['grpo-029', 'grpo-053', 'grpo-079'],
    ['grpo-all-wrong-relative-winner-risk'],
  ),
  competency(
    'grpo-frontier-prompt-contrast',
    ['grpo-049', 'grpo-052', 'grpo-069'],
    ['grpo-prompt-difficulty-contrast-choice'],
  ),
  competency(
    'grpo-reward-quality-vs-guardrails',
    ['grpo-032', 'grpo-038', 'grpo-056'],
    ['grpo-format-reward-guardrail-failure'],
  ),
]);
