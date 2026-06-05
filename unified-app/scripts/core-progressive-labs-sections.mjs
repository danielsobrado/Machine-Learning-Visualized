export const WORD2VEC = `  // --- WORD2VEC ---
  {
    id: 'word2vec-dot-similarity',
    stepLabel: '1.1',
    group: 'Similarity score',
    title: 'Vector Similarity Score',
    concept: 'Skip-gram negative sampling compares center and context embeddings with a dot product. That score drives both the positive likelihood and every negative sample term.',
    objective: 'Inside skipGramTrainStep, compute the positive dot product posScore between vCenter and vContext.',
    difficulty: 'warmup',
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('orthogonal vectors', skipGramTrainStep([1, 0], [0, 1], [[0, 1]], 0.1).posScore, 0);
check('aligned vectors', skipGramTrainStep([2, 3], [4, 5], [], 0.1).posScore, 23);
check('negative dot', skipGramTrainStep([1, -1], [2, 3], [], 0.1).posScore, -1);
return results;\`,
    hints: [
      'Multiply matching indices and accumulate into posScore.',
      'Use posScore += vCenter[i] * vContext[i].',
      'The dot product is the sum of element-wise products.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('zero score positive loss', skipGramTrainStep([0, 0], [0, 0], [], 0.1).loss, 0.693147);
check('aligned positive loss', skipGramTrainStep([1, 0], [1, 0], [], 0.1).loss, 0.313262);
check('opposite positive loss', skipGramTrainStep([1, 0], [-1, 0], [[]], 0.1).loss, 1.313262);
return results;\`,
    hints: [
      'Apply sigmoid to posScore before taking the log.',
      'The positive term is -Math.log(sigmoid(posScore)).',
      'Negative terms are handled in the loop below.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('single negative', skipGramTrainStep([1, 0], [0, 1], [[0, 1]], 0.1).loss, 1.386294);
check('aligned with negatives', skipGramTrainStep([1, 0], [1, 0], [[0, 1], [0, -1]], 0.1).loss, 1.699566);
check('multiple negatives', skipGramTrainStep([0.5, 0.5], [0.5, 0.5], [[-0.5, -0.5], [0, 1]], 0.1).loss, 1.922231);
return results;\`,
    hints: [
      'Each negative contributes -log(sigmoid(-negScore)).',
      'Subtract that term from loss inside the loop.',
      'Keep the positive term computed before the loop.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const ctx = [0.5, -0.5];
skipGramTrainStep([1, 0], ctx, [[0, 1]], 0.1);
check('context gradient update', ctx, [0.573211, -0.573211]);
return results;\`,
    hints: [
      'The context gradient scale is (sigmoid(posScore) - 1).',
      'Multiply that scale by vCenter[i] for each dimension.',
      'Subtract lr times the gradient from vContext[i].',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
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
check('negative pushed away', neg[0][1] < 1, true);
return results;\`,
    hints: [
      'Center gradient starts with (posProb - 1) * vContext.',
      'Add sigmoid(negScore) * vNegatives[j] for each negative sample.',
      'Subtract lr times the accumulated gradient from each vCenter[i]. Also update each negative vector with lr * sigmoid(negScore) * vCenter.',
    ],
    solution: \`/**
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
}\`,
    explanation: 'Completing center and negative updates finishes one stochastic Skip-gram negative-sampling training step.',
  },

`;

export const KV_CACHE = `  {
    id: 'kv-cache-append-step',
    stepLabel: '8.1',
    group: 'Cache append',
    title: 'KV Cache Append Step',
    concept: 'Autoregressive decoding appends each new token Key and Value projection to persistent caches so past tokens are never recomputed.',
    objective: 'Inside decodeKVCacheStep, append the projected k and v vectors to keyCache and valueCache.',
    difficulty: 'warmup',
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: [
      'Use keyCache.push(k) after projection.',
      'Use valueCache.push(v) as well.',
      'The attention code below reads the updated cache length.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const x = [1, 0];
const W = [[1, 0], [0, 1]];
const out = decodeKVCacheStep(x, W, W, W, [[0, 1]], [[5, 5]]);
check('scale affects softmax blend', out[0], 4.9999);
return results;\`,
    hints: [
      'Use Math.sqrt(headDim) in the denominator.',
      'scale = 1 / Math.sqrt(headDim).',
      'Multiply each raw dot product by scale when building scores.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-3) { return Math.abs(a - b) <= tol; }
function approxArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const qx = [1, 0];
const W = [[1, 0], [0, 1]];
check('attention blend', decodeKVCacheStep(qx, W, W, W, [[1, 0], [0, 1]], [[10, 20], [30, 40]]), [15.3788, 25.3788]);
return results;\`,
    hints: [
      'Subtract max score before exponentiating for numerical stability.',
      'Normalize exponentials to get softmax weights.',
      'Accumulate weights[j] * valueCache[j][m] into output[m].',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
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
check('cache grows', kC.length, 2);
return results;\`,
    hints: [
      'Each projection is a matrix-vector product: q[i] += Wq[i][j] * x[j].',
      'Apply the same pattern for k with Wk and v with Wv.',
      'The cache append and attention code below should remain unchanged.',
    ],
    solution: \`/**
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
}\`,
    explanation: 'Projection, cache append, and cached attention together form one autoregressive generation step.',
  },

`;

export const LSTM = `  {
    id: 'lstm-gates-f-i',
    stepLabel: '31.1',
    group: 'Forget and input gates',
    title: 'LSTM Forget and Input Gates',
    concept: 'An LSTM cell uses sigmoid forget and input gates to control how much past memory to keep and how much new input to write.',
    objective: 'Inside lstmCell, compute forget gate f and input gate i from x, hPrev, and params.',
    difficulty: 'warmup',
    starterCode: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  let f = 0;
  let i = 0;
  // TODO: set f and i using sigmoid on their pre-activation scores.

  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0.5, uf: 0.5, bf: 0, wi: -0.5, ui: 1, bi: 0.2, wc: 0.8, uc: 0.2, bc: -0.1, wo: 0.5, uo: 0.5, bo: -0.2 };
const out = lstmCell(1, 1, 0, p);
check('forget gate', out.f, 0.731058);
check('input gate', out.i, 0.668187);
return results;\`,
    hints: [
      'Forget pre-activation: params.wf * x + params.uf * hPrev + params.bf.',
      'Input pre-activation: params.wi * x + params.ui * hPrev + params.bi.',
      'Apply sigmoid to both scores.',
    ],
    solution: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);

  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}\`,
    explanation: 'Forget and input gates are continuous valves that regulate memory flow without saturating like vanilla RNN activations.',
  },
  {
    id: 'lstm-candidate-state',
    stepLabel: '31.2',
    group: 'Candidate cell',
    title: 'LSTM Candidate Cell State',
    concept: 'The candidate cell state cCand proposes new memory content, squashed into [-1, 1] with tanh before the input gate scales it.',
    objective: 'Inside lstmCell, compute cCand = tanh(wc * x + uc * hPrev + bc).',
    difficulty: 'warmup',
    starterCode: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);

  let cCand = 0;
  // TODO: set cCand with Math.tanh on the candidate pre-activation.

  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 0, wi: 0, ui: 0, bi: 0, wc: 0.8, uc: 0.2, bc: -0.1, wo: 0, uo: 0, bo: 0 };
check('candidate positive', lstmCell(1, 2, 0, p).cCand, 0.800499);
check('candidate zero', lstmCell(0, 0, 0, p).cCand, -0.099667);
return results;\`,
    hints: [
      'Candidate score is params.wc * x + params.uc * hPrev + params.bc.',
      'Return Math.tanh(score).',
    ],
    solution: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);

  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}\`,
    explanation: 'Tanh bounds candidate values so long unrolled sequences stay numerically stable.',
  },
  {
    id: 'lstm-state-fusion',
    stepLabel: '31.3',
    group: 'Cell state update',
    title: 'LSTM Cell State Fusion',
    concept: 'The new cell state combines gated history and gated candidate information: c = f * cPrev + i * cCand.',
    objective: 'Inside lstmCell, fuse cPrev and cCand with gates f and i.',
    difficulty: 'core',
    starterCode: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);

  let c = 0;
  // TODO: update cell state with c = f * cPrev + i * cCand.

  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 0, wi: 0, ui: 0, bi: 0, wc: 0, uc: 0, bc: 0, wo: 0, uo: 0, bo: 0 };
check('fusion standard', lstmCell(0, 0, 2, { ...p, wf: 1, wi: 0.2, wc: 1, uc: 0, bc: 0 }).c, 2.4);
check('full forget', lstmCell(0, 0, 10, { ...p, wf: 0, wi: 0.5, wc: 1, uc: 0, bc: 0 }).c, 1.0);
return results;\`,
    hints: [
      'Scale cPrev by f and cCand by i.',
      'Add the two scaled terms.',
    ],
    solution: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}\`,
    explanation: 'Linear cell updates let gradients flow across long horizons without repeated saturating nonlinearities.',
  },
  {
    id: 'lstm-hidden-output',
    stepLabel: '31.4',
    group: 'Output gate & hidden output',
    title: 'LSTM Hidden Output Generation',
    concept: 'The output gate filters the tanh-compressed cell state to produce the hidden output: h = o * tanh(c).',
    objective: 'Inside lstmCell, compute output gate o and hidden state h from the updated cell state.',
    difficulty: 'challenge',
    starterCode: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;

  let o = 0;
  let h = 0;
  // TODO: compute output gate o and hidden output h = o * Math.tanh(c).

  return { h, c, f, i, o, cCand };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 20, wi: 0, ui: 0, bi: -20, wc: 0, uc: 0, bc: 0, wo: 0.5, uo: 0.5, bo: -0.2 };
const out = lstmCell(1, 2, 3, p);
check('output gate', out.o, 0.785835);
check('hidden output', out.h, 0.781949);
return results;\`,
    hints: [
      'Output gate uses sigmoid(wo * x + uo * hPrev + bo).',
      'Hidden state is o multiplied by tanh(c).',
    ],
    solution: \`/**
 * Runs one LSTM cell forward pass and returns the new hidden/cell states plus gate diagnostics.
 * @param {number} x - Current input scalar.
 * @param {number} hPrev - Previous hidden state.
 * @param {number} cPrev - Previous cell state.
 * @param {{ wf: number, uf: number, bf: number, wi: number, ui: number, bi: number, wc: number, uc: number, bc: number, wo: number, uo: number, bo: number }} params - Gate parameters.
 * @returns {{ h: number, c: number, f: number, i: number, o: number, cCand: number }} New states and gate values.
 */
function lstmCell(x, hPrev, cPrev, params) {
  const sigmoid = (v) => 1 / (1 + Math.exp(-v));

  const f = sigmoid(params.wf * x + params.uf * hPrev + params.bf);
  const i = sigmoid(params.wi * x + params.ui * hPrev + params.bi);
  const cCand = Math.tanh(params.wc * x + params.uc * hPrev + params.bc);
  const c = f * cPrev + i * cCand;
  const o = sigmoid(params.wo * x + params.uo * hPrev + params.bo);
  const h = o * Math.tanh(c);

  return { h, c, f, i, o, cCand };
}\`,
    explanation: 'The output gate exposes only the relevant slice of cell memory as the hidden representation passed to the next timestep.',
  },

`;

export const BERT = `  {
    id: 'bert-mlm-masking',
    stepLabel: '14.1',
    group: '80-10-10 masking rule',
    title: 'BERT MLM 80/10/10 Masking Rule',
    concept: 'BERT corrupts 15% of selected tokens using 80% [MASK], 10% random replacement, and 10% unchanged tokens.',
    objective: 'Inside bertMlmStep, apply the 80/10/10 rule on maskIndices using randVals and randTokens.',
    difficulty: 'warmup',
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const tokens = [10, 20, 30, 40, 50];
const logits = tokens.map(() => [0, 0]);
const out = bertMlmStep(tokens, tokens, [0, 1, 2], [0.5, 0.85, 0.95], [5, 99, 12], logits);
check('80-10-10 corruption', out.corrupted, [103, 99, 30, 40, 50]);
return results;\`,
    hints: [
      'randVals[i] < 0.8 means replace with token 103.',
      'Between 0.8 and 0.9 use randTokens[i].',
      'Otherwise leave corrupted[idx] unchanged.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const logits = [[0, 0], [0, 0], [0, 0]];
const out = bertMlmStep([10, 20, 0], [0, 1, 0], [], [], [], logits);
check('padding blocked', out.attnMask, [[1, 1, 0], [1, 1, 0], [0, 0, 0]]);
return results;\`,
    hints: [
      'Loop over every pair (i, j).',
      'Set mask entry to 1 only when both tokens are non-zero.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const logits = [[2, 0], [0, 2], [1, 1]];
const out = bertMlmStep([1, 2, 3], [0, 1, 0], [0, 2], [0.1, 0.1], [9, 9], logits);
check('mlm loss average', out.loss, 0.410037);
return results;\`,
    hints: [
      'For each masked index, softmax the logit row stably.',
      'Accumulate -log(prob[target]) and divide by maskIndices.length.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-4) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual.predictions, expected.predictions) && approxEqual(actual.loss, expected.loss) });
}
const logits = [[2, 0], [0, 2], [1, 1]];
const out = bertMlmStep([10, 20, 0], [0, 1, 0], [0, 1], [0.1, 0.1], [9, 9], logits);
check('full bert step', out, { predictions: [0, 1, 0], loss: 0.126928 });
return results;\`,
    hints: [
      'Scan each logit row for the maximum value index.',
      'Push that argmax index into predictions.',
    ],
    solution: \`/**
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
}\`,
    explanation: 'Returning corruption, mask, loss, and predictions together mirrors one BERT MLM training forward pass.',
  },

`;

export const TOOL = `  // --- TOOL-USING REASONING MODELS ---
  {
    id: 'tool-use-parse',
    stepLabel: '29.1',
    group: 'Tool call parser',
    title: 'XML Tool Call Parsing',
    concept: 'Tool-using models emit <call:toolName>arguments</call> tags. The agent runtime parses those tags before dispatching.',
    objective: 'Inside runAgentToolStep, parse the first tool call from assistantText using a regex.',
    difficulty: 'warmup',
    starterCode: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  // TODO: match /<call:(\\\\w+)>(.*?)<\\\\/call>/ and set toolCall = { name, args } or null.

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { search: (q) => 'found ' + q };
const out = runAgentToolStep('Try <call:search>ml</call>', [], reg);
check('parsed tool call', out.nextMessage, { role: 'tool', name: 'search', content: 'found ml' });
check('no tool means stop', runAgentToolStep('done', [], reg).shouldStop, true);
return results;\`,
    hints: [
      'Use text.match(/<call:(\\\\w+)>(.*?)<\\\\/call>/).',
      'If matched, toolCall = { name: match[1], args: match[2] }.',
    ],
    solution: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) {
    toolCall = { name: match[1], args: match[2] };
  }

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}\`,
    explanation: 'Parsing tool tags is the boundary between free-form LLM text and structured runtime actions.',
  },
  {
    id: 'tool-use-dispatch',
    stepLabel: '29.2',
    group: 'Action dispatcher',
    title: 'Tool Call Dispatcher',
    concept: 'After parsing, the dispatcher looks up the handler, catches failures, and returns a string result.',
    objective: 'Inside runAgentToolStep, dispatch toolCall to registry with missing-tool and error handling.',
    difficulty: 'core',
    starterCode: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    let content = '';
    // TODO: dispatch toolCall through registry with try/catch and missing-tool fallback strings.

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const reg = { upper: (s) => s.toUpperCase(), fail: () => { throw new Error('timeout'); } };
check('dispatch success', runAgentToolStep('<call:upper>hi</call>', [], reg).nextMessage.content, 'HI');
check('missing tool', runAgentToolStep('<call:missing>x</call>', [], reg).nextMessage.content, 'Error: Tool "missing" not found');
check('caught error', runAgentToolStep('<call:fail></call>', [], reg).nextMessage.content, 'Error: timeout');
return results;\`,
    hints: [
      'Look up registry[toolCall.name].',
      'Return an error string if the tool is missing or throws.',
    ],
    solution: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}\`,
    explanation: 'Safe dispatch prevents one bad tool call from crashing the whole agent loop.',
  },
  {
    id: 'tool-use-history',
    stepLabel: '29.3',
    group: 'History integration',
    title: 'Tool History Integration',
    concept: 'Successful tool execution appends a tool-role message so the model can read the result on the next turn.',
    objective: 'Inside runAgentToolStep, append the tool result to history without mutating the input array.',
    difficulty: 'core',
    starterCode: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    let nextHistory = history;
    // TODO: append { role: 'tool', name: toolCall.name, content } to a copied history array.

    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const hist = [{ role: 'user', content: 'weather?' }];
const out = runAgentToolStep('<call:get_weather>Paris</call>', hist, { get_weather: (x) => 'sunny in ' + x });
check('history append', out.history, [{ role: 'user', content: 'weather?' }, { role: 'tool', name: 'get_weather', content: 'sunny in Paris' }]);
check('input history untouched', hist.length, 1);
return results;\`,
    hints: [
      'Copy history with [...history].',
      'Push the tool message object onto the copy.',
    ],
    solution: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}\`,
    explanation: 'Tool-role messages distinguish execution feedback from assistant prose in the dialog state.',
  },
  {
    id: 'tool-use-agent-loop',
    stepLabel: '29.4',
    group: 'Agent execution loop',
    title: 'Agent Reason-Action Loop',
    concept: 'When no tool call is present the agent stops; when a tool executes the loop continues with shouldStop = false.',
    objective: 'Inside runAgentToolStep, return shouldStop false for tool calls and true for plain assistant text.',
    difficulty: 'challenge',
    starterCode: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: true,
      history: nextHistory,
    };
  }

  // TODO: return assistant nextMessage and the correct shouldStop flag when no tool call is found.
  return { nextMessage: {}, shouldStop: false, history };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { get_weather: (loc) => 'sunny in ' + loc };
check('tool path continues', runAgentToolStep('<call:get_weather>Paris</call>', [], reg), {
  nextMessage: { role: 'tool', name: 'get_weather', content: 'sunny in Paris' },
  shouldStop: false,
  history: [{ role: 'tool', name: 'get_weather', content: 'sunny in Paris' }],
});
check('plain text stops', runAgentToolStep('All done.', [], reg), {
  nextMessage: { role: 'assistant', content: 'All done.' },
  shouldStop: true,
  history: [],
});
return results;\`,
    hints: [
      'Tool execution should set shouldStop to false so the loop continues.',
      'Plain assistant text should set shouldStop to true.',
    ],
    solution: \`/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}\`,
    explanation: 'The stop flag is what lets an outer loop alternate between model generation and tool execution.',
  },

`;

export const DIFFUSION = `  // --- diffusion-sampling ---
  {
    id: 'diff-scheduler-betas',
    stepLabel: '73.1',
    group: 'Beta scheduling',
    title: 'Linear Beta Schedule',
    concept: 'DDPM uses a linear beta schedule that ramps noise variance from betaStart to betaEnd across T timesteps.',
    objective: 'Inside ddpmSamplingStep, fill the betas array with linearly interpolated values.',
    difficulty: 'warmup',
    starterCode: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  // TODO: push T linearly spaced beta values from betaStart to betaEnd.

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('beta schedule', ddpmSamplingStep(0, 0, 0, 5, 0.0001, 0.02, 0, null, null).betas, [0.0001, 0.005075, 0.01005, 0.015025, 0.02]);
return results;\`,
    hints: [
      'Step size is (betaEnd - betaStart) / (totalSteps - 1) when totalSteps > 1.',
      'Push betaStart + i * step for each i.',
    ],
    solution: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) {
    betas.push(betaStart);
  } else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) {
      betas.push(betaStart + i * step);
    }
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    explanation: 'The beta schedule controls how quickly signal is replaced by noise across the forward process.',
  },
  {
    id: 'diff-forward-diffusion-step',
    stepLabel: '73.2',
    group: 'Forward noise scheduler',
    title: 'Closed-Form Forward Diffusion',
    concept: 'DDPM can jump directly to x_t with x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.',
    objective: 'Inside ddpmSamplingStep, compute forwardXt when x0 and forwardNoise are provided.',
    difficulty: 'warmup',
    starterCode: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    // TODO: set forwardXt using closed-form forward diffusion.
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = ddpmSamplingStep(0, 0, 1, 4, 0.01, 0.04, 0, 1.5, -0.8);
check('forward diffuse', out.forwardXt, 0.72);
return results;\`,
    hints: [
      'Use alphaBars[t] as alpha_bar_t.',
      'forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise.',
    ],
    solution: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    explanation: 'Closed-form forward diffusion lets training sample any noisy timestep without unrolling the chain.',
  },
  {
    id: 'diff-posterior-mean',
    stepLabel: '73.3',
    group: 'Posterior mean estimation',
    title: 'DDPM Reverse Step Mean',
    concept: 'The reverse posterior mean is mu_t = (x_t - (beta_t / sqrt(1 - alpha_bar_t)) * eps_theta) / sqrt(alpha_t).',
    objective: 'Inside ddpmSamplingStep, compute reverseXt as the posterior mean when t = 0 (no extra noise).',
    difficulty: 'core',
    starterCode: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  let reverseXt = 0;
  // TODO: set reverseXt to the posterior mean mu_t (without extra sampling noise).

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = ddpmSamplingStep(1.2, 0.5, 2, 5, 0.0001, 0.02, 0.1, null, null);
check('posterior mean', out.reverseXt, 1.190724);
return results;\`,
    hints: [
      'Subtract (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta from xt.',
      'Divide by Math.sqrt(alphaT).',
    ],
    solution: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    explanation: 'The posterior mean points the latent toward higher-density regions of the data distribution.',
  },
  {
    id: 'diff-reverse-denoise-step',
    stepLabel: '73.4',
    group: 'Denoised reverse step',
    title: 'DDPM Complete Denoising Step',
    concept: 'For t > 0 the reverse step adds sqrt(beta_t) * zNoise to the posterior mean; at t = 0 it returns the mean alone.',
    objective: 'Inside ddpmSamplingStep, add sampling noise to reverseXt when t > 0.',
    difficulty: 'challenge',
    starterCode: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  // TODO: if t > 0, add Math.sqrt(betaT) * zNoise to reverseXt.

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const noisy = ddpmSamplingStep(1.2, 0.5, 4, 10, 0.0001, 0.02, 0.1, null, null);
check('reverse with noise', noisy.reverseXt, 1.210724);
const final = ddpmSamplingStep(1.2, 0.5, 0, 10, 0.0001, 0.02, 0.1, null, null);
check('reverse without noise at t=0', final.reverseXt, 1.190724);
return results;\`,
    hints: [
      'Start from mu = reverseXt.',
      'Add Math.sqrt(betaT) * zNoise only when t > 0.',
    ],
    solution: \`/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}\`,
    explanation: 'Stochastic reverse steps maintain sample diversity while the t = 0 step returns a deterministic denoised value.',
  },

`;
