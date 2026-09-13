function requireCount(value, name) {
  if (!Number.isInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative integer`);
}

function requireProbability(value, name) {
  if (!Number.isFinite(value) || value <= 0 || value >= 1) throw new RangeError(`${name} must be in (0, 1)`);
}

export function boundaryMleExperiment({ successes, failures }) {
  requireCount(successes, 'successes');
  requireCount(failures, 'failures');
  const sampleSize = successes + failures;
  if (sampleSize === 0) throw new RangeError('at least one observation is required');

  const mle = successes / sampleSize;
  const atBoundary = mle === 0 || mle === 1;
  return {
    successes,
    failures,
    sampleSize,
    mle,
    atBoundary,
    interiorScoreConditionApplies: !atBoundary,
    direction: mle === 1 ? 'increase-p' : mle === 0 ? 'decrease-p' : 'interior',
  };
}

export function bernoulliLikelihoodStability({ successes, failures, candidateA, candidateB }) {
  requireCount(successes, 'successes');
  requireCount(failures, 'failures');
  if (successes + failures === 0) throw new RangeError('at least one observation is required');
  requireProbability(candidateA, 'candidateA');
  requireProbability(candidateB, 'candidateB');

  const logLikelihood = (p) => successes * Math.log(p) + failures * Math.log1p(-p);
  const directLikelihood = (p) => (p ** successes) * ((1 - p) ** failures);
  const logA = logLikelihood(candidateA);
  const logB = logLikelihood(candidateB);

  return {
    successes,
    failures,
    candidateA: { p: candidateA, direct: directLikelihood(candidateA), logLikelihood: logA },
    candidateB: { p: candidateB, direct: directLikelihood(candidateB), logLikelihood: logB },
    preferred: logA >= logB ? 'A' : 'B',
    logLikelihoodGap: Math.abs(logA - logB),
    bothDirectUnderflow: directLikelihood(candidateA) === 0 && directLikelihood(candidateB) === 0,
  };
}
