import {
  GRADIENT_PROBLEM_DEFAULTS,
  GRADIENT_THRESHOLDS,
  LEAKY_RELU_SLOPE,
  VALUE_BOUNDS,
} from './gradientProblemsConstants.js';

function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function assertRange(value, name, min, max) {
  assertFinite(value, name);
  if (value < min || value > max) throw new RangeError(`${name} must be between ${min} and ${max}`);
}

function assertDepth(depth) {
  if (!Number.isInteger(depth) || depth < VALUE_BOUNDS.minDepth || depth > VALUE_BOUNDS.maxDepth) {
    throw new RangeError(`depth must be an integer between ${VALUE_BOUNDS.minDepth} and ${VALUE_BOUNDS.maxDepth}`);
  }
}

function sigmoid(value) {
  if (value >= 0) {
    const exp = Math.exp(-value);
    return 1 / (1 + exp);
  }
  const exp = Math.exp(value);
  return exp / (1 + exp);
}

export function activationState(value, activationId) {
  assertFinite(value, 'activation input');

  switch (activationId) {
    case 'linear':
      return { output: value, slope: 1, state: 'linear' };
    case 'tanh': {
      const output = Math.tanh(value);
      const slope = 1 - (output ** 2);
      return { output, slope, state: slope < 0.05 ? 'saturated' : 'active' };
    }
    case 'sigmoid': {
      const output = sigmoid(value);
      const slope = output * (1 - output);
      return { output, slope, state: slope < 0.05 ? 'saturated' : 'active' };
    }
    case 'relu':
      return value > 0
        ? { output: value, slope: 1, state: 'active' }
        : { output: 0, slope: 0, state: 'blocked' };
    case 'leakyRelu':
      return value > 0
        ? { output: value, slope: 1, state: 'active' }
        : { output: LEAKY_RELU_SLOPE * value, slope: LEAKY_RELU_SLOPE, state: 'leaking' };
    default:
      throw new RangeError(`unsupported activation: ${activationId}`);
  }
}

export function blockDerivative({ weight, activationSlope, useResidual, residualScale }) {
  assertFinite(weight, 'weight');
  assertFinite(activationSlope, 'activationSlope');
  assertFinite(residualScale, 'residualScale');
  const branchDerivative = residualScale * weight * activationSlope;
  return useResidual ? 1 + branchDerivative : weight * activationSlope;
}

export function buildGradientTrace({
  depth = GRADIENT_PROBLEM_DEFAULTS.depth,
  input = GRADIENT_PROBLEM_DEFAULTS.input,
  weight = GRADIENT_PROBLEM_DEFAULTS.weight,
  bias = GRADIENT_PROBLEM_DEFAULTS.bias,
  activationId = GRADIENT_PROBLEM_DEFAULTS.activationId,
  useResidual = GRADIENT_PROBLEM_DEFAULTS.useResidual,
  residualScale = GRADIENT_PROBLEM_DEFAULTS.residualScale,
  outputGradient = GRADIENT_PROBLEM_DEFAULTS.outputGradient,
} = {}) {
  assertDepth(depth);
  assertRange(input, 'input', -VALUE_BOUNDS.maxAbsoluteInput, VALUE_BOUNDS.maxAbsoluteInput);
  assertRange(weight, 'weight', -VALUE_BOUNDS.maxAbsoluteWeight, VALUE_BOUNDS.maxAbsoluteWeight);
  assertRange(bias, 'bias', -VALUE_BOUNDS.maxAbsoluteBias, VALUE_BOUNDS.maxAbsoluteBias);
  assertRange(residualScale, 'residualScale', VALUE_BOUNDS.minResidualScale, VALUE_BOUNDS.maxResidualScale);
  assertFinite(outputGradient, 'outputGradient');
  if (typeof useResidual !== 'boolean') throw new TypeError('useResidual must be boolean');

  const layers = [];
  let current = input;

  for (let index = 0; index < depth; index += 1) {
    const preActivation = (weight * current) + bias;
    const activation = activationState(preActivation, activationId);
    const output = useResidual
      ? current + (residualScale * activation.output)
      : activation.output;
    const localDerivative = blockDerivative({
      weight,
      activationSlope: activation.slope,
      useResidual,
      residualScale,
    });

    if (!Number.isFinite(output) || !Number.isFinite(localDerivative)) {
      throw new RangeError('configuration produced non-finite forward values');
    }

    layers.push({
      layer: index + 1,
      input: current,
      preActivation,
      activationOutput: activation.output,
      activationSlope: activation.slope,
      activationState: activation.state,
      localDerivative,
      output,
    });
    current = output;
  }

  let upstream = outputGradient;
  const weightGradients = new Array(depth);
  const biasGradients = new Array(depth);

  for (let index = depth - 1; index >= 0; index -= 1) {
    const layer = layers[index];
    const branchScale = useResidual ? residualScale : 1;
    const weightGradient = upstream * branchScale * layer.activationSlope * layer.input;
    const biasGradient = upstream * branchScale * layer.activationSlope;
    const inputGradient = upstream * layer.localDerivative;

    if (![weightGradient, biasGradient, inputGradient].every(Number.isFinite)) {
      throw new RangeError('configuration produced non-finite backward values');
    }

    weightGradients[index] = weightGradient;
    biasGradients[index] = biasGradient;
    layers[index] = {
      ...layer,
      upstreamGradient: upstream,
      weightGradient,
      biasGradient,
      inputGradient,
    };
    upstream = inputGradient;
  }

  const parameterGradients = layers.flatMap((layer) => [layer.weightGradient, layer.biasGradient]);
  return {
    layers,
    output: current,
    inputGradient: upstream,
    parameterGradients,
    parameterGradientNorm: l2Norm(parameterGradients),
  };
}

export function l2Norm(values) {
  if (!Array.isArray(values) || values.length === 0) throw new RangeError('values must be a non-empty array');
  let sumSquares = 0;
  values.forEach((value) => {
    assertFinite(value, 'gradient');
    sumSquares += value ** 2;
  });
  return Math.sqrt(sumSquares);
}

export function clipByGlobalNorm(values, threshold) {
  if (!Array.isArray(values) || values.length === 0) throw new RangeError('values must be a non-empty array');
  assertRange(threshold, 'threshold', 0, VALUE_BOUNDS.maxClipNorm);
  const norm = l2Norm(values);
  const scale = threshold > 0 && norm > threshold ? threshold / norm : 1;
  const clipped = values.map((value) => value * scale);
  return {
    originalNorm: norm,
    clippedNorm: l2Norm(clipped),
    scale,
    clipped,
    wasClipped: scale < 1,
  };
}

export function diagnoseGradient(value) {
  assertFinite(value, 'gradient');
  const magnitude = Math.abs(value);
  if (magnitude < GRADIENT_THRESHOLDS.vanishing) return 'vanishing';
  if (magnitude > GRADIENT_THRESHOLDS.exploding) return 'exploding';
  return 'stable';
}

export function logMagnitude(value) {
  assertFinite(value, 'gradient');
  if (value === 0) return GRADIENT_THRESHOLDS.logFloor;
  return Math.max(GRADIENT_THRESHOLDS.logFloor, Math.log10(Math.abs(value)));
}
