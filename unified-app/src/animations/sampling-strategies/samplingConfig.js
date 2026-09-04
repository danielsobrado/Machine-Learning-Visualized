export const TOKEN_LOGITS = [
  { token: ' clear', logit: 3.1 },
  { token: ' careful', logit: 2.45 },
  { token: ' creative', logit: 2.05 },
  { token: ' risky', logit: 1.25 },
  { token: ' strange', logit: 0.55 },
  { token: ' broken', logit: -0.15 },
];

export const STRATEGIES = [
  {
    id: 'greedy',
    label: 'Greedy',
    detail: 'Pick the single highest-probability token. No randomness survives.',
  },
  {
    id: 'temperature',
    label: 'Temperature',
    detail: 'Rescale logits, then sample from the full vocabulary.',
  },
  {
    id: 'topK',
    label: 'Top-k',
    detail: 'Keep exactly the k highest-probability tokens, renormalize, then sample.',
  },
  {
    id: 'topP',
    label: 'Top-p',
    detail: 'Keep the smallest ranked prefix whose cumulative mass reaches p, then renormalize.',
  },
  {
    id: 'beam',
    label: 'Beam search',
    detail: 'Keep the best partial sequences by cumulative log probability and expand them.',
  },
];

export const BEAM_TREE = {
  start: [
    { token: ' A', probability: 0.55, next: 'A' },
    { token: ' B', probability: 0.45, next: 'B' },
  ],
  A: [
    { token: '1', probability: 0.51 },
    { token: '2', probability: 0.49 },
  ],
  B: [
    { token: '1', probability: 0.90 },
    { token: '2', probability: 0.10 },
  ],
};

export const SAMPLING_DEFAULTS = {
  strategyId: 'topP',
  temperature: 0.8,
  topK: 4,
  topP: 0.86,
  beamWidth: 2,
  seed: 17,
};
