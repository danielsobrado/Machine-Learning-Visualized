export const DATASETS = Object.freeze({
  clean: {
    label: 'Clean signal',
    detail: 'Validation keeps improving until the model reaches useful flexibility.',
    noise: 0.18,
    gapBoost: 0.8,
  },
  noisy: {
    label: 'Noisy labels',
    detail: 'Flexible models can memorize label noise and lose validation performance.',
    noise: 0.52,
    gapBoost: 1.25,
  },
  tiny: {
    label: 'Tiny sample',
    detail: 'Scarce data makes the validation gap open earlier.',
    noise: 0.38,
    gapBoost: 1.7,
  },
});

export const REGULARIZATION = Object.freeze({
  none: { label: 'None', strength: 0, detail: 'The model is free to chase every training quirk.' },
  mild: { label: 'Mild', strength: 0.35, detail: 'Enough constraint to slow memorization without flattening the signal.' },
  strong: { label: 'Strong', strength: 0.75, detail: 'Useful for variance, but too much can underfit.' },
});

export const PROFILE_EPOCHS = 12;
export const OVERFIT_VALIDATION_EXCESS = 1.5;
export const OVERFIT_TRAIN_IMPROVEMENT = 0.5;

export function truth(x) {
  return 48 + 25 * Math.sin((x - 8) / 12) + x * 0.42;
}

export function pseudoNoise(index) {
  const raw = Math.sin(index * 17.17) * 9917.3;
  return raw - Math.floor(raw);
}

export function makePoints(datasetId) {
  const dataset = DATASETS[datasetId];
  if (!dataset) throw new RangeError(`Unknown dataset: ${datasetId}`);

  const count = datasetId === 'tiny' ? 14 : 26;
  return Array.from({ length: count }, (_, index) => {
    const x = 4 + (index / Math.max(1, count - 1)) * 92;
    const centered = pseudoNoise(index + count) - 0.5;
    const mislabeled = datasetId === 'noisy' && [4, 10, 17, 22].includes(index);
    return {
      id: index,
      x,
      y: truth(x) + centered * dataset.noise * 46 + (mislabeled ? (index % 2 === 0 ? 22 : -22) : 0),
      noisy: mislabeled,
    };
  });
}

export function predict(x, complexity, datasetId, regularizationId) {
  const dataset = DATASETS[datasetId];
  const regularization = REGULARIZATION[regularizationId];
  if (!dataset) throw new RangeError(`Unknown dataset: ${datasetId}`);
  if (!regularization) throw new RangeError(`Unknown regularization: ${regularizationId}`);

  const reg = regularization.strength;
  const wiggle = Math.max(0, complexity - 3) * (1 - reg) * dataset.noise;
  const underfit = Math.max(0, 3 - complexity) * 5.8;
  return 47 + 0.46 * x + (24 - underfit) * Math.sin((x - 7) / (13 + underfit * 0.15)) + Math.sin(x * 0.48) * wiggle * 16;
}

export function epochProfile(datasetId, regularizationId) {
  const dataset = DATASETS[datasetId];
  const regularization = REGULARIZATION[regularizationId];
  if (!dataset) throw new RangeError(`Unknown dataset: ${datasetId}`);
  if (!regularization) throw new RangeError(`Unknown regularization: ${regularizationId}`);

  const reg = regularization.strength;
  return Array.from({ length: PROFILE_EPOCHS }, (_, index) => {
    const epoch = index + 1;
    const fitProgress = 1 - Math.exp(-epoch / 3.2);
    const memorization = Math.max(0, epoch - 4.5) ** 1.55 * dataset.noise * dataset.gapBoost * (1 - reg);
    const underfitPenalty = reg > 0.6 ? Math.max(0, epoch - 6) * 0.8 : 0;
    const train = Math.max(5, 42 - fitProgress * 27 - epoch * (1.1 + dataset.noise) + reg * epoch * 0.8);
    const validation = Math.max(7, 39 - fitProgress * 24 + memorization + underfitPenalty + dataset.noise * 7);
    return {
      epoch,
      complexity: epoch,
      train,
      validation,
    };
  });
}

export function observedProfile(profile, maxEpochs) {
  if (!Array.isArray(profile) || !profile.length) throw new RangeError('Profile must contain at least one epoch.');
  if (!Number.isInteger(maxEpochs) || maxEpochs < 1 || maxEpochs > profile.length) {
    throw new RangeError(`maxEpochs must be between 1 and ${profile.length}`);
  }
  return profile.slice(0, maxEpochs);
}

export function bestEpoch(profile) {
  if (!Array.isArray(profile) || !profile.length) throw new RangeError('Profile must contain at least one epoch.');
  return profile.reduce((best, point) => (point.validation < best.validation ? point : best), profile[0]);
}

export function generalizationDiagnostics(profile, maxEpochs) {
  const observed = observedProfile(profile, maxEpochs);
  const current = observed.at(-1);
  const best = bestEpoch(observed);
  const gap = current.validation - current.train;
  const validationExcess = current.validation - best.validation;
  const trainingImprovementSinceBest = best.train - current.train;
  const pastBest = current.epoch > best.epoch;
  const overfit = pastBest
    && validationExcess >= OVERFIT_VALIDATION_EXCESS
    && trainingImprovementSinceBest >= OVERFIT_TRAIN_IMPROVEMENT;
  const underfit = !overfit && current.train > 24 && current.validation > 32;

  let status = 'balanced';
  let label = 'Balanced';
  let explanation = 'Held-out error is still near the best value observed so far.';

  if (overfit) {
    status = 'overfit';
    label = 'Overfit';
    explanation = `Since epoch ${best.epoch}, training error improved by ${trainingImprovementSinceBest.toFixed(1)} while validation error worsened by ${validationExcess.toFixed(1)}.`;
  } else if (underfit) {
    status = 'underfit';
    label = 'Underfit';
    explanation = 'Training and validation errors are both still high, so the model has not fit the available signal well yet.';
  } else if (current.epoch === best.epoch) {
    status = 'best-so-far';
    label = 'Best so far';
    explanation = 'The current epoch has the lowest validation error observed up to this point.';
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

export function project(point) {
  return {
    cx: 34 + (point.x / 100) * 332,
    cy: 262 - ((point.y - 12) / 104) * 226,
  };
}

export function curvePath(complexity, datasetId, regularizationId) {
  return Array.from({ length: 75 }, (_, index) => {
    const x = (index / 74) * 100;
    const y = predict(x, complexity, datasetId, regularizationId);
    const { cx, cy } = project({ x, y });
    return `${index === 0 ? 'M' : 'L'} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }).join(' ');
}

export function errorPath(profile, key) {
  if (!['train', 'validation'].includes(key)) throw new RangeError(`Unsupported error series: ${key}`);
  const max = 58;
  return profile.map((point) => {
    const x = 34 + (point.epoch - 1) * 28;
    const y = 170 - (point[key] / max) * 128;
    return `${point.epoch === profile[0].epoch ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}
