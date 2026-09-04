const EPSILON = 1e-12;
function mean(values) { return values.reduce((sum, value) => sum + value, 0) / values.length; }

export function standardizedBinaryRewards(rewards) {
  if (!Array.isArray(rewards) || rewards.length < 2 || rewards.some((value) => value !== 0 && value !== 1)) throw new TypeError('rewards must contain at least two binary values');
  const center = mean(rewards);
  const std = Math.sqrt(mean(rewards.map((value) => (value - center) ** 2)));
  return { mean: center, std, advantages: std <= EPSILON ? rewards.map(() => 0) : rewards.map((value) => (value - center) / std) };
}

export function passAtK(successProbability, k) {
  if (!Number.isFinite(successProbability) || successProbability < 0 || successProbability > 1) throw new RangeError('successProbability must be in [0,1]');
  if (!Number.isInteger(k) || k <= 0) throw new RangeError('k must be a positive integer');
  return 1 - (1 - successProbability) ** k;
}

export function usefulBinaryGroupProbability(successProbability, groupSize) {
  if (!Number.isFinite(successProbability) || successProbability < 0 || successProbability > 1) throw new RangeError('successProbability must be in [0,1]');
  if (!Number.isInteger(groupSize) || groupSize < 2) throw new RangeError('groupSize must be at least two');
  return 1 - successProbability ** groupSize - (1 - successProbability) ** groupSize;
}

export function buildRlvrLab({ candidates, independentSuccessProbability, samplesK, groupSize }) {
  if (!Array.isArray(candidates) || candidates.length < 2) throw new TypeError('candidates are required');
  const rewards = candidates.map((candidate) => candidate.verifierPass ? 1 : 0);
  const normalized = standardizedBinaryRewards(rewards);
  const rows = candidates.map((candidate, index) => ({ ...candidate, reward: rewards[index], advantage: normalized.advantages[index], alignedSignal: normalized.advantages[index] === 0 ? null : (normalized.advantages[index] > 0) === candidate.correct }));
  const directionalRows = rows.filter((row) => row.advantage !== 0);
  const alignedCount = directionalRows.filter((row) => row.alignedSignal).length;
  return {
    rows,
    rewardMean: normalized.mean,
    rewardStd: normalized.std,
    usefulSignal: normalized.std > EPSILON,
    signalAlignment: directionalRows.length ? alignedCount / directionalRows.length : null,
    falsePositiveCount: rows.filter((row) => !row.correct && row.verifierPass).length,
    falseNegativeCount: rows.filter((row) => row.correct && !row.verifierPass).length,
    passAtK: passAtK(independentSuccessProbability, samplesK),
    usefulGroupProbability: usefulBinaryGroupProbability(independentSuccessProbability, groupSize),
  };
}
