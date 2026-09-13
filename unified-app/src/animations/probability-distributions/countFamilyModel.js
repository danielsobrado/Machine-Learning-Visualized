function assertPositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

function assertProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError(`${name} must be in [0, 1)`);
}

function combination(n, k) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || k > n) return 0;
  const m = Math.min(k, n - k);
  let value = 1;
  for (let i = 1; i <= m; i += 1) value = value * (n - m + i) / i;
  return value;
}

export function poissonPmf(k, mean) {
  assertPositive(mean, 'mean');
  if (!Number.isInteger(k) || k < 0) return 0;
  let probability = Math.exp(-mean);
  for (let i = 1; i <= k; i += 1) probability *= mean / i;
  return probability;
}

export function negativeBinomialPmf(k, mean, shape) {
  assertPositive(mean, 'mean');
  if (!Number.isInteger(shape) || shape <= 0) throw new RangeError('shape must be a positive integer');
  if (!Number.isInteger(k) || k < 0) return 0;
  const successProbability = shape / (shape + mean);
  return combination(k + shape - 1, k)
    * successProbability ** shape
    * (1 - successProbability) ** k;
}

export function zeroInflatedPoissonPmf(k, mean, zeroInflation) {
  assertPositive(mean, 'mean');
  assertProbability(zeroInflation, 'zeroInflation');
  if (!Number.isInteger(k) || k < 0) return 0;
  const poissonMean = mean / (1 - zeroInflation);
  const poissonMass = poissonPmf(k, poissonMean);
  return k === 0
    ? zeroInflation + (1 - zeroInflation) * poissonMass
    : (1 - zeroInflation) * poissonMass;
}

function buildSeries(pmf, maxCount) {
  const points = Array.from({ length: maxCount + 1 }, (_, k) => ({ k, probability: pmf(k) }));
  const shownMass = points.reduce((sum, point) => sum + point.probability, 0);
  return { points, tailMass: Math.max(0, 1 - shownMass) };
}

export function buildCountFamilyLab({ mean, shape, zeroInflation, maxCount = 14 }) {
  assertPositive(mean, 'mean');
  if (!Number.isInteger(shape) || shape <= 0) throw new RangeError('shape must be a positive integer');
  assertProbability(zeroInflation, 'zeroInflation');
  if (!Number.isInteger(maxCount) || maxCount < 1) throw new RangeError('maxCount must be a positive integer');

  const zipPoissonMean = mean / (1 - zeroInflation);
  const poisson = {
    id: 'poisson',
    label: 'Poisson',
    mean,
    variance: mean,
    zeroProbability: Math.exp(-mean),
    ...buildSeries((k) => poissonPmf(k, mean), maxCount),
  };
  const negativeBinomial = {
    id: 'negative-binomial',
    label: 'Negative Binomial',
    mean,
    variance: mean + mean ** 2 / shape,
    zeroProbability: negativeBinomialPmf(0, mean, shape),
    ...buildSeries((k) => negativeBinomialPmf(k, mean, shape), maxCount),
  };
  const zeroInflatedPoisson = {
    id: 'zero-inflated-poisson',
    label: 'Zero-inflated Poisson',
    mean,
    variance: mean + (zeroInflation * mean ** 2) / (1 - zeroInflation),
    zeroProbability: zeroInflatedPoissonPmf(0, mean, zeroInflation),
    poissonMean: zipPoissonMean,
    ...buildSeries((k) => zeroInflatedPoissonPmf(k, mean, zeroInflation), maxCount),
  };

  return {
    families: [poisson, negativeBinomial, zeroInflatedPoisson],
    diagnostics: {
      poissonDispersionRatio: 1,
      negativeBinomialDispersionRatio: negativeBinomial.variance / mean,
      zeroInflatedDispersionRatio: zeroInflatedPoisson.variance / mean,
      zeroInflation,
      shape,
    },
  };
}
