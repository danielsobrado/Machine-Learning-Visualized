function assertProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be in [0, 1]`);
  }
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

export function designEffect(observationsPerCluster, intraclassCorrelation) {
  assertPositiveInteger(observationsPerCluster, 'observationsPerCluster');
  assertProbability(intraclassCorrelation, 'intraclassCorrelation');
  return 1 + (observationsPerCluster - 1) * intraclassCorrelation;
}

export function effectiveSampleSize(clusterCount, observationsPerCluster, intraclassCorrelation) {
  assertPositiveInteger(clusterCount, 'clusterCount');
  const totalRows = clusterCount * observationsPerCluster;
  return totalRows / designEffect(observationsPerCluster, intraclassCorrelation);
}

export function proportionStandardError(eventRate, sampleSize) {
  assertProbability(eventRate, 'eventRate');
  if (!Number.isFinite(sampleSize) || sampleSize <= 0) {
    throw new RangeError('sampleSize must be positive');
  }
  return Math.sqrt(eventRate * (1 - eventRate) / sampleSize);
}

function interval(eventRate, standardError, z) {
  const margin = z * standardError;
  return {
    low: Math.max(0, eventRate - margin),
    high: Math.min(1, eventRate + margin),
    width: Math.min(1, eventRate + margin) - Math.max(0, eventRate - margin),
  };
}

export function buildClusteredSamplingLab({
  eventRate,
  clusterCount,
  observationsPerCluster,
  intraclassCorrelation,
  confidenceZ,
}) {
  assertProbability(eventRate, 'eventRate');
  assertPositiveInteger(clusterCount, 'clusterCount');
  assertPositiveInteger(observationsPerCluster, 'observationsPerCluster');
  assertProbability(intraclassCorrelation, 'intraclassCorrelation');
  if (!Number.isFinite(confidenceZ) || confidenceZ <= 0) {
    throw new RangeError('confidenceZ must be positive');
  }

  const totalRows = clusterCount * observationsPerCluster;
  const effect = designEffect(observationsPerCluster, intraclassCorrelation);
  const effectiveRows = effectiveSampleSize(clusterCount, observationsPerCluster, intraclassCorrelation);
  const naiveSe = proportionStandardError(eventRate, totalRows);
  const clusterAwareSe = proportionStandardError(eventRate, effectiveRows);
  const naiveInterval = interval(eventRate, naiveSe, confidenceZ);
  const clusterAwareInterval = interval(eventRate, clusterAwareSe, confidenceZ);

  return {
    totalRows,
    independentUnits: clusterCount,
    designEffect: effect,
    effectiveSampleSize: effectiveRows,
    naiveSe,
    clusterAwareSe,
    standardErrorInflation: clusterAwareSe / naiveSe,
    naiveInterval,
    clusterAwareInterval,
    lostEffectiveRows: totalRows - effectiveRows,
  };
}
