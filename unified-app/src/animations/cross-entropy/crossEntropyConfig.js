export const CROSS_ENTROPY_SCENARIOS = [
  {
    id: 'correct-cautious',
    label: 'Correct, cautious',
    detail: 'The correct class wins, but confidence is modest.',
    targetIndex: 0,
    logits: [0.05, 0, -1.2],
  },
  {
    id: 'correct-confident',
    label: 'Correct, confident',
    detail: 'Same accuracy as the cautious model, but much more probability is assigned to the truth.',
    targetIndex: 0,
    logits: [4.5, 0, -1],
  },
  {
    id: 'wrong-cautious',
    label: 'Wrong, cautious',
    detail: 'The model is wrong, but it did not place overwhelming confidence on the wrong class.',
    targetIndex: 0,
    logits: [0, 0.1, -1],
  },
  {
    id: 'wrong-overconfident',
    label: 'Wrong, overconfident',
    detail: 'Cross-entropy strongly punishes confident wrong predictions.',
    targetIndex: 0,
    logits: [-5, 5, -2],
  },
  {
    id: 'extreme-logits',
    label: 'Extreme logits',
    detail: 'Stable log-sum-exp keeps the loss finite even when logits are huge.',
    targetIndex: 0,
    logits: [1000, 999, -1000],
  },
];

export const CROSS_ENTROPY_BATCH_EXAMPLES = Object.freeze([
  Object.freeze({ id: 'easy', targetIndex: 0, logits: Object.freeze([2.4, 0.2, -1]) }),
  Object.freeze({ id: 'hard', targetIndex: 1, logits: Object.freeze([1.1, 0.9, -0.3]) }),
  Object.freeze({ id: 'wrong', targetIndex: 2, logits: Object.freeze([2.2, 0.3, 0]) }),
]);

export const CROSS_ENTROPY_DEFAULTS = {
  scenarioId: 'correct-cautious',
  logitScale: 1,
  labelSmoothing: 0,
};
