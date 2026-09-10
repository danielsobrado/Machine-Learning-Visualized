function competency(id, lessonId, quizIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
  });
}

export const CLASSIC_NLP_QUIZ_AUDITED_LESSON_IDS = Object.freeze([
  'bag-of-words',
  'word2vec',
  'glove',
  'fasttext',
]);

export const CLASSIC_NLP_QUIZ_REQUIREMENTS = Object.freeze([
  competency('bow-order-and-composition-limit', 'bag-of-words', [
    'bow-037',
    'bow-053',
  ]),
  competency('bow-fixed-vocabulary-transform-contract', 'bag-of-words', [
    'bow-040',
    'bow-078',
  ]),
  competency('bow-sparse-baseline-remains-useful', 'bag-of-words', [
    'bow-088',
    'bow-090',
  ]),
  competency('word2vec-static-context-and-oov-limits', 'word2vec', [
    'w2v-057',
    'w2v-086',
  ]),
  competency('word2vec-negative-sampling-semantics', 'word2vec', [
    'w2v-079',
    'w2v-090',
  ]),
  competency('word2vec-evaluation-over-visual-demos', 'word2vec', [
    'w2v-084',
    'w2v-088',
  ]),
  competency('glove-global-cooccurrence-objective', 'glove', [
    'glv-050',
    'glv-077',
  ]),
  competency('glove-static-domain-and-oov-boundaries', 'glove', [
    'glv-058',
    'glv-085',
  ]),
  competency('glove-validation-over-projection-demos', 'glove', [
    'glv-063',
    'glv-088',
  ]),
  competency('fasttext-oov-is-composed-not-guaranteed', 'fasttext', [
    'ftx-041',
    'ftx-080',
  ]),
  competency('fasttext-subword-sharing-can-mislead', 'fasttext', [
    'ftx-063',
    'ftx-087',
  ]),
  competency('fasttext-static-vs-contextual-boundary', 'fasttext', [
    'ftx-059',
    'ftx-078',
  ]),
]);
