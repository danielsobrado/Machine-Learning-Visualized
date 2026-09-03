export const XOR_INPUTS = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

export const AFFINE_STACK = {
  firstWeights: [
    [2, -1],
    [1, 3],
  ],
  firstBias: [0.5, -0.5],
  secondWeights: [[1.5, -2]],
  secondBias: [0.25],
};

function validateVector(vector, name) {
  if (!Array.isArray(vector) || vector.length === 0 || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector.`);
  }
}

function validateMatrix(matrix, name) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0])) {
    throw new TypeError(`${name} must be a non-empty matrix.`);
  }
  const width = matrix[0].length;
  if (width === 0 || matrix.some((row) => !Array.isArray(row) || row.length !== width)) {
    throw new TypeError(`${name} must be rectangular.`);
  }
  if (matrix.flat().some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must contain finite numbers.`);
  }
}

export function relu(value) {
  if (!Number.isFinite(value)) throw new TypeError('value must be finite.');
  return Math.max(0, value);
}

export function applyAffine(input, weights, bias) {
  validateVector(input, 'input');
  validateMatrix(weights, 'weights');
  validateVector(bias, 'bias');

  if (weights[0].length !== input.length || weights.length !== bias.length) {
    throw new RangeError('affine shapes are incompatible.');
  }

  return weights.map((row, rowIndex) => (
    row.reduce((sum, weight, columnIndex) => sum + weight * input[columnIndex], bias[rowIndex])
  ));
}

export function composeAffineLayers(firstWeights, firstBias, secondWeights, secondBias) {
  validateMatrix(firstWeights, 'firstWeights');
  validateVector(firstBias, 'firstBias');
  validateMatrix(secondWeights, 'secondWeights');
  validateVector(secondBias, 'secondBias');

  if (firstWeights.length !== firstBias.length
    || secondWeights[0].length !== firstWeights.length
    || secondWeights.length !== secondBias.length) {
    throw new RangeError('layer shapes are incompatible.');
  }

  const combinedWeights = secondWeights.map((secondRow) => (
    firstWeights[0].map((_, inputIndex) => secondRow.reduce(
      (sum, secondWeight, hiddenIndex) => sum + secondWeight * firstWeights[hiddenIndex][inputIndex],
      0,
    ))
  ));

  const combinedBias = secondWeights.map((secondRow, outputIndex) => (
    secondRow.reduce(
      (sum, secondWeight, hiddenIndex) => sum + secondWeight * firstBias[hiddenIndex],
      secondBias[outputIndex],
    )
  ));

  return { weights: combinedWeights, bias: combinedBias };
}

export function affineStackExperiment(input, stack = AFFINE_STACK) {
  const hidden = applyAffine(input, stack.firstWeights, stack.firstBias);
  const stackedOutput = applyAffine(hidden, stack.secondWeights, stack.secondBias);
  const collapsed = composeAffineLayers(
    stack.firstWeights,
    stack.firstBias,
    stack.secondWeights,
    stack.secondBias,
  );
  const collapsedOutput = applyAffine(input, collapsed.weights, collapsed.bias);

  return {
    hidden,
    stackedOutput,
    collapsedOutput,
    collapsedWeights: collapsed.weights,
    collapsedBias: collapsed.bias,
  };
}

export function xorWithRelu(input) {
  validateVector(input, 'input');
  if (input.length !== 2) throw new RangeError('XOR input must have two values.');

  const [x1, x2] = input;
  const hidden = [relu(x1 - x2), relu(x2 - x1)];
  return {
    hidden,
    output: hidden[0] + hidden[1],
  };
}

export function xorExpressivityTable() {
  return XOR_INPUTS.map((input) => ({
    input,
    target: input[0] ^ input[1],
    ...xorWithRelu(input),
  }));
}
