import { inverseNormalCdf, normalCdf } from './hypothesisModel.js';

function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function assertPositive(value, name) {
  assertFinite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
}

export function buildEquivalenceLab({ estimate, standardError, margin, alpha = 5 }) {
  assertFinite(estimate, 'estimate');
  assertPositive(standardError, 'standardError');
  assertPositive(margin, 'margin');
  assertPositive(alpha, 'alpha');
  if (alpha >= 50) throw new RangeError('alpha must be below 50');

  const alphaRate = alpha / 100;
  const zTwoSided = inverseNormalCdf(1 - alphaRate / 2);
  const zTost = inverseNormalCdf(1 - alphaRate);
  const ordinary95 = [
    estimate - zTwoSided * standardError,
    estimate + zTwoSided * standardError,
  ];
  const equivalence90 = [
    estimate - zTost * standardError,
    estimate + zTost * standardError,
  ];

  const zLower = (estimate + margin) / standardError;
  const zUpper = (margin - estimate) / standardError;
  const pLower = 1 - normalCdf(zLower);
  const pUpper = 1 - normalCdf(zUpper);
  const tostPValue = Math.max(pLower, pUpper);

  const significantVsZero = ordinary95[0] > 0 || ordinary95[1] < 0;
  const equivalent = equivalence90[0] > -margin && equivalence90[1] < margin;
  const nonInferior = estimate - zTost * standardError > -margin;

  let diagnosis = 'Inconclusive';
  if (equivalent && significantVsZero) diagnosis = 'Different from zero, but still equivalent';
  else if (equivalent) diagnosis = 'Equivalent within the declared margin';
  else if (significantVsZero) diagnosis = 'Detectably different and not equivalent';

  return {
    ordinary95,
    equivalence90,
    margin: [-margin, margin],
    significantVsZero,
    equivalent,
    nonInferior,
    tostPValue,
    pLower,
    pUpper,
    zTwoSided,
    zTost,
    diagnosis,
  };
}
