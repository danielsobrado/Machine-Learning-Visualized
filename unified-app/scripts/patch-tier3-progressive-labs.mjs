/**
 * Expands Tier 3 two-step labs to 4-6 progressive single-function skeletons.
 * Run: node unified-app/scripts/patch-tier3-progressive-labs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function replaceBetween(filePath, startMarker, endMarker, newContent) {
  const fullPath = path.join(ROOT, filePath);
  const src = fs.readFileSync(fullPath, 'utf8');
  const startIdx = src.indexOf(startMarker);
  const endIdx = src.indexOf(endMarker, startIdx);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in ${filePath}: ${startMarker}`);
  }
  fs.writeFileSync(fullPath, src.slice(0, startIdx) + newContent + src.slice(endIdx));
  console.log(`Patched ${filePath}`);
}

function patchMappings() {
  const filePath = path.join(ROOT, 'src/labs/lesson-code/lessonCodeLabMappings.js');
  let src = fs.readFileSync(filePath, 'utf8');
  const replacements = [
    ["  'recommender-systems-ranking-track': { source: 'eval', groups: ['Dot score', 'Pairwise hinge'] },",
      "  'recommender-systems-ranking-track': { source: 'eval', groups: ['Ranking training step'] },"],
    ["  'model-interpretability': { source: 'eval', groups: ['Marginal contrib', 'Sum to delta'] },",
      "  'model-interpretability': { source: 'eval', groups: ['Shapley attribution check'] },"],
    ["  'model-fairness': { source: 'eval', groups: ['Group rate', 'Parity gap'] },",
      "  'model-fairness': { source: 'eval', groups: ['Fairness audit'] },"],
    ["  'uncertainty-estimation': { source: 'eval', groups: ['Predictive entropy', 'Variance across samples'] },",
      "  'uncertainty-estimation': { source: 'eval', groups: ['Uncertainty report'] },"],
    ["  'ml-security-robustness-track': { source: 'eval', groups: ['Gradient sign step', 'Perturbation clip'] },",
      "  'ml-security-robustness-track': { source: 'eval', groups: ['Adversarial perturbation'] },"],
    ["  'cross-validation': { source: 'core', groups: ['Fold size', 'Train/val masks'] },",
      "  'cross-validation': { source: 'core', groups: ['K-fold split'] },"],
    ["  'data-leakage-deep-dive': { source: 'core', groups: ['Label in features', 'Preprocessing leak'] },",
      "  'data-leakage-deep-dive': { source: 'core', groups: ['Leak-safe scaling'] },"],
    ["  'tree-ensembles': { source: 'core', groups: ['Gini', 'Bagging average'] },",
      "  'tree-ensembles': { source: 'core', groups: ['Ensemble predict'] },"],
    ["  'time-series-forecasting-track': { source: 'core', groups: ['Window slice', 'One-step forecast'] },",
      "  'time-series-forecasting-track': { source: 'core', groups: ['Forecast smooth'] },"],
    ["  'data-engineering-for-ml-track': { source: 'core', groups: ['Median impute', 'Dedup key'] },",
      "  'data-engineering-for-ml-track': { source: 'core', groups: ['Pipeline clean'] },"],
    ["  'probability-distributions': { source: 'prob', groups: ['Bernoulli mean', 'PDF eval'] },",
      "  'probability-distributions': { source: 'prob', groups: ['Distribution eval'] },"],
    ["  'conditional-probability': { source: 'prob', groups: ['P(A|B) formula', 'Chain rule'] },",
      "  'conditional-probability': { source: 'prob', groups: ['Conditional probability chain'] },"],
    ["  'bayes-rule-ml': { source: 'prob', groups: ['Numerator', 'Posterior normalize'] },",
      "  'bayes-rule-ml': { source: 'prob', groups: ['Bayes posterior'] },"],
    ["  'maximum-likelihood-estimation': { source: 'prob', groups: ['Gaussian mean MLE', 'Per-sample log'] },",
      "  'maximum-likelihood-estimation': { source: 'prob', groups: ['MLE log-likelihood'] },"],
    ["  'expected-value-variance': { source: 'prob', groups: ['Weighted sum', 'Variance formula'] },",
      "  'expected-value-variance': { source: 'prob', groups: ['Moments from PMF'] },"],
    ["  'spearman-correlation': { source: 'prob', groups: ['Rank with ties', 'Pearson on ranks'] },",
      "  'spearman-correlation': { source: 'prob', groups: ['Spearman correlation'] },"],
    ["  'conv2d': { source: 'nn', groups: ['Output size formula', 'One patch dot product'] },",
      "  'conv2d': { source: 'nn', groups: ['Conv2D step'] },"],
    ["  'dapo-reasoning-rl': { source: 'rl', groups: ['Reward clip', 'Decoupled baseline'] },",
      "  'dapo-reasoning-rl': { source: 'rl', groups: ['DAPO advantage'] },"],
    ["  'markov-chains': { source: 'rl', groups: ['One-step multiply', 'Stationary'] },",
      "  'markov-chains': { source: 'rl', groups: ['Markov chain step'] },"],
    ["  'pagerank': { source: 'algo', groups: ['Out-link normalize', 'Damping teleport'] },",
      "  'pagerank': { source: 'algo', groups: ['PageRank iteration'] },"],
    ["  'unet-vs-dit': { source: 'diffusion', groups: ['skip concat', 'patch tokens'] },",
      "  'unet-vs-dit': { source: 'diffusion', groups: ['U-Net vs DiT step'] },"],
    ["  'flow-matching': { source: 'diffusion', groups: ['linear interp'] },",
      "  'flow-matching': { source: 'diffusion', groups: ['Flow matching step'] },"],
  ];
  for (const [from, to] of replacements) {
    if (!src.includes(from)) throw new Error(`Mapping not found: ${from}`);
    src = src.replace(from, to);
  }
  fs.writeFileSync(filePath, src);
  console.log('Patched lessonCodeLabMappings.js');
}

const RANKING = `  {
    id: 'ranking-loss-diff',
    stepLabel: '12.1',
    group: 'Ranking training step',
    title: 'Positive-negative score gap',
    concept: 'Pairwise ranking compares a positive item score against a negative item score.',
    objective: 'Compute scoreDiff = dot(user, itemPos) - dot(user, itemNeg).',
    difficulty: 'warmup',
    starterCode: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  // TODO: compute scoreDiff
  const scoreDiff = 0;
  return scoreDiff;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('score diff', rankingLoss([1, 2], [2, 0], [1, 1], 1), 1);
return results;\`,
    hints: ['const scoreDiff = scorePos - scoreNeg;'],
    solution: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  return scoreDiff;
}\`,
    explanation: 'Ranking starts from relative score ordering, not absolute calibration.',
  },
  {
    id: 'ranking-loss-margin-gap',
    stepLabel: '12.2',
    group: 'Ranking training step',
    title: 'Margin violation term',
    concept: 'Hinge ranking loss penalizes when score gap is below margin.',
    objective: 'Compute violation = margin - scoreDiff.',
    difficulty: 'warmup',
    starterCode: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  // TODO: compute violation = margin - scoreDiff
  const violation = 0;
  return violation;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('violation term', rankingLoss([1, 2], [2, 0], [1, 1], 1), 0);
return results;\`,
    hints: ['const violation = margin - scoreDiff;'],
    solution: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  const violation = margin - scoreDiff;
  return violation;
}\`,
    explanation: 'Margin encodes how much better positives should score than negatives.',
  },
  {
    id: 'ranking-loss-hinge',
    stepLabel: '12.3',
    group: 'Ranking training step',
    title: 'Hinge clipping',
    concept: 'Only positive violations contribute to loss; satisfied pairs contribute zero.',
    objective: 'Return Math.max(0, violation).',
    difficulty: 'core',
    starterCode: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  const violation = margin - scoreDiff;
  // TODO: apply hinge clipping
  return violation;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('zero when satisfied', rankingLoss([1, 2], [2, 0], [1, 1], 1), 0);
check('positive when violated', rankingLoss([1, 1], [1, 0], [1, 1], 1), 1);
return results;\`,
    hints: ['return Math.max(0, violation);'],
    solution: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  const violation = margin - scoreDiff;
  return Math.max(0, violation);
}\`,
    explanation: 'Hinge clipping prevents over-optimizing already-correct pairs.',
  },
  {
    id: 'ranking-loss-training-step',
    stepLabel: '12.4',
    group: 'Ranking training step',
    title: 'Full ranking loss step',
    concept: 'One pairwise training step computes a scalar hinge loss from embeddings.',
    objective: 'Guard empty vectors and return pairwise hinge loss.',
    difficulty: 'core',
    starterCode: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  // TODO: return 0 when user is empty
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  return Math.max(0, margin - scoreDiff);
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty user', rankingLoss([], [], [], 1), 0);
check('non-empty pair', rankingLoss([1, 1], [1, 0], [1, 1], 1), 1);
return results;\`,
    hints: ['if (user.length === 0) return 0;'],
    solution: \`function rankingLoss(user, itemPos, itemNeg, margin) {
  if (user.length === 0) return 0;
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  return Math.max(0, margin - scoreDiff);
}\`,
    explanation: 'The final utility is directly usable in mini-batch pairwise ranking.',
  },
`;

const INTERPRETABILITY = `  {
    id: 'shapley-sum-accumulate',
    stepLabel: '48.1',
    group: 'Shapley attribution check',
    title: 'Attribution sum accumulation',
    concept: 'Shapley efficiency compares total attribution mass against prediction delta.',
    objective: 'Accumulate all attribution values into sum.',
    difficulty: 'warmup',
    starterCode: \`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    // TODO: add attributions[i] into sum
    sum += 0;
  }
  return sum;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sum attributions', verifyShapleySum([0.2, -0.1, 0.4], 0, 0), 0.5);
return results;\`,
    hints: ['sum += attributions[i];'],
    solution: \`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  return sum;
}\`,
    explanation: 'Summation is the bridge between local attributions and global delta.',
  },
  {
    id: 'shapley-sum-delta',
    stepLabel: '48.2',
    group: 'Shapley attribution check',
    title: 'Prediction-baseline delta',
    concept: 'The target quantity is prediction minus baseline expected value.',
    objective: 'Compute delta = prediction - baseline.',
    difficulty: 'warmup',
    starterCode: \`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  // TODO: compute prediction delta
  const delta = 0;
  return delta;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('delta value', verifyShapleySum([0.2], 0.9, 0.4), 0.5);
return results;\`,
    hints: ['const delta = prediction - baseline;'],
    solution: \`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return delta;
}\`,
    explanation: 'Delta is the amount Shapley values must exactly explain.',
  },
  {
    id: 'shapley-sum-tolerance',
    stepLabel: '48.3',
    group: 'Shapley attribution check',
    title: 'Tolerance comparison',
    concept: 'Floating-point noise requires near-equality rather than exact equality.',
    objective: 'Return Math.abs(sum - delta) < 1e-5.',
    difficulty: 'core',
    starterCode: \`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  // TODO: compare sum and delta with tolerance
  return false;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('matches within tol', verifyShapleySum([0.2, 0.3], 1.0, 0.5), true);
check('mismatch', verifyShapleySum([0.2, 0.2], 1.0, 0.5), false);
return results;\`,
    hints: ['return Math.abs(sum - delta) < 1e-5;'],
    solution: \`function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}\`,
    explanation: 'Tolerance checks preserve numeric stability in attribution audits.',
  },
  {
    id: 'shapley-sum-check',
    stepLabel: '48.4',
    group: 'Shapley attribution check',
    title: 'Full Shapley sum verification',
    concept: 'Efficiency passes when attribution sum equals prediction shift from baseline.',
    objective: 'Return false for empty attributions unless delta is zero.',
    difficulty: 'core',
    starterCode: \`function verifyShapleySum(attributions, prediction, baseline) {
  // TODO: handle empty attributions case
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty exact zero', verifyShapleySum([], 1.0, 1.0), true);
check('empty non-zero', verifyShapleySum([], 1.0, 0.8), false);
return results;\`,
    hints: ['if (attributions.length === 0) return Math.abs(prediction - baseline) < 1e-5;'],
    solution: \`function verifyShapleySum(attributions, prediction, baseline) {
  if (attributions.length === 0) return Math.abs(prediction - baseline) < 1e-5;
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}\`,
    explanation: 'Edge-case handling keeps audits deterministic for sparse explanations.',
  },
`;

const FAIRNESS = `  {
    id: 'fairness-rate-a',
    stepLabel: '49.1',
    group: 'Fairness audit',
    title: 'Group A selection rate',
    concept: 'Demographic parity compares subgroup positive prediction rates.',
    objective: 'Compute positive rate for groupA.',
    difficulty: 'warmup',
    starterCode: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  let countA = 0;
  let posA = 0;
  for (let i = 0; i < predictions.length; i++) {
    // TODO: update countA and posA for groupA
  }
  return countA === 0 ? 0 : posA / countA;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const preds = [1, 0, 1, 1];
const grps = ['A', 'A', 'B', 'B'];
check('rate A', demographicParityGap(preds, grps, 'A', 'B'), 0.5);
return results;\`,
    hints: ['if (groups[i] === groupA) { countA++; if (predictions[i] === 1) posA++; }'],
    solution: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  let countA = 0;
  let posA = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (groups[i] === groupA) {
      countA++;
      if (predictions[i] === 1) posA++;
    }
  }
  return countA === 0 ? 0 : posA / countA;
}\`,
    explanation: 'Each subgroup rate is computed independently before parity comparison.',
  },
  {
    id: 'fairness-rate-b',
    stepLabel: '49.2',
    group: 'Fairness audit',
    title: 'Group B selection rate',
    concept: 'Parity requires both groups to be measured with the same metric.',
    objective: 'Compute positive rate for groupB.',
    difficulty: 'warmup',
    starterCode: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  let countB = 0;
  let posB = 0;
  for (let i = 0; i < predictions.length; i++) {
    // TODO: update countB and posB for groupB
  }
  return countB === 0 ? 0 : posB / countB;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const preds = [1, 0, 1, 1];
const grps = ['A', 'A', 'B', 'B'];
check('rate B', demographicParityGap(preds, grps, 'A', 'B'), 1);
return results;\`,
    hints: ['if (groups[i] === groupB) { countB++; if (predictions[i] === 1) posB++; }'],
    solution: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  let countB = 0;
  let posB = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (groups[i] === groupB) {
      countB++;
      if (predictions[i] === 1) posB++;
    }
  }
  return countB === 0 ? 0 : posB / countB;
}\`,
    explanation: 'Symmetry in measurement avoids biased fairness diagnostics.',
  },
  {
    id: 'fairness-gap-abs',
    stepLabel: '49.3',
    group: 'Fairness audit',
    title: 'Absolute parity gap',
    concept: 'Demographic parity gap is the absolute difference between subgroup rates.',
    objective: 'Return Math.abs(rateA - rateB).',
    difficulty: 'core',
    starterCode: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  // TODO: absolute difference
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const preds = [1, 0, 1, 1];
const grps = ['A', 'A', 'B', 'B'];
check('gap', demographicParityGap(preds, grps, 'A', 'B'), 0.5);
return results;\`,
    hints: ['return Math.abs(rateA - rateB);'],
    solution: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  return Math.abs(rateA - rateB);
}\`,
    explanation: 'Absolute gap captures disparity magnitude independent of direction.',
  },
  {
    id: 'fairness-audit-gap',
    stepLabel: '49.4',
    group: 'Fairness audit',
    title: 'Full fairness audit function',
    concept: 'A complete parity audit handles missing groups and reports stable gaps.',
    objective: 'Return 0 when both groups are absent, otherwise parity gap.',
    difficulty: 'core',
    starterCode: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  // TODO: handle empty predictions edge case
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  return Math.abs(rateA - rateB);
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty list', demographicParityGap([], [], 'A', 'B'), 0);
check('non-empty', demographicParityGap([1, 0], ['A', 'B'], 'A', 'B'), 1);
return results;\`,
    hints: ['if (predictions.length === 0) return 0;'],
    solution: \`function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  if (predictions.length === 0) return 0;
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  return Math.abs(rateA - rateB);
}\`,
    explanation: 'Robust auditing pipelines must handle sparse or empty slices safely.',
  },
`;

const UNCERTAINTY = `  {
    id: 'uncertainty-entropy-binary',
    stepLabel: '50.1',
    group: 'Uncertainty report',
    title: 'Binary entropy core',
    concept: 'Binary entropy measures uncertainty from class probability p.',
    objective: 'Compute binary entropy H(p).',
    difficulty: 'warmup',
    starterCode: \`function uncertaintyReport(p, mcSamples) {
  // TODO: compute entropy, handling p = 0 or 1
  const entropy = 0;
  return { entropy, variance: 0 };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('entropy 0.5', uncertaintyReport(0.5, [1]).entropy, 1);
return results;\`,
    hints: ['entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));'],
    solution: \`function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  return { entropy, variance: 0 };
}\`,
    explanation: 'Entropy peaks at balanced predictions and drops at certainty extremes.',
  },
  {
    id: 'uncertainty-mean-samples',
    stepLabel: '50.2',
    group: 'Uncertainty report',
    title: 'MC sample mean',
    concept: 'Variance requires the sample mean as its center.',
    objective: 'Compute mean of mcSamples.',
    difficulty: 'warmup',
    starterCode: \`function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  let mean = 0;
  // TODO: compute mean from mcSamples
  return { entropy, variance: mean };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sample mean', uncertaintyReport(0.5, [0.7, 0.8, 0.9]).variance, 0.8);
return results;\`,
    hints: ['mean = mcSamples.reduce((s, x) => s + x, 0) / mcSamples.length;'],
    solution: \`function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const mean = mcSamples.reduce((s, x) => s + x, 0) / mcSamples.length;
  return { entropy, variance: mean };
}\`,
    explanation: 'Mean centers fluctuation measurements across stochastic forward passes.',
  },
  {
    id: 'uncertainty-mc-variance',
    stepLabel: '50.3',
    group: 'Uncertainty report',
    title: 'MC variance estimate',
    concept: 'Epistemic uncertainty can be approximated by sample variance over dropout passes.',
    objective: 'Compute sample variance var/(n-1).',
    difficulty: 'core',
    starterCode: \`function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    // TODO: accumulate squared deviation
    varSum += 0;
  }
  return { entropy, variance: varSum / (n - 1) };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('variance sample', uncertaintyReport(0.5, [0.8, 0.7, 0.9]).variance, 0.01);
return results;\`,
    hints: ['varSum += Math.pow(mcSamples[i] - mean, 2);'],
    solution: \`function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(mcSamples[i] - mean, 2);
  }
  return { entropy, variance: varSum / (n - 1) };
}\`,
    explanation: 'Higher variance indicates more disagreement across stochastic predictions.',
  },
  {
    id: 'uncertainty-report-full',
    stepLabel: '50.4',
    group: 'Uncertainty report',
    title: 'Complete uncertainty report',
    concept: 'A full uncertainty report combines aleatoric entropy and epistemic variance.',
    objective: 'Handle empty mcSamples and return both metrics.',
    difficulty: 'core',
    starterCode: \`function uncertaintyReport(p, mcSamples) {
  // TODO: if mcSamples is empty return variance 0
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) varSum += Math.pow(mcSamples[i] - mean, 2);
  return { entropy, variance: varSum / (n - 1) };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty samples variance', uncertaintyReport(0.4, []).variance, 0);
check('entropy finite', Number.isFinite(uncertaintyReport(0.4, []).entropy), true);
return results;\`,
    hints: ['if (mcSamples.length === 0) return { entropy, variance: 0 };'],
    solution: \`function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  if (mcSamples.length === 0) return { entropy, variance: 0 };
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) varSum += Math.pow(mcSamples[i] - mean, 2);
  return { entropy, variance: varSum / (n - 1) };
}\`,
    explanation: 'Both uncertainty channels are useful for risk-aware model decisions.',
  },
`;

const SECURITY = `  {
    id: 'adv-perturb-sign',
    stepLabel: '51.1',
    group: 'Adversarial perturbation',
    title: 'Gradient sign direction',
    concept: 'FGSM uses the sign of gradient to choose perturbation direction.',
    objective: 'Compute sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0).',
    difficulty: 'warmup',
    starterCode: \`function adversarialPerturb(x, grad, epsilon) {
  // TODO: compute sign from grad
  const sign = 0;
  return sign;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive sign', adversarialPerturb(0.5, 2, 0.1), 1);
check('negative sign', adversarialPerturb(0.5, -3, 0.1), -1);
return results;\`,
    hints: ['const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);'],
    solution: \`function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  return sign;
}\`,
    explanation: 'Sign-only direction makes perturbation robust to gradient magnitude scale.',
  },
  {
    id: 'adv-perturb-step',
    stepLabel: '51.2',
    group: 'Adversarial perturbation',
    title: 'FGSM step value',
    concept: 'The perturbation adds epsilon times sign of gradient to input.',
    objective: 'Compute xAdv = x + epsilon * sign.',
    difficulty: 'warmup',
    starterCode: \`function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  // TODO: compute perturbed value
  return x;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('fgsm step', adversarialPerturb(0.5, -3, 0.1), 0.4);
return results;\`,
    hints: ['return x + epsilon * sign;'],
    solution: \`function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  return x + epsilon * sign;
}\`,
    explanation: 'A single FGSM step is a first-order attack approximation.',
  },
  {
    id: 'adv-perturb-clip',
    stepLabel: '51.3',
    group: 'Adversarial perturbation',
    title: 'L-infinity clipping',
    concept: 'Adversarial perturbation is clipped to stay within epsilon-ball around original input.',
    objective: 'Clip xAdv to [x - epsilon, x + epsilon].',
    difficulty: 'core',
    starterCode: \`function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  // TODO: clip xAdv
  return xAdv;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('clipped exact', adversarialPerturb(0.5, 10, 0.05), 0.55);
return results;\`,
    hints: ['return Math.max(minVal, Math.min(maxVal, xAdv));'],
    solution: \`function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}\`,
    explanation: 'Projection keeps the perturbation bounded and comparable across samples.',
  },
  {
    id: 'adv-perturb-full',
    stepLabel: '51.4',
    group: 'Adversarial perturbation',
    title: 'Complete perturbation function',
    concept: 'Production attacks should tolerate epsilon=0 as a no-op.',
    objective: 'Return x when epsilon is 0, otherwise FGSM clipped perturbation.',
    difficulty: 'core',
    starterCode: \`function adversarialPerturb(x, grad, epsilon) {
  // TODO: handle zero epsilon as no-op
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('epsilon zero', adversarialPerturb(0.5, 10, 0), 0.5);
check('epsilon nonzero', adversarialPerturb(0.5, -10, 0.1), 0.4);
return results;\`,
    hints: ['if (epsilon === 0) return x;'],
    solution: \`function adversarialPerturb(x, grad, epsilon) {
  if (epsilon === 0) return x;
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}\`,
    explanation: 'No-op handling makes the API predictable in ablation settings.',
  },
`;

const CROSS_VALIDATION = `  // --- cross-validation ---
  {
    id: 'kfold-split-bounds',
    stepLabel: '40.1',
    group: 'K-fold split',
    title: 'Validation fold bounds',
    concept: 'K-fold split needs start/end bounds for the selected validation fold.',
    objective: 'Compute valStart and valEnd for foldIdx.',
    difficulty: 'warmup',
    starterCode: \`function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  // TODO: compute valStart by summing previous fold sizes
  let valStart = 0;
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  return { trainIndices: [], valIndices: [valStart, valEnd] };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('fold1 start', kFoldSplit(10, 3, 1).valIndices[0], 4);
check('fold1 end', kFoldSplit(10, 3, 1).valIndices[1], 7);
return results;\`,
    hints: ['for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);'],
    solution: \`function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  return { trainIndices: [], valIndices: [valStart, valEnd] };
}\`,
    explanation: 'Fold boundaries define which indices move into validation.',
  },
  {
    id: 'kfold-split-val-mask',
    stepLabel: '40.2',
    group: 'K-fold split',
    title: 'Validation index mask',
    concept: 'Indices in [valStart, valEnd) belong to validation.',
    objective: 'Fill valIndices array from computed bounds.',
    difficulty: 'warmup',
    starterCode: \`function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const valIndices = [];
  // TODO: push validation indices
  return { trainIndices: [], valIndices };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('val fold', kFoldSplit(5, 5, 2).valIndices, [2]);
return results;\`,
    hints: ['for (let i = valStart; i < valEnd; i++) valIndices.push(i);'],
    solution: \`function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const valIndices = [];
  for (let i = valStart; i < valEnd; i++) valIndices.push(i);
  return { trainIndices: [], valIndices };
}\`,
    explanation: 'Validation mask isolates exactly one fold per run.',
  },
  {
    id: 'kfold-split-train-mask',
    stepLabel: '40.3',
    group: 'K-fold split',
    title: 'Training index mask',
    concept: 'Training indices are all positions not in validation fold.',
    objective: 'Fill trainIndices with non-validation indices.',
    difficulty: 'core',
    starterCode: \`function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else {
      // TODO: push to trainIndices
    }
  }
  return { trainIndices, valIndices };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('train fold', kFoldSplit(5, 5, 2).trainIndices, [0, 1, 3, 4]);
return results;\`,
    hints: ['trainIndices.push(i);'],
    solution: \`function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else trainIndices.push(i);
  }
  return { trainIndices, valIndices };
}\`,
    explanation: 'Train/validation disjointness is key for honest model evaluation.',
  },
  {
    id: 'kfold-split-full',
    stepLabel: '40.4',
    group: 'K-fold split',
    title: 'Complete k-fold split',
    concept: 'A reusable kFoldSplit utility returns both train and validation index sets.',
    objective: 'Handle n=0 by returning empty arrays.',
    difficulty: 'core',
    starterCode: \`function kFoldSplit(n, k, foldIdx) {
  // TODO: return empty arrays when n is 0
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else trainIndices.push(i);
  }
  return { trainIndices, valIndices };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('n zero', kFoldSplit(0, 3, 0), { trainIndices: [], valIndices: [] });
check('normal', kFoldSplit(5, 5, 2), { trainIndices: [0, 1, 3, 4], valIndices: [2] });
return results;\`,
    hints: ['if (n === 0) return { trainIndices: [], valIndices: [] };'],
    solution: \`function kFoldSplit(n, k, foldIdx) {
  if (n === 0) return { trainIndices: [], valIndices: [] };
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else trainIndices.push(i);
  }
  return { trainIndices, valIndices };
}\`,
    explanation: 'This utility can be reused by any cross-validation training loop.',
  },
`;

const LEAKAGE = `  // --- data-leakage-deep-dive ---
  {
    id: 'leak-safe-mean',
    stepLabel: '41.1',
    group: 'Leak-safe scaling',
    title: 'Train-only mean',
    concept: 'Leak-safe scaling fits summary stats only on training split.',
    objective: 'Compute mean from trainX only.',
    difficulty: 'warmup',
    starterCode: \`function scaleSplitsCorrectly(trainX, valX) {
  // TODO: compute train mean
  const mean = 0;
  return { scaledTrain: [], scaledVal: [], mean, std: 1 };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mean', scaleSplitsCorrectly([10, 20, 30], [40]).mean, 20);
return results;\`,
    hints: ['const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;'],
    solution: \`function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  return { scaledTrain: [], scaledVal: [], mean, std: 1 };
}\`,
    explanation: 'Validation statistics must not leak into fit-time preprocessing.',
  },
  {
    id: 'leak-safe-std',
    stepLabel: '41.2',
    group: 'Leak-safe scaling',
    title: 'Train-only standard deviation',
    concept: 'Scaling variance is also fit from training data only.',
    objective: 'Compute std = sqrt(mean squared deviation), fallback to 1 when zero.',
    difficulty: 'warmup',
    starterCode: \`function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) {
    // TODO: accumulate squared deviations
    varSum += 0;
  }
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  return { scaledTrain: [], scaledVal: [], mean, std };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('std', scaleSplitsCorrectly([10, 20, 30], [40]).std, 8.1649658);
return results;\`,
    hints: ['varSum += Math.pow(trainX[i] - mean, 2);'],
    solution: \`function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) {
    varSum += Math.pow(trainX[i] - mean, 2);
  }
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  return { scaledTrain: [], scaledVal: [], mean, std };
}\`,
    explanation: 'Stable denominator prevents divide-by-zero in degenerate features.',
  },
  {
    id: 'leak-safe-scale-train',
    stepLabel: '41.3',
    group: 'Leak-safe scaling',
    title: 'Scale training split',
    concept: 'Train features are standardized with train-fit mean/std.',
    objective: 'Compute scaledTrain values.',
    difficulty: 'core',
    starterCode: \`function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  // TODO: scale trainX
  const scaledTrain = [];
  return { scaledTrain, scaledVal: [], mean, std };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxEqual(actual, expected) });
}
check('scaled train', scaleSplitsCorrectly([10, 20, 30], [40]).scaledTrain, [-1.224745, 0, 1.224745]);
return results;\`,
    hints: ['const scaledTrain = trainX.map(x => (x - mean) / std);'],
    solution: \`function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  const scaledTrain = trainX.map(x => (x - mean) / std);
  return { scaledTrain, scaledVal: [], mean, std };
}\`,
    explanation: 'Training data establishes the transformation basis for all splits.',
  },
  {
    id: 'leak-safe-scale-val',
    stepLabel: '41.4',
    group: 'Leak-safe scaling',
    title: 'Scale validation split',
    concept: 'Validation must use train-fit parameters, not its own statistics.',
    objective: 'Return scaledTrain and scaledVal with shared train mean/std.',
    difficulty: 'core',
    starterCode: \`function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  const scaledTrain = trainX.map(x => (x - mean) / std);
  // TODO: scale valX using same mean/std
  const scaledVal = [];
  return { scaledTrain, scaledVal, mean, std };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = scaleSplitsCorrectly([10, 20, 30], [40]);
check('scaled val', out.scaledVal[0], 2.44949);
return results;\`,
    hints: ['const scaledVal = valX.map(x => (x - mean) / std);'],
    solution: \`function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  const scaledTrain = trainX.map(x => (x - mean) / std);
  const scaledVal = valX.map(x => (x - mean) / std);
  return { scaledTrain, scaledVal, mean, std };
}\`,
    explanation: 'Using shared parameters avoids accidental validation leakage.',
  },
`;

const ENSEMBLES = `  // --- tree-ensembles ---
  {
    id: 'ensemble-gini',
    stepLabel: '45.1',
    group: 'Ensemble predict',
    title: 'Node gini impurity',
    concept: 'Tree splits use gini impurity to quantify class mixing.',
    objective: 'Compute gini from class counts.',
    difficulty: 'warmup',
    starterCode: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return { gini: 0, avg: [] };
  // TODO: compute gini
  const gini = 0;
  return { gini, avg: [] };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('gini 50-50', ensembleStep([[0.5, 0.5]], [5, 5]).gini, 0.5);
return results;\`,
    hints: ['gini = 1 - sum((count/total)^2)'],
    solution: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return { gini: 0, avg: [] };
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = counts[i] / total;
    sq += p * p;
  }
  const gini = 1 - sq;
  return { gini, avg: [] };
}\`,
    explanation: 'Impurity gives local tree quality while bagging aggregates globally.',
  },
  {
    id: 'ensemble-avg-sum',
    stepLabel: '45.2',
    group: 'Ensemble predict',
    title: 'Aggregate tree probabilities',
    concept: 'Bagging averages predicted class probabilities across trees.',
    objective: 'Sum probabilities across trees into avg buffer.',
    difficulty: 'warmup',
    starterCode: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  // TODO: sum tree probabilities into avg
  return { gini, avg };
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-5) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('sum probs', ensembleStep([[0.8, 0.2], [0.6, 0.4]], [1, 1]).avg, [1.4, 0.6]);
return results;\`,
    hints: ['avg[c] += treeProbs[t][c];'],
    solution: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  return { gini, avg };
}\`,
    explanation: 'Summation prepares the ensemble vote before normalization.',
  },
  {
    id: 'ensemble-avg-normalize',
    stepLabel: '45.3',
    group: 'Ensemble predict',
    title: 'Normalize ensemble probabilities',
    concept: 'Final bagging prediction divides summed probabilities by number of trees.',
    objective: 'Normalize avg by numTrees.',
    difficulty: 'core',
    starterCode: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  // TODO: divide avg entries by numTrees when numTrees > 0
  return { gini, avg };
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-5) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('avg probs', ensembleStep([[0.8, 0.2], [0.6, 0.4], [0.7, 0.3]], [1, 1]).avg, [0.7, 0.3]);
return results;\`,
    hints: ['for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;'],
    solution: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  if (numTrees > 0) {
    for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;
  }
  return { gini, avg };
}\`,
    explanation: 'Normalization turns vote totals into probability-like scores.',
  },
  {
    id: 'ensemble-step-full',
    stepLabel: '45.4',
    group: 'Ensemble predict',
    title: 'Full ensemble step',
    concept: 'One helper can report both split impurity and ensemble probability output.',
    objective: 'Return empty avg for empty trees while still computing gini.',
    difficulty: 'core',
    starterCode: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  // TODO: handle empty treeProbs quickly
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  if (numTrees > 0) for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;
  return { gini, avg };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('empty trees', ensembleStep([], [5, 5]), { gini: 0.5, avg: [] });
return results;\`,
    hints: ['if (treeProbs.length === 0) return { gini, avg: [] };'],
    solution: \`function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  if (treeProbs.length === 0) return { gini, avg: [] };
  const numTrees = treeProbs.length;
  const numClasses = treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;
  return { gini, avg };
}\`,
    explanation: 'Unified helpers simplify teaching both trees and ensembles together.',
  },
`;

const FORECAST = `  // --- time-series-forecasting-track ---
  {
    id: 'forecast-smooth-roll',
    stepLabel: '46.1',
    group: 'Forecast smooth',
    title: 'Rolling mean value',
    concept: 'Short windows provide local trend smoothing.',
    objective: 'Compute last rolling mean over window w.',
    difficulty: 'warmup',
    starterCode: \`function forecastSmooth(series, w, alpha) {
  // TODO: compute rolling mean of last window
  let roll = 0;
  return roll;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('rolling mean', forecastSmooth([10, 20, 30, 40], 2, 0.5), 35);
return results;\`,
    hints: ['window is series.slice(series.length - w)'],
    solution: \`function forecastSmooth(series, w, alpha) {
  let sum = 0;
  for (let i = series.length - w; i < series.length; i++) sum += series[i];
  const roll = sum / w;
  return roll;
}\`,
    explanation: 'Rolling mean captures local level without long-term memory.',
  },
  {
    id: 'forecast-smooth-exp',
    stepLabel: '46.2',
    group: 'Forecast smooth',
    title: 'Exponential smoothing value',
    concept: 'Exponential smoothing recursively blends latest sample with previous smooth.',
    objective: 'Compute final exp smoothed value.',
    difficulty: 'warmup',
    starterCode: \`function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let smooth = series[0];
  // TODO: update smooth for i >= 1
  return smooth;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('exp smooth', forecastSmooth([10, 20, 30], 2, 0.5), 22.5);
return results;\`,
    hints: ['smooth = alpha * series[i] + (1 - alpha) * smooth;'],
    solution: \`function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) {
    smooth = alpha * series[i] + (1 - alpha) * smooth;
  }
  return smooth;
}\`,
    explanation: 'Exponential smoothing keeps memory with exponentially decaying weights.',
  },
  {
    id: 'forecast-smooth-blend',
    stepLabel: '46.3',
    group: 'Forecast smooth',
    title: 'Blend rolling and exponential',
    concept: 'Hybrid smoothers can blend local window and exponential estimate.',
    objective: 'Return 0.5 * (roll + smooth).',
    difficulty: 'core',
    starterCode: \`function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let sum = 0;
  for (let i = series.length - w; i < series.length; i++) sum += series[i];
  const roll = sum / w;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  // TODO: blend roll and smooth
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('blended', forecastSmooth([10, 20, 30], 2, 0.5), 23.75);
return results;\`,
    hints: ['return 0.5 * (roll + smooth);'],
    solution: \`function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let sum = 0;
  for (let i = series.length - w; i < series.length; i++) sum += series[i];
  const roll = sum / w;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  return 0.5 * (roll + smooth);
}\`,
    explanation: 'Blending balances reactivity and stability in one-step forecasting.',
  },
  {
    id: 'forecast-smooth-full',
    stepLabel: '46.4',
    group: 'Forecast smooth',
    title: 'Complete smooth forecast',
    concept: 'Final helper should guard invalid window sizes.',
    objective: 'Clamp w into [1, series.length] before computing rolling part.',
    difficulty: 'core',
    starterCode: \`function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  // TODO: clamp w to valid range
  const window = w;
  let sum = 0;
  for (let i = series.length - window; i < series.length; i++) sum += series[i];
  const roll = sum / window;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  return 0.5 * (roll + smooth);
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('window clamp high', forecastSmooth([10, 20, 30], 10, 0.5), 21.25);
return results;\`,
    hints: ['const window = Math.max(1, Math.min(w, series.length));'],
    solution: \`function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  const window = Math.max(1, Math.min(w, series.length));
  let sum = 0;
  for (let i = series.length - window; i < series.length; i++) sum += series[i];
  const roll = sum / window;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  return 0.5 * (roll + smooth);
}\`,
    explanation: 'Window guards avoid invalid indexing in dynamic forecasting pipelines.',
  },
`;

const PIPELINE = `  // --- data-engineering-for-ml-track ---
  {
    id: 'pipeline-clean-impute',
    stepLabel: '47.1',
    group: 'Pipeline clean',
    title: 'Median imputation pass',
    concept: 'Pipeline first imputes missing values using median.',
    objective: 'Replace null/undefined in arr with median of present values.',
    difficulty: 'warmup',
    starterCode: \`function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  // TODO: compute median and impute arr
  const imputed = arr.slice();
  return { imputed, deduped: rows };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('impute', pipelineClean([5, null, 1, 9, 3], [], 'id').imputed, [5, 4, 1, 9, 3]);
return results;\`,
    hints: ['median for even length is average of middle two'],
    solution: \`function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  return { imputed, deduped: rows };
}\`,
    explanation: 'Median imputation is robust against outlier distortion.',
  },
  {
    id: 'pipeline-clean-last-index',
    stepLabel: '47.2',
    group: 'Pipeline clean',
    title: 'Track latest row index per key',
    concept: 'Dedup keeps freshest row for each key.',
    objective: 'Build map of latest index for each key.',
    difficulty: 'warmup',
    starterCode: \`function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  // TODO: fill latest[row[key]] = i
  return { imputed, deduped: Object.keys(latest).length };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const rows = [{ id: 1 }, { id: 2 }, { id: 1 }];
check('latest key count', pipelineClean([1], rows, 'id').deduped, 2);
return results;\`,
    hints: ['for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;'],
    solution: \`function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  return { imputed, deduped: Object.keys(latest).length };
}\`,
    explanation: 'Latest index map enables stable one-pass dedup decisions.',
  },
  {
    id: 'pipeline-clean-dedupe',
    stepLabel: '47.3',
    group: 'Pipeline clean',
    title: 'Keep only latest rows',
    concept: 'Rows whose index matches latest index for key survive dedup.',
    objective: 'Return deduped row list in original order.',
    difficulty: 'core',
    starterCode: \`function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  // TODO: build deduped rows
  const deduped = [];
  return { imputed, deduped };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const rows = [{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }];
check('dedupe rows', pipelineClean([1], rows, 'id').deduped, [{ id: 2, v: 'b' }, { id: 1, v: 'c' }]);
return results;\`,
    hints: ['if (latest[rows[i][key]] === i) deduped.push(rows[i]);'],
    solution: \`function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  const deduped = [];
  for (let i = 0; i < rows.length; i++) {
    if (latest[rows[i][key]] === i) deduped.push(rows[i]);
  }
  return { imputed, deduped };
}\`,
    explanation: 'This preserves the freshest row while keeping stable output ordering.',
  },
  {
    id: 'pipeline-clean-full',
    stepLabel: '47.4',
    group: 'Pipeline clean',
    title: 'Complete pipeline clean step',
    concept: 'Final helper performs imputation and key-based dedup in one call.',
    objective: 'Handle empty arr by leaving imputed array empty.',
    difficulty: 'core',
    starterCode: \`function pipelineClean(arr, rows, key) {
  // TODO: short-circuit empty arr
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  const deduped = [];
  for (let i = 0; i < rows.length; i++) if (latest[rows[i][key]] === i) deduped.push(rows[i]);
  return { imputed, deduped };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const rows = [{ id: 1, v: 'a' }, { id: 1, v: 'b' }];
check('empty arr', pipelineClean([], rows, 'id').imputed, []);
check('dedup still works', pipelineClean([1], rows, 'id').deduped, [{ id: 1, v: 'b' }]);
return results;\`,
    hints: ['if (arr.length === 0) { /* still dedupe rows */ }'],
    solution: \`function pipelineClean(arr, rows, key) {
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  const deduped = [];
  for (let i = 0; i < rows.length; i++) if (latest[rows[i][key]] === i) deduped.push(rows[i]);
  if (arr.length === 0) return { imputed: [], deduped };
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  return { imputed, deduped };
}\`,
    explanation: 'The final pipeline helper composes robust preprocessing primitives.',
  },
`;

const DIST = `  // --- probability-distributions ---
  {
    id: 'dist-value-bernoulli',
    stepLabel: '52.1',
    group: 'Distribution eval',
    title: 'Bernoulli branch',
    concept: 'A dispatch function can evaluate multiple distributions.',
    objective: 'For kind=bernoulli return p or 1-p based on k.',
    difficulty: 'warmup',
    starterCode: \`function distValue(kind, k, p, x, mu, sigma) {
  // TODO: implement bernoulli branch
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('bern k1', distValue('bernoulli', 1, 0.7, 0, 0, 1), 0.7);
check('bern k0', distValue('bernoulli', 0, 0.7, 0, 0, 1), 0.3);
return results;\`,
    hints: ['if (kind === "bernoulli") return k === 1 ? p : 1 - p;'],
    solution: \`function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  return 0;
}\`,
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
    starterCode: \`function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    // TODO: coefficient term
    const coeff = 0;
    return coeff;
  }
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('coeff sigma1', distValue('gaussian', 0, 0, 0, 0, 1), 0.398942);
return results;\`,
    hints: ['const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));'],
    solution: \`function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    return coeff;
  }
  return 0;
}\`,
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
    starterCode: \`function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    // TODO: include exponent term
    return coeff;
  }
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('std normal at 1', distValue('gaussian', 0, 0, 1, 0, 1), 0.24197);
return results;\`,
    hints: ['const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)); return coeff * expTerm;'],
    solution: \`function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return coeff * expTerm;
  }
  return 0;
}\`,
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
    starterCode: \`function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return coeff * expTerm;
  }
  // TODO: fallback for unsupported kind
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('unknown kind', distValue('poisson', 0, 0, 0, 0, 1), 0);
return results;\`,
    hints: ['return 0;'],
    solution: \`function distValue(kind, k, p, x, mu, sigma) {
  if (kind === 'bernoulli') return k === 1 ? p : 1 - p;
  if (kind === 'gaussian') {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expTerm = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    return coeff * expTerm;
  }
  return 0;
}\`,
    explanation: 'Safe defaults prevent NaN propagation in teaching code.',
  },
`;

const CONDITIONAL = `  // --- conditional-probability ---
  {
    id: 'cond-chain-pab',
    stepLabel: '53.1',
    group: 'Conditional probability chain',
    title: 'Compute P(A|B)',
    concept: 'Conditional probability starts from P(A and B) / P(B).',
    objective: 'Compute pAGivenB from pAAndB and pB.',
    difficulty: 'warmup',
    starterCode: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  // TODO: compute pAGivenB, guard pB=0
  const pAGivenB = 0;
  return pAGivenB;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('p(a|b)', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.4);
return results;\`,
    hints: ['const pAGivenB = pB === 0 ? 0 : pAAndB / pB;'],
    solution: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAGivenB = pB === 0 ? 0 : pAAndB / pB;
  return pAGivenB;
}\`,
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
    starterCode: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  // TODO: compute pAB from pA and pBGivenA
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('p(a,b)', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.2);
return results;\`,
    hints: ['return pA * pBGivenA;'],
    solution: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  return pA * pBGivenA;
}\`,
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
    starterCode: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAB = pA * pBGivenA;
  // TODO: multiply by pCGivenAB
  return pAB;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('p(a,b,c)', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.06);
return results;\`,
    hints: ['return pAB * pCGivenAB;'],
    solution: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAB = pA * pBGivenA;
  return pAB * pCGivenAB;
}\`,
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
    starterCode: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAGivenB = pB === 0 ? 0 : pAAndB / pB;
  const pABC = pA * pBGivenA * pCGivenAB;
  // TODO: return combined scalar pAGivenB + pABC
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('combined', conditionalChain(0.2, 0.5, 0.5, 0.4, 0.3), 0.46);
return results;\`,
    hints: ['return pAGivenB + pABC;'],
    solution: \`function conditionalChain(pAAndB, pB, pA, pBGivenA, pCGivenAB) {
  const pAGivenB = pB === 0 ? 0 : pAAndB / pB;
  const pABC = pA * pBGivenA * pCGivenAB;
  return pAGivenB + pABC;
}\`,
    explanation: 'The final step validates both conditional and chain computations.',
  },
`;

const BAYES = `  // --- bayes-rule-ml ---
  {
    id: 'bayes-posterior-numerator',
    stepLabel: '54.1',
    group: 'Bayes posterior',
    title: 'Posterior numerator',
    concept: 'Bayes numerator is prior times likelihood under hypothesis.',
    objective: 'Compute num = prior * likH.',
    difficulty: 'warmup',
    starterCode: \`function bayesPosterior(prior, likH, likNotH) {
  // TODO: numerator
  const num = 0;
  return num;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('numerator', bayesPosterior(0.2, 0.9, 0.1), 0.18);
return results;\`,
    hints: ['const num = prior * likH;'],
    solution: \`function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  return num;
}\`,
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
    starterCode: \`function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  // TODO: denominator
  const den = 0;
  return den;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('denominator', bayesPosterior(0.2, 0.9, 0.1), 0.26);
return results;\`,
    hints: ['const den = num + (1 - prior) * likNotH;'],
    solution: \`function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  return den;
}\`,
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
    starterCode: \`function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  // TODO: return ratio with den=0 guard
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('posterior', bayesPosterior(0.01, 0.99, 0.05), 0.166667);
return results;\`,
    hints: ['if (den === 0) return 0; return num / den;'],
    solution: \`function bayesPosterior(prior, likH, likNotH) {
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  if (den === 0) return 0;
  return num / den;
}\`,
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
    starterCode: \`function bayesPosterior(prior, likH, likNotH) {
  // TODO: prior==0 => 0, prior==1 => 1
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  if (den === 0) return 0;
  return num / den;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('prior 0', bayesPosterior(0, 0.9, 0.1), 0);
check('prior 1', bayesPosterior(1, 0.9, 0.1), 1);
return results;\`,
    hints: ['if (prior === 0) return 0; if (prior === 1) return 1;'],
    solution: \`function bayesPosterior(prior, likH, likNotH) {
  if (prior === 0) return 0;
  if (prior === 1) return 1;
  const num = prior * likH;
  const den = num + (1 - prior) * likNotH;
  if (den === 0) return 0;
  return num / den;
}\`,
    explanation: 'Boundary handling avoids unstable behavior in edge-case priors.',
  },
`;

const MLE = `  // --- maximum-likelihood-estimation ---
  {
    id: 'mle-loglik-guard',
    stepLabel: '55.1',
    group: 'MLE log-likelihood',
    title: 'Probability bounds guard',
    concept: 'Bernoulli log-likelihood is undefined for p outside (0,1).',
    objective: 'Return -Infinity for invalid p.',
    difficulty: 'warmup',
    starterCode: \`function mleLogLik(data, p) {
  // TODO: guard invalid p
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  const passed = (Number.isNaN(expected) && Number.isNaN(actual)) || Object.is(actual, expected);
  results.push({ name, actual, expected, passed });
}
check('invalid low', mleLogLik([1, 0], 0), -Infinity);
return results;\`,
    hints: ['if (p <= 0 || p >= 1) return -Infinity;'],
    solution: \`function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  return 0;
}\`,
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
    starterCode: \`function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    // TODO: accumulate term
  }
  return logLik;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('three samples', mleLogLik([1, 0, 1], 0.5), -2.07944);
return results;\`,
    hints: ['logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);'],
    solution: \`function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}\`,
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
    starterCode: \`function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  // TODO: handle empty data
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty data', mleLogLik([], 0.5), 0);
return results;\`,
    hints: ['if (data.length === 0) return 0;'],
    solution: \`function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  if (data.length === 0) return 0;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}\`,
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
    starterCode: \`function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  if (data.length === 0) return 0;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    // TODO: add bernoulli log term
  }
  return logLik;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('biased p', mleLogLik([1, 0, 1], 0.8), -2.055725);
return results;\`,
    hints: ['same formula as previous step'],
    solution: \`function mleLogLik(data, p) {
  if (p <= 0 || p >= 1) return -Infinity;
  if (data.length === 0) return 0;
  let logLik = 0;
  for (let i = 0; i < data.length; i++) {
    const k = data[i];
    logLik += k * Math.log(p) + (1 - k) * Math.log(1 - p);
  }
  return logLik;
}\`,
    explanation: 'This objective is directly optimized in Bernoulli MLE fitting.',
  },
`;

const MOMENTS = `  // --- expected-value-variance ---
  {
    id: 'moments-ev',
    stepLabel: '56.1',
    group: 'Moments from PMF',
    title: 'Expected value from PMF',
    concept: 'First moment is weighted sum of outcomes.',
    objective: 'Compute ev = sum(outcomes[i] * probs[i]).',
    difficulty: 'warmup',
    starterCode: \`function momentStats(outcomes, probs) {
  let ev = 0;
  // TODO: weighted sum for EV
  return { ev, variance: 0 };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('ev die', momentStats([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]).ev, 3.5);
return results;\`,
    hints: ['ev += outcomes[i] * probs[i];'],
    solution: \`function momentStats(outcomes, probs) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  return { ev, variance: 0 };
}\`,
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
    starterCode: \`function momentStats(outcomes, probs) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  // TODO: weighted squared deviations
  return { ev, variance };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('var die', momentStats([1, 2, 3, 4, 5, 6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]).variance, 2.916667);
return results;\`,
    hints: ['variance += Math.pow(outcomes[i] - ev, 2) * probs[i];'],
    solution: \`function momentStats(outcomes, probs) {
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}\`,
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
    starterCode: \`function momentStats(outcomes, probs) {
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  // TODO: guard invalid probability sums
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  const passed = Number.isNaN(actual) && Number.isNaN(expected);
  results.push({ name, actual, expected, passed });
}
check('invalid pmf', momentStats([1, 2], [0.2, 0.2]).variance, NaN);
return results;\`,
    hints: ['if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };'],
    solution: \`function momentStats(outcomes, probs) {
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}\`,
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
    starterCode: \`function momentStats(outcomes, probs) {
  // TODO: handle empty arrays
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('empty arrays', momentStats([], []), { ev: 0, variance: 0 });
return results;\`,
    hints: ['if (outcomes.length === 0 || probs.length === 0) return { ev: 0, variance: 0 };'],
    solution: \`function momentStats(outcomes, probs) {
  if (outcomes.length === 0 || probs.length === 0) return { ev: 0, variance: 0 };
  let pSum = 0;
  for (let i = 0; i < probs.length; i++) pSum += probs[i];
  if (Math.abs(pSum - 1) > 1e-6) return { ev: NaN, variance: NaN };
  let ev = 0;
  for (let i = 0; i < outcomes.length; i++) ev += outcomes[i] * probs[i];
  let variance = 0;
  for (let i = 0; i < outcomes.length; i++) variance += Math.pow(outcomes[i] - ev, 2) * probs[i];
  return { ev, variance };
}\`,
    explanation: 'A compact utility for PMF-derived moments across lessons.',
  },
`;

const SPEARMAN = `  // --- spearman-correlation ---
  {
    id: 'spearman-rank-build',
    stepLabel: '57.1',
    group: 'Spearman correlation',
    title: 'Build rank array with ties',
    concept: 'Spearman starts by ranking each array with average tie ranks.',
    objective: 'Implement rankData with tie averaging.',
    difficulty: 'warmup',
    starterCode: \`function spearmanRho(x, y) {
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
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('rank ties', spearmanRho([10, 20, 20, 30], [1, 2, 3, 4]), [1, 2.5, 2.5, 4]);
return results;\`,
    hints: ['const avgRank = (i + 1 + j) / 2; for (let k = i; k < j; k++) ranks[sorted[k].idx] = avgRank;'],
    solution: \`function spearmanRho(x, y) {
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
}\`,
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
    starterCode: \`function spearmanRho(x, y) {
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
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('rank means', spearmanRho([1, 2, 3], [3, 2, 1]), [2, 2]);
return results;\`,
    hints: ['const meanX = rx.reduce((s, v) => s + v, 0) / n;'],
    solution: \`function spearmanRho(x, y) {
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
}\`,
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
    starterCode: \`function spearmanRho(x, y) {
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
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-9) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('perfect positive sums', spearmanRho([1, 2, 3], [1, 2, 3]), [2, 2, 2]);
return results;\`,
    hints: ['dx = rx[i]-meanX; dy = ry[i]-meanY; num += dx*dy; denX += dx*dx; denY += dy*dy;'],
    solution: \`function spearmanRho(x, y) {
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
}\`,
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
    starterCode: \`function spearmanRho(x, y) {
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('positive', spearmanRho([10, 20, 30, 40], [5, 15, 25, 35]), 1);
check('negative', spearmanRho([10, 20, 30, 40], [35, 25, 15, 5]), -1);
return results;\`,
    hints: ['if (denX === 0 || denY === 0) return 0; return num / Math.sqrt(denX * denY);'],
    solution: \`function spearmanRho(x, y) {
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
}\`,
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
    starterCode: \`function spearmanRho(x, y) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('constant x', spearmanRho([1, 1, 1], [1, 2, 3]), 0);
return results;\`,
    hints: ['return 0;'],
    solution: \`function spearmanRho(x, y) {
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
}\`,
    explanation: 'Constant vectors carry no rank variance, so correlation is undefined and set to 0.',
  },
`;

const CONV2D = `  {
    id: 'conv2d-step-outdim',
    stepLabel: '32.1',
    group: 'Conv2D step',
    title: 'Conv output dimension',
    concept: 'Conv2D output width/height follows stride-padding-kernel formula.',
    objective: 'Compute outDim from inputSize, kernelSize, padding, stride.',
    difficulty: 'warmup',
    starterCode: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  // TODO: compute output dimension
  const outDim = 0;
  return outDim;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('out dim', conv2dStep(32, 3, 1, 1, [[1,2],[3,4]], [[1,0],[0,1]]), 32);
return results;\`,
    hints: ['Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1'],
    solution: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  const outDim = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  return outDim;
}\`,
    explanation: 'Shape math is mandatory before allocating convolution outputs.',
  },
  {
    id: 'conv2d-step-dot',
    stepLabel: '32.2',
    group: 'Conv2D step',
    title: 'Patch-kernel dot',
    concept: 'Each output location is a patch-kernel elementwise dot product.',
    objective: 'Compute dot sum over 2x2 patch and kernel.',
    difficulty: 'warmup',
    starterCode: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  let dot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      // TODO: accumulate patch-kernel product
      dot += 0;
    }
  }
  return dot;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('dot', conv2dStep(0, 0, 0, 0, [[1,2],[3,4]], [[0.5,0],[0,0.5]]), 2.5);
return results;\`,
    hints: ['dot += patch[r][c] * kernel[r][c];'],
    solution: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  let dot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      dot += patch[r][c] * kernel[r][c];
    }
  }
  return dot;
}\`,
    explanation: 'Dot products are the local linear feature extractors in Conv2D.',
  },
  {
    id: 'conv2d-step-return-both',
    stepLabel: '32.3',
    group: 'Conv2D step',
    title: 'Return shape and patch value',
    concept: 'A minimal conv step can report both output shape and one patch response.',
    objective: 'Return object { outDim, patchDot }.',
    difficulty: 'core',
    starterCode: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  const outDim = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  let patchDot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) patchDot += patch[r][c] * kernel[r][c];
  }
  // TODO: return both values
  return outDim;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('both', conv2dStep(32, 3, 1, 1, [[1,2],[3,4]], [[0.5,0],[0,0.5]]), { outDim: 32, patchDot: 2.5 });
return results;\`,
    hints: ['return { outDim, patchDot };'],
    solution: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  const outDim = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  let patchDot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) patchDot += patch[r][c] * kernel[r][c];
  }
  return { outDim, patchDot };
}\`,
    explanation: 'Combining shape and local response mirrors one forward micro-step.',
  },
  {
    id: 'conv2d-step-kernel-guard',
    stepLabel: '32.4',
    group: 'Conv2D step',
    title: 'Patch shape guard',
    concept: 'Guard against malformed patch/kernel inputs before dot computation.',
    objective: 'Return null when patch or kernel are not 2x2.',
    difficulty: 'core',
    starterCode: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  // TODO: return null for invalid patch/kernel shape
  const outDim = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  let patchDot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) patchDot += patch[r][c] * kernel[r][c];
  }
  return { outDim, patchDot };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('invalid patch', conv2dStep(32, 3, 1, 1, [[1,2]], [[1,0],[0,1]]), null);
return results;\`,
    hints: ['check lengths for outer and inner arrays equal 2'],
    solution: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  const validPatch = patch.length === 2 && patch[0].length === 2 && patch[1].length === 2;
  const validKernel = kernel.length === 2 && kernel[0].length === 2 && kernel[1].length === 2;
  if (!validPatch || !validKernel) return null;
  const outDim = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  let patchDot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) patchDot += patch[r][c] * kernel[r][c];
  }
  return { outDim, patchDot };
}\`,
    explanation: 'Input guards keep demos resilient when learners experiment.',
  },
  {
    id: 'conv2d-step-full',
    stepLabel: '32.5',
    group: 'Conv2D step',
    title: 'Full Conv2D single step',
    concept: 'Final step returns null for invalid stride and valid object otherwise.',
    objective: 'Return null when stride <= 0.',
    difficulty: 'core',
    starterCode: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  // TODO: stride must be positive
  const validPatch = patch.length === 2 && patch[0].length === 2 && patch[1].length === 2;
  const validKernel = kernel.length === 2 && kernel[0].length === 2 && kernel[1].length === 2;
  if (!validPatch || !validKernel) return null;
  const outDim = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  let patchDot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) patchDot += patch[r][c] * kernel[r][c];
  }
  return { outDim, patchDot };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('bad stride', conv2dStep(32, 3, 1, 0, [[1,2],[3,4]], [[1,0],[0,1]]), null);
check('good stride', conv2dStep(32, 3, 1, 1, [[1,2],[3,4]], [[1,0],[0,1]]), { outDim: 32, patchDot: 5 });
return results;\`,
    hints: ['if (stride <= 0) return null;'],
    solution: \`function conv2dStep(inputSize, kernelSize, padding, stride, patch, kernel) {
  if (stride <= 0) return null;
  const validPatch = patch.length === 2 && patch[0].length === 2 && patch[1].length === 2;
  const validKernel = kernel.length === 2 && kernel[0].length === 2 && kernel[1].length === 2;
  if (!validPatch || !validKernel) return null;
  const outDim = Math.floor((inputSize - kernelSize + 2 * padding) / stride) + 1;
  let patchDot = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) patchDot += patch[r][c] * kernel[r][c];
  }
  return { outDim, patchDot };
}\`,
    explanation: 'Final helper is a clean micro-model of one Conv2D operation.',
  },
`;

const DAPO = `  // --- dapo-reasoning-rl ---
  {
    id: 'dapo-clip-reward',
    stepLabel: '68.1',
    group: 'DAPO advantage',
    title: 'Reward clipping',
    concept: 'DAPO clips reward to bounded interval for stability.',
    objective: 'Compute clipped reward in [low, high].',
    difficulty: 'warmup',
    starterCode: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  // TODO: clip reward
  const clipped = reward;
  return clipped;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('clip high', dapoAdvantage(3, 0.8, 0.4, 0.5, -2, 2), 2);
return results;\`,
    hints: ['const clipped = Math.max(low, Math.min(high, reward));'],
    solution: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  return clipped;
}\`,
    explanation: 'Clipping prevents outlier rewards from dominating policy updates.',
  },
  {
    id: 'dapo-kl-penalty',
    stepLabel: '68.2',
    group: 'DAPO advantage',
    title: 'KL penalty term',
    concept: 'DAPO subtracts beta * log(policy/ref) as regularization.',
    objective: 'Compute penalty term.',
    difficulty: 'warmup',
    starterCode: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  // TODO: penalty = beta * Math.log(probPol / probRef)
  const penalty = 0;
  return penalty;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('penalty', dapoAdvantage(2, 0.8, 0.4, 0.5, -2, 2), 0.346574);
return results;\`,
    hints: ['const penalty = beta * Math.log(probPol / probRef);'],
    solution: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  const penalty = beta * Math.log(probPol / probRef);
  return penalty;
}\`,
    explanation: 'Penalty discourages excessive drift from reference behavior.',
  },
  {
    id: 'dapo-adv-core',
    stepLabel: '68.3',
    group: 'DAPO advantage',
    title: 'Decoupled advantage',
    concept: 'DAPO advantage is clipped reward minus KL penalty.',
    objective: 'Return clipped - penalty.',
    difficulty: 'core',
    starterCode: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  const penalty = beta * Math.log(probPol / probRef);
  // TODO: compute final advantage
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('dapo advantage', dapoAdvantage(2, 0.8, 0.4, 0.5, -2, 2), 1.653426);
return results;\`,
    hints: ['return clipped - penalty;'],
    solution: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  const penalty = beta * Math.log(probPol / probRef);
  return clipped - penalty;
}\`,
    explanation: 'This combines bounded rewards with conservative policy regularization.',
  },
  {
    id: 'dapo-adv-safe',
    stepLabel: '68.4',
    group: 'DAPO advantage',
    title: 'Numerically safe DAPO advantage',
    concept: 'Probability guards avoid invalid logs.',
    objective: 'Return clipped reward if probPol<=0 or probRef<=0.',
    difficulty: 'core',
    starterCode: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  // TODO: guard invalid probabilities
  const penalty = beta * Math.log(probPol / probRef);
  return clipped - penalty;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('invalid probs', dapoAdvantage(1, 0, 0.4, 0.5, -2, 2), 1);
return results;\`,
    hints: ['if (probPol <= 0 || probRef <= 0) return clipped;'],
    solution: \`function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  if (probPol <= 0 || probRef <= 0) return clipped;
  const penalty = beta * Math.log(probPol / probRef);
  return clipped - penalty;
}\`,
    explanation: 'Safe guards keep optimization loops from crashing on bad inputs.',
  },
`;

const MARKOV = `  // --- markov-chains ---
  {
    id: 'markov-next-dist',
    stepLabel: '69.1',
    group: 'Markov chain step',
    title: 'One-step distribution multiply',
    concept: 'Next state distribution is row-vector times transition matrix.',
    objective: 'Compute nextDist = stateDist * P.',
    difficulty: 'warmup',
    starterCode: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      // TODO: accumulate stateDist[i] * P[i][j]
      sum += 0;
    }
    nextDist[j] = sum;
  }
  return { nextDist, isStationary: false };
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-9) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('next dist', markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).nextDist, [0.58,0.42]);
return results;\`,
    hints: ['sum += stateDist[i] * P[i][j];'],
    solution: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += stateDist[i] * P[i][j];
    }
    nextDist[j] = sum;
  }
  return { nextDist, isStationary: false };
}\`,
    explanation: 'This is the core linear step in Markov dynamics.',
  },
  {
    id: 'markov-pi-next',
    stepLabel: '69.2',
    group: 'Markov chain step',
    title: 'Stationary candidate transition',
    concept: 'Stationary check compares piP against pi.',
    objective: 'Compute piNext = pi * P.',
    difficulty: 'warmup',
    starterCode: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  // TODO: fill piNext via pi * P
  return { nextDist, isStationary: piNext[0] };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('piNext[0]', markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).isStationary, 4/7);
return results;\`,
    hints: ['same matrix multiply loop using pi instead of stateDist'],
    solution: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  return { nextDist, isStationary: piNext[0] };
}\`,
    explanation: 'Stationary candidates remain unchanged by transition dynamics.',
  },
  {
    id: 'markov-stationary-check',
    stepLabel: '69.3',
    group: 'Markov chain step',
    title: 'Tolerance-based stationary check',
    concept: 'Numerical stationary checks use absolute tolerance.',
    objective: 'Set isStationary true only if all |piNext[i]-pi[i]| <= tol.',
    difficulty: 'core',
    starterCode: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  // TODO: implement tolerance check
  const isStationary = false;
  return { nextDist, isStationary };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('stationary true', markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).isStationary, true);
check('stationary false', markovAnalyze([0.6,0.4], P, [0.6,0.4], 1e-5).isStationary, false);
return results;\`,
    hints: ['use loop and break on first mismatch > tol'],
    solution: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) {
    if (Math.abs(piNext[i] - pi[i]) > tol) {
      isStationary = false;
      break;
    }
  }
  return { nextDist, isStationary };
}\`,
    explanation: 'Tolerance makes stationary checks robust to floating-point noise.',
  },
  {
    id: 'markov-normalize-next',
    stepLabel: '69.4',
    group: 'Markov chain step',
    title: 'Normalize next distribution',
    concept: 'Small numeric drift can slightly break sum-to-one property.',
    objective: 'Normalize nextDist by its sum when sum > 0.',
    difficulty: 'core',
    starterCode: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  // TODO: normalize nextDist
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
const out = markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).nextDist;
check('sum one', out[0] + out[1], 1);
return results;\`,
    hints: ['const total = nextDist.reduce((s, v) => s + v, 0); if (total > 0) divide each by total'],
    solution: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const total = nextDist.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < nextDist.length; i++) nextDist[i] /= total;
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}\`,
    explanation: 'Normalization preserves probabilistic interpretation after computation.',
  },
  {
    id: 'markov-step-full',
    stepLabel: '69.5',
    group: 'Markov chain step',
    title: 'Complete Markov analysis step',
    concept: 'Final helper reports both transition output and stationarity status.',
    objective: 'Return false stationarity when pi length mismatches matrix size.',
    difficulty: 'core',
    starterCode: \`function markovAnalyze(stateDist, P, pi, tol) {
  // TODO: guard mismatched pi size
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const total = nextDist.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < nextDist.length; i++) nextDist[i] /= total;
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('pi mismatch', markovAnalyze([0.6,0.4], P, [1], 1e-5).isStationary, false);
return results;\`,
    hints: ['if (pi.length !== P.length) return { nextDist, isStationary: false };'],
    solution: \`function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const total = nextDist.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < nextDist.length; i++) nextDist[i] /= total;
  if (pi.length !== P.length) return { nextDist, isStationary: false };
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}\`,
    explanation: 'A complete step function supports both simulation and diagnostics.',
  },
`;

const PAGERANK = `  // --- pagerank ---
  {
    id: 'pagerank-share',
    stepLabel: '71.1',
    group: 'PageRank iteration',
    title: 'Out-link share',
    concept: 'Each page distributes rank equally across outgoing links.',
    objective: 'Compute share = rank / outDegree for non-dangling pages.',
    difficulty: 'warmup',
    starterCode: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) continue;
    // TODO: share and distribute
  }
  return next;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = pagerankStep([0.6, 0.4], [[1], [0,1]], 0.85);
check('share effect', out[1] > out[0], true);
return results;\`,
    hints: ['const share = ranks[j] / out.length;'],
    solution: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) continue;
    const share = ranks[j] / out.length;
    for (let i = 0; i < out.length; i++) next[out[i]] += share;
  }
  return next;
}\`,
    explanation: 'Rank mass conservation is the base PageRank mechanism.',
  },
  {
    id: 'pagerank-dangling',
    stepLabel: '71.2',
    group: 'PageRank iteration',
    title: 'Dangling node redistribution',
    concept: 'Pages with no links spread mass uniformly to all pages.',
    objective: 'Handle out.length===0 by adding ranks[j]/n to all nodes.',
    difficulty: 'warmup',
    starterCode: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      // TODO: distribute dangling mass equally
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  return next;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = pagerankStep([1, 0], [[], [0]], 0.85);
check('dangling gives half', out[0], 0.5);
check('dangling gives half2', out[1], 0.5);
return results;\`,
    hints: ['for (let i = 0; i < n; i++) next[i] += ranks[j] / n;'],
    solution: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  return next;
}\`,
    explanation: 'Dangling handling prevents rank sink collapse.',
  },
  {
    id: 'pagerank-teleport',
    stepLabel: '71.3',
    group: 'PageRank iteration',
    title: 'Apply damping and teleport',
    concept: 'Damping blends random jump with link-following probability.',
    objective: 'Transform next[i] to d*next[i] + (1-d)/n.',
    difficulty: 'core',
    starterCode: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  // TODO: apply damping
  return next;
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-5) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('pagerank example', pagerankStep([0.5, 0.5], [[1], [0,1]], 0.85), [0.2875, 0.7125]);
return results;\`,
    hints: ['for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;'],
    solution: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  return next;
}\`,
    explanation: 'Teleportation guarantees ergodicity and convergence.',
  },
  {
    id: 'pagerank-normalize',
    stepLabel: '71.4',
    group: 'PageRank iteration',
    title: 'Normalize numeric drift',
    concept: 'Finite precision can make rank sum deviate from 1.',
    objective: 'Normalize next by total sum.',
    difficulty: 'core',
    starterCode: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  // TODO: normalize next
  return next;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = pagerankStep([0.5, 0.5], [[1], [0,1]], 0.85);
check('sum one', out[0] + out[1], 1);
return results;\`,
    hints: ['const total = next.reduce((s, v) => s + v, 0); if (total > 0) divide each'],
    solution: \`function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  const total = next.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < n; i++) next[i] /= total;
  return next;
}\`,
    explanation: 'Normalization maintains probabilistic interpretation each iteration.',
  },
  {
    id: 'pagerank-iteration-step',
    stepLabel: '71.5',
    group: 'PageRank iteration',
    title: 'Complete PageRank iteration',
    concept: 'Final step combines distribution, damping, and normalization robustly.',
    objective: 'Return null when d is outside [0,1].',
    difficulty: 'core',
    starterCode: \`function pagerankStep(ranks, adjList, d) {
  // TODO: validate damping range
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  const total = next.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < n; i++) next[i] /= total;
  return next;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('invalid d', pagerankStep([0.5, 0.5], [[1], [0,1]], 1.2), null);
return results;\`,
    hints: ['if (d < 0 || d > 1) return null;'],
    solution: \`function pagerankStep(ranks, adjList, d) {
  if (d < 0 || d > 1) return null;
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  const total = next.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < n; i++) next[i] /= total;
  return next;
}\`,
    explanation: 'Validation plus complete update gives a production-safe iteration primitive.',
  },
`;

const UNET_DIT = `  // --- unet-vs-dit ---
  {
    id: 'arch-token-concat-shape',
    stepLabel: '75.1',
    group: 'U-Net vs DiT step',
    title: 'U-Net skip concat shape',
    concept: 'U-Net concatenates decoder and skip features on channel axis.',
    objective: 'Compute concat shape when spatial dims match.',
    difficulty: 'warmup',
    starterCode: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  // TODO: return null if H/W mismatch, else [H, W, Cdec + Cskip]
  return null;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const img = [[1,2,9,10],[3,4,11,12],[5,6,13,14],[7,8,15,16]];
check('concat', archTokenStep([32,32,128], [32,32,128], img, 2), [32,32,256]);
return results;\`,
    hints: ['if dims mismatch return null'],
    solution: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  if (decShape[0] !== skipShape[0] || decShape[1] !== skipShape[1]) return null;
  return [decShape[0], decShape[1], decShape[2] + skipShape[2]];
}\`,
    explanation: 'Skip concat preserves encoder detail in decoder path.',
  },
  {
    id: 'arch-token-patch-grid',
    stepLabel: '75.2',
    group: 'U-Net vs DiT step',
    title: 'Patch grid loop',
    concept: 'DiT tokenizes image by iterating patch-grid origins.',
    objective: 'Collect patch origins [r,c] for patch extraction.',
    difficulty: 'warmup',
    starterCode: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  const origins = [];
  // TODO: push [r,c] for each patch start using patchSize stride
  return origins;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const img = [[1,2,9,10],[3,4,11,12],[5,6,13,14],[7,8,15,16]];
check('origins', archTokenStep([1,1,1], [1,1,1], img, 2), [[0,0],[0,2],[2,0],[2,2]]);
return results;\`,
    hints: ['nested loops: for r+=patchSize, for c+=patchSize'],
    solution: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  const origins = [];
  for (let r = 0; r < image2D.length; r += patchSize) {
    for (let c = 0; c < image2D[0].length; c += patchSize) origins.push([r, c]);
  }
  return origins;
}\`,
    explanation: 'Origin grid defines tokenization traversal order.',
  },
  {
    id: 'arch-token-patchify',
    stepLabel: '75.3',
    group: 'U-Net vs DiT step',
    title: 'Patchify to tokens',
    concept: 'Each patch becomes a flattened token vector.',
    objective: 'Extract and flatten all patches in grid order.',
    difficulty: 'core',
    starterCode: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  const tokens = [];
  for (let r = 0; r < image2D.length; r += patchSize) {
    for (let c = 0; c < image2D[0].length; c += patchSize) {
      const patch = [];
      // TODO: flatten patchSize x patchSize patch
      tokens.push(patch);
    }
  }
  return tokens;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const img = [[1,2,9,10],[3,4,11,12],[5,6,13,14],[7,8,15,16]];
check('tokens', archTokenStep([1,1,1], [1,1,1], img, 2), [[1,2,3,4],[9,10,11,12],[5,6,7,8],[13,14,15,16]]);
return results;\`,
    hints: ['inner loops over dr/dc push image2D[r+dr][c+dc]'],
    solution: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  const tokens = [];
  for (let r = 0; r < image2D.length; r += patchSize) {
    for (let c = 0; c < image2D[0].length; c += patchSize) {
      const patch = [];
      for (let dr = 0; dr < patchSize; dr++) {
        for (let dc = 0; dc < patchSize; dc++) patch.push(image2D[r + dr][c + dc]);
      }
      tokens.push(patch);
    }
  }
  return tokens;
}\`,
    explanation: 'Patchify is the key modality bridge from image grids to transformer tokens.',
  },
  {
    id: 'arch-token-compare',
    stepLabel: '75.4',
    group: 'U-Net vs DiT step',
    title: 'Return both architecture artifacts',
    concept: 'Comparison step returns U-Net concat shape and DiT tokens together.',
    objective: 'Return object { concatShape, tokens }.',
    difficulty: 'core',
    starterCode: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  const concatShape = (decShape[0] === skipShape[0] && decShape[1] === skipShape[1])
    ? [decShape[0], decShape[1], decShape[2] + skipShape[2]]
    : null;
  const tokens = [];
  for (let r = 0; r < image2D.length; r += patchSize) {
    for (let c = 0; c < image2D[0].length; c += patchSize) {
      const patch = [];
      for (let dr = 0; dr < patchSize; dr++) {
        for (let dc = 0; dc < patchSize; dc++) patch.push(image2D[r + dr][c + dc]);
      }
      tokens.push(patch);
    }
  }
  // TODO: return both outputs
  return tokens;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const img = [[1,2,9,10],[3,4,11,12],[5,6,13,14],[7,8,15,16]];
check('both outputs', archTokenStep([32,32,128], [32,32,128], img, 2), { concatShape: [32,32,256], tokens: [[1,2,3,4],[9,10,11,12],[5,6,7,8],[13,14,15,16]] });
return results;\`,
    hints: ['return { concatShape, tokens };'],
    solution: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  const concatShape = (decShape[0] === skipShape[0] && decShape[1] === skipShape[1])
    ? [decShape[0], decShape[1], decShape[2] + skipShape[2]]
    : null;
  const tokens = [];
  for (let r = 0; r < image2D.length; r += patchSize) {
    for (let c = 0; c < image2D[0].length; c += patchSize) {
      const patch = [];
      for (let dr = 0; dr < patchSize; dr++) {
        for (let dc = 0; dc < patchSize; dc++) patch.push(image2D[r + dr][c + dc]);
      }
      tokens.push(patch);
    }
  }
  return { concatShape, tokens };
}\`,
    explanation: 'This compactly contrasts CNN-style and transformer-style feature representations.',
  },
  {
    id: 'arch-token-safe',
    stepLabel: '75.5',
    group: 'U-Net vs DiT step',
    title: 'Patch size safety guard',
    concept: 'Patchify requires positive patch size dividing image dimensions.',
    objective: 'Return null when patchSize <= 0 or non-divisible dimensions.',
    difficulty: 'core',
    starterCode: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  // TODO: validate patchSize and divisibility
  const concatShape = (decShape[0] === skipShape[0] && decShape[1] === skipShape[1])
    ? [decShape[0], decShape[1], decShape[2] + skipShape[2]]
    : null;
  const tokens = [];
  for (let r = 0; r < image2D.length; r += patchSize) {
    for (let c = 0; c < image2D[0].length; c += patchSize) {
      const patch = [];
      for (let dr = 0; dr < patchSize; dr++) {
        for (let dc = 0; dc < patchSize; dc++) patch.push(image2D[r + dr][c + dc]);
      }
      tokens.push(patch);
    }
  }
  return { concatShape, tokens };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const img = [[1,2,9,10],[3,4,11,12],[5,6,13,14],[7,8,15,16]];
check('invalid patch size', archTokenStep([1,1,1], [1,1,1], img, 3), null);
return results;\`,
    hints: ['if (patchSize <= 0 || image2D.length % patchSize !== 0 || image2D[0].length % patchSize !== 0) return null;'],
    solution: \`function archTokenStep(decShape, skipShape, image2D, patchSize) {
  if (patchSize <= 0 || image2D.length % patchSize !== 0 || image2D[0].length % patchSize !== 0) return null;
  const concatShape = (decShape[0] === skipShape[0] && decShape[1] === skipShape[1])
    ? [decShape[0], decShape[1], decShape[2] + skipShape[2]]
    : null;
  const tokens = [];
  for (let r = 0; r < image2D.length; r += patchSize) {
    for (let c = 0; c < image2D[0].length; c += patchSize) {
      const patch = [];
      for (let dr = 0; dr < patchSize; dr++) {
        for (let dc = 0; dc < patchSize; dc++) patch.push(image2D[r + dr][c + dc]);
      }
      tokens.push(patch);
    }
  }
  return { concatShape, tokens };
}\`,
    explanation: 'Validation protects tokenization from malformed patch geometry.',
  },
`;

const FLOW = `  // --- flow-matching ---
  {
    id: 'flow-step-interp',
    stepLabel: '77.1',
    group: 'Flow matching step',
    title: 'Linear interpolation position',
    concept: 'Flow matching starts from interpolation x_t = (1-t)x0 + tx1.',
    objective: 'Compute interpolated position from x0, x1, and t.',
    difficulty: 'warmup',
    starterCode: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  // TODO: compute interp
  const interp = 0;
  return interp;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('interp', flowSampleStep(2, 10, 0.5, 0, 0, 0.1), 6);
return results;\`,
    hints: ['const interp = (1 - t) * x0 + t * x1;'],
    solution: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const interp = (1 - t) * x0 + t * x1;
  return interp;
}\`,
    explanation: 'Interpolation defines the target path used during flow training.',
  },
  {
    id: 'flow-step-velocity',
    stepLabel: '77.2',
    group: 'Flow matching step',
    title: 'Path velocity',
    concept: 'For linear paths, velocity is constant difference x1 - x0.',
    objective: 'Compute path velocity term.',
    difficulty: 'warmup',
    starterCode: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  // TODO: compute pathVel
  const pathVel = 0;
  return pathVel;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('path vel', flowSampleStep(2, 10, 0.5, 0, 0, 0.1), 8);
return results;\`,
    hints: ['const pathVel = x1 - x0;'],
    solution: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const pathVel = x1 - x0;
  return pathVel;
}\`,
    explanation: 'Constant path velocity is a key simplification in linear flow matching.',
  },
  {
    id: 'flow-step-model-velocity',
    stepLabel: '77.3',
    group: 'Flow matching step',
    title: 'Use provided model velocity',
    concept: 'Sampling uses model-predicted velocity field at current state.',
    objective: 'Choose v = velocity argument, fallback to path velocity when null.',
    difficulty: 'core',
    starterCode: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const pathVel = x1 - x0;
  // TODO: choose model velocity when provided
  const v = pathVel;
  return v;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('uses provided vel', flowSampleStep(2, 10, 0.5, 0, 3, 0.1), 3);
check('fallback vel', flowSampleStep(2, 10, 0.5, 0, null, 0.1), 8);
return results;\`,
    hints: ['const v = velocity == null ? pathVel : velocity;'],
    solution: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const pathVel = x1 - x0;
  const v = velocity == null ? pathVel : velocity;
  return v;
}\`,
    explanation: 'Fallback keeps the function usable with or without model prediction.',
  },
  {
    id: 'flow-step-euler',
    stepLabel: '77.4',
    group: 'Flow matching step',
    title: 'Euler integration update',
    concept: 'Sampling advances state with x_{t+dt} = x_t + dt * v.',
    objective: 'Compute next sample using Euler step.',
    difficulty: 'core',
    starterCode: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const pathVel = x1 - x0;
  const v = velocity == null ? pathVel : velocity;
  // TODO: euler update
  return xt;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('euler', flowSampleStep(2, 10, 0.5, 1.5, 4, 0.1), 1.9);
return results;\`,
    hints: ['return xt + dt * v;'],
    solution: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const pathVel = x1 - x0;
  const v = velocity == null ? pathVel : velocity;
  return xt + dt * v;
}\`,
    explanation: 'Euler updates are the simplest numerical integration for flow paths.',
  },
  {
    id: 'flow-step-full',
    stepLabel: '77.5',
    group: 'Flow matching step',
    title: 'Complete flow sample step',
    concept: 'Complete helper can blend interpolation, velocity logic, and safe time step handling.',
    objective: 'Return xt unchanged when dt is 0, else Euler update with selected velocity.',
    difficulty: 'core',
    starterCode: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const interp = (1 - t) * x0 + t * x1;
  const pathVel = x1 - x0;
  const v = velocity == null ? pathVel : velocity;
  // TODO: if dt is zero, return xt
  return xt + dt * v + 0 * interp;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('dt zero', flowSampleStep(2, 10, 0.5, 1.5, 4, 0), 1.5);
check('dt nonzero', flowSampleStep(2, 10, 0.5, 1.5, 4, 0.1), 1.9);
return results;\`,
    hints: ['if (dt === 0) return xt;'],
    solution: \`function flowSampleStep(x0, x1, t, xt, velocity, dt) {
  const interp = (1 - t) * x0 + t * x1;
  const pathVel = x1 - x0;
  const v = velocity == null ? pathVel : velocity;
  if (dt === 0) return xt;
  return xt + dt * v + 0 * interp;
}\`,
    explanation: 'The final function mirrors one robust numerical sampling micro-step.',
  },
`;

replaceBetween(
  'src/labs/evaluation/evaluationCodeLabs.js',
  "  {\n    id: 'rank-dot-score',",
  "  {\n    id: 'eval-pass-at-k-edge',",
  RANKING,
);

replaceBetween(
  'src/labs/evaluation/evaluationCodeLabs.js',
  "  {\n    id: 'interpretability-marginal',",
  "  {\n    id: 'fairness-group-rate',",
  INTERPRETABILITY,
);

replaceBetween(
  'src/labs/evaluation/evaluationCodeLabs.js',
  "  {\n    id: 'fairness-group-rate',",
  "  {\n    id: 'uncertainty-entropy',",
  FAIRNESS,
);

replaceBetween(
  'src/labs/evaluation/evaluationCodeLabs.js',
  "  {\n    id: 'uncertainty-entropy',",
  "  {\n    id: 'security-fgsm-step',",
  UNCERTAINTY,
);

replaceBetween(
  'src/labs/evaluation/evaluationCodeLabs.js',
  "  {\n    id: 'security-fgsm-step',",
  "];",
  SECURITY,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- cross-validation ---',
  '  // --- data-leakage-deep-dive ---',
  CROSS_VALIDATION,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- data-leakage-deep-dive ---',
  '  // --- feature-scaling-preprocessing ---',
  LEAKAGE,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- tree-ensembles ---',
  '  // --- time-series-forecasting-track ---',
  ENSEMBLES,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- time-series-forecasting-track ---',
  '  // --- data-engineering-for-ml-track ---',
  FORECAST,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- data-engineering-for-ml-track ---',
  '];',
  PIPELINE,
);

replaceBetween(
  'src/labs/probability/probabilityCodeLabs.js',
  '  // --- probability-distributions ---',
  '  // --- conditional-probability ---',
  DIST,
);

replaceBetween(
  'src/labs/probability/probabilityCodeLabs.js',
  '  // --- conditional-probability ---',
  '  // --- bayes-rule-ml ---',
  CONDITIONAL,
);

replaceBetween(
  'src/labs/probability/probabilityCodeLabs.js',
  '  // --- bayes-rule-ml ---',
  '  // --- maximum-likelihood-estimation ---',
  BAYES,
);

replaceBetween(
  'src/labs/probability/probabilityCodeLabs.js',
  '  // --- maximum-likelihood-estimation ---',
  '  // --- expected-value-variance ---',
  MLE,
);

replaceBetween(
  'src/labs/probability/probabilityCodeLabs.js',
  '  // --- expected-value-variance ---',
  '  // --- spearman-correlation ---',
  MOMENTS,
);

replaceBetween(
  'src/labs/probability/probabilityCodeLabs.js',
  '  // --- spearman-correlation ---',
  '];',
  SPEARMAN,
);

replaceBetween(
  'src/labs/neural-networks/neuralNetworkCodeLabs.js',
  "  {\n    id: 'conv2d-output-size',",
  "  {\n    id: 'max-pooling-2d-top',",
  CONV2D,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- dapo-reasoning-rl ---',
  '  // --- markov-chains ---',
  DAPO,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- markov-chains ---',
  '];',
  MARKOV,
);

replaceBetween(
  'src/labs/algorithms/algorithmsCodeLabs.js',
  '  // --- pagerank ---',
  '];',
  PAGERANK,
);

replaceBetween(
  'src/labs/diffusion/diffusionCodeLabs.js',
  '  // --- unet-vs-dit ---',
  '  // --- flow-matching ---',
  UNET_DIT,
);

replaceBetween(
  'src/labs/diffusion/diffusionCodeLabs.js',
  '  // --- flow-matching ---',
  '  // --- diffusion-vae ---',
  FLOW,
);

patchMappings();
console.log('Tier 3 progressive lab patches applied.');
