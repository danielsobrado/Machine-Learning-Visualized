function requireMatrix(matrix, name) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0]) || matrix[0].length === 0) {
    throw new TypeError(`${name} must be a non-empty matrix`);
  }
  const width = matrix[0].length;
  if (matrix.some((row) => !Array.isArray(row) || row.length !== width || row.some((value) => !Number.isFinite(value)))) {
    throw new TypeError(`${name} must be a rectangular finite matrix`);
  }
}

function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive integer`);
}

function requireNonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative integer`);
}

export function effectiveKernelSize(kernelSize, dilation = 1) {
  requirePositiveInteger(kernelSize, 'kernelSize');
  requirePositiveInteger(dilation, 'dilation');
  return dilation * (kernelSize - 1) + 1;
}

export function convOutputSize({ inputSize, kernelSize, stride = 1, padding = 0, dilation = 1 }) {
  requirePositiveInteger(inputSize, 'inputSize');
  requirePositiveInteger(kernelSize, 'kernelSize');
  requirePositiveInteger(stride, 'stride');
  requireNonNegativeInteger(padding, 'padding');
  requirePositiveInteger(dilation, 'dilation');
  const effectiveKernel = effectiveKernelSize(kernelSize, dilation);
  const numerator = inputSize + (2 * padding) - effectiveKernel;
  if (numerator < 0) throw new RangeError('effective kernel cannot exceed the padded input');
  return Math.floor(numerator / stride) + 1;
}

export function stackedReceptiveField(layers) {
  if (!Array.isArray(layers) || layers.length === 0) throw new TypeError('layers must be a non-empty array');
  let receptiveField = 1;
  let jump = 1;
  const trace = layers.map((layer, index) => {
    if (!layer || typeof layer !== 'object') throw new TypeError(`layer ${index + 1} must be an object`);
    const { kernelSize, stride = 1, dilation = 1 } = layer;
    const effectiveKernel = effectiveKernelSize(kernelSize, dilation);
    requirePositiveInteger(stride, `layer ${index + 1} stride`);
    receptiveField += (effectiveKernel - 1) * jump;
    jump *= stride;
    return {
      layer: index + 1,
      effectiveKernel,
      receptiveField,
      jump,
    };
  });
  return { receptiveField, jump, trace };
}

export function conv2dParameterCount({
  inputChannels,
  outputChannels,
  kernelHeight,
  kernelWidth,
  useBias = true,
}) {
  [inputChannels, outputChannels, kernelHeight, kernelWidth].forEach((value, index) => {
    requirePositiveInteger(value, ['inputChannels', 'outputChannels', 'kernelHeight', 'kernelWidth'][index]);
  });
  if (typeof useBias !== 'boolean') throw new TypeError('useBias must be boolean');
  const weights = outputChannels * inputChannels * kernelHeight * kernelWidth;
  const biases = useBias ? outputChannels : 0;
  return { weights, biases, total: weights + biases };
}

export function conv2dLayerSummary({
  batchSize,
  inputChannels,
  inputHeight,
  inputWidth,
  outputChannels,
  kernelSize,
  stride = 1,
  padding = 0,
  dilation = 1,
  useBias = true,
}) {
  [batchSize, inputChannels, inputHeight, inputWidth, outputChannels].forEach((value, index) => {
    requirePositiveInteger(value, ['batchSize', 'inputChannels', 'inputHeight', 'inputWidth', 'outputChannels'][index]);
  });
  const effectiveKernel = effectiveKernelSize(kernelSize, dilation);
  const outputHeight = convOutputSize({ inputSize: inputHeight, kernelSize, stride, padding, dilation });
  const outputWidth = convOutputSize({ inputSize: inputWidth, kernelSize, stride, padding, dilation });
  const parameters = conv2dParameterCount({
    inputChannels,
    outputChannels,
    kernelHeight: kernelSize,
    kernelWidth: kernelSize,
    useBias,
  });

  return {
    inputShape: [batchSize, inputChannels, inputHeight, inputWidth],
    weightShape: [outputChannels, inputChannels, kernelSize, kernelSize],
    outputShape: [batchSize, outputChannels, outputHeight, outputWidth],
    effectiveKernel,
    parameters,
  };
}

export function padInput(input, padding) {
  requireMatrix(input, 'input');
  requireNonNegativeInteger(padding, 'padding');
  if (padding === 0) return input.map((row) => [...row]);
  const width = input[0].length + padding * 2;
  const border = () => Array(width).fill(0);
  return [
    ...Array.from({ length: padding }, border),
    ...input.map((row) => [...Array(padding).fill(0), ...row, ...Array(padding).fill(0)]),
    ...Array.from({ length: padding }, border),
  ];
}

export function flipKernel180(kernel) {
  requireMatrix(kernel, 'kernel');
  return [...kernel].reverse().map((row) => [...row].reverse());
}

export function outputShape(input, kernel, stride = 1) {
  requireMatrix(input, 'input');
  requireMatrix(kernel, 'kernel');
  requirePositiveInteger(stride, 'stride');
  if (kernel.length > input.length || kernel[0].length > input[0].length) {
    throw new RangeError('kernel cannot be larger than input');
  }
  return {
    rows: Math.floor((input.length - kernel.length) / stride) + 1,
    cols: Math.floor((input[0].length - kernel[0].length) / stride) + 1,
  };
}

export function crossCorrelate2d(input, kernel, stride = 1) {
  requireMatrix(input, 'input');
  requireMatrix(kernel, 'kernel');
  requirePositiveInteger(stride, 'stride');
  const shape = outputShape(input, kernel, stride);

  return Array.from({ length: shape.rows }, (_, outRow) => (
    Array.from({ length: shape.cols }, (_, outCol) => {
      let sum = 0;
      const startRow = outRow * stride;
      const startCol = outCol * stride;
      for (let kr = 0; kr < kernel.length; kr += 1) {
        for (let kc = 0; kc < kernel[0].length; kc += 1) {
          sum += input[startRow + kr][startCol + kc] * kernel[kr][kc];
        }
      }
      return sum;
    })
  ));
}

export function mathematicalConvolve2d(input, kernel, stride = 1) {
  return crossCorrelate2d(input, flipKernel180(kernel), stride);
}

export function extractPatch(input, startRow, startCol, rows, cols) {
  requireMatrix(input, 'input');
  [startRow, startCol].forEach((value, index) => {
    if (!Number.isInteger(value) || value < 0) throw new RangeError(`${index === 0 ? 'startRow' : 'startCol'} must be a non-negative integer`);
  });
  requirePositiveInteger(rows, 'rows');
  requirePositiveInteger(cols, 'cols');
  if (startRow + rows > input.length || startCol + cols > input[0].length) throw new RangeError('patch exceeds input bounds');
  return input.slice(startRow, startRow + rows).map((row) => row.slice(startCol, startCol + cols));
}

export function conventionExperiment({ input, kernel }) {
  requireMatrix(input, 'input');
  requireMatrix(kernel, 'kernel');
  const correlation = crossCorrelate2d(input, kernel, 1);
  const convolution = mathematicalConvolve2d(input, kernel, 1);
  return {
    correlation,
    convolution,
    flippedKernel: flipKernel180(kernel),
    identical: correlation.every((row, rowIndex) => row.every((value, colIndex) => value === convolution[rowIndex][colIndex])),
  };
}
