const GIB = 1024 ** 3;

export function buildCalibrationLab({ buckets }) {
  const totalShare = buckets.reduce((sum, bucket) => sum + bucket.share, 0);
  if (totalShare <= 0) throw new RangeError('Calibration buckets need positive total weight.');

  const normalized = buckets.map((bucket) => ({
    ...bucket,
    weight: bucket.share / totalShare,
    gap: bucket.accuracy - bucket.confidence,
  }));
  const ece = normalized.reduce((sum, bucket) => sum + bucket.weight * Math.abs(bucket.gap), 0);
  const bias = normalized.reduce((sum, bucket) => sum + bucket.weight * bucket.gap, 0);

  return {
    buckets: normalized,
    ece,
    bias,
    diagnosis: bias < -0.02 ? 'overconfident' : bias > 0.02 ? 'underconfident' : 'roughly centered',
  };
}

export function buildFairnessCostLab({ falsePositives, falseNegatives, fpCost, fnCost }) {
  const falsePositiveCost = falsePositives * fpCost;
  const falseNegativeCost = falseNegatives * fnCost;
  return {
    falsePositiveCost,
    falseNegativeCost,
    totalCost: falsePositiveCost + falseNegativeCost,
    dominantError: falseNegativeCost > falsePositiveCost ? 'false negatives' : falsePositiveCost > falseNegativeCost ? 'false positives' : 'neither',
  };
}

export function buildTargetEncodingLab({ categoryPositives, categoryRows, currentTarget, featureTimestampOffsetHours }) {
  if (categoryRows <= 1 || categoryPositives < 0 || categoryPositives > categoryRows) {
    throw new RangeError('Target-encoding example requires at least two rows and a valid positive count.');
  }
  const globalEncoding = categoryPositives / categoryRows;
  const leaveOneOutEncoding = (categoryPositives - currentTarget) / (categoryRows - 1);
  return {
    globalEncoding,
    leaveOneOutEncoding,
    leakageDelta: globalEncoding - leaveOneOutEncoding,
    pointInTimeLeak: featureTimestampOffsetHours > 0,
    pointInTimeMessage: featureTimestampOffsetHours > 0
      ? `The feature arrives ${featureTimestampOffsetHours}h after prediction time, so offline training sees information production cannot have yet.`
      : 'The feature is available at or before prediction time.',
  };
}

export function buildInferenceMemoryLab({
  paramsBillions,
  weightBits,
  layers,
  sequenceLength,
  kvHeads,
  headDim,
  batchSize,
  cacheBytes,
}) {
  const parameterBytes = paramsBillions * 1e9 * weightBits / 8;
  const kvBytes = 2 * layers * sequenceLength * kvHeads * headDim * batchSize * cacheBytes;
  const parameterGiB = parameterBytes / GIB;
  const kvGiB = kvBytes / GIB;
  return {
    parameterGiB,
    kvGiB,
    totalGiB: parameterGiB + kvGiB,
    cacheShare: kvGiB / Math.max(parameterGiB + kvGiB, Number.EPSILON),
  };
}
