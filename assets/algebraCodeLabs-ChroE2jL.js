import{L as e}from"./AlgebraCodeLab-PE5I0vAc.js";import{A as k,g as x}from"./AlgebraCodeLab-PE5I0vAc.js";import"./index--Y7eYyBB.js";import"./react-vendor-Cdu38Wyn.js";import"./router-D1rsdnJA.js";import"./icons-BEfsDuMg.js";import"./assessment-data-BEcQsvEZ.js";import"./glossary-data-DT2DBpOJ.js";import"./CodeFixLab-CL-iaCzS.js";const t=[{id:"gd-prediction-error",stepLabel:"26.1",group:"Gradient descent least squares",title:"Prediction error",concept:"Gradient descent updates parameters using prediction error.",objective:"Return prediction minus target.",difficulty:"warmup",starterCode:`function predictionError(prediction, target) {
  // TODO: return prediction minus target.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('overprediction', predictionError(10, 7), 3);
check('underprediction', predictionError(4, 9), -5);
check('perfect prediction', predictionError(5, 5), 0);

return results;`,hints:["Error is signed: prediction - target.","Positive means prediction was too high.","return prediction - target;"],solution:`function predictionError(prediction, target) {
  return prediction - target;
}`,explanation:"Signed error tells gradient descent which direction the prediction is wrong."},{id:"gd-one-weight-gradient",stepLabel:"26.2",group:"Gradient descent least squares",title:"One weight gradient",concept:"For squared error, the gradient contribution is error times feature value.",objective:"Return error * feature.",difficulty:"core",starterCode:`function oneWeightGradient(error, feature) {
  // TODO: return this feature's gradient contribution.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive error, positive feature', oneWeightGradient(3, 2), 6);
check('negative error, positive feature', oneWeightGradient(-5, 2), -10);
check('positive error, zero feature', oneWeightGradient(3, 0), 0);
check('negative feature', oneWeightGradient(4, -2), -8);

return results;`,hints:["The gradient scales with how much this feature contributed.","Multiply error by feature.","return error * feature;"],solution:`function oneWeightGradient(error, feature) {
  return error * feature;
}`,explanation:"If a feature is large, the weight connected to it gets a larger update signal."},{id:"gd-gradient-vector",stepLabel:"26.3",group:"Gradient descent least squares",title:"Gradient vector",concept:"Each weight receives error times its matching feature.",objective:"Push error * x[i] for every feature.",difficulty:"core",starterCode:`function gradientForExample(error, x) {
  const gradient = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the gradient for weight i.
    gradient.push(0);
  }

  return gradient;
}`,testCode:`const results = [];

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

return results;`,hints:["The same error multiplies every feature.","For weight i, use error * x[i].","gradient.push(error * x[i]);"],solution:`function gradientForExample(error, x) {
  const gradient = [];

  for (let i = 0; i < x.length; i++) {
    gradient.push(error * x[i]);
  }

  return gradient;
}`,explanation:"The gradient vector tells every weight how to move to reduce squared error."},{id:"gd-weight-update",stepLabel:"26.4",group:"Gradient descent least squares",title:"One gradient descent update",concept:"Gradient descent subtracts learningRate times gradient.",objective:"Update one weight coordinate.",difficulty:"core",starterCode:`function updateWeights(weights, gradient, learningRate) {
  const updated = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: subtract learningRate times gradient[i].
    updated.push(weights[i]);
  }

  return updated;
}`,testCode:`const results = [];

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

return results;`,hints:["Gradient descent moves opposite the gradient.","New weight = old weight - learningRate * gradient.","updated.push(weights[i] - learningRate * gradient[i]);"],solution:`function updateWeights(weights, gradient, learningRate) {
  const updated = [];

  for (let i = 0; i < weights.length; i++) {
    updated.push(weights[i] - learningRate * gradient[i]);
  }

  return updated;
}`,explanation:"The learning rate controls the size of the step downhill."},{id:"logistic-logit-dot",stepLabel:"27.1",group:"Logistic regression bridge",title:"Logit is a dot product",concept:"Logistic regression first computes a linear score: w dot x + b.",objective:"Return dot(weights, x) plus bias.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function logit(weights, x, bias) {
  // TODO: return w dot x + bias.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple logit', logit([1, 2], [3, 4], 0), 11);
check('with bias', logit([1, 2], [3, 4], -1), 10);
check('negative weight', logit([-1, 2], [3, 5], 1), 8);

return results;`,hints:["Use the dot helper.","The linear score is dot(weights, x) + bias.","return dot(weights, x) + bias;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function logit(weights, x, bias) {
  return dot(weights, x) + bias;
}`,explanation:"Logistic regression is linear algebra plus a sigmoid. The dot product creates the score."},{id:"logistic-sigmoid",stepLabel:"27.2",group:"Logistic regression bridge",title:"Sigmoid",concept:"Sigmoid turns any real-valued logit into a value between 0 and 1.",objective:"Complete the sigmoid formula.",difficulty:"core",starterCode:`function sigmoid(z) {
  // TODO: return 1 / (1 + exp(-z)).
  return z;
}`,testCode:`const results = [];

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

return results;`,hints:["Use Math.exp.","The formula is 1 / (1 + Math.exp(-z)).","return 1 / (1 + Math.exp(-z));"],solution:`function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}`,explanation:"Sigmoid converts a linear score into a probability-like value."},{id:"logistic-predict-probability",stepLabel:"27.3",group:"Logistic regression bridge",title:"Predict probability",concept:"A logistic model predicts sigmoid(w dot x + b).",objective:"Apply sigmoid to the logit.",difficulty:"core",starterCode:`function dot(a, b) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["z is already the linear score.","Apply sigmoid(z).","return sigmoid(z);"],solution:`function dot(a, b) {
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
}`,explanation:"Logistic regression turns feature-weight alignment into a probability."},{id:"logistic-binary-cross-entropy",stepLabel:"27.4",group:"Logistic regression bridge",title:"Binary cross-entropy",concept:"Binary cross-entropy penalizes confident wrong probabilities heavily.",objective:"Complete the loss formula for one label and probability.",difficulty:"challenge",starterCode:`function binaryCrossEntropy(y, p) {
  // TODO: return -(y log p + (1-y) log(1-p)).
  return 0;
}`,testCode:`const results = [];

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

return results;`,hints:["Use Math.log.","The formula is negative of y log p plus (1-y) log(1-p).","return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));"],solution:`function binaryCrossEntropy(y, p) {
  return -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
}`,explanation:"Cross-entropy rewards high probability on the true class and punishes confident wrong predictions."},{id:"attention-one-score",stepLabel:"28.1",group:"Attention algebra bridge",title:"One attention score",concept:"One attention score is a query vector dotted with a key vector.",objective:"Return query dot key.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScore(query, key) {
  // TODO: return query dot key.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 1', attentionScore([1, 2], [3, 4]), 11);
check('orthogonal score', attentionScore([1, 0], [0, 1]), 0);
check('negative score', attentionScore([-1, 2], [3, 5]), 7);

return results;`,hints:["Attention starts with similarity scores.","Similarity here is dot product.","return dot(query, key);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function attentionScore(query, key) {
  return dot(query, key);
}`,explanation:"In transformer attention, QK^T is a matrix of query-key dot products."},{id:"attention-scale-score",stepLabel:"28.2",group:"Attention algebra bridge",title:"Scale attention score",concept:"Attention scores are divided by sqrt(d) to keep logits from growing too large.",objective:"Divide the raw score by Math.sqrt(d).",difficulty:"core",starterCode:`function scaleAttentionScore(rawScore, d) {
  // TODO: return rawScore divided by sqrt(d).
  return rawScore;
}`,testCode:`const results = [];

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

return results;`,hints:["Use Math.sqrt(d).","Scaled dot-product attention divides by the square root of dimension.","return rawScore / Math.sqrt(d);"],solution:`function scaleAttentionScore(rawScore, d) {
  return rawScore / Math.sqrt(d);
}`,explanation:"Scaling keeps attention logits numerically stable before softmax."},{id:"attention-softmax-denominator",stepLabel:"28.3",group:"Attention algebra bridge",title:"Softmax denominator",concept:"Softmax normalizes exponentiated scores so weights sum to 1.",objective:"Accumulate Math.exp(score) for every score.",difficulty:"core",starterCode:`function softmaxDenominator(scores) {
  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    // TODO: add exp of this score.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

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

return results;`,hints:["Softmax uses exponentials.","Use Math.exp(scores[i]).","total += Math.exp(scores[i]);"],solution:`function softmaxDenominator(scores) {
  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += Math.exp(scores[i]);
  }

  return total;
}`,explanation:"Softmax turns raw attention scores into normalized attention weights."},{id:"attention-softmax-weights",stepLabel:"28.4",group:"Attention algebra bridge",title:"Softmax weights",concept:"Each softmax weight is exp(score) divided by the sum of all exp(scores).",objective:"Push one normalized softmax weight per score.",difficulty:"challenge",starterCode:`function softmax(scores) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["The denominator is already computed.","Weight i is exp(scores[i]) / denominator.","weights.push(Math.exp(scores[i]) / denominator);"],solution:`function softmax(scores) {
  let denominator = 0;

  for (let i = 0; i < scores.length; i++) {
    denominator += Math.exp(scores[i]);
  }

  const weights = [];

  for (let i = 0; i < scores.length; i++) {
    weights.push(Math.exp(scores[i]) / denominator);
  }

  return weights;
}`,explanation:"Attention weights are a probability distribution over which values to read."},{id:"attention-weighted-value-sum",stepLabel:"28.5",group:"Attention algebra bridge",title:"Weighted value sum",concept:"The attention output is a weighted sum of value vectors.",objective:"Add weight times value coordinate into the output.",difficulty:"challenge",starterCode:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      // TODO: add this token's weighted value coordinate.
      output[dim] += 0;
    }
  }

  return output;
}`,testCode:`const results = [];

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

return results;`,hints:["Each token contributes weight[token] times its value vector.","For each coordinate, add weights[token] * values[token][dim].","output[dim] += weights[token] * values[token][dim];"],solution:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      output[dim] += weights[token] * values[token][dim];
    }
  }

  return output;
}`,explanation:"Attention does not return the most-attended token; it returns a mixture of value vectors."},{id:"derivative-line-slope",stepLabel:"29.1",group:"Derivative basics",title:"Slope of a line",concept:"The derivative of f(x) = mx + b is the constant slope m.",objective:"Return the slope m.",difficulty:"warmup",starterCode:`function derivativeOfLine(m, b, x) {
  // f(x) = m*x + b
  // TODO: return the derivative with respect to x.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('slope 2', derivativeOfLine(2, 5, 10), 2);
check('slope -3', derivativeOfLine(-3, 1, 7), -3);
check('slope 0', derivativeOfLine(0, 100, 4), 0);

return results;`,hints:["The derivative of m*x + b is m.","b disappears because constants do not change with x.","return m;"],solution:`function derivativeOfLine(m, b, x) {
  return m;
}`,explanation:"A derivative measures local change. For a straight line, the local change is the same everywhere."},{id:"derivative-square",stepLabel:"29.2",group:"Derivative basics",title:"Derivative of x^2",concept:"The derivative of x^2 is 2x.",objective:"Return 2 * x.",difficulty:"warmup",starterCode:`function derivativeSquare(x) {
  // f(x) = x*x
  // TODO: return f'(x).
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('x=0', derivativeSquare(0), 0);
check('x=3', derivativeSquare(3), 6);
check('x=-4', derivativeSquare(-4), -8);
check('x=10', derivativeSquare(10), 20);

return results;`,hints:["Power rule: d/dx x^2 = 2x.","The slope grows as x gets farther from 0.","return 2 * x;"],solution:`function derivativeSquare(x) {
  return 2 * x;
}`,explanation:"For squared loss, gradients grow with the size of the error."},{id:"derivative-squared-error",stepLabel:"29.3",group:"Derivative basics",title:"Squared-error derivative",concept:"For loss L = (prediction - target)^2, the derivative with respect to prediction is 2(prediction - target).",objective:"Return the gradient of squared error with respect to prediction.",difficulty:"core",starterCode:`function squaredErrorGradient(prediction, target) {
  const error = prediction - target;

  // TODO: return d/dprediction of error^2.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('prediction too high', squaredErrorGradient(10, 7), 6);
check('prediction too low', squaredErrorGradient(4, 9), -10);
check('perfect prediction', squaredErrorGradient(5, 5), 0);

return results;`,hints:["Squared error is error^2.","Derivative of error^2 with respect to prediction is 2 * error.","return 2 * error;"],solution:`function squaredErrorGradient(prediction, target) {
  const error = prediction - target;
  return 2 * error;
}`,explanation:"The gradient is positive when prediction is too high, negative when too low, and zero when perfect."},{id:"numerical-derivative",stepLabel:"29.4",group:"Derivative basics",title:"Numerical derivative",concept:"A derivative can be approximated by measuring a tiny change in function output.",objective:"Complete the finite-difference formula.",difficulty:"core",starterCode:`function numericalDerivative(f, x, h = 1e-5) {
  // TODO: return (f(x + h) - f(x)) / h.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-3) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('derivative of x^2 at 3', numericalDerivative((x) => x * x, 3), 6);
check('derivative of 2x+1 at 5', numericalDerivative((x) => 2 * x + 1, 5), 2);
check('derivative of x^3 at 2', numericalDerivative((x) => x * x * x, 2), 12);

return results;`,hints:["Look at how much f changes after a tiny step h.","Divide output change by input change.","return (f(x + h) - f(x)) / h;"],solution:`function numericalDerivative(f, x, h = 1e-5) {
  return (f(x + h) - f(x)) / h;
}`,explanation:"Numerical derivatives are useful for checking gradients, though exact backprop is usually more efficient."},{id:"chain-rule-two-links",stepLabel:"30.1",group:"Chain rule",title:"Two-link chain rule",concept:"The chain rule multiplies local derivatives along a path.",objective:"Return outerGradient * innerGradient.",difficulty:"warmup",starterCode:`function chainTwo(outerGradient, innerGradient) {
  // TODO: return the product of the two local gradients.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('2 then 3', chainTwo(2, 3), 6);
check('-1 then 5', chainTwo(-1, 5), -5);
check('zero stops gradient', chainTwo(10, 0), 0);

return results;`,hints:["Chain rule multiplies derivatives.","If one local derivative is zero, the path gradient is zero.","return outerGradient * innerGradient;"],solution:`function chainTwo(outerGradient, innerGradient) {
  return outerGradient * innerGradient;
}`,explanation:"Backprop is repeated chain rule: gradients flow backward by multiplying local derivatives."},{id:"chain-through-square",stepLabel:"30.2",group:"Chain rule",title:"Chain through square",concept:"If y = z^2 and z depends on x, then dy/dx = 2z * dz/dx.",objective:"Return 2 * z * dzdx.",difficulty:"core",starterCode:`function chainThroughSquare(z, dzdx) {
  // y = z^2
  // TODO: return dy/dx.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('z=3 dzdx=2', chainThroughSquare(3, 2), 12);
check('z=-4 dzdx=1', chainThroughSquare(-4, 1), -8);
check('z=5 dzdx=0', chainThroughSquare(5, 0), 0);

return results;`,hints:["Derivative of z^2 with respect to z is 2z.","Then multiply by dz/dx.","return 2 * z * dzdx;"],solution:`function chainThroughSquare(z, dzdx) {
  return 2 * z * dzdx;
}`,explanation:"The outer function contributes 2z; the inner function contributes dz/dx."},{id:"chain-through-sigmoid",stepLabel:"30.3",group:"Chain rule",title:"Chain through sigmoid",concept:"The derivative of sigmoid output s with respect to its input is s(1-s).",objective:"Return upstreamGradient * s * (1 - s).",difficulty:"core",starterCode:`function chainThroughSigmoid(sigmoidOutput, upstreamGradient) {
  // TODO: return the downstream gradient.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5 upstream=1', chainThroughSigmoid(0.5, 1), 0.25);
check('s=0.8 upstream=2', chainThroughSigmoid(0.8, 2), 0.32);
check('s=0.1 upstream=3', chainThroughSigmoid(0.1, 3), 0.27);

return results;`,hints:["Sigmoid derivative uses the output: s * (1 - s).","Multiply by upstreamGradient.","return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);"],solution:`function chainThroughSigmoid(sigmoidOutput, upstreamGradient) {
  return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);
}`,explanation:"Sigmoid gradients shrink near 0 and 1, which is one reason saturated sigmoids can learn slowly."},{id:"chain-rule-add-paths",stepLabel:"30.4",group:"Chain rule",title:"Add gradients from multiple paths",concept:"When one variable affects loss through multiple paths, gradients add.",objective:"Return pathA + pathB.",difficulty:"core",starterCode:`function addGradientPaths(pathA, pathB) {
  // TODO: return the total gradient from both paths.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two positive paths', addGradientPaths(2, 3), 5);
check('opposing paths', addGradientPaths(10, -4), 6);
check('one path zero', addGradientPaths(7, 0), 7);

return results;`,hints:["Gradients from different downstream branches add together.","This happens in computation graphs with reused values.","return pathA + pathB;"],solution:`function addGradientPaths(pathA, pathB) {
  return pathA + pathB;
}`,explanation:"Backprop sums contributions when a value is used by more than one downstream operation."},{id:"neuron-weighted-input",stepLabel:"31.1",group:"One neuron",title:"Weighted input",concept:"A neuron first computes a dot product between weights and inputs.",objective:"Return dot(weights, x).",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function weightedInput(weights, x) {
  // TODO: return the weighted sum.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple weighted input', weightedInput([1, 2], [3, 4]), 11);
check('zero weight', weightedInput([0, 5], [10, 2]), 10);
check('negative weight', weightedInput([-1, 2], [3, 5]), 7);

return results;`,hints:["A neuron uses the same dot product you learned earlier.","Use the dot helper.","return dot(weights, x);"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function weightedInput(weights, x) {
  return dot(weights, x);
}`,explanation:"Every dense neuron starts as a dot product."},{id:"neuron-add-bias",stepLabel:"31.2",group:"One neuron",title:"Add bias",concept:"A bias shifts the neuron before activation.",objective:"Return weighted sum plus bias.",difficulty:"warmup",starterCode:`function preActivation(weightedSum, bias) {
  // TODO: return weightedSum plus bias.
  return weightedSum;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive bias', preActivation(10, 2), 12);
check('negative bias', preActivation(10, -3), 7);
check('zero bias', preActivation(5, 0), 5);

return results;`,hints:["Bias is added after the weighted sum.","Return weightedSum + bias.","return weightedSum + bias;"],solution:`function preActivation(weightedSum, bias) {
  return weightedSum + bias;
}`,explanation:"Bias lets the neuron shift its decision boundary or activation threshold."},{id:"neuron-relu-forward",stepLabel:"31.3",group:"One neuron",title:"ReLU activation",concept:"ReLU keeps positive values and turns negative values into zero.",objective:"Return max(0, z).",difficulty:"warmup",starterCode:`function relu(z) {
  // TODO: return max(0, z).
  return z;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive', relu(3), 3);
check('negative', relu(-4), 0);
check('zero', relu(0), 0);

return results;`,hints:["Use Math.max.","ReLU is max(0, z).","return Math.max(0, z);"],solution:`function relu(z) {
  return Math.max(0, z);
}`,explanation:"ReLU adds nonlinearity by gating off negative pre-activations."},{id:"neuron-forward-full",stepLabel:"31.4",group:"One neuron",title:"Full neuron forward pass",concept:"A simple neuron computes ReLU(w dot x + b).",objective:"Return relu(dot(weights, x) + bias).",difficulty:"core",starterCode:`function dot(a, b) {
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
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive neuron', neuronForward([1, 2], [3, 4], -5), 6);
check('negative clipped', neuronForward([1, 1], [1, 1], -5), 0);
check('zero boundary', neuronForward([1, 1], [1, 1], -2), 0);

return results;`,hints:["First compute dot(weights, x) + bias.","Then pass it through relu.","return relu(dot(weights, x) + bias);"],solution:`function dot(a, b) {
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
}`,explanation:"Dense neural networks are built from many versions of this pattern."},{id:"backprop-bias-gradient",stepLabel:"32.1",group:"One-neuron backprop",title:"Bias gradient",concept:"For z = w dot x + b, the derivative of z with respect to b is 1.",objective:"Return upstreamGradient.",difficulty:"warmup",starterCode:`function biasGradient(upstreamGradient) {
  // TODO: return dL/db.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('upstream 3', biasGradient(3), 3);
check('upstream -2', biasGradient(-2), -2);
check('upstream 0', biasGradient(0), 0);

return results;`,hints:["Bias is added directly.","dz/db = 1, so dL/db = upstreamGradient * 1.","return upstreamGradient;"],solution:`function biasGradient(upstreamGradient) {
  return upstreamGradient;
}`,explanation:"Bias receives the same upstream gradient because it shifts z by one unit per one unit of bias."},{id:"backprop-one-weight",stepLabel:"32.2",group:"One-neuron backprop",title:"One weight gradient",concept:"For z = w dot x + b, dL/dw_i = upstreamGradient * x_i.",objective:"Return upstreamGradient * inputValue.",difficulty:"core",starterCode:`function weightGradient(upstreamGradient, inputValue) {
  // TODO: return dL/dw for one weight.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('input 2 upstream 3', weightGradient(3, 2), 6);
check('input 0 upstream 3', weightGradient(3, 0), 0);
check('negative upstream', weightGradient(-2, 5), -10);

return results;`,hints:["A weight is multiplied by its input.","The input scales the gradient for that weight.","return upstreamGradient * inputValue;"],solution:`function weightGradient(upstreamGradient, inputValue) {
  return upstreamGradient * inputValue;
}`,explanation:"Weights connected to larger inputs receive larger gradient signals."},{id:"backprop-weight-vector",stepLabel:"32.3",group:"One-neuron backprop",title:"Weight-gradient vector",concept:"Each weight gradient is upstreamGradient times the matching input.",objective:"Push upstreamGradient * x[i] for each weight.",difficulty:"core",starterCode:`function weightGradients(upstreamGradient, x) {
  const gradients = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: push the gradient for weight i.
    gradients.push(0);
  }

  return gradients;
}`,testCode:`const results = [];

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

return results;`,hints:["Loop over the input vector.","Each gradient is upstreamGradient times x[i].","gradients.push(upstreamGradient * x[i]);"],solution:`function weightGradients(upstreamGradient, x) {
  const gradients = [];

  for (let i = 0; i < x.length; i++) {
    gradients.push(upstreamGradient * x[i]);
  }

  return gradients;
}`,explanation:"Backprop through a dense neuron produces one gradient per weight."},{id:"backprop-input-gradient",stepLabel:"32.4",group:"One-neuron backprop",title:"Input gradients",concept:"The gradient into each input is upstreamGradient times the matching weight.",objective:"Push upstreamGradient * weights[i].",difficulty:"core",starterCode:`function inputGradients(upstreamGradient, weights) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: push the gradient for input i.
    gradients.push(0);
  }

  return gradients;
}`,testCode:`const results = [];

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

return results;`,hints:["Inputs receive gradients through weights.","Each input gradient is upstreamGradient times weights[i].","gradients.push(upstreamGradient * weights[i]);"],solution:`function inputGradients(upstreamGradient, weights) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    gradients.push(upstreamGradient * weights[i]);
  }

  return gradients;
}`,explanation:"This is how gradients flow backward from one layer into the previous layer."},{id:"relu-derivative",stepLabel:"33.1",group:"Activation gradients",title:"ReLU derivative",concept:"ReLU passes gradient only when the input was positive.",objective:"Return 1 for positive z, otherwise 0.",difficulty:"warmup",starterCode:`function reluDerivative(z) {
  // TODO: return 1 if z > 0, otherwise 0.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive', reluDerivative(3), 1);
check('negative', reluDerivative(-4), 0);
check('zero', reluDerivative(0), 0);

return results;`,hints:["ReLU is active only when z > 0.","Use a ternary expression.","return z > 0 ? 1 : 0;"],solution:`function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}`,explanation:"A negative ReLU input blocks gradient, which can create dead units."},{id:"relu-backprop",stepLabel:"33.2",group:"Activation gradients",title:"Backprop through ReLU",concept:"The upstream gradient is kept only if ReLU was active.",objective:"Multiply upstreamGradient by the ReLU derivative.",difficulty:"core",starterCode:`function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}

function reluBackward(upstreamGradient, z) {
  // TODO: return upstreamGradient times reluDerivative(z).
  return upstreamGradient;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('active ReLU', reluBackward(5, 3), 5);
check('inactive ReLU', reluBackward(5, -3), 0);
check('zero ReLU', reluBackward(5, 0), 0);
check('negative upstream active', reluBackward(-2, 4), -2);

return results;`,hints:["Backprop multiplies by local derivative.","reluDerivative(z) is either 1 or 0.","return upstreamGradient * reluDerivative(z);"],solution:`function reluDerivative(z) {
  return z > 0 ? 1 : 0;
}

function reluBackward(upstreamGradient, z) {
  return upstreamGradient * reluDerivative(z);
}`,explanation:"ReLU either passes the gradient through unchanged or blocks it entirely."},{id:"sigmoid-derivative-output",stepLabel:"33.3",group:"Activation gradients",title:"Sigmoid derivative",concept:"If s = sigmoid(z), then ds/dz = s(1-s).",objective:"Return s * (1 - s).",difficulty:"core",starterCode:`function sigmoidDerivativeFromOutput(s) {
  // TODO: return s * (1 - s).
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5', sigmoidDerivativeFromOutput(0.5), 0.25);
check('s=0.8', sigmoidDerivativeFromOutput(0.8), 0.16);
check('s=0.1', sigmoidDerivativeFromOutput(0.1), 0.09);

return results;`,hints:["Use the sigmoid output s directly.","Derivative is s times one minus s.","return s * (1 - s);"],solution:`function sigmoidDerivativeFromOutput(s) {
  return s * (1 - s);
}`,explanation:"Sigmoid gradients are largest near 0.5 and small near saturated outputs 0 or 1."},{id:"sigmoid-backprop",stepLabel:"33.4",group:"Activation gradients",title:"Backprop through sigmoid",concept:"Sigmoid backprop multiplies upstream gradient by s(1-s).",objective:"Return upstreamGradient * s * (1 - s).",difficulty:"core",starterCode:`function sigmoidBackward(upstreamGradient, sigmoidOutput) {
  // TODO: apply the sigmoid local derivative.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('s=0.5 upstream=1', sigmoidBackward(1, 0.5), 0.25);
check('s=0.8 upstream=2', sigmoidBackward(2, 0.8), 0.32);
check('s=0.1 upstream=3', sigmoidBackward(3, 0.1), 0.27);

return results;`,hints:["Local derivative is sigmoidOutput * (1 - sigmoidOutput).","Multiply by upstreamGradient.","return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);"],solution:`function sigmoidBackward(upstreamGradient, sigmoidOutput) {
  return upstreamGradient * sigmoidOutput * (1 - sigmoidOutput);
}`,explanation:"Sigmoid saturation can shrink gradients during backprop."},{id:"one-hot-target",stepLabel:"34.1",group:"Softmax cross-entropy",title:"One-hot target",concept:"Classification targets are often represented as one-hot vectors.",objective:"Return 1 at targetIndex and 0 elsewhere.",difficulty:"warmup",starterCode:`function oneHot(numClasses, targetIndex) {
  const y = [];

  for (let i = 0; i < numClasses; i++) {
    // TODO: push 1 for the target index, otherwise 0.
    y.push(0);
  }

  return y;
}`,testCode:`const results = [];

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

return results;`,hints:["Compare i with targetIndex.","Push 1 if they match, otherwise 0.","y.push(i === targetIndex ? 1 : 0);"],solution:`function oneHot(numClasses, targetIndex) {
  const y = [];

  for (let i = 0; i < numClasses; i++) {
    y.push(i === targetIndex ? 1 : 0);
  }

  return y;
}`,explanation:"A one-hot vector says which class is the true class."},{id:"cross-entropy-one-hot",stepLabel:"34.2",group:"Softmax cross-entropy",title:"Cross-entropy from true class probability",concept:"For a one-hot label, cross-entropy is -log(probability of the true class).",objective:"Return -Math.log(probabilities[targetIndex]).",difficulty:"core",starterCode:`function crossEntropyFromTarget(probabilities, targetIndex) {
  // TODO: return negative log probability of the true class.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p=0.5', crossEntropyFromTarget([0.5, 0.5], 0), -Math.log(0.5));
check('p=0.8', crossEntropyFromTarget([0.1, 0.8, 0.1], 1), -Math.log(0.8));
check('p=0.25', crossEntropyFromTarget([0.25, 0.25, 0.5], 0), -Math.log(0.25));

return results;`,hints:["Only the probability assigned to the true class matters for one-hot cross-entropy.","Use probabilities[targetIndex].","return -Math.log(probabilities[targetIndex]);"],solution:`function crossEntropyFromTarget(probabilities, targetIndex) {
  return -Math.log(probabilities[targetIndex]);
}`,explanation:"Cross-entropy strongly penalizes assigning low probability to the true class."},{id:"softmax-cross-entropy-gradient",stepLabel:"34.3",group:"Softmax cross-entropy",title:"Softmax + CE gradient",concept:"For softmax followed by cross-entropy, the logit gradient is probabilities minus one-hot target.",objective:"Push probabilities[i] - target[i].",difficulty:"challenge",starterCode:`function softmaxCrossEntropyGradient(probabilities, targetIndex) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetIndex ? 1 : 0;

    // TODO: push probability minus target.
    gradient.push(0);
  }

  return gradient;
}`,testCode:`const results = [];

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

return results;`,hints:["This is the famous simplification: gradient = p - y.","target is already 1 for the true class and 0 otherwise.","gradient.push(probabilities[i] - target);"],solution:`function softmaxCrossEntropyGradient(probabilities, targetIndex) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetIndex ? 1 : 0;
    gradient.push(probabilities[i] - target);
  }

  return gradient;
}`,explanation:"The true class gets pushed up when its probability is too low; other classes get pushed down."},{id:"softmax-gradient-sum-zero",stepLabel:"34.4",group:"Softmax cross-entropy",title:"Softmax gradient sums to zero",concept:"Softmax logits compete: increasing one class decreases others, so gradients sum to zero.",objective:"Return the sum of the gradient entries.",difficulty:"core",starterCode:`function gradientSum(gradient) {
  let total = 0;

  for (let i = 0; i < gradient.length; i++) {
    // TODO: add the current gradient entry.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('binary gradient', gradientSum([-0.3, 0.3]), 0);
check('three-class gradient', gradientSum([0.1, -0.2, 0.1]), 0);
check('general sum', gradientSum([0.25, 0.25, -0.5]), 0);

return results;`,hints:["Loop over the gradient entries.","Add each entry into total.","total += gradient[i];"],solution:`function gradientSum(gradient) {
  let total = 0;

  for (let i = 0; i < gradient.length; i++) {
    total += gradient[i];
  }

  return total;
}`,explanation:"Softmax probabilities are coupled; probability mass shifts between classes."},{id:"batch-size",stepLabel:"35.1",group:"Batch matrix shapes",title:"Batch size",concept:"A batch matrix has one row per example.",objective:"Return the number of examples in X.",difficulty:"warmup",starterCode:`function batchSize(X) {
  // TODO: return the number of rows.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two examples', batchSize([[1, 2], [3, 4]]), 2);
check('three examples', batchSize([[1], [2], [3]]), 3);
check('one example', batchSize([[5, 6, 7]]), 1);

return results;`,hints:["Rows are examples.","The number of rows is X.length.","return X.length;"],solution:`function batchSize(X) {
  return X.length;
}`,explanation:"In many ML libraries, a data batch X has shape batch x features."},{id:"feature-count",stepLabel:"35.2",group:"Batch matrix shapes",title:"Feature count",concept:"A batch matrix has one column per input feature.",objective:"Return the number of columns in X.",difficulty:"warmup",starterCode:`function featureCount(X) {
  // TODO: return the number of features.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two features', featureCount([[1, 2], [3, 4]]), 2);
check('one feature', featureCount([[1], [2], [3]]), 1);
check('three features', featureCount([[5, 6, 7]]), 3);

return results;`,hints:["Features are columns.","The first row length gives the number of features.","return X[0].length;"],solution:`function featureCount(X) {
  return X[0].length;
}`,explanation:"The feature count determines how many input weights each neuron needs."},{id:"dense-output-shape",stepLabel:"35.3",group:"Batch matrix shapes",title:"Dense layer output shape",concept:"If X is batch x inputDim and W is inputDim x outputDim, then XW is batch x outputDim.",objective:"Return [batchSize, outputDim].",difficulty:"core",starterCode:`function denseOutputShape(X, W) {
  const batch = X.length;
  const outputDim = W[0].length;

  // TODO: return the output shape.
  return [];
}`,testCode:`const results = [];

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

return results;`,hints:["Rows come from X.","Output columns come from W.","return [batch, outputDim];"],solution:`function denseOutputShape(X, W) {
  const batch = X.length;
  const outputDim = W[0].length;
  return [batch, outputDim];
}`,explanation:"Dense layers are matrix multiplication with a batch dimension."},{id:"dense-shape-compatible",stepLabel:"35.4",group:"Batch matrix shapes",title:"Dense layer shape check",concept:"The feature count of X must match the input dimension of W.",objective:"Return whether X and W can multiply.",difficulty:"core",starterCode:`function denseShapesCompatible(X, W) {
  const inputFeatures = X[0].length;
  const weightInputDim = W.length;

  // TODO: return whether the inner dimensions match.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('2x3 and 3x4 compatible', denseShapesCompatible([[1,2,3],[4,5,6]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), true);
check('2x2 and 3x4 incompatible', denseShapesCompatible([[1,2],[3,4]], [[1,2,3,4],[5,6,7,8],[9,10,11,12]]), false);
check('1x2 and 2x1 compatible', denseShapesCompatible([[1,2]], [[3],[4]]), true);

return results;`,hints:["The inner dimensions must match.","Compare X[0].length with W.length.","return inputFeatures === weightInputDim;"],solution:`function denseShapesCompatible(X, W) {
  const inputFeatures = X[0].length;
  const weightInputDim = W.length;
  return inputFeatures === weightInputDim;
}`,explanation:"Many neural-network bugs are shape bugs. This check catches the most common dense-layer mismatch."},{id:"dense-add-bias-each-row",stepLabel:"35.5",group:"Batch matrix shapes",title:"Add bias to each row",concept:"Dense-layer bias is added to every example in the batch.",objective:"Add bias[col] to each output cell.",difficulty:"challenge",starterCode:`function addBias(Y, bias) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["Bias has one value per output column.","Use bias[col].","values.push(Y[row][col] + bias[col]);"],solution:`function addBias(Y, bias) {
  const result = [];

  for (let row = 0; row < Y.length; row++) {
    const values = [];

    for (let col = 0; col < Y[0].length; col++) {
      values.push(Y[row][col] + bias[col]);
    }

    result.push(values);
  }

  return result;
}`,explanation:"Bias broadcasts across the batch: every example gets the same output-feature offsets."},{id:"dense-one-output-neuron",stepLabel:"36.1",group:"Mini neural network layer",title:"One dense output",concept:"One dense-layer output is one input vector dotted with one weight vector plus bias.",objective:"Return dot(x, weights) + bias.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseOne(x, weights, bias) {
  // TODO: return dot(x, weights) + bias.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple dense output', denseOne([1, 2], [3, 4], 0), 11);
check('with bias', denseOne([1, 2], [3, 4], -1), 10);
check('negative weight', denseOne([-1, 2], [3, 5], 1), 8);

return results;`,hints:["A dense neuron is a dot product plus a bias.","Use the dot helper.","return dot(x, weights) + bias;"],solution:`function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function denseOne(x, weights, bias) {
  return dot(x, weights) + bias;
}`,explanation:"A dense layer is many versions of this one-neuron calculation."},{id:"dense-multiple-outputs",stepLabel:"36.2",group:"Mini neural network layer",title:"Multiple dense outputs",concept:"A dense layer has one weight vector and one bias per output feature.",objective:"Push one output for each output weight vector.",difficulty:"core",starterCode:`function dot(a, b) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["Each output j has its own weight vector and bias.","Use dot(x, weightColumns[j]) + biases[j].","outputs.push(dot(x, weightColumns[j]) + biases[j]);"],solution:`function dot(a, b) {
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
}`,explanation:"A dense layer maps one input vector to several output features by using several weight vectors."},{id:"dense-relu-vector",stepLabel:"36.3",group:"Mini neural network layer",title:"ReLU on a vector",concept:"Neural layers apply activations element by element.",objective:"Push Math.max(0, values[i]) for every coordinate.",difficulty:"warmup",starterCode:`function reluVector(values) {
  const activated = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: push ReLU of values[i].
    activated.push(values[i]);
  }

  return activated;
}`,testCode:`const results = [];

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

return results;`,hints:["ReLU is max(0, value).","Use Math.max(0, values[i]).","activated.push(Math.max(0, values[i]));"],solution:`function reluVector(values) {
  const activated = [];

  for (let i = 0; i < values.length; i++) {
    activated.push(Math.max(0, values[i]));
  }

  return activated;
}`,explanation:"Activations usually apply coordinate by coordinate after a linear transformation."},{id:"two-layer-mini-network",stepLabel:"36.4",group:"Mini neural network layer",title:"Two-layer mini network",concept:"A simple network can be dense -> ReLU -> dense.",objective:"Feed hidden activations into the output layer.",difficulty:"challenge",starterCode:`function dot(a, b) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["The hidden activations are already computed.","Use denseLayer(hidden, outputWeights, outputBiases).","return denseLayer(hidden, outputWeights, outputBiases);"],solution:`function dot(a, b) {
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
}`,explanation:"Stacking layers means using one layer output as the next layer input."},{id:"training-loop-one-prediction",stepLabel:"37.1",group:"Training loop mechanics",title:"One prediction",concept:"Training begins with a prediction from current parameters.",objective:"Return weight * x + bias.",difficulty:"warmup",starterCode:`function predictLinear(x, weight, bias) {
  // TODO: return weight * x + bias.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predict 2*3+1', predictLinear(3, 2, 1), 7);
check('predict -1*4+2', predictLinear(4, -1, 2), -2);
check('bias only', predictLinear(10, 0, 5), 5);

return results;`,hints:["Linear prediction is slope times input plus bias.","Use weight * x + bias.","return weight * x + bias;"],solution:`function predictLinear(x, weight, bias) {
  return weight * x + bias;
}`,explanation:"A training loop repeatedly predicts, measures error, computes gradients, and updates parameters."},{id:"training-loop-one-loss",stepLabel:"37.2",group:"Training loop mechanics",title:"One-example loss",concept:"Squared error loss measures prediction error squared.",objective:"Return (prediction - target)^2.",difficulty:"warmup",starterCode:`function squaredLoss(prediction, target) {
  const error = prediction - target;

  // TODO: return squared error.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('error 3', squaredLoss(10, 7), 9);
check('error -5', squaredLoss(4, 9), 25);
check('perfect', squaredLoss(5, 5), 0);

return results;`,hints:["Squared error means error times error.","The error variable is already computed.","return error * error;"],solution:`function squaredLoss(prediction, target) {
  const error = prediction - target;
  return error * error;
}`,explanation:"The loss is the number the training loop tries to reduce."},{id:"training-loop-average-loss",stepLabel:"37.3",group:"Training loop mechanics",title:"Average batch loss",concept:"Batch loss averages losses over examples.",objective:"Divide total loss by the number of examples.",difficulty:"core",starterCode:`function averageLoss(losses) {
  let total = 0;

  for (let i = 0; i < losses.length; i++) {
    total += losses[i];
  }

  // TODO: return the average loss.
  return total;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('average [1,2,3]', averageLoss([1, 2, 3]), 2);
check('average [10,20]', averageLoss([10, 20]), 15);
check('average zeros', averageLoss([0, 0, 0]), 0);

return results;`,hints:["Average means total divided by count.","The count is losses.length.","return total / losses.length;"],solution:`function averageLoss(losses) {
  let total = 0;

  for (let i = 0; i < losses.length; i++) {
    total += losses[i];
  }

  return total / losses.length;
}`,explanation:"Training reports average loss so batches of different sizes are comparable."},{id:"training-loop-step-summary",stepLabel:"37.4",group:"Training loop mechanics",title:"One training step",concept:"A training step computes prediction, error, gradients, and updated parameters.",objective:"Return updated weight after one gradient step.",difficulty:"challenge",starterCode:`function oneStepWeightUpdate(x, target, weight, bias, learningRate) {
  const prediction = weight * x + bias;
  const error = prediction - target;

  // Gradient of squared error without the factor 2 for simplicity.
  const weightGradient = error * x;

  // TODO: return updated weight.
  return weight;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('update decreases high prediction', oneStepWeightUpdate(2, 3, 2, 0, 0.1), 1.8);
check('update increases low prediction', oneStepWeightUpdate(2, 10, 2, 0, 0.1), 3.2);
check('perfect no update', oneStepWeightUpdate(2, 4, 2, 0, 0.1), 2);

return results;`,hints:["Gradient descent subtracts learningRate * gradient.","The weightGradient is already computed.","return weight - learningRate * weightGradient;"],solution:`function oneStepWeightUpdate(x, target, weight, bias, learningRate) {
  const prediction = weight * x + bias;
  const error = prediction - target;
  const weightGradient = error * x;

  return weight - learningRate * weightGradient;
}`,explanation:"One training step nudges parameters opposite the gradient."},{id:"optimizer-sgd-update",stepLabel:"38.1",group:"Optimizer updates",title:"SGD update",concept:"Stochastic gradient descent subtracts learningRate times gradient.",objective:"Return parameter - learningRate * gradient.",difficulty:"warmup",starterCode:`function sgdUpdate(parameter, gradient, learningRate) {
  // TODO: return the updated parameter.
  return parameter;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive gradient', sgdUpdate(1, 3, 0.1), 0.7);
check('negative gradient', sgdUpdate(1, -2, 0.5), 2);
check('zero gradient', sgdUpdate(5, 0, 0.1), 5);

return results;`,hints:["Move opposite the gradient.","Subtract learningRate * gradient.","return parameter - learningRate * gradient;"],solution:`function sgdUpdate(parameter, gradient, learningRate) {
  return parameter - learningRate * gradient;
}`,explanation:"SGD is the simplest optimizer: follow the negative gradient."},{id:"optimizer-momentum-velocity",stepLabel:"38.2",group:"Optimizer updates",title:"Momentum velocity",concept:"Momentum keeps a moving velocity of recent gradients.",objective:"Return beta * velocity + gradient.",difficulty:"core",starterCode:`function updateVelocity(velocity, gradient, beta) {
  // TODO: combine old velocity and current gradient.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('new velocity', updateVelocity(0, 3, 0.9), 3);
check('carry velocity', updateVelocity(10, 3, 0.9), 12);
check('negative gradient', updateVelocity(5, -2, 0.8), 2);

return results;`,hints:["Momentum mixes previous velocity with current gradient.","Use beta * velocity + gradient.","return beta * velocity + gradient;"],solution:`function updateVelocity(velocity, gradient, beta) {
  return beta * velocity + gradient;
}`,explanation:"Momentum smooths updates by remembering previous gradient direction."},{id:"optimizer-momentum-update",stepLabel:"38.3",group:"Optimizer updates",title:"Momentum update",concept:"Momentum updates parameters using velocity rather than the raw current gradient only.",objective:"Subtract learningRate times velocity.",difficulty:"core",starterCode:`function momentumParameterUpdate(parameter, velocity, learningRate) {
  // TODO: update parameter using velocity.
  return parameter;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('velocity 3', momentumParameterUpdate(1, 3, 0.1), 0.7);
check('negative velocity', momentumParameterUpdate(1, -2, 0.5), 2);
check('zero velocity', momentumParameterUpdate(5, 0, 0.1), 5);

return results;`,hints:["Velocity acts like the gradient direction to follow.","Subtract learningRate * velocity.","return parameter - learningRate * velocity;"],solution:`function momentumParameterUpdate(parameter, velocity, learningRate) {
  return parameter - learningRate * velocity;
}`,explanation:"Momentum can accelerate updates in consistent directions and damp zig-zagging."},{id:"optimizer-adam-first-moment",stepLabel:"38.4",group:"Optimizer updates",title:"Adam first moment",concept:"Adam keeps an exponential moving average of gradients.",objective:"Return beta1 * m + (1 - beta1) * gradient.",difficulty:"core",starterCode:`function adamFirstMoment(m, gradient, beta1) {
  // TODO: update the first moment estimate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('first moment from zero', adamFirstMoment(0, 10, 0.9), 1);
check('carry moment', adamFirstMoment(5, 10, 0.9), 5.5);
check('negative gradient', adamFirstMoment(1, -9, 0.8), -1);

return results;`,hints:["Adam first moment is a weighted average of old m and new gradient.","Use beta1 for old m and 1 - beta1 for gradient.","return beta1 * m + (1 - beta1) * gradient;"],solution:`function adamFirstMoment(m, gradient, beta1) {
  return beta1 * m + (1 - beta1) * gradient;
}`,explanation:"Adam first moment behaves like momentum but with exponential averaging."},{id:"optimizer-adam-second-moment",stepLabel:"38.5",group:"Optimizer updates",title:"Adam second moment",concept:"Adam tracks an exponential moving average of squared gradients.",objective:"Return beta2 * v + (1 - beta2) * gradient squared.",difficulty:"core",starterCode:`function adamSecondMoment(v, gradient, beta2) {
  // TODO: update the second moment estimate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('second moment from zero', adamSecondMoment(0, 10, 0.99), 1);
check('carry second moment', adamSecondMoment(5, 10, 0.9), 14.5);
check('negative gradient squares', adamSecondMoment(0, -3, 0.9), 0.9);

return results;`,hints:["Use gradient * gradient.","Mix old v with squared gradient.","return beta2 * v + (1 - beta2) * gradient * gradient;"],solution:`function adamSecondMoment(v, gradient, beta2) {
  return beta2 * v + (1 - beta2) * gradient * gradient;
}`,explanation:"Adam uses the second moment to scale updates by recent gradient magnitude."},{id:"regularization-l2-penalty",stepLabel:"39.1",group:"Regularization",title:"L2 penalty",concept:"L2 regularization penalizes large weights by adding lambda times sum of squared weights.",objective:"Accumulate weight squared.",difficulty:"core",starterCode:`function l2Penalty(weights, lambda) {
  let sumSquares = 0;

  for (let i = 0; i < weights.length; i++) {
    // TODO: add squared weight.
    sumSquares += 0;
  }

  return lambda * sumSquares;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('simple L2', l2Penalty([3, 4], 1), 25);
check('lambda half', l2Penalty([3, 4], 0.5), 12.5);
check('zero weights', l2Penalty([0, 0], 10), 0);

return results;`,hints:["L2 uses squared weights.","Add weights[i] * weights[i].","sumSquares += weights[i] * weights[i];"],solution:`function l2Penalty(weights, lambda) {
  let sumSquares = 0;

  for (let i = 0; i < weights.length; i++) {
    sumSquares += weights[i] * weights[i];
  }

  return lambda * sumSquares;
}`,explanation:"L2 discourages very large weights, often improving generalization."},{id:"regularization-l2-gradient",stepLabel:"39.2",group:"Regularization",title:"L2 gradient",concept:"The derivative of lambda times w squared with respect to w is 2 * lambda * w.",objective:"Push 2 * lambda * weight.",difficulty:"core",starterCode:`function l2Gradient(weights, lambda) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    // TODO: push the L2 gradient for this weight.
    gradients.push(0);
  }

  return gradients;
}`,testCode:`const results = [];

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

return results;`,hints:["Derivative of w squared is 2w.","Multiply by lambda.","gradients.push(2 * lambda * weights[i]);"],solution:`function l2Gradient(weights, lambda) {
  const gradients = [];

  for (let i = 0; i < weights.length; i++) {
    gradients.push(2 * lambda * weights[i]);
  }

  return gradients;
}`,explanation:"L2 gradient pulls weights toward zero."},{id:"regularization-dropout-mask",stepLabel:"39.3",group:"Regularization",title:"Apply dropout mask",concept:"Dropout removes selected activations during training.",objective:"Multiply each activation by its mask value.",difficulty:"warmup",starterCode:`function applyDropoutMask(activations, mask) {
  const dropped = [];

  for (let i = 0; i < activations.length; i++) {
    // TODO: multiply activation by mask.
    dropped.push(activations[i]);
  }

  return dropped;
}`,testCode:`const results = [];

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

return results;`,hints:["Mask values are 0 or 1.","Multiply activations[i] by mask[i].","dropped.push(activations[i] * mask[i]);"],solution:`function applyDropoutMask(activations, mask) {
  const dropped = [];

  for (let i = 0; i < activations.length; i++) {
    dropped.push(activations[i] * mask[i]);
  }

  return dropped;
}`,explanation:"Dropout forces the network not to rely too heavily on any one activation."},{id:"regularization-inverted-dropout",stepLabel:"39.4",group:"Regularization",title:"Inverted dropout scaling",concept:"Inverted dropout divides kept activations by keep probability.",objective:"Apply mask and divide by keepProbability.",difficulty:"core",starterCode:`function invertedDropout(activations, mask, keepProbability) {
  const output = [];

  for (let i = 0; i < activations.length; i++) {
    // TODO: apply inverted dropout scaling.
    output.push(activations[i]);
  }

  return output;
}`,testCode:`const results = [];

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

return results;`,hints:["First multiply by mask[i].","Then divide by keepProbability.","output.push((activations[i] * mask[i]) / keepProbability);"],solution:`function invertedDropout(activations, mask, keepProbability) {
  const output = [];

  for (let i = 0; i < activations.length; i++) {
    output.push((activations[i] * mask[i]) / keepProbability);
  }

  return output;
}`,explanation:"Inverted dropout keeps expected activation scale roughly stable during training."},{id:"matmul-backprop-a-entry",stepLabel:"40.1",group:"Matrix multiplication backprop",title:"Gradient for A entry",concept:"If C[i][j] = sum over k of A[i][k] * B[k][j], then the derivative with respect to A[i][k] is B[k][j].",objective:"Return B[k][j].",difficulty:"core",starterCode:`function gradCellWithRespectToA(B, k, j) {
  // TODO: return the derivative of C[i][j] with respect to A[i][k].
  return 0;
}`,testCode:`const results = [];

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

return results;`,hints:["A[i][k] is multiplied by B[k][j].","The derivative with respect to A[i][k] is B[k][j].","return B[k][j];"],solution:`function gradCellWithRespectToA(B, k, j) {
  return B[k][j];
}`,explanation:"Backprop through multiplication sends the other factor backward."},{id:"matmul-backprop-b-entry",stepLabel:"40.2",group:"Matrix multiplication backprop",title:"Gradient for B entry",concept:"If C[i][j] = sum over k of A[i][k] * B[k][j], then the derivative with respect to B[k][j] is A[i][k].",objective:"Return A[i][k].",difficulty:"core",starterCode:`function gradCellWithRespectToB(A, i, k) {
  // TODO: return the derivative of C[i][j] with respect to B[k][j].
  return 0;
}`,testCode:`const results = [];

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

return results;`,hints:["B[k][j] is multiplied by A[i][k].","The derivative with respect to B[k][j] is A[i][k].","return A[i][k];"],solution:`function gradCellWithRespectToB(A, i, k) {
  return A[i][k];
}`,explanation:"Again, the gradient through multiplication sends the other factor backward."},{id:"matmul-backprop-dA",stepLabel:"40.3",group:"Matrix multiplication backprop",title:"dA from dC",concept:"For C = AB, the gradient with respect to A is dC times B transposed.",objective:"Return matmul(dC, transpose(B)).",difficulty:"challenge",starterCode:`function transpose(A) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["The formula is dA = dC times B transpose.","Use transpose(B).","return matmul(dC, transpose(B));"],solution:`function transpose(A) {
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
}`,explanation:"Matrix backprop uses transposes to send gradients to the correct side of the multiplication."},{id:"matmul-backprop-dB",stepLabel:"40.4",group:"Matrix multiplication backprop",title:"dB from dC",concept:"For C = AB, the gradient with respect to B is A transposed times dC.",objective:"Return matmul(transpose(A), dC).",difficulty:"challenge",starterCode:`function transpose(A) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["The formula is dB = A transpose times dC.","Use transpose(A).","return matmul(transpose(A), dC);"],solution:`function transpose(A) {
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
}`,explanation:"This is the dense-layer weight-gradient formula used in neural-network training."}],n=[{id:"transformer-token-embedding-lookup",stepLabel:"41.1",group:"Transformer mini-block shapes",title:"Token embedding lookup",concept:"A token ID selects one row from the embedding table.",objective:"Return embeddingTable[tokenId].",difficulty:"warmup",starterCode:`function lookupEmbedding(embeddingTable, tokenId) {
  // TODO: return the embedding vector for tokenId.
  return [];
}`,testCode:`const results = [];

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

return results;`,hints:["The embedding table is indexed by token ID.","Return the row at tokenId.","return embeddingTable[tokenId];"],solution:`function lookupEmbedding(embeddingTable, tokenId) {
  return embeddingTable[tokenId];
}`,explanation:"Token IDs become vectors by selecting rows from an embedding matrix."},{id:"transformer-add-position",stepLabel:"41.2",group:"Transformer mini-block shapes",title:"Add positional embedding",concept:"Token embeddings and position embeddings are added coordinate by coordinate.",objective:"Push tokenEmbedding[i] + positionEmbedding[i].",difficulty:"warmup",starterCode:`function addPosition(tokenEmbedding, positionEmbedding) {
  const result = [];

  for (let i = 0; i < tokenEmbedding.length; i++) {
    // TODO: add token and position coordinate.
    result.push(0);
  }

  return result;
}`,testCode:`const results = [];

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

return results;`,hints:["Embeddings have the same dimension.","Add coordinate by coordinate.","result.push(tokenEmbedding[i] + positionEmbedding[i]);"],solution:`function addPosition(tokenEmbedding, positionEmbedding) {
  const result = [];

  for (let i = 0; i < tokenEmbedding.length; i++) {
    result.push(tokenEmbedding[i] + positionEmbedding[i]);
  }

  return result;
}`,explanation:"Position information lets equal tokens behave differently at different sequence positions."},{id:"transformer-project-query",stepLabel:"41.3",group:"Transformer mini-block shapes",title:"Project to query vector",concept:"A query vector is a linear projection of the hidden state.",objective:"Return hidden times Wq using row dot products.",difficulty:"core",starterCode:`function dot(a, b) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["Each output coordinate has its own weight column.","Use dot(hidden, weightColumns[j]).","output.push(dot(hidden, weightColumns[j]));"],solution:`function dot(a, b) {
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
}`,explanation:"Transformers create Q, K, and V vectors through learned linear projections."},{id:"transformer-attention-score-shape",stepLabel:"41.4",group:"Transformer mini-block shapes",title:"Attention score shape",concept:"Q times K transposed produces one score for every query token and key token pair.",objective:"Return [numQueries, numKeys].",difficulty:"core",starterCode:`function attentionScoreShape(Q, K) {
  const numQueries = Q.length;
  const numKeys = K.length;

  // TODO: return the shape of Q times K transposed.
  return [];
}`,testCode:`const results = [];

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

return results;`,hints:["Rows come from queries.","Columns come from keys.","return [numQueries, numKeys];"],solution:`function attentionScoreShape(Q, K) {
  const numQueries = Q.length;
  const numKeys = K.length;

  return [numQueries, numKeys];
}`,explanation:"Attention score matrices grow with sequence length squared in full attention."},{id:"transformer-causal-mask-check",stepLabel:"41.5",group:"Transformer mini-block shapes",title:"Causal mask visibility",concept:"In causal attention, a query position can read only keys at the same or earlier positions.",objective:"Return true if keyPosition <= queryPosition.",difficulty:"core",starterCode:`function canAttendCausally(queryPosition, keyPosition) {
  // TODO: return whether query can see key.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same position visible', canAttendCausally(2, 2), true);
check('past visible', canAttendCausally(2, 0), true);
check('future hidden', canAttendCausally(2, 3), false);
check('first token cannot see second', canAttendCausally(0, 1), false);

return results;`,hints:["Causal attention blocks future keys.","A key is visible if keyPosition is less than or equal to queryPosition.","return keyPosition <= queryPosition;"],solution:`function canAttendCausally(queryPosition, keyPosition) {
  return keyPosition <= queryPosition;
}`,explanation:"Causal masking prevents next-token models from seeing future answers."},{id:"self-attention-one-query-scores",stepLabel:"42.1",group:"Mini self-attention",title:"Scores for one query",concept:"A query compares itself to every key using dot products.",objective:"Push dot(query, keys[i]) for every key.",difficulty:"core",starterCode:`function dot(a, b) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["Each score is one dot product.","Compare the query with each key vector.","scores.push(dot(query, keys[i]));"],solution:`function dot(a, b) {
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
}`,explanation:"Self-attention starts by asking how strongly this query matches each key."},{id:"self-attention-scale-scores",stepLabel:"42.2",group:"Mini self-attention",title:"Scale attention scores",concept:"Scaled dot-product attention divides scores by sqrt(d).",objective:"Divide every score by Math.sqrt(d).",difficulty:"core",starterCode:`function scaleScores(scores, d) {
  const scaled = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push scores[i] divided by sqrt(d).
    scaled.push(scores[i]);
  }

  return scaled;
}`,testCode:`const results = [];

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

return results;`,hints:["Use Math.sqrt(d).","Each score gets divided by the same scale.","scaled.push(scores[i] / Math.sqrt(d));"],solution:`function scaleScores(scores, d) {
  const scaled = [];

  for (let i = 0; i < scores.length; i++) {
    scaled.push(scores[i] / Math.sqrt(d));
  }

  return scaled;
}`,explanation:"Scaling prevents large dot products from making softmax too sharp too early."},{id:"self-attention-causal-mask-scores",stepLabel:"42.3",group:"Mini self-attention",title:"Apply causal mask",concept:"Causal attention hides future positions by setting their scores to -Infinity.",objective:"Keep visible scores and mask future scores.",difficulty:"core",starterCode:`function applyCausalMask(scores, queryPosition) {
  const masked = [];

  for (let keyPosition = 0; keyPosition < scores.length; keyPosition++) {
    // TODO: keep scores[keyPosition] if keyPosition <= queryPosition, otherwise -Infinity.
    masked.push(scores[keyPosition]);
  }

  return masked;
}`,testCode:`const results = [];

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

return results;`,hints:["A token can attend to itself and the past.","Future key positions are greater than queryPosition.","masked.push(keyPosition <= queryPosition ? scores[keyPosition] : -Infinity);"],solution:`function applyCausalMask(scores, queryPosition) {
  const masked = [];

  for (let keyPosition = 0; keyPosition < scores.length; keyPosition++) {
    masked.push(keyPosition <= queryPosition ? scores[keyPosition] : -Infinity);
  }

  return masked;
}`,explanation:"Causal masking prevents next-token models from seeing future tokens."},{id:"self-attention-stable-softmax",stepLabel:"42.4",group:"Mini self-attention",title:"Stable softmax",concept:"Stable softmax subtracts the maximum score before exponentiating.",objective:"Use Math.exp(scores[i] - maxScore).",difficulty:"challenge",starterCode:`function stableSoftmax(scores) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["Subtracting maxScore does not change the softmax probabilities.","It prevents overflow for large scores.","denominator += Math.exp(scores[i] - maxScore);"],solution:`function stableSoftmax(scores) {
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
}`,explanation:"Stable softmax is the same math, but safer numerically."},{id:"self-attention-weighted-value-sum",stepLabel:"42.5",group:"Mini self-attention",title:"Weighted value sum",concept:"Attention output is a weighted mixture of value vectors.",objective:"Add weights[token] * values[token][dim] into output[dim].",difficulty:"challenge",starterCode:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      // TODO: add this token's weighted value coordinate.
      output[dim] += 0;
    }
  }

  return output;
}`,testCode:`const results = [];

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

return results;`,hints:["Each value vector contributes according to its attention weight.","For each dimension, add weights[token] times values[token][dim].","output[dim] += weights[token] * values[token][dim];"],solution:`function weightedValueSum(weights, values) {
  const dimension = values[0].length;
  const output = Array(dimension).fill(0);

  for (let token = 0; token < values.length; token++) {
    for (let dim = 0; dim < dimension; dim++) {
      output[dim] += weights[token] * values[token][dim];
    }
  }

  return output;
}`,explanation:"Attention does not copy one token. It mixes value vectors using attention weights."},{id:"layernorm-feature-mean",stepLabel:"43.1",group:"LayerNorm and RMSNorm",title:"Feature mean",concept:"LayerNorm computes statistics across features of one token.",objective:"Return the average of the feature vector.",difficulty:"warmup",starterCode:`function featureMean(x) {
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    total += x[i];
  }

  // TODO: return the average.
  return total;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mean [1,2,3]', featureMean([1, 2, 3]), 2);
check('mean [10,20]', featureMean([10, 20]), 15);
check('mean [-1,1]', featureMean([-1, 1]), 0);

return results;`,hints:["Average is total divided by number of features.","The number of features is x.length.","return total / x.length;"],solution:`function featureMean(x) {
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    total += x[i];
  }

  return total / x.length;
}`,explanation:"LayerNorm normalizes one token vector at a time, not a whole batch."},{id:"layernorm-feature-variance",stepLabel:"43.2",group:"LayerNorm and RMSNorm",title:"Feature variance",concept:"Variance measures average squared distance from the mean.",objective:"Add squared centered values.",difficulty:"core",starterCode:`function featureVariance(x) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centered = x[i] - mean;

    // TODO: add centered squared.
    total += 0;
  }

  return total / x.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('variance [1,2,3]', featureVariance([1, 2, 3]), 2 / 3);
check('variance [10,20]', featureVariance([10, 20]), 25);
check('variance constant', featureVariance([5, 5, 5]), 0);

return results;`,hints:["Variance uses squared centered values.","centered is already computed.","total += centered * centered;"],solution:`function featureVariance(x) {
  const mean = x.reduce((total, value) => total + value, 0) / x.length;
  let total = 0;

  for (let i = 0; i < x.length; i++) {
    const centered = x[i] - mean;
    total += centered * centered;
  }

  return total / x.length;
}`,explanation:"LayerNorm uses variance to rescale features to a stable range."},{id:"layernorm-normalize-vector",stepLabel:"43.3",group:"LayerNorm and RMSNorm",title:"Normalize one token vector",concept:"LayerNorm subtracts mean and divides by standard deviation.",objective:"Push (x[i] - mean) / sqrt(variance + eps).",difficulty:"challenge",starterCode:`function layerNormNoAffine(x, eps = 1e-5) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["Standard deviation is Math.sqrt(variance + eps).","Subtract mean first, then divide by std.","normalized.push((x[i] - mean) / Math.sqrt(variance + eps));"],solution:`function layerNormNoAffine(x, eps = 1e-5) {
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
}`,explanation:"LayerNorm stabilizes the scale of each token representation before the next transformation."},{id:"rmsnorm-denominator",stepLabel:"43.4",group:"LayerNorm and RMSNorm",title:"RMSNorm denominator",concept:"RMSNorm divides by root mean square without subtracting the mean.",objective:"Return sqrt(mean square + eps).",difficulty:"core",starterCode:`function rmsDenominator(x, eps = 1e-5) {
  let meanSquare = 0;

  for (let i = 0; i < x.length; i++) {
    meanSquare += x[i] * x[i];
  }

  meanSquare = meanSquare / x.length;

  // TODO: return root mean square denominator.
  return meanSquare;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('rms [3,4] eps 0', rmsDenominator([3, 4], 0), Math.sqrt(12.5));
check('rms [1,1] eps 0', rmsDenominator([1, 1], 0), 1);
check('rms [0,0] eps 1', rmsDenominator([0, 0], 1), 1);

return results;`,hints:["RMS means root mean square.","Use Math.sqrt(meanSquare + eps).","return Math.sqrt(meanSquare + eps);"],solution:`function rmsDenominator(x, eps = 1e-5) {
  let meanSquare = 0;

  for (let i = 0; i < x.length; i++) {
    meanSquare += x[i] * x[i];
  }

  meanSquare = meanSquare / x.length;

  return Math.sqrt(meanSquare + eps);
}`,explanation:"RMSNorm stabilizes scale without centering features."},{id:"residual-add-vector",stepLabel:"44.1",group:"Residual stream mechanics",title:"Add residual",concept:"A residual connection adds a block output back to the original stream.",objective:"Push x[i] + update[i].",difficulty:"warmup",starterCode:`function addResidual(x, update) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: add original stream and update.
    result.push(0);
  }

  return result;
}`,testCode:`const results = [];

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

return results;`,hints:["Residual means original plus update.","Add coordinate by coordinate.","result.push(x[i] + update[i]);"],solution:`function addResidual(x, update) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + update[i]);
  }

  return result;
}`,explanation:"Residual connections let each block write an update into the shared representation stream."},{id:"residual-scaled-update",stepLabel:"44.2",group:"Residual stream mechanics",title:"Scaled residual update",concept:"Sometimes updates are scaled before being added to the residual stream.",objective:"Push x[i] + scale * update[i].",difficulty:"core",starterCode:`function addScaledResidual(x, update, scale) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    // TODO: add scaled update to x.
    result.push(x[i]);
  }

  return result;
}`,testCode:`const results = [];

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

return results;`,hints:["The update is multiplied by scale before adding.","Use x[i] + scale * update[i].","result.push(x[i] + scale * update[i]);"],solution:`function addScaledResidual(x, update, scale) {
  const result = [];

  for (let i = 0; i < x.length; i++) {
    result.push(x[i] + scale * update[i]);
  }

  return result;
}`,explanation:"Scaling residual updates can help control signal size in deep networks."},{id:"residual-prenorm-block",stepLabel:"44.3",group:"Residual stream mechanics",title:"Pre-norm residual block",concept:"A pre-norm block normalizes before the sublayer, then adds the sublayer output back to the stream.",objective:"Return x plus sublayer(normedX).",difficulty:"challenge",starterCode:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function preNormBlock(x, normedX, sublayer) {
  const update = sublayer(normedX);

  // TODO: return residual stream after the update.
  return update;
}`,testCode:`const results = [];

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

return results;`,hints:["Residual block returns original x plus update.","update is already computed.","return addVectors(x, update);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function preNormBlock(x, normedX, sublayer) {
  const update = sublayer(normedX);
  return addVectors(x, update);
}`,explanation:"Pre-norm transformers normalize the stream before attention or MLP, then add the block output back."},{id:"swiglu-silu",stepLabel:"45.1",group:"MLP and SwiGLU",title:"SiLU activation",concept:"SiLU is x * sigmoid(x), used inside SwiGLU-style MLPs.",objective:"Return x * sigmoid(x).",difficulty:"core",starterCode:`function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  // TODO: return x times sigmoid(x).
  return x;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('silu 0', silu(0), 0);
check('silu log 3', silu(Math.log(3)), Math.log(3) * 0.75);
check('silu -log 3', silu(-Math.log(3)), -Math.log(3) * 0.25);

return results;`,hints:["SiLU gates x by sigmoid(x).","sigmoid(x) is already available.","return x * sigmoid(x);"],solution:`function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function silu(x) {
  return x * sigmoid(x);
}`,explanation:"SiLU is a smooth gate: positive values mostly pass, negative values are softened."},{id:"swiglu-elementwise-gate",stepLabel:"45.2",group:"MLP and SwiGLU",title:"Elementwise gate",concept:"Gated MLPs multiply one hidden stream by another gate stream element by element.",objective:"Push values[i] * gates[i].",difficulty:"warmup",starterCode:`function elementwiseGate(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    // TODO: multiply matching entries.
    output.push(values[i]);
  }

  return output;
}`,testCode:`const results = [];

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

return results;`,hints:["This is elementwise multiplication.","Use values[i] * gates[i].","output.push(values[i] * gates[i]);"],solution:`function elementwiseGate(values, gates) {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    output.push(values[i] * gates[i]);
  }

  return output;
}`,explanation:"Gating lets one stream decide how much of another stream passes through."},{id:"swiglu-hidden",stepLabel:"45.3",group:"MLP and SwiGLU",title:"SwiGLU hidden activation",concept:"SwiGLU combines a value stream with a SiLU-activated gate stream.",objective:"Push value[i] * silu(gate[i]).",difficulty:"challenge",starterCode:`function sigmoid(x) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["Apply SiLU to the gate stream.","Then multiply by the value stream.","output.push(values[i] * silu(gates[i]));"],solution:`function sigmoid(x) {
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
}`,explanation:"SwiGLU is a modern gated MLP pattern used in many transformer variants."},{id:"mlp-output-projection",stepLabel:"45.4",group:"MLP and SwiGLU",title:"MLP output projection",concept:"After hidden activation, an MLP projects back to the model dimension.",objective:"Return denseLayer(hidden, outputWeights, outputBiases).",difficulty:"core",starterCode:`function dot(a, b) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["The helper denseLayer is already available.","Use hidden as the input vector.","return denseLayer(hidden, outputWeights, outputBiases);"],solution:`function dot(a, b) {
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
}`,explanation:"Transformer MLPs expand, activate or gate, then project back into the residual stream dimension."},{id:"transformer-attention-residual-update",stepLabel:"46.1",group:"Tiny transformer block",title:"Attention residual update",concept:"The attention sublayer writes an update into the residual stream.",objective:"Return x + attentionOutput.",difficulty:"warmup",starterCode:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function attentionResidual(x, attentionOutput) {
  // TODO: return residual stream after attention.
  return attentionOutput;
}`,testCode:`const results = [];

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

return results;`,hints:["Residual means original stream plus update.","Use addVectors.","return addVectors(x, attentionOutput);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function attentionResidual(x, attentionOutput) {
  return addVectors(x, attentionOutput);
}`,explanation:"Attention reads from the sequence and writes an update back into each token residual stream."},{id:"transformer-mlp-residual-update",stepLabel:"46.2",group:"Tiny transformer block",title:"MLP residual update",concept:"After attention, the MLP sublayer also writes into the residual stream.",objective:"Return streamAfterAttention + mlpOutput.",difficulty:"warmup",starterCode:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function mlpResidual(streamAfterAttention, mlpOutput) {
  // TODO: return residual stream after MLP.
  return mlpOutput;
}`,testCode:`const results = [];

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

return results;`,hints:["The MLP update is added to the current stream.","Use addVectors.","return addVectors(streamAfterAttention, mlpOutput);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function mlpResidual(streamAfterAttention, mlpOutput) {
  return addVectors(streamAfterAttention, mlpOutput);
}`,explanation:"Transformer blocks usually contain two residual writes: attention, then MLP."},{id:"transformer-prenorm-block-forward",stepLabel:"46.3",group:"Tiny transformer block",title:"Pre-norm transformer block",concept:"A pre-norm transformer block normalizes before attention and before MLP.",objective:"Return x + attention(norm1(x)) + mlp(norm2(afterAttention)).",difficulty:"challenge",starterCode:`function addVectors(a, b) {
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
}`,testCode:`const results = [];

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

return results;`,hints:["afterAttention is already x plus attention output.","The final step adds mlpOutput to afterAttention.","return addVectors(afterAttention, mlpOutput);"],solution:`function addVectors(a, b) {
  return a.map((value, i) => value + b[i]);
}

function tinyPreNormBlock(x, norm1, attention, norm2, mlp) {
  const attentionInput = norm1(x);
  const attentionOutput = attention(attentionInput);
  const afterAttention = addVectors(x, attentionOutput);

  const mlpInput = norm2(afterAttention);
  const mlpOutput = mlp(mlpInput);

  return addVectors(afterAttention, mlpOutput);
}`,explanation:"This is the transformer-block skeleton: normalize, attention, residual, normalize, MLP, residual."},{id:"transformer-stack-two-blocks",stepLabel:"46.4",group:"Tiny transformer block",title:"Stack two blocks",concept:"Transformer depth comes from feeding one block output into the next block.",objective:"Return block2(block1(x)).",difficulty:"core",starterCode:`function stackTwoBlocks(x, block1, block2) {
  const afterBlock1 = block1(x);

  // TODO: feed afterBlock1 into block2.
  return afterBlock1;
}`,testCode:`const results = [];

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

return results;`,hints:["Depth means sequential composition.","block2 receives the output of block1.","return block2(afterBlock1);"],solution:`function stackTwoBlocks(x, block1, block2) {
  const afterBlock1 = block1(x);
  return block2(afterBlock1);
}`,explanation:"Deep transformers repeatedly update the residual stream through many blocks."},{id:"debug-attention-weights-sum",stepLabel:"47.1",group:"Transformer debugging checks",title:"Attention weights sum to one",concept:"Softmax attention weights should sum to 1.",objective:"Return the sum of weights.",difficulty:"warmup",starterCode:`function sumWeights(weights) {
  let total = 0;

  for (let i = 0; i < weights.length; i++) {
    // TODO: add each weight.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two weights', sumWeights([0.5, 0.5]), 1);
check('three weights', sumWeights([0.2, 0.3, 0.5]), 1);
check('one weight', sumWeights([1]), 1);

return results;`,hints:["Loop over all weights.","Add weights[i] into total.","total += weights[i];"],solution:`function sumWeights(weights) {
  let total = 0;

  for (let i = 0; i < weights.length; i++) {
    total += weights[i];
  }

  return total;
}`,explanation:"If attention weights do not sum to one, the softmax or mask logic is likely broken."},{id:"debug-causal-leak",stepLabel:"47.2",group:"Transformer debugging checks",title:"Detect future attention leak",concept:"A causal mask fails if any query attends to a future key.",objective:"Return true if keyPosition is greater than queryPosition.",difficulty:"core",starterCode:`function isFutureLeak(queryPosition, keyPosition) {
  // TODO: return true when key is in the future.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('past is not leak', isFutureLeak(3, 1), false);
check('same position is not leak', isFutureLeak(3, 3), false);
check('future is leak', isFutureLeak(3, 4), true);
check('first query cannot see second key', isFutureLeak(0, 1), true);

return results;`,hints:["Future means keyPosition is greater than queryPosition.","Same position is allowed in causal attention.","return keyPosition > queryPosition;"],solution:`function isFutureLeak(queryPosition, keyPosition) {
  return keyPosition > queryPosition;
}`,explanation:"Future leakage lets next-token models cheat during training."},{id:"debug-residual-norm-explosion",stepLabel:"47.3",group:"Transformer debugging checks",title:"Detect residual norm explosion",concept:"Very large residual norms can indicate unstable updates.",objective:"Return true when norm exceeds threshold.",difficulty:"core",starterCode:`function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function residualNormTooLarge(stream, threshold) {
  // TODO: return whether norm(stream) is greater than threshold.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('small stream', residualNormTooLarge([3, 4], 10), false);
check('large stream', residualNormTooLarge([30, 40], 10), true);
check('equal threshold is not greater', residualNormTooLarge([3, 4], 5), false);

return results;`,hints:["Use the norm helper.","Compare norm(stream) with threshold.","return norm(stream) > threshold;"],solution:`function norm(v) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * v[i];
  }
  return Math.sqrt(total);
}

function residualNormTooLarge(stream, threshold) {
  return norm(stream) > threshold;
}`,explanation:"Monitoring residual stream norms can help diagnose instability in deep networks."},{id:"debug-attention-shape-mismatch",stepLabel:"47.4",group:"Transformer debugging checks",title:"Detect Q/K dimension mismatch",concept:"Queries and keys must have the same feature dimension for dot products.",objective:"Return whether queryDim equals keyDim.",difficulty:"core",starterCode:`function attentionDimsCompatible(query, key) {
  const queryDim = query.length;
  const keyDim = key.length;

  // TODO: return whether dimensions match.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same dimension', attentionDimsCompatible([1, 2], [3, 4]), true);
check('different dimension', attentionDimsCompatible([1, 2, 3], [4, 5]), false);
check('one-dimensional same', attentionDimsCompatible([1], [2]), true);

return results;`,hints:["Dot products require matching lengths.","Compare queryDim and keyDim.","return queryDim === keyDim;"],solution:`function attentionDimsCompatible(query, key) {
  const queryDim = query.length;
  const keyDim = key.length;

  return queryDim === keyDim;
}`,explanation:"Many transformer bugs are shape bugs: Q and K must line up for similarity scores."}],a=[{id:"lm-vocab-size",stepLabel:"48.1",group:"Mini vocabulary and logits",title:"Vocabulary size",concept:"A language model predicts one score per vocabulary token.",objective:"Return the number of tokens in the vocabulary.",difficulty:"warmup",starterCode:`function vocabSize(vocab) {
  // TODO: return the number of tokens.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('three-token vocab', vocabSize(['cat', 'dog', 'fish']), 3);
check('one-token vocab', vocabSize(['<eos>']), 1);
check('five-token vocab', vocabSize(['a', 'b', 'c', 'd', 'e']), 5);

return results;`,hints:["The vocabulary is an array.","Array length gives the number of tokens.","return vocab.length;"],solution:`function vocabSize(vocab) {
  return vocab.length;
}`,explanation:"A model with vocabulary size V produces V logits at each prediction position."},{id:"lm-argmax-logit",stepLabel:"48.2",group:"Mini vocabulary and logits",title:"Argmax logit",concept:"Greedy decoding chooses the token with the largest logit.",objective:"Return the index of the largest logit.",difficulty:"core",starterCode:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    // TODO: update bestIndex and bestValue when logits[i] is larger.
  }

  return bestIndex;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('largest at index 0', argmax([5, 1, 2]), 0);
check('largest at index 1', argmax([1, 5, 2]), 1);
check('largest at index 2', argmax([-3, -2, -1]), 2);

return results;`,hints:["Compare logits[i] with bestValue.","If logits[i] is larger, update both bestValue and bestIndex.",`if (logits[i] > bestValue) {
  bestValue = logits[i];
  bestIndex = i;
}`],solution:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}`,explanation:"Argmax decoding is deterministic: it always picks the highest-scoring token."},{id:"lm-decode-argmax-token",stepLabel:"48.3",group:"Mini vocabulary and logits",title:"Decode predicted token",concept:"A predicted token ID becomes text by indexing into the vocabulary.",objective:"Return vocab[argmax(logits)].",difficulty:"core",starterCode:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function greedyToken(vocab, logits) {
  // TODO: return the vocabulary token with the largest logit.
  return '';
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const vocab = ['cat', 'dog', 'fish'];

check('predict cat', greedyToken(vocab, [5, 1, 2]), 'cat');
check('predict dog', greedyToken(vocab, [1, 5, 2]), 'dog');
check('predict fish', greedyToken(vocab, [-3, -2, -1]), 'fish');

return results;`,hints:["First get the best token index.","Then use that index to read from vocab.","return vocab[argmax(logits)];"],solution:`function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function greedyToken(vocab, logits) {
  return vocab[argmax(logits)];
}`,explanation:"The model predicts token IDs. The tokenizer vocabulary maps those IDs back to text pieces."},{id:"lm-logits-to-probabilities",stepLabel:"48.4",group:"Mini vocabulary and logits",title:"Logits to probabilities",concept:"Softmax converts arbitrary logits into probabilities that sum to 1.",objective:"Return stable softmax probabilities.",difficulty:"challenge",starterCode:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  const probabilities = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: push normalized probability for logits[i].
    probabilities.push(0);
  }

  return probabilities;
}`,testCode:`const results = [];

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

check('equal logits', softmax([0, 0]), [0.5, 0.5]);
check('log ratio', softmax([0, Math.log(3)]), [0.25, 0.75]);
check('large equal logits', softmax([1000, 1000]), [0.5, 0.5]);

return results;`,hints:["Use the same shifted exponentials as the denominator.","Probability = exp(logit - maxLogit) / denominator.","probabilities.push(Math.exp(logits[i] - maxLogit) / denominator);"],solution:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  const probabilities = [];

  for (let i = 0; i < logits.length; i++) {
    probabilities.push(Math.exp(logits[i] - maxLogit) / denominator);
  }

  return probabilities;
}`,explanation:"Logits are raw scores. Softmax turns them into a probability distribution over tokens."},{id:"sequence-target-probability",stepLabel:"49.1",group:"Cross-entropy over sequence positions",title:"Target token probability",concept:"At one position, the loss uses the probability assigned to the true next token.",objective:"Return probabilities[targetTokenId].",difficulty:"warmup",starterCode:`function targetProbability(probabilities, targetTokenId) {
  // TODO: return probability of the target token.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('target 0', targetProbability([0.7, 0.2, 0.1], 0), 0.7);
check('target 1', targetProbability([0.7, 0.2, 0.1], 1), 0.2);
check('target 2', targetProbability([0.7, 0.2, 0.1], 2), 0.1);

return results;`,hints:["targetTokenId is an array index.","Read that probability from the probabilities array.","return probabilities[targetTokenId];"],solution:`function targetProbability(probabilities, targetTokenId) {
  return probabilities[targetTokenId];
}`,explanation:"Cross-entropy only cares how much probability the model assigned to the correct token."},{id:"sequence-nll-one-position",stepLabel:"49.2",group:"Cross-entropy over sequence positions",title:"Negative log-likelihood",concept:"Token loss is -log(probability assigned to the true token).",objective:"Return -Math.log(targetProbability).",difficulty:"core",starterCode:`function tokenNLL(targetProbability) {
  // TODO: return negative log likelihood.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p=0.5', tokenNLL(0.5), -Math.log(0.5));
check('p=0.8', tokenNLL(0.8), -Math.log(0.8));
check('p=0.25', tokenNLL(0.25), -Math.log(0.25));

return results;`,hints:["Use Math.log.","The loss is negative log probability.","return -Math.log(targetProbability);"],solution:`function tokenNLL(targetProbability) {
  return -Math.log(targetProbability);
}`,explanation:"Confident correct predictions have low loss; low probability on the true token gives high loss."},{id:"sequence-average-token-loss",stepLabel:"49.3",group:"Cross-entropy over sequence positions",title:"Average token loss",concept:"Language-model loss is usually averaged across predicted positions.",objective:"Return average of token losses.",difficulty:"core",starterCode:`function averageTokenLoss(tokenLosses) {
  let total = 0;

  for (let i = 0; i < tokenLosses.length; i++) {
    total += tokenLosses[i];
  }

  // TODO: return average loss.
  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('average [1,2,3]', averageTokenLoss([1, 2, 3]), 2);
check('average two losses', averageTokenLoss([0.5, 1.5]), 1);
check('zero losses', averageTokenLoss([0, 0, 0]), 0);

return results;`,hints:["Average means total divided by count.","The count is tokenLosses.length.","return total / tokenLosses.length;"],solution:`function averageTokenLoss(tokenLosses) {
  let total = 0;

  for (let i = 0; i < tokenLosses.length; i++) {
    total += tokenLosses[i];
  }

  return total / tokenLosses.length;
}`,explanation:"A sequence loss summarizes many next-token prediction losses into one training number."},{id:"sequence-perplexity",stepLabel:"49.4",group:"Cross-entropy over sequence positions",title:"Perplexity",concept:"Perplexity is exp(average cross-entropy loss).",objective:"Return Math.exp(averageLoss).",difficulty:"core",starterCode:`function perplexity(averageLoss) {
  // TODO: return exp of averageLoss.
  return averageLoss;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('loss 0', perplexity(0), 1);
check('loss log 2', perplexity(Math.log(2)), 2);
check('loss log 10', perplexity(Math.log(10)), 10);

return results;`,hints:["Use Math.exp.","Perplexity = e raised to average loss.","return Math.exp(averageLoss);"],solution:`function perplexity(averageLoss) {
  return Math.exp(averageLoss);
}`,explanation:"Perplexity loosely means how many choices the model is confused among on average."},{id:"lm-select-position-logits",stepLabel:"50.1",group:"Tiny language-model loss",title:"Select position logits",concept:"A language model produces one logit vector per sequence position.",objective:"Return logitsByPosition[position].",difficulty:"warmup",starterCode:`function positionLogits(logitsByPosition, position) {
  // TODO: return logits for this sequence position.
  return [];
}`,testCode:`const results = [];

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

const logits = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

check('position 0', positionLogits(logits, 0), [1, 2, 3]);
check('position 1', positionLogits(logits, 1), [4, 5, 6]);
check('position 2', positionLogits(logits, 2), [7, 8, 9]);

return results;`,hints:["Position is an array index.","Each row is the logits for one position.","return logitsByPosition[position];"],solution:`function positionLogits(logitsByPosition, position) {
  return logitsByPosition[position];
}`,explanation:"For a sequence of length T, the model returns T logit vectors, one for each position."},{id:"lm-one-position-loss",stepLabel:"50.2",group:"Tiny language-model loss",title:"One-position loss",concept:"One LM loss position is cross-entropy between logits and the true next token ID.",objective:"Convert logits to probabilities, then return -log target probability.",difficulty:"challenge",starterCode:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  return logits.map((logit) => Math.exp(logit - maxLogit) / denominator);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);

  // TODO: return negative log probability of targetTokenId.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('target 0 equal logits', onePositionLoss([0, 0], 0), -Math.log(0.5));
check('target 1 log ratio', onePositionLoss([0, Math.log(3)], 1), -Math.log(0.75));
check('target 0 log ratio', onePositionLoss([0, Math.log(3)], 0), -Math.log(0.25));

return results;`,hints:["The target probability is probabilities[targetTokenId].","Loss is -Math.log(target probability).","return -Math.log(probabilities[targetTokenId]);"],solution:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  return logits.map((logit) => Math.exp(logit - maxLogit) / denominator);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}`,explanation:"The model is trained to put high probability on the true next token."},{id:"lm-average-loss",stepLabel:"50.3",group:"Tiny language-model loss",title:"Average language-model loss",concept:"The final LM loss averages next-token losses across positions.",objective:"Accumulate onePositionLoss for each position and divide by count.",difficulty:"challenge",starterCode:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const denom = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / denom);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}

function languageModelLoss(logitsByPosition, targetTokenIds) {
  let total = 0;

  for (let position = 0; position < targetTokenIds.length; position++) {
    // TODO: add loss for this position.
    total += 0;
  }

  return total / targetTokenIds.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two positions equal logits', languageModelLoss([[0, 0], [0, 0]], [0, 1]), -Math.log(0.5));
check('two positions log ratios', languageModelLoss([[0, Math.log(3)], [Math.log(3), 0]], [1, 0]), -Math.log(0.75));

return results;`,hints:["Use onePositionLoss(logitsByPosition[position], targetTokenIds[position]).","Add it to total.","total += onePositionLoss(logitsByPosition[position], targetTokenIds[position]);"],solution:`function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const denom = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / denom);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}

function languageModelLoss(logitsByPosition, targetTokenIds) {
  let total = 0;

  for (let position = 0; position < targetTokenIds.length; position++) {
    total += onePositionLoss(logitsByPosition[position], targetTokenIds[position]);
  }

  return total / targetTokenIds.length;
}`,explanation:"Language modeling is many small classification losses, one for each predicted next token."},{id:"teacher-forcing-previous-token",stepLabel:"51.1",group:"Teacher forcing",title:"True previous token",concept:"Teacher forcing feeds the true previous token during training.",objective:"Return trueTokens[position - 1].",difficulty:"warmup",starterCode:`function previousTrueToken(trueTokens, position) {
  // position is greater than 0.
  // TODO: return the true previous token.
  return null;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('previous at position 1', previousTrueToken(['A', 'B', 'C'], 1), 'A');
check('previous at position 2', previousTrueToken(['A', 'B', 'C'], 2), 'B');
check('previous at position 3', previousTrueToken(['A', 'B', 'C', 'D'], 3), 'C');

return results;`,hints:["Previous position is position - 1.","Index into trueTokens.","return trueTokens[position - 1];"],solution:`function previousTrueToken(trueTokens, position) {
  return trueTokens[position - 1];
}`,explanation:"During training, teacher forcing gives the model the correct previous context instead of its own sampled mistakes."},{id:"teacher-forcing-inputs",stepLabel:"51.2",group:"Teacher forcing",title:"Teacher-forced inputs",concept:"Training inputs are usually shifted right: start token followed by all true tokens except the last.",objective:"Build [startToken, ...tokensWithoutLast].",difficulty:"core",starterCode:`function teacherForcedInputs(tokens, startToken) {
  const inputs = [startToken];

  for (let i = 0; i < tokens.length - 1; i++) {
    // TODO: append the true token at position i.
    inputs.push(null);
  }

  return inputs;
}`,testCode:`const results = [];

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

check('ABC', teacherForcedInputs(['A', 'B', 'C'], '<bos>'), ['<bos>', 'A', 'B']);
check('one token', teacherForcedInputs(['A'], '<bos>'), ['<bos>']);
check('four tokens', teacherForcedInputs(['A', 'B', 'C', 'D'], '<bos>'), ['<bos>', 'A', 'B', 'C']);

return results;`,hints:["The loop already stops before the last token.","Push tokens[i].","inputs.push(tokens[i]);"],solution:`function teacherForcedInputs(tokens, startToken) {
  const inputs = [startToken];

  for (let i = 0; i < tokens.length - 1; i++) {
    inputs.push(tokens[i]);
  }

  return inputs;
}`,explanation:"Teacher forcing trains the model to predict token t using the true tokens before t."},{id:"teacher-forcing-targets",stepLabel:"51.3",group:"Teacher forcing",title:"Teacher-forced targets",concept:"For next-token training, targets are the original token sequence.",objective:"Return a copy of tokens.",difficulty:"warmup",starterCode:`function teacherForcedTargets(tokens) {
  // TODO: return the target tokens.
  return [];
}`,testCode:`const results = [];

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

check('ABC', teacherForcedTargets(['A', 'B', 'C']), ['A', 'B', 'C']);
check('one token', teacherForcedTargets(['A']), ['A']);

return results;`,hints:["Targets are the true sequence.","Return a shallow copy so you do not mutate the input.","return tokens.slice();"],solution:`function teacherForcedTargets(tokens) {
  return tokens.slice();
}`,explanation:"Inputs are shifted right; targets are the true next tokens to predict."},{id:"causal-labels-drop-first",stepLabel:"52.1",group:"Causal label shifting",title:"Drop first token for labels",concept:"In causal LM training, each position predicts the next token.",objective:"Return tokens from index 1 onward.",difficulty:"warmup",starterCode:`function nextTokenLabels(tokens) {
  // TODO: return all tokens except the first.
  return tokens;
}`,testCode:`const results = [];

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

check('ABC labels', nextTokenLabels(['A', 'B', 'C']), ['B', 'C']);
check('AB labels', nextTokenLabels(['A', 'B']), ['B']);
check('one token labels', nextTokenLabels(['A']), []);

return results;`,hints:["The first token has no previous token predicting it in this simple setup.","Use slice starting at index 1.","return tokens.slice(1);"],solution:`function nextTokenLabels(tokens) {
  return tokens.slice(1);
}`,explanation:"For sequence A B C, the model can learn A -> B and B -> C."},{id:"causal-inputs-drop-last",stepLabel:"52.2",group:"Causal label shifting",title:"Drop last token for inputs",concept:"The last token has no next-token target inside the sequence.",objective:"Return all tokens except the last.",difficulty:"warmup",starterCode:`function causalInputs(tokens) {
  // TODO: return all tokens except the last.
  return tokens;
}`,testCode:`const results = [];

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

check('ABC inputs', causalInputs(['A', 'B', 'C']), ['A', 'B']);
check('AB inputs', causalInputs(['A', 'B']), ['A']);
check('one token inputs', causalInputs(['A']), []);

return results;`,hints:["Use slice from the start to length - 1.","The last token is a target, not an input for a next token within this sequence.","return tokens.slice(0, tokens.length - 1);"],solution:`function causalInputs(tokens) {
  return tokens.slice(0, tokens.length - 1);
}`,explanation:"Causal inputs and next-token labels are offset by one position."},{id:"causal-input-label-pairs",stepLabel:"52.3",group:"Causal label shifting",title:"Input-label pairs",concept:"Causal language modeling turns a sequence into pairs: current token -> next token.",objective:"Push [tokens[i], tokens[i + 1]].",difficulty:"core",starterCode:`function causalPairs(tokens) {
  const pairs = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    // TODO: push current token and next token as a pair.
    pairs.push([]);
  }

  return pairs;
}`,testCode:`const results = [];

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

check('ABC pairs', causalPairs(['A', 'B', 'C']), [['A', 'B'], ['B', 'C']]);
check('AB pairs', causalPairs(['A', 'B']), [['A', 'B']]);
check('one token pairs', causalPairs(['A']), []);

return results;`,hints:["Each pair is current token and next token.","Use tokens[i] and tokens[i + 1].","pairs.push([tokens[i], tokens[i + 1]]);"],solution:`function causalPairs(tokens) {
  const pairs = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    pairs.push([tokens[i], tokens[i + 1]]);
  }

  return pairs;
}`,explanation:"Next-token prediction is supervised learning over shifted token pairs."},{id:"token-training-logit-gradient",stepLabel:"53.1",group:"Mini token training step",title:"Logit gradient",concept:"For softmax + cross-entropy, gradient is probabilities minus one-hot target.",objective:"Push probabilities[i] - target.",difficulty:"core",starterCode:`function logitGradient(probabilities, targetId) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetId ? 1 : 0;

    // TODO: push probability minus target.
    gradient.push(0);
  }

  return gradient;
}`,testCode:`const results = [];

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

check('target 0', logitGradient([0.7, 0.3], 0), [-0.3, 0.3]);
check('target 1', logitGradient([0.7, 0.3], 1), [0.7, -0.7]);
check('three classes', logitGradient([0.1, 0.8, 0.1], 1), [0.1, -0.2, 0.1]);

return results;`,hints:["The formula is p - y.","target is 1 for the true class and 0 otherwise.","gradient.push(probabilities[i] - target);"],solution:`function logitGradient(probabilities, targetId) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetId ? 1 : 0;
    gradient.push(probabilities[i] - target);
  }

  return gradient;
}`,explanation:"The true token logit is pushed up, and competing token logits are pushed down."},{id:"token-training-update-logit",stepLabel:"53.2",group:"Mini token training step",title:"Update one logit",concept:"A gradient step subtracts learningRate times gradient from a parameter.",objective:"Return logit - learningRate * gradient.",difficulty:"warmup",starterCode:`function updateLogit(logit, gradient, learningRate) {
  // TODO: return updated logit.
  return logit;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('negative gradient increases logit', updateLogit(1, -0.3, 0.1), 1.03);
check('positive gradient decreases logit', updateLogit(1, 0.7, 0.1), 0.93);
check('zero gradient no change', updateLogit(5, 0, 0.1), 5);

return results;`,hints:["Gradient descent subtracts the gradient step.","Use logit - learningRate * gradient.","return logit - learningRate * gradient;"],solution:`function updateLogit(logit, gradient, learningRate) {
  return logit - learningRate * gradient;
}`,explanation:"When the true class gradient is negative, subtracting it increases that logit."},{id:"token-training-update-all-logits",stepLabel:"53.3",group:"Mini token training step",title:"Update all logits",concept:"One token-prediction training step updates every vocabulary logit.",objective:"Push logits[i] - learningRate * gradients[i].",difficulty:"core",starterCode:`function updateAllLogits(logits, gradients, learningRate) {
  const updated = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: update this logit.
    updated.push(logits[i]);
  }

  return updated;
}`,testCode:`const results = [];

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

check('binary update', updateAllLogits([1, 1], [-0.3, 0.3], 0.1), [1.03, 0.97]);
check('three-class update', updateAllLogits([0, 0, 0], [0.1, -0.2, 0.1], 0.5), [-0.05, 0.1, -0.05]);

return results;`,hints:["Use the same SGD rule for every logit.","Subtract learningRate * gradients[i].","updated.push(logits[i] - learningRate * gradients[i]);"],solution:`function updateAllLogits(logits, gradients, learningRate) {
  const updated = [];

  for (let i = 0; i < logits.length; i++) {
    updated.push(logits[i] - learningRate * gradients[i]);
  }

  return updated;
}`,explanation:"A training step increases the true token score and lowers competing scores."},{id:"sampling-cumulative-pick",stepLabel:"54.1",group:"Sampling from logits",title:"Pick from cumulative probabilities",concept:"Sampling chooses the first cumulative probability that exceeds a random number.",objective:"Return the first index where cumulative probability exceeds r.",difficulty:"core",starterCode:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];

    // TODO: return i when r is less than cumulative.
  }

  return probabilities.length - 1;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('r in first bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.1), 0);
check('r in second bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.25), 1);
check('r in third bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.8), 2);

return results;`,hints:["cumulative is the probability mass up to index i.","If r < cumulative, choose i.","if (r < cumulative) return i;"],solution:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];

    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}`,explanation:"Sampling turns a probability distribution into one selected token ID."},{id:"sampling-token-from-vocab",stepLabel:"54.2",group:"Sampling from logits",title:"Sample token from vocabulary",concept:"After sampling a token ID, decode it through the vocabulary.",objective:"Return vocab[sampledIndex].",difficulty:"warmup",starterCode:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}

function sampleToken(vocab, probabilities, r) {
  const sampledIndex = sampleFromProbabilities(probabilities, r);

  // TODO: return the token at sampledIndex.
  return '';
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const vocab = ['cat', 'dog', 'fish'];

check('sample cat', sampleToken(vocab, [0.2, 0.3, 0.5], 0.1), 'cat');
check('sample dog', sampleToken(vocab, [0.2, 0.3, 0.5], 0.25), 'dog');
check('sample fish', sampleToken(vocab, [0.2, 0.3, 0.5], 0.8), 'fish');

return results;`,hints:["sampledIndex is already computed.","Use it to index into vocab.","return vocab[sampledIndex];"],solution:`function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}

function sampleToken(vocab, probabilities, r) {
  const sampledIndex = sampleFromProbabilities(probabilities, r);
  return vocab[sampledIndex];
}`,explanation:"Sampling can produce different valid continuations from the same model distribution."},{id:"sampling-greedy-or-sample",stepLabel:"54.3",group:"Sampling from logits",title:"Greedy or sample",concept:"Generation can choose the highest-probability token or sample from the distribution.",objective:'Use greedy when mode is "greedy", otherwise sample.',difficulty:"core",starterCode:`function argmax(values) {
  let bestIndex = 0;
  let bestValue = values[0];

  for (let i = 1; i < values.length; i++) {
    if (values[i] > bestValue) {
      bestValue = values[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }
  return probabilities.length - 1;
}

function chooseTokenId(probabilities, mode, r) {
  // TODO: if mode is "greedy", return argmax; otherwise sample.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('greedy chooses largest', chooseTokenId([0.2, 0.3, 0.5], 'greedy', 0.1), 2);
check('sample first bucket', chooseTokenId([0.2, 0.3, 0.5], 'sample', 0.1), 0);
check('sample second bucket', chooseTokenId([0.2, 0.3, 0.5], 'sample', 0.25), 1);

return results;`,hints:["Greedy ignores r and picks argmax.","Sampling uses sampleFromProbabilities.",'return mode === "greedy" ? argmax(probabilities) : sampleFromProbabilities(probabilities, r);'],solution:`function argmax(values) {
  let bestIndex = 0;
  let bestValue = values[0];

  for (let i = 1; i < values.length; i++) {
    if (values[i] > bestValue) {
      bestValue = values[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }
  return probabilities.length - 1;
}

function chooseTokenId(probabilities, mode, r) {
  return mode === "greedy" ? argmax(probabilities) : sampleFromProbabilities(probabilities, r);
}`,explanation:"Greedy decoding is stable but can be dull; sampling is more diverse but less predictable."},{id:"temperature-scale-logits",stepLabel:"55.1",group:"Temperature and top-k / top-p",title:"Temperature-scaled logits",concept:"Temperature divides logits before softmax. Lower temperature sharpens; higher temperature flattens.",objective:"Push logits[i] / temperature.",difficulty:"core",starterCode:`function applyTemperature(logits, temperature) {
  const scaled = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: divide logit by temperature.
    scaled.push(logits[i]);
  }

  return scaled;
}`,testCode:`const results = [];

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

check('temperature 1', applyTemperature([2, 4], 1), [2, 4]);
check('temperature 2', applyTemperature([2, 4], 2), [1, 2]);
check('temperature 0.5', applyTemperature([2, 4], 0.5), [4, 8]);

return results;`,hints:["Temperature rescales every logit.","Divide by temperature.","scaled.push(logits[i] / temperature);"],solution:`function applyTemperature(logits, temperature) {
  const scaled = [];

  for (let i = 0; i < logits.length; i++) {
    scaled.push(logits[i] / temperature);
  }

  return scaled;
}`,explanation:"Temperature changes how sharp the final softmax distribution becomes."},{id:"top-k-indices",stepLabel:"55.2",group:"Temperature and top-k / top-p",title:"Top-k indices",concept:"Top-k sampling keeps only the k highest-scoring tokens.",objective:"Return indices of the top k logits.",difficulty:"challenge",starterCode:`function topKIndices(logits, k) {
  const indexed = logits.map((value, index) => ({ value, index }));

  indexed.sort((a, b) => b.value - a.value);

  // TODO: return the first k indices.
  return [];
}`,testCode:`const results = [];

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

check('top 1', topKIndices([1, 5, 3], 1), [1]);
check('top 2', topKIndices([1, 5, 3], 2), [1, 2]);
check('top 3', topKIndices([-1, -5, 0], 3), [2, 0, 1]);

return results;`,hints:["indexed is already sorted from largest to smallest.","Take the first k entries and return their index fields.","return indexed.slice(0, k).map((item) => item.index);"],solution:`function topKIndices(logits, k) {
  const indexed = logits.map((value, index) => ({ value, index }));

  indexed.sort((a, b) => b.value - a.value);

  return indexed.slice(0, k).map((item) => item.index);
}`,explanation:"Top-k prevents low-ranked tokens from being sampled at all."},{id:"top-k-mask-logits",stepLabel:"55.3",group:"Temperature and top-k / top-p",title:"Mask non-top-k logits",concept:"Tokens outside top-k are masked to -Infinity before softmax.",objective:"Keep logits in allowed indices, otherwise -Infinity.",difficulty:"challenge",starterCode:`function maskToTopK(logits, allowedIndices) {
  const masked = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: keep logits[i] only if i is in allowedIndices.
    masked.push(logits[i]);
  }

  return masked;
}`,testCode:`const results = [];

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

check('keep indices 1 and 2', maskToTopK([1, 5, 3], [1, 2]), [-Infinity, 5, 3]);
check('keep index 0', maskToTopK([1, 5, 3], [0]), [1, -Infinity, -Infinity]);

return results;`,hints:["Use allowedIndices.includes(i).","Keep the logit when allowed; otherwise use -Infinity.","masked.push(allowedIndices.includes(i) ? logits[i] : -Infinity);"],solution:`function maskToTopK(logits, allowedIndices) {
  const masked = [];

  for (let i = 0; i < logits.length; i++) {
    masked.push(allowedIndices.includes(i) ? logits[i] : -Infinity);
  }

  return masked;
}`,explanation:"Masking before softmax makes excluded tokens receive zero probability."},{id:"top-p-cutoff",stepLabel:"55.4",group:"Temperature and top-k / top-p",title:"Top-p cutoff",concept:"Top-p keeps the smallest set of high-probability tokens whose cumulative mass reaches p.",objective:"Return how many sorted probabilities are needed to reach p.",difficulty:"challenge",starterCode:`function topPCount(sortedProbabilities, p) {
  let cumulative = 0;

  for (let i = 0; i < sortedProbabilities.length; i++) {
    cumulative += sortedProbabilities[i];

    // TODO: return i + 1 once cumulative reaches p.
  }

  return sortedProbabilities.length;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('one token enough', topPCount([0.8, 0.1, 0.1], 0.7), 1);
check('two tokens needed', topPCount([0.5, 0.3, 0.2], 0.8), 2);
check('all tokens needed', topPCount([0.4, 0.3, 0.2, 0.1], 0.95), 4);

return results;`,hints:["sortedProbabilities are already largest to smallest.","When cumulative >= p, return the number of tokens included.","if (cumulative >= p) return i + 1;"],solution:`function topPCount(sortedProbabilities, p) {
  let cumulative = 0;

  for (let i = 0; i < sortedProbabilities.length; i++) {
    cumulative += sortedProbabilities[i];

    if (cumulative >= p) return i + 1;
  }

  return sortedProbabilities.length;
}`,explanation:"Top-p adapts the candidate set size to the shape of the probability distribution."}],r=[{id:"rag-count-tokens",stepLabel:"56.1",group:"Token counts and chunking",title:"Count tokens",concept:"A simple token budget starts by counting how many tokens a piece of text uses.",objective:"Return the number of whitespace-separated tokens.",difficulty:"warmup",starterCode:`function countTokens(text) {
  const trimmed = text.trim();

  if (trimmed === '') return 0;

  // TODO: split on whitespace and return the number of pieces.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('three words', countTokens('the cat sat'), 3);
check('extra spaces', countTokens('  the   cat   sat  '), 3);
check('empty string', countTokens(''), 0);
check('one token', countTokens('hello'), 1);

return results;`,hints:["Use a regular expression that matches one or more whitespace characters.","trimmed.split(/\\\\s+/) gives an array of simple tokens.","return trimmed.split(/\\\\s+/).length;"],solution:`function countTokens(text) {
  const trimmed = text.trim();

  if (trimmed === '') return 0;

  return trimmed.split(/\\s+/).length;
}`,explanation:"Real tokenizers are more complex than whitespace splitting, but token-budget reasoning starts with counting how much context each text piece consumes."},{id:"rag-chunk-fits-budget",stepLabel:"56.2",group:"Token counts and chunking",title:"Does this chunk fit?",concept:"A chunk can be packed only if its token count is within the remaining context budget.",objective:"Return whether chunkTokens is less than or equal to remainingBudget.",difficulty:"warmup",starterCode:`function chunkFits(chunkTokens, remainingBudget) {
  // TODO: return true when the chunk fits in the remaining budget.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('fits exactly', chunkFits(100, 100), true);
check('fits under budget', chunkFits(80, 100), true);
check('too large', chunkFits(120, 100), false);

return results;`,hints:["A chunk fits when it is not larger than the remaining budget.","Use <=.","return chunkTokens <= remainingBudget;"],solution:`function chunkFits(chunkTokens, remainingBudget) {
  return chunkTokens <= remainingBudget;
}`,explanation:"RAG systems often fail not because evidence is unavailable, but because the right chunks do not fit into the final prompt."},{id:"rag-fixed-size-chunks",stepLabel:"56.3",group:"Token counts and chunking",title:"Fixed-size chunks",concept:"Chunking splits a token list into smaller windows.",objective:"Push slices of size chunkSize.",difficulty:"core",starterCode:`function fixedChunks(tokens, chunkSize) {
  const chunks = [];

  for (let start = 0; start < tokens.length; start += chunkSize) {
    // TODO: push tokens from start to start + chunkSize.
    chunks.push([]);
  }

  return chunks;
}`,testCode:`const results = [];

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

check('chunks of 2', fixedChunks(['a', 'b', 'c', 'd', 'e'], 2), [['a', 'b'], ['c', 'd'], ['e']]);
check('chunks of 3', fixedChunks(['a', 'b', 'c', 'd'], 3), [['a', 'b', 'c'], ['d']]);
check('one chunk', fixedChunks(['a', 'b'], 5), [['a', 'b']]);

return results;`,hints:["Array.slice(start, end) extracts a window.","The end should be start + chunkSize.","chunks.push(tokens.slice(start, start + chunkSize));"],solution:`function fixedChunks(tokens, chunkSize) {
  const chunks = [];

  for (let start = 0; start < tokens.length; start += chunkSize) {
    chunks.push(tokens.slice(start, start + chunkSize));
  }

  return chunks;
}`,explanation:"Fixed chunks are simple, but they can split important evidence across boundaries."},{id:"rag-overlapping-chunks",stepLabel:"56.4",group:"Token counts and chunking",title:"Overlapping chunks",concept:"Overlap preserves context near chunk boundaries.",objective:"Advance by chunkSize - overlap instead of chunkSize.",difficulty:"challenge",starterCode:`function overlappingChunks(tokens, chunkSize, overlap) {
  const chunks = [];
  const step = chunkSize - overlap;

  for (let start = 0; start < tokens.length; start += step) {
    // TODO: push a chunk from start to start + chunkSize.
    chunks.push([]);
  }

  return chunks;
}`,testCode:`const results = [];

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

check('chunk size 3 overlap 1', overlappingChunks(['a', 'b', 'c', 'd', 'e'], 3, 1), [['a', 'b', 'c'], ['c', 'd', 'e'], ['e']]);
check('chunk size 4 overlap 2', overlappingChunks(['a', 'b', 'c', 'd', 'e'], 4, 2), [['a', 'b', 'c', 'd'], ['c', 'd', 'e'], ['e']]);

return results;`,hints:["The step is already computed.","Each chunk is still tokens.slice(start, start + chunkSize).","chunks.push(tokens.slice(start, start + chunkSize));"],solution:`function overlappingChunks(tokens, chunkSize, overlap) {
  const chunks = [];
  const step = chunkSize - overlap;

  for (let start = 0; start < tokens.length; start += step) {
    chunks.push(tokens.slice(start, start + chunkSize));
  }

  return chunks;
}`,explanation:"Overlap reduces boundary loss, but it also increases total retrieved token cost."},{id:"bow-build-vocabulary",stepLabel:"57.1",group:"Bag-of-words vectors",title:"Build vocabulary",concept:"A bag-of-words vector needs a fixed vocabulary of known terms.",objective:"Return the unique words in first-seen order.",difficulty:"core",starterCode:`function buildVocabulary(tokens) {
  const vocab = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // TODO: push token only if it is not already in vocab.
  }

  return vocab;
}`,testCode:`const results = [];

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

check('unique words', buildVocabulary(['cat', 'dog', 'cat', 'fish']), ['cat', 'dog', 'fish']);
check('one word repeated', buildVocabulary(['a', 'a', 'a']), ['a']);
check('already unique', buildVocabulary(['a', 'b', 'c']), ['a', 'b', 'c']);

return results;`,hints:["Use vocab.includes(token) to check if it is already present.","Only push when it is not included.","if (!vocab.includes(token)) vocab.push(token);"],solution:`function buildVocabulary(tokens) {
  const vocab = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!vocab.includes(token)) vocab.push(token);
  }

  return vocab;
}`,explanation:"Vocabulary fixes the coordinate system for text vectors."},{id:"bow-count-word",stepLabel:"57.2",group:"Bag-of-words vectors",title:"Count one word",concept:"A bag-of-words entry counts how often a vocabulary word appears.",objective:"Count occurrences of target in tokens.",difficulty:"warmup",starterCode:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    // TODO: increment count when tokens[i] equals target.
  }

  return count;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('cat count', countWord(['cat', 'dog', 'cat'], 'cat'), 2);
check('dog count', countWord(['cat', 'dog', 'cat'], 'dog'), 1);
check('missing count', countWord(['cat', 'dog'], 'fish'), 0);

return results;`,hints:["Use an if statement.","If tokens[i] === target, add one.","if (tokens[i] === target) count += 1;"],solution:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}`,explanation:"Bag-of-words ignores order and keeps only word counts."},{id:"bow-vectorize-document",stepLabel:"57.3",group:"Bag-of-words vectors",title:"Vectorize document",concept:"A bag-of-words vector has one count per vocabulary word.",objective:"Push countWord(tokens, vocab[i]) for each vocabulary word.",difficulty:"core",starterCode:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}

function bowVector(tokens, vocab) {
  const vector = [];

  for (let i = 0; i < vocab.length; i++) {
    // TODO: push the count of vocab[i] in tokens.
    vector.push(0);
  }

  return vector;
}`,testCode:`const results = [];

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

const vocab = ['cat', 'dog', 'fish'];

check('cat dog cat', bowVector(['cat', 'dog', 'cat'], vocab), [2, 1, 0]);
check('fish fish', bowVector(['fish', 'fish'], vocab), [0, 0, 2]);
check('empty document', bowVector([], vocab), [0, 0, 0]);

return results;`,hints:["Each vector coordinate corresponds to one vocabulary word.","Use countWord(tokens, vocab[i]).","vector.push(countWord(tokens, vocab[i]));"],solution:`function countWord(tokens, target) {
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === target) count += 1;
  }

  return count;
}

function bowVector(tokens, vocab) {
  const vector = [];

  for (let i = 0; i < vocab.length; i++) {
    vector.push(countWord(tokens, vocab[i]));
  }

  return vector;
}`,explanation:"Text becomes a vector by counting vocabulary terms."},{id:"bow-normalize-counts",stepLabel:"57.4",group:"Bag-of-words vectors",title:"Normalize counts",concept:"Normalizing counts can reduce the effect of document length.",objective:"Divide each count by total count.",difficulty:"core",starterCode:`function normalizeCounts(counts) {
  const total = counts.reduce((sum, value) => sum + value, 0);

  if (total === 0) return counts.map(() => 0);

  const normalized = [];

  for (let i = 0; i < counts.length; i++) {
    // TODO: divide counts[i] by total.
    normalized.push(counts[i]);
  }

  return normalized;
}`,testCode:`const results = [];

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

check('normalize [2,1,0]', normalizeCounts([2, 1, 0]), [2 / 3, 1 / 3, 0]);
check('normalize [0,0,2]', normalizeCounts([0, 0, 2]), [0, 0, 1]);
check('normalize empty counts', normalizeCounts([0, 0, 0]), [0, 0, 0]);

return results;`,hints:["total is already computed.","Each normalized value is counts[i] / total.","normalized.push(counts[i] / total);"],solution:`function normalizeCounts(counts) {
  const total = counts.reduce((sum, value) => sum + value, 0);

  if (total === 0) return counts.map(() => 0);

  const normalized = [];

  for (let i = 0; i < counts.length; i++) {
    normalized.push(counts[i] / total);
  }

  return normalized;
}`,explanation:"Normalized vectors compare word proportions rather than raw document length."},{id:"retrieval-dot-score",stepLabel:"58.1",group:"Cosine retrieval",title:"Dot retrieval score",concept:"A simple retrieval score compares a query vector with a document vector.",objective:"Return dot(query, document).",difficulty:"warmup",starterCode:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function retrievalDotScore(query, document) {
  // TODO: return query dotted with document.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 1', retrievalDotScore([1, 2], [3, 4]), 11);
check('orthogonal', retrievalDotScore([1, 0], [0, 1]), 0);
check('negative value', retrievalDotScore([-1, 2], [3, 5]), 7);

return results;`,hints:["Use the dot helper.","Retrieval score is a similarity score.","return dot(query, document);"],solution:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function retrievalDotScore(query, document) {
  return dot(query, document);
}`,explanation:"Embedding retrieval ranks documents by similarity to the query vector."},{id:"retrieval-cosine-score",stepLabel:"58.2",group:"Cosine retrieval",title:"Cosine retrieval score",concept:"Cosine similarity compares direction instead of raw vector length.",objective:"Return dot(query, document) divided by both norms.",difficulty:"core",starterCode:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  // TODO: return cosine similarity.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('same direction', cosineScore([1, 0], [5, 0]), 1);
check('perpendicular', cosineScore([1, 0], [0, 1]), 0);
check('opposite', cosineScore([1, 0], [-2, 0]), -1);
check('classic', cosineScore([1, 2], [3, 4]), 11 / (Math.sqrt(5) * 5));

return results;`,hints:["Cosine = dot / (norm(query) * norm(document)).","Use the dot and norm helpers.","return dot(query, document) / (norm(query) * norm(document));"],solution:`function dot(a, b) {
  let total = 0;

  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }

  return total;
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}`,explanation:"Cosine retrieval is useful when vector direction matters more than vector magnitude."},{id:"retrieval-score-all-documents",stepLabel:"58.3",group:"Cosine retrieval",title:"Score all documents",concept:"A retriever scores every candidate document before ranking.",objective:"Push cosineScore(query, documents[i]) for each document.",difficulty:"core",starterCode:`function dot(a, b) {
  return a.reduce((total, value, i) => total + value * b[i], 0);
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}

function scoreDocuments(query, documents) {
  const scores = [];

  for (let i = 0; i < documents.length; i++) {
    // TODO: push cosine score for this document.
    scores.push(0);
  }

  return scores;
}`,testCode:`const results = [];

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

check('score three documents', scoreDocuments([1, 0], [[1, 0], [0, 1], [-1, 0]]), [1, 0, -1]);

return results;`,hints:["Loop through the documents.","Use cosineScore(query, documents[i]).","scores.push(cosineScore(query, documents[i]));"],solution:`function dot(a, b) {
  return a.reduce((total, value, i) => total + value * b[i], 0);
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function cosineScore(query, document) {
  return dot(query, document) / (norm(query) * norm(document));
}

function scoreDocuments(query, documents) {
  const scores = [];

  for (let i = 0; i < documents.length; i++) {
    scores.push(cosineScore(query, documents[i]));
  }

  return scores;
}`,explanation:"Retrieval turns a query into a ranked list by scoring every candidate document."},{id:"retrieval-rank-documents",stepLabel:"58.4",group:"Cosine retrieval",title:"Rank documents",concept:"Retrieval returns document IDs sorted by descending score.",objective:"Return document IDs sorted from highest score to lowest.",difficulty:"challenge",starterCode:`function rankDocuments(scores) {
  const indexed = scores.map((score, index) => ({ score, index }));

  indexed.sort((a, b) => b.score - a.score);

  // TODO: return the sorted document indices.
  return [];
}`,testCode:`const results = [];

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

check('simple ranking', rankDocuments([0.2, 0.9, 0.4]), [1, 2, 0]);
check('negative scores', rankDocuments([-1, 0, 1]), [2, 1, 0]);
check('already sorted', rankDocuments([3, 2, 1]), [0, 1, 2]);

return results;`,hints:["The array is already sorted by score.","Map each item to item.index.","return indexed.map((item) => item.index);"],solution:`function rankDocuments(scores) {
  const indexed = scores.map((score, index) => ({ score, index }));

  indexed.sort((a, b) => b.score - a.score);

  return indexed.map((item) => item.index);
}`,explanation:"The ranker converts similarity scores into retrieval order."},{id:"retrieval-hit-at-k",stepLabel:"59.1",group:"Retrieval metrics",title:"Hit@k",concept:"Hit@k checks whether at least one relevant document appears in the top k.",objective:"Return true if any of the top-k retrieved IDs are relevant.",difficulty:"core",starterCode:`function hitAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);

  for (let i = 0; i < topK.length; i++) {
    // TODO: return true if topK[i] is relevant.
  }

  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('hit at 1', hitAtK(['a', 'b', 'c'], ['a'], 1), true);
check('miss at 1 hit at 2', hitAtK(['a', 'b', 'c'], ['b'], 1), false);
check('hit at 2', hitAtK(['a', 'b', 'c'], ['b'], 2), true);
check('no hit', hitAtK(['a', 'b'], ['z'], 2), false);

return results;`,hints:["Use relevantIds.includes(topK[i]).","If you find a relevant item, return true immediately.","if (relevantIds.includes(topK[i])) return true;"],solution:`function hitAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);

  for (let i = 0; i < topK.length; i++) {
    if (relevantIds.includes(topK[i])) return true;
  }

  return false;
}`,explanation:"Hit@k is simple: did retrieval put at least one useful document in the top k?"},{id:"retrieval-recall-at-k",stepLabel:"59.2",group:"Retrieval metrics",title:"Recall@k",concept:"Recall@k measures how many relevant documents were retrieved in the top k.",objective:"Count relevant docs in top-k and divide by total relevant docs.",difficulty:"core",starterCode:`function recallAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);
  let found = 0;

  for (let i = 0; i < topK.length; i++) {
    // TODO: increment found if topK[i] is relevant.
  }

  return found / relevantIds.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one of two relevant', recallAtK(['a', 'b', 'c'], ['a', 'z'], 2), 0.5);
check('two of two relevant', recallAtK(['a', 'b', 'c'], ['a', 'b'], 2), 1);
check('zero of two relevant', recallAtK(['a', 'b', 'c'], ['x', 'y'], 3), 0);
check('top k matters', recallAtK(['a', 'b', 'c'], ['c'], 2), 0);

return results;`,hints:["Use relevantIds.includes(topK[i]).","Increment found for each relevant retrieved doc.","if (relevantIds.includes(topK[i])) found += 1;"],solution:`function recallAtK(retrievedIds, relevantIds, k) {
  const topK = retrievedIds.slice(0, k);
  let found = 0;

  for (let i = 0; i < topK.length; i++) {
    if (relevantIds.includes(topK[i])) found += 1;
  }

  return found / relevantIds.length;
}`,explanation:"Recall@k matters because a generator cannot use relevant evidence that retrieval failed to include."},{id:"retrieval-mrr",stepLabel:"59.3",group:"Retrieval metrics",title:"Mean reciprocal rank for one query",concept:"MRR rewards placing the first relevant result early.",objective:"Return 1 / rank of the first relevant result.",difficulty:"challenge",starterCode:`function reciprocalRank(retrievedIds, relevantIds) {
  for (let i = 0; i < retrievedIds.length; i++) {
    // TODO: if retrievedIds[i] is relevant, return 1 / (i + 1).
  }

  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('first result relevant', reciprocalRank(['a', 'b', 'c'], ['a']), 1);
check('second result relevant', reciprocalRank(['a', 'b', 'c'], ['b']), 0.5);
check('third result relevant', reciprocalRank(['a', 'b', 'c'], ['c']), 1 / 3);
check('no relevant result', reciprocalRank(['a', 'b'], ['z']), 0);

return results;`,hints:["Rank is i + 1 because arrays are zero-indexed.","Use relevantIds.includes(retrievedIds[i]).","if (relevantIds.includes(retrievedIds[i])) return 1 / (i + 1);"],solution:`function reciprocalRank(retrievedIds, relevantIds) {
  for (let i = 0; i < retrievedIds.length; i++) {
    if (relevantIds.includes(retrievedIds[i])) return 1 / (i + 1);
  }

  return 0;
}`,explanation:"MRR focuses on how soon the first useful result appears."},{id:"retrieval-dcg-at-k",stepLabel:"59.4",group:"Retrieval metrics",title:"DCG@k",concept:"DCG gives more credit to relevant documents that appear earlier in the ranking.",objective:"Add relevance / log2(rank + 1) for each top-k result.",difficulty:"challenge",starterCode:`function dcgAtK(relevances, k) {
  let total = 0;

  for (let i = 0; i < Math.min(k, relevances.length); i++) {
    const rank = i + 1;

    // TODO: add discounted relevance.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('single relevant first', dcgAtK([1, 0, 0], 3), 1);
check('single relevant second', dcgAtK([0, 1, 0], 3), 1 / Math.log2(3));
check('graded relevance', dcgAtK([3, 2], 2), 3 / Math.log2(2) + 2 / Math.log2(3));

return results;`,hints:["Rank starts at 1, not 0.","Discount denominator is Math.log2(rank + 1).","total += relevances[i] / Math.log2(rank + 1);"],solution:`function dcgAtK(relevances, k) {
  let total = 0;

  for (let i = 0; i < Math.min(k, relevances.length); i++) {
    const rank = i + 1;
    total += relevances[i] / Math.log2(rank + 1);
  }

  return total;
}`,explanation:"DCG rewards both relevance and good ordering."},{id:"rerank-by-score",stepLabel:"60.1",group:"Reranking and grounding checks",title:"Rerank by score",concept:"A reranker reorders retrieved chunks using a more expensive relevance score.",objective:"Return chunk IDs sorted by descending reranker score.",difficulty:"core",starterCode:`function rerank(chunkScores) {
  const indexed = chunkScores.map((item) => ({
    id: item.id,
    score: item.score,
  }));

  indexed.sort((a, b) => b.score - a.score);

  // TODO: return sorted chunk IDs.
  return [];
}`,testCode:`const results = [];

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

check('rerank chunks', rerank([{ id: 'a', score: 0.2 }, { id: 'b', score: 0.9 }, { id: 'c', score: 0.4 }]), ['b', 'c', 'a']);

return results;`,hints:["The array is already sorted by score.","Map each item to item.id.","return indexed.map((item) => item.id);"],solution:`function rerank(chunkScores) {
  const indexed = chunkScores.map((item) => ({
    id: item.id,
    score: item.score,
  }));

  indexed.sort((a, b) => b.score - a.score);

  return indexed.map((item) => item.id);
}`,explanation:"Retrieval often uses a fast first pass, then reranks a smaller candidate set more carefully."},{id:"grounding-answer-phrase-check",stepLabel:"60.2",group:"Reranking and grounding checks",title:"Answer phrase support",concept:"A simple grounding check asks whether the cited chunk contains the answer phrase.",objective:"Return whether chunkText includes answerPhrase.",difficulty:"warmup",starterCode:`function chunkContainsAnswer(chunkText, answerPhrase) {
  // TODO: return whether answerPhrase appears in chunkText.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('contains phrase', chunkContainsAnswer('The cancellation fee is waived after 12 months.', '12 months'), true);
check('missing phrase', chunkContainsAnswer('The cancellation fee is waived after 24 months.', '12 months'), false);
check('exact phrase', chunkContainsAnswer('refund policy', 'refund'), true);

return results;`,hints:["Use string includes.","chunkText.includes(answerPhrase) checks for substring support.","return chunkText.includes(answerPhrase);"],solution:`function chunkContainsAnswer(chunkText, answerPhrase) {
  return chunkText.includes(answerPhrase);
}`,explanation:"This is a toy grounding check. Real grounding needs entailment, not just substring matching."},{id:"grounding-detect-unsupported-citation",stepLabel:"60.3",group:"Reranking and grounding checks",title:"Unsupported citation",concept:"A citation is suspicious when the cited chunk does not contain the required answer evidence.",objective:"Return true when the citation is unsupported.",difficulty:"core",starterCode:`function isUnsupportedCitation(chunkText, answerPhrase) {
  const supports = chunkText.includes(answerPhrase);

  // TODO: return true when supports is false.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('supported citation', isUnsupportedCitation('Fee waived after 12 months.', '12 months'), false);
check('unsupported citation', isUnsupportedCitation('Fee waived after 24 months.', '12 months'), true);
check('missing answer entirely', isUnsupportedCitation('No fee details here.', '12 months'), true);

return results;`,hints:["Unsupported means not supported.","supports is already computed.","return !supports;"],solution:`function isUnsupportedCitation(chunkText, answerPhrase) {
  const supports = chunkText.includes(answerPhrase);
  return !supports;
}`,explanation:"Unsupported citations are dangerous because they make hallucinations look grounded."},{id:"grounding-conflict-check",stepLabel:"60.4",group:"Reranking and grounding checks",title:"Conflicting evidence",concept:"RAG systems should detect when retrieved chunks disagree.",objective:"Return true when two chunks contain different claimed values.",difficulty:"challenge",starterCode:`function hasConflict(valueA, valueB) {
  // TODO: return true when values disagree.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('same value no conflict', hasConflict('12 months', '12 months'), false);
check('different values conflict', hasConflict('12 months', '24 months'), true);
check('same number no conflict', hasConflict(5, 5), false);
check('different number conflict', hasConflict(5, 7), true);

return results;`,hints:["Conflict means the values are not equal.","Use !==.","return valueA !== valueB;"],solution:`function hasConflict(valueA, valueB) {
  return valueA !== valueB;
}`,explanation:"A good RAG system should not silently choose one source when retrieved evidence conflicts."},{id:"prompt-packing-reserve-answer-budget",stepLabel:"61.1",group:"Prompt packing / context budget",title:"Reserve answer budget",concept:"A prompt packer should leave room for the model response.",objective:"Return totalContext - answerBudget.",difficulty:"warmup",starterCode:`function inputBudget(totalContext, answerBudget) {
  // TODO: return how many tokens are available for input.
  return totalContext;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('reserve 1000 from 8000', inputBudget(8000, 1000), 7000);
check('reserve 500 from 4096', inputBudget(4096, 500), 3596);
check('reserve zero', inputBudget(1000, 0), 1000);

return results;`,hints:["Input and output share the context window.","Subtract answerBudget from totalContext.","return totalContext - answerBudget;"],solution:`function inputBudget(totalContext, answerBudget) {
  return totalContext - answerBudget;
}`,explanation:"If you fill the whole context with input, there may be no room left for the answer."},{id:"prompt-packing-greedy-chunks",stepLabel:"61.2",group:"Prompt packing / context budget",title:"Greedy chunk packing",concept:"A simple prompt packer adds chunks until the budget is exhausted.",objective:"Add a chunk only if it fits.",difficulty:"core",starterCode:`function packChunksGreedy(chunks, budget) {
  const packed = [];
  let used = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // TODO: if used + chunk.tokens <= budget, pack the chunk and update used.
  }

  return packed;
}`,testCode:`const results = [];

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

const chunks = [
  { id: 'a', tokens: 100 },
  { id: 'b', tokens: 200 },
  { id: 'c', tokens: 300 },
];

check('budget 250', packChunksGreedy(chunks, 250), ['a']);
check('budget 500', packChunksGreedy(chunks, 500), ['a', 'b']);
check('budget 600', packChunksGreedy(chunks, 600), ['a', 'b', 'c']);

return results;`,hints:["Check whether used + chunk.tokens is within budget.","If it fits, push chunk.id and add chunk.tokens to used.",`if (used + chunk.tokens <= budget) {
  packed.push(chunk.id);
  used += chunk.tokens;
}`],solution:`function packChunksGreedy(chunks, budget) {
  const packed = [];
  let used = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    if (used + chunk.tokens <= budget) {
      packed.push(chunk.id);
      used += chunk.tokens;
    }
  }

  return packed;
}`,explanation:"Greedy packing is simple, but it may skip a smaller useful chunk after a large chunk consumes the budget."},{id:"prompt-packing-sort-by-relevance",stepLabel:"61.3",group:"Prompt packing / context budget",title:"Sort by relevance",concept:"Prompt packing usually prioritizes high-relevance chunks before filling the budget.",objective:"Sort chunks by descending relevance.",difficulty:"core",starterCode:`function sortByRelevance(chunks) {
  const sorted = chunks.slice();

  // TODO: sort highest relevance first.
  return sorted;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a.map((x) => x.id)) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual.map((x) => x.id)),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('sort chunks', sortByRelevance([{ id: 'a', relevance: 0.2 }, { id: 'b', relevance: 0.9 }, { id: 'c', relevance: 0.4 }]), ['b', 'c', 'a']);

return results;`,hints:["Use Array.sort.","Descending means b.relevance - a.relevance.","sorted.sort((a, b) => b.relevance - a.relevance);"],solution:`function sortByRelevance(chunks) {
  const sorted = chunks.slice();

  sorted.sort((a, b) => b.relevance - a.relevance);

  return sorted;
}`,explanation:"RAG systems often rerank or sort chunks before packing them into the final prompt."},{id:"prompt-packing-relevance-budget",stepLabel:"61.4",group:"Prompt packing / context budget",title:"Pack relevant chunks within budget",concept:"A practical packer sorts by relevance, then greedily adds chunks that fit.",objective:"Sort by relevance and pack fitting chunks.",difficulty:"challenge",starterCode:`function packRelevantChunks(chunks, budget) {
  const sorted = chunks.slice();
  sorted.sort((a, b) => b.relevance - a.relevance);

  const packed = [];
  let used = 0;

  for (let i = 0; i < sorted.length; i++) {
    const chunk = sorted[i];

    // TODO: pack this chunk if it fits.
  }

  return packed;
}`,testCode:`const results = [];

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

const chunks = [
  { id: 'a', tokens: 100, relevance: 0.2 },
  { id: 'b', tokens: 300, relevance: 0.9 },
  { id: 'c', tokens: 200, relevance: 0.8 },
  { id: 'd', tokens: 100, relevance: 0.7 },
];

check('budget 300', packRelevantChunks(chunks, 300), ['b']);
check('budget 400', packRelevantChunks(chunks, 400), ['b', 'd']);
check('budget 500', packRelevantChunks(chunks, 500), ['b', 'c']);

return results;`,hints:["The chunks are already sorted by relevance.","Use the same budget check as greedy packing.","If it fits, push chunk.id and update used.",`if (used + chunk.tokens <= budget) {
  packed.push(chunk.id);
  used += chunk.tokens;
}`],solution:`function packRelevantChunks(chunks, budget) {
  const sorted = chunks.slice();
  sorted.sort((a, b) => b.relevance - a.relevance);

  const packed = [];
  let used = 0;

  for (let i = 0; i < sorted.length; i++) {
    const chunk = sorted[i];

    if (used + chunk.tokens <= budget) {
      packed.push(chunk.id);
      used += chunk.tokens;
    }
  }

  return packed;
}`,explanation:"Prompt packing balances relevance against token budget. The best chunk is not useful if it crowds out required evidence."}],i=[{id:"eval-true-positive",stepLabel:"62.1",group:"Confusion matrix",title:"True positive",concept:"A true positive happens when the model predicts positive and the true label is positive.",objective:"Return true only when prediction and label are both 1.",difficulty:"warmup",starterCode:`function isTruePositive(prediction, label) {
  // TODO: return true only when prediction is 1 and label is 1.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted positive, actually positive', isTruePositive(1, 1), true);
check('predicted positive, actually negative', isTruePositive(1, 0), false);
check('predicted negative, actually positive', isTruePositive(0, 1), false);
check('predicted negative, actually negative', isTruePositive(0, 0), false);

return results;`,hints:["True positive means both values are positive.","Use prediction === 1 and label === 1.","return prediction === 1 && label === 1;"],solution:`function isTruePositive(prediction, label) {
  return prediction === 1 && label === 1;
}`,explanation:"True positives are the successful detections of the positive class."},{id:"eval-false-positive",stepLabel:"62.2",group:"Confusion matrix",title:"False positive",concept:"A false positive happens when the model predicts positive but the true label is negative.",objective:"Return true only when prediction is 1 and label is 0.",difficulty:"warmup",starterCode:`function isFalsePositive(prediction, label) {
  // TODO: return true only when prediction is 1 and label is 0.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted positive, actually negative', isFalsePositive(1, 0), true);
check('predicted positive, actually positive', isFalsePositive(1, 1), false);
check('predicted negative, actually positive', isFalsePositive(0, 1), false);
check('predicted negative, actually negative', isFalsePositive(0, 0), false);

return results;`,hints:["False positive means the alarm fired but the event was not real.","Use prediction === 1 and label === 0.","return prediction === 1 && label === 0;"],solution:`function isFalsePositive(prediction, label) {
  return prediction === 1 && label === 0;
}`,explanation:"False positives matter when incorrect alarms are costly."},{id:"eval-false-negative",stepLabel:"62.3",group:"Confusion matrix",title:"False negative",concept:"A false negative happens when the model predicts negative but the true label is positive.",objective:"Return true only when prediction is 0 and label is 1.",difficulty:"warmup",starterCode:`function isFalseNegative(prediction, label) {
  // TODO: return true only when prediction is 0 and label is 1.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted negative, actually positive', isFalseNegative(0, 1), true);
check('predicted positive, actually positive', isFalseNegative(1, 1), false);
check('predicted positive, actually negative', isFalseNegative(1, 0), false);
check('predicted negative, actually negative', isFalseNegative(0, 0), false);

return results;`,hints:["False negative means the model missed a real positive.","Use prediction === 0 and label === 1.","return prediction === 0 && label === 1;"],solution:`function isFalseNegative(prediction, label) {
  return prediction === 0 && label === 1;
}`,explanation:"False negatives matter when missing a positive case is dangerous or expensive."},{id:"eval-confusion-counts",stepLabel:"62.4",group:"Confusion matrix",title:"Count confusion matrix",concept:"A confusion matrix counts TP, FP, TN, and FN over a dataset.",objective:"Increment the correct count for each prediction-label pair.",difficulty:"core",starterCode:`function confusionCounts(predictions, labels) {
  const counts = { tp: 0, fp: 0, tn: 0, fn: 0 };

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    const label = labels[i];

    // TODO: increment exactly one of tp, fp, tn, fn.
  }

  return counts;
}`,testCode:`const results = [];

function sameObject(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameObject(actual, expected),
  });
}

check('mixed predictions', confusionCounts([1, 1, 0, 0], [1, 0, 1, 0]), { tp: 1, fp: 1, tn: 1, fn: 1 });
check('perfect predictions', confusionCounts([1, 0, 1, 0], [1, 0, 1, 0]), { tp: 2, fp: 0, tn: 2, fn: 0 });
check('all missed positives', confusionCounts([0, 0, 0], [1, 1, 0]), { tp: 0, fp: 0, tn: 1, fn: 2 });

return results;`,hints:["There are four mutually exclusive cases.","Check prediction and label together.",`if (prediction === 1 && label === 1) counts.tp += 1;
else if (prediction === 1 && label === 0) counts.fp += 1;
else if (prediction === 0 && label === 0) counts.tn += 1;
else counts.fn += 1;`],solution:`function confusionCounts(predictions, labels) {
  const counts = { tp: 0, fp: 0, tn: 0, fn: 0 };

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    const label = labels[i];

    if (prediction === 1 && label === 1) counts.tp += 1;
    else if (prediction === 1 && label === 0) counts.fp += 1;
    else if (prediction === 0 && label === 0) counts.tn += 1;
    else counts.fn += 1;
  }

  return counts;
}`,explanation:"The confusion matrix is the foundation for precision, recall, specificity, F1, ROC, and PR curves."},{id:"eval-accuracy",stepLabel:"63.1",group:"Precision / recall / F1",title:"Accuracy",concept:"Accuracy is the fraction of examples the model classified correctly.",objective:"Return (tp + tn) / total.",difficulty:"warmup",starterCode:`function accuracy(counts) {
  const total = counts.tp + counts.fp + counts.tn + counts.fn;

  // TODO: return accuracy.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('balanced example', accuracy({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect', accuracy({ tp: 2, fp: 0, tn: 2, fn: 0 }), 1);
check('all wrong', accuracy({ tp: 0, fp: 2, tn: 0, fn: 2 }), 0);

return results;`,hints:["Correct predictions are true positives plus true negatives.","Divide by total examples.","return (counts.tp + counts.tn) / total;"],solution:`function accuracy(counts) {
  const total = counts.tp + counts.fp + counts.tn + counts.fn;
  return (counts.tp + counts.tn) / total;
}`,explanation:"Accuracy is easy to understand, but it can be misleading on imbalanced datasets."},{id:"eval-precision",stepLabel:"63.2",group:"Precision / recall / F1",title:"Precision",concept:"Precision asks: among predicted positives, how many were truly positive?",objective:"Return tp / (tp + fp).",difficulty:"core",starterCode:`function precision(counts) {
  const predictedPositive = counts.tp + counts.fp;

  if (predictedPositive === 0) return 0;

  // TODO: return precision.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one true, one false positive', precision({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect precision', precision({ tp: 3, fp: 0, tn: 1, fn: 2 }), 1);
check('no predicted positives', precision({ tp: 0, fp: 0, tn: 5, fn: 2 }), 0);

return results;`,hints:["Precision focuses on predictions labeled positive.","The denominator is tp + fp.","return counts.tp / predictedPositive;"],solution:`function precision(counts) {
  const predictedPositive = counts.tp + counts.fp;

  if (predictedPositive === 0) return 0;

  return counts.tp / predictedPositive;
}`,explanation:"High precision means positive predictions are trustworthy."},{id:"eval-recall",stepLabel:"63.3",group:"Precision / recall / F1",title:"Recall",concept:"Recall asks: among actual positives, how many did the model find?",objective:"Return tp / (tp + fn).",difficulty:"core",starterCode:`function recall(counts) {
  const actualPositive = counts.tp + counts.fn;

  if (actualPositive === 0) return 0;

  // TODO: return recall.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one found, one missed', recall({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect recall', recall({ tp: 3, fp: 2, tn: 1, fn: 0 }), 1);
check('no actual positives', recall({ tp: 0, fp: 2, tn: 5, fn: 0 }), 0);

return results;`,hints:["Recall focuses on actual positive cases.","The denominator is tp + fn.","return counts.tp / actualPositive;"],solution:`function recall(counts) {
  const actualPositive = counts.tp + counts.fn;

  if (actualPositive === 0) return 0;

  return counts.tp / actualPositive;
}`,explanation:"High recall means the model misses fewer positive cases."},{id:"eval-f1",stepLabel:"63.4",group:"Precision / recall / F1",title:"F1 score",concept:"F1 is the harmonic mean of precision and recall.",objective:"Return 2pr / (p + r).",difficulty:"challenge",starterCode:`function f1Score(precisionValue, recallValue) {
  if (precisionValue + recallValue === 0) return 0;

  // TODO: return F1 score.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('precision 0.5 recall 0.5', f1Score(0.5, 0.5), 0.5);
check('precision 1 recall 0.5', f1Score(1, 0.5), 2 / 3);
check('precision 0 recall 0', f1Score(0, 0), 0);

return results;`,hints:["F1 combines precision and recall.","Use 2 * precision * recall / (precision + recall).","return (2 * precisionValue * recallValue) / (precisionValue + recallValue);"],solution:`function f1Score(precisionValue, recallValue) {
  if (precisionValue + recallValue === 0) return 0;

  return (2 * precisionValue * recallValue) / (precisionValue + recallValue);
}`,explanation:"F1 is useful when you need a single score that balances false positives and false negatives."},{id:"threshold-predict",stepLabel:"64.1",group:"ROC / PR threshold sweeps",title:"Predict by threshold",concept:"A probabilistic classifier becomes a hard classifier by choosing a threshold.",objective:"Return 1 when score is at least threshold, otherwise 0.",difficulty:"warmup",starterCode:`function predictByThreshold(score, threshold) {
  // TODO: return 1 if score >= threshold, else 0.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('above threshold', predictByThreshold(0.8, 0.5), 1);
check('below threshold', predictByThreshold(0.3, 0.5), 0);
check('equal threshold counts positive', predictByThreshold(0.5, 0.5), 1);

return results;`,hints:["Thresholding turns scores into labels.","Use score >= threshold.","return score >= threshold ? 1 : 0;"],solution:`function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}`,explanation:"Changing the threshold changes the tradeoff between false positives and false negatives."},{id:"threshold-predict-all",stepLabel:"64.2",group:"ROC / PR threshold sweeps",title:"Threshold all scores",concept:"A threshold sweep applies many thresholds to the same scores.",objective:"Push thresholded prediction for each score.",difficulty:"core",starterCode:`function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}

function predictionsAtThreshold(scores, threshold) {
  const predictions = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push prediction for scores[i].
    predictions.push(0);
  }

  return predictions;
}`,testCode:`const results = [];

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

check('threshold 0.5', predictionsAtThreshold([0.8, 0.3, 0.5], 0.5), [1, 0, 1]);
check('threshold 0.7', predictionsAtThreshold([0.8, 0.3, 0.5], 0.7), [1, 0, 0]);
check('threshold 0.2', predictionsAtThreshold([0.8, 0.3, 0.5], 0.2), [1, 1, 1]);

return results;`,hints:["Use predictByThreshold on each score.","Push the result into predictions.","predictions.push(predictByThreshold(scores[i], threshold));"],solution:`function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}

function predictionsAtThreshold(scores, threshold) {
  const predictions = [];

  for (let i = 0; i < scores.length; i++) {
    predictions.push(predictByThreshold(scores[i], threshold));
  }

  return predictions;
}`,explanation:"Threshold sweeps let you see how metrics change as the decision boundary moves."},{id:"roc-false-positive-rate",stepLabel:"64.3",group:"ROC / PR threshold sweeps",title:"False positive rate",concept:"FPR asks: among actual negatives, how many did the model incorrectly mark positive?",objective:"Return fp / (fp + tn).",difficulty:"core",starterCode:`function falsePositiveRate(counts) {
  const actualNegatives = counts.fp + counts.tn;

  if (actualNegatives === 0) return 0;

  // TODO: return FPR.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one false positive, one true negative', falsePositiveRate({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('no false positives', falsePositiveRate({ tp: 1, fp: 0, tn: 4, fn: 1 }), 0);
check('all negatives false positive', falsePositiveRate({ tp: 1, fp: 4, tn: 0, fn: 1 }), 1);

return results;`,hints:["FPR is based on actual negatives.","The denominator is fp + tn.","return counts.fp / actualNegatives;"],solution:`function falsePositiveRate(counts) {
  const actualNegatives = counts.fp + counts.tn;

  if (actualNegatives === 0) return 0;

  return counts.fp / actualNegatives;
}`,explanation:"ROC curves plot true positive rate against false positive rate."},{id:"roc-true-positive-rate",stepLabel:"64.4",group:"ROC / PR threshold sweeps",title:"True positive rate",concept:"TPR is another name for recall.",objective:"Return tp / (tp + fn).",difficulty:"core",starterCode:`function truePositiveRate(counts) {
  const actualPositives = counts.tp + counts.fn;

  if (actualPositives === 0) return 0;

  // TODO: return TPR.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one found, one missed', truePositiveRate({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect recall', truePositiveRate({ tp: 4, fp: 1, tn: 1, fn: 0 }), 1);
check('miss all positives', truePositiveRate({ tp: 0, fp: 1, tn: 1, fn: 4 }), 0);

return results;`,hints:["TPR is recall.","The denominator is tp + fn.","return counts.tp / actualPositives;"],solution:`function truePositiveRate(counts) {
  const actualPositives = counts.tp + counts.fn;

  if (actualPositives === 0) return 0;

  return counts.tp / actualPositives;
}`,explanation:"TPR measures how many actual positives the model catches."},{id:"calibration-bin-index",stepLabel:"65.1",group:"Calibration bins",title:"Calibration bin index",concept:"Calibration groups predictions by score range.",objective:"Return the bin index for a score using equal-width bins.",difficulty:"core",starterCode:`function binIndex(score, numBins) {
  // Scores are between 0 and 1.
  // TODO: return Math.floor(score * numBins), capped at numBins - 1.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 0.05 bin 0 of 10', binIndex(0.05, 10), 0);
check('score 0.35 bin 3 of 10', binIndex(0.35, 10), 3);
check('score 0.99 bin 9 of 10', binIndex(0.99, 10), 9);
check('score 1.0 capped bin 9 of 10', binIndex(1.0, 10), 9);

return results;`,hints:["Start with Math.floor(score * numBins).","A score of 1.0 would produce numBins, so cap it.","return Math.min(numBins - 1, Math.floor(score * numBins));"],solution:`function binIndex(score, numBins) {
  return Math.min(numBins - 1, Math.floor(score * numBins));
}`,explanation:"Calibration bins let you compare predicted confidence with actual frequency."},{id:"calibration-bin-confidence",stepLabel:"65.2",group:"Calibration bins",title:"Average bin confidence",concept:"A bin average confidence is the mean predicted probability in that bin.",objective:"Return average of the scores.",difficulty:"warmup",starterCode:`function averageConfidence(scores) {
  if (scores.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }

  // TODO: return average confidence.
  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('average two scores', averageConfidence([0.2, 0.4]), 0.3);
check('one score', averageConfidence([0.7]), 0.7);
check('empty bin', averageConfidence([]), 0);

return results;`,hints:["Average means total divided by count.","The count is scores.length.","return total / scores.length;"],solution:`function averageConfidence(scores) {
  if (scores.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }

  return total / scores.length;
}`,explanation:"If a bin average confidence is 0.8, a calibrated model should be correct about 80% of the time in that bin."},{id:"calibration-bin-accuracy",stepLabel:"65.3",group:"Calibration bins",title:"Bin accuracy",concept:"A bin empirical accuracy is the fraction of examples in that bin that were correct.",objective:"Return number correct divided by bin size.",difficulty:"core",starterCode:`function binAccuracy(correctFlags) {
  if (correctFlags.length === 0) return 0;

  let correct = 0;

  for (let i = 0; i < correctFlags.length; i++) {
    // TODO: increment correct when correctFlags[i] is true.
  }

  return correct / correctFlags.length;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two of three correct', binAccuracy([true, true, false]), 2 / 3);
check('all correct', binAccuracy([true, true]), 1);
check('none correct', binAccuracy([false, false]), 0);
check('empty bin', binAccuracy([]), 0);

return results;`,hints:["correctFlags[i] is a boolean.","If it is true, add 1.","if (correctFlags[i]) correct += 1;"],solution:`function binAccuracy(correctFlags) {
  if (correctFlags.length === 0) return 0;

  let correct = 0;

  for (let i = 0; i < correctFlags.length; i++) {
    if (correctFlags[i]) correct += 1;
  }

  return correct / correctFlags.length;
}`,explanation:"Calibration compares confidence to empirical accuracy."},{id:"calibration-gap",stepLabel:"65.4",group:"Calibration bins",title:"Calibration gap",concept:"A calibration gap is the absolute difference between confidence and accuracy.",objective:"Return |confidence - accuracy|.",difficulty:"warmup",starterCode:`function calibrationGap(confidence, accuracy) {
  // TODO: return absolute difference.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('overconfident gap', calibrationGap(0.8, 0.6), 0.2);
check('underconfident gap', calibrationGap(0.4, 0.7), 0.3);
check('perfect gap', calibrationGap(0.5, 0.5), 0);

return results;`,hints:["Use Math.abs.","Subtract accuracy from confidence, then take absolute value.","return Math.abs(confidence - accuracy);"],solution:`function calibrationGap(confidence, accuracy) {
  return Math.abs(confidence - accuracy);
}`,explanation:"A calibrated model has small gaps between predicted confidence and observed correctness."},{id:"ece-bin-weight",stepLabel:"66.1",group:"Expected calibration error",title:"Bin weight",concept:"ECE weights each bin by how many examples it contains.",objective:"Return binCount / totalCount.",difficulty:"warmup",starterCode:`function binWeight(binCount, totalCount) {
  // TODO: return bin fraction.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('half the examples', binWeight(50, 100), 0.5);
check('one tenth', binWeight(10, 100), 0.1);
check('empty bin', binWeight(0, 100), 0);

return results;`,hints:["Weight is the bin size divided by total size.","Use binCount / totalCount.","return binCount / totalCount;"],solution:`function binWeight(binCount, totalCount) {
  return binCount / totalCount;
}`,explanation:"Large bins should matter more than tiny bins in the final ECE."},{id:"ece-bin-contribution",stepLabel:"66.2",group:"Expected calibration error",title:"One bin contribution",concept:"A bin contributes weight times calibration gap to ECE.",objective:"Return weight * abs(confidence - accuracy).",difficulty:"core",starterCode:`function eceBinContribution(binCount, totalCount, confidence, accuracy) {
  const weight = binCount / totalCount;

  // TODO: return weighted calibration gap.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('simple contribution', eceBinContribution(50, 100, 0.8, 0.6), 0.1);
check('perfect bin', eceBinContribution(50, 100, 0.8, 0.8), 0);
check('small bin', eceBinContribution(10, 100, 0.4, 0.7), 0.03);

return results;`,hints:["Calibration gap is Math.abs(confidence - accuracy).","Multiply by weight.","return weight * Math.abs(confidence - accuracy);"],solution:`function eceBinContribution(binCount, totalCount, confidence, accuracy) {
  const weight = binCount / totalCount;
  return weight * Math.abs(confidence - accuracy);
}`,explanation:"ECE summarizes calibration error across bins with size weighting."},{id:"ece-full",stepLabel:"66.3",group:"Expected calibration error",title:"Expected calibration error",concept:"ECE is the sum of weighted calibration gaps across bins.",objective:"Accumulate each bin weighted gap.",difficulty:"challenge",starterCode:`function expectedCalibrationError(bins, totalCount) {
  let ece = 0;

  for (let i = 0; i < bins.length; i++) {
    const bin = bins[i];

    // bin has count, confidence, accuracy.
    // TODO: add this bin's contribution.
    ece += 0;
  }

  return ece;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two bins', expectedCalibrationError([{ count: 50, confidence: 0.8, accuracy: 0.6 }, { count: 50, confidence: 0.4, accuracy: 0.5 }], 100), 0.15);
check('perfect calibration', expectedCalibrationError([{ count: 30, confidence: 0.7, accuracy: 0.7 }, { count: 70, confidence: 0.2, accuracy: 0.2 }], 100), 0);

return results;`,hints:["For each bin, contribution is count / totalCount times absolute confidence-accuracy gap.","Use Math.abs(bin.confidence - bin.accuracy).","ece += (bin.count / totalCount) * Math.abs(bin.confidence - bin.accuracy);"],solution:`function expectedCalibrationError(bins, totalCount) {
  let ece = 0;

  for (let i = 0; i < bins.length; i++) {
    const bin = bins[i];

    ece += (bin.count / totalCount) * Math.abs(bin.confidence - bin.accuracy);
  }

  return ece;
}`,explanation:"ECE is a compact calibration summary, but it depends on binning choices."},{id:"cost-false-positive",stepLabel:"67.1",group:"Cost-sensitive thresholding",title:"False positive cost",concept:"False positives and false negatives can have different costs.",objective:"Return fp * falsePositiveCost.",difficulty:"warmup",starterCode:`function falsePositiveCost(fp, falsePositiveCostPerCase) {
  // TODO: return total false-positive cost.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two false positives cost 5', falsePositiveCost(2, 5), 10);
check('zero false positives', falsePositiveCost(0, 5), 0);
check('three false positives cost 10', falsePositiveCost(3, 10), 30);

return results;`,hints:["Total cost is count times cost per case.","Use fp * falsePositiveCostPerCase.","return fp * falsePositiveCostPerCase;"],solution:`function falsePositiveCost(fp, falsePositiveCostPerCase) {
  return fp * falsePositiveCostPerCase;
}`,explanation:"When false alarms are expensive, precision may matter more."},{id:"cost-false-negative",stepLabel:"67.2",group:"Cost-sensitive thresholding",title:"False negative cost",concept:"False negatives may be much more expensive than false positives in safety-critical tasks.",objective:"Return fn * falseNegativeCost.",difficulty:"warmup",starterCode:`function falseNegativeCost(fn, falseNegativeCostPerCase) {
  // TODO: return total false-negative cost.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two false negatives cost 50', falseNegativeCost(2, 50), 100);
check('zero false negatives', falseNegativeCost(0, 50), 0);
check('three false negatives cost 10', falseNegativeCost(3, 10), 30);

return results;`,hints:["Total cost is count times cost per case.","Use fn * falseNegativeCostPerCase.","return fn * falseNegativeCostPerCase;"],solution:`function falseNegativeCost(fn, falseNegativeCostPerCase) {
  return fn * falseNegativeCostPerCase;
}`,explanation:"When misses are expensive, recall may matter more."},{id:"cost-total-decision-cost",stepLabel:"67.3",group:"Cost-sensitive thresholding",title:"Total decision cost",concept:"A threshold can be chosen by minimizing total false-positive and false-negative cost.",objective:"Return fp cost plus fn cost.",difficulty:"core",starterCode:`function totalDecisionCost(counts, costs) {
  const fpCost = counts.fp * costs.falsePositive;
  const fnCost = counts.fn * costs.falseNegative;

  // TODO: return total cost.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('balanced costs', totalDecisionCost({ fp: 2, fn: 3 }, { falsePositive: 5, falseNegative: 5 }), 25);
check('false negatives expensive', totalDecisionCost({ fp: 2, fn: 3 }, { falsePositive: 1, falseNegative: 10 }), 32);
check('no mistakes', totalDecisionCost({ fp: 0, fn: 0 }, { falsePositive: 5, falseNegative: 10 }), 0);

return results;`,hints:["fpCost and fnCost are already computed.","Total cost is their sum.","return fpCost + fnCost;"],solution:`function totalDecisionCost(counts, costs) {
  const fpCost = counts.fp * costs.falsePositive;
  const fnCost = counts.fn * costs.falseNegative;

  return fpCost + fnCost;
}`,explanation:"The best threshold depends on the business or safety cost of each error type."},{id:"cost-choose-threshold",stepLabel:"67.4",group:"Cost-sensitive thresholding",title:"Choose lower-cost threshold",concept:"A cost-sensitive classifier chooses the threshold with lower expected cost.",objective:"Return thresholdA if costA <= costB, otherwise thresholdB.",difficulty:"core",starterCode:`function chooseLowerCostThreshold(thresholdA, costA, thresholdB, costB) {
  // TODO: return the threshold with lower cost.
  return thresholdA;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('A lower cost', chooseLowerCostThreshold(0.3, 10, 0.7, 20), 0.3);
check('B lower cost', chooseLowerCostThreshold(0.3, 30, 0.7, 20), 0.7);
check('tie chooses A', chooseLowerCostThreshold(0.3, 20, 0.7, 20), 0.3);

return results;`,hints:["Compare costA and costB.","If costA is lower or tied, return thresholdA.","return costA <= costB ? thresholdA : thresholdB;"],solution:`function chooseLowerCostThreshold(thresholdA, costA, thresholdB, costB) {
  return costA <= costB ? thresholdA : thresholdB;
}`,explanation:"Threshold selection is a decision problem, not just a metrics problem."},{id:"drift-mean-shift",stepLabel:"68.1",group:"Drift checks",title:"Mean shift",concept:"A simple drift check compares feature means between reference and current data.",objective:"Return currentMean - referenceMean.",difficulty:"warmup",starterCode:`function meanShift(referenceMean, currentMean) {
  // TODO: return current minus reference.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive shift', meanShift(10, 13), 3);
check('negative shift', meanShift(10, 7), -3);
check('no shift', meanShift(10, 10), 0);

return results;`,hints:["Shift is current value compared with reference.","Use currentMean - referenceMean.","return currentMean - referenceMean;"],solution:`function meanShift(referenceMean, currentMean) {
  return currentMean - referenceMean;
}`,explanation:"Mean shift is a simple first warning that a feature distribution has changed."},{id:"drift-standardized-mean-shift",stepLabel:"68.2",group:"Drift checks",title:"Standardized mean shift",concept:"Standardized shift divides mean change by reference standard deviation.",objective:"Return (currentMean - referenceMean) / referenceStd.",difficulty:"core",starterCode:`function standardizedMeanShift(referenceMean, currentMean, referenceStd) {
  // TODO: return standardized shift.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one std shift', standardizedMeanShift(10, 12, 2), 1);
check('negative shift', standardizedMeanShift(10, 7, 3), -1);
check('zero shift', standardizedMeanShift(10, 10, 5), 0);

return results;`,hints:["First compute currentMean - referenceMean.","Then divide by referenceStd.","return (currentMean - referenceMean) / referenceStd;"],solution:`function standardizedMeanShift(referenceMean, currentMean, referenceStd) {
  return (currentMean - referenceMean) / referenceStd;
}`,explanation:"A shift of 2 units may be small or large depending on normal feature variation."},{id:"drift-threshold-check",stepLabel:"68.3",group:"Drift checks",title:"Drift threshold check",concept:"A drift alert can fire when absolute standardized shift exceeds a threshold.",objective:"Return true when |shift| > threshold.",difficulty:"core",starterCode:`function driftAlert(standardizedShift, threshold) {
  // TODO: return whether absolute shift exceeds threshold.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('large positive shift', driftAlert(2.5, 2), true);
check('large negative shift', driftAlert(-2.5, 2), true);
check('small shift', driftAlert(1.5, 2), false);
check('equal threshold is not greater', driftAlert(2, 2), false);

return results;`,hints:["Use Math.abs.","Compare absolute shift with threshold.","return Math.abs(standardizedShift) > threshold;"],solution:`function driftAlert(standardizedShift, threshold) {
  return Math.abs(standardizedShift) > threshold;
}`,explanation:"Drift checks are not proof of model failure, but they can trigger investigation."},{id:"drift-psi-term",stepLabel:"68.4",group:"Drift checks",title:"PSI term",concept:"Population Stability Index compares reference and current proportions in a bin.",objective:"Return (current - reference) * log(current / reference).",difficulty:"challenge",starterCode:`function psiTerm(referenceProportion, currentProportion) {
  // TODO: return one PSI bin contribution.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('same proportions', psiTerm(0.2, 0.2), 0);
check('changed proportions', psiTerm(0.2, 0.4), (0.4 - 0.2) * Math.log(0.4 / 0.2));
check('another change', psiTerm(0.5, 0.25), (0.25 - 0.5) * Math.log(0.25 / 0.5));

return results;`,hints:["PSI compares current and reference proportions.","Use Math.log(currentProportion / referenceProportion).","return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);"],solution:`function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}`,explanation:"PSI is a common monitoring heuristic for distribution shift across binned features."},{id:"drift-total-psi",stepLabel:"68.5",group:"Drift checks",title:"Total PSI",concept:"Total PSI sums bin-level PSI contributions.",objective:"Accumulate psiTerm for every bin.",difficulty:"challenge",starterCode:`function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}

function populationStabilityIndex(referenceBins, currentBins) {
  let total = 0;

  for (let i = 0; i < referenceBins.length; i++) {
    // TODO: add PSI contribution for this bin.
    total += 0;
  }

  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('no drift', populationStabilityIndex([0.5, 0.5], [0.5, 0.5]), 0);
check('two-bin drift', populationStabilityIndex([0.5, 0.5], [0.25, 0.75]), psiTerm(0.5, 0.25) + psiTerm(0.5, 0.75));

return results;`,hints:["Use psiTerm(referenceBins[i], currentBins[i]).","Add each bin contribution to total.","total += psiTerm(referenceBins[i], currentBins[i]);"],solution:`function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}

function populationStabilityIndex(referenceBins, currentBins) {
  let total = 0;

  for (let i = 0; i < referenceBins.length; i++) {
    total += psiTerm(referenceBins[i], currentBins[i]);
  }

  return total;
}`,explanation:"PSI summarizes how much a binned distribution changed between reference and current data."}],o=[{id:"experiment-is-treated",stepLabel:"69.1",group:"Treatment/control split",title:"Identify treated user",concept:"Experiments compare a treatment group against a control group.",objective:'Return true when assignment equals "treatment".',difficulty:"warmup",starterCode:`function isTreated(assignment) {
  // TODO: return whether this unit is in treatment.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('treatment user', isTreated('treatment'), true);
check('control user', isTreated('control'), false);
check('other label', isTreated('holdout'), false);

return results;`,hints:['Treatment is represented by the string "treatment".',"Use strict equality.",'return assignment === "treatment";'],solution:`function isTreated(assignment) {
  return assignment === "treatment";
}`,explanation:"A treatment indicator is the starting point for computing experiment outcomes by group."},{id:"experiment-count-treatment",stepLabel:"69.2",group:"Treatment/control split",title:"Count treatment units",concept:"Before analyzing an experiment, check how many units landed in treatment.",objective:'Count assignments equal to "treatment".',difficulty:"core",starterCode:`function countTreatment(assignments) {
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    // TODO: increment count for treatment assignment.
  }

  return count;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mixed assignments', countTreatment(['treatment', 'control', 'treatment']), 2);
check('all control', countTreatment(['control', 'control']), 0);
check('all treatment', countTreatment(['treatment', 'treatment']), 2);

return results;`,hints:["Check each assignment string.",'If assignments[i] === "treatment", add one.','if (assignments[i] === "treatment") count += 1;'],solution:`function countTreatment(assignments) {
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "treatment") count += 1;
  }

  return count;
}`,explanation:"Group counts help catch broken randomization or unexpected traffic allocation."},{id:"experiment-control-outcomes",stepLabel:"69.3",group:"Treatment/control split",title:"Collect control outcomes",concept:"Control outcomes estimate what would happen without the intervention.",objective:'Push outcomes whose matching assignment is "control".',difficulty:"core",starterCode:`function controlOutcomes(assignments, outcomes) {
  const values = [];

  for (let i = 0; i < assignments.length; i++) {
    // TODO: collect outcomes for control units.
  }

  return values;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('mixed outcomes', controlOutcomes(['treatment', 'control', 'control'], [10, 20, 30]), [20, 30]);
check('no control', controlOutcomes(['treatment'], [10]), []);
check('all control', controlOutcomes(['control', 'control'], [1, 2]), [1, 2]);

return results;`,hints:["Use the same index for assignments and outcomes.",'Control units have assignment "control".','if (assignments[i] === "control") values.push(outcomes[i]);'],solution:`function controlOutcomes(assignments, outcomes) {
  const values = [];

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "control") values.push(outcomes[i]);
  }

  return values;
}`,explanation:"Splitting outcomes by assignment is the first step toward estimating a treatment effect."},{id:"experiment-treatment-rate",stepLabel:"69.4",group:"Treatment/control split",title:"Treatment allocation rate",concept:"The treatment rate is the fraction of units assigned to treatment.",objective:"Return treatment count divided by total count.",difficulty:"core",starterCode:`function treatmentRate(assignments) {
  let treated = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "treatment") treated += 1;
  }

  // TODO: return the treatment allocation rate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('half treated', treatmentRate(['treatment', 'control']), 0.5);
check('two thirds treated', treatmentRate(['treatment', 'control', 'treatment']), 2 / 3);
check('none treated', treatmentRate(['control', 'control']), 0);

return results;`,hints:["treated is already counted.","The denominator is assignments.length.","return treated / assignments.length;"],solution:`function treatmentRate(assignments) {
  let treated = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === "treatment") treated += 1;
  }

  return treated / assignments.length;
}`,explanation:"A treatment allocation rate far from the planned split can signal assignment problems."},{id:"experiment-mean",stepLabel:"70.1",group:"Difference in means",title:"Mean outcome",concept:"Difference-in-means starts by computing average outcome in each group.",objective:"Return the average of values.",difficulty:"warmup",starterCode:`function mean(values) {
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }

  // TODO: return average value.
  return total;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('mean [1,2,3]', mean([1, 2, 3]), 2);
check('mean [10,20]', mean([10, 20]), 15);
check('mean one value', mean([7]), 7);

return results;`,hints:["Average means total divided by count.","The count is values.length.","return total / values.length;"],solution:`function mean(values) {
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    total += values[i];
  }

  return total / values.length;
}`,explanation:"Group means summarize the outcome level for treatment and control."},{id:"experiment-difference-in-means",stepLabel:"70.2",group:"Difference in means",title:"Difference in means",concept:"The simplest treatment effect estimate is treatment mean minus control mean.",objective:"Return treatmentMean - controlMean.",difficulty:"core",starterCode:`function differenceInMeans(treatmentMean, controlMean) {
  // TODO: return treatment minus control.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive lift', differenceInMeans(12, 10), 2);
check('negative lift', differenceInMeans(8, 10), -2);
check('no lift', differenceInMeans(10, 10), 0);

return results;`,hints:["Treatment effect is treatment outcome minus control outcome.","Keep the sign.","return treatmentMean - controlMean;"],solution:`function differenceInMeans(treatmentMean, controlMean) {
  return treatmentMean - controlMean;
}`,explanation:"A positive difference means the treatment group had a higher average outcome."},{id:"experiment-group-mean",stepLabel:"70.3",group:"Difference in means",title:"Mean for one group",concept:"Experiment analysis computes means conditional on assignment.",objective:"Average outcomes whose assignment matches group.",difficulty:"core",starterCode:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }

  // TODO: return mean for this group.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('control mean', groupMean(['treatment', 'control', 'control'], [10, 20, 30], 'control'), 25);
check('treatment mean', groupMean(['treatment', 'control', 'treatment'], [10, 20, 40], 'treatment'), 25);
check('one unit mean', groupMean(['control'], [7], 'control'), 7);

return results;`,hints:["total and count are already computed.","Mean is total divided by count.","return total / count;"],solution:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;

  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }

  return total / count;
}`,explanation:"Conditional means let you compare treatment and control in one shared dataset."},{id:"experiment-ate-from-data",stepLabel:"70.4",group:"Difference in means",title:"ATE from experiment data",concept:"A randomized experiment estimates average treatment effect by subtracting group means.",objective:"Return treatment group mean minus control group mean.",difficulty:"challenge",starterCode:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }
  return total / count;
}

function averageTreatmentEffect(assignments, outcomes) {
  const treatmentMean = groupMean(assignments, outcomes, 'treatment');
  const controlMean = groupMean(assignments, outcomes, 'control');

  // TODO: return difference in means.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive effect', averageTreatmentEffect(['treatment', 'control', 'treatment', 'control'], [12, 10, 14, 8]), 4);
check('negative effect', averageTreatmentEffect(['treatment', 'control'], [7, 10]), -3);
check('zero effect', averageTreatmentEffect(['treatment', 'control'], [10, 10]), 0);

return results;`,hints:["Both group means are already computed.","ATE is treatmentMean - controlMean.","return treatmentMean - controlMean;"],solution:`function groupMean(assignments, outcomes, group) {
  let total = 0;
  let count = 0;
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i] === group) {
      total += outcomes[i];
      count += 1;
    }
  }
  return total / count;
}

function averageTreatmentEffect(assignments, outcomes) {
  const treatmentMean = groupMean(assignments, outcomes, 'treatment');
  const controlMean = groupMean(assignments, outcomes, 'control');
  return treatmentMean - controlMean;
}`,explanation:"Randomization makes difference-in-means a credible estimate of causal effect."},{id:"experiment-sample-variance",stepLabel:"71.1",group:"Standard error and confidence intervals",title:"Sample variance",concept:"Standard errors use sample variance to estimate outcome variability.",objective:"Return sum of squared deviations divided by n - 1.",difficulty:"core",starterCode:`function sampleVariance(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    const diff = values[i] - mean;
    // TODO: add squared deviation.
    total += 0;
  }

  return total / (values.length - 1);
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('variance [1,2,3]', sampleVariance([1, 2, 3]), 1);
check('variance [10,20]', sampleVariance([10, 20]), 50);
check('constant values', sampleVariance([5, 5, 5]), 0);

return results;`,hints:["diff is already centered.","Squared deviation is diff * diff.","total += diff * diff;"],solution:`function sampleVariance(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  let total = 0;

  for (let i = 0; i < values.length; i++) {
    const diff = values[i] - mean;
    total += diff * diff;
  }

  return total / (values.length - 1);
}`,explanation:"Sample variance estimates how noisy outcomes are around their mean."},{id:"experiment-standard-error-mean",stepLabel:"71.2",group:"Standard error and confidence intervals",title:"Standard error of mean",concept:"The standard error of a mean shrinks as sample size grows.",objective:"Return sqrt(variance / n).",difficulty:"core",starterCode:`function standardErrorMean(variance, n) {
  // TODO: return standard error of one mean.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('variance 4 n 4', standardErrorMean(4, 4), 1);
check('variance 9 n 9', standardErrorMean(9, 9), 1);
check('variance 25 n 100', standardErrorMean(25, 100), 0.5);

return results;`,hints:["Variance of a sample mean is variance / n.","Standard error is the square root of that.","return Math.sqrt(variance / n);"],solution:`function standardErrorMean(variance, n) {
  return Math.sqrt(variance / n);
}`,explanation:"More samples reduce uncertainty in the estimated mean."},{id:"experiment-standard-error-diff",stepLabel:"71.3",group:"Standard error and confidence intervals",title:"Standard error of difference",concept:"For independent groups, variances of the two sample means add.",objective:"Return sqrt(treatmentVariance / nTreatment + controlVariance / nControl).",difficulty:"challenge",starterCode:`function standardErrorDifference(treatmentVariance, nTreatment, controlVariance, nControl) {
  // TODO: return standard error for difference in means.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('equal groups', standardErrorDifference(4, 4, 4, 4), Math.sqrt(2));
check('larger samples', standardErrorDifference(9, 9, 16, 16), Math.sqrt(2));
check('zero variance', standardErrorDifference(0, 10, 0, 10), 0);

return results;`,hints:["Add variance / n for both groups.","Then take Math.sqrt.","return Math.sqrt(treatmentVariance / nTreatment + controlVariance / nControl);"],solution:`function standardErrorDifference(treatmentVariance, nTreatment, controlVariance, nControl) {
  return Math.sqrt(treatmentVariance / nTreatment + controlVariance / nControl);
}`,explanation:"The difference-in-means estimate is noisier when either group has high variance or low sample size."},{id:"experiment-confidence-interval",stepLabel:"71.4",group:"Standard error and confidence intervals",title:"Confidence interval bounds",concept:"An approximate confidence interval is estimate plus or minus critical value times standard error.",objective:"Return [estimate - z * se, estimate + z * se].",difficulty:"core",starterCode:`function confidenceInterval(estimate, standardError, z = 1.96) {
  const margin = z * standardError;

  // TODO: return lower and upper bounds.
  return [];
}`,testCode:`const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}

check('default z', confidenceInterval(10, 1), [8.04, 11.96]);
check('custom z', confidenceInterval(5, 2, 2), [1, 9]);
check('zero se', confidenceInterval(3, 0), [3, 3]);

return results;`,hints:["The margin is already computed.","Lower is estimate - margin, upper is estimate + margin.","return [estimate - margin, estimate + margin];"],solution:`function confidenceInterval(estimate, standardError, z = 1.96) {
  const margin = z * standardError;
  return [estimate - margin, estimate + margin];
}`,explanation:"Confidence intervals communicate uncertainty around an estimated effect."},{id:"ab-z-statistic",stepLabel:"72.1",group:"A/B test z-statistic",title:"Z-statistic",concept:"A z-statistic measures how many standard errors an estimate is away from zero.",objective:"Return estimate / standardError.",difficulty:"warmup",starterCode:`function zStatistic(estimate, standardError) {
  // TODO: return z-statistic.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two standard errors', zStatistic(4, 2), 2);
check('negative estimate', zStatistic(-3, 1.5), -2);
check('zero estimate', zStatistic(0, 2), 0);

return results;`,hints:["Divide effect estimate by its standard error.","Keep the sign.","return estimate / standardError;"],solution:`function zStatistic(estimate, standardError) {
  return estimate / standardError;
}`,explanation:"Large absolute z-statistics are less compatible with a zero-effect null hypothesis."},{id:"ab-significant-two-sided",stepLabel:"72.2",group:"A/B test z-statistic",title:"Two-sided significance",concept:"A two-sided z-test flags effects far from zero in either direction.",objective:"Return true when abs(z) exceeds critical value.",difficulty:"core",starterCode:`function isSignificant(z, criticalValue = 1.96) {
  // TODO: compare absolute z with critical value.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('large positive z', isSignificant(2.1), true);
check('large negative z', isSignificant(-2.1), true);
check('small z', isSignificant(1.5), false);
check('equal critical is not greater', isSignificant(1.96), false);

return results;`,hints:["Use Math.abs(z).","Compare with criticalValue.","return Math.abs(z) > criticalValue;"],solution:`function isSignificant(z, criticalValue = 1.96) {
  return Math.abs(z) > criticalValue;
}`,explanation:"Two-sided tests detect changes in either direction."},{id:"ab-standard-error-proportion",stepLabel:"72.3",group:"A/B test z-statistic",title:"Proportion standard error",concept:"Binary conversion-rate tests use p(1-p)/n variance for each group proportion.",objective:"Return sqrt(p * (1 - p) / n).",difficulty:"core",starterCode:`function proportionStandardError(p, n) {
  // TODO: return standard error for one conversion rate.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p 0.5 n 100', proportionStandardError(0.5, 100), 0.05);
check('p 0.2 n 100', proportionStandardError(0.2, 100), 0.04);
check('p 0 n 100', proportionStandardError(0, 100), 0);

return results;`,hints:["Proportion variance is p * (1 - p) / n.","Take the square root.","return Math.sqrt((p * (1 - p)) / n);"],solution:`function proportionStandardError(p, n) {
  return Math.sqrt((p * (1 - p)) / n);
}`,explanation:"Conversion-rate uncertainty is largest near 50% and smaller near 0% or 100%."},{id:"ab-conversion-z",stepLabel:"72.4",group:"A/B test z-statistic",title:"Conversion-rate z-statistic",concept:"A/B conversion tests compare rate lift against the standard error of the difference.",objective:"Return (treatmentRate - controlRate) / standard error.",difficulty:"challenge",starterCode:`function conversionZ(treatmentRate, treatmentN, controlRate, controlN) {
  const se = Math.sqrt(
    (treatmentRate * (1 - treatmentRate)) / treatmentN +
    (controlRate * (1 - controlRate)) / controlN
  );

  // TODO: return z-statistic for conversion lift.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('positive lift', conversionZ(0.12, 1000, 0.10, 1000), (0.12 - 0.10) / Math.sqrt((0.12 * 0.88) / 1000 + (0.10 * 0.90) / 1000));
check('negative lift', conversionZ(0.08, 1000, 0.10, 1000), (0.08 - 0.10) / Math.sqrt((0.08 * 0.92) / 1000 + (0.10 * 0.90) / 1000));

return results;`,hints:["The standard error is already computed as se.","The lift is treatmentRate - controlRate.","return (treatmentRate - controlRate) / se;"],solution:`function conversionZ(treatmentRate, treatmentN, controlRate, controlN) {
  const se = Math.sqrt(
    (treatmentRate * (1 - treatmentRate)) / treatmentN +
    (controlRate * (1 - controlRate)) / controlN
  );

  return (treatmentRate - controlRate) / se;
}`,explanation:"A conversion-rate z-statistic standardizes observed lift by its sampling uncertainty."},{id:"power-effect-to-noise",stepLabel:"73.1",group:"Power and MDE intuition",title:"Effect-to-noise ratio",concept:"Power improves when the effect is large relative to standard error.",objective:"Return effect / standardError.",difficulty:"warmup",starterCode:`function effectToNoise(effect, standardError) {
  // TODO: return effect size in standard-error units.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two se effect', effectToNoise(4, 2), 2);
check('half se effect', effectToNoise(1, 2), 0.5);
check('negative effect', effectToNoise(-3, 1.5), -2);

return results;`,hints:["This is the same scaling idea as a z-statistic.","Divide effect by standard error.","return effect / standardError;"],solution:`function effectToNoise(effect, standardError) {
  return effect / standardError;
}`,explanation:"Small noisy effects are hard to detect reliably."},{id:"power-min-detectable-effect",stepLabel:"73.2",group:"Power and MDE intuition",title:"Minimum detectable effect",concept:"A rough MDE multiplies standard error by the critical threshold needed for detection.",objective:"Return multiplier * standardError.",difficulty:"core",starterCode:`function minimumDetectableEffect(standardError, multiplier) {
  // TODO: return rough MDE.
  return 0;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mde 2 se', minimumDetectableEffect(5, 2), 10);
check('mde 2.8 se', minimumDetectableEffect(10, 2.8), 28);
check('zero se', minimumDetectableEffect(0, 2), 0);

return results;`,hints:["MDE is measured in outcome units.","Multiply standardError by multiplier.","return multiplier * standardError;"],solution:`function minimumDetectableEffect(standardError, multiplier) {
  return multiplier * standardError;
}`,explanation:"A smaller standard error lowers the effect size an experiment can reliably detect."},{id:"power-sample-size-scale",stepLabel:"73.3",group:"Power and MDE intuition",title:"Standard error from sample size",concept:"For a fixed variance, standard error decreases with the square root of sample size.",objective:"Return standardDeviation / sqrt(n).",difficulty:"core",starterCode:`function standardErrorFromN(standardDeviation, n) {
  // TODO: return standard error from sample size.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('sd 10 n 100', standardErrorFromN(10, 100), 1);
check('sd 6 n 9', standardErrorFromN(6, 9), 2);
check('sd 5 n 25', standardErrorFromN(5, 25), 1);

return results;`,hints:["Use Math.sqrt(n).","Divide standard deviation by square root sample size.","return standardDeviation / Math.sqrt(n);"],solution:`function standardErrorFromN(standardDeviation, n) {
  return standardDeviation / Math.sqrt(n);
}`,explanation:"Quadrupling sample size roughly halves standard error."},{id:"power-required-sample-size",stepLabel:"73.4",group:"Power and MDE intuition",title:"Required sample size intuition",concept:"Required sample size grows with variance and shrinks with squared detectable effect.",objective:"Return (multiplier * sd / mde)^2.",difficulty:"challenge",starterCode:`function requiredSampleSize(standardDeviation, mde, multiplier) {
  // TODO: return rough sample size per group.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('basic size', requiredSampleSize(10, 2, 2), 100);
check('larger effect needs fewer samples', requiredSampleSize(10, 4, 2), 25);
check('larger sd needs more samples', requiredSampleSize(20, 2, 2), 400);

return results;`,hints:["Compute multiplier * standardDeviation / mde.","Then square it.","return Math.pow((multiplier * standardDeviation) / mde, 2);"],solution:`function requiredSampleSize(standardDeviation, mde, multiplier) {
  return Math.pow((multiplier * standardDeviation) / mde, 2);
}`,explanation:"Detecting smaller effects requires much more data because sample size scales with one over MDE squared."},{id:"cuped-residual",stepLabel:"74.1",group:"CUPED adjustment",title:"CUPED residual",concept:"CUPED removes predictable variation using a pre-experiment covariate.",objective:"Return outcome - theta * covariate.",difficulty:"warmup",starterCode:`function cupedResidual(outcome, covariate, theta) {
  // TODO: subtract theta times covariate.
  return outcome;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('simple residual', cupedResidual(10, 3, 2), 4);
check('zero theta', cupedResidual(10, 3, 0), 10);
check('negative covariate', cupedResidual(10, -2, 3), 16);

return results;`,hints:["Adjustment is theta * covariate.","Subtract the adjustment from outcome.","return outcome - theta * covariate;"],solution:`function cupedResidual(outcome, covariate, theta) {
  return outcome - theta * covariate;
}`,explanation:"CUPED lowers variance by accounting for pre-existing outcome predictors."},{id:"cuped-theta",stepLabel:"74.2",group:"CUPED adjustment",title:"CUPED theta",concept:"The CUPED coefficient is covariance(outcome, covariate) divided by variance(covariate).",objective:"Return covariance / variance.",difficulty:"core",starterCode:`function cupedTheta(covariance, covariateVariance) {
  // TODO: return CUPED coefficient.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('theta 2', cupedTheta(10, 5), 2);
check('theta half', cupedTheta(3, 6), 0.5);
check('zero covariance', cupedTheta(0, 5), 0);

return results;`,hints:["Theta is a regression-style slope.","Divide covariance by covariate variance.","return covariance / covariateVariance;"],solution:`function cupedTheta(covariance, covariateVariance) {
  return covariance / covariateVariance;
}`,explanation:"A stronger covariate-outcome relationship gives CUPED more variance reduction potential."},{id:"cuped-adjust-vector",stepLabel:"74.3",group:"CUPED adjustment",title:"Adjust outcome vector",concept:"CUPED applies the same residualization formula to every unit.",objective:"Push outcomes[i] - theta * covariates[i].",difficulty:"core",starterCode:`function cupedAdjust(outcomes, covariates, theta) {
  const adjusted = [];

  for (let i = 0; i < outcomes.length; i++) {
    // TODO: push CUPED-adjusted outcome.
    adjusted.push(outcomes[i]);
  }

  return adjusted;
}`,testCode:`const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('adjust two values', cupedAdjust([10, 20], [3, 4], 2), [4, 12]);
check('zero theta', cupedAdjust([10, 20], [3, 4], 0), [10, 20]);
check('negative covariate', cupedAdjust([10], [-2], 3), [16]);

return results;`,hints:["Use matching outcome and covariate coordinates.","Subtract theta * covariates[i].","adjusted.push(outcomes[i] - theta * covariates[i]);"],solution:`function cupedAdjust(outcomes, covariates, theta) {
  const adjusted = [];

  for (let i = 0; i < outcomes.length; i++) {
    adjusted.push(outcomes[i] - theta * covariates[i]);
  }

  return adjusted;
}`,explanation:"After adjustment, the experiment can compare adjusted outcomes instead of raw outcomes."},{id:"cuped-centered-adjustment",stepLabel:"74.4",group:"CUPED adjustment",title:"Centered CUPED adjustment",concept:"CUPED usually centers the covariate so the adjusted outcome remains on the original scale.",objective:"Return outcome - theta * (covariate - covariateMean).",difficulty:"challenge",starterCode:`function centeredCupedOutcome(outcome, covariate, covariateMean, theta) {
  // TODO: apply centered CUPED adjustment.
  return outcome;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('above mean covariate', centeredCupedOutcome(10, 5, 3, 2), 6);
check('at mean covariate', centeredCupedOutcome(10, 3, 3, 2), 10);
check('below mean covariate', centeredCupedOutcome(10, 1, 3, 2), 14);

return results;`,hints:["First center the covariate: covariate - covariateMean.","Then subtract theta times the centered covariate.","return outcome - theta * (covariate - covariateMean);"],solution:`function centeredCupedOutcome(outcome, covariate, covariateMean, theta) {
  return outcome - theta * (covariate - covariateMean);
}`,explanation:"Centering preserves the average scale while reducing variance from predictable pre-period differences."},{id:"propensity-inverse-weight",stepLabel:"75.1",group:"Propensity score weighting",title:"Inverse propensity weight",concept:"Propensity weighting upweights units that were unlikely to receive their observed assignment.",objective:"Return 1 / propensity.",difficulty:"warmup",starterCode:`function inversePropensityWeight(propensity) {
  // TODO: return inverse propensity weight.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('propensity half', inversePropensityWeight(0.5), 2);
check('propensity quarter', inversePropensityWeight(0.25), 4);
check('propensity one', inversePropensityWeight(1), 1);

return results;`,hints:["Inverse means reciprocal.","Use 1 / propensity.","return 1 / propensity;"],solution:`function inversePropensityWeight(propensity) {
  return 1 / propensity;
}`,explanation:"Inverse propensity weights compensate for unequal assignment probabilities."},{id:"propensity-observed-weight",stepLabel:"75.2",group:"Propensity score weighting",title:"Observed assignment weight",concept:"Treated units use 1 / p, control units use 1 / (1 - p).",objective:"Return the inverse probability of the observed assignment.",difficulty:"core",starterCode:`function observedAssignmentWeight(treated, propensity) {
  // TODO: return treated or control inverse probability weight.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('treated p half', observedAssignmentWeight(true, 0.5), 2);
check('control p half', observedAssignmentWeight(false, 0.5), 2);
check('control p 0.2', observedAssignmentWeight(false, 0.2), 1.25);

return results;`,hints:["If treated, use 1 / propensity.","If control, use 1 / (1 - propensity).","return treated ? 1 / propensity : 1 / (1 - propensity);"],solution:`function observedAssignmentWeight(treated, propensity) {
  return treated ? 1 / propensity : 1 / (1 - propensity);
}`,explanation:"Observed-assignment weights make underrepresented assignment paths count more."},{id:"propensity-weighted-outcome",stepLabel:"75.3",group:"Propensity score weighting",title:"Weighted outcome",concept:"Weighted estimators multiply each outcome by its inverse-propensity weight.",objective:"Return outcome * weight.",difficulty:"warmup",starterCode:`function weightedOutcome(outcome, weight) {
  // TODO: return weighted outcome.
  return outcome;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('double outcome', weightedOutcome(10, 2), 20);
check('zero outcome', weightedOutcome(0, 5), 0);
check('fractional weight', weightedOutcome(10, 0.5), 5);

return results;`,hints:["Weighted outcome is a product.","Multiply outcome by weight.","return outcome * weight;"],solution:`function weightedOutcome(outcome, weight) {
  return outcome * weight;
}`,explanation:"Weighting changes how much each observed unit contributes to the estimator."},{id:"propensity-weighted-mean",stepLabel:"75.4",group:"Propensity score weighting",title:"Weighted mean",concept:"A weighted mean divides weighted outcome sum by total weight.",objective:"Return sum(outcome * weight) / sum(weight).",difficulty:"challenge",starterCode:`function weightedMean(outcomes, weights) {
  let weightedTotal = 0;
  let weightTotal = 0;

  for (let i = 0; i < outcomes.length; i++) {
    weightedTotal += outcomes[i] * weights[i];
    weightTotal += weights[i];
  }

  // TODO: return weighted mean.
  return 0;
}`,testCode:`const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('equal weights', weightedMean([10, 20], [1, 1]), 15);
check('heavier first', weightedMean([10, 20], [3, 1]), 12.5);
check('one value', weightedMean([7], [10]), 7);

return results;`,hints:["Both totals are already computed.","Weighted mean is weightedTotal / weightTotal.","return weightedTotal / weightTotal;"],solution:`function weightedMean(outcomes, weights) {
  let weightedTotal = 0;
  let weightTotal = 0;

  for (let i = 0; i < outcomes.length; i++) {
    weightedTotal += outcomes[i] * weights[i];
    weightTotal += weights[i];
  }

  return weightedTotal / weightTotal;
}`,explanation:"Propensity weighting estimates group means after correcting for assignment imbalance."},{id:"dag-has-edge",stepLabel:"76.1",group:"DAG adjustment-set checks",title:"Check DAG edge",concept:"A DAG encodes causal assumptions as directed edges.",objective:"Return true when an edge exists from fromNode to toNode.",difficulty:"warmup",starterCode:`function hasEdge(edges, fromNode, toNode) {
  // TODO: return whether edges contains [fromNode, toNode].
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const edges = [['X', 'Y'], ['Z', 'X']];

check('edge exists', hasEdge(edges, 'X', 'Y'), true);
check('reverse edge missing', hasEdge(edges, 'Y', 'X'), false);
check('different edge missing', hasEdge(edges, 'Z', 'Y'), false);

return results;`,hints:["Loop through edge pairs.","Check edge[0] and edge[1].","if (edges[i][0] === fromNode && edges[i][1] === toNode) return true;"],solution:`function hasEdge(edges, fromNode, toNode) {
  for (let i = 0; i < edges.length; i++) {
    if (edges[i][0] === fromNode && edges[i][1] === toNode) return true;
  }

  return false;
}`,explanation:"DAG logic starts with knowing which direct causal arrows are present."},{id:"dag-is-parent",stepLabel:"76.2",group:"DAG adjustment-set checks",title:"Parent node check",concept:"A parent of a node has a directed edge into that node.",objective:"Return true when candidate -> node exists.",difficulty:"core",starterCode:`function isParent(edges, candidate, node) {
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    // TODO: return true if candidate points into node.
  }

  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const edges = [['Z', 'X'], ['X', 'Y'], ['W', 'Y']];

check('Z parent of X', isParent(edges, 'Z', 'X'), true);
check('W parent of Y', isParent(edges, 'W', 'Y'), true);
check('Y not parent of X', isParent(edges, 'Y', 'X'), false);

return results;`,hints:["A parent edge is candidate -> node.","Check edge[0] and edge[1].","if (edge[0] === candidate && edge[1] === node) return true;"],solution:`function isParent(edges, candidate, node) {
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    if (edge[0] === candidate && edge[1] === node) return true;
  }

  return false;
}`,explanation:"Parents are direct causes in the graph, according to the DAG assumptions."},{id:"dag-backdoor-candidate",stepLabel:"76.3",group:"DAG adjustment-set checks",title:"Backdoor candidate",concept:"A common confounder is a variable that points into both treatment and outcome.",objective:"Return true when z is parent of both treatment and outcome.",difficulty:"challenge",starterCode:`function isParent(edges, candidate, node) {
  return edges.some((edge) => edge[0] === candidate && edge[1] === node);
}

function isCommonCause(edges, z, treatment, outcome) {
  // TODO: return whether z points into treatment and outcome.
  return false;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const edges = [['Z', 'X'], ['Z', 'Y'], ['X', 'Y'], ['W', 'X']];

check('Z common cause', isCommonCause(edges, 'Z', 'X', 'Y'), true);
check('W not common cause', isCommonCause(edges, 'W', 'X', 'Y'), false);
check('X not common cause of itself and Y', isCommonCause(edges, 'X', 'X', 'Y'), false);

return results;`,hints:["Use the isParent helper twice.","z must point into both treatment and outcome.","return isParent(edges, z, treatment) && isParent(edges, z, outcome);"],solution:`function isParent(edges, candidate, node) {
  return edges.some((edge) => edge[0] === candidate && edge[1] === node);
}

function isCommonCause(edges, z, treatment, outcome) {
  return isParent(edges, z, treatment) && isParent(edges, z, outcome);
}`,explanation:"Common causes are typical variables to consider adjusting for in backdoor paths."},{id:"dag-adjustment-set-covers-confounders",stepLabel:"76.4",group:"DAG adjustment-set checks",title:"Adjustment set covers confounders",concept:"A basic adjustment check asks whether all known confounders are included.",objective:"Return true when every confounder is in adjustmentSet.",difficulty:"core",starterCode:`function coversConfounders(adjustmentSet, confounders) {
  for (let i = 0; i < confounders.length; i++) {
    // TODO: return false if a confounder is missing.
  }

  return true;
}`,testCode:`const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('covers all', coversConfounders(['Z', 'W'], ['Z', 'W']), true);
check('missing one', coversConfounders(['Z'], ['Z', 'W']), false);
check('no confounders', coversConfounders([], []), true);

return results;`,hints:["Use adjustmentSet.includes(confounders[i]).","If one is missing, return false.","if (!adjustmentSet.includes(confounders[i])) return false;"],solution:`function coversConfounders(adjustmentSet, confounders) {
  for (let i = 0; i < confounders.length; i++) {
    if (!adjustmentSet.includes(confounders[i])) return false;
  }

  return true;
}`,explanation:"This toy check is not full d-separation, but it reinforces the adjustment-set idea."}],f=[...e,...t,...n,...a,...r,...i,...o];export{f as ALGEBRA_CODE_LABS,k as ALGEBRA_CODE_LAB_GROUPS_BY_LESSON,x as getAlgebraCodeLabsForLesson};
