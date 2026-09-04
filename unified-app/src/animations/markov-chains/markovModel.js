const TOLERANCE = 1e-10;

function assertVector(vector, size, name) {
  if (!Array.isArray(vector) || vector.length !== size || vector.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new TypeError(`${name} must contain ${size} finite non-negative values`);
  }
  const total = vector.reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 1e-9) throw new RangeError(`${name} must sum to one`);
}

export function validateTransitionMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0 || matrix.some((row) => !Array.isArray(row) || row.length !== matrix.length)) {
    throw new TypeError('transition matrix must be non-empty and square');
  }
  matrix.forEach((row) => {
    if (row.some((value) => !Number.isFinite(value) || value < 0 || value > 1)) {
      throw new RangeError('transition probabilities must be in [0, 1]');
    }
    if (Math.abs(row.reduce((sum, value) => sum + value, 0) - 1) > 1e-9) {
      throw new RangeError('each transition row must sum to one');
    }
  });
  return true;
}

export function stepDistribution(distribution, matrix) {
  validateTransitionMatrix(matrix);
  assertVector(distribution, matrix.length, 'distribution');
  return matrix.map((_, target) => matrix.reduce((sum, row, source) => sum + distribution[source] * row[target], 0));
}

export function distributionAfter(distribution, matrix, steps) {
  if (!Number.isInteger(steps) || steps < 0) throw new RangeError('steps must be a non-negative integer');
  let current = [...distribution];
  for (let step = 0; step < steps; step += 1) current = stepDistribution(current, matrix);
  return current;
}

function reachable(matrix, source) {
  const seen = new Set([source]);
  const stack = [source];
  while (stack.length > 0) {
    const current = stack.pop();
    matrix[current].forEach((probability, next) => {
      if (probability > TOLERANCE && !seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    });
  }
  return seen;
}

export function isIrreducible(matrix) {
  validateTransitionMatrix(matrix);
  return matrix.every((_, state) => reachable(matrix, state).size === matrix.length);
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function multiplyMatrices(left, right) {
  const size = left.length;
  return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => (
    left[row].reduce((sum, value, inner) => sum + value * right[inner][column], 0)
  )));
}

export function estimatedPeriod(matrix, maxPower = 24) {
  validateTransitionMatrix(matrix);
  if (!isIrreducible(matrix)) return null;
  let power = matrix.map((row) => [...row]);
  let period = 0;
  for (let n = 1; n <= maxPower; n += 1) {
    if (power[0][0] > TOLERANCE) period = period === 0 ? n : gcd(period, n);
    power = multiplyMatrices(power, matrix);
  }
  return period || null;
}

export function stationaryFromIteration(matrix, iterations = 5000) {
  validateTransitionMatrix(matrix);
  let distribution = Array.from({ length: matrix.length }, () => 1 / matrix.length);
  for (let index = 0; index < iterations; index += 1) distribution = stepDistribution(distribution, matrix);
  return distribution;
}

export function stationaryResidual(distribution, matrix) {
  const next = stepDistribution(distribution, matrix);
  return Math.max(...distribution.map((value, index) => Math.abs(value - next[index])));
}

export function l1Distance(left, right) {
  if (left.length !== right.length) throw new RangeError('vectors must have equal length');
  return left.reduce((sum, value, index) => sum + Math.abs(value - right[index]), 0);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function samplePath({ matrix, startState, steps, seed }) {
  validateTransitionMatrix(matrix);
  if (!Number.isInteger(startState) || startState < 0 || startState >= matrix.length) throw new RangeError('invalid start state');
  if (!Number.isInteger(steps) || steps < 0) throw new RangeError('steps must be non-negative');
  const random = mulberry32(seed);
  const path = [startState];
  let state = startState;
  for (let step = 0; step < steps; step += 1) {
    const draw = random();
    let cumulative = 0;
    let next = matrix.length - 1;
    for (let candidate = 0; candidate < matrix.length; candidate += 1) {
      cumulative += matrix[state][candidate];
      if (draw <= cumulative) {
        next = candidate;
        break;
      }
    }
    state = next;
    path.push(state);
  }
  return path;
}

export function buildMarkovLab({ matrix, steps, seed }) {
  validateTransitionMatrix(matrix);
  const first = Array.from({ length: matrix.length }, (_, index) => index === 0 ? 1 : 0);
  const last = Array.from({ length: matrix.length }, (_, index) => index === matrix.length - 1 ? 1 : 0);
  const uniform = Array.from({ length: matrix.length }, () => 1 / matrix.length);
  const fromFirst = distributionAfter(first, matrix, steps);
  const fromLast = distributionAfter(last, matrix, steps);
  const fromUniform = distributionAfter(uniform, matrix, steps);
  const irreducible = isIrreducible(matrix);
  const period = estimatedPeriod(matrix);
  const stationaryCandidate = stationaryFromIteration(matrix);
  return {
    fromFirst,
    fromLast,
    fromUniform,
    startSensitivity: l1Distance(fromFirst, fromLast),
    irreducible,
    period,
    aperiodic: period === 1,
    stationaryCandidate,
    stationaryResidual: stationaryResidual(stationaryCandidate, matrix),
    path: samplePath({ matrix, startState: 0, steps, seed }),
  };
}
