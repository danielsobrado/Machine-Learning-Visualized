export const EVALUATION_MODE_DEFAULTS = Object.freeze({
  trainingMode: false,
  recordGradients: false,
});

export const EVALUATION_MODE_SCENARIOS = Object.freeze([
  Object.freeze({
    id: 'serve',
    label: 'Ordinary inference',
    trainingMode: false,
    recordGradients: false,
    description: 'Deterministic Dropout/BatchNorm behavior without building an autograd graph.',
  }),
  Object.freeze({
    id: 'validation-with-gradients',
    label: 'Validation + gradients',
    trainingMode: false,
    recordGradients: true,
    description: 'Useful for saliency or gradient-based analysis while keeping evaluation behavior.',
  }),
  Object.freeze({
    id: 'no-grad-training-mode',
    label: 'No-grad but training mode',
    trainingMode: true,
    recordGradients: false,
    description: 'No autograd graph, but Dropout is still stochastic and BatchNorm still uses batch statistics.',
  }),
]);
