function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

export function sigmoid(value) {
  requireFinite(value, 'value');
  if (value >= 0) {
    const exp = Math.exp(-value);
    return 1 / (1 + exp);
  }
  const exp = Math.exp(value);
  return exp / (1 + exp);
}

export function lstmScalarStep({
  previousCell,
  forgetLogit,
  inputLogit,
  candidateLogit,
  outputLogit,
}) {
  [previousCell, forgetLogit, inputLogit, candidateLogit, outputLogit].forEach((value, index) => {
    requireFinite(value, ['previousCell', 'forgetLogit', 'inputLogit', 'candidateLogit', 'outputLogit'][index]);
  });

  const forgetGate = sigmoid(forgetLogit);
  const inputGate = sigmoid(inputLogit);
  const candidate = Math.tanh(candidateLogit);
  const outputGate = sigmoid(outputLogit);
  const retainedMemory = forgetGate * previousCell;
  const writtenMemory = inputGate * candidate;
  const cell = retainedMemory + writtenMemory;
  const hidden = outputGate * Math.tanh(cell);

  return {
    forgetGate,
    inputGate,
    candidate,
    outputGate,
    retainedMemory,
    writtenMemory,
    cell,
    hidden,
    directCellGradient: forgetGate,
  };
}

export function memoryRetention(forgetGate, steps) {
  requireFinite(forgetGate, 'forgetGate');
  if (forgetGate < 0 || forgetGate > 1) throw new RangeError('forgetGate must be in [0, 1]');
  if (!Number.isInteger(steps) || steps < 0) throw new RangeError('steps must be a non-negative integer');
  return forgetGate ** steps;
}

export function retentionSeries(forgetGate, steps) {
  if (!Number.isInteger(steps) || steps < 1) throw new RangeError('steps must be a positive integer');
  return Array.from({ length: steps + 1 }, (_, step) => ({
    step,
    retention: memoryRetention(forgetGate, step),
  }));
}

export function stepsUntilRetentionBelow(forgetGate, threshold) {
  requireFinite(forgetGate, 'forgetGate');
  requireFinite(threshold, 'threshold');
  if (forgetGate < 0 || forgetGate > 1) throw new RangeError('forgetGate must be in [0, 1]');
  if (threshold <= 0 || threshold >= 1) throw new RangeError('threshold must be in (0, 1)');
  if (forgetGate === 1) return Number.POSITIVE_INFINITY;
  if (forgetGate === 0) return 1;
  return Math.ceil(Math.log(threshold) / Math.log(forgetGate));
}
