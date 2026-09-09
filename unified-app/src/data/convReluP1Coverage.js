function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'conv-relu',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CONV_RELU_P1_AUDITED_LESSON_IDS = Object.freeze(['conv-relu']);

export const CONV_RELU_P1_REQUIREMENTS = Object.freeze([
  competency(
    'conv-relu-opposite-polarity-representation',
    ['cr-013-negative-not-saved', 'cr-034-filter-polarity', 'cr-035-two-polarities'],
    ['conv-relu-polarity-design'],
  ),
]);
