export const PROBABILITY_CODE_LABS = [
  // --- probability-distributions ---
  {
    id: 'dist-value-bernoulli',
    stepLabel: '52.1',
    group: 'Distribution eval',
    title: 'Bernoulli branch',
    concept: 'A dispatch function can evaluate multiple distributions.',
    objective: 'For kind=bernoulli return p or 1-p based on k.',
    difficulty: 'warmup',
    starterCode: `function distValue(kind, k, p, x, mu, sigma) {
  // TODO: implement bernoulli branch
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('bern k1', distValue('bernoulli', 1, 0.7, 0, 0, 1), 0.7);
check('bern k0', distValue('bernoulli', 0, 0.7, 0, 0, 1), 0.3);
return results;`,
    hints: ['if (kind === "bernoulli") return k === 1 ? p : 1 - p;'],
    solution: `function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  return 0;
}`,
    explanation: 'Branching by distribution family keeps one small API for learners.',
  },
  {
    id: 'dist-value-gaussian-coeff',
    stepLabel: '52.2',
    group: 'Distribution eval',
    title: 'Gaussian coefficient',
    concept: 'Normal PDF includes a scale coefficient term.',
    objective: 'Compute coeff = 1 / (sigma * sqrt(2*pi)).',
    difficulty: 'warmup',
    starterCode: `function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    // TODO: coefficient term
    const coeff = 0;
    return coeff;
  }
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('coeff sigma1', distValue('gaussian', 0, 0, 0, 0, 1), 0.398942);
return results;`,
    hints: ['const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));'],
    solution: `function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    return coeff;
  }
  return 0;
}`,
    explanation: 'Coefficient controls density scale as variance changes.',
  },
  {
    id: 'dist-value-gaussian-pdf',
    stepLabel: '52.3',
    group: 'Distribution eval',
    title: 'Gaussian full PDF',
    concept: 'Normal density multiplies coefficient and exponential term.',
    objective: 'Return full Gaussian PDF when kind=gaussian.',
    difficulty: 'core',
    starterCode: `function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    // TODO: include exponent term
    return coeff;
  }
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('std normal at 1', distValue('gaussian', 0, 0, 1, 0, 1), 0.24197);
return results;`,
    hints: ['const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)); return coeff * expTerm;'],
    solution: `function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return coeff * expTerm;
  }
  return 0;
}`,
    explanation: 'Exponent controls decay as x moves away from mean.',
  },
  {
    id: 'dist-value-dispatch',
    stepLabel: '52.4',
    group: 'Distribution eval',
    title: 'Distribution dispatch fallback',
    concept: 'Unknown distribution kinds should fail safely.',
    objective: 'Return 0 for unsupported kind values.',
    difficulty: 'core',
    starterCode: `function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return coeff * expTerm;
  }
  // TODO: fallback for unsupported kind
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('unknown kind', distValue('poisson', 0, 0, 0, 0, 1), 0);
return results;`,
    hints: ['return 0;'],
    solution: `function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return coeff * expTerm;
  }
  return 0;
}`,
    explanation: 'Safe defaults prevent NaN propagation in teaching code.',
  },
  // --- conditional-probability ---
  {
    id: 'cond-chain-pab',
    stepLabel: '53.1',
    group: 'Conditional probability chain',
    title: 'Compute P(A|B)',
    concept: 'Conditional probability starts from P(A and B) / P(B).',
    objective: 'Compute pAGivenB from pAAndB and pB.',
    difficulty: 'warmup',
    starterCode: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  // TODO: compute pAGivenB, guard pB=0
  const pAGivenB = 0;
  return pAGivenB;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('p(a|b)', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.4);
return results;`,
    hints: ['const pAGivenB = pB === 0 ? 0 : pAAndB / pB;'],
    solution: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAGivenB = pB === 0 ? 0 : pAAndB / pB;
  return pAGivenB;
}`,
    explanation: 'This checks inverse conditioning on the same joint event.',
  },
  {
    id: 'cond-chain-joint-ab',
    stepLabel: '53.2',
    group: 'Conditional probability chain',
    title: 'Rebuild joint P(A and B)',
    concept: 'Chain rule forward direction gives P(A and B) = P(A) P(B|A).',
    objective: 'Compute pAB from pA and pBGivenA.',
    difficulty: 'warmup',
    starterCode: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  // TODO: compute pAB from pA and pBGivenA
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('p(a,b)', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.2);
return results;`,
    hints: ['return pA * pBGivenA;'],
    solution: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  return pA * pBGivenA;
}`,
    explanation: 'Forward chain rule and inverse conditional should agree.',
  },
  {
    id: 'cond-chain-joint-abc',
    stepLabel: '53.3',
    group: 'Conditional probability chain',
    title: 'Chain to three events',
    concept: 'P(A,B,C) extends with P(C|A,B).',
    objective: 'Compute pABC = pA * pBGivenA * pCGivenAB.',
    difficulty: 'core',
    starterCode: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAB = pA * pBGivenA;
  // TODO: multiply by pCGivenAB
  return pAB;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('p(a,b,c)', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.06);
return results;`,
    hints: ['return pAB * pCGivenAB;'],
    solution: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAB = pA * pBGivenA;
  return pAB * pCGivenAB;
}`,
    explanation: 'Sequential factors build higher-order joint probabilities.',
  },
  {
    id: 'cond-chain-report',
    stepLabel: '53.4',
    group: 'Conditional probability chain',
    title: 'Combined conditional chain report',
    concept: 'A small report can expose conditional and joint quantities together.',
    objective: 'Return pAGivenB + pABC in one scalar check.',
    difficulty: 'core',
    starterCode: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAGivenB = pB === 0 ? 0 : pAAndB / pB;
  const pABC = pA * pBGivenA * pCGivenAB;
  // TODO: return combined scalar pAGivenB + pABC
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('combined', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.46);
return results;`,
    hints: ['return pAGivenB + pABC;'],
    solution: `function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAGivenB = pB === 0 ? 0 : pAAndB / pB;
  const pABC = pA * pBGivenA * pCGivenAB;
  return pAGivenB + pABC;
}`,
    explanation: 'The final step validates both conditional and chain computations.',
  },
  // --- bayes-rule-ml ---
  {
    id: 'bayes-posterior-numerator',
    stepLabel: '54.1',
    group: 'Bayes posterior',
    title: 'Posterior numerator',
    concept: 'Bayes numerator is prior times likelihood under hypothesis.',
    objective: 'Compute num = prior * likH.',
    difficulty: 'warmup',
    starterCode: `function bayesPosterior(prior, likH, likNotH) {
  // TODO: numerator
  const num = 0;
  return num;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('numerator', bayesPosterior(0.2, 0.9, 0.1), 0.18);
return results;`,
    hints: ['const num = prior * likH;'],
    solution: `function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  return num;
}`,
    explanation: 'Numerator captures evidence mass aligned with the hypothesis.',
  },
  {
    id: 'bayes-posterior-denominator',
    stepLabel: '54.2',
    group: 'Bayes posterior',
    title: 'Posterior denominator',
    concept: 'Evidence sums hypothesis and alternative paths.',
    objective: 'Compute den = num + (1-prior) * likNotH.',
    difficulty: 'warmup',
    starterCode: `function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  // TODO: denominator
  const den = 0;
  return den;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('denominator', bayesPosterior(0.2, 0.9, 0.1), 0.26);
return results;`,
    hints: ['const den = num + (1 - prior) * likNotH;'],
    solution: `function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  return den;
}`,
    explanation: 'Evidence normalizes posterior into a valid probability.',
  },
  {
    id: 'bayes-posterior-ratio',
    stepLabel: '54.3',
    group: 'Bayes posterior',
    title: 'Posterior ratio',
    concept: 'Posterior is numerator divided by denominator.',
    objective: 'Return num / den with zero guard.',
    difficulty: 'core',
    starterCode: `function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  // TODO: return ratio with den=0 guard
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('posterior', bayesPosterior(0.01, 0.99, 0.05), 0.166667);
return results;`,
    hints: ['if (den === 0) return 0; return num / den;'],
    solution: `function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  if (den === 0) return 0;
  return num / den;
}`,
    explanation: 'Ratio form is the canonical Bayes update.',
  },
  {
    id: 'bayes-posterior-full',
    stepLabel: '54.4',
    group: 'Bayes posterior',
    title: 'Stable posterior update',
    concept: 'Robust code treats prior bounds 0 and 1 correctly.',
    objective: 'Preserve correct posterior at prior extremes.',
    difficulty: 'core',
    starterCode: `function bayesPosterior(prior, likH, likNotH) {
  // TODO: prior==0 => 0, prior==1 => 1
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  if (den === 0) return 0;
  return num / den;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('prior 0', bayesPosterior(0, 0.9, 0.1), 0);
check('prior 1', bayesPosterior(1, 0.9, 0.1), 1);
return results;`,
    hints: ['if (prior === 0) return 0; if (prior === 1) return 1;'],
    solution: `function bayesPosterior(prior, likH, likNotH) {
  if (prior === 0) return 0;
  if (prior === 1) return 1;
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  if (den === 0) return 0;
  return num / den;
}`,
    explanation: 'Boundary handling avoids unstable behavior in edge-case priors.',
  },
  // --- maximum-likelihood-estimation ---
  {
    id: 'mle-loglik-guard',
    stepLabel: '55.1',
    group: 'MLE log-likelihood',
    title: 'Probability bounds guard',
    concept: 'Bernoulli log-likelihood is undefined for p outside (0,1).',
    objective: 'Return -Infinity for invalid p.',
    difficulty: 'warmup',
    starterCode: `function mleLogLik(data, p) {
  // TODO: guard invalid p
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  const passed = (Number.isNaN(expected) && Number.isNaN(actual)) || Object.is(actual, expected);
  results.push({ name, actual, expected, passed });
}
check('invalid low', mleLogLik([1, 0], 0), -Infinity);
return results;`,
    hints: ['if (p <= 0 || p >= 1) return -Infinity;'],
    solution: `function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  return 0;
}`,
    explanation: 'Bounds guard prevents taking log(0).',
  },
  {
    id: 'mle-loglik-term',
    stepLabel: '55.2',
    group: 'MLE log-likelihood',
    title: 'Per-sample log-likelihood term',
    concept: 'Each Bernoulli sample contributes k*log(p)+(1-k)*log(1-p).',
    objective: 'Accumulate per-sample log term.',
    difficulty: 'warmup',
    starterCode: `function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    // TODO: accumulate term
  }
  return logLik;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('three samples', mleLogLik([1, 0, 1], 0.5), -2.07944);
return results;`,
    hints: ['logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);'],
    solution: `function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}`,
    explanation: 'Summed log terms turn product likelihood into additive objective.',
  },
  {
    id: 'mle-loglik-empty',
    stepLabel: '55.3',
    group: 'MLE log-likelihood',
    title: 'Empty dataset baseline',
    concept: 'Empty data has neutral log-likelihood of 0.',
    objective: 'Return 0 when data is empty and p valid.',
    difficulty: 'core',
    starterCode: `function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  // TODO: handle empty data
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty data', mleLogLik([], 0.5), 0);
return results;`,
    hints: ['if (data.length === 0) return 0;'],
    solution: `function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  if (data.length === 0) return 0;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}`,
    explanation: 'Neutral objective on empty samples helps deterministic testing.',
  },
  {
    id: 'mle-loglik-full',
    stepLabel: '55.4',
    group: 'MLE log-likelihood',
    title: 'Complete MLE log-likelihood',
    concept: 'Final utility combines domain checks and per-sample accumulation.',
    objective: 'Return full Bernoulli log-likelihood value.',
    difficulty: 'core',
    starterCode: `function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  if (data.length === 0) return 0;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    // TODO: add bernoulli log term
  }
  return logLik;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('biased p', mleLogLik([1, 0, 1], 0.8), -2.055725);
return results;`,
    hints: ['same formula as previous step'],
    solution: `function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  if (data.length === 0) return 0;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}`,
    explanation: 'This objective is directly optimized in Bernoulli MLE fitting.',
  },
  // --- expected-value-variance ---
  {
    id: 'moments-ev',
    stepLabel: '56.1',
    group: 'Moments from PMF',
    title: 'Expected value from PMF',
    concept: 'First moment is weighted sum of outcomes.',
    objective: 'Compute ev = sum(outcomes[i] * probs[i]).',
    difficulty: 'warmup',
    starterCode: `function momentStats(outcomes, probs) {
  let ev = 0;
  // TODO: weighted sum for EV
  return { ev, variance: 0 };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('ev die', momentStats([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]).ev, 3.5);
return results;`,
    hints: ['ev += outcomes[i] * probs[i];'],
    solution: `function momentStats(outcomes, probs) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  return { ev, variance: 0 };
}`,
    explanation: 'Expected value is the center of mass of discrete outcomes.',
  },
  {
    id: 'moments-var',
    stepLabel: '56.2',
    group: 'Moments from PMF',
    title: 'Variance from PMF',
    concept: 'Second central moment captures spread around expected value.',
    objective: 'Compute variance = sum((x-ev)^2 * p).',
    difficulty: 'warmup',
    starterCode: `function momentStats(outcomes, probs) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  // TODO: weighted squared deviations
  return { ev, variance };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('var die', momentStats([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]).variance, 2.916667);
return results;`,
    hints: ['variance += Math.pow(outcomes[i] - ev, 2) * probs[i];'],
    solution: `function momentStats(outcomes, probs) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}`,
    explanation: 'Variance quantifies uncertainty around the mean outcome.',
  },
  {
    id: 'moments-prob-sum',
    stepLabel: '56.3',
    group: 'Moments from PMF',
    title: 'PMF validity check',
    concept: 'A PMF should sum to 1 for valid moment interpretation.',
    objective: 'Return NaN variance when probability sum differs from 1 by >1e-6.',
    difficulty: 'core',
    starterCode: `function momentStats(outcomes, probs) {
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  // TODO: guard invalid probability sums
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  const passed = Number.isNaN(actual) && Number.isNaN(expected);
  results.push({ name, actual, expected, passed });
}
check('invalid pmf', momentStats([1, 2], [0.2, 0.2]).variance, NaN);
return results;`,
    hints: ['if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };'],
    solution: `function momentStats(outcomes, probs) {
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}`,
    explanation: 'Input validation catches malformed PMFs early.',
  },
  {
    id: 'moments-full',
    stepLabel: '56.4',
    group: 'Moments from PMF',
    title: 'Complete moment stats',
    concept: 'Final helper returns first and second moments robustly.',
    objective: 'Return zeros for empty arrays.',
    difficulty: 'core',
    starterCode: `function momentStats(outcomes, probs) {
  // TODO: handle empty arrays
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('empty arrays', momentStats([], []), { ev: 0, variance: 0 });
return results;`,
    hints: ['if (outcomes.length === 0 || probs.length === 0) return { ev: 0, variance: 0 };'],
    solution: `function momentStats(outcomes, probs) {
  if (outcomes.length === 0 || probs.length === 0) return { ev: 0, variance: 0 };
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}`,
    explanation: 'A compact utility for PMF-derived moments across lessons.',
  },
  // --- spearman-correlation ---
  {
    id: 'spearman-rank-build',
    stepLabel: '57.1',
    group: 'Spearman correlation',
    title: 'Build rank array with ties',
    concept: 'Spearman starts by ranking each array with average tie ranks.',
    objective: 'Implement rankData with tie averaging.',
    difficulty: 'warmup',
    starterCode: `function spearmanRho(x, y) {
  function rankData(arr) {
    const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
    const ranks = Array(arr.length);
    let i = 0;
    while (i < sorted.length) {
      let j = i;
      while (j < sorted.length && sorted[j].val === sorted[i].val) j++;
      // TODO: assign average tie rank to k in [i, j)
      i = j;
    }
    return ranks;
  }
  return rankData(x);
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('rank ties', spearmanRho([10, 20, 20, 30], [1, 2, 3, 4]), [1, 2.5, 2.5, 4]);
return results;`,
    hints: ['const avgRank = (i + 1 + j) / 2; for (let k = i; k < j; k++) ranks[sorted[k].idx] = avgRank;'],
    solution: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  return rankData(x);
}`,
    explanation: 'Tie-aware ranking avoids arbitrary ordering artifacts.',
  },
  {
    id: 'spearman-rank-means',
    stepLabel: '57.2',
    group: 'Spearman correlation',
    title: 'Rank means',
    concept: 'Pearson-on-ranks needs means of both rank vectors.',
    objective: 'Compute meanX and meanY from rank arrays.',
    difficulty: 'warmup',
    starterCode: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  // TODO: compute means
  const meanX = 0;
  const meanY = 0;
  return [meanX, meanY];
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('rank means', spearmanRho([1, 2, 3], [3, 2, 1]), [2, 2]);
return results;`,
    hints: ['const meanX = rx.reduce((s, v) => s + v, 0) / n;'],
    solution: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  const meanX = rx.reduce((s, v) => s + v, 0) / n;
  const meanY = ry.reduce((s, v) => s + v, 0) / n;
  return [meanX, meanY];
}`,
    explanation: 'Centering ranks prepares covariance-style numerator computation.',
  },
  {
    id: 'spearman-covariances',
    stepLabel: '57.3',
    group: 'Spearman correlation',
    title: 'Covariance and denominators',
    concept: 'Spearman is Pearson over ranks: numerator and two denominator sums.',
    objective: 'Accumulate num, denX, denY from centered ranks.',
    difficulty: 'core',
    starterCode: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  const meanX = rx.reduce((s, v) => s + v, 0) / n;
  const meanY = ry.reduce((s, v) => s + v, 0) / n;
  let num = 0, denX = 0, denY = 0;
  // TODO: accumulate num, denX, denY
  return [num, denX, denY];
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-9) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('perfect positive sums', spearmanRho([1, 2, 3], [1, 2, 3]), [2, 2, 2]);
return results;`,
    hints: ['dx = rx[i]-meanX; dy = ry[i]-meanY; num += dx*dy; denX += dx*dx; denY += dy*dy;'],
    solution: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  const meanX = rx.reduce((s, v) => s + v, 0) / n;
  const meanY = ry.reduce((s, v) => s + v, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = rx[i] - meanX;
    const dy = ry[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  return [num, denX, denY];
}`,
    explanation: 'These three sums define Pearson correlation on ranked values.',
  },
  {
    id: 'spearman-rho-main',
    stepLabel: '57.4',
    group: 'Spearman correlation',
    title: 'Spearman rho from rank Pearson',
    concept: 'Rho is num / sqrt(denX * denY), with zero-denominator guard.',
    objective: 'Return rho value.',
    difficulty: 'core',
    starterCode: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  const meanX = rx.reduce((s, v) => s + v, 0) / n;
  const meanY = ry.reduce((s, v) => s + v, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = rx[i] - meanX;
    const dy = ry[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  // TODO: return rho with zero guards
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('positive', spearmanRho([10, 20, 30, 40], [5, 15, 25, 35]), 1);
check('negative', spearmanRho([10, 20, 30, 40], [35, 25, 15, 5]), -1);
return results;`,
    hints: ['if (denX === 0 || denY === 0) return 0; return num / Math.sqrt(denX * denY);'],
    solution: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  const meanX = rx.reduce((s, v) => s + v, 0) / n;
  const meanY = ry.reduce((s, v) => s + v, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = rx[i] - meanX;
    const dy = ry[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}`,
    explanation: 'Spearman captures monotonic association even beyond strict linearity.',
  },
  {
    id: 'spearman-rho-edge',
    stepLabel: '57.5',
    group: 'Spearman correlation',
    title: 'Constant-array edge case',
    concept: 'If one rank vector is constant, denominator is zero and rho should be 0.',
    objective: 'Verify zero-denominator behavior.',
    difficulty: 'core',
    starterCode: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  const meanX = rx.reduce((s, v) => s + v, 0) / n;
  const meanY = ry.reduce((s, v) => s + v, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = rx[i] - meanX;
    const dy = ry[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  if (denX === 0 || denY === 0) {
    // TODO: return 0
    return 1;
  }
  return num / Math.sqrt(denX * denY);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('constant x', spearmanRho([1, 1, 1], [1, 2, 3]), 0);
return results;`,
    hints: ['return 0;'],
    solution: `function spearmanRho(x, y) {
  function rankData(arr) {
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
  const rx = rankData(x);
  const ry = rankData(y);
  const n = rx.length;
  const meanX = rx.reduce((s, v) => s + v, 0) / n;
  const meanY = ry.reduce((s, v) => s + v, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = rx[i] - meanX;
    const dy = ry[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}`,
    explanation: 'Constant vectors carry no rank variance, so correlation is undefined and set to 0.',
  },
];
