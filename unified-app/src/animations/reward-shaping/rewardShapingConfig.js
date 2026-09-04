export const SHAPING_TRAJECTORIES = [
  {
    id: 'fast-goal',
    label: 'Fast goal',
    states: [0, 1, 3],
    rewards: [0, 10],
  },
  {
    id: 'slow-goal',
    label: 'Slow goal',
    states: [0, 2, 1, 3],
    rewards: [0, 0, 10],
  },
  {
    id: 'bonus-loop',
    label: 'Naive bonus loop',
    states: [0, 1, 0, 1, 0, 1, 0],
    rewards: [0, 0, 0, 0, 0, 0],
  },
];

export const STATE_POTENTIALS = {
  0: -3,
  1: -1,
  2: -2,
  3: 0,
};

export const SHAPING_DEFAULTS = {
  gamma: 0.9,
  weight: 1,
  naiveProgressBonus: 5,
};
