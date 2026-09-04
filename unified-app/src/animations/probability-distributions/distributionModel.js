function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function requirePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

function requireProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be in [0, 1]`);
}

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const polynomial = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  return sign * (1 - polynomial * Math.exp(-a * a));
}

export function normalCdf(x, mean = 0, sigma = 1) {
  requirePositive(sigma, 'sigma');
  return 0.5 * (1 + erf((x - mean) / (sigma * Math.SQRT2)));
}

export function normalPdf(x, mean = 0, sigma = 1) {
  requirePositive(sigma, 'sigma');
  const z = (x - mean) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

export function exponentialCdf(x, rate) {
  requirePositive(rate, 'rate');
  return x <= 0 ? 0 : 1 - Math.exp(-rate * x);
}

export function exponentialPdf(x, rate) {
  requirePositive(rate, 'rate');
  return x < 0 ? 0 : rate * Math.exp(-rate * x);
}

function binomialCoefficient(n, k) {
  if (k < 0 || k > n) return 0;
  const m = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= m; i += 1) result = result * (n - m + i) / i;
  return result;
}

export function binomialPmf(k, n, probability) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
  requireProbability(probability, 'probability');
  if (!Number.isInteger(k) || k < 0 || k > n) return 0;
  return binomialCoefficient(n, k) * probability ** k * (1 - probability) ** (n - k);
}

export function poissonPmf(k, rate) {
  requirePositive(rate, 'rate');
  if (!Number.isInteger(k) || k < 0) return 0;
  let probability = Math.exp(-rate);
  for (let i = 1; i <= k; i += 1) probability *= rate / i;
  return probability;
}

export function distributionMoments(scenario) {
  switch (scenario.family) {
    case 'binomial':
      return {
        mean: scenario.trials * scenario.probability,
        variance: scenario.trials * scenario.probability * (1 - scenario.probability),
      };
    case 'poisson':
      return { mean: scenario.poissonRate, variance: scenario.poissonRate };
    case 'normal':
      return { mean: scenario.mean, variance: scenario.sigma ** 2 };
    case 'exponential':
      return { mean: 1 / scenario.exponentialRate, variance: 1 / scenario.exponentialRate ** 2 };
    default:
      throw new RangeError(`unsupported family: ${scenario.family}`);
  }
}

export function intervalProbability(scenario) {
  const low = Math.min(scenario.lower, scenario.upper);
  const high = Math.max(scenario.lower, scenario.upper);
  if (scenario.family === 'binomial') {
    let total = 0;
    for (let k = Math.max(0, Math.ceil(low)); k <= Math.min(scenario.trials, Math.floor(high)); k += 1) {
      total += binomialPmf(k, scenario.trials, scenario.probability);
    }
    return total;
  }
  if (scenario.family === 'poisson') {
    let total = 0;
    for (let k = Math.max(0, Math.ceil(low)); k <= Math.floor(high); k += 1) total += poissonPmf(k, scenario.poissonRate);
    return total;
  }
  if (scenario.family === 'normal') return normalCdf(high, scenario.mean, scenario.sigma) - normalCdf(low, scenario.mean, scenario.sigma);
  if (scenario.family === 'exponential') return exponentialCdf(high, scenario.exponentialRate) - exponentialCdf(low, scenario.exponentialRate);
  throw new RangeError(`unsupported family: ${scenario.family}`);
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

function sampleOne(scenario, random) {
  if (scenario.family === 'binomial') {
    let successes = 0;
    for (let i = 0; i < scenario.trials; i += 1) if (random() < scenario.probability) successes += 1;
    return successes;
  }
  if (scenario.family === 'poisson') {
    const limit = Math.exp(-scenario.poissonRate);
    let product = 1;
    let count = 0;
    do {
      count += 1;
      product *= random();
    } while (product > limit);
    return count - 1;
  }
  if (scenario.family === 'normal') {
    const u1 = Math.max(Number.EPSILON, random());
    const u2 = random();
    return scenario.mean + scenario.sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  if (scenario.family === 'exponential') return -Math.log(Math.max(Number.EPSILON, 1 - random())) / scenario.exponentialRate;
  throw new RangeError(`unsupported family: ${scenario.family}`);
}

export function simulateDistribution(scenario) {
  if (!Number.isInteger(scenario.sampleSize) || scenario.sampleSize <= 0) throw new RangeError('sampleSize must be positive');
  const random = mulberry32(scenario.seed);
  const values = Array.from({ length: scenario.sampleSize }, () => sampleOne(scenario, random));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const low = Math.min(scenario.lower, scenario.upper);
  const high = Math.max(scenario.lower, scenario.upper);
  const inRange = values.filter((value) => value >= low && value <= high).length / values.length;
  return { values, mean, variance, inRange };
}

function discreteSupport(scenario) {
  if (scenario.family === 'binomial') {
    return Array.from({ length: scenario.trials + 1 }, (_, k) => ({
      x: k,
      y: binomialPmf(k, scenario.trials, scenario.probability),
    }));
  }
  const max = Math.max(12, Math.ceil(scenario.poissonRate + 5 * Math.sqrt(scenario.poissonRate)));
  return Array.from({ length: max + 1 }, (_, k) => ({ x: k, y: poissonPmf(k, scenario.poissonRate) }));
}

function continuousSupport(scenario, points = 101) {
  const moments = distributionMoments(scenario);
  const sd = Math.sqrt(moments.variance);
  const min = scenario.family === 'normal' ? moments.mean - 4 * sd : 0;
  const max = scenario.family === 'normal' ? moments.mean + 4 * sd : Math.max(4 / scenario.exponentialRate, scenario.upper);
  return Array.from({ length: points }, (_, index) => {
    const x = min + (index / (points - 1)) * (max - min);
    const y = scenario.family === 'normal'
      ? normalPdf(x, scenario.mean, scenario.sigma)
      : exponentialPdf(x, scenario.exponentialRate);
    return { x, y };
  });
}

export function buildDistributionLab(scenario) {
  const moments = distributionMoments(scenario);
  const analyticProbability = intervalProbability(scenario);
  const simulation = simulateDistribution(scenario);
  const support = scenario.family === 'binomial' || scenario.family === 'poisson'
    ? discreteSupport(scenario)
    : continuousSupport(scenario);
  const densityReference = scenario.family === 'normal'
    ? normalPdf(scenario.mean, scenario.mean, scenario.sigma)
    : scenario.family === 'exponential'
      ? exponentialPdf(0, scenario.exponentialRate)
      : null;

  return {
    kind: scenario.family === 'binomial' || scenario.family === 'poisson' ? 'discrete' : 'continuous',
    moments: { ...moments, standardDeviation: Math.sqrt(moments.variance) },
    analyticProbability: clamp(analyticProbability, 0, 1),
    simulation,
    support,
    densityReference,
    densityCanExceedOne: densityReference !== null && densityReference > 1,
  };
}
