export function sigmoid(value) {
  if (!Number.isFinite(value)) throw new TypeError('value must be finite');
  if (value >= 0) {
    const z = Math.exp(-value);
    return 1 / (1 + z);
  }
  const z = Math.exp(value);
  return z / (1 + z);
}

export function policyScoreGradient({ policyLogit, sampledAction }) {
  if (![0, 1].includes(sampledAction)) throw new RangeError('sampledAction must be 0 or 1');
  const probability = sigmoid(policyLogit);
  return {
    probability,
    scoreGradient: sampledAction - probability,
  };
}

export function tdTarget({ reward, gamma, nextValue, terminal = false }) {
  [reward, gamma, nextValue].forEach((value) => {
    if (!Number.isFinite(value)) throw new TypeError('TD inputs must be finite');
  });
  if (gamma < 0 || gamma > 1) throw new RangeError('gamma must be in [0, 1]');
  return reward + (terminal ? 0 : gamma * nextValue);
}

export function actorCriticStep({
  policyLogit,
  sampledAction,
  targetValue,
  criticValue,
  actorStep,
  criticStep,
}) {
  [targetValue, criticValue, actorStep, criticStep].forEach((value) => {
    if (!Number.isFinite(value)) throw new TypeError('actor-critic inputs must be finite');
  });
  if (actorStep <= 0 || criticStep <= 0) throw new RangeError('step sizes must be positive');

  const { probability, scoreGradient } = policyScoreGradient({ policyLogit, sampledAction });
  const advantage = targetValue - criticValue;
  const actorDelta = actorStep * advantage * scoreGradient;
  const criticDelta = criticStep * advantage;
  return {
    probability,
    scoreGradient,
    advantage,
    actorDelta,
    nextPolicyLogit: policyLogit + actorDelta,
    nextProbability: sigmoid(policyLogit + actorDelta),
    criticDelta,
    nextCritic: criticValue + criticDelta,
  };
}

export function policySensitivityExperiment({ advantage = 4, actorStep = 0.4, sampledAction = 1 } = {}) {
  const logits = [0, Math.log(19)];
  return logits.map((policyLogit) => ({
    policyLogit,
    ...actorCriticStep({
      policyLogit,
      sampledAction,
      targetValue: advantage,
      criticValue: 0,
      actorStep,
      criticStep: 0.1,
    }),
  }));
}
