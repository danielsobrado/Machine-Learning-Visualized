function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'power-sample-size',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const POWER_SAMPLE_SIZE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'power-sample-size',
]);

export const POWER_SAMPLE_SIZE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'power-two-arm-sample-size-formula',
    ['power-021-effect-se', 'power-032-detectable-effect'],
    ['power-two-arm-mean-sample-size-worked'],
  ),
  competency(
    'power-mde-square-law-scaling',
    ['power-025-square-law', 'power-057-scenario-fourx'],
    ['power-mde-square-law-worked'],
  ),
  competency(
    'power-continuous-variance-standardized-effect',
    ['power-010-variance', 'power-052-scenario-noisy'],
    ['power-continuous-outcome-variance'],
  ),
  competency(
    'power-paired-repeated-measures-precision',
    ['power-040-repeated-measures'],
    ['power-paired-design'],
  ),
  competency(
    'power-cluster-design-effect',
    ['power-039-clustering', 'power-059-scenario-cluster'],
    ['power-cluster-design-effect-worked'],
  ),
  competency(
    'power-attrition-retention-inflation',
    ['power-042-dropouts', 'power-062-scenario-missing'],
    ['power-attrition-inflation-worked'],
  ),
  competency(
    'power-allocation-balance-precision',
    ['power-029-imbalance', 'power-058-scenario-imbalance'],
    ['power-allocation-imbalance-worked'],
  ),
  competency(
    'power-target-power-sample-cost',
    ['power-023-zbeta', 'power-055-scenario-power'],
    ['power-target-power-sample-ratio-worked'],
  ),
]);
