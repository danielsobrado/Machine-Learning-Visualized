export const FEATURES = Object.freeze([
  { id: 'signalA', label: 'Correlated signal A', useful: true, correlatedGroup: 'shared-signal' },
  { id: 'signalB', label: 'Correlated signal B', useful: true, correlatedGroup: 'shared-signal' },
  { id: 'weakSignal', label: 'Independent signal', useful: true },
  { id: 'noiseA', label: 'Noise A', useful: false },
  { id: 'noiseB', label: 'Noise B', useful: false },
  { id: 'noiseC', label: 'Noise C', useful: false },
]);

export const PENALTIES = Object.freeze({
  none: Object.freeze({ label: 'None', detail: 'Fits training data without a coefficient penalty.', l1: 0, l2: 0 }),
  l2: Object.freeze({ label: 'L2 / ridge', detail: 'Shrinks correlated weights smoothly and usually keeps them active.', l1: 0, l2: 1 }),
  l1: Object.freeze({ label: 'L1 / lasso', detail: 'Uses soft-thresholding and can set coefficients exactly to zero.', l1: 1, l2: 0 }),
  elastic: Object.freeze({ label: 'Elastic net', detail: 'Combines L1 sparsity with L2-style grouping stability.', l1: 0.55, l2: 0.45 }),
});

export const REGULARIZATION_EXPERIMENT = Object.freeze({
  trainSeed: 121,
  validationSeed: 919,
  trainSize: 48,
  validationSize: 512,
  targetNoiseStd: 1.2,
  correlatedJitterStd: 0.06,
  sharedSignalWeight: 3,
  independentSignalWeight: 0.85,
  defaultLambda: 0.15,
  maxLambda: 1,
  sweepPoints: 21,
  zeroThreshold: 1e-8,
  maxIterations: 5000,
  convergenceTolerance: 1e-10,
});

export const CORRELATED_STABILITY_DEMO = Object.freeze({
  lambda: 0.2,
  minLambda: 0.05,
  maxLambda: 0.4,
  lambdaStep: 0.01,
  seeds: Object.freeze([101, 202, 303, 404, 505, 606, 707, 808]),
});

export const SCALE_SENSITIVITY_DEMO = Object.freeze({
  minScale: 1,
  maxScale: 100,
  defaultScale: 25,
  scaleStep: 1,
  physicalEffect: 2,
  lambda: 0.5,
});
