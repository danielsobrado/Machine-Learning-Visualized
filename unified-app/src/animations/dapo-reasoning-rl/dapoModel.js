const EPSILON = 1e-12;

function mean(values) { return values.reduce((sum, value) => sum + value, 0) / values.length; }

export function normalizedAdvantages(rewards) {
  if (!Array.isArray(rewards) || rewards.length < 2 || rewards.some((value) => !Number.isFinite(value))) throw new TypeError('rewards must contain at least two finite values');
  const center = mean(rewards);
  const std = Math.sqrt(mean(rewards.map((value) => (value - center) ** 2)));
  return std <= EPSILON ? rewards.map(() => 0) : rewards.map((value) => (value - center) / std);
}

export function isDynamicSamplingGroup(rewards) {
  const positives = rewards.filter((reward) => reward > 0).length;
  return positives > 0 && positives < rewards.length;
}

export function asymmetricClippedSurrogate(ratio, advantage, lowerEpsilon, upperEpsilon) {
  if (![ratio, advantage, lowerEpsilon, upperEpsilon].every(Number.isFinite)) throw new TypeError('inputs must be finite');
  if (ratio <= 0) throw new RangeError('ratio must be positive');
  if (lowerEpsilon <= 0 || upperEpsilon <= 0) throw new RangeError('clip epsilons must be positive');
  const clippedRatio = Math.min(Math.max(ratio, 1 - lowerEpsilon), 1 + upperEpsilon);
  const raw = ratio * advantage;
  const clipped = clippedRatio * advantage;
  const objective = Math.min(raw, clipped);
  return { ratio, clippedRatio, raw, clipped, objective, clippedActive: Math.abs(raw - objective) > 1e-12 };
}

export function sequenceLevelObjective(sequences, advantages, lowerEpsilon, upperEpsilon) {
  if (sequences.length !== advantages.length) throw new RangeError('sequences and advantages must align');
  const sequenceMeans = sequences.map((ratios, index) => mean(ratios.map((ratio) => asymmetricClippedSurrogate(ratio, advantages[index], lowerEpsilon, upperEpsilon).objective)));
  return mean(sequenceMeans);
}

export function tokenLevelObjective(sequences, advantages, lowerEpsilon, upperEpsilon) {
  if (sequences.length !== advantages.length) throw new RangeError('sequences and advantages must align');
  const tokenTerms = sequences.flatMap((ratios, index) => ratios.map((ratio) => asymmetricClippedSurrogate(ratio, advantages[index], lowerEpsilon, upperEpsilon).objective));
  return mean(tokenTerms);
}

export function overlongPenalty(length, maxLength, cacheLength) {
  if (![length, maxLength, cacheLength].every(Number.isFinite)) throw new TypeError('length inputs must be finite');
  if (length < 0 || maxLength <= 0 || cacheLength <= 0 || cacheLength > maxLength) throw new RangeError('invalid length settings');
  const safeLength = maxLength - cacheLength;
  if (length <= safeLength) return 0;
  if (length > maxLength) return -1;
  return (safeLength - length) / cacheLength;
}

export function buildDapoLab({ groups, lowerEpsilon, upperEpsilon, maxLength, cacheLength }) {
  const rows = groups.map((group) => {
    const advantages = normalizedAdvantages(group.rewards);
    const sampleObjective = sequenceLevelObjective(group.sequences, advantages, lowerEpsilon, upperEpsilon);
    const tokenObjective = tokenLevelObjective(group.sequences, advantages, lowerEpsilon, upperEpsilon);
    const tokenCount = group.sequences.reduce((sum, sequence) => sum + sequence.length, 0);
    const clippedTokens = group.sequences.flatMap((sequence, index) => sequence.map((ratio) => asymmetricClippedSurrogate(ratio, advantages[index], lowerEpsilon, upperEpsilon).clippedActive)).filter(Boolean).length;
    return { ...group, advantages, useful: isDynamicSamplingGroup(group.rewards), sampleObjective, tokenObjective, tokenCount, clippedTokens, clipFraction: tokenCount ? clippedTokens / tokenCount : 0 };
  });
  const usefulGroups = rows.filter((row) => row.useful).length;
  return {
    rows,
    usefulGroups,
    totalGroups: rows.length,
    retainedFraction: usefulGroups / rows.length,
    lengthExamples: [maxLength - cacheLength, maxLength - cacheLength / 2, maxLength, maxLength + 1].map((length) => ({ length, penalty: overlongPenalty(length, maxLength, cacheLength) })),
  };
}
