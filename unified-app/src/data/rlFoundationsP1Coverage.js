function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'rl-foundations',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RL_FOUNDATIONS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'rl-foundations',
]);

export const RL_FOUNDATIONS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'rlfound-transition-terminal-semantics',
    ['rlfound-001', 'rlfound-025', 'rlfound-059'],
    ['rlfound-transition-terminal-trace'],
  ),
  competency(
    'rlfound-reward-vs-return-discounting',
    ['rlfound-014', 'rlfound-037', 'rlfound-093'],
    ['rl-discounted-return-worked'],
  ),
  competency(
    'rlfound-path-return-incentive-design',
    ['rlfound-027', 'rlfound-060', 'rlfound-074'],
    ['rlfound-path-return-comparison-worked'],
  ),
  competency(
    'rlfound-gamma-vs-objective-diagnosis',
    ['rlfound-054', 'rlfound-061', 'rlfound-078'],
    ['rlfound-gamma-vs-reward-design-diagnosis'],
  ),
  competency(
    'rlfound-terminal-condition-incentive-exploit',
    ['rlfound-024', 'rlfound-075', 'rlfound-081'],
    ['rlfound-terminal-reward-loop-exploit'],
  ),
  competency(
    'rlfound-reward-proxy-alignment',
    ['rlfound-056', 'rlfound-057', 'rlfound-098'],
    ['rlfound-proxy-alignment-evaluation'],
  ),
]);
