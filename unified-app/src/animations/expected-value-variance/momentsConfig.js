export const DISTRIBUTION_PRESETS = [
  {
    id: 'fair-die',
    label: 'Fair die',
    outcomes: [1, 2, 3, 4, 5, 6],
    probabilities: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
  },
  {
    id: 'stable-five',
    label: 'Stable mean = 5',
    outcomes: [4, 6],
    probabilities: [0.5, 0.5],
  },
  {
    id: 'risky-five',
    label: 'Risky mean = 5',
    outcomes: [-20, 30],
    probabilities: [0.5, 0.5],
  },
  {
    id: 'rare-jackpot',
    label: 'Rare jackpot',
    outcomes: [-1, 99],
    probabilities: [0.99, 0.01],
  },
];

export const DEFAULT_SCENARIO = {
  presetId: 'fair-die',
  scale: 1,
  shift: 0,
  independentCopies: 4,
  lossThreshold: 0,
  sampleSize: 800,
  seed: 23,
};

export const CONTROL_LIMITS = {
  scale: { min: -3, max: 3, step: 0.25 },
  shift: { min: -10, max: 10, step: 0.5 },
  independentCopies: { min: 1, max: 20, step: 1 },
  lossThreshold: { min: -20, max: 20, step: 1 },
  sampleSize: { min: 100, max: 3000, step: 100 },
};
