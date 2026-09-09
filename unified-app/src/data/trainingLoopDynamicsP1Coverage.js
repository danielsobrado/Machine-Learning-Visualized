function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'training-loop-dynamics',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TRAINING_LOOP_DYNAMICS_P1_AUDITED_LESSON_IDS = Object.freeze(['training-loop-dynamics']);

export const TRAINING_LOOP_DYNAMICS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'training-loop-batch-learning-rate-interaction',
    ['tld-029-batch-lr-link'],
    ['loop-batch-lr-interaction'],
  ),
  competency(
    'training-loop-gradient-accumulation-equivalence',
    ['tld-056-batch-case'],
    ['loop-gradient-accumulation-equivalence'],
  ),
  competency(
    'training-loop-scheduler-optimizer-step-cadence',
    ['tld-034-schedule'],
    ['training-loop-scheduler-accumulation-diagnosis'],
  ),
]);
