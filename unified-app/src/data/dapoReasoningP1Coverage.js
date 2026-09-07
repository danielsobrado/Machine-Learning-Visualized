function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'dapo-reasoning-rl',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DAPO_REASONING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'dapo-reasoning-rl',
]);

export const DAPO_REASONING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'dapo-dynamic-sampling-effective-groups',
    ['dapo-007', 'dapo-008', 'dapo-021'],
    ['dapo-dynamic-sampling-worked'],
  ),
  competency(
    'dapo-clip-higher-asymmetric-positive-room',
    ['dapo-009', 'dapo-010', 'dapo-031'],
    ['dapo-clip-higher-worked'],
  ),
  competency(
    'dapo-token-level-long-trace-credit',
    ['dapo-012', 'dapo-013', 'dapo-063'],
    ['dapo-token-level-credit-diagnosis'],
  ),
  competency(
    'dapo-overlong-soft-boundary-shaping',
    ['dapo-014', 'dapo-015', 'dapo-068'],
    ['dapo-overlong-soft-margin-worked'],
  ),
  competency(
    'dapo-entropy-exploration-health',
    ['dapo-019', 'dapo-042', 'dapo-073'],
    ['dapo-entropy-collapse-diagnosis'],
  ),
  competency(
    'dapo-reward-validity-vs-training-mechanics',
    ['dapo-071', 'dapo-085'],
    ['dapo-bad-verifier-survives-dynamic-sampling'],
  ),
  competency(
    'dapo-multi-metric-training-readiness',
    ['dapo-039', 'dapo-067', 'dapo-082'],
    ['dapo-dashboard-health-decision'],
  ),
]);
