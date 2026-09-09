function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'computation-graph-backprop',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const COMPUTATION_GRAPH_BACKPROP_P1_AUDITED_LESSON_IDS = Object.freeze(['computation-graph-backprop']);

export const COMPUTATION_GRAPH_BACKPROP_P1_REQUIREMENTS = Object.freeze([
  competency(
    'backprop-complete-chain-rule-path',
    ['cgb-010-chain-rule', 'cgb-029-chain-to-z'],
    ['backprop-chain-rule-missing-path'],
  ),
  competency(
    'backprop-branch-gradient-accumulation',
    ['cgb-012-accumulation', 'cgb-033-sum-paths'],
    ['backprop-branch-gradient-worked'],
  ),
]);
