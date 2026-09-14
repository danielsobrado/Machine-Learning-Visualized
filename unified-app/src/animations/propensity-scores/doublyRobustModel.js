import { DR_TRUTH } from './doublyRobustConstants.js';

function mix(from, to, amount) {
  return from + (to - from) * amount;
}

function validateScenario(scenario) {
  if (!(scenario.highRiskShare > 0 && scenario.highRiskShare < 1)) throw new RangeError('highRiskShare must be in (0, 1)');
  if (!(scenario.propensityMisspecification >= 0 && scenario.propensityMisspecification <= 1)) throw new RangeError('propensityMisspecification must be in [0, 1]');
  if (!(scenario.outcomeMisspecification >= 0 && scenario.outcomeMisspecification <= 1)) throw new RangeError('outcomeMisspecification must be in [0, 1]');
}

function stratumModel(truth, scenario) {
  const eHat = mix(truth.propensity, 0.5, scenario.propensityMisspecification);
  const trueEffect = truth.treatmentMean - truth.controlMean;
  const assumedEffect = mix(trueEffect, 4, scenario.outcomeMisspecification);
  const m0Hat = truth.controlMean;
  const m1Hat = truth.controlMean + assumedEffect;

  return {
    ...truth,
    trueEffect,
    eHat,
    m0Hat,
    m1Hat,
    outcomeRegressionEffect: m1Hat - m0Hat,
  };
}

function aipwContribution(stratum) {
  const treatedResidual = stratum.propensity * (stratum.treatmentMean - stratum.m1Hat) / stratum.eHat;
  const controlResidual = (1 - stratum.propensity) * (stratum.controlMean - stratum.m0Hat) / (1 - stratum.eHat);
  return stratum.m1Hat - stratum.m0Hat + treatedResidual - controlResidual;
}

function ipwContribution(stratum) {
  return stratum.propensity * stratum.treatmentMean / stratum.eHat
    - (1 - stratum.propensity) * stratum.controlMean / (1 - stratum.eHat);
}

export function buildDoublyRobustLab(scenario) {
  validateScenario(scenario);
  const highWeight = scenario.highRiskShare;
  const lowWeight = 1 - highWeight;
  const low = stratumModel(DR_TRUTH.low, scenario);
  const high = stratumModel(DR_TRUTH.high, scenario);
  const weighted = (lowValue, highValue) => lowWeight * lowValue + highWeight * highValue;

  const trueAte = weighted(low.trueEffect, high.trueEffect);
  const outcomeRegression = weighted(low.outcomeRegressionEffect, high.outcomeRegressionEffect);
  const ipw = weighted(ipwContribution(low), ipwContribution(high));
  const aipw = weighted(aipwContribution(low), aipwContribution(high));

  return {
    strata: { low, high },
    metrics: {
      trueAte,
      outcomeRegression,
      ipw,
      aipw,
      outcomeBias: outcomeRegression - trueAte,
      ipwBias: ipw - trueAte,
      aipwBias: aipw - trueAte,
      propensityCorrect: scenario.propensityMisspecification === 0,
      outcomeCorrect: scenario.outcomeMisspecification === 0,
      doubleRobustCondition: scenario.propensityMisspecification === 0 || scenario.outcomeMisspecification === 0,
    },
  };
}
