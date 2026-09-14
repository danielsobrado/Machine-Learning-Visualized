const NORMAL_975 = 1.959963984540054;
const EULER = Math.E;

function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalCdf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf = sign * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x));
  return 0.5 * (1 + erf);
}

export function buildDagPathLab({ conditionMediator, conditionCollider }) {
  return {
    totalEffectStatus: conditionMediator ? 'blocked' : 'open',
    colliderPathStatus: conditionCollider ? 'opened by conditioning' : 'closed naturally',
    frontdoorMessage: conditionMediator
      ? 'Holding the mediator fixed estimates a direct-effect contrast; it is not the front-door adjustment.'
      : 'Front-door identification uses the mediator as an intermediate identification bridge. It does not estimate the total effect by naively conditioning M away.',
    safeForTotalEffect: !conditionMediator && !conditionCollider,
  };
}

export function buildTreatmentInferenceLab({ effect, standardError, subgroupCount, alpha }) {
  const halfWidth = NORMAL_975 * standardError;
  const familywiseFalsePositiveRisk = 1 - (1 - alpha) ** subgroupCount;
  return {
    lower: effect - halfWidth,
    upper: effect + halfWidth,
    statisticallySeparatedFromZero: effect - halfWidth > 0 || effect + halfWidth < 0,
    familywiseFalsePositiveRisk,
    subgroupCount,
  };
}

export function standardizedMeanDifference(treatedMean, controlMean, pooledSd) {
  if (pooledSd <= 0) throw new RangeError('Pooled standard deviation must be positive.');
  return (treatedMean - controlMean) / pooledSd;
}

export function buildPropensityBalanceLab(scenario) {
  const beforeSmd = standardizedMeanDifference(
    scenario.treatedMean,
    scenario.controlMean,
    scenario.pooledSd,
  );
  const afterSmd = standardizedMeanDifference(
    scenario.trimmedTreatedMean,
    scenario.trimmedControlMean,
    scenario.trimmedPooledSd,
  );
  return {
    beforeSmd,
    afterSmd,
    improved: Math.abs(afterSmd) < Math.abs(beforeSmd),
    passesCommonBalanceHeuristic: Math.abs(afterSmd) < 0.1,
    extremeWeightShare: scenario.extremeWeightShare,
  };
}

export function buildStandardizationLab(scenario) {
  const lowEffect = scenario.lowTreated - scenario.lowControl;
  const highEffect = scenario.highTreated - scenario.highControl;
  const observedTreated = scenario.lowShareTreated * scenario.lowTreated
    + (1 - scenario.lowShareTreated) * scenario.highTreated;
  const observedControl = scenario.lowShareControl * scenario.lowControl
    + (1 - scenario.lowShareControl) * scenario.highControl;
  const targetStandardizedEffect = scenario.lowShareTarget * lowEffect
    + (1 - scenario.lowShareTarget) * highEffect;

  return {
    lowEffect,
    highEffect,
    crudeEffect: observedTreated - observedControl,
    targetStandardizedEffect,
    compositionGap: scenario.lowShareTreated - scenario.lowShareControl,
  };
}

export function buildCupedCovariateLab({ rSquared, postTreatmentCovariate }) {
  const boundedR2 = Math.min(0.99, Math.max(0, rSquared));
  const varianceLeft = 1 - boundedR2;
  return {
    varianceLeft,
    standardErrorRatio: Math.sqrt(varianceLeft),
    sampleEquivalentMultiplier: 1 / varianceLeft,
    valid: !postTreatmentCovariate,
    warning: postTreatmentCovariate
      ? 'A post-treatment covariate can absorb part of the treatment effect and break the pre-treatment CUPED logic.'
      : 'Pre-treatment predictive covariates can reduce variance without redefining the treatment effect.',
  };
}

export function buildSequentialSpendingLab({ alpha, looks }) {
  if (alpha !== 0.05) {
    throw new RangeError('The visual O’Brien-Fleming preset is calibrated for alpha = 0.05.');
  }
  if (looks < 2) throw new RangeError('Sequential testing needs at least two looks.');

  const rows = Array.from({ length: looks }, (_, index) => {
    const information = (index + 1) / looks;
    const obrienFleming = 2 - 2 * normalCdf(NORMAL_975 / Math.sqrt(information));
    const pocock = alpha * Math.log(1 + (EULER - 1) * information);
    return {
      look: index + 1,
      information,
      obrienFleming: Math.min(alpha, obrienFleming),
      pocock: Math.min(alpha, pocock),
    };
  });

  return {
    rows: rows.map((row) => ({
      ...row,
      information: round(row.information),
      obrienFleming: round(row.obrienFleming, 4),
      pocock: round(row.pocock, 4),
    })),
    alpha,
  };
}
