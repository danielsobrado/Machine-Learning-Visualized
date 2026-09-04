export const SPEARMAN_PRESETS = [
  {
    id: 'monotonic-nonlinear',
    label: 'Monotonic nonlinear',
    detail: 'Ranks match perfectly even though the raw relationship is curved.',
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    y: [1, 4, 9, 16, 25, 36, 49, 64],
  },
  {
    id: 'outlier',
    label: 'Outlier stress',
    detail: 'One huge raw value stretches Pearson much more than rank order.',
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    y: [1, 2, 3, 4, 5, 6, 7, 80],
  },
  {
    id: 'ties',
    label: 'Ties',
    detail: 'Average ranks are required; the textbook no-ties shortcut is not valid here.',
    x: [1, 1, 2, 2, 3, 3],
    y: [1, 2, 2, 3, 3, 4],
  },
  {
    id: 'non-monotonic',
    label: 'Non-monotonic U-shape',
    detail: 'A strong relationship can still have weak Spearman correlation if it is not monotonic.',
    x: [-3, -2, -1, 0, 1, 2, 3],
    y: [9, 4, 1, 0, 1, 4, 9],
  },
];

export const SPEARMAN_DEFAULTS = {
  presetId: 'monotonic-nonlinear',
  outlierMultiplier: 1,
};
