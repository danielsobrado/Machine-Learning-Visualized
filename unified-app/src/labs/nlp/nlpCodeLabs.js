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
    id: 'glove-loss-weight',
    stepLabel: '2.1',
    group: 'GloVe pair loss',
    title: 'Pair weight term',
    concept: 'GloVe scales pair contribution with f(xij).',
    objective: 'Compute weight term for one pair.',
    difficulty: 'warmup',
    starterCode: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  // TODO: implement piecewise weight
  const weight = 0;
  return weight;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('x above max', glovePairLoss([], [], 0, 0, 120, 100, 0.75), 1);
check('x below max', glovePairLoss([], [], 0, 0, 50, 100, 0.75), 0.5946035575);
return results;`,
    hints: ['const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);'],
    solution: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight;
}`,
    explanation: 'The weighting function balances common and rare pair influence.',
  },
  {
    id: 'glove-loss-pred',
    stepLabel: '2.2',
    group: 'GloVe pair loss',
    title: 'Dot-plus-bias prediction',
    concept: 'Predicted log count is dot(wi, wj) + biasI + biasJ.',
    objective: 'Compute pred term.',
    difficulty: 'warmup',
    starterCode: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) {
    // TODO: accumulate dot
    dot += 0;
  }
  const pred = 0;
  return pred;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('pred', glovePairLoss([1, 2], [3, 4], 0.5, 0.2, 10), 11.7);
return results;`,
    hints: ['dot += wi[i] * wj[i];', 'const pred = dot + biasI + biasJ;'],
    solution: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) {
    dot += wi[i] * wj[i];
  }
  const pred = dot + biasI + biasJ;
  return pred;
}`,
    explanation: 'Bias terms model unigram tendency outside pair interaction.',
  },
  {
    id: 'glove-loss-diff',
    stepLabel: '2.3',
    group: 'GloVe pair loss',
    title: 'Residual vs log count',
    concept: 'Pair residual compares predicted log count to observed log(xij).',
    objective: 'Compute diff = pred - Math.log(xij).',
    difficulty: 'core',
    starterCode: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  // TODO: residual against log count
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('diff', glovePairLoss([0.5, -0.2], [0.8, 0.4], 0.1, 0.2, 10), -1.682585093);
return results;`,
    hints: ['return pred - Math.log(xij);'],
    solution: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  return pred - Math.log(xij);
}`,
    explanation: 'GloVe regresses on logarithmic co-occurrence scale.',
  },
  {
    id: 'glove-loss-square',
    stepLabel: '2.4',
    group: 'GloVe pair loss',
    title: 'Squared residual',
    concept: 'GloVe uses squared residual for one pair.',
    objective: 'Compute diff * diff.',
    difficulty: 'core',
    starterCode: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  // TODO: return squared residual
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('squared', glovePairLoss([0.5, -0.2], [0.8, 0.4], 0.1, 0.2, 10), 2.831092595);
return results;`,
    hints: ['return diff * diff;'],
    solution: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  return diff * diff;
}`,
    explanation: 'Squared penalty emphasizes larger pair mismatches.',
  },
  {
    id: 'glove-loss-weighted',
    stepLabel: '2.5',
    group: 'GloVe pair loss',
    title: 'Weighted pair loss',
    concept: 'Final pair contribution is weight times squared residual.',
    objective: 'Multiply squared residual by weight.',
    difficulty: 'core',
    starterCode: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  // TODO: return weighted loss
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('weighted xij=10', glovePairLoss([0.5, -0.2], [0.8, 0.4], 0.1, 0.2, 10, 100, 0.75), 0.503447367);
return results;`,
    hints: ['return weight * sq;'],
    solution: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight * sq;
}`,
    explanation: 'Weighting keeps frequent pairs from dominating optimization.',
  },
  {
    id: 'glove-pair-loss-full',
    stepLabel: '2.6',
    group: 'GloVe pair loss',
    title: 'Complete glovePairLoss',
    concept: 'A robust pair loss handles non-positive xij safely.',
    objective: 'Return 0 when xij <= 0, else weighted squared residual.',
    difficulty: 'challenge',
    starterCode: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  // TODO: guard non-positive xij
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight * sq;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const wi = [0.5, -0.2];
const wj = [0.8, 0.4];
check('xij=10', glovePairLoss(wi, wj, 0.1, 0.2, 10, 100, 0.75), 0.503447367);
check('xij=120', glovePairLoss(wi, wj, 0.1, 0.2, 120, 100, 0.75), 17.367987426);
check('xij<=0 guard', glovePairLoss(wi, wj, 0.1, 0.2, 0, 100, 0.75), 0);
return results;`,
    hints: ['if (xij <= 0) return 0;'],
    solution: `function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  if (xij <= 0) return 0;
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight * sq;
}`,
    explanation: 'The final helper is directly usable in per-pair training loops.',
  },

  // --- FASTTEXT ---
  {
    id: 'fasttext-embed-ngrams',
    stepLabel: '3.1',
    group: 'FastText word vector',
    title: 'Enumerate character n-grams',
    concept: 'FastText decomposes words into bounded character n-grams.',
    objective: 'Build ngram list inside fastTextEmbed.',
    difficulty: 'warmup',
    starterCode: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    // TODO: push n-gram slice
    ngrams.push('');
  }
  return ngrams;
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('apple ngrams', fastTextEmbed('apple', [], 4, 2, 3), ['<ap', 'app', 'ppl', 'ple', 'le>']);
return results;`,
    hints: ['ngrams.push(decorated.slice(i, i + n));'],
    solution: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  return ngrams;
}`,
    explanation: 'Subword decomposition supports morphology-aware embeddings.',
  },
  {
    id: 'fasttext-embed-hash',
    stepLabel: '3.2',
    group: 'FastText word vector',
    title: 'Hash to bucket',
    concept: 'Each n-gram maps to a finite hash bucket.',
    objective: 'Implement fasttextHash inside fastTextEmbed.',
    difficulty: 'warmup',
    starterCode: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) {
      // TODO: hash update
      hash = 0;
    }
    return (hash >>> 0) % m;
  }
  return [fasttextHash('app', numBuckets), fasttextHash('ple', numBuckets)];
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = fastTextEmbed('apple', [], 4, 2, 3);
check('app bucket', out[0], 2);
check('ple bucket', out[1], 2);
return results;`,
    hints: ['hash = (hash * 33) + ngram.charCodeAt(i);'],
    solution: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) {
      hash = (hash * 33) + ngram.charCodeAt(i);
    }
    return (hash >>> 0) % m;
  }
  return [fasttextHash('app', numBuckets), fasttextHash('ple', numBuckets)];
}`,
    explanation: 'Hashing avoids storing explicit embeddings for all possible n-grams.',
  },
  {
    id: 'fasttext-embed-sum',
    stepLabel: '3.3',
    group: 'FastText word vector',
    title: 'Sum hashed vectors',
    concept: 'Word embedding is built by summing bucket vectors of its n-grams.',
    objective: 'Accumulate bucket vectors into sum.',
    difficulty: 'core',
    starterCode: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) ngrams.push(decorated.slice(i, i + n));
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      // TODO: add vec coordinate
      sum[d] += 0;
    }
  }
  return sum;
}`,
    testCode: `const results = [];
function approxArr(a, b, tol = 1e-6) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArr(actual, expected) });
}
const buckets = [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8]];
check('sum vectors', fastTextEmbed('apple', buckets, 4, 2, 3), [1.9, 2.4]);
return results;`,
    hints: ['sum[d] += vec[d];'],
    solution: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) ngrams.push(decorated.slice(i, i + n));
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      sum[d] += vec[d];
    }
  }
  return sum;
}`,
    explanation: 'Summed subword vectors encode shared morphology across words.',
  },
  {
    id: 'fasttext-sum-vectors',
    stepLabel: '3.4',
    group: 'FastText word vector',
    title: 'Two n-gram sum check',
    concept: 'Directly summing known n-grams validates hash/bucket behavior.',
    objective: 'Return sum for provided n-grams.',
    difficulty: 'core',
    starterCode: `function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      // TODO: add bucket vector
      sum[d] += 0;
    }
  }
  return sum;
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const buckets = [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8]];
// app % 4 = 2 and ple % 4 = 2 => [0.5,0.6] + [0.5,0.6] = [1.0,1.2]
check('sum 2 ngrams', sumSubwordVectors(['app', 'ple'], buckets, 4, 2), [1.0, 1.2]);
return results;`,
    hints: ['sum[d] += vec[d];'],
    solution: `function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      sum[d] += vec[d];
    }
  }
  return sum;
}`,
    explanation: 'This unit test isolates hash path correctness from n-gram extraction.',
  },
  {
    id: 'fasttext-embed-dispatch',
    stepLabel: '3.5',
    group: 'FastText word vector',
    title: 'Embed dispatch by n',
    concept: 'Embedding utility should respect chosen n-gram size n.',
    objective: 'Use function argument n for extraction loop.',
    difficulty: 'core',
    starterCode: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  // TODO: use n (not fixed size) in loop bounds/slices
  for (let i = 0; i <= decorated.length - 3; i++) {
    ngrams.push(decorated.slice(i, i + 3));
  }
  return ngrams;
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('n=2', fastTextEmbed('cat', [], 4, 2, 2), ['<c', 'ca', 'at', 't>']);
return results;`,
    hints: ['for (let i = 0; i <= decorated.length - n; i++) ngrams.push(decorated.slice(i, i + n));'],
    solution: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  return ngrams;
}`,
    explanation: 'n controls granularity of morphological decomposition.',
  },
  {
    id: 'fasttext-embed-full',
    stepLabel: '3.6',
    group: 'FastText word vector',
    title: 'Complete fastTextEmbed',
    concept: 'Final embedding utility extracts n-grams, hashes each, and sums vectors.',
    objective: 'Implement fastTextEmbed(word, buckets, numBuckets, vectorDim, n) with empty-word guard.',
    difficulty: 'challenge',
    starterCode: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  // TODO: return zeros for empty word
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) sum[d] += vec[d];
  }
  return sum;
}`,
    testCode: `const results = [];
function approxArr(a, b, tol = 1e-6) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArr(actual, expected) });
}
const buckets = [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8]];
check('empty word', fastTextEmbed('', buckets, 4, 2, 3), [0, 0]);
check('apple full', fastTextEmbed('apple', buckets, 4, 2, 3), [1.9, 2.4]);
return results;`,
    hints: ["if (word.length === 0) return Array(vectorDim).fill(0);"],
    solution: `function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  if (word.length === 0) return Array(vectorDim).fill(0);
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) sum[d] += vec[d];
  }
  return sum;
}`,
    explanation: 'This is the complete FastText-style subword embedding step.',
  },

];
