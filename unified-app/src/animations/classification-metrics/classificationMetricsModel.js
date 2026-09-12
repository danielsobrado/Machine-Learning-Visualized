const EPSILON = 1e-12;
const DEFAULT_WILSON_Z = 1.96;

export function confusionMatrix(rows, threshold, scoreKey = 'score') {
  validateRows(rows, scoreKey);
  if (!Number.isFinite(threshold)) throw new RangeError('threshold must be finite');

  return rows.reduce((counts, row) => {
    const predicted = row[scoreKey] >= threshold ? 1 : 0;
    if (predicted === 1 && row.actual === 1) counts.tp += 1;
    else if (predicted === 1) counts.fp += 1;
    else if (row.actual === 1) counts.fn += 1;
    else counts.tn += 1;
    return counts;
  }, { tp: 0, fp: 0, fn: 0, tn: 0 });
}

export function metricsFromCounts(counts) {
  validateCounts(counts);
  const { tp, fp, fn, tn } = counts;
  const total = tp + fp + fn + tn;
  const precision = safeDivide(tp, tp + fp);
  const recall = safeDivide(tp, tp + fn);
  const specificity = safeDivide(tn, tn + fp);
  const accuracy = safeDivide(tp + tn, total);
  const f1 = safeDivide(2 * tp, (2 * tp) + fp + fn);
  const balancedAccuracy = recall === null || specificity === null
    ? null
    : (recall + specificity) / 2;
  const denominator = Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
  const mcc = denominator > 0 ? ((tp * tn) - (fp * fn)) / denominator : null;

  return {
    precision,
    recall,
    specificity,
    accuracy,
    f1,
    balancedAccuracy,
    mcc,
    prevalence: safeDivide(tp + fn, total),
    predictedPositiveRate: safeDivide(tp + fp, total),
  };
}

export function expectedCost(counts, falsePositiveCost, falseNegativeCost) {
  validateCounts(counts);
  validateNonNegativeFinite(falsePositiveCost, 'falsePositiveCost');
  validateNonNegativeFinite(falseNegativeCost, 'falseNegativeCost');
  return counts.fp * falsePositiveCost + counts.fn * falseNegativeCost;
}

export function thresholdSweep(rows, thresholds, falsePositiveCost, falseNegativeCost) {
  if (!Array.isArray(thresholds) || thresholds.length === 0) {
    throw new RangeError('thresholds must contain at least one value');
  }

  return thresholds.map((threshold) => {
    const counts = confusionMatrix(rows, threshold);
    const metrics = metricsFromCounts(counts);
    return {
      threshold,
      counts,
      metrics,
      cost: expectedCost(counts, falsePositiveCost, falseNegativeCost),
    };
  });
}

export function bestThresholdsBy(sweep, objective, tolerance = 1e-12) {
  if (!Array.isArray(sweep) || sweep.length === 0) return [];
  const direction = objective === 'cost' ? 'min' : 'max';
  const values = sweep.map((item) => objective === 'cost' ? item.cost : item.metrics?.[objective]);
  const comparable = values.filter((value) => Number.isFinite(value));
  if (!comparable.length) return [];
  const optimum = direction === 'min' ? Math.min(...comparable) : Math.max(...comparable);

  return sweep.filter((item, index) => {
    const value = values[index];
    return Number.isFinite(value) && Math.abs(value - optimum) <= tolerance;
  });
}

export function bestThresholdBy(sweep, objective, referenceThreshold = 0.5) {
  const best = bestThresholdsBy(sweep, objective);
  if (!best.length) return null;
  return best.reduce((selected, candidate) => (
    Math.abs(candidate.threshold - referenceThreshold) < Math.abs(selected.threshold - referenceThreshold)
      ? candidate
      : selected
  ), best[0]);
}

export function metricsByGroup(rows, threshold) {
  validateRows(rows, 'score');
  const groups = [...new Set(rows.map((row) => row.group))];
  return groups.map((group) => {
    const groupRows = rows.filter((row) => row.group === group);
    const counts = confusionMatrix(groupRows, threshold);
    return {
      group,
      size: groupRows.length,
      counts,
      metrics: metricsFromCounts(counts),
    };
  });
}

export function maxMetricGap(groupSummaries, metricName) {
  const values = groupSummaries
    .map((summary) => summary.metrics?.[metricName])
    .filter((value) => Number.isFinite(value));
  return values.length < 2 ? 0 : Math.max(...values) - Math.min(...values);
}

export function wilsonInterval(successes, total, z = DEFAULT_WILSON_Z) {
  if (!Number.isInteger(successes) || !Number.isInteger(total) || successes < 0 || total < 0 || successes > total) {
    throw new RangeError('successes and total must be valid non-negative counts');
  }
  if (!Number.isFinite(z) || z <= 0) throw new RangeError('z must be positive and finite');
  if (total === 0) return null;

  const estimate = successes / total;
  const zSquared = z ** 2;
  const denominator = 1 + zSquared / total;
  const center = (estimate + zSquared / (2 * total)) / denominator;
  const halfWidth = (
    z * Math.sqrt((estimate * (1 - estimate) / total) + (zSquared / (4 * total ** 2)))
  ) / denominator;

  return {
    estimate,
    lower: Math.max(0, center - halfWidth),
    upper: Math.min(1, center + halfWidth),
  };
}

export function projectFromRates({ tpr, fpr, prevalence, population }) {
  validateProbability(tpr, 'tpr');
  validateProbability(fpr, 'fpr');
  validateProbability(prevalence, 'prevalence');
  if (!Number.isFinite(population) || population <= 0) throw new RangeError('population must be positive and finite');

  const positives = population * prevalence;
  const negatives = population - positives;
  const tp = positives * tpr;
  const fn = positives - tp;
  const fp = negatives * fpr;
  const tn = negatives - fp;

  return {
    counts: { tp, fp, fn, tn },
    metrics: metricsFromCounts({ tp, fp, fn, tn }),
  };
}

export function multiclassMetricsFromConfusion(matrix, labels) {
  validateMulticlassMatrix(matrix, labels);
  const classCount = labels.length;
  const total = matrix.reduce((sum, row) => sum + row.reduce((rowSum, value) => rowSum + value, 0), 0);
  if (total <= 0) throw new RangeError('multiclass confusion matrix must contain observations');

  const perClass = labels.map((label, index) => {
    const tp = matrix[index][index];
    const support = matrix[index].reduce((sum, value) => sum + value, 0);
    const predicted = matrix.reduce((sum, row) => sum + row[index], 0);
    const fp = predicted - tp;
    const fn = support - tp;
    return {
      label,
      support,
      tp,
      fp,
      fn,
      precision: safeDivide(tp, predicted),
      recall: safeDivide(tp, support),
      f1: safeDivide(2 * tp, (2 * tp) + fp + fn),
    };
  });

  const pooledTp = perClass.reduce((sum, item) => sum + item.tp, 0);
  const pooledFp = perClass.reduce((sum, item) => sum + item.fp, 0);
  const pooledFn = perClass.reduce((sum, item) => sum + item.fn, 0);
  const microPrecision = safeDivide(pooledTp, pooledTp + pooledFp);
  const microRecall = safeDivide(pooledTp, pooledTp + pooledFn);
  const microF1 = safeDivide(2 * pooledTp, (2 * pooledTp) + pooledFp + pooledFn);

  return {
    total,
    accuracy: pooledTp / total,
    perClass,
    micro: {
      precision: microPrecision,
      recall: microRecall,
      f1: microF1,
    },
    macro: {
      precision: averageDefined(perClass.map((item) => item.precision)),
      recall: averageDefined(perClass.map((item) => item.recall)),
      f1: averageDefined(perClass.map((item) => item.f1)),
    },
    weighted: {
      precision: weightedAverageDefined(perClass, 'precision'),
      recall: weightedAverageDefined(perClass, 'recall'),
      f1: weightedAverageDefined(perClass, 'f1'),
    },
    classCount,
  };
}

export function brierScore(rows, scoreKey) {
  validateRows(rows, scoreKey, true);
  if (!rows.length) return null;
  return rows.reduce((sum, row) => sum + (row[scoreKey] - row.actual) ** 2, 0) / rows.length;
}

export function logLoss(rows, scoreKey) {
  validateRows(rows, scoreKey, true);
  if (!rows.length) return null;
  return rows.reduce((sum, row) => {
    const probability = Math.min(1 - EPSILON, Math.max(EPSILON, row[scoreKey]));
    return sum - (
      row.actual * Math.log(probability)
      + (1 - row.actual) * Math.log(1 - probability)
    );
  }, 0) / rows.length;
}

export function expectedCalibrationError(rows, scoreKey, bins = 5) {
  validateRows(rows, scoreKey, true);
  if (!Number.isInteger(bins) || bins <= 0) throw new RangeError('bins must be a positive integer');
  if (!rows.length) return null;
  let weightedGap = 0;

  for (let bin = 0; bin < bins; bin += 1) {
    const lower = bin / bins;
    const upper = (bin + 1) / bins;
    const inBin = rows.filter((row) => {
      const score = row[scoreKey];
      return bin === bins - 1 ? score >= lower && score <= upper : score >= lower && score < upper;
    });
    if (!inBin.length) continue;
    const confidence = inBin.reduce((sum, row) => sum + row[scoreKey], 0) / inBin.length;
    const observed = inBin.reduce((sum, row) => sum + row.actual, 0) / inBin.length;
    weightedGap += (inBin.length / rows.length) * Math.abs(confidence - observed);
  }

  return weightedGap;
}

function safeDivide(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : null;
}

function averageDefined(values) {
  const defined = values.filter((value) => Number.isFinite(value));
  return defined.length === values.length && defined.length > 0
    ? defined.reduce((sum, value) => sum + value, 0) / defined.length
    : null;
}

function weightedAverageDefined(items, key) {
  if (items.some((item) => item.support > 0 && !Number.isFinite(item[key]))) return null;
  const totalSupport = items.reduce((sum, item) => sum + item.support, 0);
  if (totalSupport === 0) return null;
  return items.reduce((sum, item) => sum + (item[key] ?? 0) * item.support, 0) / totalSupport;
}

function validateRows(rows, scoreKey, requireProbability = false) {
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array');
  rows.forEach((row, index) => {
    if (row?.actual !== 0 && row?.actual !== 1) throw new TypeError(`row ${index} actual must be 0 or 1`);
    const score = row?.[scoreKey];
    if (!Number.isFinite(score)) throw new TypeError(`row ${index} ${scoreKey} must be finite`);
    if (requireProbability && (score < 0 || score > 1)) throw new RangeError(`row ${index} ${scoreKey} must be between 0 and 1`);
  });
}

function validateCounts({ tp, fp, fn, tn }) {
  for (const [name, value] of Object.entries({ tp, fp, fn, tn })) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be non-negative and finite`);
  }
}

function validateProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be between 0 and 1`);
}

function validateNonNegativeFinite(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be non-negative and finite`);
}

function validateMulticlassMatrix(matrix, labels) {
  if (!Array.isArray(labels) || labels.length < 2) throw new RangeError('labels must contain at least two classes');
  if (!Array.isArray(matrix) || matrix.length !== labels.length) throw new RangeError('matrix must be square and match labels');
  matrix.forEach((row) => {
    if (!Array.isArray(row) || row.length !== labels.length) throw new RangeError('matrix must be square and match labels');
    row.forEach((value) => {
      if (!Number.isFinite(value) || value < 0) throw new RangeError('matrix counts must be non-negative and finite');
    });
  });
}
