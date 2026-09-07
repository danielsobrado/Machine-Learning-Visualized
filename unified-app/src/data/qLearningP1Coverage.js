function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'q-learning',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const Q_LEARNING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'q-learning',
]);

export const Q_LEARNING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'qlearn-bellman-nonterminal-update',
    ['qlearn-021', 'qlearn-022', 'qlearn-023'],
    ['qlearn-nonterminal-update-worked'],
  ),
  competency(
    'qlearn-terminal-no-bootstrap',
    ['qlearn-059', 'qlearn-082'],
    ['qlearn-terminal-update-worked'],
  ),
  competency(
    'qlearn-off-policy-greedy-target',
    ['qlearn-029', 'qlearn-030', 'qlearn-093'],
    ['qlearn-off-policy-exploration-target'],
  ),
  competency(
    'qlearn-exploration-coverage-uncertainty',
    ['qlearn-031', 'qlearn-056', 'qlearn-085'],
    ['qlearn-neutral-value-coverage-trap'],
  ),
  competency(
    'qlearn-alpha-gamma-role-diagnosis',
    ['qlearn-026', 'qlearn-028', 'qlearn-073'],
    ['qlearn-alpha-gamma-failure-diagnosis'],
  ),
  competency(
    'qlearn-reward-safety-production-readiness',
    ['qlearn-066', 'qlearn-071', 'qlearn-100'],
    ['qlearn-reward-safety-failure'],
  ),
]);
