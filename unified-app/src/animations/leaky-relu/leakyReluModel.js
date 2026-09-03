function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

export function requireAlpha(alpha) {
  requireFinite(alpha, 'alpha');
  if (alpha < 0 || alpha > 1) throw new RangeError('alpha must be in [0, 1]');
}

export function leakyRelu(value, alpha) {
  requireFinite(value, 'value');
  requireAlpha(alpha);
  return value >= 0 ? value : alpha * value;
}

export function leakyReluDerivative(value, alpha) {
  requireFinite(value, 'value');
  requireAlpha(alpha);
  return value >= 0 ? 1 : alpha;
}

export function negativeDepthPropagation({ input, upstreamGradient, alpha, depth }) {
  requireFinite(input, 'input');
  requireFinite(upstreamGradient, 'upstreamGradient');
  requireAlpha(alpha);
  if (!Number.isInteger(depth) || depth <= 0) throw new RangeError('depth must be a positive integer');
  if (input >= 0) throw new RangeError('input must be negative for the negative-branch depth experiment');

  let activation = input;
  let gradient = upstreamGradient;
  const layers = [];

  for (let layer = 1; layer <= depth; layer += 1) {
    const inputActivation = activation;
    activation = leakyRelu(activation, alpha);
    gradient *= leakyReluDerivative(inputActivation, alpha);
    layers.push({
      layer,
      inputActivation,
      outputActivation: activation,
      localSlope: alpha,
      gradient,
    });
  }

  const retention = upstreamGradient === 0 ? 0 : Math.abs(gradient / upstreamGradient);
  return {
    layers,
    finalActivation: activation,
    finalGradient: gradient,
    retention,
    closedFormRetention: alpha ** depth,
  };
}

export function depthForRetention({ alpha, minimumRetention }) {
  requireAlpha(alpha);
  requireFinite(minimumRetention, 'minimumRetention');
  if (minimumRetention <= 0 || minimumRetention >= 1) throw new RangeError('minimumRetention must be in (0, 1)');
  if (alpha === 0) return 1;
  if (alpha === 1) return Number.POSITIVE_INFINITY;
  return Math.ceil(Math.log(minimumRetention) / Math.log(alpha));
}
