import {
  ACTIVATION_PROFILES,
  HEALTH_THRESHOLDS,
  INITIALIZATION_METHODS,
} from './initializationConstants.js';

function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

function requireKnownKey(collection, key, name) {
  if (!Object.hasOwn(collection, key)) {
    throw new RangeError(`Unknown ${name}: ${key}`);
  }
}

export function weightVariance(method, { fanIn, fanOut }) {
  requireKnownKey(INITIALIZATION_METHODS, method, 'initialization method');
  requirePositiveInteger(fanIn, 'fanIn');
  requirePositiveInteger(fanOut, 'fanOut');

  switch (method) {
    case 'tiny':
      return 0.0064 / fanIn;
    case 'xavier':
      return 2 / (fanIn + fanOut);
    case 'he':
      return 2 / fanIn;
    case 'huge':
      return 9 / fanIn;
    default:
      throw new RangeError(`Unknown initialization method: ${method}`);
  }
}

export function classifyScale(scale) {
  if (!Number.isFinite(scale) || scale < 0) {
    throw new RangeError('scale must be a finite non-negative number');
  }

  if (scale < HEALTH_THRESHOLDS.vanishing) return 'vanishing';
  if (scale > HEALTH_THRESHOLDS.exploding) return 'exploding';
  return 'stable';
}

export function propagationMultipliers({ method, activation, fanIn, fanOut }) {
  requireKnownKey(ACTIVATION_PROFILES, activation, 'activation');
  const variance = weightVariance(method, { fanIn, fanOut });
  const profile = ACTIVATION_PROFILES[activation];

  return {
    weightVariance: variance,
    weightStd: Math.sqrt(variance),
    forwardMultiplier: fanIn * variance * profile.forwardFactor,
    backwardMultiplier: fanOut * variance * profile.backwardFactor,
  };
}

export function propagationSeries(multiplier, layers) {
  if (!Number.isFinite(multiplier) || multiplier < 0) {
    throw new RangeError('multiplier must be a finite non-negative number');
  }
  requirePositiveInteger(layers, 'layers');

  return Array.from({ length: layers }, (_, index) => {
    const depth = index + 1;
    const scale = multiplier ** depth;

    return {
      depth,
      scale,
      health: classifyScale(scale),
    };
  });
}

export function analyzeInitialization({ method, activation, fanIn, fanOut, layers }) {
  requirePositiveInteger(layers, 'layers');
  const multipliers = propagationMultipliers({ method, activation, fanIn, fanOut });
  const forwardSeries = propagationSeries(multipliers.forwardMultiplier, layers);
  const backwardSeries = propagationSeries(multipliers.backwardMultiplier, layers);
  const finalForward = forwardSeries.at(-1)?.scale ?? 1;
  const finalBackward = backwardSeries.at(-1)?.scale ?? 1;
  const forwardHealth = classifyScale(finalForward);
  const backwardHealth = classifyScale(finalBackward);

  return {
    ...multipliers,
    forwardSeries,
    backwardSeries,
    finalForward,
    finalBackward,
    forwardHealth,
    backwardHealth,
    healthAgreement: forwardHealth === backwardHealth,
    hiddenGradientFailure: forwardHealth === 'stable' && backwardHealth !== 'stable',
  };
}

export function scaleToPercent(scale) {
  if (!Number.isFinite(scale) || scale < 0) return 100;
  if (scale === 0) return 4;

  const logScale = Math.log10(scale);
  return Math.min(100, Math.max(4, 50 + logScale * 24));
}
