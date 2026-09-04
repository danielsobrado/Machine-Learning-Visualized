export const BANDIT_SCENARIOS = Object.freeze([
  {
    id: 'stationary',
    label: 'Stationary arms',
    detail: 'One arm is consistently best. Exploration should discover it, then exploitation should dominate.',
    meansBefore: [0.9, 1.25, 0.55, 0.2],
    meansAfter: null,
    changeStep: null,
    noiseStd: 0.7,
  },
  {
    id: 'close-call',
    label: 'Close call',
    detail: 'The two best arms are close enough that early reward noise can mislead a greedy agent.',
    meansBefore: [1.0, 1.08, 0.7, 0.35],
    meansAfter: null,
    changeStep: null,
    noiseStd: 1.0,
  },
  {
    id: 'nonstationary',
    label: 'Best arm changes',
    detail: 'Halfway through, the previously weak arm becomes best. Old evidence becomes stale.',
    meansBefore: [1.25, 0.9, 0.55, 0.25],
    meansAfter: [0.35, 0.75, 1.55, 0.2],
    changeStep: 300,
    noiseStd: 0.65,
  },
]);

export const EXPLORATION_DEFAULTS = Object.freeze({
  scenarioId: 'close-call',
  steps: 600,
  epsilonStart: 0.2,
  epsilonEnd: 0.02,
  decaySteps: 500,
  initialValue: 0,
  stepSizeMode: 'sample-average',
  constantAlpha: 0.12,
  seed: 42,
});
