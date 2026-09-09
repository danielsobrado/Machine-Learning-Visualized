function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'relu',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RELU_P1_AUDITED_LESSON_IDS = Object.freeze(['relu']);

export const RELU_P1_REQUIREMENTS = Object.freeze([
  competency(
    'relu-dead-unit-gradient-block',
    ['relu-019-dead-unit-basic', 'relu-026-upstream-blocked'],
    ['relu-dead-neuron'],
  ),
  competency(
    'relu-dead-unit-root-cause-diagnosis',
    ['relu-044-learning-rate', 'relu-049-monitor-zeros'],
    ['relu-dead-units-lr-decision'],
  ),
]);
