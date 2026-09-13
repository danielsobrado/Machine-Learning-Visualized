import { actorCriticStep } from './actorCriticModel.js';

export function criticBiasComparison({
  policyLogit = 0,
  sampledAction = 1,
  targetValue = 8,
  trueStateValue = 5,
  criticValue = 9,
  actorStep = 0.2,
} = {}) {
  [targetValue, trueStateValue, criticValue, actorStep].forEach((value) => {
    if (!Number.isFinite(value)) throw new TypeError('critic bias inputs must be finite');
  });

  const ideal = actorCriticStep({
    policyLogit,
    sampledAction,
    targetValue,
    criticValue: trueStateValue,
    actorStep,
    criticStep: 0.1,
  });
  const estimated = actorCriticStep({
    policyLogit,
    sampledAction,
    targetValue,
    criticValue,
    actorStep,
    criticStep: 0.1,
  });
  const idealSign = Math.sign(ideal.actorDelta);
  const estimatedSign = Math.sign(estimated.actorDelta);

  return {
    ideal,
    estimated,
    criticError: criticValue - trueStateValue,
    actorDeltaError: estimated.actorDelta - ideal.actorDelta,
    directionFlipped: idealSign !== 0 && estimatedSign !== 0 && idealSign !== estimatedSign,
    updateSuppressed: idealSign !== 0 && estimatedSign === 0,
  };
}
