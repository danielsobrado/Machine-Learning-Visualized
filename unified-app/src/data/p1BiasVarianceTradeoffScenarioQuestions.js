export const P1_BIAS_VARIANCE_TRADEOFF_SCENARIOS_BY_LESSON = Object.freeze({
  'bias-variance-tradeoff': [
    {
      id: 'bias-variance-high-bias-remedy-decision',
      level: 'decision',
      relatedComparison: 'high-bias-vs-high-variance-remedy',
      scenario: 'A model has 24% training error and 26% validation error. The gap is small, both errors are far above the product target, and repeated training runs are stable. The current feature set is known to omit an important nonlinear interaction.',
      prompt: 'Which next experiment best targets the dominant problem?',
      choices: [
        'Improve the representation or model capacity so the missing interaction can be expressed, then re-evaluate held-out performance',
        'Add much stronger regularization because the small train-validation gap proves the model has excessive variance',
        'Collect more copies of the same training rows because high bias is fixed primarily by reducing sample variance',
      ],
      answerIndex: 0,
      explanation: 'High and similar train/validation errors with stable fits point toward bias, weak representation, optimization failure, or insufficient capacity rather than classic variance. Because a known interaction is missing, enriching the representation directly targets the suspected source of systematic error.',
      misconceptionTested: 'Any poor validation score should first be treated as overfitting and corrected with stronger regularization.',
    },
    {
      id: 'bias-variance-repeated-sample-variance-worked',
      level: 'diagnosis',
      relatedComparison: 'stable-vs-sample-sensitive-fitted-predictions',
      scenario: 'At the same input x, four models trained on four bootstrap samples predict as follows. Model family A: [4.9, 5.1, 5.0, 5.0]. Model family B: [2.0, 8.0, 3.0, 7.0]. Both families have mean prediction 5.0 across these fits.',
      prompt: 'Which family shows the stronger variance problem at this input?',
      choices: [
        'Family B because its prediction changes dramatically across plausible training samples despite having the same average prediction',
        'Family A because values near the mean always imply high variance',
        'Neither, because equal average predictions imply equal variance',
      ],
      answerIndex: 0,
      explanation: 'Variance measures sensitivity of fitted predictions to the sampled training data. Family B ranges from 2 to 8 while Family A stays close to 5, so B is much more sample-sensitive even though their mean predictions are identical.',
      misconceptionTested: 'Two model families with the same average prediction must have the same variance across training samples.',
    },
    {
      id: 'bias-variance-irreducible-noise-decision',
      level: 'decision',
      relatedComparison: 'reducible-model-error-vs-irreducible-outcome-noise',
      scenario: 'Across many independently resampled training sets, a flexible model has low squared bias and low prediction variance. Repeated measurements of the target at the same feature values still fluctuate substantially because of genuine unobserved randomness in the outcome. Increasing model complexity no longer changes held-out error much.',
      prompt: 'Which conclusion best matches the bias-variance decomposition?',
      choices: [
        'The remaining error proves the model is still underfitting, so increasing degree or depth must eventually drive expected test error to zero',
        'The remaining error is necessarily variance from finite training samples, so retraining the same model many times will eliminate it completely',
        'A substantial part of the remaining expected error can be irreducible noise; model changes may reduce bias or variance, but cannot predict randomness that is not represented in the available features',
      ],
      answerIndex: 2,
      explanation: 'For squared error, the teaching decomposition separates systematic bias, sampling variance, and irreducible outcome variance. Once bias and variance are already small, genuine conditional target noise can dominate. More flexible fitting cannot remove randomness that the inputs do not contain information about.',
      misconceptionTested: 'Every component of held-out prediction error can be driven to zero by increasing model capacity or repeating training often enough.',
    },
  ],
});
