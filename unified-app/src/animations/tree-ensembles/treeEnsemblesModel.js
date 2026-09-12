import {
  BOOSTING_CONFIG,
  FEATURES,
  FOREST_CONFIG,
  FOREST_DIVERSITY_DEMO,
  POINTS,
  TREE_CONFIG,
} from './treeEnsemblesConstants.js';

export { POINTS } from './treeEnsemblesConstants.js';

export function giniImpurity(rows) {
  assertRows(rows);
  if (rows.length === 0) return 0;
  const positiveRate = rows.reduce((sum, row) => sum + row.label, 0) / rows.length;
  return 1 - positiveRate ** 2 - (1 - positiveRate) ** 2;
}

export function fitDecisionTree(rows = POINTS, maxDepth = TREE_CONFIG.defaultDepth, options = {}) {
  assertRows(rows, true);
  assertPositiveInteger(maxDepth, 'maxDepth');
  const featureSubsetSize = options.featureSubsetSize ?? FEATURES.length;
  assertFeatureSubsetSize(featureSubsetSize);
  const seed = options.seed ?? FOREST_CONFIG.seed;
  if (!Number.isInteger(seed)) throw new TypeError('seed must be an integer');
  return buildTree(rows, maxDepth, 0, seed >>> 0, 1, featureSubsetSize);
}

export function predictTree(point, tree) {
  assertPoint(point);
  if (!tree || typeof tree !== 'object') throw new TypeError('tree must be a fitted tree');
  let node = tree;
  while (node.feature) {
    node = point[node.feature] < node.threshold ? node.left : node.right;
  }
  return node.prediction;
}

export function treeAccuracy(tree, rows = POINTS) {
  assertRows(rows, true);
  return rows.filter((row) => predictTree(row, tree) === row.label).length / rows.length;
}

export function treeSplitSegments(tree, bounds = { minX: 0, maxX: 1, minY: 0, maxY: 1 }) {
  if (!tree || typeof tree !== 'object') throw new TypeError('tree must be a fitted tree');
  const segments = [];
  collectSegments(tree, bounds, segments);
  return segments;
}

export function buildRandomForest(treeCount, maxDepth = TREE_CONFIG.defaultDepth, options = {}) {
  assertPositiveInteger(treeCount, 'treeCount');
  if (treeCount > FOREST_CONFIG.maxTrees) {
    throw new RangeError(`treeCount cannot exceed ${FOREST_CONFIG.maxTrees}`);
  }
  assertPositiveInteger(maxDepth, 'maxDepth');
  const rows = options.rows ?? POINTS;
  assertRows(rows, true);
  const seed = options.seed ?? FOREST_CONFIG.seed;
  const featureSubsetSize = options.featureSubsetSize ?? FOREST_CONFIG.featureSubsetSize;
  assertFeatureSubsetSize(featureSubsetSize);

  const trees = Array.from({ length: treeCount }, (_, index) => {
    const treeSeed = mixSeed(seed, index + 1);
    const sample = bootstrapSample(rows, treeSeed);
    const tree = fitDecisionTree(sample.rows, maxDepth, {
      featureSubsetSize,
      seed: mixSeed(treeSeed, 97),
    });
    return {
      tree,
      sampleIds: sample.rows.map((row) => row.id),
      sampleIdSet: new Set(sample.rows.map((row) => row.id)),
      oobIds: rows.filter((row) => !sample.indexSet.has(row.id)).map((row) => row.id),
    };
  });

  return { trees, treeCount, maxDepth, featureSubsetSize, seed };
}

export function forestPrediction(point, forest) {
  assertPoint(point);
  if (!forest?.trees?.length) throw new TypeError('forest must contain fitted trees');
  const votes = forest.trees.map(({ tree }) => predictTree(point, tree));
  const positiveVotes = votes.reduce((sum, vote) => sum + vote, 0);
  return {
    votes,
    positiveVotes,
    positiveVoteShare: positiveVotes / votes.length,
    label: positiveVotes * 2 >= votes.length ? 1 : 0,
  };
}

export function outOfBagReport(forest, rows = POINTS) {
  assertRows(rows, true);
  if (!forest?.trees?.length) throw new TypeError('forest must contain fitted trees');

  const rowReports = rows.map((row) => {
    const eligibleTrees = forest.trees.filter(({ oobIds }) => oobIds.includes(row.id));
    if (eligibleTrees.length === 0) return { id: row.id, eligibleTrees: 0, prediction: null, correct: null };
    const votes = eligibleTrees.map(({ tree }) => predictTree(row, tree));
    const positiveVotes = votes.reduce((sum, vote) => sum + vote, 0);
    const prediction = positiveVotes * 2 >= votes.length ? 1 : 0;
    return {
      id: row.id,
      eligibleTrees: eligibleTrees.length,
      prediction,
      correct: prediction === row.label,
    };
  });
  const scored = rowReports.filter((row) => row.prediction !== null);
  return {
    coverage: scored.length / rows.length,
    accuracy: scored.length ? scored.filter((row) => row.correct).length / scored.length : null,
    rowReports,
  };
}

export function forestDiversityDiagnostics(forest, rows = POINTS) {
  assertRows(rows, true);
  if (!forest?.trees?.length) throw new TypeError('forest must contain fitted trees');
  const fingerprints = new Set(forest.trees.map(({ sampleIds }) => sampleIds.join('|')));
  if (forest.trees.length < 2) return { uniqueBootstrapSamples: fingerprints.size, pairwiseDisagreement: 0 };

  let pairCount = 0;
  let disagreementTotal = 0;
  for (let left = 0; left < forest.trees.length; left += 1) {
    for (let right = left + 1; right < forest.trees.length; right += 1) {
      let disagreements = 0;
      for (const row of rows) {
        if (predictTree(row, forest.trees[left].tree) !== predictTree(row, forest.trees[right].tree)) disagreements += 1;
      }
      disagreementTotal += disagreements / rows.length;
      pairCount += 1;
    }
  }

  return {
    uniqueBootstrapSamples: fingerprints.size,
    pairwiseDisagreement: disagreementTotal / pairCount,
  };
}

export function fitLogisticBoosting(rounds = BOOSTING_CONFIG.defaultRounds, learningRate = BOOSTING_CONFIG.defaultLearningRate, rows = POINTS) {
  assertRows(rows, true);
  assertPositiveInteger(rounds, 'rounds');
  if (rounds > BOOSTING_CONFIG.maxRounds) throw new RangeError(`rounds cannot exceed ${BOOSTING_CONFIG.maxRounds}`);
  assertLearningRate(learningRate);

  const baseRate = rows.reduce((sum, row) => sum + row.label, 0) / rows.length;
  if (baseRate <= 0 || baseRate >= 1) throw new RangeError('boosting requires both classes');
  const baseScore = logit(baseRate);
  const scores = rows.map(() => baseScore);
  const steps = [];

  for (let round = 0; round < rounds; round += 1) {
    const residuals = rows.map((row, index) => row.label - sigmoid(scores[index]));
    const stump = fitRegressionStump(rows, residuals);
    rows.forEach((row, index) => {
      scores[index] += learningRate * regressionStumpValue(row, stump);
    });
    steps.push({ round: round + 1, ...stump, trainLogLoss: binaryLogLoss(rows, scores) });
  }

  return { baseScore, learningRate, steps };
}

export function predictBoosting(point, model) {
  assertPoint(point);
  if (!model || !Array.isArray(model.steps) || !Number.isFinite(model.baseScore)) throw new TypeError('model must be a fitted boosting model');
  let score = model.baseScore;
  const steps = model.steps.map((step) => {
    const rawContribution = regressionStumpValue(point, step);
    const delta = model.learningRate * rawContribution;
    score += delta;
    return { ...step, rawContribution, delta, score };
  });
  return { score, probability: sigmoid(score), steps };
}

export function ensembleVarianceRatio(treeCount, correlation) {
  assertPositiveInteger(treeCount, 'treeCount');
  assertCorrelation(correlation);
  return correlation + ((1 - correlation) / treeCount);
}

export function effectiveIndependentTreeCount(treeCount, correlation) {
  return 1 / ensembleVarianceRatio(treeCount, correlation);
}

export function forestDiversitySeries(correlation, maxTrees = FOREST_DIVERSITY_DEMO.maxTrees) {
  assertCorrelation(correlation);
  assertPositiveInteger(maxTrees, 'maxTrees');
  return Array.from({ length: maxTrees }, (_, index) => {
    const treeCount = index + 1;
    return {
      treeCount,
      varianceRatio: ensembleVarianceRatio(treeCount, correlation),
      independentVarianceRatio: ensembleVarianceRatio(treeCount, 0),
    };
  });
}

export function toScreen(point) {
  assertPoint(point);
  return [32 + point.x * 296, 328 - point.y * 296];
}

function buildTree(rows, maxDepth, depth, seed, nodeId, featureSubsetSize) {
  const positiveCount = rows.reduce((sum, row) => sum + row.label, 0);
  const prediction = positiveCount * 2 >= rows.length ? 1 : 0;
  const node = { prediction, count: rows.length, positiveCount, depth };
  if (depth >= maxDepth || rows.length <= TREE_CONFIG.minLeafSize || giniImpurity(rows) === 0) return node;

  const featureSubset = chooseFeatureSubset(seed, nodeId, featureSubsetSize);
  const split = bestClassificationSplit(rows, featureSubset);
  if (!split || split.gain <= 0) return node;

  const leftRows = rows.filter((row) => row[split.feature] < split.threshold);
  const rightRows = rows.filter((row) => row[split.feature] >= split.threshold);
  return {
    ...node,
    feature: split.feature,
    threshold: split.threshold,
    gain: split.gain,
    left: buildTree(leftRows, maxDepth, depth + 1, seed, nodeId * 2, featureSubsetSize),
    right: buildTree(rightRows, maxDepth, depth + 1, seed, nodeId * 2 + 1, featureSubsetSize),
  };
}

function bestClassificationSplit(rows, features) {
  const parentImpurity = giniImpurity(rows);
  let best = null;
  for (const feature of features) {
    for (const threshold of candidateThresholds(rows, feature)) {
      const left = rows.filter((row) => row[feature] < threshold);
      const right = rows.filter((row) => row[feature] >= threshold);
      if (left.length === 0 || right.length === 0) continue;
      const weightedImpurity = (left.length * giniImpurity(left) + right.length * giniImpurity(right)) / rows.length;
      const candidate = { feature, threshold, gain: parentImpurity - weightedImpurity };
      if (isBetterClassificationSplit(candidate, best)) best = candidate;
    }
  }
  return best;
}

function isBetterClassificationSplit(candidate, best) {
  if (!best) return true;
  if (candidate.gain > best.gain + 1e-12) return true;
  if (Math.abs(candidate.gain - best.gain) > 1e-12) return false;
  if (candidate.feature !== best.feature) return candidate.feature < best.feature;
  return candidate.threshold < best.threshold;
}

function candidateThresholds(rows, feature) {
  const values = [...new Set(rows.map((row) => row[feature]))].sort((a, b) => a - b);
  return values.slice(1).map((value, index) => (values[index] + value) / 2);
}

function chooseFeatureSubset(seed, nodeId, featureSubsetSize) {
  if (featureSubsetSize === FEATURES.length) return [...FEATURES];
  const start = Math.floor(pseudoRandom(mixSeed(seed, nodeId)) * FEATURES.length);
  return Array.from({ length: featureSubsetSize }, (_, offset) => FEATURES[(start + offset) % FEATURES.length]);
}

function bootstrapSample(rows, seed) {
  const sampledRows = [];
  const indexSet = new Set();
  for (let index = 0; index < rows.length; index += 1) {
    const rowIndex = Math.floor(pseudoRandom(mixSeed(seed, index + 1)) * rows.length);
    sampledRows.push(rows[rowIndex]);
    indexSet.add(rows[rowIndex].id);
  }
  return { rows: sampledRows, indexSet };
}

function fitRegressionStump(rows, targets) {
  let best = null;
  for (const feature of FEATURES) {
    for (const threshold of candidateThresholds(rows, feature)) {
      const leftIndices = [];
      const rightIndices = [];
      rows.forEach((row, index) => {
        (row[feature] < threshold ? leftIndices : rightIndices).push(index);
      });
      if (leftIndices.length === 0 || rightIndices.length === 0) continue;
      const leftValue = average(leftIndices.map((index) => targets[index]));
      const rightValue = average(rightIndices.map((index) => targets[index]));
      const squaredError = targets.reduce((sum, target, index) => {
        const prediction = rows[index][feature] < threshold ? leftValue : rightValue;
        return sum + (target - prediction) ** 2;
      }, 0);
      const candidate = { feature, threshold, leftValue, rightValue, squaredError };
      if (isBetterRegressionSplit(candidate, best)) best = candidate;
    }
  }
  if (!best) throw new Error('could not fit regression stump');
  return best;
}

function isBetterRegressionSplit(candidate, best) {
  if (!best) return true;
  if (candidate.squaredError < best.squaredError - 1e-12) return true;
  if (Math.abs(candidate.squaredError - best.squaredError) > 1e-12) return false;
  if (candidate.feature !== best.feature) return candidate.feature < best.feature;
  return candidate.threshold < best.threshold;
}

function regressionStumpValue(point, stump) {
  return point[stump.feature] < stump.threshold ? stump.leftValue : stump.rightValue;
}

function binaryLogLoss(rows, scores) {
  return rows.reduce((sum, row, index) => {
    const probability = clampProbability(sigmoid(scores[index]));
    return sum - row.label * Math.log(probability) - (1 - row.label) * Math.log(1 - probability);
  }, 0) / rows.length;
}

function collectSegments(node, bounds, segments) {
  if (!node.feature) return;
  segments.push({ feature: node.feature, threshold: node.threshold, bounds, depth: node.depth });
  if (node.feature === 'x') {
    collectSegments(node.left, { ...bounds, maxX: node.threshold }, segments);
    collectSegments(node.right, { ...bounds, minX: node.threshold }, segments);
  } else {
    collectSegments(node.left, { ...bounds, maxY: node.threshold }, segments);
    collectSegments(node.right, { ...bounds, minY: node.threshold }, segments);
  }
}

function assertRows(rows, requireBothClasses = false) {
  if (!Array.isArray(rows) || rows.length === 0) throw new TypeError('rows must be a non-empty array');
  const labels = new Set();
  for (const row of rows) {
    assertPoint(row);
    if (row.label !== 0 && row.label !== 1) throw new TypeError('row labels must be zero or one');
    labels.add(row.label);
  }
  if (requireBothClasses && labels.size < 2) throw new RangeError('rows must contain both classes');
}

function assertPoint(point) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new TypeError('point must have finite x and y coordinates');
}

function assertFeatureSubsetSize(value) {
  if (!Number.isInteger(value) || value < 1 || value > FEATURES.length) throw new RangeError(`featureSubsetSize must be from 1 to ${FEATURES.length}`);
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) throw new RangeError(`${name} must be a positive integer`);
}

function assertCorrelation(value) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError('correlation must be between 0 and 1');
}

function assertLearningRate(value) {
  if (!Number.isFinite(value) || value < BOOSTING_CONFIG.minLearningRate || value > BOOSTING_CONFIG.maxLearningRate) {
    throw new RangeError(`learningRate must be from ${BOOSTING_CONFIG.minLearningRate} to ${BOOSTING_CONFIG.maxLearningRate}`);
  }
}

function mixSeed(seed, salt) {
  let value = (seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function pseudoRandom(seed) {
  return mixSeed(seed, 0x85ebca6b) / 4294967296;
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function logit(probability) {
  const p = clampProbability(probability);
  return Math.log(p / (1 - p));
}

function clampProbability(value) {
  return Math.min(1 - BOOSTING_CONFIG.probabilityEpsilon, Math.max(BOOSTING_CONFIG.probabilityEpsilon, value));
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
