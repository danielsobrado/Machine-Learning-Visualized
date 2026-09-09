function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'conv2d',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CONV2D_P1_AUDITED_LESSON_IDS = Object.freeze(['conv2d']);

export const CONV2D_P1_REQUIREMENTS = Object.freeze([
  competency(
    'conv2d-stride-shape-receptive-field',
    ['c2d-026-output-formula', 'c2d-031-stride-effect', 'c2d-040-receptive-field'],
    ['conv2d-stacked-receptive-field-worked'],
  ),
]);
