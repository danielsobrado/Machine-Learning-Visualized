const POPULATION_SEED = 90421;
const OUTCOME_NOISE_SD = 8;
const EFFECT_NOISE_SD = 1.5;
const BASELINE_MEAN = 50;

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random) {
  const u1 = Math.max(Number.EPSILON, random());
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function mean(values) {
  if (values.length === 0) return Number.NaN;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values, average = mean(values)) {
  if (values.length < 2) return 0;
  return values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1);
}

function summarizeDifference(rows, predicate = () => true) {
  const selected = rows.filter(predicate);
  const treated = selected.filter((row) => row.treatment === 1).map((row) => row.observedOutcome);
  const control = selected.filter((row) => row.treatment === 0).map((row) => row.observedOutcome);
  if (treated.length === 0 || control.length === 0) {
    return { estimate: Number.NaN, standardError: Number.NaN, lower: Number.NaN, upper: Number.NaN };
  }
  const estimate = mean(treated) - mean(control);
  const standardError = Math.sqrt(variance(treated) / treated.length + variance(control) / control.length);
  return {
    estimate,
    standardError,
    lower: estimate - 1.96 * standardError,
    upper: estimate + 1.96 * standardError,
  };
}

export function generatePotentialOutcomes(scenario) {
  const random = mulberry32(POPULATION_SEED + scenario.populationSize * 31);
  const responsiveProbability = scenario.responsiveShare / 100;
  return Array.from({ length: scenario.populationSize }, (_, index) => {
    const responsive = random() < responsiveProbability;
    const baseline = BASELINE_MEAN + (responsive ? scenario.baselineGap : 0) + OUTCOME_NOISE_SD * normal(random);
    const configuredEffect = responsive ? scenario.highEffect : scenario.lowEffect;
    const individualEffect = configuredEffect + EFFECT_NOISE_SD * normal(random);
    return {
      id: index + 1,
      responsive,
      y0: baseline,
      y1: baseline + individualEffect,
      individualEffect,
    };
  });
}

export function assignTreatment(population, scenario) {
  const random = mulberry32(scenario.assignmentSeed);
  const treatmentProbability = scenario.treatmentShare / 100;
  return population.map((unit) => {
    const treatment = random() < treatmentProbability ? 1 : 0;
    return {
      ...unit,
      treatment,
      observedOutcome: treatment ? unit.y1 : unit.y0,
      counterfactualOutcome: treatment ? unit.y0 : unit.y1,
    };
  });
}

function policyValue(population, shouldTreat) {
  return mean(population.map((unit) => (shouldTreat(unit) ? unit.y1 : unit.y0)));
}

export function buildTreatmentEffectsLab(scenario) {
  const population = generatePotentialOutcomes(scenario);
  const rows = assignTreatment(population, scenario);
  const responsive = population.filter((unit) => unit.responsive);
  const other = population.filter((unit) => !unit.responsive);
  const trueHighCate = mean(responsive.map((unit) => unit.individualEffect));
  const trueLowCate = mean(other.map((unit) => unit.individualEffect));
  const trueAte = mean(population.map((unit) => unit.individualEffect));
  const estimate = summarizeDifference(rows);
  const highEstimate = summarizeDifference(rows, (row) => row.responsive);
  const lowEstimate = summarizeDifference(rows, (row) => !row.responsive);
  const treatNoneValue = policyValue(population, () => false);
  const treatAllValue = policyValue(population, () => true);
  const targetedValue = policyValue(population, (unit) => (unit.responsive ? trueHighCate > 0 : trueLowCate > 0));
  const treatedCount = rows.filter((row) => row.treatment === 1).length;

  return {
    rows,
    sampleRows: rows.slice(0, 8),
    metrics: {
      trueAte,
      trueHighCate,
      trueLowCate,
      estimatedAte: estimate.estimate,
      standardError: estimate.standardError,
      confidenceInterval: [estimate.lower, estimate.upper],
      estimatedHighCate: highEstimate.estimate,
      estimatedLowCate: lowEstimate.estimate,
      treatedCount,
      controlCount: rows.length - treatedCount,
      responsiveCount: responsive.length,
      heterogeneity: Math.abs(trueHighCate - trueLowCate),
      treatNoneValue,
      treatAllValue,
      targetedValue,
      targetingGainVsAll: targetedValue - treatAllValue,
      targetingGainVsNone: targetedValue - treatNoneValue,
    },
  };
}
