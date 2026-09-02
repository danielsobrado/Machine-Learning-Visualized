const EPSILON = 1e-12;

export function confusionMatrix(rows, threshold, scoreKey = 'score') {
  return rows.reduce((counts, row) => {
    const predicted = row[scoreKey] >= threshold ? 1 : 0;
    if (predicted === 1 && row.actual === 1) counts.tp += 1;
    else if (predicted === 1) counts.fp += 1;
    else if (row.actual === 1) counts.fn += 1;
    else counts.tn += 1;
    return counts;
  }, { tp: 0, fp: 0, fn: 0, tn: 0 });
}

export function metricsFromCounts({ tp, fp, fn, tn }) {
  const total = tp + fp + fn + tn;
  const precision = safeDivide(tp, tp + fp);
  const recall = safeDivide(tp, tp + fn);
  const specificity = safeDivide(tn, tn + fp);
  const accuracy = safeDivide(tp + tn, total);
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const balancedAccuracy = (recall + specificity) / 2;
  const denominator = Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
  const mcc = denominator > 0 ? ((tp * tn) - (fp * fn)) / denominator : 0;

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
  return counts.fp * falsePositiveCost + counts.fn * falseNegativeCost;
}

export function thresholdSweep(rows, thresholds, falsePositiveCost, falseNegativeCost) {
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

export function bestThresholdBy(sweep, objective) {
  if (!sweep.length) return null;
  const direction = objective === 'cost' ? 'min' : 'max';
  const value = (item) => objective === 'cost' ? item.cost : item.metrics[objective];

  return sweep.reduce((best, current) => {
    if (!best) return current;
    if (direction === 'min') return value(current) < value(best) ? current : best;
    return value(current) > value(best) ? current : best;
  }, null);
}

export function metricsByGroup(rows, threshold) {
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
  if (!groupSummaries.length) return 0;
  const values = groupSummaries.map((summary) => summary.metrics[metricName]);
  return Math.max(...values) - Math.min(...values);
}

export function projectFromRates({ tpr, fpr, prevalence, population }) {
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

export function brierScore(rows, scoreKey) {
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + (row[scoreKey] - row.actual) ** 2, 0) / rows.length;
}

export function logLoss(rows, scoreKey) {
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => {
    const probability = Math.min(1 - EPSILON, Math.max(EPSILON, row[scoreKey]));
    return sum - (
      row.actual * Math.log(probability)
      + (1 - row.actual) * Math.log(1 - probability)
    );
  }, 0) / rows.length;
}

export function expectedCalibrationError(rows, scoreKey, bins = 5) {
  if (!rows.length) return 0;
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
  return denominator > 0 ? numerator / denominator : 0;
}
