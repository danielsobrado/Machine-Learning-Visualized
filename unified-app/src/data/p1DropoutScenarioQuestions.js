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
    {
      id: 'dropout-module-mode-vs-autograd-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'module-training-state-vs-gradient-recording-state',
      scenario: 'A PyTorch-style validation loop wraps the forward pass in no_grad(), but the model is accidentally left in training mode. Repeated predictions still change and BatchNorm outputs depend on the validation batch. Another engineer suggests that no_grad() should already have disabled all training-only layer behavior.',
      prompt: 'Which distinction explains the bug and the correct fix?',
      choices: [
        'Gradient recording and module mode are separate controls: no_grad() suppresses autograd bookkeeping, while model.eval() changes Dropout and BatchNorm behavior; ordinary validation usually needs both eval mode and disabled gradient recording',
        'no_grad() and model.eval() are aliases, so the changing predictions prove the random seed is the only possible cause',
        'model.eval() disables all gradients automatically, so using no_grad() with it would make the forward pass invalid',
      ],
      answerIndex: 0,
      explanation: 'Module mode controls layers whose forward behavior differs between training and evaluation, such as Dropout and BatchNorm. Autograd mode controls whether operations are recorded for differentiation. They are independent: evaluation can still record gradients, and a no-grad training-mode forward can still apply dropout masks and batch statistics.',
      misconceptionTested: 'Disabling gradient recording automatically switches every module into evaluation behavior, or evaluation mode automatically disables autograd.',
    },
  ],
});

export function getP1DropoutScenariosForLesson(lessonId) {
  return P1_DROPOUT_SCENARIOS_BY_LESSON[lessonId] || [];
}
