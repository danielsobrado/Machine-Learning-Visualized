const EPSILON = 1e-12;

function validateProbabilities(probabilities) {
  if (!Array.isArray(probabilities) || probabilities.length === 0) {
    throw new TypeError('probabilities must be a non-empty array');
  }
  if (probabilities.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError('probabilities must contain finite non-negative values');
  }
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 1e-9) throw new RangeError('probabilities must sum to one');
}

export function normalizeWeights(weights) {
  if (!Array.isArray(weights) || weights.length === 0) throw new TypeError('weights must be a non-empty array');
  if (weights.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError('weights must contain finite non-negative values');
  }
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total <= 0) throw new RangeError('at least one weight must be positive');
  return weights.map((value) => value / total);
}

export function selfInformation(probability, base = 2) {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new RangeError('probability must be between zero and one');
  }
  if (!Number.isFinite(base) || base <= 0 || Math.abs(base - 1) < EPSILON) {
    throw new RangeError('log base must be positive and different from one');
  }
  if (probability === 0) return Number.POSITIVE_INFINITY;
  if (probability === 1) return 0;
  return -Math.log(probability) / Math.log(base);
}

export function entropy(probabilities, base = 2) {
  validateProbabilities(probabilities);
  return probabilities.reduce((sum, probability) => {
    if (probability === 0) return sum;
    return sum + probability * selfInformation(probability, base);
  }, 0);
}

export function crossEntropy(target, prediction, base = 2) {
  validateProbabilities(target);
  validateProbabilities(prediction);
  if (target.length !== prediction.length) throw new RangeError('target and prediction must have equal length');

  let total = 0;
  for (let index = 0; index < target.length; index += 1) {
    if (target[index] === 0) continue;
    if (prediction[index] === 0) return Number.POSITIVE_INFINITY;
    total += target[index] * selfInformation(prediction[index], base);
  }
  return total;
}

export function klDivergence(target, prediction, base = 2) {
  const h = entropy(target, base);
  const ce = crossEntropy(target, prediction, base);
  return Number.isFinite(ce) ? Math.max(0, ce - h) : ce;
}

export function maxEntropy(outcomeCount, base = 2) {
  if (!Number.isInteger(outcomeCount) || outcomeCount <= 0) throw new RangeError('outcomeCount must be positive');
  return Math.log(outcomeCount) / Math.log(base);
}

export function effectiveOutcomeCount(probabilities) {
  return 2 ** entropy(probabilities, 2);
}

export function buildPrediction(probabilities, transform) {
  validateProbabilities(probabilities);
  if (transform === 'matched') return [...probabilities];
  if (transform === 'uniform') return probabilities.map(() => 1 / probabilities.length);
  if (transform === 'reversed') return [...probabilities].reverse();
  if (transform === 'softened') {
    const softened = probabilities.map((value) => Math.sqrt(value));
    return normalizeWeights(softened);
  }
  throw new RangeError(`unknown transform: ${transform}`);
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

function sampleIndex(probabilities, random) {
  const draw = random();
  let cumulative = 0;
  for (let index = 0; index < probabilities.length; index += 1) {
    cumulative += probabilities[index];
    if (draw <= cumulative || index === probabilities.length - 1) return index;
  }
  return probabilities.length - 1;
}

export function simulateAverageSurprise(probabilities, sampleSize, seed) {
  validateProbabilities(probabilities);
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) throw new RangeError('sampleSize must be positive');
  const random = mulberry32(seed);
  let sum = 0;
  const running = [];

  for (let draw = 1; draw <= sampleSize; draw += 1) {
    const index = sampleIndex(probabilities, random);
    sum += selfInformation(probabilities[index], 2);
    if (draw <= 20 || draw % Math.max(1, Math.floor(sampleSize / 30)) === 0 || draw === sampleSize) {
      running.push({ n: draw, average: sum / draw });
    }
  }

  return { average: sum / sampleSize, running };
}

export function buildEntropyLab({ weights, modelTransform, sampleSize, seed }) {
  const probabilities = normalizeWeights(weights);
  const prediction = buildPrediction(probabilities, modelTransform);
  const value = entropy(probabilities, 2);
  const maximum = maxEntropy(probabilities.length, 2);
  const ce = crossEntropy(probabilities, prediction, 2);
  const kl = klDivergence(probabilities, prediction, 2);
  const simulation = simulateAverageSurprise(probabilities, sampleSize, seed);

  return {
    probabilities,
    prediction,
    entropy: value,
    maximum,
    normalizedEntropy: maximum === 0 ? 0 : value / maximum,
    effectiveOutcomes: effectiveOutcomeCount(probabilities),
    crossEntropy: ce,
    klDivergence: kl,
    decompositionResidual: Number.isFinite(ce) ? ce - value - kl : Number.POSITIVE_INFINITY,
    contributions: probabilities.map((probability, index) => ({
      index,
      probability,
      surprise: probability === 0 ? Number.POSITIVE_INFINITY : selfInformation(probability, 2),
      contribution: probability === 0 ? 0 : probability * selfInformation(probability, 2),
    })),
    simulation,
  };
}
