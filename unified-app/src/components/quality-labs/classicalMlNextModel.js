function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function mean(values) {
  if (!values.length) throw new RangeError('Cannot average an empty collection');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  if (!values.length) throw new RangeError('Cannot take the median of an empty collection');
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function calculateRegressionIntervals({
  prediction,
  residualStdError,
  sampleSize,
  x,
  xMean,
  sxx,
  criticalValue = 1.96,
}) {
  [prediction, residualStdError, sampleSize, x, xMean, sxx, criticalValue]
    .forEach((value, index) => assertFinite(value, `argument ${index + 1}`));
  if (sampleSize <= 0) throw new RangeError('sampleSize must be positive');
  if (sxx <= 0) throw new RangeError('sxx must be positive');
  if (residualStdError < 0 || criticalValue < 0) {
    throw new RangeError('residualStdError and criticalValue must be non-negative');
  }

  const leverage = (1 / sampleSize) + (((x - xMean) ** 2) / sxx);
  const confidenceHalfWidth = criticalValue * residualStdError * Math.sqrt(leverage);
  const predictionHalfWidth = criticalValue * residualStdError * Math.sqrt(1 + leverage);

  return Object.freeze({
    leverage,
    confidenceHalfWidth,
    predictionHalfWidth,
    confidenceInterval: Object.freeze([
      prediction - confidenceHalfWidth,
      prediction + confidenceHalfWidth,
    ]),
    predictionInterval: Object.freeze([
      prediction - predictionHalfWidth,
      prediction + predictionHalfWidth,
    ]),
  });
}

export function fitOrdinaryLeastSquares(points) {
  if (points.length < 2) throw new RangeError('At least two points are required');
  const xMean = mean(points.map(({ x }) => x));
  const yMean = mean(points.map(({ y }) => y));
  const denominator = points.reduce((sum, { x }) => sum + ((x - xMean) ** 2), 0);
  if (denominator === 0) throw new RangeError('x values must contain variation');
  const numerator = points.reduce(
    (sum, { x, y }) => sum + ((x - xMean) * (y - yMean)),
    0,
  );
  const slope = numerator / denominator;
  const intercept = yMean - (slope * xMean);
  return Object.freeze({ slope, intercept });
}

export function fitTheilSen(points) {
  if (points.length < 2) throw new RangeError('At least two points are required');
  const slopes = [];
  for (let left = 0; left < points.length; left += 1) {
    for (let right = left + 1; right < points.length; right += 1) {
      const dx = points[right].x - points[left].x;
      if (dx !== 0) slopes.push((points[right].y - points[left].y) / dx);
    }
  }
  if (!slopes.length) throw new RangeError('x values must contain variation');
  const slope = median(slopes);
  const intercept = median(points.map(({ x, y }) => y - (slope * x)));
  return Object.freeze({ slope, intercept });
}

export function analyzeRobustRegression(points, probeX) {
  assertFinite(probeX, 'probeX');
  const ordinary = fitOrdinaryLeastSquares(points);
  const robust = fitTheilSen(points);
  return Object.freeze({
    ordinary,
    robust,
    ordinaryPrediction: ordinary.intercept + (ordinary.slope * probeX),
    robustPrediction: robust.intercept + (robust.slope * probeX),
  });
}

export function shiftProbabilityByLogit(probability, logitShift) {
  assertFinite(probability, 'probability');
  assertFinite(logitShift, 'logitShift');
  if (probability <= 0 || probability >= 1) {
    throw new RangeError('probability must be strictly between 0 and 1');
  }
  const logit = Math.log(probability / (1 - probability));
  return 1 / (1 + Math.exp(-(logit + logitShift)));
}

function rowCost(row, threshold, groupCosts) {
  const costs = groupCosts[row.group];
  if (!costs) throw new RangeError(`Missing costs for group ${row.group}`);
  const predictedPositive = row.score >= threshold;
  if (predictedPositive && row.label === 0) return costs.falsePositive;
  if (!predictedPositive && row.label === 1) return costs.falseNegative;
  return 0;
}

export function evaluateThresholdPolicy(rows, threshold, groupCosts) {
  assertFinite(threshold, 'threshold');
  let falsePositives = 0;
  let falseNegatives = 0;
  let totalCost = 0;

  for (const row of rows) {
    const predictedPositive = row.score >= threshold;
    if (predictedPositive && row.label === 0) falsePositives += 1;
    if (!predictedPositive && row.label === 1) falseNegatives += 1;
    totalCost += rowCost(row, threshold, groupCosts);
  }

  return Object.freeze({ threshold, totalCost, falsePositives, falseNegatives });
}

export function compareThresholdPolicies({ rows, globalThreshold, candidateThresholds, groupCosts }) {
  const global = evaluateThresholdPolicy(rows, globalThreshold, groupCosts);
  const groups = [...new Set(rows.map(({ group }) => group))].sort();
  const groupPolicies = groups.map((group) => {
    const groupRows = rows.filter((row) => row.group === group);
    const candidates = candidateThresholds.map((threshold) => (
      evaluateThresholdPolicy(groupRows, threshold, groupCosts)
    ));
    const best = candidates.reduce((current, candidate) => (
      candidate.totalCost < current.totalCost ? candidate : current
    ));
    return Object.freeze({ group, ...best });
  });
  const groupSpecificCost = groupPolicies.reduce((sum, policy) => sum + policy.totalCost, 0);

  return Object.freeze({
    global,
    groupPolicies: Object.freeze(groupPolicies),
    groupSpecificCost,
    costReduction: global.totalCost - groupSpecificCost,
  });
}

export function analyzeSelectionReplay({ attempts, outerFoldErrors }) {
  if (!attempts.length) throw new RangeError('At least one tuning attempt is required');
  if (!outerFoldErrors.length) throw new RangeError('At least one outer-fold error is required');
  const selected = attempts.reduce((best, attempt) => (
    attempt.validationError < best.validationError ? attempt : best
  ));
  const nestedEstimate = mean(outerFoldErrors);

  return Object.freeze({
    selected,
    naiveValidationEstimate: selected.validationError,
    untouchedTestEstimate: selected.testError,
    optimismGap: selected.testError - selected.validationError,
    nestedEstimate,
    nestedVsNaiveGap: nestedEstimate - selected.validationError,
  });
}

export function runMeanForecastBacktest(series, {
  initialTrainSize,
  horizon,
  step,
  mode,
  blockedWindowSize,
}) {
  if (!['expanding', 'blocked'].includes(mode)) throw new RangeError('mode must be expanding or blocked');
  if (initialTrainSize <= 0 || horizon <= 0 || step <= 0) {
    throw new RangeError('initialTrainSize, horizon, and step must be positive');
  }
  if (mode === 'blocked' && blockedWindowSize <= 0) {
    throw new RangeError('blockedWindowSize must be positive in blocked mode');
  }

  const folds = [];
  for (
    let trainEnd = initialTrainSize, fold = 1;
    trainEnd + horizon <= series.length;
    trainEnd += step, fold += 1
  ) {
    const trainStart = mode === 'blocked'
      ? Math.max(0, trainEnd - blockedWindowSize)
      : 0;
    const training = series.slice(trainStart, trainEnd);
    const forecast = mean(training);
    const horizonRows = series.slice(trainEnd, trainEnd + horizon).map((actual, index) => Object.freeze({
      horizon: index + 1,
      actual,
      forecast,
      absoluteError: Math.abs(actual - forecast),
    }));
    folds.push(Object.freeze({
      fold,
      trainStart,
      trainEnd,
      forecast,
      horizonRows: Object.freeze(horizonRows),
    }));
  }
  return Object.freeze(folds);
}

export function aggregateHorizonMae(folds) {
  const buckets = new Map();
  for (const fold of folds) {
    for (const row of fold.horizonRows) {
      const values = buckets.get(row.horizon) || [];
      values.push(row.absoluteError);
      buckets.set(row.horizon, values);
    }
  }
  return Object.freeze(
    [...buckets.entries()].map(([horizon, errors]) => Object.freeze({
      horizon,
      mae: mean(errors),
      observations: errors.length,
    })),
  );
}

export function compareTemporalCv(config) {
  const shared = {
    initialTrainSize: config.initialTrainSize,
    horizon: config.horizon,
    step: config.step,
    blockedWindowSize: config.blockedWindowSize,
  };
  const expanding = runMeanForecastBacktest(config.series, { ...shared, mode: 'expanding' });
  const blocked = runMeanForecastBacktest(config.series, { ...shared, mode: 'blocked' });
  const allErrors = (folds) => folds.flatMap((fold) => fold.horizonRows.map((row) => row.absoluteError));

  return Object.freeze({
    expanding: Object.freeze({
      folds: expanding,
      overallMae: mean(allErrors(expanding)),
      byHorizon: aggregateHorizonMae(expanding),
    }),
    blocked: Object.freeze({
      folds: blocked,
      overallMae: mean(allErrors(blocked)),
      byHorizon: aggregateHorizonMae(blocked),
    }),
  });
}

export function scoreForecastRows({ rows, underForecastCost, overForecastCost }) {
  assertFinite(underForecastCost, 'underForecastCost');
  assertFinite(overForecastCost, 'overForecastCost');
  if (underForecastCost < 0 || overForecastCost < 0) {
    throw new RangeError('Forecast costs must be non-negative');
  }

  const scoredRows = rows.map((row) => {
    const signedError = row.actual - row.forecast;
    const businessCost = signedError >= 0
      ? signedError * underForecastCost
      : Math.abs(signedError) * overForecastCost;
    return Object.freeze({
      ...row,
      signedError,
      absoluteError: Math.abs(signedError),
      businessCost,
      covered: row.actual >= row.lower && row.actual <= row.upper,
    });
  });
  const horizons = [...new Set(scoredRows.map(({ horizon }) => horizon))].sort((a, b) => a - b);
  const byHorizon = horizons.map((horizon) => {
    const horizonRows = scoredRows.filter((row) => row.horizon === horizon);
    return Object.freeze({
      horizon,
      averageCost: mean(horizonRows.map(({ businessCost }) => businessCost)),
      mae: mean(horizonRows.map(({ absoluteError }) => absoluteError)),
      coverage: mean(horizonRows.map(({ covered }) => (covered ? 1 : 0))),
    });
  });

  return Object.freeze({
    rows: Object.freeze(scoredRows),
    totalCost: scoredRows.reduce((sum, row) => sum + row.businessCost, 0),
    averageCost: mean(scoredRows.map(({ businessCost }) => businessCost)),
    overallCoverage: mean(scoredRows.map(({ covered }) => (covered ? 1 : 0))),
    byHorizon: Object.freeze(byHorizon),
  });
}
