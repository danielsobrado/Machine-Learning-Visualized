export const P1_CLASSIC_NLP_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'bag-of-words': [
    {
      id: 'bow-sparse-memory-decision',
      level: 'calculation',
      relatedComparison: 'dense-bag-of-words-vs-sparse-count-storage',
      scenario: 'A document classifier has 100,000 documents and a 50,000-token vocabulary. A dense float32 bag-of-words matrix would contain 100,000 * 50,000 = 5,000,000,000 entries. Each document actually contains only about 80 nonzero token counts. Ignoring row-pointer overhead, a sparse representation stores one float32 count plus one uint32 column index per nonzero entry, or 8 bytes per nonzero.',
      prompt: 'Roughly how much storage does each representation need, and what design conclusion follows?',
      choices: [
        'Dense needs about 20 GB, while sparse nonzeros need about 64 MB, so bag-of-words should normally be stored and processed sparsely at this scale',
        'Dense needs about 5 GB, while sparse needs about 32 GB, so dense storage is preferable once the vocabulary is large',
        'Both need about 20 GB because sparse matrices still reserve one physical slot for every vocabulary term in every document',
      ],
      answerIndex: 0,
      explanation: 'The dense matrix has 5 billion float32 entries, so it needs about 20 billion bytes, roughly 20 GB in decimal units. Sparse storage keeps about 100,000 * 80 = 8,000,000 nonzeros; at 8 bytes each that is about 64 MB before row pointers. The calculation exposes why classic bag-of-words pipelines rely on sparse linear algebra instead of materializing dense vocabulary-sized vectors.',
      misconceptionTested: 'A sparse bag-of-words representation consumes essentially the same memory as a dense document-by-vocabulary matrix because every vocabulary coordinate supposedly needs physical storage.',
    },
  ],
  word2vec: [
    {
      id: 'word2vec-negative-sampling-logit',
      level: 'calculation',
      relatedComparison: 'positive-context-score-vs-negative-sample-score',
      scenario: 'A skip-gram negative-sampling update sees one positive word-context pair with dot product ln(3), so sigmoid(dot) = 0.75. It also sees one negative sample with dot product 0, so sigmoid(-dot) = 0.5. For this simplified update, use loss = -ln(sigmoid(positive_dot)) - ln(sigmoid(-negative_dot)). Use -ln(0.75) about 0.288 and -ln(0.5) about 0.693.',
      prompt: 'What is the total loss for this positive pair plus one negative sample, and what behavior does minimizing it encourage?',
      choices: [
        'About 0.981; training pushes observed word-context pairs toward larger positive scores and sampled negatives toward smaller scores',
        'About 0.405; training pushes both positive and negative pairs toward identical dot products so their probabilities match',
        'About 1.386; negative sampling ignores the positive pair and only penalizes the sampled negative example',
      ],
      answerIndex: 0,
      explanation: 'The positive contribution is about 0.288 and the negative contribution is about 0.693, for a total near 0.981. Gradient descent reduces this loss by increasing the positive pair dot product and decreasing the negative pair dot product. This is the local binary-classification view behind negative sampling; it avoids computing a full vocabulary softmax for every update.',
      misconceptionTested: 'Negative sampling merely removes vocabulary terms from the training batch and does not create an explicit objective that separates observed word-context pairs from sampled noise pairs.',
    },
  ],
  glove: [
    {
      id: 'glove-cooccurrence-residual',
      level: 'calculation',
      relatedComparison: 'global-log-cooccurrence-fit-vs-local-context-prediction',
      scenario: 'For one GloVe word-context pair, the observed co-occurrence count is X_ij = 100, so ln(X_ij) is about 4.605. The current model gives w_i dot w_j + b_i + b_j = 4.000. Suppose the weighting function for this pair is f(X_ij) = 0.5. The pair contribution to the GloVe objective is f(X_ij) * (model_value - ln(X_ij))^2.',
      prompt: 'What loss contribution does this pair make, approximately?',
      choices: [
        'About 0.183, because 0.5 * (4.000 - 4.605)^2 is about 0.5 * 0.366',
        'About 0.605, because GloVe uses the absolute difference between the raw count 100 and the model score 4.000',
        'About 50.0, because the co-occurrence count itself should multiply the squared residual without a logarithm or weighting function',
      ],
      answerIndex: 0,
      explanation: 'The residual is -0.605, whose square is about 0.366. Multiplying by the pair weight 0.5 gives roughly 0.183. GloVe fits weighted log co-occurrence statistics, so the exercise connects the embedding geometry to a global corpus statistic rather than to Word2Vec-style local next/context discrimination.',
      misconceptionTested: 'GloVe directly regresses raw co-occurrence counts with unweighted squared error, so neither the logarithm of counts nor the weighting function materially changes the objective.',
    },
  ],
  fasttext: [
    {
      id: 'fasttext-oov-ngram-average',
      level: 'calculation',
      relatedComparison: 'whole-word-oov-failure-vs-subword-composition',
      scenario: 'A simplified FastText-style model represents an unseen word using three known character n-gram vectors: g1 = (1, 0), g2 = (0, 1), and g3 = (1, 1). For this exercise, define the OOV word vector as the average of its available n-gram vectors. A whole-word-only embedding table has no vector for this unseen token.',
      prompt: 'What vector does the subword model construct, and why is this useful for OOV or morphologically related words?',
      choices: [
        'The vector is (2/3, 2/3); composing known subword pieces provides a usable representation even when the full word was never stored as a vocabulary entry',
        'The vector is (2, 2); FastText concatenates all n-gram vectors by summing them without any normalization and therefore cannot compare them with known-word vectors',
        'The vector is (0, 0); an unseen whole word must map to an unknown token even when all of its character n-grams were observed during training',
      ],
      answerIndex: 0,
      explanation: 'Summing the three vectors gives (2, 2), and dividing by three gives (2/3, 2/3). The simplified calculation captures the key FastText advantage: word representations can be composed from character-level pieces, which gives useful signal for rare, misspelled, inflected, or previously unseen forms instead of forcing every OOV item into one undifferentiated unknown vector.',
      misconceptionTested: 'Subword embeddings only help words that already have complete word-level entries; an unseen token cannot receive a meaningful vector even when its character n-grams are known.',
    },
  ],
});

export function getP1ClassicNlpAppliedScenariosForLesson(lessonId) {
  return P1_CLASSIC_NLP_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
