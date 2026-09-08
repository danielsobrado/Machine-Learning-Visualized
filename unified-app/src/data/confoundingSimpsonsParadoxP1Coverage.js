function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'confounding-simpsons-paradox',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CONFOUNDING_SIMPSONS_PARADOX_P1_AUDITED_LESSON_IDS = Object.freeze([
  'confounding-simpsons-paradox',
]);

export const CONFOUNDING_SIMPSONS_PARADOX_P1_REQUIREMENTS = Object.freeze([
  competency(
    'confounding-simpson-standardization',
    ['conf-021-weighted-average', 'conf-063-scenario-standardize'],
    ['simpson-standardized-rate-worked'],
  ),
  competency(
    'confounding-selection-common-cause',
    ['conf-002-confounder', 'conf-054-scenario-marketing'],
    ['confounding-selection-common-cause-diagnosis'],
  ),
  competency(
    'confounding-adjustment-causal-roles',
    ['conf-025-mediator', 'conf-026-collider'],
    ['confounding-adjustment-set-causal-roles-design'],
  ),
  competency(
    'confounding-overlap-positivity',
    ['conf-036-overlap', 'conf-037-positivity'],
    ['confounding-overlap-positivity-decision'],
  ),
  competency(
    'confounding-post-adjustment-balance',
    ['conf-035-regression', 'conf-040-balance-check'],
    ['confounding-balance-residual-diagnosis'],
  ),
  competency(
    'confounding-unmeasured-sensitivity',
    ['conf-038-unmeasured', 'conf-041-sensitivity'],
    ['confounding-hidden-bias-sensitivity-decision'],
  ),
  competency(
    'confounding-effect-modification-vs-confounding',
    ['conf-030-effect-modification', 'conf-043-randomized-exception'],
    ['confounding-effect-modification-randomized-diagnosis'],
  ),
]);
