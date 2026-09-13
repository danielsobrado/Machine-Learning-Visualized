export const FUNDAMENTALS_ARCHITECTURE = Object.freeze([2, 2, 1]);

function requireFiniteVector(values, name) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector`);
  }
}

export function relu(value) {
  if (!Number.isFinite(value)) throw new TypeError('value must be finite');
  return Math.max(0, value);
}

export function parameterCount(widths) {
  if (!Array.isArray(widths) || widths.length < 2 || widths.some((width) => !Number.isInteger(width) || width <= 0)) {
    throw new TypeError('widths must contain at least two positive integer dimensions');
  }

  return widths.slice(0, -1).reduce((total, width, index) => {
    const nextWidth = widths[index + 1];
    return total + width * nextWidth + nextWidth;
  }, 0);
}

export function parameterLedger(widths) {
  if (!Array.isArray(widths) || widths.length < 2) throw new TypeError('widths must describe at least one layer');
  return widths.slice(0, -1).map((inputWidth, index) => {
    const outputWidth = widths[index + 1];
    const weights = inputWidth * outputWidth;
    const biases = outputWidth;
    return {
      layer: index + 1,
      inputWidth,
      outputWidth,
      weights,
      biases,
      total: weights + biases,
    };
  });
}

export function xorReluForward(input) {
  requireFiniteVector(input, 'input');
  if (input.length !== 2) throw new RangeError('xorReluForward expects two input features');

  const [x1, x2] = input;
  const hiddenPre = [x1 - x2, x2 - x1];
  const hidden = hiddenPre.map(relu);
  const output = hidden[0] + hidden[1];

  return {
    input: [...input],
    hiddenPre,
    hidden,
    output,
    prediction: output >= 0.5 ? 1 : 0,
  };
}

export function shapeLedger({ batchSize = 4, inputWidth = 2, hiddenWidth = 2, outputWidth = 1 } = {}) {
  const values = [batchSize, inputWidth, hiddenWidth, outputWidth];
  if (values.some((value) => !Number.isInteger(value) || value <= 0)) {
    throw new TypeError('all shape dimensions must be positive integers');
  }

  return [
    { label: 'Input X', shape: [batchSize, inputWidth] },
    { label: 'W₁', shape: [inputWidth, hiddenWidth] },
    { label: 'Hidden H', shape: [batchSize, hiddenWidth] },
    { label: 'W₂', shape: [hiddenWidth, outputWidth] },
    { label: 'Output ŷ', shape: [batchSize, outputWidth] },
  ];
}

export function xorTruthTable() {
  return [[0, 0], [0, 1], [1, 0], [1, 1]].map((input) => ({
    ...xorReluForward(input),
    target: input[0] ^ input[1],
  }));
}
