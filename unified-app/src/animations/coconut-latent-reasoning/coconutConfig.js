export const COCONUT_DEFAULTS = {
  branchWeight: 0.5,
  latentSteps: 2,
  reasoningSteps: 4,
  answerTokens: 2,
};

export const COCONUT_BRANCHES = [
  {
    id: 'route-a',
    label: 'Route A',
    vector: [1, 0, 0.15],
  },
  {
    id: 'route-b',
    label: 'Route B',
    vector: [0, 1, 0.15],
  },
];

export const COCONUT_VOCABULARY = [
  { token: 'choose-A', vector: [1, 0, 0] },
  { token: 'choose-B', vector: [0, 1, 0] },
  { token: 'compare', vector: [0.7, 0.7, 0] },
  { token: 'answer', vector: [0, 0, 1] },
];

export const COCONUT_SOURCES = [
  {
    label: 'Training Large Language Models to Reason in a Continuous Latent Space',
    href: 'https://arxiv.org/abs/2412.06769',
    note: 'Coconut feeds the previous last hidden state back as the next input embedding instead of decoding a word token.',
  },
];
