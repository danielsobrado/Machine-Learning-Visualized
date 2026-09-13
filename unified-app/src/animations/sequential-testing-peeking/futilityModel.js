import { inverseNormalCdf } from './sequentialTestingModel.js';

function erf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * x);
  const polynomial = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  return sign * (1 - polynomial * Math.exp(-x * x));
}

function normalCdf(value) {
  return 0.5 * (1 + erf(value / Math.SQRT2));
}

function assertScenario(scenario) {
  if (!(scenario.informationFraction > 0 && scenario.informationFraction < 1)) throw new RangeError('informationFraction must be in (0, 1)');
  if (!(scenario.maxPerArm > 0)) throw new RangeError('maxPerArm must be positive');
  if (!(scenario.finalAlphaTwoSided > 0 && scenario.finalAlphaTwoSided < 1)) throw new RangeError('finalAlphaTwoSided must be in (0, 1)');
  if (!(scenario.futilityThreshold > 0 && scenario.futilityThreshold < 1)) throw new RangeError('futilityThreshold must be in (0, 1)');
}

export function conditionalPower(scenario) {
  assertScenario(scenario);
  const t = scenario.informationFraction;
  const finalCriticalZ = inverseNormalCdf(1 - scenario.finalAlphaTwoSided / 2);
  const finalSignal = scenario.assumedEffect * Math.sqrt(scenario.maxPerArm / 2);
  const conditionalMean = scenario.currentZ * Math.sqrt(t) + finalSignal * (1 - t);
  const conditionalSd = Math.sqrt(1 - t);
  const power = 1 - normalCdf((finalCriticalZ - conditionalMean) / conditionalSd);
  const currentPerArm = Math.round(scenario.maxPerArm * t);

  return {
    power,
    finalCriticalZ,
    finalSignal,
    conditionalMean,
    conditionalSd,
    currentPerArm,
    remainingPerArm: scenario.maxPerArm - currentPerArm,
    stopForFutility: power < scenario.futilityThreshold,
  };
}

export function buildFutilityLab(scenario) {
  const metrics = conditionalPower(scenario);
  const impliedObservedEffect = scenario.currentZ * Math.sqrt(2 / Math.max(1, metrics.currentPerArm));
  return {
    metrics: {
      ...metrics,
      impliedObservedEffect,
      informationRemaining: 1 - scenario.informationFraction,
    },
  };
}
