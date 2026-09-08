function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'bloom-filter',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const BLOOM_FILTER_P1_AUDITED_LESSON_IDS = Object.freeze([
  'bloom-filter',
]);

export const BLOOM_FILTER_P1_REQUIREMENTS = Object.freeze([
  competency(
    'bloom-one-sided-membership-authoritative-positive',
    ['bf-006', 'bf-053', 'bf-074'],
    ['bloom-positive-authority-decision'],
  ),
  competency(
    'bloom-fpr-query-vs-bit-fill',
    ['bf-019', 'bf-027', 'bf-028'],
    ['bloom-fpr-worked'],
  ),
  competency(
    'bloom-capacity-memory-sizing',
    ['bf-008', 'bf-009', 'bf-059'],
    ['bloom-capacity-sizing-worked'],
  ),
  competency(
    'bloom-hash-count-optimum',
    ['bf-031', 'bf-032', 'bf-079'],
    ['bloom-optimal-k-worked'],
  ),
  competency(
    'bloom-capacity-drift-saturation-monitoring',
    ['bf-057', 'bf-061', 'bf-085'],
    ['bloom-capacity-drift-diagnosis'],
  ),
  competency(
    'bloom-deletion-shared-evidence',
    ['bf-041', 'bf-042', 'bf-097'],
    ['bloom-counting-delete-decision'],
  ),
  competency(
    'bloom-distributed-parameter-compatibility',
    ['bf-048', 'bf-067', 'bf-087'],
    ['bloom-seed-mismatch-diagnosis'],
  ),
]);
