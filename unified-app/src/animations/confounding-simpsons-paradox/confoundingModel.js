function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function safeRate(successes, total) {
  return total === 0 ? 0 : successes / total;
}

function makeCell(segment, treated, n, probability) {
  const successes = Math.round(n * clamp(probability, 0, 1));
  return { segment, treated, n, successes, failures: n - successes, rate: safeRate(successes, n) };
}

export function buildStratifiedCounts(scenario) {
  const highTotal = Math.round(scenario.sampleSize * scenario.highRiskShare);
  const lowTotal = scenario.sampleSize - highTotal;
  const highTreatProbability = clamp(0.5 + scenario.assignmentBias, 0.05, 0.95);
  const lowTreatProbability = clamp(0.5 - scenario.assignmentBias, 0.05, 0.95);
  const highTreated = Math.round(highTotal * highTreatProbability);
  const lowTreated = Math.round(lowTotal * lowTreatProbability);
  const lowControlRate = 0.72;
  const highControlRate = clamp(lowControlRate - scenario.baselineGap, 0.05, 0.95);

  return [
    makeCell('High risk', true, highTreated, highControlRate + scenario.withinLift),
    makeCell('High risk', false, highTotal - highTreated, highControlRate),
    makeCell('Low risk', true, lowTreated, lowControlRate + scenario.withinLift),
    makeCell('Low risk', false, lowTotal - lowTreated, lowControlRate),
  ];
}

function summarizeArm(cells, treated) {
  const selected = cells.filter((cell) => cell.treated === treated);
  const n = selected.reduce((sum, cell) => sum + cell.n, 0);
  const successes = selected.reduce((sum, cell) => sum + cell.successes, 0);
  return { n, successes, rate: safeRate(successes, n) };
}

export function buildConfoundingLab(scenario) {
  const cells = buildStratifiedCounts(scenario);
  const treatment = summarizeArm(cells, true);
  const control = summarizeArm(cells, false);
  const high = cells.filter((cell) => cell.segment === 'High risk');
  const low = cells.filter((cell) => cell.segment === 'Low risk');
  const highEffect = high.find((cell) => cell.treated).rate - high.find((cell) => !cell.treated).rate;
  const lowEffect = low.find((cell) => cell.treated).rate - low.find((cell) => !cell.treated).rate;
  const highWeight = cells.filter((cell) => cell.segment === 'High risk').reduce((sum, cell) => sum + cell.n, 0) / scenario.sampleSize;
  const adjustedEffect = highWeight * highEffect + (1 - highWeight) * lowEffect;
  const naiveEffect = treatment.rate - control.rate;
  const reversal = scenario.withinLift !== 0
    && Math.sign(naiveEffect) !== Math.sign(adjustedEffect)
    && Math.sign(adjustedEffect) === Math.sign(scenario.withinLift);
  const treatedHighShare = treatment.n === 0 ? 0 : high.find((cell) => cell.treated).n / treatment.n;
  const controlHighShare = control.n === 0 ? 0 : high.find((cell) => !cell.treated).n / control.n;

  return {
    scenario,
    cells,
    treatment,
    control,
    strata: {
      high: { effect: highEffect, treated: high.find((cell) => cell.treated), control: high.find((cell) => !cell.treated) },
      low: { effect: lowEffect, treated: low.find((cell) => cell.treated), control: low.find((cell) => !cell.treated) },
    },
    metrics: {
      naiveEffect,
      adjustedEffect,
      reversal,
      treatedHighShare,
      controlHighShare,
      mixGap: treatedHighShare - controlHighShare,
      confoundingBias: naiveEffect - adjustedEffect,
    },
  };
}
