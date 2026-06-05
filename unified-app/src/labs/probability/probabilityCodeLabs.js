export const PROBABILITY_CODE_LABS = [
  // --- probability-distributions ---
  {
    id: 'dist-bernoulli-pmf',
    stepLabel: '52.1',
    group: 'Bernoulli mean',
    title: 'Bernoulli PMF',
    concept: 'A Bernoulli distribution models a single trial with success probability p. PMF: P(X = k) = p if k=1 else 1-p.',
    objective: 'Compute Bernoulli PMF value for outcome k (0 or 1).',
    difficulty: 'warmup',
    starterCode: `function bernoulliPmf(k, p) {
  // TODO: return p if k is 1, otherwise 1 - p
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('success k=1', bernoulliPmf(1, 0.75), 0.75);
check('failure k=0', bernoulliPmf(0, 0.75), 0.25);
return results;`,
    hints: [
      'Use conditional logic or ternary operator: k === 1 ? p : 1 - p.',
    ],
    solution: `function bernoulliPmf(k, p) {
  return k === 1 ? p : 1 - p;
}`,
    explanation: 'The Bernoulli distribution is the simplest discrete distribution, modeling binary outcomes (e.g. coin flips).',
  },
  {
    id: 'dist-gaussian-pdf',
    stepLabel: '52.2',
    group: 'PDF eval',
    title: 'Gaussian PDF',
    concept: 'The Normal (Gaussian) probability density function is: f(x) = (1 / (sigma * sqrt(2 * pi))) * exp(-0.5 * ((x - mu) / sigma)^2).',
    objective: 'Evaluate the 1D Gaussian density at point x.',
    difficulty: 'core',
    starterCode: `function gaussianPdf(x, mu, sigma) {
  // TODO: compute the Gaussian PDF formula
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('standard normal at mean', gaussianPdf(0, 0, 1), 0.398942);
check('normal at 1 std', gaussianPdf(1, 0, 1), 0.24197);
return results;`,
    hints: [
      'pi is Math.PI. exp is Math.exp.',
      'Coefficient: 1 / (sigma * Math.sqrt(2 * Math.PI)).',
      'Exponent: -0.5 * Math.pow((x - mu) / sigma, 2).',
      'Multiply coefficient by Math.exp(exponent).',
    ],
    solution: `function gaussianPdf(x, mu, sigma) {
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return coeff * Math.exp(exponent);
}`,
    explanation: 'The Gaussian PDF gives the relative likelihood that a continuous random variable takes a value near x.',
  },

  // --- conditional-probability ---
  {
    id: 'cond-prob-formula',
    stepLabel: '53.1',
    group: 'P(A|B) formula',
    title: 'Conditional Probability Formula',
    concept: 'Conditional probability is P(A|B) = P(A and B) / P(B). It measures likelihood of event A given B has occurred.',
    objective: 'Compute P(A|B) given joint probability P(A and B) and prior probability P(B).',
    difficulty: 'warmup',
    starterCode: `function conditionalProbability(pAAndB, pB) {
  // TODO: compute P(A|B). Handle division by zero.
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('simple conditional', conditionalProbability(0.2, 0.5), 0.4);
check('zero conditioning event', conditionalProbability(0, 0), 0);
return results;`,
    hints: [
      'If P(B) is 0, return 0.',
      'Otherwise return pAAndB / pB.',
    ],
    solution: `function conditionalProbability(pAAndB, pB) {
  if (pB === 0) return 0;
  return pAAndB / pB;
}`,
    explanation: 'Conditional probability restricts the sample space to the conditioning event B.',
  },
  {
    id: 'cond-chain-rule',
    stepLabel: '53.2',
    group: 'Chain rule',
    title: 'Probability Chain Rule',
    concept: 'The chain rule computes joint probability of multiple events: P(A and B and C) = P(A) * P(B|A) * P(C | A and B).',
    objective: 'Compute P(A and B and C) using the conditional chain rule probabilities.',
    difficulty: 'core',
    starterCode: `function jointThreeEvents(pA, pBGivenA, pCGivenAAndB) {
  // TODO: return P(A and B and C)
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('chain joint', jointThreeEvents(0.5, 0.4, 0.3), 0.06);
return results;`,
    hints: [
      'Multiply all three probabilities together.',
      'return pA * pBGivenA * pCGivenAAndB;',
    ],
    solution: `function jointThreeEvents(pA, pBGivenA, pCGivenAAndB) {
  return pA * pBGivenA * pCGivenAAndB;
}`,
    explanation: 'The chain rule allows joint probability calculation by breaking it into sequential conditional probabilities.',
  },

  // --- bayes-rule-ml ---
  {
    id: 'bayes-numerator-calc',
    stepLabel: '54.1',
    group: 'Numerator',
    title: 'Bayes Rule Numerator',
    concept: 'Bayes rule computes posterior probability. The numerator is likelihood times prior: P(B|A) * P(A).',
    objective: 'Compute the Bayes numerator for a hypothesis.',
    difficulty: 'warmup',
    starterCode: `function bayesNumerator(likelihood, prior) {
  // TODO: compute likelihood * prior
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('simple numerator', bayesNumerator(0.9, 0.01), 0.009);
return results;`,
    hints: [
      'Multiply likelihood by prior.',
    ],
    solution: `function bayesNumerator(likelihood, prior) {
  return likelihood * prior;
}`,
    explanation: 'The numerator ranks potential hypotheses before normalizing them by evidence.',
  },
  {
    id: 'bayes-posterior-calc',
    stepLabel: '54.2',
    group: 'Posterior normalize',
    title: 'Posterior Probability',
    concept: 'Bayes rule updates a hypothesis prior: P(H|E) = P(E|H)*P(H) / (P(E|H)*P(H) + P(E|~H)*P(~H)).',
    objective: 'Compute the posterior probability P(H|E).',
    difficulty: 'core',
    starterCode: `function bayesPosterior(prior, likelihoodCorrect, likelihoodIncorrect) {
  // prior is P(H)
  // likelihoodCorrect is P(E|H)
  // likelihoodIncorrect is P(E|~H)
  // TODO: compute P(H|E)
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('rare disease test', bayesPosterior(0.01, 0.99, 0.05), 0.166667);
return results;`,
    hints: [
      'Calculate numerator: prior * likelihoodCorrect.',
      'Calculate negative prior: 1 - prior.',
      'Calculate denominator: numerator + negativePrior * likelihoodIncorrect.',
      'Return numerator / denominator.',
    ],
    solution: `function bayesPosterior(prior, likelihoodCorrect, likelihoodIncorrect) {
  const num = prior * likelihoodCorrect;
  const den = num + (1 - prior) * likelihoodIncorrect;
  if (den === 0) return 0;
  return num / den;
}`,
    explanation: 'Bayes rule combines prior belief with empirical evidence to output posterior confidence.',
  },

  // --- maximum-likelihood-estimation ---
  {
    id: 'mle-gauss-mean',
    stepLabel: '55.1',
    group: 'Gaussian mean MLE',
    title: 'Gaussian Mean MLE',
    concept: 'The Maximum Likelihood Estimator for a Gaussian mean is simply the sample average of observations.',
    objective: 'Compute the MLE estimation of mu for data samples.',
    difficulty: 'warmup',
    starterCode: `function mleGaussianMean(data) {
  if (data.length === 0) return 0;
  // TODO: return sample mean
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mean of list', mleGaussianMean([10, 20, 30, 40]), 25);
return results;`,
    hints: [
      'Sum all data points and divide by data.length.',
    ],
    solution: `function mleGaussianMean(data) {
  if (data.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
}`,
    explanation: 'The sample average maximizes the probability of observing the given Gaussian dataset.',
  },
  {
    id: 'mle-bern-loglik',
    stepLabel: '55.2',
    group: 'Per-sample log',
    title: 'Bernoulli Log-Likelihood',
    concept: 'To optimize parameters, MLE maximizes log-likelihood: log L(p) = sum(k_i * log(p) + (1 - k_i) * log(1 - p)).',
    objective: 'Evaluate the Bernoulli log-likelihood given data array (values 0 or 1) and parameter p.',
    difficulty: 'core',
    starterCode: `function bernoulliLogLikelihood(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  
  // TODO: Loop through data and sum log likelihoods.
  // Use Math.log for natural logarithm.
  
  return logLik;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('loglik simple p=0.5', bernoulliLogLikelihood([1, 0, 1], 0.5), -2.07944);
check('loglik biased p=0.8', bernoulliLogLikelihood([1, 0, 1], 0.8), -2.055725);
return results;`,
    hints: [
      'Loop through elements. Let k = data[i].',
      'For each element, add: k * Math.log(p) + (1 - k) * Math.log(1 - p).',
    ],
    solution: `function bernoulliLogLikelihood(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}`,
    explanation: 'Maximizing log-likelihood is mathematically simpler than maximizing raw likelihood due to products turning into sums.',
  },

  // --- expected-value-variance ---
  {
    id: 'ev-discrete-calc',
    stepLabel: '56.1',
    group: 'Weighted sum',
    title: 'Discrete Expected Value',
    concept: 'Expected Value is the probability-weighted average outcome: E[X] = sum(x_i * p_i).',
    objective: 'Compute the expected value given outcomes and their probabilities.',
    difficulty: 'warmup',
    starterCode: `function expectedValue(outcomes, probabilities) {
  let ev = 0;
  
  // TODO: compute sum of outcomes[i] * probabilities[i]
  
  return ev;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('die expectation', expectedValue([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]), 3.5);
return results;`,
    hints: [
      'Loop i from 0 to outcomes.length-1.',
      'Multiply outcomes[i] by probabilities[i] and add to ev.',
    ],
    solution: `function expectedValue(outcomes, probabilities) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) {
    ev += outcomes[i] * probabilities[i];
  }
  return ev;
}`,
    explanation: 'Expected value represents the long-term average outcome of repeating trials.',
  },
  {
    id: 'var-discrete-calc',
    stepLabel: '56.2',
    group: 'Variance formula',
    title: 'Discrete Variance',
    concept: 'Variance measures the spread of outcomes around the expected value: Var(X) = sum((x_i - E[X])^2 * p_i).',
    objective: 'Compute variance of discrete outcomes given pre-calculated expected value.',
    difficulty: 'core',
    starterCode: `function discreteVariance(outcomes, probabilities, ev) {
  let variance = 0;
  
  // TODO: compute sum of (outcomes[i] - ev)^2 * probabilities[i]
  
  return variance;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('die variance', discreteVariance([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6], 3.5), 2.916667);
return results;`,
    hints: [
      'Loop i from 0 to outcomes.length-1.',
      'Compute squared difference: Math.pow(outcomes[i] - ev, 2).',
      'Multiply by probabilities[i] and accumulate.',
    ],
    solution: `function discreteVariance(outcomes, probabilities, ev) {
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) {
    variance += Math.pow(outcomes[i] - ev, 2) * probabilities[i];
  }
  return variance;
}`,
    explanation: 'Variance gauges the uncertainty or volatility of a random variable\'s outcomes.',
  },

  // --- spearman-correlation ---
  {
    id: 'spearman-rank-ties',
    stepLabel: '57.1',
    group: 'Rank with ties',
    title: 'Rank Data with Ties',
    concept: 'Spearman correlation uses ranks. Tied values receive the average of the ranks they would have otherwise spanned.',
    objective: 'Assign fractional ranks to elements in an array, handling ties correctly.',
    difficulty: 'core',
    starterCode: `function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) {
      j++;
    }
    // TODO: assign the average rank of the tied group to ranks[sorted[k].idx]
    // The tied range is index i to j - 1. 1-based ranks span from i + 1 to j.
    // Average rank is (sum of integers from i+1 to j) / count = (i + 1 + j) / 2.
    const avgRank = 0;
    
    i = j;
  }
  return ranks;
}`,
    testCode: `const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('ties ranking', rankData([10, 20, 20, 30]), [1, 2.5, 2.5, 4]);
check('no ties ranking', rankData([5, 15, 10]), [1, 3, 2]);
return results;`,
    hints: [
      'Average rank of elements from i (0-indexed) to j-1 is (i + 1 + j) / 2.',
      'Loop k from i to j-1 and set ranks[sorted[k].idx] = avgRank.',
    ],
    solution: `function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) {
      j++;
    }
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[sorted[k].idx] = avgRank;
    }
    i = j;
  }
  return ranks;
}`,
    explanation: 'Fractional ranking maintains continuous values for identical data attributes, preventing arbitrary skew in correlations.',
  },
  {
    id: 'spearman-rho-calc',
    stepLabel: '57.2',
    group: 'Pearson on ranks',
    title: 'Spearman Correlation Coefficient',
    concept: 'Spearman\'s rank correlation evaluates monotonic relationships. It is calculated by running Pearson correlation on ranked values.',
    objective: 'Implement Spearman rho calculation using Pearson correlation on rank-transformed inputs.',
    difficulty: 'challenge',
    starterCode: `function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[sorted[k].idx] = avgRank;
    i = j;
  }
  return ranks;
}

function spearmanRho(x, y) {
  const rankX = rankData(x);
  const rankY = rankData(y);
  const n = rankX.length;
  
  let sumX = 0, sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += rankX[i];
    sumY += rankY[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  let num = 0;
  let denX = 0;
  let denY = 0;
  
  // TODO: Compute covariance numerator and standard deviations denominators.
  // Formula: num = sum((rx - meanX) * (ry - meanY)), denX = sum((rx - meanX)^2), denY = sum((ry - meanY)^2)
  
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('monotonic positive correlation', spearmanRho([10, 20, 30, 40], [5, 15, 25, 35]), 1.0);
check('monotonic negative correlation', spearmanRho([10, 20, 30, 40], [35, 25, 15, 5]), -1.0);
check('weak correlation', spearmanRho([10, 20, 30, 40], [10, 30, 20, 40]), 0.8);
return results;`,
    hints: [
      'Loop i from 0 to n-1.',
      'Compute dx = rankX[i] - meanX, and dy = rankY[i] - meanY.',
      'Accumulate dx * dy in num, dx * dx in denX, and dy * dy in denY.',
    ],
    solution: `function rankData(arr) {
  const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = Array(arr.length);
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].val === sorted[i].val) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[sorted[k].idx] = avgRank;
    i = j;
  }
  return ranks;
}

function spearmanRho(x, y) {
  const rankX = rankData(x);
  const rankY = rankData(y);
  const n = rankX.length;
  
  let sumX = 0, sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += rankX[i];
    sumY += rankY[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  let num = 0;
  let denX = 0;
  let denY = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = rankX[i] - meanX;
    const dy = rankY[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}`,
    explanation: 'Spearman correlation detects monotonic non-linear relationships, making it less sensitive to outliers than Pearson correlation.',
  }
];
