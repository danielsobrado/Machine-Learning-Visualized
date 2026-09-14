export const ATTENTION_INTUITION_SCENARIOS = {
  library: {
    title: 'Library retrieval',
    queryLabel: 'machine learning',
    description: 'A toy retrieval example: the query routes more weight toward keys that point in a similar direction.',
    query: [1, 0.2],
    items: [
      { label: 'Neural networks', key: [1, 0.2], value: [8, 1] },
      { label: 'Deep learning', key: [0.9, 0.1], value: [9, 1] },
      { label: 'Python basics', key: [0.2, 0.8], value: [3, 5] },
      { label: 'Cooking recipes', key: [-0.8, 0.1], value: [-3, 2] },
    ],
    takeaway: 'Keys determine routing. Values provide the content that is blended into the output.',
  },
  translation: {
    title: 'Translation routing',
    queryLabel: 'generate “chat”',
    description: 'A toy cross-attention example: the decoder query should route most strongly to the source token “cat”.',
    query: [1, 0],
    items: [
      { label: 'The', key: [0.1, 0.4], value: [1, 3] },
      { label: 'cat', key: [1, 0], value: [9, 1] },
      { label: 'sat', key: [0.2, 0.7], value: [2, 6] },
      { label: 'mat', key: [0.5, 0.2], value: [5, 2] },
    ],
    takeaway: 'The attention output is a weighted representation. A real decoder uses that representation with later layers to predict the next token.',
  },
  sentiment: {
    title: 'Sentiment routing',
    queryLabel: 'negative sentiment',
    description: 'A toy semantic query routes toward tokens whose keys align with the negative-sentiment direction.',
    query: [0, 1],
    items: [
      { label: 'great', key: [0.8, -0.6], value: [8, -6] },
      { label: 'but', key: [0.2, 0.3], value: [2, 3] },
      { label: 'ending', key: [0.1, 0.4], value: [1, 4] },
      { label: 'terrible', key: [-0.4, 1], value: [-4, 9] },
    ],
    takeaway: 'The largest weight is not itself an explanation of a prediction; it only describes routing for this attention row.',
  },
};

export const ATTENTION_PIPELINE_STAGES = [
  'Query and keys',
  'Scaled Q·K scores',
  'Softmax weights',
  'Weighted value output',
];

export const ATTENTION_ANIMATION_STEP_MS = 650;
