import { MATCHING_CALIPER } from './propensityConfig.js';

const BASELINE_MEAN = 50;
const OBSERVED_OUTCOME_COEFFICIENT = 7;
const HIDDEN_OUTCOME_COEFFICIENT = 7;
const OUTCOME_NOISE_SD = 5;
const SCORE_EPSILON = 0.005;
const MAX_NEWTON_STEPS = 30;

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

function sigmoid(value) {
  if (value >= 0) {
    const z = Math.exp(-value);
    return 1 / (1 + z);
  }
  const z = Math.exp(value);
  return z / (1 + z);
}

function mean(values) {
  if (values.length === 0) return Number.NaN;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values, average = mean(values)) {
  if (values.length < 2) return 0;
  return values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1);
}

function weightedMean(rows, valueKey, weightKey, treatment) {
  const selected = rows.filter((row) => row.treatment === treatment);
  const weightSum = selected.reduce((sum, row) => sum + row[weightKey], 0);
  if (weightSum <= 0) return Number.NaN;
  return selected.reduce((sum, row) => sum + row[weightKey] * row[valueKey], 0) / weightSum;
}

function standardizedMeanDifference(rows, valueKey, weightKey = null) {
  const treated = rows.filter((row) => row.treatment === 1);
  const control = rows.filter((row) => row.treatment === 0);
  if (treated.length === 0 || control.length === 0) return Number.NaN;

  const groupStats = (group) => {
    if (!weightKey) {
      const average = mean(group.map((row) => row[valueKey]));
      return { average, variance: variance(group.map((row) => row[valueKey]), average) };
    }
    const weightSum = group.reduce((sum, row) => sum + row[weightKey], 0);
    if (weightSum <= 0) return { average: Number.NaN, variance: Number.NaN };
    const average = group.reduce((sum, row) => sum + row[weightKey] * row[valueKey], 0) / weightSum;
    const weightedVariance = group.reduce((sum, row) => sum + row[weightKey] * (row[valueKey] - average) ** 2, 0) / weightSum;
    return { average, variance: weightedVariance };
  };

  const treatedStats = groupStats(treated);
  const controlStats = groupStats(control);
  const pooledSd = Math.sqrt((treatedStats.variance + controlStats.variance) / 2);
  return pooledSd === 0 ? 0 : (treatedStats.average - controlStats.average) / pooledSd;
}

function fitPropensity(rows) {
  let intercept = 0;
  let slope = 0;
  for (let iteration = 0; iteration < MAX_NEWTON_STEPS; iteration += 1) {
    let g0 = 0;
    let g1 = 0;
    let h00 = 0;
    let h01 = 0;
    let h11 = 0;
    rows.forEach((row) => {
      const probability = sigmoid(intercept + slope * row.observedRisk);
      const residual = row.treatment - probability;
      const weight = Math.max(1e-8, probability * (1 - probability));
      g0 += residual;
      g1 += residual * row.observedRisk;
      h00 += weight;
      h01 += weight * row.observedRisk;
      h11 += weight * row.observedRisk * row.observedRisk;
    });
    const determinant = h00 * h11 - h01 * h01;
    if (Math.abs(determinant) < 1e-12) break;
    const delta0 = (g0 * h11 - g1 * h01) / determinant;
    const delta1 = (g1 * h00 - g0 * h01) / determinant;
    intercept += delta0;
    slope += delta1;
    if (Math.max(Math.abs(delta0), Math.abs(delta1)) < 1e-8) break;
  }
  return { intercept, slope };
}

function lowerBound(rows, target) {
  let low = 0;
  let high = rows.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (rows[mid].estimatedPropensity < target) low = mid + 1;
    else high = mid;
  }
  return low;
}

export function matchNearestPropensity(rows, caliper = MATCHING_CALIPER) {
  const treated = rows
    .filter((row) => row.treatment === 1)
    .sort((a, b) => a.estimatedPropensity - b.estimatedPropensity);
  const availableControls = rows
    .filter((row) => row.treatment === 0)
    .sort((a, b) => a.estimatedPropensity - b.estimatedPropensity);
  const pairs = [];

  treated.forEach((treatedRow) => {
    if (availableControls.length === 0) return;
    const index = lowerBound(availableControls, treatedRow.estimatedPropensity);
    const candidates = [index - 1, index]
      .filter((candidateIndex) => candidateIndex >= 0 && candidateIndex < availableControls.length)
      .map((candidateIndex) => ({
        candidateIndex,
        distance: Math.abs(availableControls[candidateIndex].estimatedPropensity - treatedRow.estimatedPropensity),
      }))
      .sort((a, b) => a.distance - b.distance);

    const best = candidates[0];
    if (!best || best.distance > caliper) return;
    const [controlRow] = availableControls.splice(best.candidateIndex, 1);
    pairs.push({ treated: treatedRow, control: controlRow, distance: best.distance });
  });

  return pairs;
}

export function generateObservationalRows(scenario) {
  const random = mulberry32(scenario.seed + scenario.populationSize * 13);
  return Array.from({ length: scenario.populationSize }, (_, index) => {
    const observedRisk = normal(random);
    const hiddenRisk = normal(random);
    const truePropensity = sigmoid(-0.15 + scenario.observedSelection * observedRisk + scenario.hiddenConfounding * hiddenRisk);
    const treatment = random() < truePropensity ? 1 : 0;
    const y0 = BASELINE_MEAN
      + OBSERVED_OUTCOME_COEFFICIENT * observedRisk
      + HIDDEN_OUTCOME_COEFFICIENT * scenario.hiddenConfounding * hiddenRisk
      + OUTCOME_NOISE_SD * normal(random);
    const y1 = y0 + scenario.treatmentEffect;
    return {
      id: index + 1,
      observedRisk,
      hiddenRisk,
      truePropensity,
      treatment,
      y0,
      y1,
      observedOutcome: treatment ? y1 : y0,
    };
  });
}

export function applyPropensityWeights(rows, weightCap) {
  const model = fitPropensity(rows);
  return rows.map((row) => {
    const estimatedPropensity = Math.min(1 - SCORE_EPSILON, Math.max(SCORE_EPSILON, sigmoid(model.intercept + model.slope * row.observedRisk)));
    const rawWeight = row.treatment ? 1 / estimatedPropensity : 1 / (1 - estimatedPropensity);
    return {
      ...row,
      estimatedPropensity,
      rawWeight,
      weight: Math.min(weightCap, rawWeight),
    };
  });
}

export function effectiveSampleSize(rows, weightKey = 'weight') {
  const sumWeights = rows.reduce((sum, row) => sum + row[weightKey], 0);
  const sumSquares = rows.reduce((sum, row) => sum + row[weightKey] ** 2, 0);
  return sumSquares === 0 ? 0 : (sumWeights ** 2) / sumSquares;
}

function trimmedRows(rows, threshold) {
  if (threshold <= 0) return rows;
  return rows.filter((row) => (
    row.estimatedPropensity >= threshold && row.estimatedPropensity <= 1 - threshold
  ));
}

function matchedMetrics(pairs) {
  if (pairs.length === 0) {
    return {
      estimate: Number.NaN,
      observedSmd: Number.NaN,
      hiddenSmd: Number.NaN,
      meanDistance: Number.NaN,
      rows: [],
    };
  }

  const rows = pairs.flatMap((pair) => [pair.treated, pair.control]);
  return {
    estimate: mean(pairs.map((pair) => pair.treated.observedOutcome - pair.control.observedOutcome)),
    observedSmd: standardizedMeanDifference(rows, 'observedRisk'),
    hiddenSmd: standardizedMeanDifference(rows, 'hiddenRisk'),
    meanDistance: mean(pairs.map((pair) => pair.distance)),
    rows,
  };
}

export function buildPropensityLab(scenario) {
  const generated = generateObservationalRows(scenario);
  const rows = applyPropensityWeights(generated, scenario.weightCap);
  const treated = rows.filter((row) => row.treatment === 1);
  const control = rows.filter((row) => row.treatment === 0);
  const trimmed = trimmedRows(rows, scenario.trimThreshold);
  const matchedPairs = matchNearestPropensity(trimmed);
  const matched = matchedMetrics(matchedPairs);

  const naiveEstimate = mean(treated.map((row) => row.observedOutcome)) - mean(control.map((row) => row.observedOutcome));
  const weightedEstimate = weightedMean(rows, 'observedOutcome', 'weight', 1) - weightedMean(rows, 'observedOutcome', 'weight', 0);
  const trimmedWeightedEstimate = weightedMean(trimmed, 'observedOutcome', 'weight', 1) - weightedMean(trimmed, 'observedOutcome', 'weight', 0);
  const trueAte = mean(rows.map((row) => row.y1 - row.y0));
  const beforeObservedSmd = standardizedMeanDifference(rows, 'observedRisk');
  const afterObservedSmd = standardizedMeanDifference(rows, 'observedRisk', 'weight');
  const beforeHiddenSmd = standardizedMeanDifference(rows, 'hiddenRisk');
  const afterHiddenSmd = standardizedMeanDifference(rows, 'hiddenRisk', 'weight');
  const trimmedObservedSmd = standardizedMeanDifference(trimmed, 'observedRisk', 'weight');
  const overlapCount = rows.filter((row) => row.estimatedPropensity >= 0.1 && row.estimatedPropensity <= 0.9).length;
  const maxRawWeight = Math.max(...rows.map((row) => row.rawWeight));
  const cappedCount = rows.filter((row) => row.rawWeight > scenario.weightCap).length;

  return {
    rows,
    sampleRows: [...rows].sort((a, b) => a.estimatedPropensity - b.estimatedPropensity).filter((_, index) => index % Math.max(1, Math.floor(rows.length / 8)) === 0).slice(0, 8),
    metrics: {
      trueAte,
      naiveEstimate,
      weightedEstimate,
      trimmedWeightedEstimate,
      matchedEstimate: matched.estimate,
      naiveBias: naiveEstimate - trueAte,
      weightedBias: weightedEstimate - trueAte,
      trimmedBias: trimmedWeightedEstimate - trueAte,
      matchedBias: matched.estimate - trueAte,
      beforeObservedSmd,
      afterObservedSmd,
      beforeHiddenSmd,
      afterHiddenSmd,
      trimmedObservedSmd,
      matchedObservedSmd: matched.observedSmd,
      matchedHiddenSmd: matched.hiddenSmd,
      overlapRate: overlapCount / rows.length,
      effectiveSampleSize: effectiveSampleSize(rows),
      trimmedEffectiveSampleSize: effectiveSampleSize(trimmed),
      maxRawWeight,
      cappedCount,
      trimmedCount: rows.length - trimmed.length,
      retainedCount: trimmed.length,
      matchedPairs: matchedPairs.length,
      matchingCaliper: MATCHING_CALIPER,
      meanMatchDistance: matched.meanDistance,
      treatedCount: treated.length,
      controlCount: control.length,
    },
  };
}
