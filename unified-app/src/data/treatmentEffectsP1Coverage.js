function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'treatment-effects',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TREATMENT_EFFECTS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'treatment-effects',
]);

export const TREATMENT_EFFECTS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'treatment-missing-individual-counterfactual',
    ['te-008-missing-counterfactual'],
    ['treatment-counterfactual-observability-diagnosis'],
  ),
  competency(
    'treatment-estimand-selection',
    ['te-019-estimand'],
    ['treatment-estimand-selection-decision'],
  ),
  competency(
    'treatment-weighted-population-ate',
    ['te-021-weighted-average'],
    ['treatment-weighted-ate-worked'],
  ),
  competency(
    'treatment-cate-uncertainty',
    ['te-033-intervals'],
    ['cate-uncertainty-worked-decision'],
  ),
  competency(
    'treatment-sutva-interference',
    ['te-039-sutva'],
    ['treatment-interference-design-decision'],
  ),
  competency(
    'treatment-consistency-well-defined-intervention',
    ['te-040-consistency'],
    ['treatment-consistency-version-diagnosis'],
  ),
  competency(
    'treatment-uplift-vs-response-targeting',
    ['te-035-uplift-model'],
    ['treatment-uplift-vs-response-decision'],
  ),
  competency(
    'treatment-policy-value-after-cost',
    ['te-037-costs'],
    ['treatment-policy-value-cost-worked'],
  ),
  competency(
    'treatment-target-population-transport',
    ['te-046-transport'],
    ['treatment-target-population-transport-worked'],
  ),
]);
