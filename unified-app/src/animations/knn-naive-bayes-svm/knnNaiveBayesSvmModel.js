import {
  MODELS,
  NAIVE_BAYES_DEPENDENCE_DEMO,
  POINTS,
  SVM_PARAMS,
} from './knnNaiveBayesSvmConstants.js';

export { MODELS, NAIVE_BAYES_DEPENDENCE_DEMO, POINTS, SVM_PARAMS };

export function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function variance(values) {
  const mu = mean(values);
  return values.reduce((sum, value) => sum + (value - mu) ** 2, 0) / values.length + 0.08;
}

export function gaussianLogPdf(value, mu, varValue) {
  return -0.5 * Math.log(2 * Math.PI * varValue) - ((value - mu) ** 2) / (2 * varValue);
}

export function classStats(label) {
  const classPoints = POINTS.filter((point) => point.label === label);
  const xs = classPoints.map((point) => point.x);
  const ys = classPoints.map((point) => point.y);
  return {
    prior: classPoints.length / POINTS.length,
    meanX: mean(xs),
    meanY: mean(ys),
    varX: variance(xs),
    varY: variance(ys),
  };
}

export function classifyKnn(query, k) {
  const neighbors = POINTS
    .map((point) => ({ ...point, distance: dist(point, query) }))
    .sort((a, b) => a.distance - b.distance);
  const votes = neighbors.slice(0, k).reduce((acc, point) => {
    acc[point.label] = (acc[point.label] || 0) + 1;
    return acc;
  }, {});
  const prediction = (votes.blue || 0) >= (votes.orange || 0) ? 'blue' : 'orange';
  return { prediction, neighbors, confidence: Math.max(votes.blue || 0, votes.orange || 0) / k };
}

export function posteriorFromLogScores(scores) {
  const maxScore = Math.max(...Object.values(scores));
  const weights = Object.fromEntries(
    Object.entries(scores).map(([label, score]) => [label, Math.exp(score - maxScore)]),
  );
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(
    Object.entries(weights).map(([label, value]) => [label, value / total]),
  );
}

export function classifyNaiveBayes(query) {
  const scores = Object.fromEntries(['blue', 'orange'].map((label) => {
    const stats = classStats(label);
    const score = Math.log(stats.prior)
      + gaussianLogPdf(query.x, stats.meanX, stats.varX)
      + gaussianLogPdf(query.y, stats.meanY, stats.varY);
    return [label, score];
  }));
  const posteriors = posteriorFromLogScores(scores);
  const prediction = scores.blue >= scores.orange ? 'blue' : 'orange';
  return {
    prediction,
    scores,
    posteriors,
    confidence: posteriors[prediction],
  };
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
  if (!Number.isInteger(copies) || copies < 1) {
    throw new RangeError('Evidence copies must be a positive integer.');
  }

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
  return Array.from(
    { length: config.maxCopies - config.minCopies + 1 },
    (_, index) => naiveBayesDuplicateEvidence({
      ...config,
      copies: config.minCopies + index,
    }),
  );
}

export function svmMarginScore(query, params = SVM_PARAMS) {
  return params.weight[0] * query.x + params.weight[1] * query.y + params.bias;
}

export function classifySvm(query) {
  const marginScore = svmMarginScore(query);
  return {
    prediction: marginScore >= 0 ? 'orange' : 'blue',
    marginScore,
    confidence: Math.min(0.99, Math.abs(marginScore) / 2.4),
  };
}

export function project(point) {
  return {
    cx: 36 + ((point.x + 3) / 6) * 328,
    cy: 276 - ((point.y + 2.4) / 4.8) * 240,
  };
}

export function svmBoundarySegment(params = SVM_PARAMS) {
  const [wx, wy] = params.weight;
  const { bias } = params;
  const domain = { minX: -3, maxX: 3, minY: -2.4, maxY: 2.4 };
  const candidates = [];

  for (const x of [domain.minX, domain.maxX]) {
    const y = -(wx * x + bias) / wy;
    if (y >= domain.minY && y <= domain.maxY) candidates.push({ x, y });
  }

  for (const y of [domain.minY, domain.maxY]) {
    const x = -(wy * y + bias) / wx;
    if (x >= domain.minX && x <= domain.maxX) candidates.push({ x, y });
  }

  const unique = candidates.filter((point, index) => (
    candidates.findIndex((other) => Math.abs(other.x - point.x) < 1e-9 && Math.abs(other.y - point.y) < 1e-9) === index
  ));
  return unique.slice(0, 2).map(project);
}

function validateProbability(value, label) {
  if (!(value > 0 && value < 1)) {
    throw new RangeError(`${label} must be between zero and one.`);
  }
}

function odds(probability) {
  return probability / (1 - probability);
}
