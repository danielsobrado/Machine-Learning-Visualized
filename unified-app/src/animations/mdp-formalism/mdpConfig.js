export const MDP_MODEL = {
  states: ['Crossroad', 'Bridge', 'Trap', 'Goal'],
  terminalStates: ['Goal'],
  actions: {
    Crossroad: { risky: [{ to: 'Goal', probability: 0.4, reward: 12 }, { to: 'Trap', probability: 0.6, reward: -4 }], safe: [{ to: 'Bridge', probability: 1, reward: 1 }] },
    Bridge: { finish: [{ to: 'Goal', probability: 0.8, reward: 8 }, { to: 'Trap', probability: 0.2, reward: -3 }], retreat: [{ to: 'Crossroad', probability: 1, reward: 0 }] },
    Trap: { recover: [{ to: 'Bridge', probability: 0.6, reward: -1 }, { to: 'Trap', probability: 0.4, reward: -2 }] },
  },
};
export const CONTINUATION_VALUES = { Crossroad: 4, Bridge: 5, Trap: -3, Goal: 0 };
export const MDP_DEFAULTS = { state: 'Crossroad', actionId: 'risky', gamma: 0.85, seed: 31 };
