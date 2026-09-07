function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'rl-exploration',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RL_EXPLORATION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'rl-exploration',
]);

export const RL_EXPLORATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rlexplore-epsilon-action-probability',
    ['rlexplore-003', 'rlexplore-021'],
    ['epsilon-greedy-action-probability-worked'],
  ),
  competency(
    'rlexplore-stochastic-frequency-interpretation',
    ['rlexplore-023', 'rlexplore-060', 'rlexplore-082'],
    ['rlexplore-short-sample-frequency-trap'],
  ),
  competency(
    'rlexplore-decay-learning-lifecycle',
    ['rlexplore-037', 'rlexplore-055', 'rlexplore-087'],
    ['rlexplore-decay-lifecycle-decision'],
  ),
  competency(
    'rlexplore-risk-adjusted-hazard-evaluation',
    ['rlexplore-030', 'rlexplore-054', 'rlexplore-083'],
    ['rlexplore-cliff-risk-worked'],
  ),
  competency(
    'rlexplore-deployment-execution-noise',
    ['rlexplore-052', 'rlexplore-086', 'rlexplore-088'],
    ['rlexplore-deployment-noise-gap'],
  ),
  competency(
    'rlexplore-safe-real-world-data-collection',
    ['rlexplore-028', 'rlexplore-053', 'rlexplore-096'],
    ['rlexplore-safe-real-world-exploration'],
  ),
  competency(
    'rlexplore-epsilon-alpha-gamma-diagnosis',
    ['rlexplore-043', 'rlexplore-044', 'rlexplore-095'],
    ['rlexplore-epsilon-alpha-gamma-diagnosis'],
  ),
]);
