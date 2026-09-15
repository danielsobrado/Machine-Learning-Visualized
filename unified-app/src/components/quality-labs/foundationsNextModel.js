function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function mean(values) {
  if (!values.length) throw new RangeError('Cannot average an empty collection');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function share(part, total) {
  return total === 0 ? 0 : part / total;
}

export function quadraticLoss(x, y, curvatureX, curvatureY) {
  [x, y, curvatureX, curvatureY].forEach((value, index) => assertFinite(value, `argument ${index + 1}`));
  if (curvatureX <= 0 || curvatureY <= 0) throw new RangeError('Curvatures must be positive');
  return 0.5 * ((curvatureX * x * x) + (curvatureY * y * y));
}

export function runQuadraticTrajectory(config, method) {
  const {
    curvatureX,
    curvatureY,
    startX,
    startY,
    steps,
    learningRate,
    momentum,
    preconditionedLearningRate,
  } = config;
  [curvatureX, curvatureY, startX, startY, learningRate, momentum, preconditionedLearningRate]
    .forEach((value, index) => assertFinite(value, `config value ${index + 1}`));
  if (!Number.isInteger(steps) || steps <= 0) throw new RangeError('steps must be a positive integer');
  if (learningRate <= 0 || preconditionedLearningRate <= 0) throw new RangeError('Learning rates must be positive');
  if (momentum < 0 || momentum >= 1) throw new RangeError('momentum must be in [0, 1)');
  if (!['gradient', 'momentum', 'diagonal-preconditioned'].includes(method)) {
    throw new RangeError(`Unknown optimizer method: ${method}`);
  }

  let x = startX;
  let y = startY;
  let velocityX = 0;
  let velocityY = 0;
  const trajectory = [Object.freeze({ step: 0, x, y, loss: quadraticLoss(x, y, curvatureX, curvatureY) })];

  for (let step = 1; step <= steps; step += 1) {
    const gradientX = curvatureX * x;
    const gradientY = curvatureY * y;

    if (method === 'gradient') {
      x -= learningRate * gradientX;
      y -= learningRate * gradientY;
    } else if (method === 'momentum') {
      velocityX = (momentum * velocityX) + gradientX;
      velocityY = (momentum * velocityY) + gradientY;
      x -= learningRate * velocityX;
      y -= learningRate * velocityY;
    } else {
      x -= preconditionedLearningRate * (gradientX / curvatureX);
      y -= preconditionedLearningRate * (gradientY / curvatureY);
    }

    trajectory.push(Object.freeze({
      step,
      x,
      y,
      loss: quadraticLoss(x, y, curvatureX, curvatureY),
    }));
  }

  return Object.freeze(trajectory);
}

export function compareOptimizationTrajectories(config) {
  const startLoss = quadraticLoss(config.startX, config.startY, config.curvatureX, config.curvatureY);
  const methods = ['gradient', 'momentum', 'diagonal-preconditioned'];
  const results = methods.map((method) => {
    const trajectory = runQuadraticTrajectory(config, method);
    const final = trajectory.at(-1);
    return Object.freeze({
      method,
      trajectory,
      final,
      lossReduction: 1 - (final.loss / startLoss),
    });
  });
  return Object.freeze({ startLoss, results: Object.freeze(results) });
}

export function normalDensity(x, meanValue, standardDeviation) {
  [x, meanValue, standardDeviation].forEach((value, index) => assertFinite(value, `argument ${index + 1}`));
  if (standardDeviation <= 0) throw new RangeError('standardDeviation must be positive');
  const z = (x - meanValue) / standardDeviation;
  return Math.exp(-0.5 * z * z) / (standardDeviation * Math.sqrt(2 * Math.PI));
}

export function analyzeGaussianMixture({ separation, standardDeviation, leftWeight }) {
  [separation, standardDeviation, leftWeight].forEach((value, index) => assertFinite(value, `argument ${index + 1}`));
  if (separation <= 0 || standardDeviation <= 0) throw new RangeError('separation and standardDeviation must be positive');
  if (leftWeight <= 0 || leftWeight >= 1) throw new RangeError('leftWeight must be strictly between 0 and 1');

  const leftMean = -separation / 2;
  const rightMean = separation / 2;
  const rightWeight = 1 - leftWeight;
  const mixtureMean = (leftWeight * leftMean) + (rightWeight * rightMean);
  const mixtureVariance = (
    leftWeight * ((standardDeviation ** 2) + ((leftMean - mixtureMean) ** 2))
  ) + (
    rightWeight * ((standardDeviation ** 2) + ((rightMean - mixtureMean) ** 2))
  );
  const matchedStandardDeviation = Math.sqrt(mixtureVariance);
  const probes = Object.freeze([
    Object.freeze({ label: 'left mode', x: leftMean }),
    Object.freeze({ label: 'center', x: 0 }),
    Object.freeze({ label: 'right mode', x: rightMean }),
  ].map((probe) => {
    const mixtureDensity = (
      leftWeight * normalDensity(probe.x, leftMean, standardDeviation)
    ) + (
      rightWeight * normalDensity(probe.x, rightMean, standardDeviation)
    );
    const matchedGaussianDensity = normalDensity(probe.x, mixtureMean, matchedStandardDeviation);
    return Object.freeze({ ...probe, mixtureDensity, matchedGaussianDensity });
  }));

  const center = probes[1];
  const mixtureModeAverage = mean([probes[0].mixtureDensity, probes[2].mixtureDensity]);
  const gaussianModeAverage = mean([probes[0].matchedGaussianDensity, probes[2].matchedGaussianDensity]);

  return Object.freeze({
    leftMean,
    rightMean,
    mixtureMean,
    mixtureVariance,
    matchedStandardDeviation,
    probes,
    mixtureModeVsCenter: mixtureModeAverage - center.mixtureDensity,
    gaussianModeVsCenter: gaussianModeAverage - center.matchedGaussianDensity,
  });
}

export function compareImbalanceLosses({ rows, minorityWeight, gamma }) {
  if (!rows.length) throw new RangeError('At least one row is required');
  [minorityWeight, gamma].forEach((value, index) => assertFinite(value, `argument ${index + 1}`));
  if (minorityWeight <= 0 || gamma < 0) throw new RangeError('minorityWeight must be positive and gamma non-negative');

  const scoredRows = rows.map((row) => {
    const probability = row.trueClassProbability;
    assertFinite(probability, 'trueClassProbability');
    if (probability <= 0 || probability > 1) throw new RangeError('trueClassProbability must be in (0, 1]');
    const baseNll = -Math.log(probability);
    const weightedNll = baseNll * (row.group === 'minority' ? minorityWeight : 1);
    const focalLoss = ((1 - probability) ** gamma) * baseNll;
    return Object.freeze({ ...row, baseNll, weightedNll, focalLoss });
  });

  const summarize = (field) => {
    const total = scoredRows.reduce((sum, row) => sum + row[field], 0);
    const minority = scoredRows
      .filter((row) => row.group === 'minority')
      .reduce((sum, row) => sum + row[field], 0);
    return Object.freeze({ total, minority, minorityShare: share(minority, total) });
  };

  return Object.freeze({
    rows: Object.freeze(scoredRows),
    nll: summarize('baseNll'),
    weightedNll: summarize('weightedNll'),
    focal: summarize('focalLoss'),
  });
}

export function analyzeBernoulliPosterior({ successes, trials, priorMean, concentration }) {
  [successes, trials, priorMean, concentration].forEach((value, index) => assertFinite(value, `argument ${index + 1}`));
  if (!Number.isInteger(successes) || !Number.isInteger(trials) || trials <= 0 || successes < 0 || successes > trials) {
    throw new RangeError('successes and trials must define valid Bernoulli counts');
  }
  if (priorMean <= 0 || priorMean >= 1) throw new RangeError('priorMean must be strictly between 0 and 1');
  if (concentration <= 0) throw new RangeError('concentration must be positive');

  const alpha = priorMean * concentration;
  const beta = (1 - priorMean) * concentration;
  const posteriorAlpha = alpha + successes;
  const posteriorBeta = beta + (trials - successes);
  if (posteriorAlpha <= 1 || posteriorBeta <= 1) {
    throw new RangeError('Posterior MAP is on a boundary for this configuration');
  }

  const mle = successes / trials;
  const map = (posteriorAlpha - 1) / (posteriorAlpha + posteriorBeta - 2);
  const posteriorMean = posteriorAlpha / (posteriorAlpha + posteriorBeta);

  return Object.freeze({
    alpha,
    beta,
    posteriorAlpha,
    posteriorBeta,
    mle,
    map,
    posteriorMean,
    mapShrinkage: Math.abs(mle - priorMean) - Math.abs(map - priorMean),
    meanShrinkage: Math.abs(mle - priorMean) - Math.abs(posteriorMean - priorMean),
  });
}

export function sweepPriorStrength(config) {
  if (!config.sweepConcentrations?.length) throw new RangeError('sweepConcentrations must not be empty');
  return Object.freeze(config.sweepConcentrations.map((concentration) => Object.freeze({
    concentration,
    ...analyzeBernoulliPosterior({ ...config, concentration }),
  })));
}
