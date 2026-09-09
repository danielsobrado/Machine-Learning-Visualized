function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'optimizers',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const OPTIMIZERS_P1_AUDITED_LESSON_IDS = Object.freeze(['optimizers']);

export const OPTIMIZERS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'optimizer-sgd-momentum-adam-mechanisms',
    ['opt-004-sgd', 'opt-011-momentum', 'opt-013-adam'],
    ['optimizer-sgd-momentum-adam-choice'],
  ),
  competency(
    'optimizer-learning-rate-overshoot',
    ['opt-005-learning-rate', 'opt-006-too-large'],
    ['optimizer-learning-rate-overshoot-worked'],
  ),
  competency(
    'optimizer-warmup-decay-phase-choice',
    ['opt-052-slow-case'],
    ['optimizer-schedule-phase-choice'],
  ),
  competency(
    'optimizer-stateful-checkpoint-resume',
    ['opt-042-state'],
    ['optimizer-resume-state-diagnosis'],
  ),
  competency(
    'optimizer-adaptive-sparse-gradient-scaling',
    ['opt-031-effective-lr'],
    ['optimizer-sparse-gradients'],
  ),
]);
