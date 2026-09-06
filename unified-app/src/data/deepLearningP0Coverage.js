function competency(id, lessonId, quizIds, scenarioIds = []) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DEEP_LEARNING_P0_AUDITED_LESSON_IDS = Object.freeze([
  'computation-graph-backprop',
]);

export const DEEP_LEARNING_P0_REQUIREMENTS = Object.freeze([
  competency(
    'backprop-chain-rule',
    'computation-graph-backprop',
    ['cgb-010-chain-rule', 'cgb-029-chain-to-z', 'cgb-030-chain-to-w'],
    ['backprop-branch-gradient-worked'],
  ),
  competency(
    'backprop-local-global-gradients',
    'computation-graph-backprop',
    ['cgb-008-local-derivative', 'cgb-009-upstream-gradient', 'cgb-047-input-gradient-use', 'cgb-060-two-branches'],
  ),
  competency(
    'backprop-broken-gradient-flow',
    'computation-graph-backprop',
    ['cgb-061-debug-no-update', 'cgb-063-debug-relu-silent', 'cgb-064-debug-disconnected'],
  ),
  competency(
    'backprop-incorrect-gradient-debugging',
    'computation-graph-backprop',
    ['cgb-062-debug-wrong-sign', 'cgb-066-debug-missing-factor', 'cgb-067-debug-relu-state', 'cgb-068-gradient-check-use'],
  ),
]);
