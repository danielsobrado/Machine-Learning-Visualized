export const TTC_SAMPLE_COUNTS = [1, 2, 4, 8, 16, 32, 64];

export const TTC_DEFAULTS = {
  presetId: 'balanced',
  sampleCount: 8,
  baseSuccessProbability: 0.35,
  verifierTruePositiveRate: 0.9,
  verifierFalsePositiveRate: 0.1,
  tokensPerSample: 512,
};

export const TTC_PRESETS = [
  {
    id: 'balanced',
    label: 'Useful verifier',
    detail: 'A moderate base model plus a verifier that separates correct from wrong answers.',
    baseSuccessProbability: 0.35,
    verifierTruePositiveRate: 0.9,
    verifierFalsePositiveRate: 0.1,
    sampleCount: 8,
  },
  {
    id: 'weak-verifier',
    label: 'Weak verifier',
    detail: 'The verifier barely separates correct and incorrect candidates.',
    baseSuccessProbability: 0.35,
    verifierTruePositiveRate: 0.65,
    verifierFalsePositiveRate: 0.35,
    sampleCount: 8,
  },
  {
    id: 'rare-success',
    label: 'Rare success',
    detail: 'Single samples rarely solve the task, so extra independent attempts mostly buy coverage.',
    baseSuccessProbability: 0.08,
    verifierTruePositiveRate: 0.95,
    verifierFalsePositiveRate: 0.05,
    sampleCount: 32,
  },
  {
    id: 'uninformative-verifier',
    label: 'Uninformative verifier',
    detail: 'Equal true- and false-positive rates mean selection cannot improve correctness.',
    baseSuccessProbability: 0.45,
    verifierTruePositiveRate: 0.5,
    verifierFalsePositiveRate: 0.5,
    sampleCount: 16,
  },
];

export const TTC_SOURCES = [
  {
    label: 'Scaling LLM Test-Time Compute Optimally',
    href: 'https://arxiv.org/abs/2408.03314',
    note: 'Test-time compute allocation depends strongly on prompt difficulty and the scaling method.',
  },
  {
    label: 'Simple and Provable Scaling Laws for Test-Time Compute',
    href: 'https://arxiv.org/abs/2411.19477',
    note: 'Candidate generation and comparison can have provable scaling behavior under explicit assumptions.',
  },
];
