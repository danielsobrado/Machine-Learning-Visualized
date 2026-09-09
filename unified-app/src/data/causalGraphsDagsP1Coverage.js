function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'causal-graphs-dags',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CAUSAL_GRAPHS_DAGS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'causal-graphs-dags',
]);

export const CAUSAL_GRAPHS_DAGS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'dag-minimal-backdoor-adjustment-set',
    ['dag-035-minimal-set'],
    ['dag-backdoor-adjustment-set-design'],
  ),
  competency(
    'dag-standardized-adjusted-ate',
    ['dag-051-scenario-common-cause'],
    ['dag-standardized-ate-worked'],
  ),
  competency(
    'dag-dseparation-fork-vs-collider',
    ['dag-029-d-separation'],
    ['dag-dseparation-path-status-diagnosis'],
  ),
  competency(
    'dag-positivity-empirical-support',
    ['dag-060-scenario-overlap'],
    ['dag-positivity-support-decision'],
  ),
  competency(
    'dag-randomized-prognostic-precision-adjustment',
    ['dag-065-scenario-precision'],
    ['dag-randomized-prognostic-adjustment-decision'],
  ),
  competency(
    'dag-total-effect-mediator-handling',
    ['dag-054-scenario-total-effect'],
    ['dag-mediator-total-effect-decision'],
  ),
  competency(
    'dag-collider-m-bias',
    ['dag-066-scenario-mbias'],
    ['dag-collider-m-bias'],
  ),
  competency(
    'dag-frontdoor-special-identification',
    ['dag-071-scenario-frontdoor'],
    ['dag-front-door-identification'],
  ),
]);
