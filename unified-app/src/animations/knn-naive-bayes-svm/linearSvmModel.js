import { POINTS, SVM_FIT } from './knnNaiveBayesSvmConstants.js';

const LABEL_SIGN = Object.freeze({ blue: -1, orange: 1 });

export function fitLinearSvm(points = POINTS, c = SVM_FIT.defaultC) {
  validateTrainingPoints(points);
  if (!Number.isFinite(c) || c <= 0) throw new RangeError('SVM C must be a positive finite number.');

  let weight = [0, 0];
  let bias = 0;
  const sampleScale = c / points.length;

  for (let iteration = 1; iteration <= SVM_FIT.iterations; iteration += 1) {
    const gradient = [weight[0], weight[1]];
    let biasGradient = 0;

    for (const point of points) {
      const label = labelSign(point.label);
      const margin = label * (weight[0] * point.x + weight[1] * point.y + bias);
      if (margin >= 1) continue;
      gradient[0] -= sampleScale * label * point.x;
      gradient[1] -= sampleScale * label * point.y;
      biasGradient -= sampleScale * label;
    }

    const learningRate = SVM_FIT.initialLearningRate / (1 + SVM_FIT.learningRateDecay * iteration);
    weight = [
      weight[0] - learningRate * gradient[0],
      weight[1] - learningRate * gradient[1],
    ];
    bias -= learningRate * biasGradient;
  }

  return summarizeLinearSvm(points, { weight, bias, c });
}

export function svmDecisionScore(query, fit) {
  validatePoint(query, 'query');
  validateFit(fit);
  return fit.weight[0] * query.x + fit.weight[1] * query.y + fit.bias;
}

export function classifySvm(query, fit) {
  const decisionScore = svmDecisionScore(query, fit);
  const norm = vectorNorm(fit.weight);
  return {
    prediction: decisionScore >= 0 ? 'orange' : 'blue',
    decisionScore,
    signedMarginDistance: decisionScore / norm,
    marginDistance: Math.abs(decisionScore) / norm,
  };
}

export function svmBoundarySegment(fit, project, decisionLevel = 0) {
  validateFit(fit);
  if (typeof project !== 'function') throw new TypeError('project must be a function.');
  if (!Number.isFinite(decisionLevel)) throw new TypeError('decisionLevel must be finite.');

  const [wx, wy] = fit.weight;
  const domain = { minX: -3, maxX: 3, minY: -2.4, maxY: 2.4 };
  const candidates = [];

  if (Math.abs(wy) > 1e-12) {
    for (const x of [domain.minX, domain.maxX]) {
      const y = -(wx * x + fit.bias - decisionLevel) / wy;
      if (y >= domain.minY && y <= domain.maxY) candidates.push({ x, y });
    }
  }
  if (Math.abs(wx) > 1e-12) {
    for (const y of [domain.minY, domain.maxY]) {
      const x = -(wy * y + fit.bias - decisionLevel) / wx;
      if (x >= domain.minX && x <= domain.maxX) candidates.push({ x, y });
    }
  }

  const unique = candidates.filter((point, index) => (
    candidates.findIndex((other) => Math.abs(other.x - point.x) < 1e-9 && Math.abs(other.y - point.y) < 1e-9) === index
  ));
  if (unique.length < 2) throw new RangeError('Fitted SVM boundary does not intersect the plot domain.');
  return unique.slice(0, 2).map(project);
}

function summarizeLinearSvm(points, { weight, bias, c }) {
  const norm = vectorNorm(weight);
  if (!(norm > 0)) throw new RangeError('SVM fit produced a zero weight vector.');

  const training = points.map((point) => {
    const label = labelSign(point.label);
    const decisionScore = weight[0] * point.x + weight[1] * point.y + bias;
    const functionalMargin = label * decisionScore;
    return { ...point, decisionScore, functionalMargin };
  });
  const hingeLoss = training.reduce((sum, point) => sum + Math.max(0, 1 - point.functionalMargin), 0) / points.length;
  const objective = 0.5 * norm ** 2 + c * hingeLoss;
  const marginActive = training.filter((point) => point.functionalMargin <= 1 + SVM_FIT.marginTolerance);
  const trainingErrors = training.filter((point) => point.functionalMargin <= 0).length;
  const marginViolations = training.filter((point) => point.functionalMargin < 1).length;

  return {
    weight,
    bias,
    c,
    norm,
    objective,
    hingeLoss,
    geometricMargin: 1 / norm,
    marginWidth: 2 / norm,
    trainingErrors,
    marginViolations,
    marginActive,
    training,
  };
}

function labelSign(label) {
  const sign = LABEL_SIGN[label];
  if (!sign) throw new RangeError(`Unsupported SVM label: ${label}`);
  return sign;
}

function vectorNorm(weight) {
  return Math.hypot(weight[0], weight[1]);
}

function validateTrainingPoints(points) {
  if (!Array.isArray(points) || points.length < 2) throw new RangeError('SVM training requires at least two points.');
  const labels = new Set();
  for (const point of points) {
    validatePoint(point, 'training point');
    labelSign(point.label);
    labels.add(point.label);
  }
  if (labels.size < 2) throw new RangeError('SVM training requires both classes.');
}

function validatePoint(point, label) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new TypeError(`${label} must have finite x and y coordinates.`);
  }
}

function validateFit(fit) {
  if (!fit || !Array.isArray(fit.weight) || fit.weight.length !== 2
    || !fit.weight.every(Number.isFinite) || !Number.isFinite(fit.bias)) {
    throw new TypeError('fit must contain a finite two-dimensional weight and bias.');
  }
  if (!(vectorNorm(fit.weight) > 0)) throw new RangeError('fit weight must be non-zero.');
}
