function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'data-engineering-for-ml-track',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DATA_ENGINEERING_FOR_ML_P1_AUDITED_LESSON_IDS = Object.freeze([
  'data-engineering-for-ml-track',
]);

export const DATA_ENGINEERING_FOR_ML_P1_REQUIREMENTS = Object.freeze([
  competency(
    'de-point-in-time-asof-join',
    ['deml-024-asof-join'],
    ['de-point-in-time-parity-worked'],
  ),
  competency(
    'de-train-serve-transformation-version-parity',
    ['deml-030-shared-transform'],
    ['de-transformation-version-parity'],
  ),
  competency(
    'de-event-vs-availability-time',
    ['deml-022-availability-time'],
    ['de-event-vs-availability-time-worked'],
  ),
  competency(
    'de-feature-freshness-slo',
    ['deml-038-freshness-slo'],
    ['de-feature-freshness-slo-decision'],
  ),
  competency(
    'de-semantic-schema-unit-contract',
    ['deml-039-schema-evolution'],
    ['de-semantic-unit-schema-evolution-diagnosis'],
  ),
  competency(
    'de-backfill-historical-time-correctness',
    ['deml-036-backfill-validation'],
    ['de-backfill-time-travel-leakage-diagnosis'],
  ),
]);
