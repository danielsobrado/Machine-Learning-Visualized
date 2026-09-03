function requireFiniteArray(values, name) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty array of finite numbers`);
  }
}

export function maxPoolWindow(values, upstreamGradient = 1) {
  requireFiniteArray(values, 'values');
  if (!Number.isFinite(upstreamGradient)) throw new RangeError('upstreamGradient must be finite');
  const maxValue = Math.max(...values);
  const winnerIndex = values.findIndex((value) => value === maxValue);
  const tieIndices = values.flatMap((value, index) => value === maxValue ? [index] : []);
  const inputGradients = values.map((_, index) => index === winnerIndex ? upstreamGradient : 0);
  return {
    maxValue,
    winnerIndex,
    tieIndices,
    tieCount: tieIndices.length,
    inputGradients,
  };
}

export function argmaxFlipExperiment({ first, second, perturbation, upstreamGradient = 1 }) {
  if (![first, second, perturbation, upstreamGradient].every(Number.isFinite)) throw new RangeError('experiment values must be finite');
  const beforeValues = [first, second, 1, 0];
  const afterValues = [first, second + perturbation, 1, 0];
  const before = maxPoolWindow(beforeValues, upstreamGradient);
  const after = maxPoolWindow(afterValues, upstreamGradient);
  const gradientL1Change = before.inputGradients.reduce((sum, value, index) => sum + Math.abs(value - after.inputGradients[index]), 0);
  return {
    beforeValues,
    afterValues,
    before,
    after,
    outputChange: after.maxValue - before.maxValue,
    gradientL1Change,
    routeFlipped: before.winnerIndex !== after.winnerIndex,
  };
}

export function informationCollision(firstWindow, secondWindow) {
  requireFiniteArray(firstWindow, 'firstWindow');
  requireFiniteArray(secondWindow, 'secondWindow');
  if (firstWindow.length !== secondWindow.length) throw new RangeError('windows must have the same length');
  const first = maxPoolWindow(firstWindow);
  const second = maxPoolWindow(secondWindow);
  const firstMean = firstWindow.reduce((sum, value) => sum + value, 0) / firstWindow.length;
  const secondMean = secondWindow.reduce((sum, value) => sum + value, 0) / secondWindow.length;
  return {
    first,
    second,
    samePooledOutput: first.maxValue === second.maxValue,
    firstMean,
    secondMean,
    meanDifference: secondMean - firstMean,
  };
}

export function poolMatrix(matrix, poolSize, stride) {
  if (!Array.isArray(matrix) || matrix.length === 0 || matrix.some((row) => !Array.isArray(row) || row.length !== matrix.length || row.some((value) => !Number.isFinite(value)))) {
    throw new TypeError('matrix must be a non-empty square matrix of finite numbers');
  }
  if (!Number.isInteger(poolSize) || poolSize <= 0 || poolSize > matrix.length) throw new RangeError('poolSize must fit inside the matrix');
  if (!Number.isInteger(stride) || stride <= 0) throw new RangeError('stride must be a positive integer');
  const outSize = Math.floor((matrix.length - poolSize) / stride) + 1;
  return Array.from({ length: outSize }, (_, row) => Array.from({ length: outSize }, (_, col) => {
    const startRow = row * stride;
    const startCol = col * stride;
    const cells = [];
    for (let r = 0; r < poolSize; r += 1) {
      for (let c = 0; c < poolSize; c += 1) {
        cells.push({ row: startRow + r, col: startCol + c, value: matrix[startRow + r][startCol + c] });
      }
    }
    const pooled = maxPoolWindow(cells.map((cell) => cell.value));
    const winner = cells[pooled.winnerIndex];
    const average = cells.reduce((sum, cell) => sum + cell.value, 0) / cells.length;
    return { value: pooled.maxValue, winner, cells, average, tieCount: pooled.tieCount };
  }));
}
