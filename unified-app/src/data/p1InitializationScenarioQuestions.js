export const P1_INITIALIZATION_SCENARIOS_BY_LESSON = Object.freeze({
  initialization: [
    {
      id: 'init-identical-hidden-units-symmetry-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'identical-hidden-initialization-vs-random-symmetry-breaking',
      scenario: 'A hidden layer has two neurons with identical incoming weights and identical biases. They receive the same input, use the same activation, and feed the next layer symmetrically. After several ordinary gradient updates, their activations and parameter gradients remain identical.',
      prompt: 'Why are the two neurons failing to specialize?',
      choices: [
        'Their identical initialization preserves symmetry, so they compute the same function and receive the same learning signal; randomized weight differences are needed to let them learn different features',
        'Neurons in the same layer are mathematically required to remain identical even when initialized differently',
        'The only problem is that biases should be initialized to very large random values while all weights remain identical',
      ],
      answerIndex: 0,
      explanation: 'When hidden units start identically and occupy symmetric positions in the computation, the forward values and backward gradients can remain identical. Random weight initialization breaks that symmetry so different units can follow different optimization paths. Zero biases are often fine because the weights already provide the symmetry breaking.',
      misconceptionTested: 'Random initialization is needed only to add noise; hidden units initialized identically will naturally differentiate under the same gradients.',
    },
  ],
});
