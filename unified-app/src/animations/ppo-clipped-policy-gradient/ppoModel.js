function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function sigmoid(logit) {
  if (!Number.isFinite(logit)) throw new TypeError('logit must be finite');
  if (logit >= 0) {
    const z = Math.exp(-logit);
    return 1 / (1 + z);
  }
  const z = Math.exp(logit);
  return z / (1 + z);
}

export function actionProbability(logit, action) {
  if (![0, 1].includes(action)) throw new RangeError('action must be 0 or 1');
  const probability = sigmoid(logit);
  return action === 1 ? probability : 1 - probability;
}

export function policyRatio({ oldLogit, newLogit, action }) {
  const oldProbability = actionProbability(oldLogit, action);
  const newProbability = actionProbability(newLogit, action);
  return {
    oldProbability,
    newProbability,
    ratio: newProbability / oldProbability,
  };
}

export function clippedSurrogate({ ratio, advantage, epsilon }) {
  if (![ratio, advantage, epsilon].every(Number.isFinite)) throw new TypeError('PPO inputs must be finite');
  if (ratio <= 0) throw new RangeError('ratio must be positive');
  if (epsilon <= 0 || epsilon >= 1) throw new RangeError('epsilon must be in (0, 1)');
  const clippedRatio = clamp(ratio, 1 - epsilon, 1 + epsilon);
  const unclipped = ratio * advantage;
  const clipped = clippedRatio * advantage;
  const objective = Math.min(unclipped, clipped);
  return {
    clippedRatio,
    unclipped,
    clipped,
    objective,
    clippingActive: Math.abs(objective - unclipped) > 1e-12,
  };
}

export function bernoulliKl(oldLogit, newLogit) {
  const p = sigmoid(oldLogit);
  const q = sigmoid(newLogit);
  const safe = (value) => Math.max(value, 1e-15);
  return p * Math.log(safe(p) / safe(q)) + (1 - p) * Math.log(safe(1 - p) / safe(1 - q));
}

export function binaryEntropy(logit) {
  const p = sigmoid(logit);
  const safe = (value) => Math.max(value, 1e-15);
  return -(p * Math.log(safe(p)) + (1 - p) * Math.log(safe(1 - p)));
}

export function evaluatePpoSample(sample, epsilon) {
  const probabilities = policyRatio(sample);
  const surrogate = clippedSurrogate({ ratio: probabilities.ratio, advantage: sample.advantage, epsilon });
  return {
    ...sample,
    ...probabilities,
    ...surrogate,
    kl: bernoulliKl(sample.oldLogit, sample.newLogit),
    oldEntropy: binaryEntropy(sample.oldLogit),
    newEntropy: binaryEntropy(sample.newLogit),
  };
}

export function evaluatePpoBatch(samples, epsilon) {
  if (!Array.isArray(samples) || samples.length === 0) throw new TypeError('samples must be non-empty');
  const rows = samples.map((sample) => evaluatePpoSample(sample, epsilon));
  const mean = (field) => rows.reduce((sum, row) => sum + row[field], 0) / rows.length;
  return {
    rows,
    meanObjective: mean('objective'),
    meanUnclipped: mean('unclipped'),
    meanKl: mean('kl'),
    meanEntropyChange: rows.reduce((sum, row) => sum + row.newEntropy - row.oldEntropy, 0) / rows.length,
    clipFraction: rows.filter((row) => row.clippingActive).length / rows.length,
    maxRatioDeviation: Math.max(...rows.map((row) => Math.abs(row.ratio - 1))),
  };
}

export function buildPpoCounterexamples(epsilon = 0.2) {
  const positiveHelpful = clippedSurrogate({ ratio: 1.8, advantage: 2, epsilon });
  const positiveWrongWay = clippedSurrogate({ ratio: 0.3, advantage: 2, epsilon });
  const negativeHelpful = clippedSurrogate({ ratio: 0.3, advantage: -2, epsilon });
  const negativeWrongWay = clippedSurrogate({ ratio: 1.8, advantage: -2, epsilon });
  return { positiveHelpful, positiveWrongWay, negativeHelpful, negativeWrongWay };
}
