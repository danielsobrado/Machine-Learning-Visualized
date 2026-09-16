import {
  ACTIVATION_CHAIN_DEFAULTS,
  ACTIVATION_FAMILY_DEFAULTS,
  CONV_NEXT_DEFAULTS,
  CONV_RELU_BACKWARD_DEFAULTS,
  POOLING_COMPARISON_DEFAULTS,
} from './neuralCnnNextConstants.js';

const EPSILON = 1e-12;
const SQRT_TWO_PI = Math.sqrt(2 * Math.PI);

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function normalCdfApprox(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * erf);
}

export function activationDerivative(activation, z) {
  switch (activation) {
    case 'sigmoid': {
      const s = sigmoid(z);
      return s * (1 - s);
    }
    case 'tanh': {
      const t = Math.tanh(z);
      return 1 - t * t;
    }
    case 'relu':
      return z > 0 ? 1 : 0;
    case 'gelu':
      return normalCdfApprox(z) + (z * Math.exp(-(z * z) / 2)) / SQRT_TWO_PI;
    default:
      throw new Error(`Unsupported activation: ${activation}`);
  }
}

export function buildActivationChainComparison({
  depth = ACTIVATION_CHAIN_DEFAULTS.depth,
  presets = ACTIVATION_CHAIN_DEFAULTS.presets,
} = {}) {
  return presets.map((preset) => {
    const localDerivative = activationDerivative(preset.activation, preset.z);
    const localFactor = localDerivative * preset.gain;
    const trace = Array.from({ length: depth + 1 }, (_, step) => ({
      step,
      gradient: Math.pow(localFactor, step),
    }));
    const finalGradient = trace.at(-1).gradient;
    return {
      ...preset,
      localDerivative,
      localFactor,
      trace,
      finalGradient,
      log10Magnitude: Math.log10(Math.max(Math.abs(finalGradient), EPSILON)),
    };
  });
}

export function activationFamilyPoint({
  x = ACTIVATION_FAMILY_DEFAULTS.x,
  preluSlope = ACTIVATION_FAMILY_DEFAULTS.preluSlope,
  leakySlope = ACTIVATION_FAMILY_DEFAULTS.leakySlope,
  eluAlpha = ACTIVATION_FAMILY_DEFAULTS.eluAlpha,
} = {}) {
  const negative = x < 0;
  return {
    x,
    relu: { value: Math.max(0, x), derivative: x > 0 ? 1 : 0 },
    leakyRelu: { value: negative ? leakySlope * x : x, derivative: negative ? leakySlope : 1 },
    prelu: { value: negative ? preluSlope * x : x, derivative: negative ? preluSlope : 1 },
    elu: {
      value: negative ? eluAlpha * (Math.exp(x) - 1) : x,
      derivative: negative ? eluAlpha * Math.exp(x) : 1,
    },
  };
}

function validCrossCorrelation(input, kernel) {
  const outputRows = input.length - kernel.length + 1;
  const outputCols = input[0].length - kernel[0].length + 1;
  return Array.from({ length: outputRows }, (_, row) => (
    Array.from({ length: outputCols }, (_, col) => {
      let sum = 0;
      for (let kr = 0; kr < kernel.length; kr += 1) {
        for (let kc = 0; kc < kernel[0].length; kc += 1) {
          sum += input[row + kr][col + kc] * kernel[kr][kc];
        }
      }
      return sum;
    })
  ));
}

function addMatrices(matrices, bias = 0) {
  return matrices[0].map((row, rowIndex) => row.map((_, colIndex) => (
    matrices.reduce((sum, matrix) => sum + matrix[rowIndex][colIndex], bias)
  )));
}

export function buildMultiChannelConv({
  input = CONV_NEXT_DEFAULTS.input,
  filters = CONV_NEXT_DEFAULTS.filters,
} = {}) {
  return filters.map((filter) => {
    const channelContributions = filter.kernels.map((kernel, channelIndex) => (
      validCrossCorrelation(input[channelIndex], kernel)
    ));
    return {
      label: filter.label,
      bias: filter.bias,
      channelContributions,
      output: addMatrices(channelContributions, filter.bias),
    };
  });
}

function zerosLike(matrix) {
  return matrix.map((row) => row.map(() => 0));
}

export function buildConvReluBackward({
  input = CONV_RELU_BACKWARD_DEFAULTS.input,
  kernel = CONV_RELU_BACKWARD_DEFAULTS.kernel,
  bias = CONV_RELU_BACKWARD_DEFAULTS.bias,
  upstream = CONV_RELU_BACKWARD_DEFAULTS.upstream,
} = {}) {
  const convolution = validCrossCorrelation(input, kernel).map((row) => row.map((value) => value + bias));
  const activation = convolution.map((row) => row.map((value) => Math.max(0, value)));
  const gate = convolution.map((row) => row.map((value) => (value > 0 ? 1 : 0)));
  const dPreActivation = upstream.map((row, rowIndex) => row.map((value, colIndex) => value * gate[rowIndex][colIndex]));
  const dKernel = zerosLike(kernel);
  const dInput = zerosLike(input);
  let dBias = 0;

  for (let row = 0; row < dPreActivation.length; row += 1) {
    for (let col = 0; col < dPreActivation[0].length; col += 1) {
      const gradient = dPreActivation[row][col];
      dBias += gradient;
      for (let kr = 0; kr < kernel.length; kr += 1) {
        for (let kc = 0; kc < kernel[0].length; kc += 1) {
          dKernel[kr][kc] += input[row + kr][col + kc] * gradient;
          dInput[row + kr][col + kc] += kernel[kr][kc] * gradient;
        }
      }
    }
  }

  return { convolution, activation, gate, upstream, dPreActivation, dKernel, dInput, dBias };
}

function scaleMatrix(matrix, factor) {
  return matrix.map((row) => row.map((value) => value * factor));
}

export function buildPoolingComparison({
  patch = POOLING_COMPARISON_DEFAULTS.patch,
  stridedKernel = POOLING_COMPARISON_DEFAULTS.stridedKernel,
  upstream = POOLING_COMPARISON_DEFAULTS.upstream,
} = {}) {
  const flat = patch.flat();
  const maxValue = Math.max(...flat);
  const maxIndex = flat.indexOf(maxValue);
  const averageValue = flat.reduce((sum, value) => sum + value, 0) / flat.length;
  const convValue = patch.reduce((sum, row, rowIndex) => (
    sum + row.reduce((inner, value, colIndex) => inner + value * stridedKernel[rowIndex][colIndex], 0)
  ), 0);
  const maxGradient = patch.map((row, rowIndex) => row.map((_, colIndex) => (
    rowIndex * patch[0].length + colIndex === maxIndex ? upstream : 0
  )));
  const averageGradient = scaleMatrix(patch.map((row) => row.map(() => 1)), upstream / flat.length);
  const convGradient = scaleMatrix(stridedKernel, upstream);

  return {
    max: { value: maxValue, inputGradient: maxGradient },
    average: { value: averageValue, inputGradient: averageGradient },
    stridedConv: { value: convValue, inputGradient: convGradient },
  };
}
