import {
  COMPLEXITY_STEPS,
  DATASETS,
  NORMALIZED_X_CENTER,
  NORMALIZED_X_SCALE,
  NUMERIC_RIDGE,
  REGULARIZATION,
  TEST_COUNT,
  TEST_SEED,
  TRAIN_X_MAX,
  TRAIN_X_MIN,
  VALIDATION_COUNT,
  VALIDATION_SEED,
} from './overfittingConstants.js';

export { COMPLEXITY_STEPS, DATASETS, REGULARIZATION };

export function truth(x) {
  return 48 + 25 * Math.sin((x - 8) / 12) + x * 0.42;
}

export function pseudoNoise(index, seed = 0) {
  const raw = Math.sin((index + seed * 0.731) * 17.17 + seed * 13.37) * 9917.3;
  return raw - Math.floor(raw) - 0.5;
}

export function makeDataSplits(datasetId) {
  const dataset = getDataset(datasetId);
  const train = makeSplit(
    dataset.trainCount,
    TRAIN_X_MIN,
    TRAIN_X_MAX,
    dataset.trainNoiseAmplitude,
    0,
    dataset.noisyIndices,
  );
  const validation = makeSplit(
    VALIDATION_COUNT,
    5.5,
    94.5,
    dataset.holdoutNoiseAmplitude,
    VALIDATION_SEED,
  );
  const test = makeSplit(
    TEST_COUNT,
    4.7,
    95.3,
    dataset.holdoutNoiseAmplitude,
    TEST_SEED,
  );

  return { train, validation, test };
}

export function fitPolynomial(points, degree, regularizationId) {
  if (!Array.isArray(points) || points.length === 0) throw new RangeError('Training points are required.');
  if (!Number.isInteger(degree) || degree < 1 || degree > COMPLEXITY_STEPS) {
    throw new RangeError(`degree must be an integer from 1 to ${COMPLEXITY_STEPS}`);
  }
  const regularization = getRegularization(regularizationId);
  if (points.length <= degree) throw new RangeError(`Degree-${degree} fit requires more than ${degree} training rows.`);

  const size = degree + 1;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  const vector = Array(size).fill(0);

  for (const point of points) {
    validatePoint(point);
    const row = polynomialRow(point.x, degree);
    for (let i = 0; i < size; i += 1) {
      vector[i] += row[i] * point.y;
      for (let j = 0; j < size; j += 1) matrix[i][j] += row[i] * row[j];
    }
  }

  for (let index = 0; index < size; index += 1) {
    matrix[index][index] += NUMERIC_RIDGE + (index === 0 ? 0 : regularization.lambda);
  }

  return {
    degree,
    regularizationId,
    lambda: regularization.lambda,
    coefficients: solveLinearSystem(matrix, vector),
  };
}

export function predictFitted(x, fittedModel) {
  if (!Number.isFinite(x)) throw new TypeError('x must be finite.');
  if (!fittedModel?.coefficients?.length) throw new TypeError('A fitted model is required.');
  const z = normalizeX(x);
  return fittedModel.coefficients.reduce((sum, coefficient, exponent) => sum + coefficient * (z ** exponent), 0);
}

export function meanSquaredError(points, fittedModel) {
  if (!Array.isArray(points) || points.length === 0) throw new RangeError('Cannot score an empty point set.');
  return average(points.map((point) => {
    validatePoint(point);
    return (point.y - predictFitted(point.x, fittedModel)) ** 2;
  }));
}

export function complexityProfile(datasetId, regularizationId) {
  const splits = makeDataSplits(datasetId);
  getRegularization(regularizationId);

  return Array.from({ length: COMPLEXITY_STEPS }, (_, index) => {
    const degree = index + 1;
    const fit = fitPolynomial(splits.train, degree, regularizationId);
    return {
      degree,
      fit,
      train: meanSquaredError(splits.train, fit),
      validation: meanSquaredError(splits.validation, fit),
    };
  });
}

export function observedProfile(profile, maxComplexity) {
  if (!Array.isArray(profile) || profile.length === 0) throw new RangeError('Profile must contain at least one candidate.');
  if (!Number.isInteger(maxComplexity) || maxComplexity < 1 || maxComplexity > profile.length) {
    throw new RangeError(`maxComplexity must be between 1 and ${profile.length}`);
  }
  return profile.slice(0, maxComplexity);
}

export function bestCandidate(profile, key = 'validation') {
  if (!Array.isArray(profile) || profile.length === 0) throw new RangeError('Profile must contain at least one candidate.');
  if (!['train', 'validation'].includes(key)) throw new RangeError(`Unsupported score series: ${key}`);
  return profile.reduce((best, candidate) => (candidate[key] < best[key] ? candidate : best), profile[0]);
}

export function generalizationDiagnostics(profile, maxComplexity) {
  const observed = observedProfile(profile, maxComplexity);
  const current = observed.at(-1);
  const best = bestCandidate(observed, 'validation');
  const gap = current.validation - current.train;
  const validationExcess = current.validation - best.validation;
  const trainingImprovementSinceBest = best.train - current.train;
  const pastBest = current.degree > best.degree;
  const overfitThreshold = Math.max(2, best.validation * 0.2);
  const trainingThreshold = Math.max(1, best.train * 0.05);
  const overfit = pastBest
    && validationExcess >= overfitThreshold
    && trainingImprovementSinceBest >= trainingThreshold;

  let status = 'balanced';
  let label = 'Balanced';
  let explanation = 'Validation MSE remains close to the best measured candidate so far.';

  if (overfit) {
    status = 'overfit';
    label = 'Overfit';
    explanation = `After degree ${best.degree}, training MSE fell by ${trainingImprovementSinceBest.toFixed(1)} while validation MSE rose by ${validationExcess.toFixed(1)}.`;
  } else if (current.degree <= 2 && current.train > 100 && current.validation > 100) {
    status = 'underfit';
    label = 'Underfit';
    explanation = 'Both training and validation MSE are still high, so the fitted family has not captured the available signal yet.';
  } else if (current.degree === best.degree) {
    status = 'best-so-far';
    label = 'Best so far';
    explanation = 'The current degree has the lowest validation MSE among the candidates revealed so far.';
  }

  return {
    observed,
    current,
    best,
    gap,
    validationExcess,
    trainingImprovementSinceBest,
    pastBest,
    status,
    label,
    explanation,
  };
}

export function freshTestAudit(datasetId, regularizationId, degree) {
  const splits = makeDataSplits(datasetId);
  const fit = fitPolynomial(splits.train, degree, regularizationId);
  return {
    degree,
    validationMse: meanSquaredError(splits.validation, fit),
    testMse: meanSquaredError(splits.test, fit),
    testCount: splits.test.length,
  };
}

export function project(point) {
  return {
    cx: 34 + ((point.x - TRAIN_X_MIN) / (TRAIN_X_MAX - TRAIN_X_MIN)) * 332,
    cy: 262 - ((point.y - 10) / 110) * 226,
  };
}

export function fittedCurvePath(fittedModel) {
  return Array.from({ length: 92 }, (_, index) => {
    const x = TRAIN_X_MIN + (index / 91) * (TRAIN_X_MAX - TRAIN_X_MIN);
    const y = predictFitted(x, fittedModel);
    const { cx, cy } = project({ x, y });
    return `${index === 0 ? 'M' : 'L'} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }).join(' ');
}

export function truthCurvePath() {
  return Array.from({ length: 92 }, (_, index) => {
    const x = TRAIN_X_MIN + (index / 91) * (TRAIN_X_MAX - TRAIN_X_MIN);
    const { cx, cy } = project({ x, y: truth(x) });
    return `${index === 0 ? 'M' : 'L'} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }).join(' ');
}

export function errorChart(profile, key, width = 308, height = 128) {
  if (!['train', 'validation'].includes(key)) throw new RangeError(`Unsupported score series: ${key}`);
  if (!Array.isArray(profile) || profile.length === 0) throw new RangeError('Profile must contain at least one candidate.');
  const maxMse = Math.max(1, ...profile.flatMap((point) => [point.train, point.validation]));
  return profile.map((point) => ({
    x: 34 + ((point.degree - 1) / (COMPLEXITY_STEPS - 1)) * width,
    y: 170 - (point[key] / maxMse) * height,
    degree: point.degree,
    value: point[key],
  }));
}

export function pathFromChart(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
}

function getDataset(datasetId) {
  const dataset = DATASETS[datasetId];
  if (!dataset) throw new RangeError(`Unknown dataset: ${datasetId}`);
  return dataset;
}

function getRegularization(regularizationId) {
  const regularization = REGULARIZATION[regularizationId];
  if (!regularization) throw new RangeError(`Unknown regularization: ${regularizationId}`);
  return regularization;
}

function makeSplit(count, xMin, xMax, noiseAmplitude, seed, noisyIndices = []) {
  return Array.from({ length: count }, (_, index) => {
    const x = xMin + (index / Math.max(1, count - 1)) * (xMax - xMin);
    const corrupted = noisyIndices.includes(index);
    const corruption = corrupted ? (index % 2 === 0 ? 22 : -22) : 0;
    return {
      id: `${seed}-${index}`,
      x,
      y: truth(x) + pseudoNoise(index + count * 3, seed) * noiseAmplitude + corruption,
      noisy: corrupted,
    };
  });
}

function normalizeX(x) {
  return (x - NORMALIZED_X_CENTER) / NORMALIZED_X_SCALE;
}

function polynomialRow(x, degree) {
  const z = normalizeX(x);
  return Array.from({ length: degree + 1 }, (_, exponent) => z ** exponent);
}

function solveLinearSystem(matrix, vector) {
  const size = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);

  for (let column = 0; column < size; column += 1) {
    let pivotRow = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivotRow][column])) pivotRow = row;
    }
    if (Math.abs(augmented[pivotRow][column]) < 1e-12) throw new Error('Polynomial fit is numerically singular.');
    [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];

    const pivot = augmented[column][column];
    for (let index = column; index <= size; index += 1) augmented[column][index] /= pivot;

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let index = column; index <= size; index += 1) augmented[row][index] -= factor * augmented[column][index];
    }
  }

  return augmented.map((row) => row[size]);
}

function validatePoint(point) {
  if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) throw new TypeError('Points must contain finite x and y values.');
}

function average(values) {
  if (!values.length) throw new RangeError('Cannot average an empty collection.');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
