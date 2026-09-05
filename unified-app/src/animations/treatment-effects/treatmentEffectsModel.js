const POPULATION_SEED = 90421;
const OUTCOME_NOISE_SD = 8;
const EFFECT_NOISE_SD = 1.5;
const BASELINE_MEAN = 50;
const FAMILY_WISE_ALPHA = 0.05;
const EPSILON = 1e-12;

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

function inverseNormalCdf(probability) {
  const p = Math.min(1 - EPSILON, Math.max(EPSILON, probability));
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const low = 0.02425;
  const high = 1 - low;

  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > high) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  const q = p - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
    / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

function intervalFromSummary(summary, criticalValue) {
  return [
    summary.estimate - criticalValue * summary.standardError,
    summary.estimate + criticalValue * summary.standardError,
  ];
}

function excludesZero(interval) {
  return interval[0] > 0 || interval[1] < 0;
}

function summarizeDifference(rows, predicate = () => true) {
  const selected = rows.filter(predicate);
  const treated = selected.filter((row) => row.treatment === 1).map((row) => row.observedOutcome);
  const control = selected.filter((row) => row.treatment === 0).map((row) => row.observedOutcome);
  if (treated.length === 0 || control.length === 0) {
    return {
      estimate: Number.NaN,
      standardError: Number.NaN,
      treatedCount: treated.length,
      controlCount: control.length,
    };
  }
  const estimate = mean(treated) - mean(control);
  const standardError = Math.sqrt(variance(treated) / treated.length + variance(control) / control.length);
  return {
    estimate,
    standardError,
    treatedCount: treated.length,
    controlCount: control.length,
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
  const standardCriticalValue = inverseNormalCdf(0.975);
  const subgroupSearchCount = Math.max(1, scenario.subgroupSearchCount || 2);
  const adjustedCriticalValue = inverseNormalCdf(1 - FAMILY_WISE_ALPHA / (2 * subgroupSearchCount));
  const confidenceInterval = intervalFromSummary(estimate, standardCriticalValue);
  const highConfidenceInterval = intervalFromSummary(highEstimate, standardCriticalValue);
  const lowConfidenceInterval = intervalFromSummary(lowEstimate, standardCriticalValue);
  const highAdjustedInterval = intervalFromSummary(highEstimate, adjustedCriticalValue);
  const lowAdjustedInterval = intervalFromSummary(lowEstimate, adjustedCriticalValue);
  const interactionEstimate = highEstimate.estimate - lowEstimate.estimate;
  const interactionStandardError = Math.sqrt(highEstimate.standardError ** 2 + lowEstimate.standardError ** 2);
  const interactionInterval = [
    interactionEstimate - standardCriticalValue * interactionStandardError,
    interactionEstimate + standardCriticalValue * interactionStandardError,
  ];
  const treatNoneValue = policyValue(population, () => false);
  const treatAllValue = policyValue(population, () => true);
  const targetedValue = policyValue(population, (unit) => (unit.responsive ? trueHighCate > 0 : trueLowCate > 0));
  const pointEstimatePolicyValue = policyValue(population, (unit) => (
    unit.responsive ? highEstimate.estimate > 0 : lowEstimate.estimate > 0
  ));
  const evidenceAwarePolicyValue = policyValue(population, (unit) => (
    unit.responsive ? highAdjustedInterval[0] > 0 : lowAdjustedInterval[0] > 0
  ));
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
      confidenceInterval,
      estimatedHighCate: highEstimate.estimate,
      estimatedLowCate: lowEstimate.estimate,
      highStandardError: highEstimate.standardError,
      lowStandardError: lowEstimate.standardError,
      highConfidenceInterval,
      lowConfidenceInterval,
      highAdjustedInterval,
      lowAdjustedInterval,
      adjustedCriticalValue,
      subgroupSearchCount,
      highSignificant95: excludesZero(highConfidenceInterval),
      lowSignificant95: excludesZero(lowConfidenceInterval),
      highSignificantAdjusted: excludesZero(highAdjustedInterval),
      lowSignificantAdjusted: excludesZero(lowAdjustedInterval),
      interactionEstimate,
      interactionStandardError,
      interactionInterval,
      interactionSignificant: excludesZero(interactionInterval),
      treatedCount,
      controlCount: rows.length - treatedCount,
      responsiveCount: responsive.length,
      highTreatedCount: highEstimate.treatedCount,
      highControlCount: highEstimate.controlCount,
      lowTreatedCount: lowEstimate.treatedCount,
      lowControlCount: lowEstimate.controlCount,
      heterogeneity: Math.abs(trueHighCate - trueLowCate),
      treatNoneValue,
      treatAllValue,
      targetedValue,
      pointEstimatePolicyValue,
      evidenceAwarePolicyValue,
      targetingGainVsAll: targetedValue - treatAllValue,
      targetingGainVsNone: targetedValue - treatNoneValue,
    },
  };
}
