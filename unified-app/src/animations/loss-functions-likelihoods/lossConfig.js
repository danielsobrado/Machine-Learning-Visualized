export const REGRESSION_POINTS = [
  { id: 'A', x: 0.5, y: 1.1 },
  { id: 'B', x: 1.2, y: 1.8 },
  { id: 'C', x: 2.1, y: 2.7 },
  { id: 'D', x: 3.0, y: 3.1 },
  { id: 'E', x: 3.7, y: 4.6 },
  { id: 'F', x: 4.5, y: 4.8 },
];

export const CLASSIFICATION_POINTS = [
  { id: 'A', score: 0.12, y: 0 },
  { id: 'B', score: 0.28, y: 0 },
  { id: 'C', score: 0.42, y: 1 },
  { id: 'D', score: 0.58, y: 0 },
  { id: 'E', score: 0.74, y: 1 },
  { id: 'F', score: 0.88, y: 1 },
];

export const LOSS_MODES = [
  {
    id: 'gaussian',
    label: 'Gaussian regression',
    detail: 'Exact Gaussian NLL: residual²/(2σ²) plus the scale-normalization term.',
  },
  {
    id: 'laplace',
    label: 'Laplace regression',
    detail: 'Exact Laplace NLL: |residual|/b plus log(2b). Heavier tails reduce outlier leverage.',
  },
  {
    id: 'bernoulli',
    label: 'Bernoulli classification',
    detail: 'Stable logistic NLL from logits, without probability clipping.',
  },
];

export const LOSS_DEFAULTS = {
  mode: 'gaussian',
  slope: 0.9,
  intercept: 0.7,
  gaussianSigma: 0.7,
  laplaceScale: 0.6,
  logitScale: 5,
  bias: -0.1,
  outlierOn: false,
  flippedLabel: false,
};
