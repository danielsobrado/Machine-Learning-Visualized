function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'residual-stream',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const RESIDUAL_STREAM_P1_AUDITED_LESSON_IDS = Object.freeze([
  'residual-stream',
]);

export const RESIDUAL_STREAM_P1_REQUIREMENTS = Object.freeze([
  competency(
    'residual-additive-state-update',
    ['resstream-021-formula', 'resstream-030-identity-path'],
    ['residual-stream-additive-update-worked'],
  ),
  competency(
    'residual-write-scale-control',
    ['resstream-028-scale-balance', 'resstream-046-norm-growth'],
    ['residual-write-scale-dominance-diagnosis'],
  ),
  competency(
    'residual-width-projection-contract',
    ['resstream-034-residual-width', 'resstream-035-projection-needed'],
    ['residual-width-projection-contract-design'],
  ),
  competency(
    'residual-normalization-checkpoint-contract',
    ['resstream-026-pre-norm', 'resstream-069-checkpoint-mismatch'],
    ['residual-prenorm-checkpoint-mismatch-diagnosis'],
  ),
  competency(
    'residual-causal-patching-evidence',
    ['resstream-041-layer-probing', 'resstream-042-activation-patching'],
    ['residual-patching-causal-evidence-decision'],
  ),
  competency(
    'residual-feature-interference',
    ['resstream-047-feature-erasure', 'resstream-065-negative-write'],
    ['residual-feature-interference-worked'],
  ),
  competency(
    'residual-state-vs-kv-cache',
    ['resstream-012-not-memory-bank', 'resstream-071-serving-cache'],
    ['residual-vs-kv-cache-serving-design'],
  ),
]);
