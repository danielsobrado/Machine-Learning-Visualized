function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, scenarioIds) {
  return Object.freeze({ id, lessonId: 'bloom-filter', scenarioIds: Object.freeze(scenarioIds) });
}

export const BLOOM_FILTER_AUDITED_LESSON_IDS = Object.freeze(['bloom-filter']);

export const BLOOM_FILTER_COVERAGE = Object.freeze({
  'bloom-filter': requirement([
    'bloom-fpr-worked',
    'bloom-optimal-k-worked',
    'bloom-capacity-sizing-worked',
    'bloom-counting-delete-decision',
  ]),
});

export const BLOOM_FILTER_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('false-positive-rate-calculation', ['bloom-fpr-worked']),
  depthRequirement('optimal-hash-count-calculation', ['bloom-optimal-k-worked']),
  depthRequirement('memory-capacity-sizing-calculation', ['bloom-capacity-sizing-worked']),
  depthRequirement('safe-deletion-variant-design', ['bloom-counting-delete-decision']),
]);
