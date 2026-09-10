function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const FRONTIER_SYSTEMS_CORE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'long-context-frontier-models',
  'omni-multimodal-architectures',
  'diffusion-language-models',
  'efficient-llm-serving',
]);

export const FRONTIER_SYSTEMS_CORE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'longctx-effective-context-position-grounding',
    'long-context-frontier-models',
    ['longctx-003', 'longctx-012', 'longctx-038'],
    ['long-context-effective-window-diagnosis', 'longctx-lost-middle-repacking-diagnosis', 'longctx-citation-grounding-diagnosis'],
  ),
  competency(
    'longctx-kv-hybrid-memory-freshness',
    'long-context-frontier-models',
    ['longctx-026', 'longctx-033', 'longctx-041', 'longctx-043'],
    ['longctx-kv-cache-memory-worked', 'longctx-hybrid-rag-recall-decision', 'longctx-compressed-memory-loss-diagnosis', 'longctx-cache-freshness-design'],
  ),
  competency(
    'omni-modality-alignment-grounding',
    'omni-multimodal-architectures',
    ['omni-015', 'omni-025', 'omni-035', 'omni-042'],
    ['omni-projector-semantic-alignment-diagnosis', 'omni-modality-neglect-contradiction-diagnosis', 'omni-temporal-skew-worked', 'omni-grounding-region-audit-diagnosis'],
  ),
  competency(
    'omni-token-fusion-streaming-cost',
    'omni-multimodal-architectures',
    ['omni-022', 'omni-027', 'omni-028', 'omni-030', 'omni-050'],
    ['omni-multimodal-token-budget-worked', 'omni-fusion-depth-cost-decision', 'omni-first-audio-latency-worked'],
  ),
  competency(
    'difflm-latency-locking-revision-frontier',
    'diffusion-language-models',
    ['difflm-028', 'difflm-029', 'difflm-031', 'difflm-033'],
    ['difflm-latency-quality-frontier-worked', 'difflm-confidence-shift-locking-diagnosis', 'difflm-remasking-oscillation-diagnosis'],
  ),
  competency(
    'difflm-block-length-edit-alignment-contract',
    'diffusion-language-models',
    ['difflm-037', 'difflm-040', 'difflm-045', 'difflm-049'],
    ['difflm-block-boundary-coherence-diagnosis', 'difflm-length-control-architecture-decision', 'difflm-minimal-change-editing-audit', 'difflm-ar-conversion-alignment-regression-diagnosis'],
  ),
  competency(
    'serving-slo-scheduling-kv-memory',
    'efficient-llm-serving',
    ['serve-006', 'serve-008', 'serve-012', 'serve-018', 'serve-019'],
    ['serving-slo-batching-operating-point', 'serve-prefill-decode-starvation-diagnosis', 'serve-kv-capacity-worked', 'serve-paged-kv-fragmentation-diagnosis'],
  ),
  competency(
    'serving-prefix-speculation-parallel-scaling',
    'efficient-llm-serving',
    ['serve-030', 'serve-035', 'serve-036', 'serve-044', 'serve-046'],
    ['serve-prefix-cache-expected-prefill-worked', 'serve-speculation-break-even-worked', 'serve-tensor-parallel-scaling-worked'],
  ),
]);
