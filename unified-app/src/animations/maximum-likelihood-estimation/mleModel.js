const CURVE_POINTS = 101;
const SURFACE_MU_POINTS = 19;
const SURFACE_SIGMA_POINTS = 15;
const MIN_PROBABILITY = 1e-6;
const MIN_SIGMA = 1e-6;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function bernoulliLogLikelihood(p, successes, failures) {
  const safeP = clamp(p, MIN_PROBABILITY, 1 - MIN_PROBABILITY);
  return successes * Math.log(safeP) + failures * Math.log(1 - safeP);
}

export function gaussianLogLikelihood(mu, sigma, values) {
  const safeSigma = Math.max(MIN_SIGMA, sigma);
  const variance = safeSigma * safeSigma;
  const constant = -Math.log(safeSigma) - 0.5 * Math.log(2 * Math.PI);
  return values.reduce((sum, value) => sum + constant - ((value - mu) ** 2) / (2 * variance), 0);
}

export function bernoulliMle(successes, failures) {
  return successes / (successes + failures);
}

export function gaussianMle(values) {
  const mu = mean(values);
  const sumSquares = values.reduce((sum, value) => sum + (value - mu) ** 2, 0);
  const variance = sumSquares / values.length;
  const unbiasedVariance = values.length > 1 ? sumSquares / (values.length - 1) : 0;
  return { mu, sigma: Math.sqrt(variance), variance, unbiasedVariance, sumSquares };
}

function relativeLikelihood(candidateLogLikelihood, mleLogLikelihood) {
  return Math.exp(Math.min(0, candidateLogLikelihood - mleLogLikelihood));
}

function bernoulliCurve(successes, failures) {
  const mle = bernoulliMle(successes, failures);
  const mleLogLikelihood = bernoulliLogLikelihood(mle, successes, failures);
  return Array.from({ length: CURVE_POINTS }, (_, index) => {
    const p = 0.01 + (index / (CURVE_POINTS - 1)) * 0.98;
    const logLikelihood = bernoulliLogLikelihood(p, successes, failures);
    return { p, logLikelihood, relative: relativeLikelihood(logLikelihood, mleLogLikelihood) };
  });
}

function gaussianSurface(values, mle) {
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const spread = Math.max(mle.sigma, (dataMax - dataMin) / 4, 0.25);
  const muMin = Math.min(dataMin, mle.mu - 2.2 * spread);
  const muMax = Math.max(dataMax, mle.mu + 2.2 * spread);
  const sigmaMin = Math.max(0.08, mle.sigma * 0.25);
  const sigmaMax = Math.max(1, mle.sigma * 2.8);
  const mleLogLikelihood = gaussianLogLikelihood(mle.mu, mle.sigma, values);
  const cells = [];
  for (let sigmaIndex = 0; sigmaIndex < SURFACE_SIGMA_POINTS; sigmaIndex += 1) {
    const sigma = sigmaMin + (sigmaIndex / (SURFACE_SIGMA_POINTS - 1)) * (sigmaMax - sigmaMin);
    for (let muIndex = 0; muIndex < SURFACE_MU_POINTS; muIndex += 1) {
      const mu = muMin + (muIndex / (SURFACE_MU_POINTS - 1)) * (muMax - muMin);
      const logLikelihood = gaussianLogLikelihood(mu, sigma, values);
      cells.push({
        mu,
        sigma,
        muIndex,
        sigmaIndex,
        relative: relativeLikelihood(logLikelihood, mleLogLikelihood),
      });
    }
  }
  return { cells, muMin, muMax, sigmaMin, sigmaMax, muPoints: SURFACE_MU_POINTS, sigmaPoints: SURFACE_SIGMA_POINTS };
}

export function buildBernoulliLab(dataset, candidateP) {
  const sampleSize = dataset.successes + dataset.failures;
  const mle = bernoulliMle(dataset.successes, dataset.failures);
  const candidateLogLikelihood = bernoulliLogLikelihood(candidateP, dataset.successes, dataset.failures);
  const mleLogLikelihood = bernoulliLogLikelihood(mle, dataset.successes, dataset.failures);
  const score = dataset.successes / candidateP - dataset.failures / (1 - candidateP);
  const informationAtMle = sampleSize / Math.max(MIN_PROBABILITY, mle * (1 - mle));
  return {
    metrics: {
      sampleSize,
      mle,
      candidateLogLikelihood,
      mleLogLikelihood,
      negativeLogLikelihood: -candidateLogLikelihood,
      relativeLikelihood: relativeLikelihood(candidateLogLikelihood, mleLogLikelihood),
      score,
      asymptoticSe: Math.sqrt(1 / informationAtMle),
      informationAtMle,
    },
    curve: bernoulliCurve(dataset.successes, dataset.failures),
  };
}

export function buildGaussianLab(dataset, candidateMu, candidateSigma) {
  const mle = gaussianMle(dataset.values);
  const candidateLogLikelihood = gaussianLogLikelihood(candidateMu, candidateSigma, dataset.values);
  const mleLogLikelihood = gaussianLogLikelihood(mle.mu, mle.sigma, dataset.values);
  const residualSum = dataset.values.reduce((sum, value) => sum + (value - candidateMu) ** 2, 0);
  const scoreMu = dataset.values.reduce((sum, value) => sum + (value - candidateMu), 0) / (candidateSigma ** 2);
  const scoreSigma = -dataset.values.length / candidateSigma + residualSum / (candidateSigma ** 3);
  return {
    metrics: {
      sampleSize: dataset.values.length,
      mleMu: mle.mu,
      mleSigma: mle.sigma,
      mleVariance: mle.variance,
      unbiasedVariance: mle.unbiasedVariance,
      candidateLogLikelihood,
      mleLogLikelihood,
      negativeLogLikelihood: -candidateLogLikelihood,
      relativeLikelihood: relativeLikelihood(candidateLogLikelihood, mleLogLikelihood),
      scoreMu,
      scoreSigma,
      meanSe: mle.sigma / Math.sqrt(dataset.values.length),
      varianceBiasGap: mle.unbiasedVariance - mle.variance,
    },
    surface: gaussianSurface(dataset.values, mle),
  };
}
