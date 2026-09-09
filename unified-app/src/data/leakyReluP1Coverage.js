function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'leaky-relu',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const LEAKY_RELU_P1_AUDITED_LESSON_IDS = Object.freeze(['leaky-relu']);

export const LEAKY_RELU_P1_REQUIREMENTS = Object.freeze([
  competency(
    'leaky-relu-negative-gradient-vs-relu',
    ['lrelu-009-negative-slope', 'lrelu-015-dead-zone-basic', 'lrelu-034-relu-contrast-backward'],
    ['leaky-relu-negative-gradient-worked'],
  ),
]);
