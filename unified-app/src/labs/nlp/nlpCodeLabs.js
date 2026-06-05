export const NLP_CODE_LABS = [
  // --- WORD2VEC ---
  {
    id: 'word2vec-dot-product',
    stepLabel: '1.1',
    group: 'Context-target pair',
    title: 'Vector dot product',
    concept: 'Word2Vec calculates the similarity between center and context words using dot products of their vector representations.',
    objective: 'Multiply elements of vector a and vector b at index i and accumulate them in sum.',
    difficulty: 'warmup',
    starterCode: `function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    // TODO: multiply elements of a and b at index i and add to sum
    sum += 0;
  }
  return sum;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('dot product 2D', dot([1, 2], [3, 4]), 11);
check('dot product zeros', dot([0, 0], [1, 2]), 0);
check('dot product negative', dot([1, -1], [2, 3]), -1);
return results;`,
    hints: [
      'Multiply a[i] by b[i].',
      'Add the product to the running sum variable.',
      'sum += a[i] * b[i];',
    ],
    solution: `function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}`,
    explanation: 'Dot product measures vector similarity, which is positive for aligned vectors and negative for opposite vectors.',
  },
  {
    id: 'word2vec-sigmoid',
    stepLabel: '1.2',
    group: 'Context-target pair',
    title: 'Sigmoid activation',
    concept: 'Word2Vec maps dot products to probabilities using the sigmoid function: 1 / (1 + e^-x).',
    objective: 'Implement the math for the sigmoid activation function.',
    difficulty: 'warmup',
    starterCode: `function sigmoid(x) {
  // TODO: return the sigmoid probability of x
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('sigmoid zero', sigmoid(0), 0.5);
check('sigmoid positive', sigmoid(2), 0.880797);
check('sigmoid negative', sigmoid(-2), 0.119202);
return results;`,
    hints: [
      'Use Math.exp(-x) in the denominator.',
      'The formula is 1 / (1 + Math.exp(-x)).',
    ],
    solution: `function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}`,
    explanation: 'The sigmoid function converts raw dot products into bounded probabilities between 0 and 1.',
  },
  {
    id: 'word2vec-positive-loss',
    stepLabel: '1.3',
    group: 'Negative sampling',
    title: 'Positive pair loss',
    concept: 'Negative sampling loss tries to maximize the probability of true context words, represented by -log(sigmoid(dot(vCenter, vContext))).',
    objective: 'Compute the negative log-probability of the positive center-context pair.',
    difficulty: 'core',
    starterCode: `function positiveLoss(vCenter, vContext) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const score = dot(vCenter, vContext);
  const prob = sigmoid(score);
  // TODO: compute the negative log-probability of prob
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('loss score 0', positiveLoss([1, 0], [0, 1]), 0.693147);
check('loss positive score', positiveLoss([1, 2], [1, 2]), 0.006715);
return results;`,
    hints: [
      'Use Math.log(prob).',
      'Multiply by -1 to get the negative log.',
      'return -Math.log(prob);',
    ],
    solution: `function positiveLoss(vCenter, vContext) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const score = dot(vCenter, vContext);
  const prob = sigmoid(score);
  return -Math.log(prob);
}`,
    explanation: 'Maximizing probability is mathematically equivalent to minimizing the negative log-probability.',
  },
  {
    id: 'word2vec-negative-loss',
    stepLabel: '1.4',
    group: 'Negative sampling',
    title: 'Negative samples loss sum',
    concept: 'Word2Vec negative sampling draws noise words and minimizes their likelihood of appearing in the context by adding -log(sigmoid(-dot(vCenter, vNeg))) to the loss.',
    objective: 'Compute and sum the negative log-probability of negative noise pairs.',
    difficulty: 'core',
    starterCode: `function negativeLossSum(vCenter, vNegatives) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  let loss = 0;
  for (let i = 0; i < vNegatives.length; i++) {
    const score = dot(vCenter, vNegatives[i]);
    // TODO: compute negative log of sigmoid(-score) and add to loss
    loss += 0;
  }
  return loss;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('neg loss orthogonal', negativeLossSum([1, 0], [[0, 1], [0, -1]]), 1.386294);
check('neg loss aligned', negativeLossSum([1, 1], [[1, 1]]), 2.126928);
return results;`,
    hints: [
      'Call sigmoid(-score).',
      'Compute its natural log with Math.log.',
      'Subtract that value from loss (or add the negative of it).',
      'loss -= Math.log(sigmoid(-score));',
    ],
    solution: `function negativeLossSum(vCenter, vNegatives) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  let loss = 0;
  for (let i = 0; i < vNegatives.length; i++) {
    const score = dot(vCenter, vNegatives[i]);
    loss -= Math.log(sigmoid(-score));
  }
  return loss;
}`,
    explanation: 'Negative sampling pushes the representations of the center word and negative words apart by minimizing their dot products.',
  },
  {
    id: 'word2vec-full-loss',
    stepLabel: '1.5',
    group: 'Negative sampling',
    title: 'Word2Vec negative sampling loss',
    concept: 'The total negative sampling loss is the sum of the positive pair loss and negative sample losses.',
    objective: 'Implement the full negative sampling loss calculation.',
    difficulty: 'challenge',
    starterCode: `function word2vecLoss(vCenter, vContext, vNegatives) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const posScore = dot(vCenter, vContext);
  const posLoss = -Math.log(sigmoid(posScore));
  
  let negLoss = 0;
  for (let i = 0; i < vNegatives.length; i++) {
    const negScore = dot(vCenter, vNegatives[i]);
    // TODO: accumulate negLoss with negative log sigmoid of negative score
    negLoss += 0;
  }
  
  return posLoss + negLoss;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('full loss orthogonal', word2vecLoss([1, 0], [0, 1], [[0, 1]]), 1.386294);
check('full loss distinct', word2vecLoss([1, 0], [1, 0], [[0, 1], [0, -1]]), 1.699566);
return results;`,
    hints: [
      'Negative score dot product is negScore.',
      'Add -Math.log(sigmoid(-negScore)) to negLoss.',
      'negLoss -= Math.log(sigmoid(-negScore));',
    ],
    solution: `function word2vecLoss(vCenter, vContext, vNegatives) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const posScore = dot(vCenter, vContext);
  const posLoss = -Math.log(sigmoid(posScore));
  
  let negLoss = 0;
  for (let i = 0; i < vNegatives.length; i++) {
    const negScore = dot(vCenter, vNegatives[i]);
    negLoss -= Math.log(sigmoid(-negScore));
  }
  
  return posLoss + negLoss;
}`,
    explanation: 'The full skip-gram with negative sampling loss evaluates how well the center word predicts the true target and avoids noise words.',
  },

  // --- GLOVE ---
  {
    id: 'glove-weight',
    stepLabel: '2.1',
    group: 'Co-occurrence weight',
    title: 'GloVe weight function',
    concept: 'GloVe uses a weighting function f(x) = (x/xMax)^alpha if x < xMax, else 1, to prevent rare or frequent co-occurrences from dominating.',
    objective: 'Implement the GloVe co-occurrence weighting function.',
    difficulty: 'warmup',
    starterCode: `function gloveWeight(x, xMax = 100, alpha = 0.75) {
  if (x === 0) return 0;
  // TODO: return the correct weight based on xMax and alpha bounds
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('x is 0', gloveWeight(0), 0);
check('x above xMax', gloveWeight(120, 100, 0.75), 1.0);
check('x below xMax', gloveWeight(50, 100, 0.75), 0.594603);
return results;`,
    hints: [
      'If x is greater than or equal to xMax, return 1.',
      'Otherwise, compute Math.pow(x / xMax, alpha).',
    ],
    solution: `function gloveWeight(x, xMax = 100, alpha = 0.75) {
  if (x === 0) return 0;
  return x >= xMax ? 1 : Math.pow(x / xMax, alpha);
}`,
    explanation: 'The weighting function scales the objective so that very frequent pairs like "the-and" do not bias the word vector updates.',
  },
  {
    id: 'glove-prediction',
    stepLabel: '2.2',
    group: 'Dot-plus-bias prediction',
    title: 'GloVe dot plus bias prediction',
    concept: 'GloVe fits the dot product of two word vectors plus their respective biases to the log of their co-occurrence count.',
    objective: 'Calculate the predicted log co-occurrence using vector dot products and bias terms.',
    difficulty: 'warmup',
    starterCode: `function glovePredict(wi, wj, biasI, biasJ) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  // TODO: return dot product of wi and wj plus biasI and biasJ
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('prediction basic', glovePredict([1, 2], [3, 4], 0.5, 0.2), 11.7);
check('prediction zero vectors', glovePredict([0, 0], [0, 0], -1, 2), 1);
return results;`,
    hints: [
      'Call dot(wi, wj).',
      'Add biasI and biasJ to that dot product.',
    ],
    solution: `function glovePredict(wi, wj, biasI, biasJ) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  return dot(wi, wj) + biasI + biasJ;
}`,
    explanation: 'Bias terms capture the baseline frequency of words i and j independently of their co-occurrence.',
  },
  {
    id: 'glove-loss-term',
    stepLabel: '2.3',
    group: 'Full scalar loss',
    title: 'GloVe single pair loss',
    concept: 'The loss for a word pair (i, j) is the weighted squared difference between prediction and log(x_ij).',
    objective: 'Combine the weight function, prediction, and log co-occurrences to compute single-pair loss.',
    difficulty: 'challenge',
    starterCode: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  const pred = dot(wi, wj) + biasI + biasJ;
  // TODO: compute squared error (pred - ln(xij))^2 and multiply by weight
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) {
  return Math.abs(a - b) <= tolerance;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const wi = [0.5, -0.2];
const wj = [0.8, 0.4];
check('pair loss xij=10', glovePairLoss(wi, wj, 0.1, 0.2, 10, 100, 0.75), 0.503447);
check('pair loss xij=120', glovePairLoss(wi, wj, 0.1, 0.2, 120, 100, 0.75), 17.367987);
return results;`,
    hints: [
      'Compute the log co-occurrence using Math.log(xij).',
      'The difference is pred - Math.log(xij).',
      'Return weight * diff * diff.',
    ],
    solution: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
  
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  const pred = dot(wi, wj) + biasI + biasJ;
  const diff = pred - Math.log(xij);
  return weight * diff * diff;
}`,
    explanation: 'GloVe is a global log-bilinear matrix factorization model that scales quadratic loss with a custom weighting function.',
  },

  // --- FASTTEXT ---
  {
    id: 'fasttext-ngrams',
    stepLabel: '3.1',
    group: 'Character n-gram enumerate',
    title: 'Character n-grams extraction',
    concept: 'FastText represents words by splitting them into overlapping character n-grams bounded by "<" and ">".',
    objective: 'Generate all character n-grams of size n for a decorated word.',
    difficulty: 'core',
    starterCode: `function getCharacterNGrams(word, n = 3) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  
  // TODO: loop through decorated string and slice substrings of length n
  for (let i = 0; i <= decorated.length - n; i++) {
    const ngram = '';
    ngrams.push(ngram);
  }
  
  return ngrams;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: sameArray(actual, expected) });
}
check('apple n=3', getCharacterNGrams('apple', 3), ['<ap', 'app', 'ppl', 'ple', 'le>']);
check('cat n=3', getCharacterNGrams('cat', 3), ['<ca', 'cat', 'at>']);
return results;`,
    hints: [
      'Use decorated.substring(i, i + n) or decorated.slice(i, i + n).',
      'Assign it to the ngram variable.',
    ],
    solution: `function getCharacterNGrams(word, n = 3) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  
  for (let i = 0; i <= decorated.length - n; i++) {
    const ngram = decorated.slice(i, i + n);
    ngrams.push(ngram);
  }
  
  return ngrams;
}`,
    explanation: 'Including n-grams allows FastText to generalize to unseen, out-of-vocabulary words using common subword roots.',
  },
  {
    id: 'fasttext-hash',
    stepLabel: '3.2',
    group: 'Hash bucket',
    title: 'N-gram hashing',
    concept: 'Since there are millions of possible n-grams, FastText hashes them to a fixed number of buckets (e.g. 2,000,000) using a string hash algorithm.',
    objective: 'Compute a polynomial rolling hash modulo numBuckets for a subword n-gram.',
    difficulty: 'core',
    starterCode: `function fasttextHash(ngram, numBuckets) {
  let hash = 5381;
  for (let i = 0; i < ngram.length; i++) {
    // TODO: update hash using: (hash * 33) + character code of current character
    hash = 0;
  }
  return (hash >>> 0) % numBuckets;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('hash test', fasttextHash('app', 1000), 438);
check('hash check another', fasttextHash('ple', 1000), 630);
return results;`,
    hints: [
      'Get char code using ngram.charCodeAt(i).',
      'The formula is hash = (hash * 33) + ngram.charCodeAt(i).',
      'Make sure to do standard JS arithmetic or bitwise ops inside.',
    ],
    solution: `function fasttextHash(ngram, numBuckets) {
  let hash = 5381;
  for (let i = 0; i < ngram.length; i++) {
    hash = (hash * 33) + ngram.charCodeAt(i);
  }
  return (hash >>> 0) % numBuckets;
}`,
    explanation: 'Hashing avoids the need to store a separate dictionary for millions of rare n-grams, saving massive amounts of memory.',
  },
  {
    id: 'fasttext-sum-vectors',
    stepLabel: '3.3',
    group: 'Subword vector sum',
    title: 'Assemble subword embeddings',
    concept: 'A FastText word vector is the sum of its n-gram embeddings.',
    objective: 'Look up subword vector indices via hashing, and add their coordinates to the sum.',
    difficulty: 'challenge',
    starterCode: `function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  const sum = Array(vectorDim).fill(0);
  
  function fasttextHash(ngram, numBuckets) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % numBuckets;
  }

  for (let i = 0; i < ngrams.length; i++) {
    const bucketIdx = fasttextHash(ngrams[i], numBuckets);
    const vec = buckets[bucketIdx];
    
    for (let d = 0; d < vectorDim; d++) {
      // TODO: add vector coordinate vec[d] to sum[d]
      sum[d] += 0;
    }
  }
  
  return sum;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: sameArray(actual, expected) });
}
const buckets = [
  [0.1, 0.2],
  [0.3, 0.4],
  [0.5, 0.6],
  [0.7, 0.8]
];
// ngrams 'app' (hash 200 % 4 = 0) and 'ple' (hash 874 % 4 = 2)
// sums: buckets[0] + buckets[2] = [0.1+0.5, 0.2+0.6] = [0.6, 0.8]
check('sum 2 ngrams', sumSubwordVectors(['app', 'ple'], buckets, 4, 2), [1.0, 1.2]);
return results;`,
    hints: [
      'The coordinate from the subword bucket is vec[d].',
      'Add it directly to sum[d].',
      'sum[d] += vec[d];',
    ],
    solution: `function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  const sum = Array(vectorDim).fill(0);
  
  function fasttextHash(ngram, numBuckets) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % numBuckets;
  }

  for (let i = 0; i < ngrams.length; i++) {
    const bucketIdx = fasttextHash(ngrams[i], numBuckets);
    const vec = buckets[bucketIdx];
    
    for (let d = 0; d < vectorDim; d++) {
      sum[d] += vec[d];
    }
  }
  
  return sum;
}`,
    explanation: 'Summing n-grams preserves shared morphological patterns, so words like "learning" and "learnable" share subword vector paths.',
  }
];
