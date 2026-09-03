import {
  BOOSTING_STEPS,
  FOREST_DIVERSITY_DEMO,
  FOREST_RULES,
  POINTS,
} from './treeEnsemblesConstants.js';

export { POINTS } from './treeEnsemblesConstants.js';

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

function assertCorrelation(value) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError('correlation must be between 0 and 1');
  }
}

export function predictTree(point, depth) {
  if (point.x < 0.52) {
    if (depth === 1) return 0;
    return point.y > 0.68 ? 1 : 0;
  }

  if (depth === 1) return 1;
  if (depth === 2) return point.y > 0.42 ? 1 : 0;
  return point.y > 0.42 || point.x > 0.78 ? 1 : 0;
}

export function ruleVote(point, rule) {
  const raw = point[rule.feature] >= rule.threshold ? 1 : 0;
  return rule.polarity === 1 ? raw : 1 - raw;
}

export function forestPrediction(point, treeCount) {
  assertPositiveInteger(treeCount, 'treeCount');
  if (treeCount > FOREST_RULES.length) {
    throw new RangeError(`treeCount cannot exceed ${FOREST_RULES.length} in this teaching forest`);
  }

  const votes = FOREST_RULES.slice(0, treeCount).map((rule) => ruleVote(point, rule));
  const positiveVotes = votes.filter(Boolean).length;
  return {
    votes,
    positiveVotes,
    positiveVoteShare: positiveVotes / votes.length,
    label: positiveVotes >= Math.ceil(votes.length / 2) ? 1 : 0,
  };
}

export function boostedScore(point, rounds, learningRate) {
  let score = -0.15;
  const steps = BOOSTING_STEPS.slice(0, rounds).map((step) => {
    const matched =
      (step.rule === 'x > 0.50' && point.x > 0.5) ||
      (step.rule === 'y > 0.55' && point.y > 0.55) ||
      (step.rule === 'x > 0.75' && point.x > 0.75) ||
      (step.rule === 'y < 0.32' && point.y < 0.32) ||
      (step.rule === 'x < 0.28' && point.x < 0.28);
    const delta = matched ? step.contribution * learningRate : 0;
    score += delta;
    return { ...step, matched, delta, score };
  });
  return { score, probability: 1 / (1 + Math.exp(-score * 2.4)), steps };
}

export function ensembleVarianceRatio(treeCount, correlation) {
  assertPositiveInteger(treeCount, 'treeCount');
  assertCorrelation(correlation);
  return correlation + ((1 - correlation) / treeCount);
}

export function effectiveIndependentTreeCount(treeCount, correlation) {
  return 1 / ensembleVarianceRatio(treeCount, correlation);
}

export function forestDiversitySeries(
  correlation,
  maxTrees = FOREST_DIVERSITY_DEMO.maxTrees,
) {
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

export function accuracy(depth) {
  const correct = POINTS.filter((point) => predictTree(point, depth) === point.label).length;
  return correct / POINTS.length;
}

export function toScreen(point) {
  return [32 + point.x * 296, 328 - point.y * 296];
}
