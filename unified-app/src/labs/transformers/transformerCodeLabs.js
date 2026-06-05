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
    id: 'kv-cache-append',
    stepLabel: '8.1',
    group: 'Slice write index',
    title: 'KV Cache append',
    concept: 'To avoid recalculating representations for past tokens, models maintain a KV Cache containing Key and Value vectors for all past positions.',
    objective: 'Append the new key vector to the keyCache array and the new value vector to the valueCache array.',
    difficulty: 'warmup',
    starterCode: `function appendKVCache(keyCache, valueCache, newK, newV) {
  // TODO: append newK to keyCache, and newV to valueCache
  
  return [keyCache.length, valueCache.length];
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const kC = [[1]];
const vC = [[2]];
check('append to cache', appendKVCache(kC, vC, [3], [4]), [2, 2]);
return results;`,
    hints: [
      'Use the .push() method on arrays.',
      'Push newK to keyCache, and newV to valueCache.',
    ],
    solution: `function appendKVCache(keyCache, valueCache, newK, newV) {
  keyCache.push(newK);
  valueCache.push(newV);
  return [keyCache.length, valueCache.length];
}`,
    explanation: 'Saving K and V vectors saves computation, reducing incremental decoding costs from O(N^2) to O(N).',
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
    id: 'bert-mask-replace',
    stepLabel: '14.1',
    group: 'Mask token replace',
    title: 'BERT MLM token masking',
    concept: 'BERT training replaces a subset of tokens with the special [MASK] token (index 103) so the model learns bidirectional context.',
    objective: 'Return a copy of the tokens array with the token at maskIdx replaced by 103.',
    difficulty: 'warmup',
    starterCode: `function applyBertMask(tokens, maskIdx) {
  const result = [...tokens];
  // TODO: replace token at maskIdx with 103
  
  return result;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('mask index 2', applyBertMask([10, 20, 30, 40], 2), [10, 20, 103, 40]);
return results;`,
    hints: [
      'Use result[maskIdx] = 103.',
    ],
    solution: `function applyBertMask(tokens, maskIdx) {
  const result = [...tokens];
  result[maskIdx] = 103;
  return result;
}`,
    explanation: 'Masking tokens forces BERT to use surrounding tokens on both sides to predict the hidden words.',
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

