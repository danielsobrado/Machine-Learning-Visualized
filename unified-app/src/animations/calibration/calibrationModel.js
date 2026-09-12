import {
  MATERIAL_AUC_DROP,
  MATERIAL_ECE_RISE,
  PROBABILITY_EPSILON,
} from './calibrationConstants.js';

export function totalCount(bins) {
  validateBins(bins);
  return bins.reduce((sum, bin) => sum + bin.count, 0);
}

export function baseRate(bins) {
  validateBins(bins);
  const total = bins.reduce((sum, bin) => sum + bin.count, 0);
  return total === 0 ? 0 : bins.reduce((sum, bin) => sum + bin.count * bin.observed, 0) / total;
}

export function expectedCalibrationError(bins) {
  validateBins(bins);
  const total = bins.reduce((sum, bin) => sum + bin.count, 0);
  if (total === 0) return 0;
  return bins.reduce(
    (sum, bin) => sum + (bin.count / total) * Math.abs(bin.observed - bin.confidence),
    0,
  );
}

export function brierScore(bins) {
  validateBins(bins);
  const total = bins.reduce((sum, bin) => sum + bin.count, 0);
  if (total === 0) return 0;
  return bins.reduce((sum, bin) => {
    const positives = bin.count * bin.observed;
    const negatives = bin.count - positives;
    return sum + positives * (1 - bin.confidence) ** 2 + negatives * bin.confidence ** 2;
  }, 0) / total;
}

export function brierDecomposition(bins) {
  validateBins(bins);
  const total = bins.reduce((sum, bin) => sum + bin.count, 0);
  if (total === 0) {
    return { reliability: 0, resolution: 0, uncertainty: 0, reconstructed: 0 };
  }

  const prevalence = bins.reduce((sum, bin) => sum + bin.count * bin.observed, 0) / total;
  const reliability = bins.reduce(
    (sum, bin) => sum + (bin.count / total) * (bin.confidence - bin.observed) ** 2,
    0,
  );
  const resolution = bins.reduce(
    (sum, bin) => sum + (bin.count / total) * (bin.observed - prevalence) ** 2,
    0,
  );
  const uncertainty = prevalence * (1 - prevalence);

  return {
    reliability,
    resolution,
    uncertainty,
    reconstructed: reliability - resolution + uncertainty,
  };
}

export function logLoss(bins) {
  validateBins(bins);
  const total = bins.reduce((sum, bin) => sum + bin.count, 0);
  if (total === 0) return 0;
  return bins.reduce((sum, bin) => {
    const probability = clampProbability(bin.confidence);
    return sum + bin.count * (
      -bin.observed * Math.log(probability)
      - (1 - bin.observed) * Math.log(1 - probability)
    );
  }, 0) / total;
}

export function groupedAuc(bins) {
  validateBins(bins);
  const positives = bins.map((bin) => bin.count * bin.observed);
  const negatives = bins.map((bin) => bin.count * (1 - bin.observed));
  const positiveTotal = positives.reduce((sum, value) => sum + value, 0);
  const negativeTotal = negatives.reduce((sum, value) => sum + value, 0);
  if (positiveTotal === 0 || negativeTotal === 0) return null;

  let concordance = 0;
  bins.forEach((positiveBin, positiveIndex) => {
    bins.forEach((negativeBin, negativeIndex) => {
      if (positiveBin.confidence > negativeBin.confidence) {
        concordance += positives[positiveIndex] * negatives[negativeIndex];
      } else if (positiveBin.confidence === negativeBin.confidence) {
        concordance += 0.5 * positives[positiveIndex] * negatives[negativeIndex];
      }
    });
  });

  return concordance / (positiveTotal * negativeTotal);
}

export function reliabilityMetrics(bins) {
  return {
    ece: expectedCalibrationError(bins),
    brier: brierScore(bins),
    brierComponents: brierDecomposition(bins),
    logLoss: logLoss(bins),
    auc: groupedAuc(bins),
    baseRate: baseRate(bins),
  };
}

export function calibrationBinsFromRows(rows, binCount) {
  validateCalibrationRows(rows);
  if (!Number.isInteger(binCount) || binCount < 2) {
    throw new RangeError('binCount must be an integer of at least 2');
  }

  const aggregates = Array.from({ length: binCount }, (_, index) => ({
    index,
    lower: index / binCount,
    upper: (index + 1) / binCount,
    count: 0,
    scoreSum: 0,
    positives: 0,
  }));

  rows.forEach((row) => {
    const index = Math.min(binCount - 1, Math.floor(row.probability * binCount));
    const aggregate = aggregates[index];
    aggregate.count += 1;
    aggregate.scoreSum += row.probability;
    aggregate.positives += row.label;
  });

  return aggregates
    .filter((aggregate) => aggregate.count > 0)
    .map((aggregate) => ({
      lower: aggregate.lower,
      upper: aggregate.upper,
      confidence: aggregate.scoreSum / aggregate.count,
      observed: aggregate.positives / aggregate.count,
      count: aggregate.count,
    }));
}

export function rowBrierScore(rows) {
  validateCalibrationRows(rows);
  if (rows.length === 0) return 0;
  return rows.reduce(
    (sum, row) => sum + (row.probability - row.label) ** 2,
    0,
  ) / rows.length;
}

export function rowLogLoss(rows) {
  validateCalibrationRows(rows);
  if (rows.length === 0) return 0;
  return rows.reduce((sum, row) => {
    const probability = clampProbability(row.probability);
    return sum - (
      row.label * Math.log(probability)
      + (1 - row.label) * Math.log(1 - probability)
    );
  }, 0) / rows.length;
}

export function aggregateCalibrationSlices(slices) {
  if (!Array.isArray(slices)) throw new TypeError('slices must be an array');
  const grouped = new Map();

  slices.forEach((slice) => {
    validateBins(slice.bins);
    slice.bins.forEach((bin) => {
      const key = String(bin.confidence);
      const current = grouped.get(key) ?? {
        confidence: bin.confidence,
        count: 0,
        positives: 0,
      };
      current.count += bin.count;
      current.positives += bin.count * bin.observed;
      grouped.set(key, current);
    });
  });

  return [...grouped.values()]
    .sort((a, b) => a.confidence - b.confidence)
    .map(({ confidence, count, positives }) => ({
      confidence,
      observed: count === 0 ? 0 : positives / count,
      count,
    }));
}

export function thresholdStats(bins, threshold) {
  validateBins(bins);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new RangeError('threshold must be between 0 and 1');
  }

  const predictedPositive = bins.filter((bin) => bin.confidence >= threshold);
  const predictedNegative = bins.filter((bin) => bin.confidence < threshold);
  const tp = predictedPositive.reduce((sum, bin) => sum + bin.count * bin.observed, 0);
  const fp = predictedPositive.reduce((sum, bin) => sum + bin.count * (1 - bin.observed), 0);
  const fn = predictedNegative.reduce((sum, bin) => sum + bin.count * bin.observed, 0);
  const tn = predictedNegative.reduce((sum, bin) => sum + bin.count * (1 - bin.observed), 0);

  return {
    predictedPositive: predictedPositive.reduce((sum, bin) => sum + bin.count, 0),
    precision: safeRatio(tp, tp + fp),
    recall: safeRatio(tp, tp + fn),
    tp,
    fp,
    fn,
    tn,
  };
}

export function diagnoseShift(referenceBins, liveBins) {
  const reference = reliabilityMetrics(referenceBins);
  const live = reliabilityMetrics(liveBins);
  if (reference.auc === null || live.auc === null) {
    throw new RangeError('shift diagnosis requires both positive and negative outcomes');
  }

  const aucDrop = reference.auc - live.auc;
  const eceRise = live.ece - reference.ece;
  const baseRateDelta = live.baseRate - reference.baseRate;

  if (aucDrop >= MATERIAL_AUC_DROP) {
    return diagnostic('model-drift', 'Ranking degraded', 'Discrimination fell materially. Recalibration may improve probability appearance, but it cannot recover lost ordering.', aucDrop, eceRise, baseRateDelta);
  }

  if (eceRise >= MATERIAL_ECE_RISE) {
    return diagnostic('calibration-drift', 'Calibration drift with ranking intact', 'The score ordering still works reasonably well, so held-out recalibration is worth testing after the shift source is understood.', aucDrop, eceRise, baseRateDelta);
  }

  return diagnostic('stable', 'No material calibration regression', 'Small differences can be sampling noise. Avoid adding a calibrator without evidence that it improves untouched evaluation data.', aucDrop, eceRise, baseRateDelta);
}

export function clampProbability(probability) {
  if (!Number.isFinite(probability)) throw new TypeError('probability must be finite');
  return Math.min(1 - PROBABILITY_EPSILON, Math.max(PROBABILITY_EPSILON, probability));
}

function diagnostic(severity, title, detail, aucDrop, eceRise, baseRateDelta) {
  return { severity, title, detail, aucDrop, eceRise, baseRateDelta };
}

function safeRatio(numerator, denominator) {
  return denominator === 0 ? null : numerator / denominator;
}

function validateBins(bins) {
  if (!Array.isArray(bins)) throw new TypeError('bins must be an array');
  bins.forEach((bin, index) => {
    if (!Number.isFinite(bin.confidence) || bin.confidence < 0 || bin.confidence > 1) {
      throw new RangeError(`bin ${index} confidence must be between 0 and 1`);
    }
    if (!Number.isFinite(bin.observed) || bin.observed < 0 || bin.observed > 1) {
      throw new RangeError(`bin ${index} observed rate must be between 0 and 1`);
    }
    if (!Number.isFinite(bin.count) || bin.count < 0) {
      throw new RangeError(`bin ${index} count must be non-negative`);
    }
  });
}

function validateCalibrationRows(rows) {
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array');
  rows.forEach((row, index) => {
    if (!Number.isFinite(row.probability) || row.probability < 0 || row.probability > 1) {
      throw new RangeError(`row ${index} probability must be between 0 and 1`);
    }
    if (row.label !== 0 && row.label !== 1) {
      throw new TypeError(`row ${index} label must be 0 or 1`);
    }
  });
}
