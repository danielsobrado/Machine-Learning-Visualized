export const PPO_PRESETS = [
  {
    id: 'healthy',
    label: 'Healthy minibatch',
    detail: 'Moderate policy changes with mixed advantages.',
    samples: [
      { oldLogit: -0.8, newLogit: -0.55, action: 1, advantage: 1.5 },
      { oldLogit: 0.4, newLogit: 0.55, action: 0, advantage: -0.8 },
      { oldLogit: 1.1, newLogit: 1.25, action: 1, advantage: 0.6 },
      { oldLogit: -1.2, newLogit: -0.95, action: 0, advantage: 1.0 },
    ],
  },
  {
    id: 'overshoot',
    label: 'Helpful overshoot',
    detail: 'Large ratio changes in the advantage-improving direction activate clipping.',
    samples: [
      { oldLogit: -1.4, newLogit: 0.2, action: 1, advantage: 2.0 },
      { oldLogit: 1.3, newLogit: -0.1, action: 0, advantage: 1.4 },
      { oldLogit: 0.5, newLogit: 1.8, action: 1, advantage: 0.8 },
      { oldLogit: -0.6, newLogit: -1.9, action: 0, advantage: 0.9 },
    ],
  },
  {
    id: 'wrong-way',
    label: 'Wrong-way policy move',
    detail: 'Large policy drift can remain unclipped when it makes the surrogate worse, showing clipping is not a hard trust region.',
    samples: [
      { oldLogit: 0.8, newLogit: -2.0, action: 1, advantage: 1.5 },
      { oldLogit: -0.7, newLogit: 1.8, action: 0, advantage: 1.2 },
      { oldLogit: -0.4, newLogit: 2.0, action: 1, advantage: -1.0 },
      { oldLogit: 0.5, newLogit: -2.1, action: 0, advantage: -0.7 },
    ],
  },
];

export const PPO_DEFAULTS = {
  presetId: 'healthy',
  epsilon: 0.2,
};
