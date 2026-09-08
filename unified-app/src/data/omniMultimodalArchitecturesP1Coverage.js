function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'omni-multimodal-architectures',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const OMNI_MULTIMODAL_ARCHITECTURES_P1_AUDITED_LESSON_IDS = Object.freeze([
  'omni-multimodal-architectures',
]);

export const OMNI_MULTIMODAL_ARCHITECTURES_P1_REQUIREMENTS = Object.freeze([
  competency(
    'omni-projector-semantic-alignment',
    ['omni-025', 'omni-031'],
    ['omni-projector-semantic-alignment-diagnosis'],
  ),
  competency(
    'omni-modality-evidence-use',
    ['omni-015', 'omni-067'],
    ['omni-modality-neglect-contradiction-diagnosis'],
  ),
  competency(
    'omni-grounding-localization',
    ['omni-043', 'omni-068'],
    ['omni-grounding-region-audit-diagnosis'],
  ),
  competency(
    'omni-multimodal-token-budget',
    ['omni-006', 'omni-070'],
    ['omni-multimodal-token-budget-worked'],
  ),
  competency(
    'omni-fusion-depth-tradeoff',
    ['omni-058', 'omni-071'],
    ['omni-fusion-depth-cost-decision'],
  ),
  competency(
    'omni-temporal-synchronization',
    ['omni-035', 'omni-069'],
    ['omni-temporal-skew-worked'],
  ),
  competency(
    'omni-end-to-end-streaming-latency',
    ['omni-061', 'omni-072'],
    ['omni-first-audio-latency-worked'],
  ),
]);
