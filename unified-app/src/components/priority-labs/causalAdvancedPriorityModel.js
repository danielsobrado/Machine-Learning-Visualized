const EPSILON = 1e-12;

function clampProbability(value) {
  return Math.min(1 - EPSILON, Math.max(EPSILON, value));
}

function normalCdf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf = sign * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x));
  return 0.5 * (1 + erf);
}

export function buildFrontDoorAdjustmentLab({
  pTreatment,
  pMediatorGivenControl,
  pMediatorGivenTreatment,
  outcome,
}) {
  const pX1 = clampProbability(pTreatment);
  const pX0 = 1 - pX1;

  const mediatorOutcome0 = pX0 * outcome.m0x0 + pX1 * outcome.m0x1;
  const mediatorOutcome1 = pX0 * outcome.m1x0 + pX1 * outcome.m1x1;

  const doControl = (1 - pMediatorGivenControl) * mediatorOutcome0
    + pMediatorGivenControl * mediatorOutcome1;
  const doTreatment = (1 - pMediatorGivenTreatment) * mediatorOutcome0
    + pMediatorGivenTreatment * mediatorOutcome1;

  return {
    mediatorOutcome0,
    mediatorOutcome1,
    doControl,
    doTreatment,
    frontDoorEffect: doTreatment - doControl,
  };
}

export function buildPartialPoolingLab({
  subgroupEffect,
  subgroupStandardError,
  populationMean,
  betweenGroupSd,
}) {
  if (subgroupStandardError <= 0 || betweenGroupSd <= 0) {
    throw new RangeError('Standard errors and between-group SD must be positive.');
  }

  const samplingVariance = subgroupStandardError ** 2;
  const betweenVariance = betweenGroupSd ** 2;
  const dataWeight = betweenVariance / (betweenVariance + samplingVariance);
  const pooledEffect = dataWeight * subgroupEffect + (1 - dataWeight) * populationMean;
  const posteriorVariance = 1 / (1 / samplingVariance + 1 / betweenVariance);

  return {
    dataWeight,
    populationWeight: 1 - dataWeight,
    pooledEffect,
    pooledStandardError: Math.sqrt(posteriorVariance),
    shrinkage: pooledEffect - subgroupEffect,
  };
}

export function buildDoublyRobustEssLab(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new RangeError('At least one observation is required.');
  }

  const contributions = rows.map((row) => {
    const propensity = clampProbability(row.propensity);
    const plugin = row.mu1 - row.mu0;
    const correction = row.treatment === 1
      ? (row.outcome - row.mu1) / propensity
      : -(row.outcome - row.mu0) / (1 - propensity);
    const weight = row.treatment === 1 ? 1 / propensity : 1 / (1 - propensity);

    return {
      ...row,
      propensity,
      plugin,
      correction,
      aipwContribution: plugin + correction,
      weight,
    };
  });

  const pluginEstimate = contributions.reduce((sum, row) => sum + row.plugin, 0) / contributions.length;
  const aipwEstimate = contributions.reduce((sum, row) => sum + row.aipwContribution, 0) / contributions.length;
  const weightSum = contributions.reduce((sum, row) => sum + row.weight, 0);
  const squaredWeightSum = contributions.reduce((sum, row) => sum + row.weight ** 2, 0);
  const effectiveSampleSize = weightSum ** 2 / squaredWeightSum;
  const maxWeight = Math.max(...contributions.map((row) => row.weight));

  return {
    contributions,
    pluginEstimate,
    aipwEstimate,
    correction: aipwEstimate - pluginEstimate,
    effectiveSampleSize,
    essFraction: effectiveSampleSize / contributions.length,
    maxWeight,
  };
}

export function buildMatchingVsStandardizationLab({
  lowShareTreated,
  lowShareTarget,
  lowControl,
  lowTreated,
  highControl,
  highTreated,
}) {
  const lowEffect = lowTreated - lowControl;
  const highEffect = highTreated - highControl;
  const matchedAtt = lowShareTreated * lowEffect + (1 - lowShareTreated) * highEffect;
  const standardizedAte = lowShareTarget * lowEffect + (1 - lowShareTarget) * highEffect;

  return {
    lowEffect,
    highEffect,
    matchedAtt,
    standardizedAte,
    estimandGap: matchedAtt - standardizedAte,
  };
}

export function buildMultiCovariateCupedLab({ firstR2, secondPartialR2, thirdPartialR2 }) {
  const values = [firstR2, secondPartialR2, thirdPartialR2];
  if (values.some((value) => value < 0 || value >= 1)) {
    throw new RangeError('R-squared values must be in [0, 1).');
  }

  const afterFirst = firstR2;
  const afterSecond = afterFirst + (1 - afterFirst) * secondPartialR2;
  const afterThird = afterSecond + (1 - afterSecond) * thirdPartialR2;
  const varianceLeft = 1 - afterThird;

  return {
    afterFirst,
    afterSecond,
    afterThird,
    secondIncrement: afterSecond - afterFirst,
    thirdIncrement: afterThird - afterSecond,
    varianceLeft,
    standardErrorRatio: Math.sqrt(varianceLeft),
    sampleEquivalentMultiplier: 1 / varianceLeft,
  };
}

export function buildSequentialObservedZLab({ look, looks, observedZ, boundaryConstant }) {
  if (!Number.isInteger(look) || !Number.isInteger(looks) || look < 1 || look > looks) {
    throw new RangeError('Look must be an integer between one and the total number of looks.');
  }
  if (boundaryConstant <= 0) throw new RangeError('Boundary constant must be positive.');

  const information = look / looks;
  const criticalZ = boundaryConstant / Math.sqrt(information);
  const absoluteObservedZ = Math.abs(observedZ);
  const nominalTwoSidedP = 2 * (1 - normalCdf(absoluteObservedZ));

  return {
    information,
    criticalZ,
    absoluteObservedZ,
    nominalTwoSidedP,
    stopForEfficacy: absoluteObservedZ >= criticalZ,
    distanceToBoundary: absoluteObservedZ - criticalZ,
  };
}
