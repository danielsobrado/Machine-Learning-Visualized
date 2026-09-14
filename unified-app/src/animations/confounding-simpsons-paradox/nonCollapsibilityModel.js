function odds(probability) {
  return probability / (1 - probability);
}

function probabilityFromOdds(value) {
  return value / (1 + value);
}

function treatedRisk(controlRisk, oddsRatio) {
  return probabilityFromOdds(odds(controlRisk) * oddsRatio);
}

function weightedAverage(low, high, highRiskShare) {
  return low * (1 - highRiskShare) + high * highRiskShare;
}

export function buildNonCollapsibilityLab(scenario) {
  if (!(scenario.lowBaseline > 0 && scenario.lowBaseline < 1)) throw new RangeError('lowBaseline must be in (0, 1)');
  if (!(scenario.highBaseline > 0 && scenario.highBaseline < 1)) throw new RangeError('highBaseline must be in (0, 1)');
  if (!(scenario.commonOddsRatio > 0)) throw new RangeError('commonOddsRatio must be positive');
  if (!(scenario.highRiskShare > 0 && scenario.highRiskShare < 1)) throw new RangeError('highRiskShare must be in (0, 1)');

  const lowTreated = treatedRisk(scenario.lowBaseline, scenario.commonOddsRatio);
  const highTreated = treatedRisk(scenario.highBaseline, scenario.commonOddsRatio);
  const marginalControl = weightedAverage(scenario.lowBaseline, scenario.highBaseline, scenario.highRiskShare);
  const marginalTreated = weightedAverage(lowTreated, highTreated, scenario.highRiskShare);
  const marginalOddsRatio = odds(marginalTreated) / odds(marginalControl);

  return {
    strata: {
      low: {
        controlRisk: scenario.lowBaseline,
        treatedRisk: lowTreated,
        oddsRatio: odds(lowTreated) / odds(scenario.lowBaseline),
      },
      high: {
        controlRisk: scenario.highBaseline,
        treatedRisk: highTreated,
        oddsRatio: odds(highTreated) / odds(scenario.highBaseline),
      },
    },
    metrics: {
      marginalControl,
      marginalTreated,
      marginalOddsRatio,
      conditionalOddsRatio: scenario.commonOddsRatio,
      oddsRatioGap: marginalOddsRatio - scenario.commonOddsRatio,
      treatedHighRiskShare: scenario.highRiskShare,
      controlHighRiskShare: scenario.highRiskShare,
      baselineGap: scenario.highBaseline - scenario.lowBaseline,
      noConfounding: true,
    },
  };
}
