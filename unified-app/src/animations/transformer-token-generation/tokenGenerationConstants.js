export const BASE_CONTEXT = Object.freeze(['The', 'model', 'writes']);

export const TOKEN_GENERATION_VOCABULARY = Object.freeze([
  Object.freeze({ token: ' clearly', logit: 3.2 }),
  Object.freeze({ token: ' code', logit: 2.4 }),
  Object.freeze({ token: ' about', logit: 1.8 }),
  Object.freeze({ token: ' because', logit: 1.35 }),
  Object.freeze({ token: ' ...', logit: 0.55 }),
]);

export const TOKEN_GENERATION_DEFAULTS = Object.freeze({
  temperature: 0.9,
  topK: 3,
  topP: 0.9,
  strategy: 'sample',
  maxGeneratedTokens: 6,
});

export const TOKEN_GENERATION_LIMITS = Object.freeze({
  temperature: Object.freeze({ min: 0.3, max: 1.8, step: 0.05 }),
  topK: Object.freeze({ min: 1, max: TOKEN_GENERATION_VOCABULARY.length, step: 1 }),
  topP: Object.freeze({ min: 0.5, max: 1, step: 0.05 }),
});
