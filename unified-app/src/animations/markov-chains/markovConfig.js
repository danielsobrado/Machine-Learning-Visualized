export const MARKOV_PRESETS = [
  {
    id: 'weather',
    label: 'Ergodic weather',
    detail: 'Irreducible and aperiodic: every start converges to the same stationary distribution.',
    states: ['Sunny', 'Cloudy', 'Rainy'],
    matrix: [
      [0.7, 0.2, 0.1],
      [0.3, 0.4, 0.3],
      [0.2, 0.3, 0.5],
    ],
  },
  {
    id: 'absorbing',
    label: 'Two absorbing outcomes',
    detail: 'The chain is not irreducible, so the limiting distribution depends on where probability starts.',
    states: ['Start', 'Win', 'Lose'],
    matrix: [
      [0.0, 0.65, 0.35],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0],
    ],
  },
  {
    id: 'periodic',
    label: 'Periodic flip',
    detail: 'A stationary distribution exists, but a point mass oscillates forever instead of converging to it.',
    states: ['Left', 'Right'],
    matrix: [
      [0, 1],
      [1, 0],
    ],
  },
];

export const MARKOV_DEFAULTS = {
  presetId: 'weather',
  steps: 12,
  seed: 2026,
};
