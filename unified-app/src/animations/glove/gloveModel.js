import { GLOVE_WEIGHTING_DEFAULTS } from './gloveConstants.js';

function assertFinite(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
}

export function gloveWeight(count, {
  xMax = GLOVE_WEIGHTING_DEFAULTS.xMax,
  alpha = GLOVE_WEIGHTING_DEFAULTS.alpha,
} = {}) {
  assertFinite(count, 'count');
  assertFinite(xMax, 'xMax');
  assertFinite(alpha, 'alpha');
  if (count < 0) throw new RangeError('count must be non-negative.');
  if (xMax <= 0) throw new RangeError('xMax must be positive.');
  if (alpha <= 0) throw new RangeError('alpha must be positive.');
  if (count === 0) return 0;
  return count < xMax ? (count / xMax) ** alpha : 1;
}

export function logCooccurrenceTarget(count) {
  assertFinite(count, 'count');
  if (count <= 0) throw new RangeError('log co-occurrence target is defined only for positive counts.');
  return Math.log(count);
}

export function glovePairLoss({
  count,
  prediction,
  xMax = GLOVE_WEIGHTING_DEFAULTS.xMax,
  alpha = GLOVE_WEIGHTING_DEFAULTS.alpha,
}) {
  assertFinite(prediction, 'prediction');
  if (count === 0) {
    return {
      count,
      included: false,
      target: null,
      residual: null,
      weight: 0,
      contribution: 0,
    };
  }

  const target = logCooccurrenceTarget(count);
  const residual = prediction - target;
  const weight = gloveWeight(count, { xMax, alpha });
  return {
    count,
    included: true,
    target,
    residual,
    weight,
    contribution: weight * residual ** 2,
  };
}

export function gloveWeightingExperiment({
  counts,
  residual = GLOVE_WEIGHTING_DEFAULTS.residual,
  xMax = GLOVE_WEIGHTING_DEFAULTS.xMax,
  alpha = GLOVE_WEIGHTING_DEFAULTS.alpha,
}) {
  if (!Array.isArray(counts) || counts.length === 0) throw new TypeError('counts must be a non-empty array.');
  assertFinite(residual, 'residual');

  return counts.map((count) => {
    const weight = gloveWeight(count, { xMax, alpha });
    return {
      count,
      weight,
      included: count > 0,
      target: count > 0 ? logCooccurrenceTarget(count) : null,
      contribution: weight * residual ** 2,
    };
  });
}
