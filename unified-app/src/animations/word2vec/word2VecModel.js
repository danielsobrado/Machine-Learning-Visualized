import {
  NEGATIVE_SAMPLING_COUNTS,
  NEGATIVE_SAMPLING_DEFAULTS,
} from './word2VecConstants.js';

function assertFiniteNonNegative(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite non-negative number.`);
  }
}

export function validateCounts(counts) {
  if (!counts || typeof counts !== 'object' || Array.isArray(counts)) {
    throw new TypeError('counts must be an object keyed by token.');
  }

  const entries = Object.entries(counts);
  if (entries.length === 0) throw new RangeError('counts must not be empty.');
  entries.forEach(([token, count]) => {
    if (!token) throw new RangeError('tokens must be non-empty strings.');
    assertFiniteNonNegative(count, `count for ${token}`);
  });
  if (entries.every(([, count]) => count === 0)) {
    throw new RangeError('at least one token must have a positive count.');
  }
  return entries;
}

export function noiseDistribution(counts, exponent = 0.75) {
  assertFiniteNonNegative(exponent, 'exponent');
  const entries = validateCounts(counts);
  const weighted = entries.map(([token, count]) => ({
    token,
    count,
    weight: count === 0 ? 0 : count ** exponent,
  }));
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) throw new RangeError('noise distribution has zero mass.');

  return weighted.map((item) => ({
    ...item,
    probability: item.weight / totalWeight,
  }));
}

function nextRandom(state) {
  const nextState = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return { state: nextState, value: nextState / 0x100000000 };
}

export function sampleNoise(distribution, sampleCount, seed = NEGATIVE_SAMPLING_DEFAULTS.seed) {
  if (!Array.isArray(distribution) || distribution.length === 0) {
    throw new TypeError('distribution must be a non-empty array.');
  }
  if (!Number.isInteger(sampleCount) || sampleCount < 1) {
    throw new RangeError('sampleCount must be a positive integer.');
  }
  if (!Number.isInteger(seed)) throw new TypeError('seed must be an integer.');

  const total = distribution.reduce((sum, item) => sum + item.probability, 0);
  if (Math.abs(total - 1) > 1e-9) throw new RangeError('distribution probabilities must sum to 1.');

  const samples = [];
  let state = seed >>> 0;
  for (let index = 0; index < sampleCount; index += 1) {
    const random = nextRandom(state);
    state = random.state;
    let cumulative = 0;
    let selected = distribution.at(-1).token;
    for (const item of distribution) {
      cumulative += item.probability;
      if (random.value < cumulative) {
        selected = item.token;
        break;
      }
    }
    samples.push(selected);
  }
  return samples;
}

export function negativeSamplingExperiment({
  counts = NEGATIVE_SAMPLING_COUNTS,
  exponent = NEGATIVE_SAMPLING_DEFAULTS.exponent,
  samples = NEGATIVE_SAMPLING_DEFAULTS.samples,
  seed = NEGATIVE_SAMPLING_DEFAULTS.seed,
} = {}) {
  const distribution = noiseDistribution(counts, exponent);
  return {
    exponent,
    distribution,
    samples: sampleNoise(distribution, samples, seed),
  };
}
