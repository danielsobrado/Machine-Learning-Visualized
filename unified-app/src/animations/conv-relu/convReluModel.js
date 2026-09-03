export const POLARITY_KERNEL = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
];

export const BRIGHT_RIGHT_PATCH = [
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1],
];

export const BRIGHT_LEFT_PATCH = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
];

function validateMatrix(matrix, name) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0])) {
    throw new TypeError(`${name} must be a non-empty matrix.`);
  }

  const width = matrix[0].length;
  if (width === 0 || matrix.some((row) => !Array.isArray(row) || row.length !== width)) {
    throw new TypeError(`${name} must be rectangular.`);
  }

  if (matrix.flat().some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must contain only finite numbers.`);
  }
}

export function negateKernel(kernel) {
  validateMatrix(kernel, 'kernel');
  return kernel.map((row) => row.map((value) => -value));
}

export function filterResponse(patch, kernel, bias = 0) {
  validateMatrix(patch, 'patch');
  validateMatrix(kernel, 'kernel');

  if (!Number.isFinite(bias)) {
    throw new TypeError('bias must be finite.');
  }

  if (patch.length !== kernel.length || patch[0].length !== kernel[0].length) {
    throw new RangeError('patch and kernel must have identical shapes.');
  }

  return patch.reduce(
    (sum, row, rowIndex) => sum + row.reduce(
      (rowSum, value, columnIndex) => rowSum + value * kernel[rowIndex][columnIndex],
      0,
    ),
    bias,
  );
}

export function relu(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError('value must be finite.');
  }
  return Math.max(0, value);
}

export function pairedPolarityResponse(patch, kernel = POLARITY_KERNEL) {
  const positiveResponse = filterResponse(patch, kernel);
  const negativeResponse = filterResponse(patch, negateKernel(kernel));
  const positiveChannel = relu(positiveResponse);
  const negativeChannel = relu(negativeResponse);

  return {
    positiveResponse,
    negativeResponse,
    positiveChannel,
    negativeChannel,
    combinedStrength: positiveChannel + negativeChannel,
  };
}

export function polarityExperiment({
  firstPatch = BRIGHT_RIGHT_PATCH,
  secondPatch = BRIGHT_LEFT_PATCH,
  kernel = POLARITY_KERNEL,
} = {}) {
  const first = pairedPolarityResponse(firstPatch, kernel);
  const second = pairedPolarityResponse(secondPatch, kernel);

  return {
    first,
    second,
    singleFilterDropsOnePolarity:
      (first.positiveChannel === 0 && second.positiveChannel > 0)
      || (second.positiveChannel === 0 && first.positiveChannel > 0),
    pairedStrengthMatches: Math.abs(first.combinedStrength - second.combinedStrength) < 1e-12,
  };
}
