export const FOUNDATIONS_NEXT_LESSON_IDS = Object.freeze(new Set([
  'gradient-descent',
  'probability-distributions',
  'loss-functions-likelihoods',
  'maximum-likelihood-estimation',
]));

export const GRADIENT_DESCENT_NEXT_DEFAULTS = Object.freeze({
  curvatureX: 1,
  curvatureY: 25,
  startX: 5,
  startY: 3,
  steps: 18,
  learningRate: 0.04,
  momentum: 0.82,
  preconditionedLearningRate: 0.35,
});

export const PROBABILITY_NEXT_DEFAULTS = Object.freeze({
  separation: 4,
  standardDeviation: 0.7,
  leftWeight: 0.5,
});

export const IMBALANCE_LOSS_NEXT_DEFAULTS = Object.freeze({
  minorityWeight: 4,
  gamma: 2,
  rows: Object.freeze([
    Object.freeze({ group: 'majority', trueClassProbability: 0.98 }),
    Object.freeze({ group: 'majority', trueClassProbability: 0.96 }),
    Object.freeze({ group: 'majority', trueClassProbability: 0.94 }),
    Object.freeze({ group: 'majority', trueClassProbability: 0.91 }),
    Object.freeze({ group: 'majority', trueClassProbability: 0.88 }),
    Object.freeze({ group: 'minority', trueClassProbability: 0.65 }),
    Object.freeze({ group: 'minority', trueClassProbability: 0.4 }),
  ]),
});

export const MLE_NEXT_DEFAULTS = Object.freeze({
  successes: 7,
  trials: 10,
  priorMean: 0.5,
  concentration: 8,
  sweepConcentrations: Object.freeze([4, 8, 16, 32]),
});
