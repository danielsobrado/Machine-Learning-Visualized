import { gaussianNll } from './lossModel.js';

function assertResiduals(residuals, name) {
  if (!Array.isArray(residuals) || residuals.length === 0) {
    throw new TypeError(`${name} must be a non-empty array`);
  }
  if (residuals.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must contain only finite values`);
  }
}

function assertSigma(sigma, name) {
  if (!Number.isFinite(sigma) || sigma <= 0) {
    throw new RangeError(`${name} must be positive`);
  }
}

export function gaussianScaleMleFromResiduals(residuals) {
  assertResiduals(residuals, 'residuals');
  const meanSquare = residuals.reduce((sum, residual) => sum + residual ** 2, 0) / residuals.length;
  return Math.sqrt(meanSquare);
}

export function gaussianGroupBreakdown(residuals, sigma) {
  assertResiduals(residuals, 'residuals');
  assertSigma(sigma, 'sigma');

  const residualPenalty = residuals.reduce(
    (sum, residual) => sum + (residual ** 2) / (2 * sigma ** 2),
    0,
  );
  const normalizationPenalty = residuals.length * (0.5 * Math.log(2 * Math.PI) + Math.log(sigma));
  const nll = residuals.reduce((sum, residual) => sum + gaussianNll(residual, sigma), 0);

  return {
    nll,
    residualPenalty,
    normalizationPenalty,
  };
}

export function buildHeteroscedasticLab({ stableResiduals, noisyResiduals, stableSigma, noisySigma }) {
  assertResiduals(stableResiduals, 'stableResiduals');
  assertResiduals(noisyResiduals, 'noisyResiduals');
  assertSigma(stableSigma, 'stableSigma');
  assertSigma(noisySigma, 'noisySigma');

  const stable = gaussianGroupBreakdown(stableResiduals, stableSigma);
  const noisy = gaussianGroupBreakdown(noisyResiduals, noisySigma);
  const allResiduals = [...stableResiduals, ...noisyResiduals];
  const sharedSigmaMle = gaussianScaleMleFromResiduals(allResiduals);
  const stableSigmaMle = gaussianScaleMleFromResiduals(stableResiduals);
  const noisySigmaMle = gaussianScaleMleFromResiduals(noisyResiduals);
  const sharedNll = gaussianGroupBreakdown(allResiduals, sharedSigmaMle).nll;
  const bestHeteroscedasticNll = gaussianGroupBreakdown(stableResiduals, stableSigmaMle).nll
    + gaussianGroupBreakdown(noisyResiduals, noisySigmaMle).nll;

  return {
    stable,
    noisy,
    totalNll: stable.nll + noisy.nll,
    residualOnlyObjective: stable.residualPenalty + noisy.residualPenalty,
    sharedSigmaMle,
    stableSigmaMle,
    noisySigmaMle,
    sharedNll,
    bestHeteroscedasticNll,
  };
}
