export const P1_CNN_SCENARIOS_BY_LESSON = Object.freeze({
  conv2d: [
    {
      id: 'conv2d-stride-padding-dilation-worked',
      level: 'calculation',
      relatedComparison: 'raw-kernel-size-vs-effective-dilated-kernel-size',
      scenario: 'A 15 x 15 feature map is processed by a 3 x 3 Conv2D with dilation 2, stride 2, and padding 2. For one spatial axis, use effectiveKernel = dilation * (kernel - 1) + 1 and output = floor((input + 2 * padding - effectiveKernel) / stride) + 1.',
      prompt: 'What effective kernel size and output spatial size result?',
      choices: [
        'The effective kernel is 5 and the output is 8 x 8 because floor((15 + 4 - 5) / 2) + 1 = 8 on each axis',
        'The effective kernel is 3 and the output is 9 x 9 because dilation changes only which weights are learned, not the sampled footprint',
        'The effective kernel is 6 and the output is 7 x 7 because dilation should be multiplied directly by the raw kernel size',
      ],
      answerIndex: 0,
      explanation: 'Dilation 2 spreads the three sampled kernel positions across an effective width of 2 * (3 - 1) + 1 = 5. Using that effective footprint in the convolution shape formula gives floor((15 + 4 - 5) / 2) + 1 = 8 for both height and width.',
      misconceptionTested: 'Dilation can be ignored in output-shape math, or effective kernel size is simply dilation times raw kernel size.',
    },
    {
      id: 'conv2d-parameter-sharing-worked',
      level: 'calculation',
      relatedComparison: 'shared-convolution-parameters-vs-location-specific-parameters',
      scenario: 'A standard Conv2D receives an RGB image and uses 32 filters of size 3 x 3 with one bias per filter. The same learned filter weights are reused at every spatial output location.',
      prompt: 'How many trainable parameters does the layer have, and why does increasing the image width and height not multiply that count?',
      choices: [
        'It has 32 * 3 * 3 * 3 + 32 = 896 parameters; spatial positions reuse those same filter weights and biases, so image size changes the number of filter applications rather than creating new parameters',
        'It has 896 parameters per output location because standard convolution learns a separate 3 x 3 x 3 kernel at every spatial coordinate',
        'It has 32 * 3 * 3 + 32 = 320 parameters because RGB channels share the same kernel slice inside each filter',
      ],
      answerIndex: 0,
      explanation: 'Each of 32 filters spans all three RGB channels, so each filter has 3 * 3 * 3 = 27 weights plus one bias. Standard convolution shares each filter across spatial locations, so the total parameter count is 32 * 27 + 32 = 896 and does not scale with image height or width.',
      misconceptionTested: 'Weight sharing means only channels share weights, or every spatial output position owns a separate kernel in standard Conv2D.',
    },
    {
      id: 'conv2d-output-shape-channels-worked',
      level: 'calculation',
      relatedComparison: 'spatial-shape-formula-vs-output-channel-count',
      scenario: 'An NCHW tensor has shape [10, 3, 32, 40]. A Conv2D uses 24 filters, kernel 5 x 5, stride 2, padding 2, and dilation 1.',
      prompt: 'What is the full output tensor shape?',
      choices: [
        '[10, 24, 16, 20]: batch size stays 10, output channels equal the 24 filters, and the spatial axes become floor((32 + 4 - 5) / 2) + 1 = 16 and floor((40 + 4 - 5) / 2) + 1 = 20',
        '[10, 3, 16, 20]: convolution changes only spatial dimensions, so the channel count must remain equal to the RGB input channels',
        '[24, 10, 32, 40]: filter count replaces the batch dimension while padding preserves both spatial axes despite stride 2',
      ],
      answerIndex: 0,
      explanation: 'Conv2D preserves the batch dimension, sets output channels from the filter count, and computes height and width independently with the convolution shape formula. The result is therefore [10, 24, 16, 20].',
      misconceptionTested: 'Conv2D output channels must equal input channels, or stride and padding can be ignored when reasoning about the full output tensor shape.',
    },
  ],
});

export function getP1CnnScenariosForLesson(lessonId) {
  return P1_CNN_SCENARIOS_BY_LESSON[lessonId] || [];
}
