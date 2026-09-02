export const CLASSIC_NLP_AUDITED_LESSON_IDS = Object.freeze([
  'bag-of-words',
  'word2vec',
  'glove',
  'fasttext',
]);

export const CLASSIC_NLP_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'bag-of-words',
    competency: 'sparse-storage-scaling',
    scenarioIds: Object.freeze(['bow-sparse-memory-decision']),
  }),
  Object.freeze({
    lessonId: 'word2vec',
    competency: 'negative-sampling-objective',
    scenarioIds: Object.freeze(['word2vec-negative-sampling-logit']),
  }),
  Object.freeze({
    lessonId: 'glove',
    competency: 'weighted-log-cooccurrence-loss',
    scenarioIds: Object.freeze(['glove-cooccurrence-residual']),
  }),
  Object.freeze({
    lessonId: 'fasttext',
    competency: 'oov-subword-composition',
    scenarioIds: Object.freeze(['fasttext-oov-ngram-average']),
  }),
]);
