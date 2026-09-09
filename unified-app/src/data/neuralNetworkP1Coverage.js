function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'neural-network',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const NEURAL_NETWORK_P1_AUDITED_LESSON_IDS = Object.freeze(['neural-network']);

export const NEURAL_NETWORK_P1_REQUIREMENTS = Object.freeze([
  competency(
    'nn-xor-hidden-nonlinearity',
    ['nn-015-xor', 'nn-017-nonlinearity'],
    ['nn-fundamentals-xor-nonlinearity'],
  ),
  competency(
    'nn-dense-tensor-shape-reasoning',
    ['nn-022-shapes'],
    ['nn-fundamentals-tensor-shape-worked'],
  ),
  competency(
    'nn-parameter-counting-weights-biases',
    ['nn-013-parameters'],
    ['nn-fundamentals-parameter-count-worked'],
  ),
  competency(
    'nn-forward-pass-arithmetic',
    ['nn-016-forward-pass'],
    ['nn-fundamentals-forward-pass-worked'],
  ),
  competency(
    'nn-capacity-generalization-serving-tradeoff',
    ['nn-038-capacity'],
    ['nn-capacity-serving-tradeoff-worked'],
  ),
  competency(
    'nn-controlled-architecture-ablation',
    ['nn-042-architecture'],
    ['nn-architecture-ablation'],
  ),
]);
