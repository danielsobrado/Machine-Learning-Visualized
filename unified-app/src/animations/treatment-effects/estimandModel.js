function weightedAverage(highValue, lowValue, highWeight) {
  return highValue * highWeight + lowValue * (1 - highWeight);
}

function safeShare(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

export function buildEstimandLab(scenario) {
  const highPopulation = scenario.responsiveShare;
  const lowPopulation = 1 - highPopulation;
  const treatedShare = (
    highPopulation * scenario.responsiveTreatmentRate
    + lowPopulation * scenario.otherTreatmentRate
  );
  const controlShare = 1 - treatedShare;

  const highAmongTreated = safeShare(
    highPopulation * scenario.responsiveTreatmentRate,
    treatedShare,
  );
  const highAmongControl = safeShare(
    highPopulation * (1 - scenario.responsiveTreatmentRate),
    controlShare,
  );

  const ate = weightedAverage(scenario.highEffect, scenario.lowEffect, highPopulation);
  const att = weightedAverage(scenario.highEffect, scenario.lowEffect, highAmongTreated);
  const atc = weightedAverage(scenario.highEffect, scenario.lowEffect, highAmongControl);

  return {
    metrics: {
      ate,
      att,
      atc,
      treatedShare,
      controlShare,
      highPopulation,
      highAmongTreated,
      highAmongControl,
      selectionGap: highAmongTreated - highAmongControl,
      attMinusAte: att - ate,
      atcMinusAte: atc - ate,
      homogeneousEffects: Math.abs(scenario.highEffect - scenario.lowEffect) < 1e-12,
    },
  };
}
