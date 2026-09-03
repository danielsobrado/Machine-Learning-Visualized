import {
  MATERIAL_AUC_DROP,
  MATERIAL_ECE_RISE,
  PROBABILITY_EPSILON,
} from './calibrationConstants.js';

export function totalCount(bins) {
  return bins.reduce((sum, bin) => sum + bin.count, 0);
}

export function baseRate(bins) {
  const total = totalCount(bins);
  return total === 0 ? 0 : bins.reduce((sum, bin) => sum + bin.count * bin.observed, 0) / total;
}

export function expectedCalibrationError(bins) {
  const total = totalCount(bins);
  if (total === 0) return 0;
  return bins.reduce(
    (sum, bin) => sum + (bin.count / total) * Math.abs(bin.observed - bin.confidence),
    0,
  );
}

export function brierScore(bins) {
  const total = totalCount(bins);
  if (total === 0) return 0;
  return bins.reduce((sum, bin) => {
    const positives = bin.count * bin.observed;
    const negatives = bin.count - positives;
    return sum + positives * (1 - bin.confidence) ** 2 + negatives * bin.confidence ** 2;
  }, 0) / total;
}

export function logLoss(bins) {
  const total = totalCount(bins);
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
  const positives = bins.map((bin) => bin.count * bin.observed);
  const negatives = bins.map((bin) => bin.count * (1 - bin.observed));
  const positiveTotal = positives.reduce((sum, value) => sum + value, 0);
  const negativeTotal = negatives.reduce((sum, value) => sum + value, 0);
  if (positiveTotal === 0 || negativeTotal === 0) return 0;

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
    logLoss: logLoss(bins),
    auc: groupedAuc(bins),
    baseRate: baseRate(bins),
  };
}

export function aggregateCalibrationSlices(slices) {
  const grouped = new Map();

  slices.forEach((slice) => {
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
  return Math.min(1 - PROBABILITY_EPSILON, Math.max(PROBABILITY_EPSILON, probability));
}

function diagnostic(severity, title, detail, aucDrop, eceRise, baseRateDelta) {
  return { severity, title, detail, aucDrop, eceRise, baseRateDelta };
}

function safeRatio(numerator, denominator) {
  return denominator === 0 ? 0 : numerator / denominator;
}
