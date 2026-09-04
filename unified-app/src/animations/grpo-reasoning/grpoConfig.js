export const GRPO_PRESETS = [
  {
    id: 'mixed',
    label: 'Mixed group',
    detail: 'Useful reward contrast: some completions win and others lose.',
    rewards: [1, 1, 0, 0, 1, 0, 1, 0],
    oldProbabilities: [0.18, 0.24, 0.14, 0.30, 0.10, 0.22, 0.16, 0.26],
    newProbabilities: [0.22, 0.29, 0.11, 0.25, 0.13, 0.18, 0.20, 0.21],
  },
  {
    id: 'all-correct',
    label: 'All correct',
    detail: 'Every reward is identical, so group-standardized advantages collapse to zero.',
    rewards: [1, 1, 1, 1, 1, 1, 1, 1],
    oldProbabilities: [0.18, 0.24, 0.14, 0.30, 0.10, 0.22, 0.16, 0.26],
    newProbabilities: [0.22, 0.29, 0.18, 0.33, 0.13, 0.26, 0.20, 0.29],
  },
  {
    id: 'all-wrong',
    label: 'All wrong',
    detail: 'Uniform failure also gives no within-group relative signal.',
    rewards: [0, 0, 0, 0, 0, 0, 0, 0],
    oldProbabilities: [0.18, 0.24, 0.14, 0.30, 0.10, 0.22, 0.16, 0.26],
    newProbabilities: [0.16, 0.20, 0.12, 0.27, 0.09, 0.19, 0.14, 0.23],
  },
  {
    id: 'outlier',
    label: 'Reward outlier',
    detail: 'One unusually high reward changes the group-relative normalization for every sibling.',
    rewards: [4, 1, 1, 0, 0, 0, 0, 0],
    oldProbabilities: [0.18, 0.24, 0.14, 0.30, 0.10, 0.22, 0.16, 0.26],
    newProbabilities: [0.28, 0.27, 0.16, 0.25, 0.08, 0.18, 0.13, 0.20],
  },
];

export const GRPO_DEFAULTS = {
  presetId: 'mixed',
  clipEpsilon: 0.2,
  klBeta: 0.04,
};
