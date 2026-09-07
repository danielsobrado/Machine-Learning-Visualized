function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TRANSFORMER_FAMILY_OBJECTIVE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'transformer-architecture-families',
  'llm-training-objectives',
]);

export const TRANSFORMER_FAMILY_OBJECTIVE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'architecture-family-task-routing',
    'transformer-architecture-families',
    ['tfam-012-classification-fit', 'tfam-013-chat-fit', 'tfam-014-translation-fit'],
    ['transformer-family-three-task-routing'],
  ),
  competency(
    'architecture-family-visibility-contract',
    'transformer-architecture-families',
    ['tfam-015-bidirectional', 'tfam-016-causal', 'tfam-039-context-flow'],
    ['transformer-family-mask-mismatch-diagnosis'],
  ),
  competency(
    'architecture-family-autoregressive-output',
    'transformer-architecture-families',
    ['tfam-024-encoder-limitation', 'tfam-027-decoder-inference'],
    ['transformer-family-encoder-generation-mismatch'],
  ),
  competency(
    'architecture-family-source-conditioned-generation',
    'transformer-architecture-families',
    ['tfam-031-cross-memory', 'tfam-043-cross-attention-placement'],
    ['transformer-family-missing-cross-attention'],
  ),
  competency(
    'objective-causal-vs-masked-language-modeling',
    'llm-training-objectives',
    ['ltobj-003-pretraining', 'ltobj-004-masked-token'],
    ['objective-causal-vs-mlm'],
  ),
  competency(
    'objective-next-token-target-shift',
    'llm-training-objectives',
    ['ltobj-021-next-token-loss', 'ltobj-022-causal-context'],
    ['llm-objective-next-token-shift-worked'],
  ),
  competency(
    'objective-sft-response-loss-scope',
    'llm-training-objectives',
    ['ltobj-027-sft-loss', 'ltobj-028-assistant-token-loss', 'ltobj-049-loss-scope'],
    ['llm-objective-sft-response-loss-scope'],
  ),
  competency(
    'objective-preference-pair-context',
    'llm-training-objectives',
    ['ltobj-030-preference-pair', 'ltobj-032-preference-context'],
    ['llm-objective-preference-pair-context-bug'],
  ),
  competency(
    'objective-knowledge-vs-behavior',
    'llm-training-objectives',
    ['ltobj-013-alignment-mistake', 'ltobj-039-instruction-vs-knowledge'],
    ['llm-objective-knowledge-vs-behavior-choice'],
  ),
  competency(
    'objective-proxy-mismatch-overoptimization',
    'llm-training-objectives',
    ['ltobj-045-objective-mismatch', 'ltobj-046-preference-overpush'],
    ['llm-objective-preference-overoptimization'],
  ),
]);
