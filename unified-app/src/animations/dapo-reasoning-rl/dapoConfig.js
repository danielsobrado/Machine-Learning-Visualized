export const DAPO_GROUPS = [
  { id: 'mixed-short', label: 'Mixed short', rewards: [1, 0, 1, 0], sequences: [[1.08, 1.12, 1.18], [0.91, 0.82], [1.16, 1.27, 1.34, 1.21], [0.88, 0.79, 0.84]] },
  { id: 'all-correct', label: 'All correct', rewards: [1, 1, 1, 1], sequences: [[1.1, 1.2], [1.15, 1.05], [1.3, 1.2], [1.08, 1.11]] },
  { id: 'mixed-long', label: 'Mixed long-CoT', rewards: [1, 0], sequences: [[1.05, 1.08], [0.76, 0.80, 0.83, 0.78, 0.81, 0.79, 0.82, 0.77]] },
];

export const DAPO_DEFAULTS = { lowerEpsilon: 0.2, upperEpsilon: 0.28, maxLength: 100, cacheLength: 20 };
