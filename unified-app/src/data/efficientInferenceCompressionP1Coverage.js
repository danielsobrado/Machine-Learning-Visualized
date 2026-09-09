function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'efficient-inference-compression-track',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const EFFICIENT_INFERENCE_COMPRESSION_P1_AUDITED_LESSON_IDS = Object.freeze([
  'efficient-inference-compression-track',
]);

export const EFFICIENT_INFERENCE_COMPRESSION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'inference-weight-quantization-total-memory',
    ['effinf-012-quantization'],
    ['inference-total-memory-compression-worked'],
  ),
  competency(
    'inference-kv-cache-capacity-arithmetic',
    ['effinf-025-kv-formula'],
    ['inference-kv-cache-memory-worked'],
  ),
  competency(
    'inference-batching-throughput-latency-slo',
    ['effinf-035-queueing'],
    ['inference-batching-slo-operating-point'],
  ),
  competency(
    'inference-unstructured-sparsity-hardware-reality',
    ['effinf-033-unstructured-sparsity'],
    ['inference-unstructured-sparsity-no-speedup-diagnosis'],
  ),
  competency(
    'inference-quantization-calibration-representativeness',
    ['effinf-030-calibration'],
    ['inference-quantization-calibration-domain-shift-diagnosis'],
  ),
  competency(
    'inference-quality-gated-release',
    ['effinf-049-release-gate'],
    ['inference-compression-quality-release-gate'],
  ),
]);
