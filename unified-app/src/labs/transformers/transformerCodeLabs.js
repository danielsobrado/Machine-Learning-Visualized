export const TRANSFORMER_CODE_LABS = [
  {
    id: 'transformer-token-embedding-lookup',
    stepLabel: '41.1',
    group: 'Transformer mini-block shapes',
    title: 'Token embedding lookup',
    concept: 'A token ID selects one row from the embedding table.',
    objective: 'Return embeddingTable[tokenId].',
    difficulty: 'warmup',
    starterCode: `function lookupEmbedding(embeddingTable, tokenId) {
  // TODO: return the embedding vector for tokenId.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

const E = [
  [1, 0],
  [0, 1],
  [2, 3],
];

check('token 0', lookupEmbedding(E, 0), [1, 0]);
check('token 1', lookupEmbedding(E, 1), [0, 1]);
check('token 2', lookupEmbedding(E, 2), [2, 3]);

return results;`,
    hints: [
      'The embedding table is indexed by token ID.',
      'Return the row at tokenId.',
      'return embeddingTable[tokenId];',
    ],
    solution: `function lookupEmbedding(embeddingTable, tokenId) {
  return embeddingTable[tokenId];
}`,
    explanation: 'Token IDs become vectors by selecting rows from an embedding matrix.',
  },

  {
    id: 'transformer-add-position',
    stepLabel: '41.2',
    group: 'Transformer mini-block shapes',
    title: 'Add positional embedding',
    concept: 'Token embeddings and position embeddings are added coordinate by coordinate.',
    objective: 'Push tokenEmbedding[i] + positionEmbedding[i].',
    difficulty: 'warmup',
    starterCode: `function addPosition(tokenEmbedding, positionEmbedding) {
  const result = [];

  for (let i = 0; i < tokenEmbedding.length; i++) {
    // TODO: add token and position coordinate.
    result.push(0);
  }

  return result;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('add position', addPosition([1, 2], [10, 20]), [11, 22]);
check('zero position', addPosition([1, 2, 3], [0, 0, 0]), [1, 2, 3]);
check('negative position', addPosition([5, 5], [-1, 2]), [4, 7]);

return results;`,
    hints: [
      'Embeddings have the same dimension.',
      'Add coordinate by coordinate.',
      'result.push(tokenEmbedding[i] + positionEmbedding[i]);',
    ],
    solution: `function addPosition(tokenEmbedding, positionEmbedding) {
  const result = [];

  for (let i = 0; i < tokenEmbedding.length; i++) {
    result.push(tokenEmbedding[i] + positionEmbedding[i]);
  }

  return result;
}`,
    explanation: 'Position information lets equal tokens behave differently at different sequence positions.',
  },

  {
    id: 'transformer-project-query',
    stepLabel: '41.3',
    group: 'Transformer mini-block shapes',
    title: 'Project to query vector',
    concept: 'A query vector is a linear projection of the hidden state.',
    objective: 'Return hidden times Wq using row dot products.',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function project(hidden, weightColumns) {
  const output = [];

  for (let j = 0; j < weightColumns.length; j++) {
    // TODO: push dot(hidden, weightColumns[j]).
    output.push(0);
  }

  return output;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('project hidden', project([1, 2], [[3, 4], [5, 6]]), [11, 17]);
check('identity projection', project([7, 8], [[1, 0], [0, 1]]), [7, 8]);

return results;`,
    hints: [
      'Each output coordinate has its own weight column.',
      'Use dot(hidden, weightColumns[j]).',
      'output.push(dot(hidden, weightColumns[j]));',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function project(hidden, weightColumns) {
  const output = [];

  for (let j = 0; j < weightColumns.length; j++) {
    output.push(dot(hidden, weightColumns[j]));
  }

  return output;
}`,
    explanation: 'Transformers create Q, K, and V vectors through learned linear projections.',
  },

  {
    id: 'transformer-attention-score-shape',
    stepLabel: '41.4',
    group: 'Transformer mini-block shapes',
    title: 'Attention score shape',
    concept: 'Q times K transposed produces one score for every query token and key token pair.',
    objective: 'Return [numQueries, numKeys].',
    difficulty: 'core',
    starterCode: `function attentionScoreShape(Q, K) {
  const numQueries = Q.length;
  const numKeys = K.length;

  // TODO: return the shape of Q times K transposed.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('3 queries 3 keys', attentionScoreShape([[1],[2],[3]], [[1],[2],[3]]), [3, 3]);
check('2 queries 4 keys', attentionScoreShape([[1],[2]], [[1],[2],[3],[4]]), [2, 4]);
check('1 query 5 keys', attentionScoreShape([[1]], [[1],[2],[3],[4],[5]]), [1, 5]);

return results;`,
    hints: [
      'Rows come from queries.',
      'Columns come from keys.',
      'return [numQueries, numKeys];',
    ],
    solution: `function attentionScoreShape(Q, K) {
  const numQueries = Q.length;
  const numKeys = K.length;

  return [numQueries, numKeys];
}`,
    explanation: 'Attention score matrices grow with sequence length squared in full attention.',
  },

  {
    id: 'transformer-causal-mask-check',
    stepLabel: '41.5',
    group: 'Transformer mini-block shapes',
    title: 'Causal mask visibility',
    concept: 'In causal attention, a query position can read only keys at the same or earlier positions.',
    objective: 'Return true if keyPosition <= queryPosition.',
    difficulty: 'core',
    starterCode: `function canAttendCausally(queryPosition, keyPosition) {
  // TODO: return whether query can see key.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same position visible', canAttendCausally(2, 2), true);
check('past visible', canAttendCausally(2, 0), true);
check('future hidden', canAttendCausally(2, 3), false);
check('first token cannot see second', canAttendCausally(0, 1), false);

return results;`,
    hints: [
      'Causal attention blocks future keys.',
      'A key is visible if keyPosition is less than or equal to queryPosition.',
      'return keyPosition <= queryPosition;',
    ],
    solution: `function canAttendCausally(queryPosition, keyPosition) {
  return keyPosition <= queryPosition;
}`,
    explanation: 'Causal masking prevents next-token models from seeing future answers.',
  },

  {
    id: 'self-attention-one-query-scores',
    stepLabel: '42.1',
    group: 'Mini self-attention',
    title: 'Scores for one query',
    concept: 'A query compares itself to every key using dot products.',
    objective: 'Push dot(query, keys[i]) for every key.',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScoresForQuery(query, keys) {
  const scores = [];

  for (let i = 0; i < keys.length; i++) {
    // TODO: push dot(query, keys[i]).
    scores.push(0);
  }

  return scores;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('query against two keys', attentionScoresForQuery([1, 2], [[3, 4], [5, 6]]), [11, 17]);
check('orthogonal key', attentionScoresForQuery([1, 0], [[1, 0], [0, 1]]), [1, 0]);

return results;`,
    hints: [
      'Each score is one dot product.',
      'Compare the query with each key vector.',
      'scores.push(dot(query, keys[i]));',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScoresForQuery(query, keys) {
  const scores = [];

  for (let i = 0; i < keys.length; i++) {
    scores.push(dot(query, keys[i]));
  }

  return scores;
}`,
    explanation: 'Self-attention starts by asking how strongly this query matches each key.',
  },

  {
    id: 'self-attention-scale-scores',
    stepLabel: '42.2',
    group: 'Mini self-attention',
    title: 'Scale attention scores',
    concept: 'Scaled dot-product attention divides scores by sqrt(d).',
    objective: 'Divide every score by Math.sqrt(d).',
    difficulty: 'core',
    starterCode: `function scaleScores(scores, d) {
  const scaled = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push scores[i] divided by sqrt(d).
    scaled.push(scores[i]);
  }

  return scaled;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('scale by sqrt 4', scaleScores([8, 4], 4), [4, 2]);
check('scale by sqrt 9', scaleScores([12, 3], 9), [4, 1]);
check('scale by sqrt 1', scaleScores([7, -2], 1), [7, -2]);

return results;`,
    hints: [
      'Use Math.sqrt(d).',
      'Each score gets divided by the same scale.',
      'scaled.push(scores[i] / Math.sqrt(d));',
    ],
    solution: `function scaleScores(scores, d) {
  const scaled = [];

  for (let i = 0; i < scores.length; i++) {
    scaled.push(scores[i] / Math.sqrt(d));
  }

  return scaled;
}`,
    explanation: 'Scaling prevents large dot products from making softmax too sharp too early.',
  },

  {
    id: 'self-attention-causal-mask-scores',
    stepLabel: '42.3',
    group: 'Mini self-attention',
    title: 'Apply causal mask',
    concept: 'Causal attention hides future positions by setting their scores to -Infinity.',
    objective: 'Keep visible scores and mask future scores.',
    difficulty: 'core',
    starterCode: `function applyCausalMask(scores, queryPosition) {
  const masked = [];

  for (let keyPosition = 0; keyPosition < scores.length; keyPosition++) {
    // TODO: keep scores[keyPosition] if keyPosition <= queryPosition, otherwise -Infinity.
    masked.push(scores[keyPosition]);
  }

  return masked;
}`,
    testCode: `const results = [];

function sameArraySpecial(a, b) {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArraySpecial(actual, expected),
  });
}

check('query at position 0', applyCausalMask([1, 2, 3], 0), [1, -Infinity, -Infinity]);
check('query at position 1', applyCausalMask([1, 2, 3], 1), [1, 2, -Infinity]);
check('query at position 2', applyCausalMask([1, 2, 3], 2), [1, 2, 3]);

return results;`,
    hints: [
      'A token can attend to itself and the past.',
      'Future key positions are greater than queryPosition.',
      'masked.push(keyPosition <= queryPosition ? scores[keyPosition] : -Infinity);',
    ],
    solution: `function applyCausalMask(scores, queryPosition) {
  const masked = [];

  for (let keyPosition = 0; keyPosition < scores.length; keyPosition++) {
    masked.push(keyPosition <= queryPosition ? scores[keyPosition] : -Infinity);
  }

  return masked;
}`,
    explanation: 'Causal masking prevents next-token models from seeing future tokens.',
  },

  {
    id: 'self-attention-stable-softmax',
    stepLabel: '42.4',
    group: 'Mini self-attention',
    title: 'Stable softmax',
    concept: 'Stable softmax subtracts the maximum score before exponentiating.',
    objective: 'Use Math.exp(scores[i] - maxScore).',
    difficulty: 'challenge',
    starterCode: `function stableSoftmax(scores) {
  const maxScore = Math.max(...scores);
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    // TODO: add exp(scores[i] - maxScore).
    denominator += 0;
  }

  const weights = [];
  for (let i = 0; i < scores.length; i++) {
    weights.push(Math.exp(scores[i] - maxScore) / denominator);
  }

  return weights;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('two equal scores', stableSoftmax([0, 0]), [0.5, 0.5]);
check('log ratio', stableSoftmax([0, Math.log(3)]), [0.25, 0.75]);
check('large scores stay stable', stableSoftmax([1000, 1000]), [0.5, 0.5]);

return results;`,
    hints: [
      'Subtracting maxScore does not change the softmax probabilities.',
      'It prevents overflow for large scores.',
      'denominator += Math.exp(scores[i] - maxScore);',
    ],
    solution: `function stableSoftmax(scores) {
  const maxScore = Math.max(...scores);
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    denominator += Math.exp(scores[i] - maxScore);
  }

  const weights = [];
  for (let i = 0; i < scores.length; i++) {
    weights.push(Math.exp(scores[i] - maxScore) / denominator);
  }

  return weights;
}`,
    explanation: 'Stable softmax is the same math, but safer numerically.',
  },

  {
    id: 'self-attention-weighted-value-sum',
    stepLabel: '42.5',
    group: 'Mini self-attention',
    title: 'Weighted value sum',
    concept: 'Attention output is a weighted mixture of value vectors.',
    objective: 'Add weights[token] * values[token][dim] into output[dim].',
    difficulty: 'challenge',
    starterCode: `function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      // TODO: add this token's weighted value coordinate.
      output[dim] += 0;
    }
  }

  return output;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('choose first value', weightedValueSum([1, 0], [[3, 4], [10, 20]]), [3, 4]);
check('average two values', weightedValueSum([0.5, 0.5], [[2, 4], [6, 8]]), [4, 6]);
check('weighted mix', weightedValueSum([0.25, 0.75], [[0, 4], [8, 0]]), [6, 1]);

return results;`,
    hints: [
      'Each value vector contributes according to its attention weight.',
      'For each dimension, add weights[token] times values[token][dim].',
      'output[dim] += weights[token] * values[token][dim];',
    ],
    solution: `function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      output[dim] += weights[token] * values[token][dim];
    }
  }

  return output;
}`,
    explanation: 'Attention does not copy one token. It mixes value vectors using attention weights.',
  },

  {
    id: 'layernorm-feature-mean',
    stepLabel: '43.1',
    group: 'LayerNorm and RMSNorm',
    title: 'Feature mean',
    concept: 'LayerNorm computes statistics across features of one token.',
    objective: 'Return the average of the feature vector.',
    difficulty: 'warmup',
    starterCode: `function featureMean(x) {
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    total += x[i];
  }

  // TODO: return the average.
  return total;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mean [1,2,3]', featureMean([1, 2, 3]), 2);
check('mean [10,20]', featureMean([10, 20]), 15);
check('mean [-1,1]', featureMean([-1, 1]), 0);

return results;`,
    hints: [
      'Average is total divided by number of features.',
      'The number of features is x.length.',
      'return total / x.length;',
    ],
    solution: `function featureMean(x) {
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    total += x[i];
  }

  return total / x.length;
}`,
    explanation: 'LayerNorm normalizes one token vector at a time, not a whole batch.',
  },

  {
    id: 'layernorm-feature-variance',
    stepLabel: '43.2',
    group: 'LayerNorm and RMSNorm',
    title: 'Feature variance',
    concept: 'Variance measures average squared distance from the mean.',
    objective: 'Add squared centered values.',
    difficulty: 'core',
    starterCode: `function featureVariance(x) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centered = x[i] - mean;

    // TODO: add centered squared.
    total += 0;
  }

  return total / x.length;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('variance [1,2,3]', featureVariance([1, 2, 3]), 2 / 3);
check('variance [10,20]', featureVariance([10, 20]), 25);
check('variance constant', featureVariance([5, 5, 5]), 0);

return results;`,
    hints: [
      'Variance uses squared centered values.',
      'centered is already computed.',
      'total += centered * centered;',
    ],
    solution: `function featureVariance(x) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centered = x[i] - mean;
    total += centered * centered;
  }

  return total / x.length;
}`,
    explanation: 'LayerNorm uses variance to rescale features to a stable range.',
  },

  {
    id: 'layernorm-normalize-vector',
    stepLabel: '43.3',
    group: 'LayerNorm and RMSNorm',
    title: 'Normalize one token vector',
    concept: 'LayerNorm subtracts mean and divides by standard deviation.',
    objective: 'Push (x[i] - mean) / sqrt(variance + eps).',
    difficulty: 'challenge',
    starterCode: `function layerNormNoAffine(x, eps = 1e-5) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  const variance = x.reduce((total, value) => {
    const centered = value - mean;
    return total + centered * centered;
  }, 0) / x.length;

  const normalized = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the normalized feature.
    normalized.push(0);
  }

  return normalized;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-5) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('normalize [1,2,3]', layerNormNoAffine([1, 2, 3], 0), [-1.224744871, 0, 1.224744871]);
check('normalize [10,20]', layerNormNoAffine([10, 20], 0), [-1, 1]);

return results;`,
    hints: [
      'Standard deviation is Math.sqrt(variance + eps).',
      'Subtract mean first, then divide by std.',
      'normalized.push((x[i] - mean) / Math.sqrt(variance + eps));',
    ],
    solution: `function layerNormNoAffine(x, eps = 1e-5) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  const variance = x.reduce((total, value) => {
    const centered = value - mean;
    return total + centered * centered;
  }, 0) / x.length;

  const normalized = [];

  for (let i = 0; i < x.length; i++) {
    normalized.push((x[i] - mean) / Math.sqrt(variance + eps));
  }

  return normalized;
}`,
    explanation: 'LayerNorm stabilizes the scale of each token representation before the next transformation.',
  },

  {
    id: 'rmsnorm-denominator',
    stepLabel: '43.4',
    group: 'LayerNorm and RMSNorm',
    title: 'RMSNorm denominator',
    concept: 'RMSNorm divides by root mean square without subtracting the mean.',
    objective: 'Return sqrt(mean square + eps).',
    difficulty: 'core',
    starterCode: `function rmsDenominator(x, eps = 1e-5) {
  let meanSquare = 0;

  for (let i = 0; i < x.length; i++) {
    meanSquare += x[i] * x[i];
  }

  meanSquare = meanSquare / x.length;

  // TODO: return root mean square denominator.
  return meanSquare;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('rms [3,4] eps 0', rmsDenominator([3, 4], 0), Math.sqrt(12.5));
check('rms [1,1] eps 0', rmsDenominator([1, 1], 0), 1);
check('rms [0,0] eps 1', rmsDenominator([0, 0], 1), 1);

return results;`,
    hints: [
      'RMS means root mean square.',
      'Use Math.sqrt(meanSquare + eps).',
      'return Math.sqrt(meanSquare + eps);',
    ],
    solution: `function rmsDenominator(x, eps = 1e-5) {
  let meanSquare = 0;

  for (let i = 0; i < x.length; i++) {
    meanSquare += x[i] * x[i];
  }

  meanSquare = meanSquare / x.length;

  return Math.sqrt(meanSquare + eps);
}`,
    explanation: 'RMSNorm stabilizes scale without centering features.',
  },

  {
    id: 'residual-add-vector',
    stepLabel: '44.1',
    group: 'Residual stream mechanics',
    title: 'Add residual',
    concept: 'A residual connection adds a block output back to the original stream.',
    objective: 'Push x[i] + update[i].',
    difficulty: 'warmup',
    starterCode: `function addResidual(x, update) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: add original stream and update.
    result.push(0);
  }

  return result;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('simple residual', addResidual([1, 2], [10, 20]), [11, 22]);
check('zero update', addResidual([1, 2, 3], [0, 0, 0]), [1, 2, 3]);
check('negative update', addResidual([5, 5], [-1, 2]), [4, 7]);

return results;`,
    hints: [
      'Residual means original plus update.',
      'Add coordinate by coordinate.',
      'result.push(x[i] + update[i]);',
    ],
    solution: `function addResidual(x, update) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + update[i]);
  }

  return result;
}`,
    explanation: 'Residual connections let each block write an update into the shared representation stream.',
  },

  {
    id: 'residual-scaled-update',
    stepLabel: '44.2',
    group: 'Residual stream mechanics',
    title: 'Scaled residual update',
    concept: 'Sometimes updates are scaled before being added to the residual stream.',
    objective: 'Push x[i] + scale * update[i].',
    difficulty: 'core',
    starterCode: `function addScaledResidual(x, update, scale) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: add scaled update to x.
    result.push(x[i]);
  }

  return result;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('scale 0.5', addScaledResidual([1, 2], [10, 20], 0.5), [6, 12]);
check('scale 0', addScaledResidual([1, 2], [10, 20], 0), [1, 2]);
check('scale 1', addScaledResidual([1, 2], [10, 20], 1), [11, 22]);

return results;`,
    hints: [
      'The update is multiplied by scale before adding.',
      'Use x[i] + scale * update[i].',
      'result.push(x[i] + scale * update[i]);',
    ],
    solution: `function addScaledResidual(x, update, scale) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + scale * update[i]);
  }

  return result;
}`,
    explanation: 'Scaling residual updates can help control signal size in deep networks.',
  },

  {
    id: 'residual-prenorm-block',
    stepLabel: '44.3',
    group: 'Residual stream mechanics',
    title: 'Pre-norm residual block',
    concept: 'A pre-norm block normalizes before the sublayer, then adds the sublayer output back to the stream.',
    objective: 'Return x plus sublayer(normedX).',
    difficulty: 'challenge',
    starterCode: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function preNormBlock(x, normedX, sublayer) {
  const update = sublayer(normedX);

  // TODO: return residual stream after the update.
  return update;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('identity update', preNormBlock([1, 2], [10, 20], (h) => [h[0], h[1]]), [11, 22]);
check('zero update', preNormBlock([1, 2], [10, 20], () => [0, 0]), [1, 2]);

return results;`,
    hints: [
      'Residual block returns original x plus update.',
      'update is already computed.',
      'return addVectors(x, update);',
    ],
    solution: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function preNormBlock(x, normedX, sublayer) {
  const update = sublayer(normedX);
  return addVectors(x, update);
}`,
    explanation: 'Pre-norm transformers normalize the stream before attention or MLP, then add the block output back.',
  },

  {
    id: 'swiglu-silu',
    stepLabel: '45.1',
    group: 'MLP and SwiGLU',
    title: 'SiLU activation',
    concept: 'SiLU is x * sigmoid(x), used inside SwiGLU-style MLPs.',
    objective: 'Return x * sigmoid(x).',
    difficulty: 'core',
    starterCode: `function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  // TODO: return x times sigmoid(x).
  return x;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('silu 0', silu(0), 0);
check('silu log 3', silu(Math.log(3)), Math.log(3) * 0.75);
check('silu -log 3', silu(-Math.log(3)), -Math.log(3) * 0.25);

return results;`,
    hints: [
      'SiLU gates x by sigmoid(x).',
      'sigmoid(x) is already available.',
      'return x * sigmoid(x);',
    ],
    solution: `function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  return x * sigmoid(x);
}`,
    explanation: 'SiLU is a smooth gate: positive values mostly pass, negative values are softened.',
  },

  {
    id: 'swiglu-elementwise-gate',
    stepLabel: '45.2',
    group: 'MLP and SwiGLU',
    title: 'Elementwise gate',
    concept: 'Gated MLPs multiply one hidden stream by another gate stream element by element.',
    objective: 'Push values[i] * gates[i].',
    difficulty: 'warmup',
    starterCode: `function elementwiseGate(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: multiply matching entries.
    output.push(values[i]);
  }

  return output;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('simple gate', elementwiseGate([1, 2, 3], [10, 0, 2]), [10, 0, 6]);
check('all keep', elementwiseGate([1, 2], [1, 1]), [1, 2]);
check('all block', elementwiseGate([1, 2], [0, 0]), [0, 0]);

return results;`,
    hints: [
      'This is elementwise multiplication.',
      'Use values[i] * gates[i].',
      'output.push(values[i] * gates[i]);',
    ],
    solution: `function elementwiseGate(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    output.push(values[i] * gates[i]);
  }

  return output;
}`,
    explanation: 'Gating lets one stream decide how much of another stream passes through.',
  },

  {
    id: 'swiglu-hidden',
    stepLabel: '45.3',
    group: 'MLP and SwiGLU',
    title: 'SwiGLU hidden activation',
    concept: 'SwiGLU combines a value stream with a SiLU-activated gate stream.',
    objective: 'Push value[i] * silu(gate[i]).',
    difficulty: 'challenge',
    starterCode: `function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  return x * sigmoid(x);
}

function swigluHidden(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: multiply values[i] by silu(gates[i]).
    output.push(0);
  }

  return output;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function siluRef(x) {
  return x * sigmoid(x);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('swiglu simple', swigluHidden([2, 3], [0, Math.log(3)]), [0, 3 * siluRef(Math.log(3))]);
check('zero values', swigluHidden([0, 0], [10, 10]), [0, 0]);

return results;`,
    hints: [
      'Apply SiLU to the gate stream.',
      'Then multiply by the value stream.',
      'output.push(values[i] * silu(gates[i]));',
    ],
    solution: `function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  return x * sigmoid(x);
}

function swigluHidden(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    output.push(values[i] * silu(gates[i]));
  }

  return output;
}`,
    explanation: 'SwiGLU is a modern gated MLP pattern used in many transformer variants.',
  },

  {
    id: 'mlp-output-projection',
    stepLabel: '45.4',
    group: 'MLP and SwiGLU',
    title: 'MLP output projection',
    concept: 'After hidden activation, an MLP projects back to the model dimension.',
    objective: 'Return denseLayer(hidden, outputWeights, outputBiases).',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function mlpOutput(hidden, outputWeights, outputBiases) {
  // TODO: project hidden back to output dimension.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('project hidden to 2 outputs', mlpOutput([1, 2], [[3, 4], [5, 6]], [0, 1]), [11, 18]);
check('identity projection', mlpOutput([7, 8], [[1, 0], [0, 1]], [0, 0]), [7, 8]);

return results;`,
    hints: [
      'The helper denseLayer is already available.',
      'Use hidden as the input vector.',
      'return denseLayer(hidden, outputWeights, outputBiases);',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function mlpOutput(hidden, outputWeights, outputBiases) {
  return denseLayer(hidden, outputWeights, outputBiases);
}`,
    explanation: 'Transformer MLPs expand, activate or gate, then project back into the residual stream dimension.',
  },

  {
    id: 'transformer-attention-residual-update',
    stepLabel: '46.1',
    group: 'Tiny transformer block',
    title: 'Attention residual update',
    concept: 'The attention sublayer writes an update into the residual stream.',
    objective: 'Return x + attentionOutput.',
    difficulty: 'warmup',
    starterCode: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function attentionResidual(x, attentionOutput) {
  // TODO: return residual stream after attention.
  return attentionOutput;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('attention update', attentionResidual([1, 2], [10, 20]), [11, 22]);
check('zero update', attentionResidual([1, 2], [0, 0]), [1, 2]);

return results;`,
    hints: [
      'Residual means original stream plus update.',
      'Use addVectors.',
      'return addVectors(x, attentionOutput);',
    ],
    solution: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function attentionResidual(x, attentionOutput) {
  return addVectors(x, attentionOutput);
}`,
    explanation: 'Attention reads from the sequence and writes an update back into each token residual stream.',
  },

  {
    id: 'transformer-mlp-residual-update',
    stepLabel: '46.2',
    group: 'Tiny transformer block',
    title: 'MLP residual update',
    concept: 'After attention, the MLP sublayer also writes into the residual stream.',
    objective: 'Return streamAfterAttention + mlpOutput.',
    difficulty: 'warmup',
    starterCode: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function mlpResidual(streamAfterAttention, mlpOutput) {
  // TODO: return residual stream after MLP.
  return mlpOutput;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('mlp update', mlpResidual([11, 22], [3, 4]), [14, 26]);
check('zero update', mlpResidual([11, 22], [0, 0]), [11, 22]);

return results;`,
    hints: [
      'The MLP update is added to the current stream.',
      'Use addVectors.',
      'return addVectors(streamAfterAttention, mlpOutput);',
    ],
    solution: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function mlpResidual(streamAfterAttention, mlpOutput) {
  return addVectors(streamAfterAttention, mlpOutput);
}`,
    explanation: 'Transformer blocks usually contain two residual writes: attention, then MLP.',
  },

  {
    id: 'transformer-prenorm-block-forward',
    stepLabel: '46.3',
    group: 'Tiny transformer block',
    title: 'Pre-norm transformer block',
    concept: 'A pre-norm transformer block normalizes before attention and before MLP.',
    objective: 'Return x + attention(norm1(x)) + mlp(norm2(afterAttention)).',
    difficulty: 'challenge',
    starterCode: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function tinyPreNormBlock(x, norm1, attention, norm2, mlp) {
  const attentionInput = norm1(x);
  const attentionOutput = attention(attentionInput);
  const afterAttention = addVectors(x, attentionOutput);

  const mlpInput = norm2(afterAttention);
  const mlpOutput = mlp(mlpInput);

  // TODO: return afterAttention plus mlpOutput.
  return mlpOutput;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('simple block', tinyPreNormBlock([1, 2], (x) => x, () => [10, 20], (x) => x, () => [3, 4]), [14, 26]);
check('zero updates', tinyPreNormBlock([1, 2], (x) => x, () => [0, 0], (x) => x, () => [0, 0]), [1, 2]);

return results;`,
    hints: [
      'afterAttention is already x plus attention output.',
      'The final step adds mlpOutput to afterAttention.',
      'return addVectors(afterAttention, mlpOutput);',
    ],
    solution: `function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function tinyPreNormBlock(x, norm1, attention, norm2, mlp) {
  const attentionInput = norm1(x);
  const attentionOutput = attention(attentionInput);
  const afterAttention = addVectors(x, attentionOutput);

  const mlpInput = norm2(afterAttention);
  const mlpOutput = mlp(mlpInput);

  return addVectors(afterAttention, mlpOutput);
}`,
    explanation: 'This is the transformer-block skeleton: normalize, attention, residual, normalize, MLP, residual.',
  },

  {
    id: 'transformer-stack-two-blocks',
    stepLabel: '46.4',
    group: 'Tiny transformer block',
    title: 'Stack two blocks',
    concept: 'Transformer depth comes from feeding one block output into the next block.',
    objective: 'Return block2(block1(x)).',
    difficulty: 'core',
    starterCode: `function stackTwoBlocks(x, block1, block2) {
  const afterBlock1 = block1(x);

  // TODO: feed afterBlock1 into block2.
  return afterBlock1;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('two additive blocks', stackTwoBlocks([1, 2], (x) => x.map((v) => v + 10), (x) => x.map((v) => v * 2)), [22, 24]);
check('identity then shift', stackTwoBlocks([1, 2], (x) => x, (x) => x.map((v) => v + 1)), [2, 3]);

return results;`,
    hints: [
      'Depth means sequential composition.',
      'block2 receives the output of block1.',
      'return block2(afterBlock1);',
    ],
    solution: `function stackTwoBlocks(x, block1, block2) {
  const afterBlock1 = block1(x);
  return block2(afterBlock1);
}`,
    explanation: 'Deep transformers repeatedly update the residual stream through many blocks.',
  },

  {
    id: 'debug-attention-weights-sum',
    stepLabel: '47.1',
    group: 'Transformer debugging checks',
    title: 'Attention weights sum to one',
    concept: 'Softmax attention weights should sum to 1.',
    objective: 'Return the sum of weights.',
    difficulty: 'warmup',
    starterCode: `function sumWeights(weights) {
  let total = 0;

  for (let i = 0; i < weights.length; i++) {
    // TODO: add each weight.
    total += 0;
  }

  return total;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two weights', sumWeights([0.5, 0.5]), 1);
check('three weights', sumWeights([0.2, 0.3, 0.5]), 1);
check('one weight', sumWeights([1]), 1);

return results;`,
    hints: [
      'Loop over all weights.',
      'Add weights[i] into total.',
      'total += weights[i];',
    ],
    solution: `function sumWeights(weights) {
  let total = 0;

  for (let i = 0; i < weights.length; i++) {
    total += weights[i];
  }

  return total;
}`,
    explanation: 'If attention weights do not sum to one, the softmax or mask logic is likely broken.',
  },

  {
    id: 'debug-causal-leak',
    stepLabel: '47.2',
    group: 'Transformer debugging checks',
    title: 'Detect future attention leak',
    concept: 'A causal mask fails if any query attends to a future key.',
    objective: 'Return true if keyPosition is greater than queryPosition.',
    difficulty: 'core',
    starterCode: `function isFutureLeak(queryPosition, keyPosition) {
  // TODO: return true when key is in the future.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('past is not leak', isFutureLeak(3, 1), false);
check('same position is not leak', isFutureLeak(3, 3), false);
check('future is leak', isFutureLeak(3, 4), true);
check('first query cannot see second key', isFutureLeak(0, 1), true);

return results;`,
    hints: [
      'Future means keyPosition is greater than queryPosition.',
      'Same position is allowed in causal attention.',
      'return keyPosition > queryPosition;',
    ],
    solution: `function isFutureLeak(queryPosition, keyPosition) {
  return keyPosition > queryPosition;
}`,
    explanation: 'Future leakage lets next-token models cheat during training.',
  },

  {
    id: 'debug-residual-norm-explosion',
    stepLabel: '47.3',
    group: 'Transformer debugging checks',
    title: 'Detect residual norm explosion',
    concept: 'Very large residual norms can indicate unstable updates.',
    objective: 'Return true when norm exceeds threshold.',
    difficulty: 'core',
    starterCode: `function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function residualNormTooLarge(stream, threshold) {
  // TODO: return whether norm(stream) is greater than threshold.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('small stream', residualNormTooLarge([3, 4], 10), false);
check('large stream', residualNormTooLarge([30, 40], 10), true);
check('equal threshold is not greater', residualNormTooLarge([3, 4], 5), false);

return results;`,
    hints: [
      'Use the norm helper.',
      'Compare norm(stream) with threshold.',
      'return norm(stream) > threshold;',
    ],
    solution: `function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function residualNormTooLarge(stream, threshold) {
  return norm(stream) > threshold;
}`,
    explanation: 'Monitoring residual stream norms can help diagnose instability in deep networks.',
  },

  {
    id: 'debug-attention-shape-mismatch',
    stepLabel: '47.4',
    group: 'Transformer debugging checks',
    title: 'Detect Q/K dimension mismatch',
    concept: 'Queries and keys must have the same feature dimension for dot products.',
    objective: 'Return whether queryDim equals keyDim.',
    difficulty: 'core',
    starterCode: `function attentionDimsCompatible(query, key) {
  const queryDim = query.length;
  const keyDim = key.length;

  // TODO: return whether dimensions match.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same dimension', attentionDimsCompatible([1, 2], [3, 4]), true);
check('different dimension', attentionDimsCompatible([1, 2, 3], [4, 5]), false);
check('one-dimensional same', attentionDimsCompatible([1], [2]), true);

return results;`,
    hints: [
      'Dot products require matching lengths.',
      'Compare queryDim and keyDim.',
      'return queryDim === keyDim;',
    ],
    solution: `function attentionDimsCompatible(query, key) {
  const queryDim = query.length;
  const keyDim = key.length;

  return queryDim === keyDim;
}`,
    explanation: 'Many transformer bugs are shape bugs: Q and K must line up for similarity scores.',
  },

  // --- WAVE 2: ADDED EXERCISES ---
  {
    id: 'rope-rotate-2d',
    stepLabel: '4.1',
    group: 'Rotate 2D block',
    title: 'Rotate 2D vector',
    concept: 'Rotary Position Embeddings (RoPE) rotate pairs of dimensions in query/key vectors by an angle representing the position.',
    objective: 'Implement 2D rotation: [x0 * cos - x1 * sin, x0 * sin + x1 * cos].',
    difficulty: 'warmup',
    starterCode: `function rotate2d(x0, x1, cos, sin) {
  // TODO: return the 2D rotated vector array [newX0, newX1]
  return [];
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('rotate 0', rotate2d(1, 0, 0, 1), [0, 1]); // theta = pi/2
check('rotate identity', rotate2d(1, 2, 1, 0), [1, 2]); // theta = 0
return results;`,
    hints: [
      'The first coordinate is x0 * cos - x1 * sin.',
      'The second coordinate is x0 * sin + x1 * cos.',
      'return [x0 * cos - x1 * sin, x0 * sin + x1 * cos];',
    ],
    solution: `function rotate2d(x0, x1, cos, sin) {
  return [x0 * cos - x1 * sin, x0 * sin + x1 * cos];
}`,
    explanation: 'Rotating in 2D pairs is the fundamental building block of Rotary Embeddings.',
  },
  {
    id: 'rope-apply-head',
    stepLabel: '4.2',
    group: 'Apply to head dimension',
    title: 'Apply RoPE to head',
    concept: 'RoPE divides the query/key vector into 2D chunks, rotating each chunk with its specific cosine/sine frequencies.',
    objective: 'Rotate each 2D chunk of the head vector using cos[i] and sin[i].',
    difficulty: 'core',
    starterCode: `function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i+1];
    const c = cos[i/2];
    const s = sin[i/2];
    // TODO: compute rotated elements and push them to rotated array
    rotated.push(0, 0);
  }
  return rotated;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('apply rope 4D', applyRoPE([1, 0, 0, 1], [0, 1], [1, 0]), [0, 1, 0, 1]);
return results;`,
    hints: [
      'The rotated coordinates for chunk i/2 are: x0 * c - x1 * s and x0 * s + x1 * c.',
      'Push those two coordinates instead of the placeholders.',
      'rotated[i] = x0 * c - x1 * s; rotated[i+1] = x0 * s + x1 * c;',
    ],
    solution: `function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i+1];
    const c = cos[i/2];
    const s = sin[i/2];
    rotated.push(x0 * c - x1 * s, x0 * s + x1 * c);
  }
  return rotated;
}`,
    explanation: 'RoPE applies different rotation angles to different frequency channels, encoding absolute positions as relative rotation differences.',
  },
  {
    id: 'transformer-ffn-dim',
    stepLabel: '5.1',
    group: 'FFN expansion ratio',
    title: 'FFN intermediate dimension',
    concept: 'Modern transformer architectures use different FFN intermediate dimension scales. For SwiGLU, it is typically round(8/3 * d), whereas standard MLP uses 4 * d.',
    objective: 'Calculate the FFN hidden dimension. For swiglu, it is Math.round(expansionRatio * d_model * 2/3), otherwise expansionRatio * d_model.',
    difficulty: 'warmup',
    starterCode: `function getFFNIntermediateDim(dModel, expansionRatio, isSwiGLU) {
  // TODO: return the intermediate dimension of the FFN block
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('standard ffn', getFFNIntermediateDim(4096, 4, false), 16384);
check('swiglu ffn', getFFNIntermediateDim(4096, 4, true), 10923);
return results;`,
    hints: [
      'If isSwiGLU is true, multiply dModel * expansionRatio * 2 / 3 and round.',
      'Otherwise, multiply dModel * expansionRatio.',
      'return isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;',
    ],
    solution: `function getFFNIntermediateDim(dModel, expansionRatio, isSwiGLU) {
  return isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
}`,
    explanation: 'SwiGLU uses three weight matrices (gate, up, and down projections) compared to MLPs two, so its intermediate dimension is scaled down by 2/3 to keep parameter counts comparable.',
  },
  {
    id: 'transformer-block-params',
    stepLabel: '5.2',
    group: 'Parameter estimate',
    title: 'Estimate block parameter count',
    concept: 'A single standard transformer block contains parameters in the self-attention projections (Q, K, V, Out) and the FFN linear layers.',
    objective: 'Compute total weight parameters in attention (4 * dModel^2) and FFN (2 * dModel * dFFN).',
    difficulty: 'core',
    starterCode: `function estimateBlockParams(dModel, dFFN) {
  const attnParams = 4 * dModel * dModel;
  // TODO: compute FFN parameters (2 * dModel * dFFN) and return the total
  const ffnParams = 0;
  return attnParams + ffnParams;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('estimate llama 7b size block', estimateBlockParams(4096, 11008), 157286400);
return results;`,
    hints: [
      'The FFN has an up-projection/gate (dModel -> dFFN) and a down-projection (dFFN -> dModel).',
      'For standard MLP, the parameters are 2 * dModel * dFFN.',
      'const ffnParams = 2 * dModel * dFFN;',
    ],
    solution: `function estimateBlockParams(dModel, dFFN) {
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}`,
    explanation: 'Self-attention and FFN projections constitute the vast majority of parameters in a transformer block.',
  },
  {
    id: 'coconut-latent-residual',
    stepLabel: '6.1',
    group: 'Latent residual add',
    title: 'Latent residual addition',
    concept: 'Coconut (Chain of Continuous Thought) updates sequence representations in the hidden latent space by adding latent thought vectors.',
    objective: 'Add the thought vector to the hidden vector element-wise.',
    difficulty: 'warmup',
    starterCode: `function latentResidualAdd(hidden, thought) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    // TODO: add hidden[i] and thought[i]
    result.push(0);
  }
  return result;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('residual add', latentResidualAdd([1, 2], [10, 20]), [11, 22]);
return results;`,
    hints: [
      'Add hidden[i] and thought[i].',
      'Push that sum to the result array.',
    ],
    solution: `function latentResidualAdd(hidden, thought) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    result.push(hidden[i] + thought[i]);
  }
  return result;
}`,
    explanation: 'Latent thought updates behave similarly to residual connections, shifting hidden representations without losing past context.',
  },
  {
    id: 'coconut-latent-gate',
    stepLabel: '6.2',
    group: 'Gate blend',
    title: 'Gated latent blend',
    concept: 'Latent steps are often gated so the model can dynamically control how much new reasoning to inject into the state.',
    objective: 'Compute the gated blend: output = (1 - g) * hidden + g * thought.',
    difficulty: 'core',
    starterCode: `function gatedLatentBlend(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    // TODO: compute gated blend coordinate
    const val = 0;
    result.push(val);
  }
  return result;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('gate 0.5', gatedLatentBlend([2, 4], [10, 20], 0.5), [6, 12]);
check('gate 0.1', gatedLatentBlend([2, 4], [10, 20], 0.1), [2.8, 5.6]);
return results;`,
    hints: [
      'Use the formula: (1 - gate) * hidden[i] + gate * thought[i].',
      'Store this in val.',
    ],
    solution: `function gatedLatentBlend(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    const val = (1 - gate) * hidden[i] + gate * thought[i];
    result.push(val);
  }
  return result;
}`,
    explanation: 'Gating lets the model pass the original representations unmodified if no immediate continuous thinking is required.',
  },
  {
    id: 'gqa-group-index',
    stepLabel: '7.1',
    group: 'KV head index',
    title: 'GQA KV head indexing',
    concept: 'Grouped-Query Attention maps query heads to shared KV heads. If we have Hq query heads and Hkv key-value heads, head Q corresponds to KV head Q / (Hq / Hkv).',
    objective: 'Return the index of the KV head corresponding to queryHeadIndex.',
    difficulty: 'warmup',
    starterCode: `function getKVHeadIndex(queryHeadIndex, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  // TODO: return the index of the key-value head for queryHeadIndex
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('GQA 8 heads to 2 KV', getKVHeadIndex(5, 8, 2), 1);
check('GQA 8 heads to 8 KV (MHA)', getKVHeadIndex(5, 8, 8), 5);
check('GQA 8 heads to 1 KV (MQA)', getKVHeadIndex(7, 8, 1), 0);
return results;`,
    hints: [
      'Divide queryHeadIndex by groupSize.',
      'Take the floor of the result using Math.floor.',
      'return Math.floor(queryHeadIndex / groupSize);',
    ],
    solution: `function getKVHeadIndex(queryHeadIndex, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  return Math.floor(queryHeadIndex / groupSize);
}`,
    explanation: 'Dividing query heads into chunks allows sharing KV heads, reducing KV cache size and memory traffic during generation.',
  },
  {
    id: 'gqa-expand-kv',
    stepLabel: '7.2',
    group: 'Repeat/broadcast rule',
    title: 'GQA KV expansion',
    concept: 'During computation, GQA repeats Key/Value states so that their heads match the number of Query heads.',
    objective: 'Repeat Key/Value vectors along the head dimension for a single token.',
    difficulty: 'core',
    starterCode: `function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  
  for (let q = 0; q < numQueryHeads; q++) {
    // TODO: find the correct KV head index and push it to expanded
    const kvIdx = 0;
    expanded.push(kvHeads[kvIdx]);
  }
  
  return expanded;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const kv = [[1, 2], [3, 4]]; // 2 KV heads
check('GQA repeat 4 query heads', expandKV(kv, 4, 2), [[1, 2], [1, 2], [3, 4], [3, 4]]);
return results;`,
    hints: [
      'KV head index is Math.floor(q / groupSize).',
      'Set kvIdx to this computed index.',
    ],
    solution: `function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  
  return expanded;
}`,
    explanation: 'Repeating KV heads aligns vectors shape-wise so standard multi-head dot product attention can proceed.',
  },
  {
    id: 'kv-cache-append-step',
    stepLabel: '8.1',
    group: 'Cache append',
    title: 'KV Cache Append Step',
    concept: 'Autoregressive decoding appends each new token Key and Value projection to persistent caches so past tokens are never recomputed.',
    objective: 'Inside decodeKVCacheStep, append the projected k and v vectors to keyCache and valueCache.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  // TODO: append k to keyCache and v to valueCache.

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const x = [1, 0];
const W = [[1, 0], [0, 1]];
const kC = [];
const vC = [];
decodeKVCacheStep(x, W, W, W, kC, vC);
check('cache length after append', kC.length, 1);
check('key stored', JSON.stringify(kC[0]), JSON.stringify([1, 0]));
check('value stored', JSON.stringify(vC[0]), JSON.stringify([1, 0]));
return results;`,
    hints: [
      'Use keyCache.push(k) after projection.',
      'Use valueCache.push(v) as well.',
      'The attention code below reads the updated cache length.',
    ],
    solution: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,
    explanation: 'Caching keys and values is what makes autoregressive generation linear in history instead of quadratic.',
  },
  {
    id: 'kv-cache-slicing',
    stepLabel: '8.2',
    group: 'Sequence slicing',
    title: 'Scaled Dot-Product Attention Scale',
    concept: 'Scaled dot-product attention divides logits by sqrt(headDim) so dot products stay well-conditioned as head size grows.',
    objective: 'Inside decodeKVCacheStep, compute scale = 1 / Math.sqrt(headDim) before building attention scores.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  let scale = 0;
  // TODO: set scale to 1 / Math.sqrt(headDim).

  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const x = [1, 0];
const W = [[1, 0], [0, 1]];
const out = decodeKVCacheStep(x, W, W, W, [[0, 1]], [[5, 5]]);
check('scale affects softmax blend', out[0], 2.320954);
return results;`,
    hints: [
      'Use Math.sqrt(headDim) in the denominator.',
      'scale = 1 / Math.sqrt(headDim).',
      'Multiply each raw dot product by scale when building scores.',
    ],
    solution: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,
    explanation: 'The attention scale keeps logits stable so softmax weights remain informative as head dimension grows.',
  },
  {
    id: 'kv-cache-attention-blend',
    stepLabel: '8.3',
    group: 'Cached cross-attention',
    title: 'KV Cache Attention Blending',
    concept: 'Cached attention softmax-normalizes query-key scores and blends value vectors into the output representation for the current token.',
    objective: 'Inside decodeKVCacheStep, compute softmax weights and blend valueCache into output.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  // TODO: softmax scores into weights and blend valueCache rows into output.

  return output;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-3) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const qx = [1, 0];
const W = [[1, 0], [0, 1]];
check('attention blend', decodeKVCacheStep(qx, W, W, W, [[1, 0], [0, 1]], [[10, 20], [30, 40]]), [10.345507, 15.933274]);
return results;`,
    hints: [
      'Subtract max score before exponentiating for numerical stability.',
      'Normalize exponentials to get softmax weights.',
      'Accumulate weights[j] * valueCache[j][m] into output[m].',
    ],
    solution: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,
    explanation: 'Softmax blending turns cached keys and values into the contextual representation for the current query token.',
  },
  {
    id: 'kv-cache-generation',
    stepLabel: '8.4',
    group: 'Autoregressive generation step',
    title: 'Autoregressive KV Cache Generation',
    concept: 'A full decode step projects the token embedding to Q/K/V, appends K and V to the cache, and runs scaled attention over all cached history.',
    objective: 'Inside decodeKVCacheStep, implement the matrix-vector projections for q, k, and v from x.',
    difficulty: 'challenge',
    starterCode: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      // TODO: accumulate q[i], k[i], and v[i] from x[j] and the weight rows.
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const x = [1.0, 2.0];
const Wq = [[1, 0], [0, 1]];
const Wk = [[0.5, 0], [0, 0.5]];
const Wv = [[2, 0], [0, 2]];
const kC = [[0.5, 1.0]];
const vC = [[2.0, 4.0]];
const out = decodeKVCacheStep(x, Wq, Wk, Wv, kC, vC);
check('full decode output', out, [2.0, 4.0]);
results.push({ name: 'cache grows', actual: kC.length, expected: 2, passed: kC.length === 2 });
return results;`,
    hints: [
      'Each projection is a matrix-vector product: q[i] += Wq[i][j] * x[j].',
      'Apply the same pattern for k with Wk and v with Wv.',
      'The cache append and attention code below should remain unchanged.',
    ],
    solution: `/**
 * Runs one autoregressive decode step: project x to Q/K/V, append to cache, attend over history.
 * @param {number[]} x - Current token embedding of size dModel.
 * @param {number[][]} Wq - Query weights [headDim, dModel].
 * @param {number[][]} Wk - Key weights [headDim, dModel].
 * @param {number[][]} Wv - Value weights [headDim, dModel].
 * @param {number[][]} keyCache - Historical keys updated in place.
 * @param {number[][]} valueCache - Historical values updated in place.
 * @returns {number[]} Attention output vector of size headDim.
 */
function decodeKVCacheStep(x, Wq, Wk, Wv, keyCache, valueCache) {
  const dModel = x.length;
  const headDim = Wq.length;
  const q = Array(headDim).fill(0);
  const k = Array(headDim).fill(0);
  const v = Array(headDim).fill(0);

  for (let i = 0; i < headDim; i++) {
    for (let j = 0; j < dModel; j++) {
      q[i] += Wq[i][j] * x[j];
      k[i] += Wk[i][j] * x[j];
      v[i] += Wv[i][j] * x[j];
    }
  }

  keyCache.push(k);
  valueCache.push(v);

  const n = keyCache.length;
  const scale = 1 / Math.sqrt(headDim);
  const output = Array(headDim).fill(0);
  if (n === 0) return output;

  const scores = [];
  for (let j = 0; j < n; j++) {
    let dot = 0;
    for (let m = 0; m < headDim; m++) {
      dot += q[m] * keyCache[j][m];
    }
    scores.push(dot * scale);
  }

  const maxScore = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - maxScore));
  const sumExp = exps.reduce((sum, val) => sum + val, 0);
  const weights = exps.map((e) => e / sumExp);

  for (let j = 0; j < n; j++) {
    for (let m = 0; m < headDim; m++) {
      output[m] += weights[j] * valueCache[j][m];
    }
  }

  return output;
}`,
    explanation: 'Projection, cache append, and cached attention together form one autoregressive generation step.',
  },
  {
    id: 'flash-max-update',
    stepLabel: '9.1',
    group: 'Row max update',
    title: 'FlashAttention max update',
    concept: 'FlashAttention operates in blocks. To maintain correct Softmax outputs, it updates the running maximum for each row as new blocks are loaded.',
    objective: 'Compute the new maximum of two values.',
    difficulty: 'warmup',
    starterCode: `function updateRowMax(oldMax, blockMax) {
  // TODO: return the maximum of oldMax and blockMax
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('update max positive', updateRowMax(5, 8), 8);
check('update max negative', updateRowMax(-10, -2), -2);
return results;`,
    hints: [
      'Use Math.max.',
      'return Math.max(oldMax, blockMax);',
    ],
    solution: `function updateRowMax(oldMax, blockMax) {
  return Math.max(oldMax, blockMax);
}`,
    explanation: 'Subtracting row maximums protects exponents from overflow.',
  },
  {
    id: 'flash-sum-update',
    stepLabel: '9.2',
    group: 'Running sum',
    title: 'FlashAttention sum update',
    concept: 'To update the running Softmax denominator incrementally, FlashAttention scales the old sum and the block sum by the difference in their maximums.',
    objective: 'Compute the updated denominator: oldSum * e^(oldMax - newMax) + blockSum * e^(blockMax - newMax).',
    difficulty: 'core',
    starterCode: `function updateRowSum(oldSum, blockSum, oldMax, blockMax, newMax) {
  // TODO: return the updated Softmax sum denominator
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('same max sum update', updateRowSum(2.0, 1.0, 5.0, 5.0, 5.0), 3.0);
check('different max sum update', updateRowSum(1.0, 1.0, 5.0, 6.0, 6.0), 1.367879);
return results;`,
    hints: [
      'Use Math.exp(oldMax - newMax) and Math.exp(blockMax - newMax).',
      'The formula is: oldSum * Math.exp(oldMax - newMax) + blockSum * Math.exp(blockMax - newMax).',
    ],
    solution: `function updateRowSum(oldSum, blockSum, oldMax, blockMax, newMax) {
  return oldSum * Math.exp(oldMax - newMax) + blockSum * Math.exp(blockMax - newMax);
}`,
    explanation: 'Scaling old sums ensures the Softmax denominators stay mathematically equivalent to standard Softmax while loading in chunks.',
  },
  // --- spec-sparse-attention ---
  {
    id: 'specsparse-prefix-length',
    stepLabel: 'SSA.1',
    group: 'Draft prefix length',
    title: 'Accepted Draft Prefix',
    concept: 'SpecSA verification begins by finding how many draft tokens match the target model prefix before the first mismatch.',
    objective: 'Inside specSparseVerifyStep, compute acceptedPrefix as the longest matching prefix length.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  // TODO: increment while draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix].

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('stops at mismatch', specSparseVerifyStep([1, 2, 9, 4], [1, 2, 3, 4], [0], [0], 1, 1, 1).acceptedPrefix, 2);
check('full match', specSparseVerifyStep([5, 6, 7], [5, 6, 7], [0], [0], 1, 1, 1).acceptedPrefix, 3);
check('short target', specSparseVerifyStep([5, 6, 7], [5, 6], [0], [0], 1, 1, 1).acceptedPrefix, 2);
return results;`,
    hints: [
      'Compare tokens at the same index while both arrays have elements.',
      'Stop at the first unequal token or when either sequence ends.',
      'Use a while loop that checks draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix].',
    ],
    solution: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    explanation: 'Prefix acceptance tells SpecSA how many draft tokens can be committed before sparse KV verification runs.',
  },
  {
    id: 'specsparse-criticality-avg',
    stepLabel: 'SSA.2',
    group: 'Criticality average',
    title: 'Collect-2-Query Criticality',
    concept: 'SpecSA averages Collect-2-Query first and bonus logits per block to estimate which KV regions matter most.',
    objective: 'Inside specSparseVerifyStep, set criticality[i] to the average of firstLogits[i] and bonusLogits[i].',
    difficulty: 'core',
    starterCode: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    // TODO: criticality[i] = average of firstLogits[i] and bonusLogits[i].
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('averages logits', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 1, 4, 1).criticality, [1, 3, 4, 0]);
return results;`,
    hints: [
      'Add the two logits and divide by 2.',
      'Process every block index from 0 to numBlocks - 1.',
      'criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;',
    ],
    solution: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    explanation: 'Averaging both Collect-2-Query rows yields a single criticality score per KV block.',
  },
  {
    id: 'specsparse-topk-blocks',
    stepLabel: 'SSA.3',
    group: 'Top-k block selection',
    title: 'Select Critical KV Blocks',
    concept: 'SpecSA reads only the top-k blocks ranked by criticality instead of the full KV cache.',
    objective: 'Inside specSparseVerifyStep, fill selectedBlocks with the topK highest-criticality block indices (break ties by lower index).',
    difficulty: 'core',
    starterCode: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const selectedBlocks = [];
  // TODO: pick topK block indices with highest criticality; break ties by lower index.

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => Object.is(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('top two blocks', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 2, 4, 1).selectedBlocks, [2, 1]);
check('clamps to available', specSparseVerifyStep([], [], [2, 5], [0, 0], 5, 2, 1).selectedBlocks, [1, 0]);
return results;`,
    hints: [
      'Pair each index with its criticality score, then sort descending by score.',
      'When scores tie, prefer the smaller block index.',
      'Take the first topK entries from the sorted list and map back to indices.',
    ],
    solution: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    explanation: 'Top-k block selection is the core sparse read pattern that avoids loading the entire KV cache.',
  },
  {
    id: 'specsparse-blocks-skipped',
    stepLabel: 'SSA.4',
    group: 'KV blocks skipped',
    title: 'KV Blocks Skipped',
    concept: 'The speedup from SpecSA comes from skipping blocks that were not selected for verification.',
    objective: 'Inside specSparseVerifyStep, set blocksSkipped to totalBlocks minus the number of selected blocks.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  let blocksSkipped = 0;
  // TODO: blocksSkipped = totalBlocks - selectedBlocks.length

  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('skips unselected', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 2, 8, 64).blocksSkipped, 6);
check('reads all when k equals total', specSparseVerifyStep([], [], [2, 5], [0, 0], 2, 2, 10).blocksSkipped, 0);
return results;`,
    hints: [
      'Subtract the number of selected blocks from totalBlocks.',
      'selectedBlocks.length is the count of blocks actually read.',
      'blocksSkipped = totalBlocks - selectedBlocks.length;',
    ],
    solution: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  let blocksSkipped = 0;
  blocksSkipped = totalBlocks - selectedBlocks.length;

  const kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    explanation: 'Blocks skipped quantifies how much KV IO SpecSA avoids compared with dense attention.',
  },
  {
    id: 'specsparse-kv-rows-read',
    stepLabel: 'SSA.5',
    group: 'Effective KV rows read',
    title: 'Effective KV Rows Read',
    concept: 'Each selected block contributes tokensPerBlock KV rows. Multiplying gives the effective sparse read volume.',
    objective: 'Inside specSparseVerifyStep, set kvRowsRead to selectedBlocks.length * tokensPerBlock.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  let kvRowsRead = 0;
  // TODO: kvRowsRead = selectedBlocks.length * tokensPerBlock

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sparse read volume', specSparseVerifyStep([], [], [1, 5, 2, 0], [1, 1, 6, 0], 2, 8, 64).kvRowsRead, 128);
check('single block', specSparseVerifyStep([], [], [3], [1], 1, 4, 32).kvRowsRead, 32);
return results;`,
    hints: [
      'Multiply the number of selected blocks by tokensPerBlock.',
      'This counts token rows loaded from KV cache during sparse verification.',
      'kvRowsRead = selectedBlocks.length * tokensPerBlock;',
    ],
    solution: `/**
 * Runs one SpecSA sparse verification step: prefix accept, criticality scoring, block selection, IO accounting.
 * @param {number[]} draftTokens - Tokens proposed by the draft model.
 * @param {number[]} targetTokens - Tokens from the target verification pass.
 * @param {number[]} firstLogits - Collect-2-Query first-row scores per KV block.
 * @param {number[]} bonusLogits - Collect-2-Query bonus-row scores per KV block.
 * @param {number} topK - Number of critical blocks to read.
 * @param {number} totalBlocks - Total KV blocks available in cache.
 * @param {number} tokensPerBlock - Tokens stored in each KV block.
 * @returns {{ acceptedPrefix: number, criticality: number[], selectedBlocks: number[], blocksSkipped: number, kvRowsRead: number }}
 */
function specSparseVerifyStep(draftTokens, targetTokens, firstLogits, bonusLogits, topK, totalBlocks, tokensPerBlock) {
  let acceptedPrefix = 0;
  while (
    acceptedPrefix < draftTokens.length
    && acceptedPrefix < targetTokens.length
    && draftTokens[acceptedPrefix] === targetTokens[acceptedPrefix]
  ) {
    acceptedPrefix += 1;
  }

  const numBlocks = firstLogits.length;
  const criticality = Array(numBlocks).fill(0);
  for (let i = 0; i < numBlocks; i++) {
    criticality[i] = (firstLogits[i] + bonusLogits[i]) / 2;
  }

  const ranked = criticality.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const selectedBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const blocksSkipped = totalBlocks - selectedBlocks.length;
  let kvRowsRead = 0;
  kvRowsRead = selectedBlocks.length * tokensPerBlock;

  return { acceptedPrefix, criticality, selectedBlocks, blocksSkipped, kvRowsRead };
}`,
    explanation: 'Effective KV rows read connects block-level sparsity to the actual memory traffic saved at inference time.',
  },
  {
    id: 'speculative-accept-check',
    stepLabel: '10.1',
    group: 'Accept/reject rule',
    title: 'Speculative decoding acceptance check',
    concept: 'In speculative decoding, the larger target model accepts a token proposed by the draft model with probability min(1, P_target(x)/P_draft(x)).',
    objective: 'Return true if randVal <= pTarget / pDraft, otherwise false.',
    difficulty: 'warmup',
    starterCode: `function acceptDraftToken(pTarget, pDraft, randVal) {
  // TODO: return whether the token is accepted based on the probability ratio
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('target higher', acceptDraftToken(0.8, 0.4, 0.9), true); // ratio 2.0 >= 0.9
check('draft higher below u', acceptDraftToken(0.3, 0.6, 0.4), true); // ratio 0.5 >= 0.4
check('draft higher above u', acceptDraftToken(0.3, 0.6, 0.7), false); // ratio 0.5 < 0.7
return results;`,
    hints: [
      'Compute target-to-draft ratio: pTarget / pDraft.',
      'Check if randVal is less than or equal to this ratio.',
      'return randVal <= (pTarget / pDraft);',
    ],
    solution: `function acceptDraftToken(pTarget, pDraft, randVal) {
  return randVal <= (pTarget / pDraft);
}`,
    explanation: 'Acceptance sampling allows speculative decoding to maintain the exact distribution of the larger model while accelerating generation.',
  },
  // --- turboquant ---
  {
    id: 'turboquant-cache-bits',
    stepLabel: 'TQ.1',
    group: 'Cache memory formula',
    title: 'Quantized KV Cache Size',
    concept: 'TurboQuant stores KV cache at reduced bit width. Total bits scale with layers, tokens, heads, head dimension, and bits per value.',
    objective: 'Inside turboQuantKVStep, compute cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;

  let cacheBits = 0;
  // TODO: cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('4-bit cache', turboQuantKVStep([1], [0], [-1, 0, 1], 4, 32, 2048, 8, 128).cacheBits, 536870912);
check('8-bit cache', turboQuantKVStep([1], [0], [-1, 0, 1], 8, 2, 10, 1, 4).cacheBits, 1280);
return results;`,
    hints: [
      'Multiply layers, tokens, kvHeads, headDim, 2 (K and V), and bitsPerValue.',
      'The factor 2 accounts for both key and value tensors.',
      'cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;',
    ],
    solution: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;

  let cacheBits = 0;
  cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    explanation: 'KV cache memory dominates long-context inference; TurboQuant shrinks it by storing fewer bits per coordinate.',
  },
  {
    id: 'turboquant-nearest-code',
    stepLabel: 'TQ.2',
    group: 'Nearest codebook entry',
    title: 'Nearest Codebook Index',
    concept: 'Each key coordinate is mapped to the nearest TurboQuant codebook level before index encoding.',
    objective: 'Inside turboQuantKVStep, update bestIdx when codebook[j] is closer to originalKey[i].',
    difficulty: 'core',
    starterCode: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      // TODO: update bestIdx and minDist when codebook[j] is closer to originalKey[i].
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => Object.is(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('nearest levels', turboQuantKVStep([1], [0.2, 0.8], [-1, 0, 1], 4, 1, 1, 1, 2).indices, [1, 2]);
check('negative coord', turboQuantKVStep([1], [-0.9], [-1, 0, 1], 4, 1, 1, 1, 1).indices, [0]);
return results;`,
    hints: [
      'Compute dist = Math.abs(originalKey[i] - codebook[j]).',
      'Replace bestIdx when dist is strictly less than minDist.',
      'Update minDist together with bestIdx.',
    ],
    solution: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    explanation: 'Nearest-neighbor quantization picks the codebook entry that minimizes per-coordinate reconstruction error.',
  },
  {
    id: 'turboquant-dequant-reconstruct',
    stepLabel: 'TQ.3',
    group: 'Dequant reconstruction',
    title: 'Dequantize Key Vector',
    concept: 'Stored indices are decoded back to floating-point values by table lookup into the TurboQuant codebook.',
    objective: 'Inside turboQuantKVStep, set reconstructed[i] = codebook[indices[i]].',
    difficulty: 'core',
    starterCode: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    // TODO: reconstructed[i] = codebook[indices[i]]
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('lookup reconstruction', turboQuantKVStep([1], [0.2], [-1, 0, 1], 4, 1, 1, 1, 1).reconstructed, [0]);
check('multi dim', turboQuantKVStep([1], [0.2, -0.9], [-1, 0, 1], 4, 1, 1, 1, 2).reconstructed, [0, -1]);
return results;`,
    hints: [
      'Each stored index points to one codebook level.',
      'Lookup is a direct array read: codebook[indices[i]].',
      'Assign inside the loop over dimensions.',
    ],
    solution: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    explanation: 'Dequant reconstruction turns compact indices back into approximate key vectors for attention.',
  },
  {
    id: 'turboquant-dot-error',
    stepLabel: 'TQ.4',
    group: 'Dot-product error',
    title: 'Attention Score Error',
    concept: 'Quantization quality is measured by how much q·k changes after keys are reconstructed from codes.',
    objective: 'Inside turboQuantKVStep, set dotError to |dot(query, originalKey) - dot(query, reconstructed)|.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  let dotError = 0;
  // TODO: dotError = absolute difference between dot(query, originalKey) and dot(query, reconstructed)

  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('score error', turboQuantKVStep([1, 0], [2, 3], [-1, 0, 1], 4, 1, 1, 1, 2).dotError, 1);
check('exact reconstruction', turboQuantKVStep([1, 2], [1, 2], [-1, 0, 1, 2], 4, 1, 1, 1, 2).dotError, 0);
return results;`,
    hints: [
      'Use the local dot helper on query with originalKey and reconstructed.',
      'Take the absolute value of the difference.',
      'dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));',
    ],
    solution: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  let dotError = 0;
  dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));

  const compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    explanation: 'Dot-product error links quantization noise directly to attention score drift during inference.',
  },
  {
    id: 'turboquant-compression-ratio',
    stepLabel: 'TQ.5',
    group: 'Compression ratio',
    title: 'KV Cache Compression Ratio',
    concept: 'Compression ratio compares full FP16 KV storage against TurboQuant bit-packed storage.',
    objective: 'Inside turboQuantKVStep, set compressionRatio = fullCacheBits / cacheBits.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  let compressionRatio = 0;
  // TODO: compressionRatio = fullCacheBits / cacheBits

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('4-bit vs fp16', turboQuantKVStep([1], [0], [-1, 0, 1], 4, 32, 2048, 8, 128).compressionRatio, 4);
check('8-bit vs fp16', turboQuantKVStep([1], [0], [-1, 0, 1], 8, 1, 1, 1, 1).compressionRatio, 2);
return results;`,
    hints: [
      'Divide full FP16 cache bits by quantized cache bits.',
      'Fewer bits per value yields a larger compression ratio.',
      'compressionRatio = fullCacheBits / cacheBits;',
    ],
    solution: `/**
 * Runs one TurboQuant KV evaluation step: cache sizing, nearest quantization, reconstruction, dot error, compression ratio.
 * @param {number[]} query - Query vector for attention score error check.
 * @param {number[]} originalKey - Original high-precision key vector.
 * @param {number[]} codebook - Sorted quantization levels for each coordinate.
 * @param {number} bitsPerValue - Effective bits per stored KV coordinate.
 * @param {number} layers - Transformer layer count.
 * @param {number} tokens - Context length in tokens.
 * @param {number} kvHeads - Number of KV attention heads.
 * @param {number} headDim - Dimension per KV head.
 * @returns {{ cacheBits: number, indices: number[], reconstructed: number[], dotError: number, compressionRatio: number, fullCacheBits: number }}
 */
function turboQuantKVStep(query, originalKey, codebook, bitsPerValue, layers, tokens, kvHeads, headDim) {
  const fp16Bits = 16;
  const fullCacheBits = layers * tokens * kvHeads * headDim * 2 * fp16Bits;
  const cacheBits = layers * tokens * kvHeads * headDim * 2 * bitsPerValue;

  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  const d = originalKey.length;
  const indices = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    let bestIdx = 0;
    let minDist = Math.abs(originalKey[i] - codebook[0]);
    for (let j = 1; j < codebook.length; j++) {
      const dist = Math.abs(originalKey[i] - codebook[j]);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = j;
      }
    }
    indices[i] = bestIdx;
  }

  const reconstructed = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    reconstructed[i] = codebook[indices[i]];
  }

  const dotError = Math.abs(dot(query, originalKey) - dot(query, reconstructed));
  let compressionRatio = 0;
  compressionRatio = fullCacheBits / cacheBits;

  return { cacheBits, indices, reconstructed, dotError, compressionRatio, fullCacheBits };
}`,
    explanation: 'Compression ratio summarizes the memory win from TurboQuant relative to dense FP16 KV caches.',
  },
  {
    id: 'quantize-find-nearest',
    stepLabel: '11.1',
    group: 'Nearest codebook entry',
    title: 'Nearest quantization level',
    concept: 'Quantization compresses values by mapping floats to the nearest predefined codebook scale level.',
    objective: 'Find the index in codebook levels that minimizes absolute distance to value.',
    difficulty: 'warmup',
    starterCode: `function nearestQuantizationIndex(value, levels) {
  let bestIdx = 0;
  let minDist = Math.abs(value - levels[0]);
  
  for (let i = 1; i < levels.length; i++) {
    // TODO: update bestIdx if levels[i] is closer to value
  }
  
  return bestIdx;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('quantize near 0.2', nearestQuantizationIndex(0.2, [-1, 0, 1]), 1); // 0 is nearest
check('quantize near 0.8', nearestQuantizationIndex(0.8, [-1, 0, 1]), 2); // 1 is nearest
return results;`,
    hints: [
      'Calculate distance using Math.abs(value - levels[i]).',
      'If this distance is less than minDist, update bestIdx and minDist.',
    ],
    solution: `function nearestQuantizationIndex(value, levels) {
  let bestIdx = 0;
  let minDist = Math.abs(value - levels[0]);
  
  for (let i = 1; i < levels.length; i++) {
    const dist = Math.abs(value - levels[i]);
    if (dist < minDist) {
      minDist = dist;
      bestIdx = i;
    }
  }
  
  return bestIdx;
}`,
    explanation: 'Mapping floating-point weights to indexes of codebook levels compresses neural networks with minimal loss of accuracy.',
  },
  // --- efficient-inference-compression-track ---
  {
    id: 'quantmatmul-shape-guard',
    stepLabel: 'EIC.1',
    group: 'Shape guard',
    title: 'Quantized Dot Shape Check',
    concept: 'Quantized matmul kernels must reject mismatched vector lengths before INT8 accumulation.',
    objective: 'Inside quantizedMatmulStep, return valid: false when a.length !== b.length.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    // TODO: return invalid result with zeroed outputs.
    return { valid: true, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mismatch rejected', quantizedMatmulStep([1, 2], [3], 0.1, 0.1).valid, false);
check('match accepted', quantizedMatmulStep([1, 2], [3, 4], 0.1, 0.1).valid, true);
check('empty vectors valid', quantizedMatmulStep([], [], 1, 1).valid, true);
return results;`,
    hints: [
      'When lengths differ, return valid: false immediately.',
      'Set intDot and scaled to 0 for invalid inputs.',
      'Only run accumulation when a.length === b.length.',
    ],
    solution: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,
    explanation: 'Shape guards prevent silent wrong answers when compressed weight layouts do not align.',
  },
  {
    id: 'quantmatmul-int8-dot',
    stepLabel: 'EIC.2',
    group: 'INT8 dot',
    title: 'INT8 Dot Accumulation',
    concept: 'Efficient inference kernels accumulate dot products in integer arithmetic before any dequantization.',
    objective: 'Inside quantizedMatmulStep, compute intDot as the sum of element-wise products a[i] * b[i].',
    difficulty: 'core',
    starterCode: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    // TODO: accumulate a[i] * b[i] into intDot.
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('integer dot', quantizedMatmulStep([10, -5, 3], [2, 4, 1], 1, 1).intDot, 10 * 2 + (-5) * 4 + 3 * 1);
check('negative products', quantizedMatmulStep([-2, 7], [5, -1], 1, 1).intDot, -17);
return results;`,
    hints: [
      'Multiply matching indices and add into intDot inside the loop.',
      'INT8 values are still numbers in JavaScript — accumulate normally.',
      'intDot += a[i] * b[i];',
    ],
    solution: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,
    explanation: 'Integer accumulation is the fast path; dequantization happens only after the dot is complete.',
  },
  {
    id: 'quantmatmul-dequant-fuse',
    stepLabel: 'EIC.3',
    group: 'Dequant fuse',
    title: 'Fused Global Dequantization',
    concept: 'When scales are scalar per tensor, hardware fuses dequant as intDot * scaleA * scaleB after the INT8 dot.',
    objective: 'Inside quantizedMatmulStep, when scales are numbers, set scaled = intDot * scaleA * scaleB.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    // TODO: scaled = intDot * scaleA * scaleB
  }

  return { valid: true, intDot, scaled };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('fused global scale', quantizedMatmulStep([10, -5], [20, 30], 0.1, 0.05).scaled, 0.25);
check('unit scales', quantizedMatmulStep([3, 4], [5, 6], 1, 1).scaled, 39);
return results;`,
    hints: [
      'Use the else branch for scalar scaleA and scaleB.',
      'Multiply intDot by both scales once.',
      'scaled = intDot * scaleA * scaleB;',
    ],
    solution: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,
    explanation: 'Fusing global scales after INT8 matmul avoids per-element float work during accumulation.',
  },
  {
    id: 'quantmatmul-per-channel',
    stepLabel: 'EIC.4',
    group: 'Per-channel scale',
    title: 'Per-Channel Dequantization',
    concept: 'Per-channel quantization stores a scale per row or column, applying scaleA[i] * scaleB[i] per product.',
    objective: 'Inside quantizedMatmulStep, when scales are arrays, sum a[i] * b[i] * scaleA[i] * scaleB[i].',
    difficulty: 'core',
    starterCode: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      // TODO: add a[i] * b[i] * scaleA[i] * scaleB[i] to scaled.
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('per-channel fuse', quantizedMatmulStep([10, 5], [2, 4], [0.1, 0.2], [0.5, 0.25]).scaled, 10 * 2 * 0.1 * 0.5 + 5 * 4 * 0.2 * 0.25);
check('uniform channel scales', quantizedMatmulStep([3, 1], [2, 8], [0.5, 0.5], [2, 2]).scaled, 14);
return results;`,
    hints: [
      'Each index carries its own scale pair.',
      'Accumulate scaled partial products in the array branch.',
      'scaled += a[i] * b[i] * scaleA[i] * scaleB[i];',
    ],
    solution: `/**
 * Runs one quantized dot-product step: validate shapes, INT8 accumulate, apply per-channel or global scales.
 * @param {number[]} a - Quantized INT8 vector A.
 * @param {number[]} b - Quantized INT8 vector B.
 * @param {number|number[]} scaleA - Global scale or per-channel scales for A.
 * @param {number|number[]} scaleB - Global scale or per-channel scales for B.
 * @returns {{ valid: boolean, intDot: number, scaled: number }} Validation flag and dot outputs.
 */
function quantizedMatmulStep(a, b, scaleA, scaleB) {
  if (a.length !== b.length) {
    return { valid: false, intDot: 0, scaled: 0 };
  }

  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }

  let scaled = 0;
  if (Array.isArray(scaleA) && Array.isArray(scaleB)) {
    for (let i = 0; i < a.length; i++) {
      scaled += a[i] * b[i] * scaleA[i] * scaleB[i];
    }
  } else {
    scaled = intDot * scaleA * scaleB;
  }

  return { valid: true, intDot, scaled };
}`,
    explanation: 'Per-channel scales recover accuracy when different weight channels need different dynamic ranges.',
  },
  {
    id: 'quantized-dot-scale',
    stepLabel: '13.1',
    group: 'Dequant fuse',
    title: 'Scale quantized dot product',
    concept: 'To speed up execution, hardware performs dot products in INT8 and then scales the output back to FLOAT using per-channel scale factors.',
    objective: 'Compute integer dot product of a and b, then scale the result by scaleA * scaleB.',
    difficulty: 'core',
    starterCode: `function quantizedDotScale(a, b, scaleA, scaleB) {
  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }
  // TODO: return intDot multiplied by the combined scales
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('scale quantized dot', quantizedDotScale([10, -5], [20, 30], 0.1, 0.05), 0.25);
return results;`,
    hints: [
      'Multiply intDot by scaleA.',
      'Then multiply by scaleB.',
      'return intDot * scaleA * scaleB;',
    ],
    solution: `function quantizedDotScale(a, b, scaleA, scaleB) {
  let intDot = 0;
  for (let i = 0; i < a.length; i++) {
    intDot += a[i] * b[i];
  }
  return intDot * scaleA * scaleB;
}`,
    explanation: 'Fusing scales after matrix operations reduces floating-point overhead.',
  },
  {
    id: 'bert-mlm-masking',
    stepLabel: '14.1',
    group: '80-10-10 masking rule',
    title: 'BERT MLM 80/10/10 Masking Rule',
    concept: 'BERT corrupts 15% of selected tokens using 80% [MASK], 10% random replacement, and 10% unchanged tokens.',
    objective: 'Inside bertMlmStep, apply the 80/10/10 rule on maskIndices using randVals and randTokens.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  // TODO: apply 80% mask token 103, 10% random token, 10% unchanged on maskIndices.

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const tokens = [10, 20, 30, 40, 50];
const logits = tokens.map(() => [0, 0]);
const out = bertMlmStep(tokens, tokens, [0, 1, 2], [0.5, 0.85, 0.95], [5, 99, 12], logits);
check('80-10-10 corruption', out.corrupted, [103, 99, 30, 40, 50]);
return results;`,
    hints: [
      'randVals[i] < 0.8 means replace with token 103.',
      'Between 0.8 and 0.9 use randTokens[i].',
      'Otherwise leave corrupted[idx] unchanged.',
    ],
    solution: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) {
      corrupted[idx] = 103;
    } else if (r < 0.9) {
      corrupted[idx] = randTokens[i];
    }
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,
    explanation: '80/10/10 corruption teaches BERT to recover tokens from masks while still seeing the original token sometimes at train time.',
  },
  {
    id: 'bert-bidirectional-mask',
    stepLabel: '14.2',
    group: 'Bidirectional attention mask',
    title: 'BERT Bidirectional Attention Mask',
    concept: 'BERT attends bidirectionally, but padding tokens (ID 0) must be blocked from both attending and being attended to.',
    objective: 'Inside bertMlmStep, set attnMask[i][j] = 1 only when neither token i nor j is padding.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  // TODO: fill attnMask[i][j] = 1 when tokens[i] !== 0 && tokens[j] !== 0.

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const logits = [[0, 0], [0, 0], [0, 0]];
const out = bertMlmStep([10, 20, 0], [0, 1, 0], [], [], [], logits);
check('padding blocked', out.attnMask, [[1, 1, 0], [1, 1, 0], [0, 0, 0]]);
return results;`,
    hints: [
      'Loop over every pair (i, j).',
      'Set mask entry to 1 only when both tokens are non-zero.',
    ],
    solution: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,
    explanation: 'Padding masks stop inactive positions from polluting bidirectional context.',
  },
  {
    id: 'bert-mlm-loss',
    stepLabel: '14.3',
    group: 'MLM cross-entropy loss',
    title: 'BERT MLM Cross-Entropy Loss',
    concept: 'MLM loss averages cross-entropy only at masked positions, ignoring uncorrupted tokens.',
    objective: 'Inside bertMlmStep, compute average cross-entropy loss over maskIndices.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  // TODO: average cross-entropy loss over maskIndices using stable softmax on logits[idx].

  return { corrupted, attnMask, loss, predictions };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const logits = [[2, 0], [0, 2], [1, 1]];
const out = bertMlmStep([1, 2, 3], [0, 1, 0], [0, 2], [0.1, 0.1], [9, 9], logits);
check('mlm loss average', out.loss, 0.410037);
return results;`,
    hints: [
      'For each masked index, softmax the logit row stably.',
      'Accumulate -log(prob[target]) and divide by maskIndices.length.',
    ],
    solution: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,
    explanation: 'Restricting loss to masked positions is what makes BERT learn to reconstruct context rather than copy visible tokens.',
  },
  {
    id: 'bert-mlm-forward',
    stepLabel: '14.4',
    group: 'BERT MLM step',
    title: 'Complete BERT MLM Forward Step',
    concept: 'A complete BERT MLM step returns corrupted inputs, bidirectional mask, masked loss, and argmax predictions from logits.',
    objective: 'Inside bertMlmStep, compute argmax predictions for every sequence position.',
    difficulty: 'challenge',
    starterCode: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = [];
  // TODO: for each logits row, push the argmax vocab index.

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual.predictions, expected.predictions) && approxEqual(actual.loss, expected.loss) });
}
const logits = [[2, 0], [0, 2], [1, 1]];
const out = bertMlmStep([10, 20, 0], [0, 1, 0], [0, 1], [0.1, 0.1], [9, 9], logits);
check('full bert step', out, { predictions: [0, 1, 0], loss: 0.126928 });
return results;`,
    hints: [
      'Scan each logit row for the maximum value index.',
      'Push that argmax index into predictions.',
    ],
    solution: `/**
 * Runs one BERT MLM training step: corrupt tokens, build mask, compute loss and predictions.
 * @param {number[]} tokens - Input token IDs.
 * @param {number[]} labels - Ground-truth label IDs.
 * @param {number[]} maskIndices - Positions selected for MLM corruption.
 * @param {number[]} randVals - Uniform values in [0,1) for 80/10/10 decisions.
 * @param {number[]} randTokens - Random vocab IDs for the 10% replacement branch.
 * @param {number[][]} logits - Vocabulary logits [seqLen, vocabSize].
 * @returns {{ corrupted: number[], attnMask: number[][], loss: number, predictions: number[] }} Step outputs.
 */
function bertMlmStep(tokens, labels, maskIndices, randVals, randTokens, logits) {
  const corrupted = [...tokens];
  for (let i = 0; i < maskIndices.length; i++) {
    const idx = maskIndices[i];
    const r = randVals[i];
    if (r < 0.8) corrupted[idx] = 103;
    else if (r < 0.9) corrupted[idx] = randTokens[i];
  }

  const seqLen = tokens.length;
  const attnMask = Array.from({ length: seqLen }, () => Array(seqLen).fill(0));
  for (let i = 0; i < seqLen; i++) {
    for (let j = 0; j < seqLen; j++) {
      if (tokens[i] !== 0 && tokens[j] !== 0) attnMask[i][j] = 1;
    }
  }

  const predictions = logits.map((row) => {
    let maxIdx = 0;
    for (let j = 1; j < row.length; j++) {
      if (row[j] > row[maxIdx]) maxIdx = j;
    }
    return maxIdx;
  });

  let loss = 0;
  if (maskIndices.length > 0) {
    for (let m = 0; m < maskIndices.length; m++) {
      const idx = maskIndices[m];
      const row = logits[idx];
      const target = labels[idx];
      const maxLogit = Math.max(...row);
      const exps = row.map((l) => Math.exp(l - maxLogit));
      const sumExp = exps.reduce((s, v) => s + v, 0);
      loss -= Math.log(exps[target] / sumExp);
    }
    loss /= maskIndices.length;
  }

  return { corrupted, attnMask, loss, predictions };
}`,
    explanation: 'Returning corruption, mask, loss, and predictions together mirrors one BERT MLM training forward pass.',
  },
  // --- moe ---
  {
    id: 'moe-softmax-gate',
    stepLabel: 'MoE.1',
    group: 'Softmax gate',
    title: 'Router Softmax Gate',
    concept: 'MoE routers convert raw expert logits into routing probabilities with a numerically stable softmax.',
    objective: 'Inside moeRouterStep, fill gateProbs with softmax(logits).',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  // TODO: push exps[i] / sumExp into gateProbs for each expert.

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  const passed = Array.isArray(actual) ? sameArray(actual, expected) : approxEqual(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const experts = [[1], [0], [0]];
check('softmax gate', moeRouterStep([0, 1, 0], 1, experts, []).gateProbs, [0.211942594, 0.576117915, 0.211942594]);
check('probabilities sum to one', moeRouterStep([2, 1, 3], 2, experts, []).gateProbs.reduce((s, v) => s + v, 0), 1);
return results;`,
    hints: [
      'Subtract maxLogit before exp for stability (already done in exps).',
      'Divide each exponential by sumExp.',
      'gateProbs.push(exps[i] / sumExp);',
    ],
    solution: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    explanation: 'Softmax gate probabilities determine which experts compete for each token.',
  },
  {
    id: 'moe-topk-pick',
    stepLabel: 'MoE.2',
    group: 'Top-k pick',
    title: 'Top-k Expert Selection',
    concept: 'MoE layers route each token to the k experts with the highest gate probabilities.',
    objective: 'Inside moeRouterStep, fill topExperts with the k highest gateProbs indices (tie-break lower index).',
    difficulty: 'core',
    starterCode: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const topExperts = [];
  // TODO: select k expert indices with highest gateProbs; break ties by lower index.

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const experts = [[0], [0], [0], [0]];
check('top-2 experts', moeRouterStep([0.2, 0.8, 0.1, 0.9], 2, experts, []).topExperts, [3, 1]);
check('top-1 expert', moeRouterStep([1, 3, 2], 1, [[1], [2], [3]], []).topExperts, [1]);
return results;`,
    hints: [
      'Pair each probability with its expert index, then sort descending.',
      'When probabilities tie, prefer the smaller expert index.',
      'Take the first k indices from the sorted list.',
    ],
    solution: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    explanation: 'Top-k routing keeps compute sparse while still allowing multiple experts per token.',
  },
  {
    id: 'moe-load-counts',
    stepLabel: 'MoE.3',
    group: 'Load per expert',
    title: 'Expert Load Counts',
    concept: 'Load-balancing monitors how many tokens each expert receives across a batch.',
    objective: 'Inside moeRouterStep, increment loadCounts[expertIdx] for every entry in batchAssignments.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  // TODO: for each expertIdx in batchAssignments, increment loadCounts[expertIdx].

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const experts = [[0], [0], [0], [0]];
check('batch load tally', moeRouterStep([0, 0, 0, 0], 1, experts, [3, 1, 3, 0]).loadCounts, [1, 1, 0, 2]);
check('empty batch', moeRouterStep([1, 2], 1, [[0], [0]], []).loadCounts, [0, 0]);
return results;`,
    hints: [
      'Each batchAssignments entry is one expert dispatch.',
      'Increment the counter at that expert index.',
      'loadCounts[expertIdx] += 1;',
    ],
    solution: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    explanation: 'Tracking per-expert load reveals imbalance that hurts throughput and triggers auxiliary losses.',
  },
  {
    id: 'moe-weighted-combine',
    stepLabel: 'MoE.4',
    group: 'Weighted combine',
    title: 'Weighted Expert Output',
    concept: 'MoE output is the weighted sum of selected expert transforms, using renormalized gate weights.',
    objective: 'Inside moeRouterStep, accumulate combined[d] += topWeights[i] * expertOutputs[topExperts[i]][d].',
    difficulty: 'core',
    starterCode: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) {
      // TODO: add weight * expertOutputs[expertIdx][d] into combined[d].
    }
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const experts = [[1, 0], [0, 1], [2, 2]];
check('weighted mix', moeRouterStep([1, 1, -10], 2, [[1, 0], [0, 1], [9, 9]], []).combined, [0.5, 0.5]);
check('single expert', moeRouterStep([5, 1], 1, [[3, 4], [10, 10]], []).combined, [3, 4]);
return results;`,
    hints: [
      'Loop over selected experts and output dimensions.',
      'Multiply each expert vector by its renormalized gate weight.',
      'combined[d] += weight * expertOutputs[expertIdx][d];',
    ],
    solution: `/**
 * Runs one MoE router step: softmax gate, top-k routing, load tally, weighted expert combine.
 * @param {number[]} logits - Raw router logits per expert.
 * @param {number} k - Number of experts to activate per token.
 * @param {number[][]} expertOutputs - Expert output vectors indexed by expert id.
 * @param {number[]} batchAssignments - Flat list of expert ids chosen across the batch (for load counts).
 * @returns {{ gateProbs: number[], topExperts: number[], topWeights: number[], loadCounts: number[], combined: number[] }}
 */
function moeRouterStep(logits, k, expertOutputs, batchAssignments) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExp = exps.reduce((s, v) => s + v, 0);
  const gateProbs = [];
  for (let i = 0; i < logits.length; i++) gateProbs.push(exps[i] / sumExp);

  const ranked = gateProbs.map((p, idx) => ({ idx, p }));
  ranked.sort((a, b) => b.p - a.p || a.idx - b.idx);
  const topExperts = ranked.slice(0, k).map((entry) => entry.idx);

  let weightSum = 0;
  const topWeights = topExperts.map((idx) => gateProbs[idx]);
  for (const w of topWeights) weightSum += w;
  for (let i = 0; i < topWeights.length; i++) topWeights[i] /= weightSum;

  const loadCounts = Array(logits.length).fill(0);
  for (const expertIdx of batchAssignments) loadCounts[expertIdx] += 1;

  const dim = expertOutputs[0].length;
  const combined = Array(dim).fill(0);
  for (let i = 0; i < topExperts.length; i++) {
    const expertIdx = topExperts[i];
    const weight = topWeights[i];
    for (let d = 0; d < dim; d++) combined[d] += weight * expertOutputs[expertIdx][d];
  }

  return { gateProbs, topExperts, topWeights, loadCounts, combined };
}`,
    explanation: 'Weighted combination merges specialist expert outputs back into the shared residual stream.',
  },
  {
    id: 'moe-topk-indices',
    stepLabel: '15.1',
    group: 'Top-k pick',
    title: 'MoE router top-k selection',
    concept: 'Mixture of Experts routes tokens to the top-k experts with the highest routing scores.',
    objective: 'Select indices of the top k routing values.',
    difficulty: 'core',
    starterCode: `function getTopKExperts(logits, k) {
  const indexed = logits.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => b.val - a.val);
  
  const topK = [];
  for (let i = 0; i < k; i++) {
    // TODO: push the index of the i-th best expert to topK array
    topK.push(0);
  }
  return topK;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('top-2 experts', getTopKExperts([0.2, 0.8, 0.1, 0.9], 2), [3, 1]); // indexes 3 and 1
return results;`,
    hints: [
      'The sorted elements are inside the indexed array.',
      'The index of the i-th element is indexed[i].idx.',
      'topK[i] = indexed[i].idx;',
    ],
    solution: `function getTopKExperts(logits, k) {
  const indexed = logits.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => b.val - a.val);
  
  const topK = [];
  for (let i = 0; i < k; i++) {
    topK.push(indexed[i].idx);
  }
  return topK;
}`,
    explanation: 'Routing tokens to only a subset of experts limits active parameters per token, enabling massive model capacity with low computational costs.',
  },
  {
    id: 'lora-scaling-factor',
    stepLabel: '16.1',
    group: 'Alpha scaling',
    title: 'LoRA scaling factor',
    concept: 'Low-Rank Adaptation (LoRA) scales low-rank updates by a factor of alpha / rank to maintain consistent learning scales when rank changes.',
    objective: 'Compute the scaling factor alpha divided by rank.',
    difficulty: 'warmup',
    starterCode: `function getLoraScale(alpha, rank) {
  // TODO: return the scaling factor
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale alpha 32 rank 8', getLoraScale(32, 8), 4);
check('scale alpha 16 rank 16', getLoraScale(16, 16), 1);
return results;`,
    hints: [
      'Divide alpha by rank.',
      'return alpha / rank;',
    ],
    solution: `function getLoraScale(alpha, rank) {
  return alpha / rank;
}`,
    explanation: 'Alpha scaling allows changing LoRA rank without needing to retune learning rate hyperparameters.',
  },
  {
    id: 'lora-forward-add',
    stepLabel: '16.2',
    group: 'Effective delta add',
    title: 'LoRA output update',
    concept: 'LoRA updates the forward pass output: y = W_base * x + (alpha / r) * B * (A * x).',
    objective: 'Incorporate the low-rank delta output into the baseline output vector.',
    difficulty: 'core',
    starterCode: `function addLoraDelta(yBase, loraDelta, scale) {
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    // TODO: add scale * loraDelta[i] to yBase[i]
    output.push(0);
  }
  return output;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('apply lora delta', addLoraDelta([2.0, 3.0], [0.5, -0.2], 4.0), [4.0, 2.2]);
return results;`,
    hints: [
      'Multiply scale by loraDelta[i] and add to yBase[i].',
      'Push the result to the output array.',
    ],
    solution: `function addLoraDelta(yBase, loraDelta, scale) {
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}`,
    explanation: 'Low-rank updates are computed in parallel to base weights and added at output, leaving baseline weights frozen.',
  },
  // --- native-sparse-attention ---
  {
    id: 'nsa-block-grid',
    stepLabel: 'NSA.1',
    group: 'Block grid',
    title: 'Sequence Block Grid',
    concept: 'Native Sparse Attention partitions the sequence into fixed-size blocks; the final block may be shorter.',
    objective: 'Inside sparseBlockMaskStep, fill blockRanges with half-open intervals [start, end) covering seqLen.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  // TODO: push [start, end) ranges that cover [0, seqLen) in steps of blockSize.

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [start, end] = blockRanges[blockId];
    for (let t = start; t < end; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('block ranges', sparseBlockMaskStep(10, 4, [0, 0, 0], 1).blockRanges, [[0, 4], [4, 8], [8, 10]]);
check('num blocks', sparseBlockMaskStep(10, 4, [0, 0, 0], 1).numBlocks, 3);
check('exact fit', sparseBlockMaskStep(8, 4, [0, 0], 1).blockRanges, [[0, 4], [4, 8]]);
return results;`,
    hints: [
      'Walk start from 0 while start < seqLen.',
      'Each end is min(start + blockSize, seqLen).',
      'Push [start, end) then set start = end.',
    ],
    solution: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    explanation: 'Block tiling is the first step in NSA: attention sparsity is defined over blocks, not individual token pairs upfront.',
  },
  {
    id: 'nsa-topk-blocks',
    stepLabel: 'NSA.2',
    group: 'Top-k blocks',
    title: 'Top-k Block Selection',
    concept: 'NSA scores each block (for example with compressed keys) and keeps only the top-k blocks for fine attention.',
    objective: 'Inside sparseBlockMaskStep, fill topBlocks with the k highest blockScores indices.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const topBlocks = [];
  // TODO: pick topK block indices with highest blockScores; break ties by lower index.

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('top blocks', sparseBlockMaskStep(16, 4, [0.1, 4.0, 2.0, 9.0], 2).topBlocks, [3, 1]);
check('clamp k', sparseBlockMaskStep(8, 4, [2, 5], 5).topBlocks, [1, 0]);
return results;`,
    hints: [
      'Pair each score with its block index and sort descending.',
      'Break equal scores by choosing the smaller block index.',
      'Slice the first topK entries and map to indices.',
    ],
    solution: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    explanation: 'Top-k block selection is where NSA trades full quadratic attention for a sparse key subset.',
  },
  {
    id: 'nsa-mask-scatter',
    stepLabel: 'NSA.3',
    group: 'Mask scatter',
    title: 'Scatter Attended Token Indices',
    concept: 'Selected blocks expand into the concrete key token indices that sparse attention is allowed to read.',
    objective: 'Inside sparseBlockMaskStep, append every token index from each selected block into attendedTokens.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    // TODO: push each token index from rangeStart (inclusive) to rangeEnd (exclusive).
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    testCode: `const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('expand blocks', sparseBlockMaskStep(15, 4, [0, 9, 0, 8], 2).attendedTokens, [4, 5, 6, 7, 12, 13, 14]);
check('single short block', sparseBlockMaskStep(5, 4, [1, 10], 1).attendedTokens, [4]);
return results;`,
    hints: [
      'Process selected blocks in ascending order for stable token lists.',
      'Each block range is half-open: include start, exclude end.',
      'attendedTokens.push(t) for t in [rangeStart, rangeEnd).',
    ],
    solution: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  const effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    explanation: 'Mask scatter turns block-level sparsity into the exact token columns attention may use.',
  },
  {
    id: 'nsa-effective-region',
    stepLabel: 'NSA.4',
    group: 'Effective attention region',
    title: 'Effective Attention Region',
    concept: 'The effective sparse region size is the number of attended key tokens times query positions (seqLen).',
    objective: 'Inside sparseBlockMaskStep, set effectiveRegion = attendedTokens.length * seqLen.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  let effectiveRegion = 0;
  // TODO: effectiveRegion = attendedTokens.length * seqLen

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sparse region', sparseBlockMaskStep(15, 4, [0, 9, 0, 8], 2).effectiveRegion, 7 * 15);
check('full block pick', sparseBlockMaskStep(8, 4, [10, 1], 1).effectiveRegion, 4 * 8);
check('beats dense pair count sanity', sparseBlockMaskStep(100, 10, [5, 9, 1, 2, 3, 4, 5, 6, 7, 8], 2).effectiveRegion < 100 * 100, true);
return results;`,
    hints: [
      'attendedTokens.length counts selected key tokens.',
      'Multiply by seqLen query positions for total allowed pairs.',
      'effectiveRegion = attendedTokens.length * seqLen;',
    ],
    solution: `/**
 * Runs one NSA block-selection step: tile sequence, pick top blocks, scatter attended tokens, count region.
 * @param {number} seqLen - Total sequence length.
 * @param {number} blockSize - Tokens per block (last block may be shorter).
 * @param {number[]} blockScores - Importance score per block.
 * @param {number} topK - Number of key blocks to keep.
 * @returns {{ numBlocks: number, blockRanges: number[][], topBlocks: number[], attendedTokens: number[], effectiveRegion: number }}
 */
function sparseBlockMaskStep(seqLen, blockSize, blockScores, topK) {
  const numBlocks = Math.ceil(seqLen / blockSize);
  const blockRanges = [];
  let start = 0;
  while (start < seqLen) {
    const end = Math.min(start + blockSize, seqLen);
    blockRanges.push([start, end]);
    start = end;
  }

  const ranked = blockScores.map((score, idx) => ({ idx, score }));
  ranked.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const topBlocks = ranked.slice(0, topK).map((entry) => entry.idx);

  const attendedTokens = [];
  const sortedBlocks = [...topBlocks].sort((a, b) => a - b);
  for (const blockId of sortedBlocks) {
    const [rangeStart, rangeEnd] = blockRanges[blockId];
    for (let t = rangeStart; t < rangeEnd; t++) attendedTokens.push(t);
  }

  let effectiveRegion = 0;
  effectiveRegion = attendedTokens.length * seqLen;

  return { numBlocks, blockRanges, topBlocks, attendedTokens, effectiveRegion };
}`,
    explanation: 'Effective region size shows how much less work sparse block attention does versus dense seqLen squared.',
  },
  {
    id: 'sparse-block-attention-check',
    stepLabel: '18.1',
    group: 'Block grid',
    title: 'Sparse block check',
    concept: 'Native Sparse Attention restricts queries to attend only to selected key blocks, saving massive quadratic compute.',
    objective: 'Return true if activeBlocks array contains kBlock index, otherwise false.',
    difficulty: 'warmup',
    starterCode: `function isBlockAttended(kBlock, activeBlocks) {
  // TODO: return whether kBlock is inside activeBlocks array
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('block active', isBlockAttended(2, [0, 2, 5]), true);
check('block inactive', isBlockAttended(3, [0, 2, 5]), false);
return results;`,
    hints: [
      'Use the .includes() method on arrays.',
      'return activeBlocks.includes(kBlock);',
    ],
    solution: `function isBlockAttended(kBlock, activeBlocks) {
  return activeBlocks.includes(kBlock);
}`,
    explanation: 'Hashing or routing queries to specific key blocks creates a sparse attention pattern that handles long context lengths.',
  },
];

