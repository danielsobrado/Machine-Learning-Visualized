export const P1_TOKENIZATION_COMPATIBILITY_SCENARIOS_BY_LESSON = Object.freeze({
  tokenization: [
    {
      id: 'tokenization-model-id-mapping-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'matching-token-strings-vs-matching-token-id-contract',
      scenario: 'A deployed language model was trained with tokenizer v1. A service update loads tokenizer v2, whose vocabulary contains many of the same token strings but assigns different integer ids to several of them. Model weights are unchanged, yet quality collapses immediately after the tokenizer-only release.',
      prompt: 'What compatibility failure should be investigated first?',
      choices: [
        'The tokenizer-to-model id contract is broken: the model embedding rows were learned for the v1 ids, so the exact vocabulary and id mapping must be pinned or migrated consistently with the model',
        'The model needs a larger context window because changing token ids only affects how many tokens fit, never which embedding rows are selected',
        'Nothing is wrong if token strings look similar, because embedding lookup uses the visible token text rather than the integer ids produced by the tokenizer',
      ],
      answerIndex: 0,
      explanation: 'The model does not look up embeddings by displayed token string. It consumes integer ids, and each id selects a specific learned embedding row. Reassigning ids while keeping the model weights fixed changes the numerical representation associated with the text, so tokenizer vocabulary and id mapping are part of the model artifact contract.',
      misconceptionTested: 'A tokenizer can be swapped independently of a trained model as long as its visible token strings are broadly similar.',
    },
  ],
});
