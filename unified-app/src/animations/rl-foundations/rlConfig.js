export const RL_SCENARIOS = [
  {
    id: 'now-vs-later',
    label: 'Reward now vs bigger reward later',
    detail: 'A small immediate reward competes with a larger delayed terminal reward.',
    actions: [
      { id: 'take-now', label: 'Take 4 now', outcomes: [{ probability: 1, label: 'Immediate terminal reward', rewards: [4] }] },
      { id: 'wait', label: 'Wait for 10', outcomes: [{ probability: 1, label: 'Delayed terminal reward', rewards: [0, 0, 10] }] },
    ],
  },
  {
    id: 'risk-vs-safe',
    label: 'Safe vs stochastic',
    detail: 'Expected return averages over possible trajectories; one sampled episode can look very different.',
    actions: [
      { id: 'safe', label: 'Safe route', outcomes: [{ probability: 1, label: 'Steady progress', rewards: [2, 2] }] },
      { id: 'risky', label: 'Risky shortcut', outcomes: [{ probability: 0.5, label: 'Shortcut succeeds', rewards: [9] }, { probability: 0.5, label: 'Shortcut fails', rewards: [-3] }] },
    ],
  },
  {
    id: 'invest-then-win',
    label: 'Immediate pain, delayed gain',
    detail: 'A negative reward can still belong to the trajectory with the larger return.',
    actions: [
      { id: 'avoid', label: 'Avoid cost', outcomes: [{ probability: 1, label: 'Small immediate reward', rewards: [1] }] },
      { id: 'invest', label: 'Invest first', outcomes: [{ probability: 1, label: 'Pay cost then succeed', rewards: [-2, 0, 8] }] },
    ],
  },
];

export const RL_DEFAULTS = { scenarioId: 'now-vs-later', gamma: 0.9, seed: 23 };
