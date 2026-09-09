function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TRANSFORMER_CORE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'positional-encoding',
  'rope',
  'residual-stream',
  'transformer',
  'transformer-architecture-families',
  'llm-training-objectives',
  'transformer-token-generation',
  'sampling-strategies',
  'fine-tuning',
]);

export const TRANSFORMER_CORE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'position-encoding-shift-generalization',
    'positional-encoding',
    ['posenc-035-absolute-vs-relative', 'posenc-034-extrapolation-limit'],
    ['position-shift-generalization-design'],
  ),
  competency(
    'rope-position-interpolation-arithmetic',
    'rope',
    ['rope-046-long-context-scaling', 'rope-047-ntk-caveat'],
    ['rope-position-interpolation-worked'],
  ),
  competency(
    'residual-stream-additive-update',
    'residual-stream',
    ['resstream-003-additive-update', 'resstream-021-formula'],
    ['residual-stream-additive-update-worked'],
  ),
  competency(
    'transformer-prenorm-depth-stability',
    'transformer',
    ['transformer-030-layernorm-placement', 'transformer-031-pre-norm', 'transformer-032-post-norm'],
    ['transformer-prenorm-stability-diagnosis'],
  ),
  competency(
    'transformer-family-workload-fit',
    'transformer-architecture-families',
    ['tfam-012-classification-fit', 'tfam-013-chat-fit', 'tfam-014-translation-fit'],
    ['transformer-family-workload-decision'],
  ),
  competency(
    'causal-lm-next-token-target-shift',
    'llm-training-objectives',
    ['ltobj-021-next-token-loss', 'ltobj-022-causal-context'],
    ['causal-objective-target-shift-diagnosis'],
  ),
  competency(
    'generation-temperature-logit-scaling',
    'transformer-token-generation',
    ['ttg-025-temperature-math', 'ttg-026-low-temp', 'ttg-027-high-temp'],
    ['generation-temperature-worked'],
  ),
  competency(
    'sampling-top-p-cumulative-mass',
    'sampling-strategies',
    ['samp-026-topp-mechanism', 'samp-048-topp-threshold'],
    ['sampling-top-p-worked'],
  ),
  competency(
    'finetuning-catastrophic-forgetting-tradeoff',
    'fine-tuning',
    ['ftune-039-catastrophic-forgetting', 'ftune-040-eval-splits'],
    ['finetune-catastrophic-forgetting-decision'],
  ),
]);
