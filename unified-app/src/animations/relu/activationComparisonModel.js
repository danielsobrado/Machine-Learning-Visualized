import {
  ACTIVATION_KINDS,
  GELU_TANH_COEFFICIENT,
  GELU_TANH_SCALE,
  LEAKY_RELU_ALPHA,
} from './activationComparisonConstants.js';

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

function sigmoid(value) {
  if (value >= 0) {
    const exp = Math.exp(-value);
    return 1 / (1 + exp);
  }
  const exp = Math.exp(value);
  return exp / (1 + exp);
}

function geluTanh(value) {
  const inner = GELU_TANH_SCALE * (value + (GELU_TANH_COEFFICIENT * value ** 3));
  return 0.5 * value * (1 + Math.tanh(inner));
}

function geluTanhDerivative(value) {
  const inner = GELU_TANH_SCALE * (value + (GELU_TANH_COEFFICIENT * value ** 3));
  const tanhInner = Math.tanh(inner);
  const innerDerivative = GELU_TANH_SCALE * (1 + (3 * GELU_TANH_COEFFICIENT * value ** 2));
  return 0.5 * (1 + tanhInner)
    + (0.5 * value * (1 - tanhInner ** 2) * innerDerivative);
}

export function activationState(kind, input) {
  requireFinite(input, 'input');

  switch (kind) {
    case 'relu':
      return { output: Math.max(0, input), derivative: input > 0 ? 1 : 0 };
    case 'leaky-relu':
      return {
        output: input >= 0 ? input : LEAKY_RELU_ALPHA * input,
        derivative: input >= 0 ? 1 : LEAKY_RELU_ALPHA,
      };
    case 'sigmoid': {
      const output = sigmoid(input);
      return { output, derivative: output * (1 - output) };
    }
    case 'tanh': {
      const output = Math.tanh(input);
      return { output, derivative: 1 - (output ** 2) };
    }
    case 'gelu':
      return { output: geluTanh(input), derivative: geluTanhDerivative(input) };
    default:
      throw new RangeError(`Unknown activation: ${kind}`);
  }
}

export function compareActivations(input, upstreamGradient) {
  requireFinite(upstreamGradient, 'upstreamGradient');
  return ACTIVATION_KINDS.map((activation) => {
    const state = activationState(activation.id, input);
    return {
      ...activation,
      ...state,
      passedGradient: upstreamGradient * state.derivative,
    };
  });
}
