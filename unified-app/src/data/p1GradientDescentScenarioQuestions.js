export const P1_GRADIENT_DESCENT_SCENARIOS_BY_LESSON = Object.freeze({
  'gradient-descent': [
    {
      id: 'gd-wrong-sign-local-increase-worked',
      level: 'calculation',
      relatedComparison: 'gradient-descent-vs-gradient-ascent-sign',
      scenario: 'For L(w) = w^2, the current parameter is w = 2, so dL/dw = 4. A custom optimizer uses learning rate 0.1 but accidentally updates w_next = w + learning_rate * gradient.',
      prompt: 'What happens after this incorrect update?',
      choices: [
        'w becomes 2.4 and the loss rises from 4 to 5.76, showing that adding the gradient performs local ascent here',
        'w becomes 1.6 and the loss falls to 2.56 because the sign does not matter when the gradient is positive',
        'w becomes 0 because gradient descent always jumps directly to the minimum of a quadratic',
      ],
      answerIndex: 0,
      explanation: 'The buggy update gives 2 + 0.1 × 4 = 2.4. Since L(2.4) = 5.76, the objective increases from 4. Ordinary gradient descent subtracts the gradient because the gradient points toward local increase.',
      misconceptionTested: 'The gradient direction is automatically a descent direction regardless of whether the optimizer adds or subtracts it.',
    },
    {
      id: 'gd-missing-zero-grad-accumulation-worked',
      level: 'diagnosis',
      relatedComparison: 'per-batch-gradient-vs-unintended-accumulation',
      scenario: 'A framework accumulates gradients by default. Batch 1 produces gradient 3 for one parameter and the optimizer steps. The code forgets to clear gradients. Batch 2 independently produces gradient 4 before the next optimizer step, while the intended algorithm should use only the current batch gradient.',
      prompt: 'What gradient will the second optimizer step see if accumulation is additive?',
      choices: [
        '7, because the stale gradient 3 remains and the new gradient 4 is added to it',
        '4, because every backward pass automatically replaces existing gradients in all frameworks',
        '1, because accumulated gradients are always averaged by subtracting the previous batch gradient',
      ],
      answerIndex: 0,
      explanation: 'Without clearing the stored gradient, the second backward pass adds 4 to the existing 3, leaving 7. That changes the intended update magnitude and direction whenever batches disagree. Explicit gradient-reset placement is therefore part of the optimizer algorithm, not just memory cleanup.',
      misconceptionTested: 'Calling backward automatically replaces old gradients, so omitting the gradient reset cannot change optimization behavior.',
    },
    {
      id: 'gd-feature-scaling-conditioning-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'raw-scale-ill-conditioning-vs-scaled-optimization',
      scenario: 'A two-feature linear model uses x1 in the range 0-1 and x2 in the range 0-1,000,000. With one global learning rate, the loss trace zigzags sharply and the parameter tied to x2 receives gradients many orders of magnitude larger than the parameter tied to x1.',
      prompt: 'What should be investigated before changing the model family?',
      choices: [
        'Feature scaling and loss conditioning, because the extreme unit mismatch can create very different curvature and gradient scales across parameter directions',
        'Adding more unscaled features, because additional dimensions automatically equalize gradient magnitudes',
        'Using the test set for gradient updates, because validation cannot diagnose conditioning problems',
      ],
      answerIndex: 0,
      explanation: 'Gradient descent uses one update rule across parameter directions. Large unit differences can make the loss surface highly elongated, so a learning rate safe in one direction is inefficient or unstable in another. Scaling can improve conditioning and make optimization easier.',
      misconceptionTested: 'Feature units affect only the interpretation of coefficients and cannot materially change gradient-descent dynamics.',
    },
  ],
});
