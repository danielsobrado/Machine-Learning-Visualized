export const BERNOULLI_DATASETS = Object.freeze({
  balanced: { label: '6 successes / 4 failures', successes: 6, failures: 4, candidateP: 0.45 },
  rare: { label: '2 successes / 10 failures', successes: 2, failures: 10, candidateP: 0.35 },
  strong: { label: '9 successes / 1 failure', successes: 9, failures: 1, candidateP: 0.7 },
  replicated: { label: '60 successes / 40 failures', successes: 60, failures: 40, candidateP: 0.45 },
});

export const GAUSSIAN_DATASETS = Object.freeze({
  compact: { label: 'Compact measurements', values: [4.7, 5.0, 5.2, 4.9, 5.1, 5.4], candidateMu: 5.4, candidateSigma: 0.7 },
  shifted: { label: 'Shifted measurements', values: [6.2, 6.4, 6.9, 6.6, 6.8, 7.1], candidateMu: 6.3, candidateSigma: 0.8 },
  noisy: { label: 'Noisy measurements', values: [3.7, 5.5, 4.3, 6.2, 4.8, 5.9], candidateMu: 5.4, candidateSigma: 1.4 },
  outlier: { label: 'One large outlier', values: [4.8, 5.0, 5.1, 5.2, 5.0, 9.5], candidateMu: 5.2, candidateSigma: 1.2 },
});

export const DEFAULT_SCENARIO = Object.freeze({
  mode: 'bernoulli',
  bernoulliDatasetId: 'balanced',
  gaussianDatasetId: 'compact',
  candidateP: BERNOULLI_DATASETS.balanced.candidateP,
  candidateMu: GAUSSIAN_DATASETS.compact.candidateMu,
  candidateSigma: GAUSSIAN_DATASETS.compact.candidateSigma,
});

export const CONTROL_LIMITS = Object.freeze({
  candidateP: { min: 0.02, max: 0.98, step: 0.01 },
  candidateMu: { min: 2.5, max: 10, step: 0.05 },
  candidateSigma: { min: 0.1, max: 4, step: 0.05 },
});
