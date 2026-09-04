const EPSILON = 1e-12;

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function populationStd(values) {
  const center = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - center) ** 2)));
}

function validateProbability(value, name) {
  if (!Number.isFinite(value) || value <= 0 || value >= 1) {
    throw new RangeError(`${name} must be strictly between zero and one`);
  }
}

export function groupAdvantages(rewards) {
  if (!Array.isArray(rewards) || rewards.length < 2 || rewards.some((value) => !Number.isFinite(value))) {
    throw new TypeError('rewards must contain at least two finite values');
  }
  const rewardMean = mean(rewards);
  const rewardStd = populationStd(rewards);
  const advantages = rewardStd <= EPSILON
    ? rewards.map(() => 0)
    : rewards.map((reward) => (reward - rewardMean) / rewardStd);
  return { rewardMean, rewardStd, advantages };
}

export function importanceRatio(oldProbability, newProbability) {
  validateProbability(oldProbability, 'oldProbability');
  validateProbability(newProbability, 'newProbability');
  return newProbability / oldProbability;
}

export function clippedSurrogate(ratio, advantage, clipEpsilon) {
  if (![ratio, advantage, clipEpsilon].every(Number.isFinite)) throw new TypeError('surrogate inputs must be finite');
  if (ratio <= 0) throw new RangeError('ratio must be positive');
  if (clipEpsilon <= 0 || clipEpsilon >= 1) throw new RangeError('clipEpsilon must be in (0, 1)');
  const clippedRatio = Math.min(Math.max(ratio, 1 - clipEpsilon), 1 + clipEpsilon);
  const unclipped = ratio * advantage;
  const clipped = clippedRatio * advantage;
  const objective = Math.min(unclipped, clipped);
  return { ratio, clippedRatio, unclipped, clipped, objective, clippedActive: Math.abs(objective - unclipped) > 1e-12 };
}

export function binaryKl(newProbability, referenceProbability) {
  validateProbability(newProbability, 'newProbability');
  validateProbability(referenceProbability, 'referenceProbability');
  const p = newProbability;
  const q = referenceProbability;
  return p * Math.log(p / q) + (1 - p) * Math.log((1 - p) / (1 - q));
}

export function buildGrpoLab({ rewards, oldProbabilities, newProbabilities, clipEpsilon, klBeta }) {
  if (![oldProbabilities, newProbabilities].every(Array.isArray)) throw new TypeError('probability arrays are required');
  if (rewards.length !== oldProbabilities.length || rewards.length !== newProbabilities.length) throw new RangeError('reward and probability arrays must have equal length');
  if (!Number.isFinite(klBeta) || klBeta < 0) throw new RangeError('klBeta must be non-negative');

  const normalized = groupAdvantages(rewards);
  const rows = rewards.map((reward, index) => {
    const oldProbability = oldProbabilities[index];
    const newProbability = newProbabilities[index];
    const ratio = importanceRatio(oldProbability, newProbability);
    const surrogate = clippedSurrogate(ratio, normalized.advantages[index], clipEpsilon);
    const kl = binaryKl(newProbability, oldProbability);
    return { index, reward, advantage: normalized.advantages[index], oldProbability, newProbability, kl, ...surrogate, penalizedObjective: surrogate.objective - klBeta * kl };
  });

  const positiveCount = rows.filter((row) => row.advantage > EPSILON).length;
  const negativeCount = rows.filter((row) => row.advantage < -EPSILON).length;
  const zeroCount = rows.length - positiveCount - negativeCount;
  return {
    ...normalized,
    rows,
    positiveCount,
    negativeCount,
    zeroCount,
    usefulSignal: normalized.rewardStd > EPSILON,
    clipFraction: mean(rows.map((row) => row.clippedActive ? 1 : 0)),
    meanKl: mean(rows.map((row) => row.kl)),
    meanObjective: mean(rows.map((row) => row.objective)),
    meanPenalizedObjective: mean(rows.map((row) => row.penalizedObjective)),
  };
}
