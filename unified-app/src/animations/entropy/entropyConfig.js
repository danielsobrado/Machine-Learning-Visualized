export const ENTROPY_PRESETS = [
  {
    id: 'fair-four',
    label: 'Fair 4-way choice',
    detail: 'Four equally likely outcomes: maximum uncertainty for four symbols.',
    weights: [1, 1, 1, 1],
  },
  {
    id: 'biased-four',
    label: 'Biased 4-way choice',
    detail: 'One outcome dominates, so the next symbol is easier to predict.',
    weights: [7, 1, 1, 1],
  },
  {
    id: 'almost-certain',
    label: 'Almost certain',
    detail: 'Nearly all mass sits on one outcome. Entropy approaches zero.',
    weights: [97, 1, 1, 1],
  },
  {
    id: 'long-tail-eight',
    label: 'Eight outcomes, long tail',
    detail: 'More possible outcomes do not guarantee high entropy when probability is concentrated.',
    weights: [70, 10, 6, 4, 3, 3, 2, 2],
  },
];

export const MODEL_PRESETS = [
  {
    id: 'matched',
    label: 'Matched model',
    transform: 'matched',
    detail: 'Q matches the true distribution P, so KL divergence is zero.',
  },
  {
    id: 'uniform',
    label: 'Uniform model',
    transform: 'uniform',
    detail: 'Q ignores structure and spreads mass evenly.',
  },
  {
    id: 'reversed',
    label: 'Wrong ranking',
    transform: 'reversed',
    detail: 'Q gives the largest probabilities to outcomes that P considers least likely.',
  },
  {
    id: 'softened',
    label: 'Over-smoothed model',
    transform: 'softened',
    detail: 'Q has the right ranking but is flatter than P.',
  },
];

export const ENTROPY_DEFAULTS = {
  presetId: 'biased-four',
  modelPresetId: 'uniform',
  sampleSize: 800,
  seed: 2026,
};
