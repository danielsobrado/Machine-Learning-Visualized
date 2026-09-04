export const POLICY_ITERATION_MDP = Object.freeze({
  states: ['Start', 'Bridge', 'Trap', 'Goal'],
  terminalStates: ['Goal'],
  actions: {
    Start: {
      risk: [
        { to: 'Goal', probability: 0.35, reward: 10 },
        { to: 'Trap', probability: 0.65, reward: -4 },
      ],
      safe: [{ to: 'Bridge', probability: 1, reward: 0 }],
    },
    Bridge: {
      forward: [
        { to: 'Goal', probability: 0.75, reward: 10 },
        { to: 'Trap', probability: 0.25, reward: -4 },
      ],
      reset: [{ to: 'Start', probability: 1, reward: -1 }],
    },
    Trap: {
      recover: [
        { to: 'Bridge', probability: 0.6, reward: -1 },
        { to: 'Trap', probability: 0.4, reward: -2 },
      ],
      wait: [{ to: 'Trap', probability: 1, reward: -1.5 }],
    },
    Goal: {},
  },
});

export const POLICY_ITERATION_DEFAULTS = Object.freeze({
  discount: 0.9,
  evaluationTolerance: 1e-8,
  maxEvaluationIterations: 500,
  maxPolicyIterations: 20,
  initialPolicy: {
    Start: 'risk',
    Bridge: 'reset',
    Trap: 'wait',
  },
});
