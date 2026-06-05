export const NLP_CODE_LABS = [
  // --- WORD2VEC ---
  {
    id: 'word2vec-dot-similarity',
    stepLabel: '1.1',
    group: 'Similarity score',
    title: 'Vector Similarity Score',
    concept: 'Skip-gram negative sampling compares center and context embeddings with a dot product. That score drives both the positive likelihood and every negative sample term.',
    objective: 'Inside skipGramTrainStep, compute the positive dot product posScore between vCenter and vContext.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    // TODO: accumulate vCenter[i] * vContext[i] into posScore.
    posScore += 0;
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('orthogonal vectors', skipGramTrainStep([1, 0], [0, 1], [[0, 1]], 0.1).posScore, 0);
check('aligned vectors', skipGramTrainStep([2, 3], [4, 5], [], 0.1).posScore, 23);
check('negative dot', skipGramTrainStep([1, -1], [2, 3], [], 0.1).posScore, -1);
return results;`,
    hints: [
      'Multiply matching indices and accumulate into posScore.',
      'Use posScore += vCenter[i] * vContext[i].',
      'The dot product is the sum of element-wise products.',
    ],
    solution: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,
    explanation: 'The positive dot product measures how aligned the center and context embeddings already are before the gradient update.',
  },
  {
    id: 'word2vec-sigmoid-prob',
    stepLabel: '1.2',
    group: 'Sigmoid activation',
    title: 'Word2Vec Sigmoid Probabilities',
    concept: 'Word2Vec maps dot products to probabilities with sigmoid. The positive pair uses sigmoid(posScore); negatives use sigmoid(-negScore).',
    objective: 'Inside skipGramTrainStep, compute the positive loss term -log(sigmoid(posScore)).',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = 0;
  // TODO: set loss to the positive pair term -Math.log(sigmoid(posScore)).

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('zero score positive loss', skipGramTrainStep([0, 0], [0, 0], [], 0.1).loss, 0.693147);
check('aligned positive loss', skipGramTrainStep([1, 0], [1, 0], [], 0.1).loss, 0.313262);
check('opposite positive loss', skipGramTrainStep([1, 0], [-1, 0], [], 0.1).loss, 1.313262);
return results;`,
    hints: [
      'Apply sigmoid to posScore before taking the log.',
      'The positive term is -Math.log(sigmoid(posScore)).',
      'Negative terms are handled in the loop below.',
    ],
    solution: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,
    explanation: 'Sigmoid turns similarity scores into probabilities so gradient descent can push positive pairs together.',
  },
  {
    id: 'word2vec-loss',
    stepLabel: '1.3',
    group: 'Positive pair likelihood',
    title: 'Word2Vec Negative Sampling Loss',
    concept: 'The full negative-sampling objective adds the positive log-likelihood term to every negative noise sample: -log(sigmoid(-negScore)).',
    objective: 'Inside skipGramTrainStep, subtract each negative sample log-likelihood from loss inside the negative loop.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    // TODO: subtract Math.log(sigmoid(-negScore)) from loss for this negative sample.
  }

  return { loss, posScore };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('single negative', skipGramTrainStep([1, 0], [0, 1], [[0, 1]], 0.1).loss, 1.386294);
check('aligned with negatives', skipGramTrainStep([1, 0], [1, 0], [[0, 1], [0, -1]], 0.1).loss, 1.699566);
check('multiple negatives', skipGramTrainStep([0.5, 0.5], [0.5, 0.5], [[-0.5, -0.5], [0, 1]], 0.1).loss, 1.922231);
return results;`,
    hints: [
      'Each negative contributes -log(sigmoid(-negScore)).',
      'Subtract that term from loss inside the loop.',
      'Keep the positive term computed before the loop.',
    ],
    solution: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  return { loss, posScore };
}`,
    explanation: 'Negative samples push unrelated words apart while the positive term pulls the true context closer.',
  },
  {
    id: 'word2vec-gradients',
    stepLabel: '1.4',
    group: 'Negative sample loss',
    title: 'Word2Vec Context Gradient',
    concept: 'The gradient for the context vector is (sigmoid(posScore) - 1) * vCenter. Applying it with learning rate lr updates vContext in place.',
    objective: 'Inside skipGramTrainStep, compute gradContext and apply the lr update to vContext after loss is computed.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    // TODO: update vContext[i] -= lr * (posProb - 1) * vCenter[i].
  }

  return { loss, posScore };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const ctx = [0.5, -0.5];
skipGramTrainStep([1, 0], ctx, [[0, 1]], 0.1);
check('context gradient update', ctx, [0.537754, -0.5]);
return results;`,
    hints: [
      'The context gradient scale is (sigmoid(posScore) - 1).',
      'Multiply that scale by vCenter[i] for each dimension.',
      'Subtract lr times the gradient from vContext[i].',
    ],
    solution: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    vContext[i] -= lr * (posProb - 1) * vCenter[i];
  }

  return { loss, posScore };
}`,
    explanation: 'Updating vContext first shows how the positive pair gradient nudges the context embedding toward the center word.',
  },
  {
    id: 'word2vec-update-step',
    stepLabel: '1.5',
    group: 'Skip-gram gradient update',
    title: 'Full Skip-Gram Training Step',
    concept: 'A complete Skip-gram step also updates vCenter and every negative vector using their respective gradients from the negative-sampling objective.',
    objective: 'Inside skipGramTrainStep, finish the center and negative gradient updates after the context update.',
    difficulty: 'challenge',
    starterCode: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  const negScores = [];
  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    negScores.push(negScore);
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    vContext[i] -= lr * (posProb - 1) * vCenter[i];
  }

  // TODO: update vCenter using the positive context gradient plus every negative contribution.

  return { loss, posScore };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-3) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const center = [1, 0];
const context = [0, 1];
const neg = [[0, 1]];
const out = skipGramTrainStep(center, context, neg, 0.05);
check('full step loss', out.loss, 1.386294);
check('center moved toward context', center[0] > 1, true);
check('negative adjusted', neg[0][0] < 0, true);
return results;`,
    hints: [
      'Center gradient starts with (posProb - 1) * vContext.',
      'Add sigmoid(negScore) * vNegatives[j] for each negative sample.',
      'Subtract lr times the accumulated gradient from each vCenter[i]. Also update each negative vector with lr * sigmoid(negScore) * vCenter.',
    ],
    solution: `/**
 * Runs one Skip-gram negative-sampling training step: loss, gradients, in-place vector updates.
 * @param {number[]} vCenter - Center word embedding (mutated in place on later steps).
 * @param {number[]} vContext - True context embedding (mutated in place on later steps).
 * @param {number[][]} vNegatives - Negative noise embeddings (mutated in place on later steps).
 * @param {number} lr - Learning rate applied to gradient updates.
 * @returns {{ loss: number, posScore: number }} Total loss and positive dot product.
 */
function skipGramTrainStep(vCenter, vContext, vNegatives, lr) {
  const d = vCenter.length;
  let posScore = 0;
  for (let i = 0; i < d; i++) {
    posScore += vCenter[i] * vContext[i];
  }

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  let loss = -Math.log(sigmoid(posScore));

  const negScores = [];
  for (let j = 0; j < vNegatives.length; j++) {
    let negScore = 0;
    for (let i = 0; i < d; i++) {
      negScore += vCenter[i] * vNegatives[j][i];
    }
    negScores.push(negScore);
    loss -= Math.log(sigmoid(-negScore));
  }

  const posProb = sigmoid(posScore);
  for (let i = 0; i < d; i++) {
    vContext[i] -= lr * (posProb - 1) * vCenter[i];
  }

  const gradCenter = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    gradCenter[i] = (posProb - 1) * vContext[i];
  }
  for (let j = 0; j < vNegatives.length; j++) {
    const negProb = sigmoid(negScores[j]);
    for (let i = 0; i < d; i++) {
      gradCenter[i] += negProb * vNegatives[j][i];
      vNegatives[j][i] -= lr * negProb * vCenter[i];
    }
  }
  for (let i = 0; i < d; i++) {
    vCenter[i] -= lr * gradCenter[i];
  }

  return { loss, posScore };
}`,
    explanation: 'Completing center and negative updates finishes one stochastic Skip-gram negative-sampling training step.',
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
