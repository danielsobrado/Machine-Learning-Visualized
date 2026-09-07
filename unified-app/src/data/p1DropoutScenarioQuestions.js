export const P1_DROPOUT_SCENARIOS_BY_LESSON = Object.freeze({
  'dropout-batchnorm': [
    {
      id: 'dropout-inverted-expectation-worked',
      level: 'calculation',
      relatedComparison: 'inverted-dropout-training-scale-vs-inference-scale',
      scenario: 'A hidden activation is 6 before dropout. The dropout rate is p = 0.25, so the keep probability is q = 0.75. The implementation uses inverted dropout, which divides kept activations by q during training and applies no dropout scaling during ordinary inference.',
      prompt: 'What value is used when this activation is kept during training, what is its expected training-time value after dropout, and what value is used at inference?',
      choices: [
        'A kept training activation becomes 6 / 0.75 = 8; the expectation is 0.75 * 8 + 0.25 * 0 = 6; inference uses the original value 6 without another scale correction',
        'A kept training activation stays 6; the expectation is 4.5; inference multiplies by 0.75 again to produce 4.5',
        'A kept training activation becomes 4.5; the expectation is 3.375; inference divides by 0.75 because inverted dropout performs all scaling after training',
      ],
      answerIndex: 0,
      explanation: 'Inverted dropout scales a kept activation by 1/q during training. That makes the expected post-dropout activation match the pre-dropout value: q * (a/q) = a. Because the expectation is already preserved during training, ordinary inference disables the random mask and does not need a second dropout-specific scale correction.',
      misconceptionTested: 'Inverted dropout leaves training activations unscaled and compensates only during inference.',
    },
    {
      id: 'dropout-batchnorm-order-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'dropout-masking-vs-batchnorm-statistics',
      scenario: 'A block applies a dense transform, then dropout, then BatchNorm. During training the dropout mask zeros a changing subset of activations before BatchNorm computes its mini-batch statistics. During evaluation dropout is disabled while BatchNorm uses running statistics accumulated from the masked training activations. The team assumes dropout and BatchNorm can be reordered without changing anything.',
      prompt: 'What interaction should be investigated first?',
      choices: [
        'Dropout before BatchNorm changes the distribution used to estimate BatchNorm statistics; compare an ordering or normalization design where the statistics represent the intended activations, and validate the architecture rather than treating the two operations as commutative',
        'There is no interaction because BatchNorm statistics are mathematically identical whether random activations are zeroed before or after the normalization step',
        'Keep the ordering and force dropout to remain active during inference so BatchNorm sees the same random masks as training on every production request',
      ],
      answerIndex: 0,
      explanation: 'Dropout changes the values and distribution that a following BatchNorm layer observes, so its batch and running statistics can reflect the masked training distribution. At ordinary inference dropout disappears while BatchNorm uses stored statistics. This does not imply one universal layer order for every architecture, but it does mean the operations are not interchangeable and their ordering should be chosen and validated deliberately.',
      misconceptionTested: 'Dropout and BatchNorm commute, so their order cannot affect learned normalization statistics or the train-to-inference distribution.',
    },
  ],
});

export function getP1DropoutScenariosForLesson(lessonId) {
  return P1_DROPOUT_SCENARIOS_BY_LESSON[lessonId] || [];
}
