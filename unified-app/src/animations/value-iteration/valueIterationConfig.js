export const VALUE_ITERATION_MDP = {
  states: ['Start', 'Bridge', 'Trap', 'Goal'], terminalStates: ['Goal'],
  actions: {
    Start: { risk: [{ to: 'Goal', probability: 0.55, reward: 10 }, { to: 'Trap', probability: 0.45, reward: -6 }], safe: [{ to: 'Bridge', probability: 1, reward: 1 }] },
    Bridge: { forward: [{ to: 'Goal', probability: 0.75, reward: 10 }, { to: 'Trap', probability: 0.25, reward: -6 }], reset: [{ to: 'Start', probability: 1, reward: 0 }] },
    Trap: { recover: [{ to: 'Bridge', probability: 0.55, reward: -1 }, { to: 'Trap', probability: 0.45, reward: -2 }] },
  },
};
export const VALUE_ITERATION_DEFAULTS = { gamma: 0.9, tolerance: 0.001, maxIterations: 100, visibleSweeps: 4 };
