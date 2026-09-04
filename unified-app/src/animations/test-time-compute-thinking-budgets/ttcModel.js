const EPSILON = 1e-12;

function assertProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be between 0 and 1.`);
  }
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${name} must be a positive integer.`);
  }
}

export function combination(n, k) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) return 0;
  const r = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= r; i += 1) {
    result = (result * (n - r + i)) / i;
  }
  return result;
}

export function binomialProbability(n, k, p) {
  assertPositiveInteger(n, 'n');
  assertProbability(p, 'p');
  if (!Number.isInteger(k) || k < 0 || k > n) return 0;
  return combination(n, k) * (p ** k) * ((1 - p) ** (n - k));
}

export function passAtK(singleSuccessProbability, sampleCount) {
  assertProbability(singleSuccessProbability, 'singleSuccessProbability');
  assertPositiveInteger(sampleCount, 'sampleCount');
  return 1 - ((1 - singleSuccessProbability) ** sampleCount);
}

export function majorityVoteAccuracy(singleSuccessProbability, sampleCount) {
  assertProbability(singleSuccessProbability, 'singleSuccessProbability');
  assertPositiveInteger(sampleCount, 'sampleCount');

  let probability = 0;
  const half = sampleCount / 2;
  for (let correct = 0; correct <= sampleCount; correct += 1) {
    const mass = binomialProbability(sampleCount, correct, singleSuccessProbability);
    if (correct > half) probability += mass;
    else if (correct === half) probability += 0.5 * mass;
  }
  return probability;
}

export function verifierPositiveProbability({
  singleSuccessProbability,
  truePositiveRate,
  falsePositiveRate,
}) {
  assertProbability(singleSuccessProbability, 'singleSuccessProbability');
  assertProbability(truePositiveRate, 'truePositiveRate');
  assertProbability(falsePositiveRate, 'falsePositiveRate');
  return (singleSuccessProbability * truePositiveRate)
    + ((1 - singleSuccessProbability) * falsePositiveRate);
}

export function bestOfNSelectedAccuracy({
  singleSuccessProbability,
  sampleCount,
  truePositiveRate,
  falsePositiveRate,
}) {
  assertProbability(singleSuccessProbability, 'singleSuccessProbability');
  assertPositiveInteger(sampleCount, 'sampleCount');
  assertProbability(truePositiveRate, 'truePositiveRate');
  assertProbability(falsePositiveRate, 'falsePositiveRate');

  const positiveProbability = verifierPositiveProbability({
    singleSuccessProbability,
    truePositiveRate,
    falsePositiveRate,
  });

  if (positiveProbability <= EPSILON) return singleSuccessProbability;

  const noPositiveProbability = (1 - positiveProbability) ** sampleCount;
  const selectedCorrectProbability = singleSuccessProbability * (
    truePositiveRate * ((1 - noPositiveProbability) / positiveProbability)
    + (1 - truePositiveRate) * ((1 - positiveProbability) ** (sampleCount - 1))
  );

  return Math.max(0, Math.min(1, selectedCorrectProbability));
}

export function buildTestTimeComputeLab({
  baseSuccessProbability,
  sampleCount,
  verifierTruePositiveRate,
  verifierFalsePositiveRate,
  tokensPerSample,
}) {
  assertProbability(baseSuccessProbability, 'baseSuccessProbability');
  assertPositiveInteger(sampleCount, 'sampleCount');
  assertProbability(verifierTruePositiveRate, 'verifierTruePositiveRate');
  assertProbability(verifierFalsePositiveRate, 'verifierFalsePositiveRate');
  assertPositiveInteger(tokensPerSample, 'tokensPerSample');

  const oracleCoverage = passAtK(baseSuccessProbability, sampleCount);
  const selectedAccuracy = bestOfNSelectedAccuracy({
    singleSuccessProbability: baseSuccessProbability,
    sampleCount,
    truePositiveRate: verifierTruePositiveRate,
    falsePositiveRate: verifierFalsePositiveRate,
  });
  const voteAccuracy = majorityVoteAccuracy(baseSuccessProbability, sampleCount);
  const positiveProbability = verifierPositiveProbability({
    singleSuccessProbability: baseSuccessProbability,
    truePositiveRate: verifierTruePositiveRate,
    falsePositiveRate: verifierFalsePositiveRate,
  });
  const previousCoverage = sampleCount === 1
    ? baseSuccessProbability
    : passAtK(baseSuccessProbability, sampleCount - 1);

  return {
    baseSuccessProbability,
    sampleCount,
    oracleCoverage,
    selectedAccuracy,
    voteAccuracy,
    positiveProbability,
    expectedVerifierPositives: sampleCount * positiveProbability,
    expectedTokenCost: sampleCount * tokensPerSample,
    marginalCoverageGain: oracleCoverage - previousCoverage,
    verifierLift: selectedAccuracy - baseSuccessProbability,
    verifierSeparation: verifierTruePositiveRate - verifierFalsePositiveRate,
    verifierUseful: verifierTruePositiveRate > verifierFalsePositiveRate,
  };
}
