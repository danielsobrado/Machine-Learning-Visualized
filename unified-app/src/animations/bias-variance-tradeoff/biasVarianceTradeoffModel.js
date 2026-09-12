import {
  DECOMPOSITION_GRID_STEPS,
  FIT_RIDGE,
  MODEL_DEGREES,
  NOISE_AMPLITUDE,
  NORMALIZED_X_CENTER,
  NORMALIZED_X_SCALE,
  PLOT_Y_MAX,
  PLOT_Y_MIN,
  RESAMPLING_CURVE_STEPS,
  RESAMPLING_PROBE_X,
  RESAMPLING_SEEDS,
  TRAIN_X_MAX,
  TRAIN_X_MIN,
} from './biasVarianceResamplingConstants.js';

export const SAMPLE_LEVELS = Object.freeze({
  small: { label: 'Small sample', count: 10, detail: 'Few examples make flexible models unstable.' },
  medium: { label: 'Medium sample', count: 22, detail: 'More examples reduce sampling variance.' },
  large: { label: 'Large sample', count: 42, detail: 'Many examples make fitted models more stable.' },
});

export const MODEL_TYPES = Object.freeze({
  simple: { label: 'Simple', degree: MODEL_DEGREES.simple, detail: 'A degree-1 fit is stable but cannot represent the curved signal.' },
  balanced: { label: 'Balanced', degree: MODEL_DEGREES.balanced, detail: 'A degree-5 fit captures the main curve without extreme flexibility.' },
  flexible: { label: 'Flexible', degree: MODEL_DEGREES.flexible, detail: 'A degree-8 fit can track the signal closely but moves more across small noisy samples.' },
});

export function truth(x) {
  return 42 + 28 * Math.sin((x - 8) / 11) + 0.72 * x;
}

export function pseudoNoise(index, seed = 0) {
  const raw = Math.sin((index + seed * 0.731) * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

export function makePoints(sampleLevel, noise, seed = 0) {
  const sample = SAMPLE_LEVELS[sampleLevel];
  if (!sample) throw new RangeError(`Unknown sample level: ${sampleLevel}`);
  if (!Number.isFinite(noise) || noise < 0) throw new RangeError('Noise must be a non-negative finite number.');

  return Array.from({ length: sample.count }, (_, index) => {
    const x = TRAIN_X_MIN + (index / Math.max(1, sample.count - 1)) * (TRAIN_X_MAX - TRAIN_X_MIN);
    const centeredNoise = pseudoNoise(index + sample.count * 3, seed) - 0.5;
    return {
      id: index,
      x,
      y: truth(x) + centeredNoise * noise * NOISE_AMPLITUDE,
    };
  });
}

export function fitModel(points, model) {
  const config = MODEL_TYPES[model];
  if (!config) throw new RangeError(`Unknown model: ${model}`);
  if (!Array.isArray(points) || points.length <= config.degree) {
    throw new RangeError(`Degree-${config.degree} fit requires more than ${config.degree} points.`);
  }

  const rows = points.map((point) => polynomialRow(point.x, config.degree));
  const size = config.degree + 1;
  const normalMatrix = Array.from({ length: size }, () => Array(size).fill(0));
  const normalVector = Array(size).fill(0);

  rows.forEach((row, rowIndex) => {
    for (let i = 0; i < size; i += 1) {
      normalVector[i] += row[i] * points[rowIndex].y;
      for (let j = 0; j < size; j += 1) {
        normalMatrix[i][j] += row[i] * row[j];
      }
    }
  });

  for (let index = 0; index < size; index += 1) {
    normalMatrix[index][index] += FIT_RIDGE;
  }

  return {
    model,
    degree: config.degree,
    coefficients: solveLinearSystem(normalMatrix, normalVector),
  };
}

export function predictFitted(x, fittedModel) {
  const z = normalizeX(x);
  return fittedModel.coefficients.reduce((sum, coefficient, degree) => sum + coefficient * (z ** degree), 0);
}

export function meanSquaredError(points, fittedModel) {
  if (!points.length) throw new RangeError('Cannot score an empty point set.');
  return average(points.map((point) => (point.y - predictFitted(point.x, fittedModel)) ** 2));
}

export function decompositionProfile(
  model,
  sampleLevel,
  noise,
  seeds = RESAMPLING_SEEDS,
) {
  if (!seeds.length) throw new RangeError('Decomposition requires at least one training sample.');

  const fits = seeds.map((seed) => fitModel(makePoints(sampleLevel, noise, seed), model));
  const grid = Array.from({ length: DECOMPOSITION_GRID_STEPS }, (_, index) => (
    TRAIN_X_MIN + (index / (DECOMPOSITION_GRID_STEPS - 1)) * (TRAIN_X_MAX - TRAIN_X_MIN)
  ));

  let biasSquared = 0;
  let variance = 0;

  grid.forEach((x) => {
    const predictions = fits.map((fit) => predictFitted(x, fit));
    const meanPrediction = average(predictions);
    biasSquared += (meanPrediction - truth(x)) ** 2;
    variance += average(predictions.map((prediction) => (prediction - meanPrediction) ** 2));
  });

  biasSquared /= grid.length;
  variance /= grid.length;
  const irreducibleVariance = ((noise * NOISE_AMPLITUDE) ** 2) / 12;

  return {
    biasSquared,
    variance,
    irreducibleVariance,
    expectedSquaredError: biasSquared + variance + irreducibleVariance,
  };
}

export function recommendationForProfile(profile) {
  const reducible = profile.biasSquared + profile.variance;
  if (profile.irreducibleVariance > reducible * 1.5) {
    return 'Noise dominates here: changing model complexity cannot remove irreducible outcome noise.';
  }
  if (profile.biasSquared > profile.variance * 1.5) {
    return 'Bias dominates: add useful flexibility or better features before adding more of the same data.';
  }
  if (profile.variance > profile.biasSquared * 1.5) {
    return 'Variance dominates: add data, regularize, simplify, or average multiple fits.';
  }
  return 'Bias and variance are similar in size for this teaching setup.';
}

export function project(point) {
  return {
    cx: 34 + (point.x / 100) * 332,
    cy: 262 - ((point.y - PLOT_Y_MIN) / (PLOT_Y_MAX - PLOT_Y_MIN)) * 226,
  };
}

export function truthCurvePath() {
  return predictionPath(truth, RESAMPLING_CURVE_STEPS);
}

export function fittedCurvePath(fittedModel) {
  return predictionPath((x) => predictFitted(x, fittedModel), RESAMPLING_CURVE_STEPS);
}

export function resampledPrediction(x, model, sampleLevel, noise, seed) {
  const fitted = fitModel(makePoints(sampleLevel, noise, seed), model);
  return predictFitted(x, fitted);
}

export function resamplingProfile(
  model,
  sampleLevel,
  noise,
  probeX = RESAMPLING_PROBE_X,
  seeds = RESAMPLING_SEEDS,
) {
  if (!seeds.length) throw new RangeError('Resampling requires at least one training sample.');

  const fits = seeds.map((seed) => fitModel(makePoints(sampleLevel, noise, seed), model));
  const predictions = fits.map((fit) => predictFitted(probeX, fit));
  const meanPrediction = average(predictions);
  const target = truth(probeX);
  const bias = meanPrediction - target;
  const variance = average(predictions.map((value) => (value - meanPrediction) ** 2));
  const irreducibleVariance = ((noise * NOISE_AMPLITUDE) ** 2) / 12;

  return {
    probeX,
    target,
    predictions,
    meanPrediction,
    bias,
    biasSquared: bias ** 2,
    variance,
    predictionStd: Math.sqrt(variance),
    irreducibleVariance,
    expectedSquaredError: bias ** 2 + variance + irreducibleVariance,
  };
}

export function resampledCurvePath(model, sampleLevel, noise, seed) {
  const fitted = fitModel(makePoints(sampleLevel, noise, seed), model);
  return fittedCurvePath(fitted);
}

export function meanResampledCurvePath(model, sampleLevel, noise, seeds = RESAMPLING_SEEDS) {
  if (!seeds.length) throw new RangeError('Mean resampled curve requires at least one training sample.');
  const fits = seeds.map((seed) => fitModel(makePoints(sampleLevel, noise, seed), model));
  return predictionPath((x) => average(fits.map((fit) => predictFitted(x, fit))), RESAMPLING_CURVE_STEPS);
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
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivotRow][column])) {
        pivotRow = row;
      }
    }

    if (Math.abs(augmented[pivotRow][column]) < 1e-12) {
      throw new Error('Polynomial fit is numerically singular.');
    }

    [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];
    const pivot = augmented[column][column];
    for (let valueIndex = column; valueIndex <= size; valueIndex += 1) {
      augmented[column][valueIndex] /= pivot;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let valueIndex = column; valueIndex <= size; valueIndex += 1) {
        augmented[row][valueIndex] -= factor * augmented[column][valueIndex];
      }
    }
  }

  return augmented.map((row) => row[size]);
}

function predictionPath(source, steps) {
  return Array.from({ length: steps }, (_, index) => {
    const x = TRAIN_X_MIN + (index / (steps - 1)) * (TRAIN_X_MAX - TRAIN_X_MIN);
    const { cx, cy } = project({ x, y: source(x) });
    return `${index === 0 ? 'M' : 'L'} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }).join(' ');
}

function average(values) {
  if (!values.length) throw new RangeError('Cannot average an empty collection.');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
