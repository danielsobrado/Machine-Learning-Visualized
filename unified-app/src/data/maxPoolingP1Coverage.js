function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'max-pooling',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const MAX_POOLING_P1_AUDITED_LESSON_IDS = Object.freeze(['max-pooling']);

export const MAX_POOLING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'max-pooling-window-and-information-loss',
    ['mp-004-max-basic', 'mp-010-information-loss'],
    ['max-pooling-window-worked'],
  ),
]);
