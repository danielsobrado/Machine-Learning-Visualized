function validateDistribution(outcomes, probabilities) {
  if (!Array.isArray(outcomes) || !Array.isArray(probabilities) || outcomes.length === 0 || outcomes.length !== probabilities.length) {
    throw new TypeError('outcomes and probabilities must be non-empty arrays of equal length');
  }
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  if (probabilities.some((value) => !Number.isFinite(value) || value < 0) || Math.abs(total - 1) > 1e-9) {
    throw new RangeError('probabilities must be non-negative and sum to one');
  }
}

export function exactMoments(outcomes, probabilities) {
  validateDistribution(outcomes, probabilities);
  const mean = outcomes.reduce((sum, value, index) => sum + value * probabilities[index], 0);
  const secondMoment = outcomes.reduce((sum, value, index) => sum + value ** 2 * probabilities[index], 0);
  const variance = Math.max(0, secondMoment - mean ** 2);
  return { mean, secondMoment, variance, standardDeviation: Math.sqrt(variance) };
}

export function affineDistribution(outcomes, scale, shift) {
  if (!Number.isFinite(scale) || !Number.isFinite(shift)) throw new TypeError('scale and shift must be finite');
  return outcomes.map((value) => scale * value + shift);
}

export function probabilityAtOrBelow(outcomes, probabilities, threshold) {
  validateDistribution(outcomes, probabilities);
  return outcomes.reduce((sum, value, index) => sum + (value <= threshold ? probabilities[index] : 0), 0);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function sampleCategorical(outcomes, probabilities, random) {
  const draw = random();
  let cumulative = 0;
  for (let index = 0; index < outcomes.length; index += 1) {
    cumulative += probabilities[index];
    if (draw <= cumulative || index === outcomes.length - 1) return outcomes[index];
  }
  return outcomes[outcomes.length - 1];
}

export function simulateMoments(outcomes, probabilities, sampleSize, seed) {
  validateDistribution(outcomes, probabilities);
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) throw new RangeError('sampleSize must be positive');
  const random = mulberry32(seed);
  const values = [];
  const runningMean = [];
  let sum = 0;
  for (let index = 0; index < sampleSize; index += 1) {
    const value = sampleCategorical(outcomes, probabilities, random);
    values.push(value);
    sum += value;
    if (index < 25 || (index + 1) % Math.max(1, Math.floor(sampleSize / 40)) === 0 || index === sampleSize - 1) {
      runningMean.push({ n: index + 1, mean: sum / (index + 1) });
    }
  }
  const mean = sum / sampleSize;
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / sampleSize;
  return { values, mean, variance, runningMean };
}

export function independentAverageMoments(moments, copies) {
  if (!Number.isInteger(copies) || copies <= 0) throw new RangeError('copies must be positive');
  return {
    mean: moments.mean,
    variance: moments.variance / copies,
    standardDeviation: moments.standardDeviation / Math.sqrt(copies),
  };
}

export function buildMomentsLab({ preset, scale, shift, independentCopies, lossThreshold, sampleSize, seed }) {
  const baseMoments = exactMoments(preset.outcomes, preset.probabilities);
  const transformedOutcomes = affineDistribution(preset.outcomes, scale, shift);
  const moments = exactMoments(transformedOutcomes, preset.probabilities);
  const simulation = simulateMoments(transformedOutcomes, preset.probabilities, sampleSize, seed);
  const average = independentAverageMoments(moments, independentCopies);
  const downsideProbability = probabilityAtOrBelow(transformedOutcomes, preset.probabilities, lossThreshold);
  const meanIsPossibleOutcome = transformedOutcomes.some((value) => Math.abs(value - moments.mean) < 1e-10);

  return {
    baseMoments,
    transformedOutcomes,
    moments,
    simulation,
    average,
    downsideProbability,
    meanIsPossibleOutcome,
    affineIdentity: {
      expected: scale * baseMoments.mean + shift,
      variance: scale ** 2 * baseMoments.variance,
    },
  };
}
