export const NEURAL_NETWORK_CODE_LABS = [
  {
    id: 'gd-prediction-error',
    stepLabel: '26.1',
    group: 'Gradient descent least squares',
    title: 'Prediction error',
    concept: 'Gradient descent updates parameters using prediction error.',
    objective: 'Return prediction minus target.',
    difficulty: 'warmup',
    starterCode: `function predictionError(prediction, target) {
  // TODO: return prediction minus target.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('overprediction', predictionError(10, 7), 3);
check('underprediction', predictionError(4, 9), -5);
check('perfect prediction', predictionError(5, 5), 0);

return results;`,
    hints: [
      'Error is signed: prediction - target.',
      'Positive means prediction was too high.',
      'return prediction - target;',
    ],
    solution: `function predictionError(prediction, target) {
  return prediction - target;
}`,
    explanation: 'Signed error tells gradient descent which direction the prediction is wrong.',
  },

  {
    id: 'gd-one-weight-gradient',
    stepLabel: '26.2',
    group: 'Gradient descent least squares',
    title: 'One weight gradient',
    concept: 'For squared error, the gradient contribution is error times feature value.',
    objective: 'Return error * feature.',
    difficulty: 'core',
    starterCode: `function oneWeightGradient(error, feature) {
  // TODO: return this feature's gradient contribution.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive error, positive feature', oneWeightGradient(3, 2), 6);
check('negative error, positive feature', oneWeightGradient(-5, 2), -10);
check('positive error, zero feature', oneWeightGradient(3, 0), 0);
check('negative feature', oneWeightGradient(4, -2), -8);

return results;`,
    hints: [
      'The gradient scales with how much this feature contributed.',
      'Multiply error by feature.',
      'return error * feature;',
    ],
    solution: `function oneWeightGradient(error, feature) {
  return error * feature;
}`,
    explanation: 'If a feature is large, the weight connected to it gets a larger update signal.',
  },

  {
    id: 'gd-gradient-vector',
    stepLabel: '26.3',
    group: 'Gradient descent least squares',
    title: 'Gradient vector',
    concept: 'Each weight receives error times its matching feature.',
    objective: 'Push error * x[i] for every feature.',
    difficulty: 'core',
    starterCode: `function gradientForExample(error, x) {
  const gradient = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the gradient for weight i.
    gradient.push(0);
  }

  return gradient;
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

check('error 3', gradientForExample(3, [1, 2, 3]), [3, 6, 9]);
check('error -2', gradientForExample(-2, [1, 0, 4]), [-2, 0, -8]);
check('zero error', gradientForExample(0, [5, 6]), [0, 0]);

return results;`,
    hints: [
      'The same error multiplies every feature.',
      'For weight i, use error * x[i].',
      'gradient.push(error * x[i]);',
    ],
    solution: `function gradientForExample(error, x) {
  const gradient = [];

  for (let i = 0; i < x.length; i++) {
    gradient.push(error * x[i]);
  }

  return gradient;
}`,
    explanation: 'The gradient vector tells every weight how to move to reduce squared error.',
  },

  {
    id: 'gd-weight-update',
    stepLabel: '26.4',
    group: 'Gradient descent least squares',
    title: 'One gradient descent update',
    concept: 'Gradient descent subtracts learningRate times gradient.',
    objective: 'Update one weight coordinate.',
    difficulty: 'core',
    starterCode: `function updateWeights(weights, gradient, learningRate) {
  const updated = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: subtract learningRate times gradient[i].
    updated.push(weights[i]);
  }

  return updated;
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

check('simple update', updateWeights([1, 2], [3, 4], 0.1), [0.7, 1.6]);
check('negative gradient', updateWeights([1, 2], [-1, 2], 0.5), [1.5, 1]);
check('zero gradient', updateWeights([5, 6], [0, 0], 0.1), [5, 6]);

return results;`,
    hints: [
      'Gradient descent moves opposite the gradient.',
      'New weight = old weight - learningRate * gradient.',
      'updated.push(weights[i] - learningRate * gradient[i]);',
    ],
    solution: `function updateWeights(weights, gradient, learningRate) {
  const updated = [];

  for (let i = 0; i < weights.length; i++) {
    updated.push(weights[i] - learningRate * gradient[i]);
  }

  return updated;
}`,
    explanation: 'The learning rate controls the size of the step downhill.',
  },

  {
    id: 'logistic-logit-dot',
    stepLabel: '27.1',
    group: 'Logistic regression bridge',
    title: 'Logit is a dot product',
    concept: 'Logistic regression first computes a linear score: w dot x + b.',
    objective: 'Return dot(weights, x) plus bias.',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function logit(weights, x, bias) {
  // TODO: return w dot x + bias.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple logit', logit([1, 2], [3, 4], 0), 11);
check('with bias', logit([1, 2], [3, 4], -1), 10);
check('negative weight', logit([-1, 2], [3, 5], 1), 8);

return results;`,
    hints: [
      'Use the dot helper.',
      'The linear score is dot(weights, x) + bias.',
      'return dot(weights, x) + bias;',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function logit(weights, x, bias) {
  return dot(weights, x) + bias;
}`,
    explanation: 'Logistic regression is linear algebra plus a sigmoid. The dot product creates the score.',
  },

  {
    id: 'logistic-sigmoid',
    stepLabel: '27.2',
    group: 'Logistic regression bridge',
    title: 'Sigmoid',
    concept: 'Sigmoid turns any real-valued logit into a value between 0 and 1.',
    objective: 'Complete the sigmoid formula.',
    difficulty: 'core',
    starterCode: `function sigmoid(z) {
  // TODO: return 1 / (1 + exp(-z)).
  return z;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('sigmoid(0)', sigmoid(0), 0.5);
check('sigmoid(log 3)', sigmoid(Math.log(3)), 0.75);
check('sigmoid(-log 3)', sigmoid(-Math.log(3)), 0.25);

return results;`,
    hints: [
      'Use Math.exp.',
      'The formula is 1 / (1 + Math.exp(-z)).',
      'return 1 / (1 + Math.exp(-z));',
    ],
    solution: `function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}`,
    explanation: 'Sigmoid converts a linear score into a probability-like value.',
  },

  {
    id: 'logistic-predict-probability',
    stepLabel: '27.3',
    group: 'Logistic regression bridge',
    title: 'Predict probability',
    concept: 'A logistic model predicts sigmoid(w dot x + b).',
    objective: 'Apply sigmoid to the logit.',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function predictProbability(weights, x, bias) {
  const z = dot(weights, x) + bias;

  // TODO: return sigmoid of z.
  return z;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('probability 0.5', predictProbability([0, 0], [3, 4], 0), 0.5);
check('probability 0.75', predictProbability([1], [Math.log(3)], 0), 0.75);
check('probability with bias', predictProbability([1], [0], Math.log(3)), 0.75);

return results;`,
    hints: [
      'z is already the linear score.',
      'Apply sigmoid(z).',
      'return sigmoid(z);',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function predictProbability(weights, x, bias) {
  const z = dot(weights, x) + bias;
  return sigmoid(z);
}`,
    explanation: 'Logistic regression turns feature-weight alignment into a probability.',
  },

  {
    id: 'logistic-binary-cross-entropy',
    stepLabel: '27.4',
    group: 'Logistic regression bridge',
    title: 'Binary cross-entropy',
    concept: 'Binary cross-entropy penalizes confident wrong probabilities heavily.',
    objective: 'Complete the loss formula for one label and probability.',
    difficulty: 'challenge',
    starterCode: `function binaryCrossEntropy(y, p) {
  // TODO: return -(y log p + (1-y) log(1-p)).
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('positive label p=0.5', binaryCrossEntropy(1, 0.5), -Math.log(0.5));
check('negative label p=0.5', binaryCrossEntropy(0, 0.5), -Math.log(0.5));
check('positive label p=0.8', binaryCrossEntropy(1, 0.8), -Math.log(0.8));
check('negative label p=0.2', binaryCrossEntropy(0, 0.2), -Math.log(0.8));

return results;`,
    hints: [
      'Use Math.log.',
      'The formula is negative of y log p plus (1-y) log(1-p).',
      'return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));',
    ],
    solution: `function binaryCrossEntropy(y, p) {
  return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
}`,
    explanation: 'Cross-entropy rewards high probability on the true class and punishes confident wrong predictions.',
  },

  {
    id: 'attention-one-score',
    stepLabel: '28.1',
    group: 'Attention algebra bridge',
    title: 'One attention score',
    concept: 'One attention score is a query vector dotted with a key vector.',
    objective: 'Return query dot key.',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScore(query, key) {
  // TODO: return query dot key.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 1', attentionScore([1, 2], [3, 4]), 11);
check('orthogonal score', attentionScore([1, 0], [0, 1]), 0);
check('negative score', attentionScore([-1, 2], [3, 5]), 7);

return results;`,
    hints: [
      'Attention starts with similarity scores.',
      'Similarity here is dot product.',
      'return dot(query, key);',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScore(query, key) {
  return dot(query, key);
}`,
    explanation: 'In transformer attention, QK^T is a matrix of query-key dot products.',
  },

  {
    id: 'attention-scale-score',
    stepLabel: '28.2',
    group: 'Attention algebra bridge',
    title: 'Scale attention score',
    concept: 'Attention scores are divided by sqrt(d) to keep logits from growing too large.',
    objective: 'Divide the raw score by Math.sqrt(d).',
    difficulty: 'core',
    starterCode: `function scaleAttentionScore(rawScore, d) {
  // TODO: return rawScore divided by sqrt(d).
  return rawScore;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('scale by sqrt 4', scaleAttentionScore(8, 4), 4);
check('scale by sqrt 9', scaleAttentionScore(12, 9), 4);
check('scale by sqrt 1', scaleAttentionScore(7, 1), 7);

return results;`,
    hints: [
      'Use Math.sqrt(d).',
      'Scaled dot-product attention divides by the square root of dimension.',
      'return rawScore / Math.sqrt(d);',
    ],
    solution: `function scaleAttentionScore(rawScore, d) {
  return rawScore / Math.sqrt(d);
}`,
    explanation: 'Scaling keeps attention logits numerically stable before softmax.',
  },

  {
    id: 'attention-softmax-denominator',
    stepLabel: '28.3',
    group: 'Attention algebra bridge',
    title: 'Softmax denominator',
    concept: 'Softmax normalizes exponentiated scores so weights sum to 1.',
    objective: 'Accumulate Math.exp(score) for every score.',
    difficulty: 'core',
    starterCode: `function softmaxDenominator(scores) {
  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    // TODO: add exp of this score.
    total += 0;
  }

  return total;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({
    name,
    actual,
    expected,
    passed: approxEqual(actual, expected),
  });
}

check('zeros', softmaxDenominator([0, 0]), 2);
check('one zero', softmaxDenominator([0]), 1);
check('mixed', softmaxDenominator([0, Math.log(3)]), 4);

return results;`,
    hints: [
      'Softmax uses exponentials.',
      'Use Math.exp(scores[i]).',
      'total += Math.exp(scores[i]);',
    ],
    solution: `function softmaxDenominator(scores) {
  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += Math.exp(scores[i]);
  }

  return total;
}`,
    explanation: 'Softmax turns raw attention scores into normalized attention weights.',
  },

  {
    id: 'attention-softmax-weights',
    stepLabel: '28.4',
    group: 'Attention algebra bridge',
    title: 'Softmax weights',
    concept: 'Each softmax weight is exp(score) divided by the sum of all exp(scores).',
    objective: 'Push one normalized softmax weight per score.',
    difficulty: 'challenge',
    starterCode: `function softmax(scores) {
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    denominator += Math.exp(scores[i]);
  }

  const weights = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push the normalized softmax weight.
    weights.push(0);
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

check('two equal scores', softmax([0, 0]), [0.5, 0.5]);
check('one option', softmax([0]), [1]);
check('log ratio', softmax([0, Math.log(3)]), [0.25, 0.75]);

return results;`,
    hints: [
      'The denominator is already computed.',
      'Weight i is exp(scores[i]) / denominator.',
      'weights.push(Math.exp(scores[i]) / denominator);',
    ],
    solution: `function softmax(scores) {
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    denominator += Math.exp(scores[i]);
  }

  const weights = [];

  for (let i = 0; i < scores.length; i++) {
    weights.push(Math.exp(scores[i]) / denominator);
  }

  return weights;
}`,
    explanation: 'Attention weights are a probability distribution over which values to read.',
  },

  {
    id: 'attention-weighted-value-sum',
    stepLabel: '28.5',
    group: 'Attention algebra bridge',
    title: 'Weighted value sum',
    concept: 'The attention output is a weighted sum of value vectors.',
    objective: 'Add weight times value coordinate into the output.',
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
      'Each token contributes weight[token] times its value vector.',
      'For each coordinate, add weights[token] * values[token][dim].',
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
    explanation: 'Attention does not return the most-attended token; it returns a mixture of value vectors.',
  },

  {
    id: 'derivative-line-slope',
    stepLabel: '29.1',
    group: 'Derivative basics',
    title: 'Slope of a line',
    concept: 'The derivative of f(x) = mx + b is the constant slope m.',
    objective: 'Return the slope m.',
    difficulty: 'warmup',
    starterCode: `function derivativeOfLine(m, b, x) {
  // f(x) = m*x + b
  // TODO: return the derivative with respect to x.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('slope 2', derivativeOfLine(2, 5, 10), 2);
check('slope -3', derivativeOfLine(-3, 1, 7), -3);
check('slope 0', derivativeOfLine(0, 100, 4), 0);

return results;`,
    hints: [
      'The derivative of m*x + b is m.',
      'b disappears because constants do not change with x.',
      'return m;',
    ],
    solution: `function derivativeOfLine(m, b, x) {
  return m;
}`,
    explanation: 'A derivative measures local change. For a straight line, the local change is the same everywhere.',
  },

  {
    id: 'derivative-square',
    stepLabel: '29.2',
    group: 'Derivative basics',
    title: 'Derivative of x^2',
    concept: 'The derivative of x^2 is 2x.',
    objective: 'Return 2 * x.',
    difficulty: 'warmup',
    starterCode: `function derivativeSquare(x) {
  // f(x) = x*x
  // TODO: return f'(x).
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('x=0', derivativeSquare(0), 0);
check('x=3', derivativeSquare(3), 6);
check('x=-4', derivativeSquare(-4), -8);
check('x=10', derivativeSquare(10), 20);

return results;`,
    hints: [
      'Power rule: d/dx x^2 = 2x.',
      'The slope grows as x gets farther from 0.',
      'return 2 * x;',
    ],
    solution: `function derivativeSquare(x) {
  return 2 * x;
}`,
    explanation: 'For squared loss, gradients grow with the size of the error.',
  },

  {
    id: 'derivative-squared-error',
    stepLabel: '29.3',
    group: 'Derivative basics',
    title: 'Squared-error derivative',
    concept: 'For loss L = (prediction - target)^2, the derivative with respect to prediction is 2(prediction - target).',
    objective: 'Return the gradient of squared error with respect to prediction.',
    difficulty: 'core',
    starterCode: `function squaredErrorGradient(prediction, target) {
  const error = prediction - target;

  // TODO: return d/dprediction of error^2.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('prediction too high', squaredErrorGradient(10, 7), 6);
check('prediction too low', squaredErrorGradient(4, 9), -10);
check('perfect prediction', squaredErrorGradient(5, 5), 0);

return results;`,
    hints: [
      'Squared error is error^2.',
      'Derivative of error^2 with respect to prediction is 2 * error.',
      'return 2 * error;',
    ],
    solution: `function squaredErrorGradient(prediction, target) {
  const error = prediction - target;
  return 2 * error;
}`,
    explanation: 'The gradient is positive when prediction is too high, negative when too low, and zero when perfect.',
  },

  {
    id: 'numerical-derivative',
    stepLabel: '29.4',
    group: 'Derivative basics',
    title: 'Numerical derivative',
    concept: 'A derivative can be approximated by measuring a tiny change in function output.',
    objective: 'Complete the finite-difference formula.',
    difficulty: 'core',
    starterCode: `function numericalDerivative(f, x, h = 1e-5) {
  // TODO: return (f(x + h) - f(x)) / h.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-3) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('derivative of x^2 at 3', numericalDerivative((x) => x * x, 3), 6);
check('derivative of 2x+1 at 5', numericalDerivative((x) => 2 * x + 1, 5), 2);
check('derivative of x^3 at 2', numericalDerivative((x) => x * x * x, 2), 12);

return results;`,
    hints: [
      'Look at how much f changes after a tiny step h.',
      'Divide output change by input change.',
      'return (f(x + h) - f(x)) / h;',
    ],
    solution: `function numericalDerivative(f, x, h = 1e-5) {
  return (f(x + h) - f(x)) / h;
}`,
    explanation: 'Numerical derivatives are useful for checking gradients, though exact backprop is usually more efficient.',
  },

  {
    id: 'chain-rule-two-links',
    stepLabel: '30.1',
    group: 'Chain rule',
    title: 'Two-link chain rule',
    concept: 'The chain rule multiplies local derivatives along a path.',
    objective: 'Return outerGradient * innerGradient.',
    difficulty: 'warmup',
    starterCode: `function chainTwo(outerGradient, innerGradient) {
  // TODO: return the product of the two local gradients.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('2 then 3', chainTwo(2, 3), 6);
check('-1 then 5', chainTwo(-1, 5), -5);
check('zero stops gradient', chainTwo(10, 0), 0);

return results;`,
    hints: [
      'Chain rule multiplies derivatives.',
      'If one local derivative is zero, the path gradient is zero.',
      'return outerGradient * innerGradient;',
    ],
    solution: `function chainTwo(outerGradient, innerGradient) {
  return outerGradient * innerGradient;
}`,
    explanation: 'Backprop is repeated chain rule: gradients flow backward by multiplying local derivatives.',
  },

  {
    id: 'chain-through-square',
    stepLabel: '30.2',
    group: 'Chain rule',
    title: 'Chain through square',
    concept: 'If y = z^2 and z depends on x, then dy/dx = 2z * dz/dx.',
    objective: 'Return 2 * z * dzdx.',
    difficulty: 'core',
    starterCode: `function chainThroughSquare(z, dzdx) {
  // y = z^2
  // TODO: return dy/dx.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('z=3 dzdx=2', chainThroughSquare(3, 2), 12);
check('z=-4 dzdx=1', chainThroughSquare(-4, 1), -8);
check('z=5 dzdx=0', chainThroughSquare(5, 0), 0);

return results;`,
    hints: [
      'Derivative of z^2 with respect to z is 2z.',
      'Then multiply by dz/dx.',
      'return 2 * z * dzdx;',
    ],
    solution: `function chainThroughSquare(z, dzdx) {
  return 2 * z * dzdx;
}`,
    explanation: 'The outer function contributes 2z; the inner function contributes dz/dx.',
  },

  {
    id: 'chain-through-sigmoid',
    stepLabel: '30.3',
    group: 'Chain rule',
    title: 'Chain through sigmoid',
    concept: 'The derivative of sigmoid output s with respect to its input is s(1-s).',
    objective: 'Return upstreamGradient * s * (1 - s).',
    difficulty: 'core',
    starterCode: `function chainThroughSigmoid(sigmoidOutput, upstreamGradient) {
  // TODO: return the downstream gradient.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5 upstream=1', chainThroughSigmoid(0.5, 1), 0.25);
check('s=0.8 upstream=2', chainThroughSigmoid(0.8, 2), 0.32);
check('s=0.1 upstream=3', chainThroughSigmoid(0.1, 3), 0.27);

return results;`,
    hints: [
      'Sigmoid derivative uses the output: s * (1 - s).',
      'Multiply by upstreamGradient.',
      'return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);',
    ],
    solution: `function chainThroughSigmoid(sigmoidOutput, upstreamGradient) {
  return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);
}`,
    explanation: 'Sigmoid gradients shrink near 0 and 1, which is one reason saturated sigmoids can learn slowly.',
  },

  {
    id: 'chain-rule-add-paths',
    stepLabel: '30.4',
    group: 'Chain rule',
    title: 'Add gradients from multiple paths',
    concept: 'When one variable affects loss through multiple paths, gradients add.',
    objective: 'Return pathA + pathB.',
    difficulty: 'core',
    starterCode: `function addGradientPaths(pathA, pathB) {
  // TODO: return the total gradient from both paths.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two positive paths', addGradientPaths(2, 3), 5);
check('opposing paths', addGradientPaths(10, -4), 6);
check('one path zero', addGradientPaths(7, 0), 7);

return results;`,
    hints: [
      'Gradients from different downstream branches add together.',
      'This happens in computation graphs with reused values.',
      'return pathA + pathB;',
    ],
    solution: `function addGradientPaths(pathA, pathB) {
  return pathA + pathB;
}`,
    explanation: 'Backprop sums contributions when a value is used by more than one downstream operation.',
  },

  {
    id: 'neuron-weighted-input',
    stepLabel: '31.1',
    group: 'One neuron',
    title: 'Weighted input',
    concept: 'A neuron first computes a dot product between weights and inputs.',
    objective: 'Return dot(weights, x).',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function weightedInput(weights, x) {
  // TODO: return the weighted sum.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple weighted input', weightedInput([1, 2], [3, 4]), 11);
check('zero weight', weightedInput([0, 5], [10, 2]), 10);
check('negative weight', weightedInput([-1, 2], [3, 5]), 7);

return results;`,
    hints: [
      'A neuron uses the same dot product you learned earlier.',
      'Use the dot helper.',
      'return dot(weights, x);',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function weightedInput(weights, x) {
  return dot(weights, x);
}`,
    explanation: 'Every dense neuron starts as a dot product.',
  },

  {
    id: 'neuron-add-bias',
    stepLabel: '31.2',
    group: 'One neuron',
    title: 'Add bias',
    concept: 'A bias shifts the neuron before activation.',
    objective: 'Return weighted sum plus bias.',
    difficulty: 'warmup',
    starterCode: `function preActivation(weightedSum, bias) {
  // TODO: return weightedSum plus bias.
  return weightedSum;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive bias', preActivation(10, 2), 12);
check('negative bias', preActivation(10, -3), 7);
check('zero bias', preActivation(5, 0), 5);

return results;`,
    hints: [
      'Bias is added after the weighted sum.',
      'Return weightedSum + bias.',
      'return weightedSum + bias;',
    ],
    solution: `function preActivation(weightedSum, bias) {
  return weightedSum + bias;
}`,
    explanation: 'Bias lets the neuron shift its decision boundary or activation threshold.',
  },

  {
    id: 'neuron-relu-forward',
    stepLabel: '31.3',
    group: 'One neuron',
    title: 'ReLU activation',
    concept: 'ReLU keeps positive values and turns negative values into zero.',
    objective: 'Return max(0, z).',
    difficulty: 'warmup',
    starterCode: `function relu(z) {
  // TODO: return max(0, z).
  return z;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive', relu(3), 3);
check('negative', relu(-4), 0);
check('zero', relu(0), 0);

return results;`,
    hints: [
      'Use Math.max.',
      'ReLU is max(0, z).',
      'return Math.max(0, z);',
    ],
    solution: `function relu(z) {
  return Math.max(0, z);
}`,
    explanation: 'ReLU adds nonlinearity by gating off negative pre-activations.',
  },

  {
    id: 'neuron-forward-full',
    stepLabel: '31.4',
    group: 'One neuron',
    title: 'Full neuron forward pass',
    concept: 'A simple neuron computes ReLU(w dot x + b).',
    objective: 'Return relu(dot(weights, x) + bias).',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function relu(z) {
  return Math.max(0, z);
}

function neuronForward(weights, x, bias) {
  // TODO: return ReLU of weighted input plus bias.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive neuron', neuronForward([1, 2], [3, 4], -5), 6);
check('negative clipped', neuronForward([1, 1], [1, 1], -5), 0);
check('zero boundary', neuronForward([1, 1], [1, 1], -2), 0);

return results;`,
    hints: [
      'First compute dot(weights, x) + bias.',
      'Then pass it through relu.',
      'return relu(dot(weights, x) + bias);',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function relu(z) {
  return Math.max(0, z);
}

function neuronForward(weights, x, bias) {
  return relu(dot(weights, x) + bias);
}`,
    explanation: 'Dense neural networks are built from many versions of this pattern.',
  },

  {
    id: 'backprop-bias-gradient',
    stepLabel: '32.1',
    group: 'One-neuron backprop',
    title: 'Bias gradient',
    concept: 'For z = w dot x + b, the derivative of z with respect to b is 1.',
    objective: 'Return upstreamGradient.',
    difficulty: 'warmup',
    starterCode: `function biasGradient(upstreamGradient) {
  // TODO: return dL/db.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('upstream 3', biasGradient(3), 3);
check('upstream -2', biasGradient(-2), -2);
check('upstream 0', biasGradient(0), 0);

return results;`,
    hints: [
      'Bias is added directly.',
      'dz/db = 1, so dL/db = upstreamGradient * 1.',
      'return upstreamGradient;',
    ],
    solution: `function biasGradient(upstreamGradient) {
  return upstreamGradient;
}`,
    explanation: 'Bias receives the same upstream gradient because it shifts z by one unit per one unit of bias.',
  },

  {
    id: 'backprop-one-weight',
    stepLabel: '32.2',
    group: 'One-neuron backprop',
    title: 'One weight gradient',
    concept: 'For z = w dot x + b, dL/dw_i = upstreamGradient * x_i.',
    objective: 'Return upstreamGradient * inputValue.',
    difficulty: 'core',
    starterCode: `function weightGradient(upstreamGradient, inputValue) {
  // TODO: return dL/dw for one weight.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('input 2 upstream 3', weightGradient(3, 2), 6);
check('input 0 upstream 3', weightGradient(3, 0), 0);
check('negative upstream', weightGradient(-2, 5), -10);

return results;`,
    hints: [
      'A weight is multiplied by its input.',
      'The input scales the gradient for that weight.',
      'return upstreamGradient * inputValue;',
    ],
    solution: `function weightGradient(upstreamGradient, inputValue) {
  return upstreamGradient * inputValue;
}`,
    explanation: 'Weights connected to larger inputs receive larger gradient signals.',
  },

  {
    id: 'backprop-weight-vector',
    stepLabel: '32.3',
    group: 'One-neuron backprop',
    title: 'Weight-gradient vector',
    concept: 'Each weight gradient is upstreamGradient times the matching input.',
    objective: 'Push upstreamGradient * x[i] for each weight.',
    difficulty: 'core',
    starterCode: `function weightGradients(upstreamGradient, x) {
  const gradients = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the gradient for weight i.
    gradients.push(0);
  }

  return gradients;
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

check('upstream 3', weightGradients(3, [1, 2, 3]), [3, 6, 9]);
check('upstream -2', weightGradients(-2, [1, 0, 4]), [-2, 0, -8]);
check('upstream 0', weightGradients(0, [5, 6]), [0, 0]);

return results;`,
    hints: [
      'Loop over the input vector.',
      'Each gradient is upstreamGradient times x[i].',
      'gradients.push(upstreamGradient * x[i]);',
    ],
    solution: `function weightGradients(upstreamGradient, x) {
  const gradients = [];

  for (let i = 0; i < x.length; i++) {
    gradients.push(upstreamGradient * x[i]);
  }

  return gradients;
}`,
    explanation: 'Backprop through a dense neuron produces one gradient per weight.',
  },

  {
    id: 'backprop-input-gradient',
    stepLabel: '32.4',
    group: 'One-neuron backprop',
    title: 'Input gradients',
    concept: 'The gradient into each input is upstreamGradient times the matching weight.',
    objective: 'Push upstreamGradient * weights[i].',
    difficulty: 'core',
    starterCode: `function inputGradients(upstreamGradient, weights) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: push the gradient for input i.
    gradients.push(0);
  }

  return gradients;
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

check('upstream 3', inputGradients(3, [1, 2, 3]), [3, 6, 9]);
check('upstream -2', inputGradients(-2, [1, 0, 4]), [-2, 0, -8]);
check('upstream 0', inputGradients(0, [5, 6]), [0, 0]);

return results;`,
    hints: [
      'Inputs receive gradients through weights.',
      'Each input gradient is upstreamGradient times weights[i].',
      'gradients.push(upstreamGradient * weights[i]);',
    ],
    solution: `function inputGradients(upstreamGradient, weights) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    gradients.push(upstreamGradient * weights[i]);
  }

  return gradients;
}`,
    explanation: 'This is how gradients flow backward from one layer into the previous layer.',
  },

  {
    id: 'relu-derivative',
    stepLabel: '33.1',
    group: 'Activation gradients',
    title: 'ReLU derivative',
    concept: 'ReLU passes gradient only when the input was positive.',
    objective: 'Return 1 for positive z, otherwise 0.',
    difficulty: 'warmup',
    starterCode: `function reluDerivative(z) {
  // TODO: return 1 if z > 0, otherwise 0.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive', reluDerivative(3), 1);
check('negative', reluDerivative(-4), 0);
check('zero', reluDerivative(0), 0);

return results;`,
    hints: [
      'ReLU is active only when z > 0.',
      'Use a ternary expression.',
      'return z > 0 ? 1 : 0;',
    ],
    solution: `function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}`,
    explanation: 'A negative ReLU input blocks gradient, which can create dead units.',
  },

  {
    id: 'relu-backprop',
    stepLabel: '33.2',
    group: 'Activation gradients',
    title: 'Backprop through ReLU',
    concept: 'The upstream gradient is kept only if ReLU was active.',
    objective: 'Multiply upstreamGradient by the ReLU derivative.',
    difficulty: 'core',
    starterCode: `function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}

function reluBackward(upstreamGradient, z) {
  // TODO: return upstreamGradient times reluDerivative(z).
  return upstreamGradient;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('active ReLU', reluBackward(5, 3), 5);
check('inactive ReLU', reluBackward(5, -3), 0);
check('zero ReLU', reluBackward(5, 0), 0);
check('negative upstream active', reluBackward(-2, 4), -2);

return results;`,
    hints: [
      'Backprop multiplies by local derivative.',
      'reluDerivative(z) is either 1 or 0.',
      'return upstreamGradient * reluDerivative(z);',
    ],
    solution: `function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}

function reluBackward(upstreamGradient, z) {
  return upstreamGradient * reluDerivative(z);
}`,
    explanation: 'ReLU either passes the gradient through unchanged or blocks it entirely.',
  },

  {
    id: 'sigmoid-derivative-output',
    stepLabel: '33.3',
    group: 'Activation gradients',
    title: 'Sigmoid derivative',
    concept: 'If s = sigmoid(z), then ds/dz = s(1-s).',
    objective: 'Return s * (1 - s).',
    difficulty: 'core',
    starterCode: `function sigmoidDerivativeFromOutput(s) {
  // TODO: return s * (1 - s).
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5', sigmoidDerivativeFromOutput(0.5), 0.25);
check('s=0.8', sigmoidDerivativeFromOutput(0.8), 0.16);
check('s=0.1', sigmoidDerivativeFromOutput(0.1), 0.09);

return results;`,
    hints: [
      'Use the sigmoid output s directly.',
      'Derivative is s times one minus s.',
      'return s * (1 - s);',
    ],
    solution: `function sigmoidDerivativeFromOutput(s) {
  return s * (1 - s);
}`,
    explanation: 'Sigmoid gradients are largest near 0.5 and small near saturated outputs 0 or 1.',
  },

  {
    id: 'sigmoid-backprop',
    stepLabel: '33.4',
    group: 'Activation gradients',
    title: 'Backprop through sigmoid',
    concept: 'Sigmoid backprop multiplies upstream gradient by s(1-s).',
    objective: 'Return upstreamGradient * s * (1 - s).',
    difficulty: 'core',
    starterCode: `function sigmoidBackward(upstreamGradient, sigmoidOutput) {
  // TODO: apply the sigmoid local derivative.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5 upstream=1', sigmoidBackward(1, 0.5), 0.25);
check('s=0.8 upstream=2', sigmoidBackward(2, 0.8), 0.32);
check('s=0.1 upstream=3', sigmoidBackward(3, 0.1), 0.27);

return results;`,
    hints: [
      'Local derivative is sigmoidOutput * (1 - sigmoidOutput).',
      'Multiply by upstreamGradient.',
      'return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);',
    ],
    solution: `function sigmoidBackward(upstreamGradient, sigmoidOutput) {
  return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);
}`,
    explanation: 'Sigmoid saturation can shrink gradients during backprop.',
  },

  {
    id: 'one-hot-target',
    stepLabel: '34.1',
    group: 'Softmax cross-entropy',
    title: 'One-hot target',
    concept: 'Classification targets are often represented as one-hot vectors.',
    objective: 'Return 1 at targetIndex and 0 elsewhere.',
    difficulty: 'warmup',
    starterCode: `function oneHot(numClasses, targetIndex) {
  const y = [];

  for (let i = 0; i < numClasses; i++) {
    // TODO: push 1 for the target index, otherwise 0.
    y.push(0);
  }

  return y;
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

check('class 0 of 3', oneHot(3, 0), [1, 0, 0]);
check('class 1 of 3', oneHot(3, 1), [0, 1, 0]);
check('class 2 of 4', oneHot(4, 2), [0, 0, 1, 0]);

return results;`,
    hints: [
      'Compare i with targetIndex.',
      'Push 1 if they match, otherwise 0.',
      'y.push(i === targetIndex ? 1 : 0);',
    ],
    solution: `function oneHot(numClasses, targetIndex) {
  const y = [];

  for (let i = 0; i < numClasses; i++) {
    y.push(i === targetIndex ? 1 : 0);
  }

  return y;
}`,
    explanation: 'A one-hot vector says which class is the true class.',
  },

  {
    id: 'cross-entropy-one-hot',
    stepLabel: '34.2',
    group: 'Softmax cross-entropy',
    title: 'Cross-entropy from true class probability',
    concept: 'For a one-hot label, cross-entropy is -log(probability of the true class).',
    objective: 'Return -Math.log(probabilities[targetIndex]).',
    difficulty: 'core',
    starterCode: `function crossEntropyFromTarget(probabilities, targetIndex) {
  // TODO: return negative log probability of the true class.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p=0.5', crossEntropyFromTarget([0.5, 0.5], 0), -Math.log(0.5));
check('p=0.8', crossEntropyFromTarget([0.1, 0.8, 0.1], 1), -Math.log(0.8));
check('p=0.25', crossEntropyFromTarget([0.25, 0.25, 0.5], 0), -Math.log(0.25));

return results;`,
    hints: [
      'Only the probability assigned to the true class matters for one-hot cross-entropy.',
      'Use probabilities[targetIndex].',
      'return -Math.log(probabilities[targetIndex]);',
    ],
    solution: `function crossEntropyFromTarget(probabilities, targetIndex) {
  return -Math.log(probabilities[targetIndex]);
}`,
    explanation: 'Cross-entropy strongly penalizes assigning low probability to the true class.',
  },

  {
    id: 'softmax-cross-entropy-gradient',
    stepLabel: '34.3',
    group: 'Softmax cross-entropy',
    title: 'Softmax + CE gradient',
    concept: 'For softmax followed by cross-entropy, the logit gradient is probabilities minus one-hot target.',
    objective: 'Push probabilities[i] - target[i].',
    difficulty: 'challenge',
    starterCode: `function softmaxCrossEntropyGradient(probabilities, targetIndex) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetIndex ? 1 : 0;

    // TODO: push probability minus target.
    gradient.push(0);
  }

  return gradient;
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

check('binary target 0', softmaxCrossEntropyGradient([0.7, 0.3], 0), [-0.3, 0.3]);
check('binary target 1', softmaxCrossEntropyGradient([0.7, 0.3], 1), [0.7, -0.7]);
check('three classes', softmaxCrossEntropyGradient([0.1, 0.8, 0.1], 1), [0.1, -0.2, 0.1]);

return results;`,
    hints: [
      'This is the famous simplification: gradient = p - y.',
      'target is already 1 for the true class and 0 otherwise.',
      'gradient.push(probabilities[i] - target);',
    ],
    solution: `function softmaxCrossEntropyGradient(probabilities, targetIndex) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetIndex ? 1 : 0;
    gradient.push(probabilities[i] - target);
  }

  return gradient;
}`,
    explanation: 'The true class gets pushed up when its probability is too low; other classes get pushed down.',
  },

  {
    id: 'softmax-gradient-sum-zero',
    stepLabel: '34.4',
    group: 'Softmax cross-entropy',
    title: 'Softmax gradient sums to zero',
    concept: 'Softmax logits compete: increasing one class decreases others, so gradients sum to zero.',
    objective: 'Return the sum of the gradient entries.',
    difficulty: 'core',
    starterCode: `function gradientSum(gradient) {
  let total = 0;

  for (let i = 0; i < gradient.length; i++) {
    // TODO: add the current gradient entry.
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

check('binary gradient', gradientSum([-0.3, 0.3]), 0);
check('three-class gradient', gradientSum([0.1, -0.2, 0.1]), 0);
check('general sum', gradientSum([0.25, 0.25, -0.5]), 0);

return results;`,
    hints: [
      'Loop over the gradient entries.',
      'Add each entry into total.',
      'total += gradient[i];',
    ],
    solution: `function gradientSum(gradient) {
  let total = 0;

  for (let i = 0; i < gradient.length; i++) {
    total += gradient[i];
  }

  return total;
}`,
    explanation: 'Softmax probabilities are coupled; probability mass shifts between classes.',
  },

  {
    id: 'batch-size',
    stepLabel: '35.1',
    group: 'Batch matrix shapes',
    title: 'Batch size',
    concept: 'A batch matrix has one row per example.',
    objective: 'Return the number of examples in X.',
    difficulty: 'warmup',
    starterCode: `function batchSize(X) {
  // TODO: return the number of rows.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two examples', batchSize([[1, 2], [3, 4]]), 2);
check('three examples', batchSize([[1], [2], [3]]), 3);
check('one example', batchSize([[5, 6, 7]]), 1);

return results;`,
    hints: [
      'Rows are examples.',
      'The number of rows is X.length.',
      'return X.length;',
    ],
    solution: `function batchSize(X) {
  return X.length;
}`,
    explanation: 'In many ML libraries, a data batch X has shape batch x features.',
  },

  {
    id: 'feature-count',
    stepLabel: '35.2',
    group: 'Batch matrix shapes',
    title: 'Feature count',
    concept: 'A batch matrix has one column per input feature.',
    objective: 'Return the number of columns in X.',
    difficulty: 'warmup',
    starterCode: `function featureCount(X) {
  // TODO: return the number of features.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two features', featureCount([[1, 2], [3, 4]]), 2);
check('one feature', featureCount([[1], [2], [3]]), 1);
check('three features', featureCount([[5, 6, 7]]), 3);

return results;`,
    hints: [
      'Features are columns.',
      'The first row length gives the number of features.',
      'return X[0].length;',
    ],
    solution: `function featureCount(X) {
  return X[0].length;
}`,
    explanation: 'The feature count determines how many input weights each neuron needs.',
  },

  {
    id: 'dense-output-shape',
    stepLabel: '35.3',
    group: 'Batch matrix shapes',
    title: 'Dense layer output shape',
    concept: 'If X is batch x inputDim and W is inputDim x outputDim, then XW is batch x outputDim.',
    objective: 'Return [batchSize, outputDim].',
    difficulty: 'core',
    starterCode: `function denseOutputShape(X, W) {
  const batch = X.length;
  const outputDim = W[0].length;

  // TODO: return the output shape.
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

check('2x3 times 3x4', denseOutputShape([[1,2,3],[4,5,6]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), [2, 4]);
check('1x2 times 2x3', denseOutputShape([[1,2]], [[1,2,3],[4,5,6]]), [1, 3]);
check('3x1 times 1x2', denseOutputShape([[1],[2],[3]], [[4,5]]), [3, 2]);

return results;`,
    hints: [
      'Rows come from X.',
      'Output columns come from W.',
      'return [batch, outputDim];',
    ],
    solution: `function denseOutputShape(X, W) {
  const batch = X.length;
  const outputDim = W[0].length;
  return [batch, outputDim];
}`,
    explanation: 'Dense layers are matrix multiplication with a batch dimension.',
  },

  {
    id: 'dense-shape-compatible',
    stepLabel: '35.4',
    group: 'Batch matrix shapes',
    title: 'Dense layer shape check',
    concept: 'The feature count of X must match the input dimension of W.',
    objective: 'Return whether X and W can multiply.',
    difficulty: 'core',
    starterCode: `function denseShapesCompatible(X, W) {
  const inputFeatures = X[0].length;
  const weightInputDim = W.length;

  // TODO: return whether the inner dimensions match.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('2x3 and 3x4 compatible', denseShapesCompatible([[1,2,3],[4,5,6]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), true);
check('2x2 and 3x4 incompatible', denseShapesCompatible([[1,2],[3,4]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), false);
check('1x2 and 2x1 compatible', denseShapesCompatible([[1,2]], [[3],[4]]), true);

return results;`,
    hints: [
      'The inner dimensions must match.',
      'Compare X[0].length with W.length.',
      'return inputFeatures === weightInputDim;',
    ],
    solution: `function denseShapesCompatible(X, W) {
  const inputFeatures = X[0].length;
  const weightInputDim = W.length;
  return inputFeatures === weightInputDim;
}`,
    explanation: 'Many neural-network bugs are shape bugs. This check catches the most common dense-layer mismatch.',
  },

  {
    id: 'dense-add-bias-each-row',
    stepLabel: '35.5',
    group: 'Batch matrix shapes',
    title: 'Add bias to each row',
    concept: 'Dense-layer bias is added to every example in the batch.',
    objective: 'Add bias[col] to each output cell.',
    difficulty: 'challenge',
    starterCode: `function addBias(Y, bias) {
  const result = [];

  for (let row = 0; row < Y.length; row++) {
    const values = [];

    for (let col = 0; col < Y[0].length; col++) {
      // TODO: add the bias for this output feature.
      values.push(Y[row][col]);
    }

    result.push(values);
  }

  return result;
}`,
    testCode: `const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('add bias to two rows', addBias([[1,2],[3,4]], [10,20]), [[11,22],[13,24]]);
check('zero bias', addBias([[1,2,3]], [0,0,0]), [[1,2,3]]);
check('negative bias', addBias([[5,5]], [-1,2]), [[4,7]]);

return results;`,
    hints: [
      'Bias has one value per output column.',
      'Use bias[col].',
      'values.push(Y[row][col] + bias[col]);',
    ],
    solution: `function addBias(Y, bias) {
  const result = [];

  for (let row = 0; row < Y.length; row++) {
    const values = [];

    for (let col = 0; col < Y[0].length; col++) {
      values.push(Y[row][col] + bias[col]);
    }

    result.push(values);
  }

  return result;
}`,
    explanation: 'Bias broadcasts across the batch: every example gets the same output-feature offsets.',
  },

  {
    id: 'dense-one-output-neuron',
    stepLabel: '36.1',
    group: 'Mini neural network layer',
    title: 'One dense output',
    concept: 'One dense-layer output is one input vector dotted with one weight vector plus bias.',
    objective: 'Return dot(x, weights) + bias.',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseOne(x, weights, bias) {
  // TODO: return dot(x, weights) + bias.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple dense output', denseOne([1, 2], [3, 4], 0), 11);
check('with bias', denseOne([1, 2], [3, 4], -1), 10);
check('negative weight', denseOne([-1, 2], [3, 5], 1), 8);

return results;`,
    hints: [
      'A dense neuron is a dot product plus a bias.',
      'Use the dot helper.',
      'return dot(x, weights) + bias;',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseOne(x, weights, bias) {
  return dot(x, weights) + bias;
}`,
    explanation: 'A dense layer is many versions of this one-neuron calculation.',
  },

  {
    id: 'dense-multiple-outputs',
    stepLabel: '36.2',
    group: 'Mini neural network layer',
    title: 'Multiple dense outputs',
    concept: 'A dense layer has one weight vector and one bias per output feature.',
    objective: 'Push one output for each output weight vector.',
    difficulty: 'core',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  const outputs = [];

  for (let j = 0; j < weightColumns.length; j++) {
    // TODO: push dot(x, weightColumns[j]) + biases[j].
    outputs.push(0);
  }

  return outputs;
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

check('two outputs', denseLayer([1, 2], [[3, 4], [5, 6]], [0, 1]), [11, 18]);
check('three outputs', denseLayer([2, 1], [[1, 0], [0, 1], [1, 1]], [0, 0, -1]), [2, 1, 2]);

return results;`,
    hints: [
      'Each output j has its own weight vector and bias.',
      'Use dot(x, weightColumns[j]) + biases[j].',
      'outputs.push(dot(x, weightColumns[j]) + biases[j]);',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseLayer(x, weightColumns, biases) {
  const outputs = [];

  for (let j = 0; j < weightColumns.length; j++) {
    outputs.push(dot(x, weightColumns[j]) + biases[j]);
  }

  return outputs;
}`,
    explanation: 'A dense layer maps one input vector to several output features by using several weight vectors.',
  },

  {
    id: 'dense-relu-vector',
    stepLabel: '36.3',
    group: 'Mini neural network layer',
    title: 'ReLU on a vector',
    concept: 'Neural layers apply activations element by element.',
    objective: 'Push Math.max(0, values[i]) for every coordinate.',
    difficulty: 'warmup',
    starterCode: `function reluVector(values) {
  const activated = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: push ReLU of values[i].
    activated.push(values[i]);
  }

  return activated;
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

check('mixed values', reluVector([-2, 0, 3]), [0, 0, 3]);
check('all positive', reluVector([1, 2, 3]), [1, 2, 3]);
check('all negative', reluVector([-1, -2]), [0, 0]);

return results;`,
    hints: [
      'ReLU is max(0, value).',
      'Use Math.max(0, values[i]).',
      'activated.push(Math.max(0, values[i]));',
    ],
    solution: `function reluVector(values) {
  const activated = [];

  for (let i = 0; i < values.length; i++) {
    activated.push(Math.max(0, values[i]));
  }

  return activated;
}`,
    explanation: 'Activations usually apply coordinate by coordinate after a linear transformation.',
  },

  {
    id: 'two-layer-mini-network',
    stepLabel: '36.4',
    group: 'Mini neural network layer',
    title: 'Two-layer mini network',
    concept: 'A simple network can be dense -> ReLU -> dense.',
    objective: 'Feed hidden activations into the output layer.',
    difficulty: 'challenge',
    starterCode: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function reluVector(values) {
  return values.map((value) => Math.max(0, value));
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function twoLayerNetwork(x, hiddenWeights, hiddenBiases, outputWeights, outputBiases) {
  const hiddenPre = denseLayer(x, hiddenWeights, hiddenBiases);
  const hidden = reluVector(hiddenPre);

  // TODO: return the output dense layer applied to hidden.
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

check('two-layer network', twoLayerNetwork([1, 2], [[1, 0], [0, 1]], [0, 0], [[1, 1]], [0]), [3]);
check('hidden ReLU clips negative', twoLayerNetwork([-1, 2], [[1, 0], [0, 1]], [0, 0], [[1, 1]], [0]), [2]);

return results;`,
    hints: [
      'The hidden activations are already computed.',
      'Use denseLayer(hidden, outputWeights, outputBiases).',
      'return denseLayer(hidden, outputWeights, outputBiases);',
    ],
    solution: `function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function reluVector(values) {
  return values.map((value) => Math.max(0, value));
}

function denseLayer(x, weightColumns, biases) {
  return weightColumns.map((weights, j) => dot(x, weights) + biases[j]);
}

function twoLayerNetwork(x, hiddenWeights, hiddenBiases, outputWeights, outputBiases) {
  const hiddenPre = denseLayer(x, hiddenWeights, hiddenBiases);
  const hidden = reluVector(hiddenPre);
  return denseLayer(hidden, outputWeights, outputBiases);
}`,
    explanation: 'Stacking layers means using one layer output as the next layer input.',
  },

  {
    id: 'training-loop-one-prediction',
    stepLabel: '37.1',
    group: 'Training loop mechanics',
    title: 'One prediction',
    concept: 'Training begins with a prediction from current parameters.',
    objective: 'Return weight * x + bias.',
    difficulty: 'warmup',
    starterCode: `function predictLinear(x, weight, bias) {
  // TODO: return weight * x + bias.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predict 2*3+1', predictLinear(3, 2, 1), 7);
check('predict -1*4+2', predictLinear(4, -1, 2), -2);
check('bias only', predictLinear(10, 0, 5), 5);

return results;`,
    hints: [
      'Linear prediction is slope times input plus bias.',
      'Use weight * x + bias.',
      'return weight * x + bias;',
    ],
    solution: `function predictLinear(x, weight, bias) {
  return weight * x + bias;
}`,
    explanation: 'A training loop repeatedly predicts, measures error, computes gradients, and updates parameters.',
  },

  {
    id: 'training-loop-one-loss',
    stepLabel: '37.2',
    group: 'Training loop mechanics',
    title: 'One-example loss',
    concept: 'Squared error loss measures prediction error squared.',
    objective: 'Return (prediction - target)^2.',
    difficulty: 'warmup',
    starterCode: `function squaredLoss(prediction, target) {
  const error = prediction - target;

  // TODO: return squared error.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('error 3', squaredLoss(10, 7), 9);
check('error -5', squaredLoss(4, 9), 25);
check('perfect', squaredLoss(5, 5), 0);

return results;`,
    hints: [
      'Squared error means error times error.',
      'The error variable is already computed.',
      'return error * error;',
    ],
    solution: `function squaredLoss(prediction, target) {
  const error = prediction - target;
  return error * error;
}`,
    explanation: 'The loss is the number the training loop tries to reduce.',
  },

  {
    id: 'training-loop-average-loss',
    stepLabel: '37.3',
    group: 'Training loop mechanics',
    title: 'Average batch loss',
    concept: 'Batch loss averages losses over examples.',
    objective: 'Divide total loss by the number of examples.',
    difficulty: 'core',
    starterCode: `function averageLoss(losses) {
  let total = 0;

  for (let i = 0; i < losses.length; i++) {
    total += losses[i];
  }

  // TODO: return the average loss.
  return total;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('average [1,2,3]', averageLoss([1, 2, 3]), 2);
check('average [10,20]', averageLoss([10, 20]), 15);
check('average zeros', averageLoss([0, 0, 0]), 0);

return results;`,
    hints: [
      'Average means total divided by count.',
      'The count is losses.length.',
      'return total / losses.length;',
    ],
    solution: `function averageLoss(losses) {
  let total = 0;

  for (let i = 0; i < losses.length; i++) {
    total += losses[i];
  }

  return total / losses.length;
}`,
    explanation: 'Training reports average loss so batches of different sizes are comparable.',
  },

  {
    id: 'training-loop-step-summary',
    stepLabel: '37.4',
    group: 'Training loop mechanics',
    title: 'One training step',
    concept: 'A training step computes prediction, error, gradients, and updated parameters.',
    objective: 'Return updated weight after one gradient step.',
    difficulty: 'challenge',
    starterCode: `function oneStepWeightUpdate(x, target, weight, bias, learningRate) {
  const prediction = weight * x + bias;
  const error = prediction - target;

  // Gradient of squared error without the factor 2 for simplicity.
  const weightGradient = error * x;

  // TODO: return updated weight.
  return weight;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('update decreases high prediction', oneStepWeightUpdate(2, 3, 2, 0, 0.1), 1.8);
check('update increases low prediction', oneStepWeightUpdate(2, 10, 2, 0, 0.1), 3.2);
check('perfect no update', oneStepWeightUpdate(2, 4, 2, 0, 0.1), 2);

return results;`,
    hints: [
      'Gradient descent subtracts learningRate * gradient.',
      'The weightGradient is already computed.',
      'return weight - learningRate * weightGradient;',
    ],
    solution: `function oneStepWeightUpdate(x, target, weight, bias, learningRate) {
  const prediction = weight * x + bias;
  const error = prediction - target;
  const weightGradient = error * x;

  return weight - learningRate * weightGradient;
}`,
    explanation: 'One training step nudges parameters opposite the gradient.',
  },

  {
    id: 'optimizer-sgd-update',
    stepLabel: '38.1',
    group: 'Optimizer updates',
    title: 'SGD update',
    concept: 'Stochastic gradient descent subtracts learningRate times gradient.',
    objective: 'Return parameter - learningRate * gradient.',
    difficulty: 'warmup',
    starterCode: `function sgdUpdate(parameter, gradient, learningRate) {
  // TODO: return the updated parameter.
  return parameter;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive gradient', sgdUpdate(1, 3, 0.1), 0.7);
check('negative gradient', sgdUpdate(1, -2, 0.5), 2);
check('zero gradient', sgdUpdate(5, 0, 0.1), 5);

return results;`,
    hints: [
      'Move opposite the gradient.',
      'Subtract learningRate * gradient.',
      'return parameter - learningRate * gradient;',
    ],
    solution: `function sgdUpdate(parameter, gradient, learningRate) {
  return parameter - learningRate * gradient;
}`,
    explanation: 'SGD is the simplest optimizer: follow the negative gradient.',
  },

  {
    id: 'optimizer-momentum-velocity',
    stepLabel: '38.2',
    group: 'Optimizer updates',
    title: 'Momentum velocity',
    concept: 'Momentum keeps a moving velocity of recent gradients.',
    objective: 'Return beta * velocity + gradient.',
    difficulty: 'core',
    starterCode: `function updateVelocity(velocity, gradient, beta) {
  // TODO: combine old velocity and current gradient.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('new velocity', updateVelocity(0, 3, 0.9), 3);
check('carry velocity', updateVelocity(10, 3, 0.9), 12);
check('negative gradient', updateVelocity(5, -2, 0.8), 2);

return results;`,
    hints: [
      'Momentum mixes previous velocity with current gradient.',
      'Use beta * velocity + gradient.',
      'return beta * velocity + gradient;',
    ],
    solution: `function updateVelocity(velocity, gradient, beta) {
  return beta * velocity + gradient;
}`,
    explanation: 'Momentum smooths updates by remembering previous gradient direction.',
  },

  {
    id: 'optimizer-momentum-update',
    stepLabel: '38.3',
    group: 'Optimizer updates',
    title: 'Momentum update',
    concept: 'Momentum updates parameters using velocity rather than the raw current gradient only.',
    objective: 'Subtract learningRate times velocity.',
    difficulty: 'core',
    starterCode: `function momentumParameterUpdate(parameter, velocity, learningRate) {
  // TODO: update parameter using velocity.
  return parameter;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('velocity 3', momentumParameterUpdate(1, 3, 0.1), 0.7);
check('negative velocity', momentumParameterUpdate(1, -2, 0.5), 2);
check('zero velocity', momentumParameterUpdate(5, 0, 0.1), 5);

return results;`,
    hints: [
      'Velocity acts like the gradient direction to follow.',
      'Subtract learningRate * velocity.',
      'return parameter - learningRate * velocity;',
    ],
    solution: `function momentumParameterUpdate(parameter, velocity, learningRate) {
  return parameter - learningRate * velocity;
}`,
    explanation: 'Momentum can accelerate updates in consistent directions and damp zig-zagging.',
  },

  {
    id: 'optimizer-adam-first-moment',
    stepLabel: '38.4',
    group: 'Optimizer updates',
    title: 'Adam first moment',
    concept: 'Adam keeps an exponential moving average of gradients.',
    objective: 'Return beta1 * m + (1 - beta1) * gradient.',
    difficulty: 'core',
    starterCode: `function adamFirstMoment(m, gradient, beta1) {
  // TODO: update the first moment estimate.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('first moment from zero', adamFirstMoment(0, 10, 0.9), 1);
check('carry moment', adamFirstMoment(5, 10, 0.9), 5.5);
check('negative gradient', adamFirstMoment(1, -9, 0.8), -1);

return results;`,
    hints: [
      'Adam first moment is a weighted average of old m and new gradient.',
      'Use beta1 for old m and 1 - beta1 for gradient.',
      'return beta1 * m + (1 - beta1) * gradient;',
    ],
    solution: `function adamFirstMoment(m, gradient, beta1) {
  return beta1 * m + (1 - beta1) * gradient;
}`,
    explanation: 'Adam first moment behaves like momentum but with exponential averaging.',
  },

  {
    id: 'optimizer-adam-second-moment',
    stepLabel: '38.5',
    group: 'Optimizer updates',
    title: 'Adam second moment',
    concept: 'Adam tracks an exponential moving average of squared gradients.',
    objective: 'Return beta2 * v + (1 - beta2) * gradient squared.',
    difficulty: 'core',
    starterCode: `function adamSecondMoment(v, gradient, beta2) {
  // TODO: update the second moment estimate.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('second moment from zero', adamSecondMoment(0, 10, 0.99), 1);
check('carry second moment', adamSecondMoment(5, 10, 0.9), 14.5);
check('negative gradient squares', adamSecondMoment(0, -3, 0.9), 0.9);

return results;`,
    hints: [
      'Use gradient * gradient.',
      'Mix old v with squared gradient.',
      'return beta2 * v + (1 - beta2) * gradient * gradient;',
    ],
    solution: `function adamSecondMoment(v, gradient, beta2) {
  return beta2 * v + (1 - beta2) * gradient * gradient;
}`,
    explanation: 'Adam uses the second moment to scale updates by recent gradient magnitude.',
  },

  {
    id: 'regularization-l2-penalty',
    stepLabel: '39.1',
    group: 'Regularization',
    title: 'L2 penalty',
    concept: 'L2 regularization penalizes large weights by adding lambda times sum of squared weights.',
    objective: 'Accumulate weight squared.',
    difficulty: 'core',
    starterCode: `function l2Penalty(weights, lambda) {
  let sumSquares = 0;

  for (let i = 0; i < weights.length; i++) {
    // TODO: add squared weight.
    sumSquares += 0;
  }

  return lambda * sumSquares;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('simple L2', l2Penalty([3, 4], 1), 25);
check('lambda half', l2Penalty([3, 4], 0.5), 12.5);
check('zero weights', l2Penalty([0, 0], 10), 0);

return results;`,
    hints: [
      'L2 uses squared weights.',
      'Add weights[i] * weights[i].',
      'sumSquares += weights[i] * weights[i];',
    ],
    solution: `function l2Penalty(weights, lambda) {
  let sumSquares = 0;

  for (let i = 0; i < weights.length; i++) {
    sumSquares += weights[i] * weights[i];
  }

  return lambda * sumSquares;
}`,
    explanation: 'L2 discourages very large weights, often improving generalization.',
  },

  {
    id: 'regularization-l2-gradient',
    stepLabel: '39.2',
    group: 'Regularization',
    title: 'L2 gradient',
    concept: 'The derivative of lambda times w squared with respect to w is 2 * lambda * w.',
    objective: 'Push 2 * lambda * weight.',
    difficulty: 'core',
    starterCode: `function l2Gradient(weights, lambda) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: push the L2 gradient for this weight.
    gradients.push(0);
  }

  return gradients;
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

check('lambda 1', l2Gradient([3, 4], 1), [6, 8]);
check('lambda half', l2Gradient([3, 4], 0.5), [3, 4]);
check('negative weights', l2Gradient([-1, 2], 1), [-2, 4]);

return results;`,
    hints: [
      'Derivative of w squared is 2w.',
      'Multiply by lambda.',
      'gradients.push(2 * lambda * weights[i]);',
    ],
    solution: `function l2Gradient(weights, lambda) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    gradients.push(2 * lambda * weights[i]);
  }

  return gradients;
}`,
    explanation: 'L2 gradient pulls weights toward zero.',
  },

  {
    id: 'regularization-dropout-mask',
    stepLabel: '39.3',
    group: 'Regularization',
    title: 'Apply dropout mask',
    concept: 'Dropout removes selected activations during training.',
    objective: 'Multiply each activation by its mask value.',
    difficulty: 'warmup',
    starterCode: `function applyDropoutMask(activations, mask) {
  const dropped = [];

  for (let i = 0; i < activations.length; i++) {
    // TODO: multiply activation by mask.
    dropped.push(activations[i]);
  }

  return dropped;
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

check('drop middle', applyDropoutMask([1, 2, 3], [1, 0, 1]), [1, 0, 3]);
check('drop all', applyDropoutMask([1, 2], [0, 0]), [0, 0]);
check('keep all', applyDropoutMask([1, 2], [1, 1]), [1, 2]);

return results;`,
    hints: [
      'Mask values are 0 or 1.',
      'Multiply activations[i] by mask[i].',
      'dropped.push(activations[i] * mask[i]);',
    ],
    solution: `function applyDropoutMask(activations, mask) {
  const dropped = [];

  for (let i = 0; i < activations.length; i++) {
    dropped.push(activations[i] * mask[i]);
  }

  return dropped;
}`,
    explanation: 'Dropout forces the network not to rely too heavily on any one activation.',
  },

  {
    id: 'regularization-inverted-dropout',
    stepLabel: '39.4',
    group: 'Regularization',
    title: 'Inverted dropout scaling',
    concept: 'Inverted dropout divides kept activations by keep probability.',
    objective: 'Apply mask and divide by keepProbability.',
    difficulty: 'core',
    starterCode: `function invertedDropout(activations, mask, keepProbability) {
  const output = [];

  for (let i = 0; i < activations.length; i++) {
    // TODO: apply inverted dropout scaling.
    output.push(activations[i]);
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

check('keep prob 0.5', invertedDropout([1, 2, 3], [1, 0, 1], 0.5), [2, 0, 6]);
check('keep prob 1', invertedDropout([1, 2], [1, 1], 1), [1, 2]);
check('drop all', invertedDropout([1, 2], [0, 0], 0.5), [0, 0]);

return results;`,
    hints: [
      'First multiply by mask[i].',
      'Then divide by keepProbability.',
      'output.push((activations[i] * mask[i]) / keepProbability);',
    ],
    solution: `function invertedDropout(activations, mask, keepProbability) {
  const output = [];

  for (let i = 0; i < activations.length; i++) {
    output.push((activations[i] * mask[i]) / keepProbability);
  }

  return output;
}`,
    explanation: 'Inverted dropout keeps expected activation scale roughly stable during training.',
  },

  {
    id: 'matmul-backprop-a-entry',
    stepLabel: '40.1',
    group: 'Matrix multiplication backprop',
    title: 'Gradient for A entry',
    concept: 'If C[i][j] = sum over k of A[i][k] * B[k][j], then the derivative with respect to A[i][k] is B[k][j].',
    objective: 'Return B[k][j].',
    difficulty: 'core',
    starterCode: `function gradCellWithRespectToA(B, k, j) {
  // TODO: return the derivative of C[i][j] with respect to A[i][k].
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const B = [
  [2, 1, 3],
  [1, 4, 2],
];

check('k=0 j=0', gradCellWithRespectToA(B, 0, 0), 2);
check('k=0 j=2', gradCellWithRespectToA(B, 0, 2), 3);
check('k=1 j=1', gradCellWithRespectToA(B, 1, 1), 4);

return results;`,
    hints: [
      'A[i][k] is multiplied by B[k][j].',
      'The derivative with respect to A[i][k] is B[k][j].',
      'return B[k][j];',
    ],
    solution: `function gradCellWithRespectToA(B, k, j) {
  return B[k][j];
}`,
    explanation: 'Backprop through multiplication sends the other factor backward.',
  },

  {
    id: 'matmul-backprop-b-entry',
    stepLabel: '40.2',
    group: 'Matrix multiplication backprop',
    title: 'Gradient for B entry',
    concept: 'If C[i][j] = sum over k of A[i][k] * B[k][j], then the derivative with respect to B[k][j] is A[i][k].',
    objective: 'Return A[i][k].',
    difficulty: 'core',
    starterCode: `function gradCellWithRespectToB(A, i, k) {
  // TODO: return the derivative of C[i][j] with respect to B[k][j].
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const A = [
  [1, 2],
  [3, 1],
];

check('i=0 k=0', gradCellWithRespectToB(A, 0, 0), 1);
check('i=0 k=1', gradCellWithRespectToB(A, 0, 1), 2);
check('i=1 k=0', gradCellWithRespectToB(A, 1, 0), 3);

return results;`,
    hints: [
      'B[k][j] is multiplied by A[i][k].',
      'The derivative with respect to B[k][j] is A[i][k].',
      'return A[i][k];',
    ],
    solution: `function gradCellWithRespectToB(A, i, k) {
  return A[i][k];
}`,
    explanation: 'Again, the gradient through multiplication sends the other factor backward.',
  },

  {
    id: 'matmul-backprop-dA',
    stepLabel: '40.3',
    group: 'Matrix multiplication backprop',
    title: 'dA from dC',
    concept: 'For C = AB, the gradient with respect to A is dC times B transposed.',
    objective: 'Return matmul(dC, transpose(B)).',
    difficulty: 'challenge',
    starterCode: `function transpose(A) {
  const T = [];
  for (let j = 0; j < A[0].length; j++) {
    const row = [];
    for (let i = 0; i < A.length; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }
  return T;
}

function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < B[0].length; j++) {
      row.push(matrixCell(A, B, i, j));
    }
    C.push(row);
  }
  return C;
}

function gradA(dC, B) {
  // TODO: return dC times B transposed.
  return [];
}`,
    testCode: `const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('dA simple', gradA([[1, 0]], [[2, 3], [4, 5]]), [[2, 4]]);
check('dA two rows', gradA([[1, 1], [0, 1]], [[2, 3], [4, 5]]), [[5, 9], [3, 5]]);

return results;`,
    hints: [
      'The formula is dA = dC times B transpose.',
      'Use transpose(B).',
      'return matmul(dC, transpose(B));',
    ],
    solution: `function transpose(A) {
  const T = [];
  for (let j = 0; j < A[0].length; j++) {
    const row = [];
    for (let i = 0; i < A.length; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }
  return T;
}

function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < B[0].length; j++) {
      row.push(matrixCell(A, B, i, j));
    }
    C.push(row);
  }
  return C;
}

function gradA(dC, B) {
  return matmul(dC, transpose(B));
}`,
    explanation: 'Matrix backprop uses transposes to send gradients to the correct side of the multiplication.',
  },

  {
    id: 'matmul-backprop-dB',
    stepLabel: '40.4',
    group: 'Matrix multiplication backprop',
    title: 'dB from dC',
    concept: 'For C = AB, the gradient with respect to B is A transposed times dC.',
    objective: 'Return matmul(transpose(A), dC).',
    difficulty: 'challenge',
    starterCode: `function transpose(A) {
  const T = [];
  for (let j = 0; j < A[0].length; j++) {
    const row = [];
    for (let i = 0; i < A.length; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }
  return T;
}

function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < B[0].length; j++) {
      row.push(matrixCell(A, B, i, j));
    }
    C.push(row);
  }
  return C;
}

function gradB(A, dC) {
  // TODO: return A transposed times dC.
  return [];
}`,
    testCode: `const results = [];

function sameMatrix(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameMatrix(actual, expected),
  });
}

check('dB simple', gradB([[2, 4]], [[1, 0]]), [[2, 0], [4, 0]]);
check('dB two examples', gradB([[1, 2], [3, 4]], [[1, 0], [0, 1]]), [[1, 3], [2, 4]]);

return results;`,
    hints: [
      'The formula is dB = A transpose times dC.',
      'Use transpose(A).',
      'return matmul(transpose(A), dC);',
    ],
    solution: `function transpose(A) {
  const T = [];
  for (let j = 0; j < A[0].length; j++) {
    const row = [];
    for (let i = 0; i < A.length; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }
  return T;
}

function matrixCell(A, B, row, col) {
  let total = 0;
  for (let k = 0; k < B.length; k++) {
    total += A[row][k] * B[k][col];
  }
  return total;
}

function matmul(A, B) {
  const C = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < B[0].length; j++) {
      row.push(matrixCell(A, B, i, j));
    }
    C.push(row);
  }
  return C;
}

function gradB(A, dC) {
  return matmul(transpose(A), dC);
}`,
    explanation: 'This is the dense-layer weight-gradient formula used in neural-network training.',
  },

  // --- WAVE 4: NEURAL NETWORKS & ADVANCED MODELS ---
  {
    id: 'lstm-gates-f-i',
    stepLabel: '31.1',
    group: 'Forget and input gates',
    title: 'LSTM Forget and Input Gates',
    concept: 'An LSTM cell uses sigmoid forget and input gates to control how much past memory to keep and how much new input to write.',
    objective: 'Inside lstmCell, compute forget gate f and input gate i from x, hPrev, and params.',
    difficulty: 'warmup',
    starterCode: `/**
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
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0.5, uf: 0.5, bf: 0, wi: -0.5, ui: 1, bi: 0.2, wc: 0.8, uc: 0.2, bc: -0.1, wo: 0.5, uo: 0.5, bo: -0.2 };
const out = lstmCell(1, 1, 0, p);
check('forget gate', out.f, 0.731058);
check('input gate', out.i, 0.668187);
return results;`,
    hints: [
      'Forget pre-activation: params.wf * x + params.uf * hPrev + params.bf.',
      'Input pre-activation: params.wi * x + params.ui * hPrev + params.bi.',
      'Apply sigmoid to both scores.',
    ],
    solution: `/**
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
}`,
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
    starterCode: `/**
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
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 0, wi: 0, ui: 0, bi: 0, wc: 0.8, uc: 0.2, bc: -0.1, wo: 0, uo: 0, bo: 0 };
check('candidate positive', lstmCell(1, 2, 0, p).cCand, 0.800499);
check('candidate zero', lstmCell(0, 0, 0, p).cCand, -0.099667);
return results;`,
    hints: [
      'Candidate score is params.wc * x + params.uc * hPrev + params.bc.',
      'Return Math.tanh(score).',
    ],
    solution: `/**
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
}`,
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
    starterCode: `/**
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
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 0, wi: 0, ui: 0, bi: 0, wc: 0, uc: 0, bc: 0, wo: 0, uo: 0, bo: 0 };
check('fusion standard', lstmCell(0, 0, 2, { ...p, wf: 0, uf: 0, bf: 20, wi: 0, ui: 0, bi: -20, wc: 1, uc: 0, bc: 0 }).c, 2.0);
check('full forget', lstmCell(0, 0, 10, { ...p, wf: 0, uf: 0, bf: -20, wi: 0, ui: 0, bi: -20, wc: 1, uc: 0, bc: 0 }).c, 0);
check('keep only history', lstmCell(0, 0, 10, { ...p, wf: 0, uf: 0, bf: 20, wi: 0, ui: 0, bi: -20, wc: 0, uc: 0, bc: 0 }).c, 10);
return results;`,
    hints: [
      'Scale cPrev by f and cCand by i.',
      'Add the two scaled terms.',
    ],
    solution: `/**
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
}`,
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
    starterCode: `/**
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
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const p = { wf: 0, uf: 0, bf: 20, wi: 0, ui: 0, bi: -20, wc: 0, uc: 0, bc: 0, wo: 0.5, uo: 0.5, bo: -0.2 };
const out = lstmCell(1, 2, 3, p);
check('output gate', out.o, 0.785835);
check('hidden output', out.h, 0.781949);
return results;`,
    hints: [
      'Output gate uses sigmoid(wo * x + uo * hPrev + bo).',
      'Hidden state is o multiplied by tanh(c).',
    ],
    solution: `/**
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
}`,
    explanation: 'The output gate exposes only the relevant slice of cell memory as the hidden representation passed to the next timestep.',
  },
  {
    id: 'conv2d-output-size',
    stepLabel: '32.1',
    group: 'Output size formula',
    title: 'Conv2D output dimension',
    concept: 'The output dimension of a 2D convolution is: outputSize = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1.',
    objective: 'Compute the output dimension height/width.',
    difficulty: 'warmup',
    starterCode: `function getConv2dOutputDim(inputSize, kernelSize, padding, stride) {
  // TODO: calculate and return output size
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('conv same size', getConv2dOutputDim(32, 3, 1, 1), 32);
check('conv downsample', getConv2dOutputDim(32, 4, 0, 2), 15);
return results;`,
    hints: [
      'Apply the formula: Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1.',
    ],
    solution: `function getConv2dOutputDim(inputSize, kernelSize, padding, stride) {
  return Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
}`,
    explanation: 'Correct output dimensions are crucial to allocate the correct tensor shapes during a forward pass.',
  },
  {
    id: 'conv2d-dot-patch',
    stepLabel: '32.2',
    group: 'One patch dot product',
    title: 'Conv2D patch dot product',
    concept: 'At each sliding window step, Conv2D multiplies kernel weights and input image patch coordinates element-wise and sums them.',
    objective: 'Calculate the sum of element-wise products of a 2x2 image patch and kernel.',
    difficulty: 'core',
    starterCode: `function conv2dPatchDot(patch, kernel) {
  let sum = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      // TODO: multiply patch[r][c] by kernel[r][c] and accumulate in sum
      sum += 0;
    }
  }
  return sum;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('dot patch basic', conv2dPatchDot([[1, 2], [3, 4]], [[0.5, 0], [0, 0.5]]), 2.5); // 1*0.5 + 4*0.5 = 2.5
return results;`,
    hints: [
      'Multiply patch[r][c] by kernel[r][c].',
      'Add it to sum.',
      'sum += patch[r][c] * kernel[r][c];',
    ],
    solution: `function conv2dPatchDot(patch, kernel) {
  let sum = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      sum += patch[r][c] * kernel[r][c];
    }
  }
  return sum;
}`,
    explanation: '2D sliding window dot products extract translation-invariant spatial features from inputs.',
  },
  {
    id: 'max-pooling-2d-top',
    stepLabel: '33.1',
    group: 'Window max',
    title: 'Max pooling top row',
    concept: "Max pooling downsamples representations by selecting the maximum value in local sliding windows (e.g. 2x2). First, let's look at the top row.",
    objective: 'Return the maximum value in the top row of a 2x2 patch.',
    difficulty: 'warmup',
    starterCode: `function getPatchMax(patch2x2) {
  // TODO: return the maximum value in the top row
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('max top row', getPatchMax([[1, 5], [2, 3]]), 5);
return results;`,
    hints: [
      'Use Math.max(patch2x2[0][0], patch2x2[0][1]).',
    ],
    solution: `function getPatchMax(patch2x2) {
  return Math.max(patch2x2[0][0], patch2x2[0][1]);
}`,
    explanation: 'Max pooling extracts the strongest activation from each window.',
  },
  {
    id: 'max-pooling-2d-bottom',
    stepLabel: '33.2',
    group: 'Window max',
    title: 'Max pooling bottom row',
    concept: 'Next, we look at the bottom row of the 2x2 patch.',
    objective: 'Return the maximum value in the bottom row.',
    difficulty: 'warmup',
    starterCode: `function getPatchMax(patch2x2) {
  const topMax = Math.max(patch2x2[0][0], patch2x2[0][1]);
  // TODO: return the maximum value in the bottom row
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('max bottom row', getPatchMax([[1, 5], [2, 3]]), 3);
return results;`,
    hints: [
      'Use Math.max(patch2x2[1][0], patch2x2[1][1]).',
    ],
    solution: `function getPatchMax(patch2x2) {
  const topMax = Math.max(patch2x2[0][0], patch2x2[0][1]);
  return Math.max(patch2x2[1][0], patch2x2[1][1]);
}`,
    explanation: 'We now have the local maximums for both rows.',
  },
  {
    id: 'max-pooling-2d-global',
    stepLabel: '33.3',
    group: 'Window max',
    title: 'Global patch max',
    concept: 'Finally, we compare the row maximums to find the global maximum for the patch.',
    objective: 'Compare topMax and bottomMax and return the largest.',
    difficulty: 'warmup',
    starterCode: `function getPatchMax(patch2x2) {
  const topMax = Math.max(patch2x2[0][0], patch2x2[0][1]);
  const bottomMax = Math.max(patch2x2[1][0], patch2x2[1][1]);
  
  // TODO: return the larger of the two
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('max positive', getPatchMax([[1, 5], [2, 3]]), 5);
return results;`,
    hints: [
      'Use Math.max(topMax, bottomMax).',
    ],
    solution: `function getPatchMax(patch2x2) {
  const topMax = Math.max(patch2x2[0][0], patch2x2[0][1]);
  const bottomMax = Math.max(patch2x2[1][0], patch2x2[1][1]);
  
  return Math.max(topMax, bottomMax);
}`,
    explanation: 'The global patch maximum is the final output of the 2x2 max pooling operation.',
  },
  {
    id: 'max-pooling-2d-optimized',
    stepLabel: '33.4',
    group: 'Window max',
    title: 'Optimized Max pooling',
    concept: 'We can write this in a single optimized Math.max call.',
    objective: 'Condense the operations into a single Math.max.',
    difficulty: 'core',
    starterCode: `function getPatchMax(patch2x2) {
  // TODO: find the maximum value in one line
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('max positive', getPatchMax([[1, 5], [2, 3]]), 5);
check('max negative', getPatchMax([[-1, -5], [-2, -3]]), -1);
return results;`,
    hints: [
      'Use Math.max(patch2x2[0][0], patch2x2[0][1], patch2x2[1][0], patch2x2[1][1]).',
    ],
    solution: `function getPatchMax(patch2x2) {
  return Math.max(patch2x2[0][0], patch2x2[0][1], patch2x2[1][0], patch2x2[1][1]);
}`,
    explanation: 'Max pooling extracts the strongest activation from each window, ensuring model robustness to translation shifts.',
  },
  {
    id: 'conv-relu-identity',
    stepLabel: '34.1',
    group: 'ReLU clip',
    title: 'Linear Identity Pass',
    concept: 'Before adding non-linearity, we begin with a simple identity pass that returns the input unchanged.',
    objective: 'Return the input x unmodified.',
    difficulty: 'warmup',
    starterCode: `function relu(x) {
  // TODO: return x
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('relu identity', relu(5), 5);
return results;`,
    hints: [
      'Return x.',
    ],
    solution: `function relu(x) {
  return x;
}`,
    explanation: 'Without non-linearity, deep networks collapse into a single linear transformation.',
  },
  {
    id: 'conv-relu-conditional',
    stepLabel: '34.2',
    group: 'ReLU clip',
    title: 'Conditional Branch',
    concept: 'The ReLU function breaks linearity by treating positive and negative values differently.',
    objective: 'Add an if statement to return x if it is positive.',
    difficulty: 'warmup',
    starterCode: `function relu(x) {
  // TODO: if x > 0 return x, otherwise return 0
  return x;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('relu positive', relu(5), 5);
check('relu zero', relu(0), 0);
return results;`,
    hints: [
      'if (x > 0) return x;',
    ],
    solution: `function relu(x) {
  if (x > 0) {
    return x;
  }
  return 0;
}`,
    explanation: 'The conditional creates a "hinge" at zero, which provides the non-linearity needed to learn complex functions.',
  },
  {
    id: 'conv-relu-negative',
    stepLabel: '34.3',
    group: 'ReLU clip',
    title: 'Negative Clamping',
    concept: 'If the value is not positive, ReLU clamps it to zero.',
    objective: 'Ensure negative values return 0.',
    difficulty: 'warmup',
    starterCode: `function relu(x) {
  if (x > 0) {
    return x;
  }
  // TODO: return 0 for negative values
  return x;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('relu negative', relu(-10), 0);
return results;`,
    hints: [
      'Return 0 at the end of the function.',
    ],
    solution: `function relu(x) {
  if (x > 0) {
    return x;
  }
  return 0;
}`,
    explanation: 'Zeroing out negative values adds sparsity to the network activations.',
  },
  {
    id: 'conv-relu-activation',
    stepLabel: '34.4',
    group: 'ReLU clip',
    title: 'Conv + ReLU activation',
    concept: 'We can optimize this logic into a single line using the Math.max function.',
    objective: 'Apply the ReLU activation function using Math.max(0, x).',
    difficulty: 'core',
    starterCode: `function relu(x) {
  // TODO: return the maximum of 0 and x
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('relu positive', relu(5), 5);
check('relu negative', relu(-10), 0);
return results;`,
    hints: [
      'Use Math.max(0, x).',
    ],
    solution: `function relu(x) {
  return Math.max(0, x);
}`,
    explanation: 'ReLU introduces non-linear decision boundaries, enabling neural networks to model non-linear mappings.',
  },
  {
    id: 'init-he-inverse-fanin',
    stepLabel: '35.1',
    group: 'He std',
    title: 'Inverse Fan-In',
    concept: 'He initialization scales random weights to prevent vanishing/exploding gradients. First, we compute the inverse fan-in.',
    objective: 'Compute 1 / fanIn.',
    difficulty: 'warmup',
    starterCode: `function getHeStd(fanIn) {
  // TODO: compute the inverse of the fanIn
  const invFanIn = 0;
  
  return invFanIn;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('fanIn 4', getHeStd(4), 0.25);
return results;`,
    hints: [
      'Divide 1 by fanIn.',
    ],
    solution: `function getHeStd(fanIn) {
  const invFanIn = 1 / fanIn;
  
  return invFanIn;
}`,
    explanation: 'As the number of inputs (fan-in) increases, the variance of the output grows. We divide by fan-in to keep the variance stable.',
  },
  {
    id: 'init-he-variance',
    stepLabel: '35.2',
    group: 'He std',
    title: 'ReLU Variance Scaling',
    concept: 'Because ReLU throws away exactly half the activations (the negative ones), we must multiply the variance by 2 to compensate.',
    objective: 'Multiply the inverse fan-in by 2 to get the He variance.',
    difficulty: 'core',
    starterCode: `function getHeStd(fanIn) {
  const invFanIn = 1 / fanIn;
  
  // TODO: multiply by 2 to account for ReLU sparsity
  const variance = 0;
  
  return variance;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('fanIn 4 variance', getHeStd(4), 0.5);
return results;`,
    hints: [
      'Multiply invFanIn by 2.',
    ],
    solution: `function getHeStd(fanIn) {
  const invFanIn = 1 / fanIn;
  
  const variance = 2 * invFanIn;
  
  return variance;
}`,
    explanation: 'Without this factor of 2, the variance of the activations would halve at every layer, leading to vanishing gradients.',
  },
  {
    id: 'init-he-std-calc',
    stepLabel: '35.3',
    group: 'He std',
    title: 'Standard Deviation Extraction',
    concept: 'Initialization functions need the standard deviation, which is the square root of the variance.',
    objective: 'Compute the standard deviation from the variance.',
    difficulty: 'warmup',
    starterCode: `function getHeStd(fanIn) {
  const invFanIn = 1 / fanIn;
  const variance = 2 * invFanIn;
  
  // TODO: compute the square root of the variance
  const std = 0;
  
  return std;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('fanIn 512 std', getHeStd(512), 0.0625);
return results;`,
    hints: [
      'Use Math.sqrt(variance).',
    ],
    solution: `function getHeStd(fanIn) {
  const invFanIn = 1 / fanIn;
  const variance = 2 * invFanIn;
  
  const std = Math.sqrt(variance);
  
  return std;
}`,
    explanation: 'The standard deviation defines the spread of the Gaussian distribution from which we will sample the initial weights.',
  },
  {
    id: 'init-he-std',
    stepLabel: '35.4',
    group: 'He std',
    title: 'He initialization standard deviation',
    concept: 'We can write this cleanly in a single mathematical formula: Math.sqrt(2 / fanIn).',
    objective: 'Return the He standard deviation directly.',
    difficulty: 'core',
    starterCode: `function getHeStd(fanIn) {
  // TODO: return standard deviation sqrt(2 / fanIn)
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('fanIn 512', getHeStd(512), 0.0625); // sqrt(2/512) = sqrt(1/256) = 1/16 = 0.0625
return results;`,
    hints: [
      'Use Math.sqrt.',
      'return Math.sqrt(2 / fanIn);',
    ],
    solution: `function getHeStd(fanIn) {
  return Math.sqrt(2 / fanIn);
}`,
    explanation: 'Scaling weights by He standard deviation maintains constant activation variance across layers.',
  },
  {
    id: 'vae-reparameterize',
    stepLabel: 'VAE.1',
    group: 'Reparameterize z',
    title: 'Reparameterization Trick',
    concept: 'The reparameterization trick allows gradients to backpropagate through stochastic nodes by shifting the randomness to an auxiliary variable eps.',
    objective: 'Compute the sampled latent z: z = mu + exp(0.5 * logvar) * eps.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one VAE training step: reparameterize latent, reconstruction MSE, KL divergence, ELBO.
 * @param {number} x - Original input scalar (or use x[i] in vector loop).
 * @param {number} xHat - Decoder reconstruction.
 * @param {number} mu - Latent mean.
 * @param {number} logvar - Latent log-variance.
 * @param {number} eps - Standard normal sample for reparameterization.
 * @returns {{ z: number, reconLoss: number, klLoss: number, elbo: number }}
 */
function vaeStep(x, xHat, mu, logvar, eps) {
  // TODO: compute standard deviation (exp(0.5 * logvar)) and sample z
  const std = 0;
  const z = 0;
  
  const reconLoss = 0;
  const klLoss = 0;
  const elbo = 0;
  return { z, reconLoss, klLoss, elbo };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = vaeStep(0, 0, 1.0, 0.0, 2.0); // std = exp(0) = 1. z = 1.0 + 1 * 2.0 = 3.0
check('z with eps=2', res.z, 3.0);
return results;`,
    hints: [
      'Compute std using Math.exp(0.5 * logvar).',
      'Compute z using mu + std * eps.',
    ],
    solution: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  
  const reconLoss = 0;
  const klLoss = 0;
  const elbo = 0;
  return { z, reconLoss, klLoss, elbo };
}`,
    explanation: 'By separating the deterministic mean/variance from the random noise (eps), the network remains fully differentiable.',
  },
  {
    id: 'vae-recon-mse',
    stepLabel: 'VAE.2',
    group: 'Reconstruction MSE',
    title: 'Reconstruction Error',
    concept: 'The reconstruction loss forces the decoder to accurately recreate the original input from the latent z. We use Mean Squared Error (MSE).',
    objective: 'Compute the scalar reconstruction loss: (x - xHat)^2.',
    difficulty: 'warmup',
    starterCode: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  
  // TODO: compute reconstruction MSE
  const reconLoss = 0;
  
  const klLoss = 0;
  const elbo = 0;
  return { z, reconLoss, klLoss, elbo };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = vaeStep(5.0, 3.0, 0, 0, 0); // (5-3)^2 = 4
check('recon loss', res.reconLoss, 4.0);
return results;`,
    hints: [
      'Compute the difference x - xHat, then square it.',
      'Math.pow(x - xHat, 2) or (x - xHat) * (x - xHat).',
    ],
    solution: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  
  const reconLoss = (x - xHat) * (x - xHat);
  
  const klLoss = 0;
  const elbo = 0;
  return { z, reconLoss, klLoss, elbo };
}`,
    explanation: 'Minimizing reconstruction loss ensures the latent space captures all necessary information to rebuild the input.',
  },
  {
    id: 'vae-kl-divergence',
    stepLabel: 'VAE.3',
    group: 'KL closed form',
    title: 'KL Divergence',
    concept: 'The KL divergence regularizer forces the latent distribution to match a standard Normal distribution (mean 0, variance 1).',
    objective: 'Compute the KL loss per dim: -0.5 * (1 + logvar - mu^2 - exp(logvar)).',
    difficulty: 'core',
    starterCode: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  const reconLoss = (x - xHat) * (x - xHat);
  
  // TODO: compute closed-form KL divergence
  const klLoss = 0;
  
  const elbo = 0;
  return { z, reconLoss, klLoss, elbo };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = vaeStep(0, 0, 1.0, -1.0, 0); 
check('kl divergence', res.klLoss, 0.6839397);
return results;`,
    hints: [
      'Compute mu * mu and Math.exp(logvar).',
      'Multiply the entire sum by -0.5.',
    ],
    solution: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  const reconLoss = (x - xHat) * (x - xHat);
  
  const klLoss = -0.5 * (1 + logvar - mu * mu - Math.exp(logvar));
  
  const elbo = 0;
  return { z, reconLoss, klLoss, elbo };
}`,
    explanation: 'This closed-form solution only works because we assume the prior is a standard Gaussian.',
  },
  {
    id: 'vae-elbo',
    stepLabel: 'VAE.4',
    group: 'Combined ELBO',
    title: 'Evidence Lower Bound (ELBO)',
    concept: 'The total VAE loss is derived from the Evidence Lower Bound. The loss to minimize is the sum of reconstruction error and KL divergence.',
    objective: 'Compute the final loss (negative ELBO): reconLoss + klLoss.',
    difficulty: 'warmup',
    starterCode: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  const reconLoss = (x - xHat) * (x - xHat);
  const klLoss = -0.5 * (1 + logvar - mu * mu - Math.exp(logvar));
  
  // TODO: compute total loss
  const elbo = 0;
  
  return { z, reconLoss, klLoss, elbo };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = vaeStep(5.0, 3.0, 1.0, -1.0, 0); // 4.0 + 0.6839397
check('total loss', res.elbo, 4.6839397);
return results;`,
    hints: [
      'Add reconLoss and klLoss.',
    ],
    solution: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  const reconLoss = (x - xHat) * (x - xHat);
  const klLoss = -0.5 * (1 + logvar - mu * mu - Math.exp(logvar));
  
  const elbo = reconLoss + klLoss;
  
  return { z, reconLoss, klLoss, elbo };
}`,
    explanation: 'By minimizing this joint loss, the VAE balances generating accurate reconstructions with maintaining a smoothly organized latent space.',
  },
  {
    id: 'vae-edge-cases',
    stepLabel: 'VAE.5',
    group: 'Latent edge cases',
    title: 'Standard Normal Edge Case',
    concept: 'When the encoder perfectly matches the prior (mu=0, logvar=0), the KL divergence drops exactly to 0, and z becomes exactly the sampled noise eps.',
    objective: 'Set matchesStandardPrior when mu and logvar are both 0 and klLoss is 0.',
    difficulty: 'warmup',
    starterCode: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  const reconLoss = (x - xHat) * (x - xHat);
  const klLoss = -0.5 * (1 + logvar - mu * mu - Math.exp(logvar));
  const elbo = reconLoss + klLoss;
  // TODO: matchesStandardPrior = mu === 0 && logvar === 0 && klLoss === 0
  const matchesStandardPrior = false;
  return { z, reconLoss, klLoss, elbo, matchesStandardPrior };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
function checkBool(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const res = vaeStep(0, 0, 0.0, 0.0, 2.5);
check('kl loss is 0', res.klLoss, 0);
check('z equals eps', res.z, 2.5);
checkBool('matches standard prior', res.matchesStandardPrior, true);
return results;`,
    hints: [
      'All three conditions must hold: mu === 0, logvar === 0, klLoss === 0.',
      'matchesStandardPrior = mu === 0 && logvar === 0 && klLoss === 0;',
    ],
    solution: `function vaeStep(x, xHat, mu, logvar, eps) {
  const std = Math.exp(0.5 * logvar);
  const z = mu + std * eps;
  const reconLoss = (x - xHat) * (x - xHat);
  const klLoss = -0.5 * (1 + logvar - mu * mu - Math.exp(logvar));
  const elbo = reconLoss + klLoss;
  const matchesStandardPrior = mu === 0 && logvar === 0 && klLoss === 0;
  return { z, reconLoss, klLoss, elbo, matchesStandardPrior };
}`,
    explanation: 'This proves that a standard Normal distribution incurs zero penalty from the KL divergence term.',
  },
  {
    id: 'multimodal-llm-dot',
    stepLabel: '37.1',
    group: 'Linear project',
    title: 'Modality Dot Product',
    concept: 'Multimodal LLMs project visual token embeddings into the text vocabulary hidden space using a learned projection matrix. First, we compute the dot product between the input patch and a single row of the projection matrix.',
    objective: 'Compute the dot product of patch and projector[j].',
    difficulty: 'warmup',
    starterCode: `function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  
  const j = 0; // Focus on the first dimension
  let sum = 0;
  for (let d = 0; d < patch.length; d++) {
    // TODO: multiply patch[d] by projector[d][j] and accumulate in sum
    sum += 0;
  }
  projected[j] = sum;
  
  return projected;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('project 2D to 3D first dim', projectPatch([1, 2], [[0.5, 0, 1], [0, 0.5, 2]], 3), [0.5, 0, 0]);
return results;`,
    hints: [
      'sum += patch[d] * projector[d][j];',
    ],
    solution: `function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  
  const j = 0;
  let sum = 0;
  for (let d = 0; d < patch.length; d++) {
    sum += patch[d] * projector[d][j];
  }
  projected[j] = sum;
  
  return projected;
}`,
    explanation: 'A dot product measures the similarity and maps the spatial patch features into the text embedding space.',
  },
  {
    id: 'multimodal-llm-loop',
    stepLabel: '37.2',
    group: 'Linear project',
    title: 'Matrix Vector Loop',
    concept: 'We iterate over all output dimensions to perform a full matrix-vector multiplication.',
    objective: 'Wrap the dot product logic in a loop over j from 0 to outDim.',
    difficulty: 'core',
    starterCode: `function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  
  // TODO: Loop over j from 0 to outDim
  let j = 0;
  let sum = 0;
  for (let d = 0; d < patch.length; d++) {
    sum += patch[d] * projector[d][j];
  }
  projected[j] = sum;
  
  return projected;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('project 2D to 3D', projectPatch([1, 2], [[0.5, 0, 1], [0, 0.5, 2]], 3), [0.5, 1, 5]);
return results;`,
    hints: [
      'Add a for loop for j.',
      'for (let j = 0; j < outDim; j++) { ... }',
    ],
    solution: `function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) {
      sum += patch[d] * projector[d][j];
    }
    projected[j] = sum;
  }
  
  return projected;
}`,
    explanation: 'This operation acts as a translator, taking raw visual features and converting them into a language the text model understands.',
  },
  {
    id: 'multimodal-llm-project',
    stepLabel: '37.3',
    group: 'Linear project',
    title: 'Multimodal token projection',
    concept: 'The full linear projection is the core bridging mechanism connecting distinct modality encoders to a single unified LLM backbone.',
    objective: 'Finalize and return the projected token.',
    difficulty: 'challenge',
    starterCode: `function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) {
      sum += patch[d] * projector[d][j];
    }
    projected[j] = sum;
  }
  // TODO: return the projected vector
  return [];
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('project 2D to 3D', projectPatch([1, 2], [[0.5, 0, 1], [0, 0.5, 2]], 3), [0.5, 1, 5]);
return results;`,
    hints: [
      'Return projected.',
    ],
    solution: `function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) {
      sum += patch[d] * projector[d][j];
    }
    projected[j] = sum;
  }
  return projected;
}`,
    explanation: 'By converting images into text-like embeddings, multimodal models can smoothly alternate between seeing and speaking.',
  },
];
