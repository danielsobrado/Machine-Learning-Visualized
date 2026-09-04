const SINGULAR_EPSILON = 1e-12;

function requireVector2(value, name) {
  if (!Array.isArray(value) || value.length !== 2 || value.some((item) => !Number.isFinite(item))) {
    throw new TypeError(`${name} must be a finite 2D vector`);
  }
}

export function determinant(b1, b2) {
  requireVector2(b1, 'b1');
  requireVector2(b2, 'b2');
  return b1[0] * b2[1] - b2[0] * b1[1];
}

export function solveCoordinates({ b1, b2, vector }) {
  requireVector2(vector, 'vector');
  const det = determinant(b1, b2);
  if (Math.abs(det) <= SINGULAR_EPSILON) throw new RangeError('basis is singular');
  return [
    (vector[0] * b2[1] - b2[0] * vector[1]) / det,
    (b1[0] * vector[1] - vector[0] * b1[1]) / det,
  ];
}

export function reconstruct({ b1, b2, coordinates }) {
  requireVector2(coordinates, 'coordinates');
  return [
    coordinates[0] * b1[0] + coordinates[1] * b2[0],
    coordinates[0] * b1[1] + coordinates[1] * b2[1],
  ];
}

export function conditionNumber2({ b1, b2 }) {
  const det = determinant(b1, b2);
  const trace = b1[0] ** 2 + b1[1] ** 2 + b2[0] ** 2 + b2[1] ** 2;
  const discriminant = Math.sqrt(Math.max(0, trace ** 2 - 4 * det ** 2));
  const lambdaMax = (trace + discriminant) / 2;
  const lambdaMin = (trace - discriminant) / 2;
  if (lambdaMin <= SINGULAR_EPSILON) return Number.POSITIVE_INFINITY;
  return Math.sqrt(lambdaMax / lambdaMin);
}

function norm2(vector) {
  return Math.hypot(...vector);
}

export function perturbationAmplification({ b1, b2, vector, perturbation }) {
  requireVector2(perturbation, 'perturbation');
  const original = solveCoordinates({ b1, b2, vector });
  const perturbedVector = vector.map((value, index) => value + perturbation[index]);
  const perturbed = solveCoordinates({ b1, b2, vector: perturbedVector });
  const coordinateDelta = perturbed.map((value, index) => value - original[index]);
  const inputDeltaNorm = norm2(perturbation);
  const coordinateDeltaNorm = norm2(coordinateDelta);
  return {
    original,
    perturbed,
    coordinateDelta,
    inputDeltaNorm,
    coordinateDeltaNorm,
    amplification: inputDeltaNorm === 0 ? 0 : coordinateDeltaNorm / inputDeltaNorm,
  };
}

export function scaleBasis({ b1, b2, factor }) {
  if (!Number.isFinite(factor) || factor === 0) throw new RangeError('factor must be finite and non-zero');
  return {
    b1: b1.map((value) => value * factor),
    b2: b2.map((value) => value * factor),
  };
}
