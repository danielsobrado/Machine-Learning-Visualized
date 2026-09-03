export const FEATURES = Object.freeze([
  { id: 'signalA', label: 'Signal A', base: 2.4, importance: 1.0, useful: true },
  { id: 'signalB', label: 'Signal B', base: -1.8, importance: 0.85, useful: true },
  { id: 'weakSignal', label: 'Weak signal', base: 0.8, importance: 0.45, useful: true },
  { id: 'noiseA', label: 'Noise A', base: 1.35, importance: 0.08, useful: false },
  { id: 'noiseB', label: 'Noise B', base: -1.1, importance: 0.05, useful: false },
  { id: 'noiseC', label: 'Noise C', base: 0.65, importance: 0.04, useful: false },
]);

export const PENALTIES = Object.freeze({
  none: Object.freeze({
    label: 'None',
    detail: 'Weights only answer the training loss, so noisy features can stay large.',
    l1: 0,
    l2: 0,
  }),
  l2: Object.freeze({
    label: 'L2 / ridge',
    detail: 'Shrinks weights smoothly while usually keeping all features active.',
    l1: 0,
    l2: 1,
  }),
  l1: Object.freeze({
    label: 'L1 / lasso',
    detail: 'Soft-thresholds coefficients and can drive small weights exactly to zero.',
    l1: 1,
    l2: 0,
  }),
  elastic: Object.freeze({
    label: 'Elastic net',
    detail: 'Combines sparse L1 thresholding with smooth L2 shrinkage.',
    l1: 0.55,
    l2: 0.45,
  }),
});

export const SHRINKAGE = Object.freeze({
  l1CutScale: 1.1,
  l2ShrinkScale: 2.1,
  removalThreshold: 0.04,
});

export const SCALE_SENSITIVITY_DEMO = Object.freeze({
  minScale: 1,
  maxScale: 100,
  defaultScale: 25,
  scaleStep: 1,
  physicalEffect: 2,
  lambda: 0.5,
});
