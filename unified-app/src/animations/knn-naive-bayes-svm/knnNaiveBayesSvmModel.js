import {
  GAUSSIAN_VARIANCE_FLOOR,
  KNN_SCALE_DEMO,
  MODELS,
  NAIVE_BAYES_DEPENDENCE_DEMO,
  POINTS,
} from './knnNaiveBayesSvmConstants.js';

export { KNN_SCALE_DEMO, MODELS, NAIVE_BAYES_DEPENDENCE_DEMO, POINTS };

export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function mean(values) {
  if (!Array.isArray(values) || values.length === 0) throw new RangeError('mean requires at least one value.');
  if (!values.every(Number.isFinite)) throw new TypeError('mean values must be finite.');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function variance(values) {
  const mu = mean(values);
  return values.reduce((sum, value) => sum + (value - mu) ** 2, 0) / values.length + GAUSSIAN_VARIANCE_FLOOR;
}

export function gaussianLogPdf(value, mu, varValue) {
  if (![value, mu, varValue].every(Number.isFinite) || varValue <= 0) {
    throw new RangeError('Gaussian inputs must be finite and variance must be positive.');
  }
  return -0.5 * Math.log(2 * Math.PI * varValue) - ((value - mu) ** 2) / (2 * varValue);
}

export function classStats(label, points = POINTS) {
  validateLabeledPoints(points);
  const classPoints = points.filter((point) => point.label === label);
  if (!classPoints.length) throw new RangeError(`No points found for class ${label}.`);
  const xs = classPoints.map((point) => point.x);
  const ys = classPoints.map((point) => point.y);
  return {
    prior: classPoints.length / points.length,
    meanX: mean(xs),
    meanY: mean(ys),
    varX: variance(xs),
    varY: variance(ys),
  };
}

export function classifyKnn(query, k, points = POINTS) {
  validatePoint(query, 'query');
  validateLabeledPoints(points);
  if (!Number.isInteger(k) || k < 1 || k > points.length) {
    throw new RangeError(`k must be an integer from 1 to ${points.length}.`);
  }
  const neighbors = points
    .map((point) => ({ ...point, distance: dist(point, query) }))
    .sort((a, b) => a.distance - b.distance || String(a.id).localeCompare(String(b.id)));
  const votes = neighbors.slice(0, k).reduce((acc, point) => {
    acc[point.label] = (acc[point.label] || 0) + 1;
    return acc;
  }, {});
  const rankedVotes = Object.entries(votes).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const [prediction, winningVotes] = rankedVotes[0];
  return { prediction, neighbors, votes, confidence: winningVotes / k };
}

export function posteriorFromLogScores(scores) {
  const entries = Object.entries(scores ?? {});
  if (!entries.length || entries.some(([, score]) => !Number.isFinite(score))) {
    throw new TypeError('Posterior scores must be a non-empty map of finite log scores.');
  }
  const maxScore = Math.max(...entries.map(([, score]) => score));
  const weights = Object.fromEntries(entries.map(([label, score]) => [label, Math.exp(score - maxScore)]));
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(weights).map(([label, value]) => [label, value / total]));
}

export function classifyNaiveBayes(query, points = POINTS) {
  validatePoint(query, 'query');
  validateLabeledPoints(points);
  const labels = [...new Set(points.map((point) => point.label))];
  const scores = Object.fromEntries(labels.map((label) => {
    const stats = classStats(label, points);
    const score = Math.log(stats.prior)
      + gaussianLogPdf(query.x, stats.meanX, stats.varX)
      + gaussianLogPdf(query.y, stats.meanY, stats.varY);
    return [label, score];
  }));
  const posteriors = posteriorFromLogScores(scores);
  const prediction = labels.reduce((best, label) => (scores[label] > scores[best] ? label : best), labels[0]);
  return { prediction, scores, posteriors, confidence: posteriors[prediction] };
}

export function knnScaleSensitivity(config = KNN_SCALE_DEMO) {
  const { points, query, k } = config;
  if (!Array.isArray(points) || points.length < 2) throw new RangeError('Scale demo requires training points.');
  if (!Number.isInteger(k) || k < 1 || k > points.length) throw new RangeError('Scale demo k is invalid.');
  const stats = {
    signal: standardizer(points.map((point) => point.signal)),
    largeUnit: standardizer(points.map((point) => point.largeUnit)),
  };
  const raw = classifyScaleKnn(points, query, k, null);
  const scaled = classifyScaleKnn(points, query, k, stats);
  return { stats, raw, scaled, predictionChanged: raw.prediction !== scaled.prediction };
}

export function naiveBayesDuplicateEvidence({
  copies,
  priorBlue = NAIVE_BAYES_DEPENDENCE_DEMO.priorBlue,
  likelihoodGivenBlue = NAIVE_BAYES_DEPENDENCE_DEMO.likelihoodGivenBlue,
  likelihoodGivenOrange = NAIVE_BAYES_DEPENDENCE_DEMO.likelihoodGivenOrange,
}) {
  validateProbability(priorBlue, 'Blue prior');
  validateProbability(likelihoodGivenBlue, 'Blue likelihood');
  validateProbability(likelihoodGivenOrange, 'Orange likelihood');
  if (!Number.isInteger(copies) || copies < 1) throw new RangeError('Evidence copies must be a positive integer.');

  const priorOrange = 1 - priorBlue;
  const naiveScores = {
    blue: Math.log(priorBlue) + copies * Math.log(likelihoodGivenBlue),
    orange: Math.log(priorOrange) + copies * Math.log(likelihoodGivenOrange),
  };
  const dependencyAwareScores = {
    blue: Math.log(priorBlue) + Math.log(likelihoodGivenBlue),
    orange: Math.log(priorOrange) + Math.log(likelihoodGivenOrange),
  };
  const naivePosterior = posteriorFromLogScores(naiveScores).blue;
  const dependencyAwarePosterior = posteriorFromLogScores(dependencyAwareScores).blue;

  return {
    copies,
    naivePosterior,
    dependencyAwarePosterior,
    overconfidenceGap: naivePosterior - dependencyAwarePosterior,
    naiveOdds: odds(naivePosterior),
    dependencyAwareOdds: odds(dependencyAwarePosterior),
  };
}

export function duplicateEvidenceSeries(config = NAIVE_BAYES_DEPENDENCE_DEMO) {
  return Array.from({ length: config.maxCopies - config.minCopies + 1 }, (_, index) => naiveBayesDuplicateEvidence({
    ...config,
    copies: config.minCopies + index,
  }));
}

export function project(point) {
  validatePoint(point, 'plot point');
  return {
    cx: 36 + ((point.x + 3) / 6) * 328,
    cy: 276 - ((point.y + 2.4) / 4.8) * 240,
  };
}

function classifyScaleKnn(points, query, k, stats) {
  const neighbors = points.map((point) => {
    const signalDelta = point.signal - query.signal;
    const largeUnitDelta = point.largeUnit - query.largeUnit;
    const distance = stats
      ? Math.hypot(signalDelta / stats.signal.std, largeUnitDelta / stats.largeUnit.std)
      : Math.hypot(signalDelta, largeUnitDelta);
    return { ...point, distance };
  }).sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id));
  const selected = neighbors.slice(0, k);
  const votes = selected.reduce((acc, point) => ({ ...acc, [point.label]: (acc[point.label] || 0) + 1 }), {});
  const prediction = Object.entries(votes).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
  return { prediction, neighbors, selected };
}

function standardizer(values) {
  const mu = mean(values);
  const scale = Math.sqrt(values.reduce((sum, value) => sum + (value - mu) ** 2, 0) / values.length);
  if (!(scale > 0)) throw new RangeError('Scale demo feature must have positive standard deviation.');
  return { mean: mu, std: scale };
}

function validatePoint(point, label) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError(`${label} must have finite x and y coordinates.`);
  }
}

function validateLabeledPoints(points) {
  if (!Array.isArray(points) || points.length === 0) throw new RangeError('At least one labeled point is required.');
  for (const point of points) {
    validatePoint(point, 'training point');
    if (typeof point.label !== 'string' || !point.label) throw new TypeError('Training labels must be non-empty strings.');
  }
}

function validateProbability(value, label) {
  if (!(value > 0 && value < 1)) throw new RangeError(`${label} must be between zero and one.`);
}

function odds(probability) {
  return probability / (1 - probability);
}
