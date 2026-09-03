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

export function padInput(input, padding) {
  requireMatrix(input, 'input');
  if (!Number.isInteger(padding) || padding < 0) throw new RangeError('padding must be a non-negative integer');
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
