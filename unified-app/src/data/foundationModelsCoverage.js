export const FOUNDATION_MODELS_AUDITED_LESSON_IDS = Object.freeze([
  'bert',
  'gpt2-comprehensive',
  'multimodal-llm',
]);

export const FOUNDATION_MODELS_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'bert',
    competencies: Object.freeze([
      Object.freeze({ competency: 'masked-language-model-corruption-budget', scenarioId: 'bert-mlm-corruption-budget' }),
      Object.freeze({ competency: 'task-head-parameter-count', scenarioId: 'bert-classifier-head-params' }),
    ]),
  }),
  Object.freeze({
    lessonId: 'gpt2-comprehensive',
    competencies: Object.freeze([
      Object.freeze({ competency: 'causal-target-shift-count', scenarioId: 'gpt2-next-token-target-count' }),
      Object.freeze({ competency: 'quadratic-context-attention-scaling', scenarioId: 'gpt2-context-quadratic-cost' }),
    ]),
  }),
  Object.freeze({
    lessonId: 'multimodal-llm',
    competencies: Object.freeze([
      Object.freeze({ competency: 'vision-language-projector-parameter-count', scenarioId: 'multimodal-projector-params' }),
      Object.freeze({ competency: 'image-resolution-token-attention-scaling', scenarioId: 'multimodal-resolution-token-cost' }),
    ]),
  }),
]);
