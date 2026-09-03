export const MLM_SELECTION_RATE = 0.15;
export const MLM_CORRUPTION_PROBABILITIES = {
  mask: 0.8,
  random: 0.1,
  unchanged: 0.1,
};

export const MLM_EXAMPLE_TOKENS = [
  'BERT', 'learns', 'language', 'representations', 'by',
  'predicting', 'selected', 'tokens', 'from', 'both',
  'left', 'and', 'right', 'context', 'during',
  'pretraining', 'on', 'large', 'text', 'corpora',
];

export const MLM_EXAMPLE_SELECTIONS = [
  { index: 3, corruption: 'mask' },
  { index: 10, corruption: 'random', replacement: 'banana' },
  { index: 17, corruption: 'unchanged' },
];
