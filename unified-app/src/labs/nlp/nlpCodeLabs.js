export const NLP_CODE_LABS = [
  // --- WORD2VEC ---
  {
    id: 'word2vec-dot-similarity',
    stepLabel: '1.1',
    group: 'Similarity score',
    title: 'Vector Similarity Score',
    concept: 'Word2Vec represents words as dense vectors. The similarity between a target center word and a context word is measured using the dot product of their embedding vectors.',
    objective: 'Implement the vector dot product of two arrays, returning the scalar sum.',
    difficulty: 'warmup',
    starterCode: `/**
 * Computes the dot product of two word vectors.
 * @param {number[]} a - First vector.
 * @param {number[]} b - Second vector.
 * @returns {number} The scalar dot product.
 */
function dot(a, b) {
  // TODO: Calculate dot product of a and b
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('dot product 2D', dot([1, 2], [3, 4]), 11);
check('dot product zeros', dot([0, 0], [1, 2]), 0);
check('dot product negative', dot([1, -1], [2, 3]), -1);
check('higher dimensional dot', dot([0.5, -1.0, 2.0], [2.0, 4.0, 1.5]), 0);
check('empty vectors fallback', dot([], []), 0);
return results;`,
    hints: [
      'Iterate from 0 to a.length.',
      'Multiply a[i] by b[i] and accumulate in a running sum variable.',
    ],
    solution: `/**
 * Computes the dot product of two word vectors.
 * @param {number[]} a - First vector.
 * @param {number[]} b - Second vector.
 * @returns {number} The scalar dot product.
 */
function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}`,
    explanation: 'A larger dot product indicates that two vectors are aligned in space, representing high semantic similarity.',
  },
  {
    id: 'word2vec-sigmoid-prob',
    stepLabel: '1.2',
    group: 'Sigmoid activation',
    title: 'Word2Vec Sigmoid Probabilities',
    concept: 'Word2Vec uses the sigmoid function to map raw similarity dot products to probability scores in [0, 1]: P(positive) = sigmoid(vContext . vCenter) and P(negative) = sigmoid(-vNeg . vCenter).',
    objective: 'Compute the sigmoid activation function.',
    difficulty: 'warmup',
    starterCode: `/**
 * Computes the sigmoid activation function: 1 / (1 + exp(-x)).
 * @param {number} x - Input scalar.
 * @returns {number} Activated probability in (0, 1).
 */
function sigmoid(x) {
  // TODO: Compute sigmoid of x
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('sigmoid zero', sigmoid(0), 0.5);
check('sigmoid positive score', sigmoid(2.0), 0.880797);
check('sigmoid negative score', sigmoid(-2.0), 0.119202);
check('sigmoid large positive', sigmoid(10.0), 0.999954);
check('sigmoid large negative', sigmoid(-10.0), 0.000045);
return results;`,
    hints: [
      'Use Math.exp(-x) to calculate e^(-x).',
      'The formula is: 1 / (1 + Math.exp(-x)).',
    ],
    solution: `/**
 * Computes the sigmoid activation function: 1 / (1 + exp(-x)).
 * @param {number} x - Input scalar.
 * @returns {number} Activated probability in (0, 1).
 */
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}`,
    explanation: 'The sigmoid function squashes any real value into a probability, allowing gradient descent to adjust embedding directions.',
  },
  {
    id: 'word2vec-loss',
    stepLabel: '1.3',
    group: 'Positive pair likelihood',
    title: 'Word2Vec Negative Sampling Loss',
    concept: 'The negative sampling loss minimizes the negative log-probability of the true context word and negative samples: Loss = -log(sigmoid(vCenter . vContext)) - sum(log(sigmoid(-vCenter . vNeg))).',
    objective: 'Implement the total loss computation given center, context, and negative vectors.',
    difficulty: 'core',
    starterCode: `/**
 * Computes the total negative sampling loss for a context-target pair and negative noise samples.
 * @param {number[]} vCenter - Center word vector.
 * @param {number[]} vContext - True context word vector.
 * @param {number[][]} vNegatives - Array of negative noise word vectors.
 * @returns {number} The total loss scalar.
 */
function word2vecLoss(vCenter, vContext, vNegatives) {
  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  // TODO: Compute and return the total negative sampling loss
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-5) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('loss orthogonal standard', word2vecLoss([1, 0], [0, 1], [[0, 1]]), 1.386294);
check('loss aligned positive', word2vecLoss([1, 0], [1, 0], [[0, 1], [0, -1]]), 1.699566);
check('loss opposite context', word2vecLoss([1, 0], [-1, 0], [[0, 1]]), 2.006409);
check('multiple negatives', word2vecLoss([0.5, 0.5], [0.5, 0.5], [[-0.5, -0.5], [0.0, 1.0]]), 1.922231);
check('zero vector check', word2vecLoss([0, 0], [0, 0], [[0, 0]]), 1.386294);
return results;`,
    hints: [
      'Calculate positive dot product and its sigmoid. Compute positive loss: -Math.log(sigmoid(posDot)).',
      'Loop over negative vectors. For each, calculate negative dot product, its sigmoid using -negDot, and subtract Math.log(sigmoid(-negDot)) from loss.',
      'Return the sum of positive and negative losses.',
    ],
    solution: `/**
 * Computes the total negative sampling loss for a context-target pair and negative noise samples.
 * @param {number[]} vCenter - Center word vector.
 * @param {number[]} vContext - True context word vector.
 * @param {number[][]} vNegatives - Array of negative noise word vectors.
 * @returns {number} The total loss scalar.
 */
function word2vecLoss(vCenter, vContext, vNegatives) {
  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const posScore = dot(vCenter, vContext);
  let loss = -Math.log(sigmoid(posScore));
  
  for (let i = 0; i < vNegatives.length; i++) {
    const negScore = dot(vCenter, vNegatives[i]);
    loss -= Math.log(sigmoid(-negScore));
  }
  
  return loss;
}`,
    explanation: 'Minimizing this loss maximizes target-context alignment and pushes unrelated words apart in vector space.',
  },
  {
    id: 'word2vec-gradients',
    stepLabel: '1.4',
    group: 'Negative sample loss',
    title: 'Word2Vec Parameter Gradients',
    concept: 'To update embeddings, we calculate parameter gradients. Grad(vContext) = (sigmoid(vContext . vCenter) - 1) * vCenter. Grad(vNeg_i) = sigmoid(vNeg_i . vCenter) * vCenter. Grad(vCenter) = (sigmoid(vContext . vCenter) - 1) * vContext + sum(sigmoid(vNeg_i . vCenter) * vNeg_i).',
    objective: 'Compute the gradients for the center, context, and negative vectors.',
    difficulty: 'core',
    starterCode: `/**
 * Calculates gradients of the negative sampling loss for all input vectors.
 * @param {number[]} vCenter - Center word vector.
 * @param {number[]} vContext - True context word vector.
 * @param {number[][]} vNegatives - Array of negative noise word vectors.
 * @returns {{ gradCenter: number[], gradContext: number[], gradNegatives: number[][] }} The gradients.
 */
function getGradients(vCenter, vContext, vNegatives) {
  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const d = vCenter.length;
  const gradCenter = Array(d).fill(0);
  const gradContext = Array(d).fill(0);
  const gradNegatives = vNegatives.map(() => Array(d).fill(0));
  
  // TODO: Compute the gradients and return them in the structure.
  return { gradCenter, gradContext, gradNegatives };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-4) { return Math.abs(a - b) <= tolerance; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const grads = getGradients([1, 0], [0, 1], [[0, 1]]);
check('center gradient', grads.gradCenter, [0.0, 0.0]);
check('context gradient', grads.gradContext, [-0.5, 0.0]);
check('negative gradient 0', grads.gradNegatives[0], [0.5, 0.0]);
return results;`,
    hints: [
      'Calculate posSig = sigmoid(dot(vCenter, vContext)).',
      'For each context vector dimension, gradContext[i] = (posSig - 1) * vCenter[i].',
      'For each negative vector, calculate negSig = sigmoid(dot(vCenter, vNeg)). For each dimension, gradNeg[j][i] = negSig * vCenter[i].',
      'Finally, for each dimension, gradCenter[i] = (posSig - 1) * vContext[i] + sum(negSig * vNeg_j[i]).',
    ],
    solution: `/**
 * Calculates gradients of the negative sampling loss for all input vectors.
 * @param {number[]} vCenter - Center word vector.
 * @param {number[]} vContext - True context word vector.
 * @param {number[][]} vNegatives - Array of negative noise word vectors.
 * @returns {{ gradCenter: number[], gradContext: number[], gradNegatives: number[][] }} The gradients.
 */
function getGradients(vCenter, vContext, vNegatives) {
  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const d = vCenter.length;
  const gradCenter = Array(d).fill(0);
  const gradContext = Array(d).fill(0);
  const gradNegatives = vNegatives.map(() => Array(d).fill(0));
  
  const posSig = sigmoid(dot(vCenter, vContext));
  for (let i = 0; i < d; i++) {
    gradContext[i] = (posSig - 1) * vCenter[i];
  }
  
  for (let j = 0; j < vNegatives.length; j++) {
    const negSig = sigmoid(dot(vCenter, vNegatives[j]));
    for (let i = 0; i < d; i++) {
      gradNegatives[j][i] = negSig * vCenter[i];
    }
  }
  
  for (let i = 0; i < d; i++) {
    let sumNegGrad = 0;
    for (let j = 0; j < vNegatives.length; j++) {
      const negSig = sigmoid(dot(vCenter, vNegatives[j]));
      sumNegGrad += negSig * vNegatives[j][i];
    }
    gradCenter[i] = (posSig - 1) * vContext[i] + sumNegGrad;
  }
  
  return { gradCenter, gradContext, gradNegatives };
}`,
    explanation: 'Parameter gradients reflect direction of steepest error increase. Backpropagating these values lets the optimizer improve word embeddings.',
  },
  {
    id: 'word2vec-gradient-update',
    stepLabel: '1.5',
    group: 'Skip-gram gradient update',
    title: 'Word2Vec Parameter Gradient Update',
    concept: 'With loss gradients computed, we perform stochastic gradient descent updates in the opposite direction of the gradients: Vector = Vector - learningRate * Gradient.',
    objective: 'Apply the parameter update steps in-place on the center, context, and negative vectors.',
    difficulty: 'challenge',
    starterCode: `/**
 * Updates embedding vectors using computed gradients and a learning rate.
 * @param {number[]} vCenter - Center word vector to update in-place.
 * @param {number[]} vContext - Context word vector to update in-place.
 * @param {number[][]} vNegatives - Array of negative word vectors to update in-place.
 * @param {number} lr - Learning rate.
 */
function updateWord2Vec(vCenter, vContext, vNegatives, lr) {
  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  // TODO: Compute gradients and subtract (lr * gradient) in-place from each vector.
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-4) { return Math.abs(a - b) <= tolerance; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const vc = [1.0, 0.0];
const vx = [0.0, 1.0];
const vn = [[0.0, 1.0]];
updateWord2Vec(vc, vx, vn, 0.1);
check('vc update', vc, [1.0, 0.0]);
check('vx update', vx, [0.05, 1.0]);
check('vn update', vn[0], [-0.05, 1.0]);
return results;`,
    hints: [
      'Call the helper logic to compute gradients: gradCenter, gradContext, gradNegatives.',
      'Subtract (lr * gradCenter[i]) from vCenter[i] for all dimensions.',
      'Subtract (lr * gradContext[i]) from vContext[i] for all dimensions.',
      'Subtract (lr * gradNegatives[j][i]) from vNegatives[j][i] for all negatives and dimensions.',
    ],
    solution: `/**
 * Updates embedding vectors using computed gradients and a learning rate.
 * @param {number[]} vCenter - Center word vector to update in-place.
 * @param {number[]} vContext - Context word vector to update in-place.
 * @param {number[][]} vNegatives - Array of negative word vectors to update in-place.
 * @param {number} lr - Learning rate.
 */
function updateWord2Vec(vCenter, vContext, vNegatives, lr) {
  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  const d = vCenter.length;
  const posSig = sigmoid(dot(vCenter, vContext));
  const gradContext = Array(d).fill(0);
  const gradCenter = Array(d).fill(0);
  const gradNegatives = vNegatives.map(() => Array(d).fill(0));
  
  for (let i = 0; i < d; i++) {
    gradContext[i] = (posSig - 1) * vCenter[i];
  }
  
  for (let j = 0; j < vNegatives.length; j++) {
    const negSig = sigmoid(dot(vCenter, vNegatives[j]));
    for (let i = 0; i < d; i++) {
      gradNegatives[j][i] = negSig * vCenter[i];
    }
  }
  
  for (let i = 0; i < d; i++) {
    let sumNegGrad = 0;
    for (let j = 0; j < vNegatives.length; j++) {
      const negSig = sigmoid(dot(vCenter, vNegatives[j]));
      sumNegGrad += negSig * vNegatives[j][i];
    }
    gradCenter[i] = (posSig - 1) * vContext[i] + sumNegGrad;
  }
  
  for (let i = 0; i < d; i++) {
    vCenter[i] -= lr * gradCenter[i];
    vContext[i] -= lr * gradContext[i];
  }
  
  for (let j = 0; j < vNegatives.length; j++) {
    for (let i = 0; i < d; i++) {
      vNegatives[j][i] -= lr * gradNegatives[j][i];
    }
  }
}`,
    explanation: 'Updating vectors incrementally using gradient updates completes one training step of the Skip-gram negative sampling model.',
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
