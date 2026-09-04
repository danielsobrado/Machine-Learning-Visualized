function requireProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be in [0, 1]`);
}

function requireRate(value, name) {
  requireProbability(value, name);
  if (value === 0) throw new RangeError(`${name} must be greater than zero`);
}

export function computeBayes({ prior, sensitivity, falsePositive }) {
  requireProbability(prior, 'prior');
  requireProbability(sensitivity, 'sensitivity');
  requireProbability(falsePositive, 'falsePositive');

  const numerator = sensitivity * prior;
  const falseAlarmMass = falsePositive * (1 - prior);
  const evidence = numerator + falseAlarmMass;
  const posterior = evidence === 0 ? 0 : numerator / evidence;
  const priorOdds = prior === 1 ? Number.POSITIVE_INFINITY : prior / (1 - prior);
  const likelihoodRatioPositive = falsePositive === 0
    ? Number.POSITIVE_INFINITY
    : sensitivity / falsePositive;
  const posteriorOdds = posterior === 1 ? Number.POSITIVE_INFINITY : posterior / (1 - posterior);

  return {
    prior,
    sensitivity,
    falsePositive,
    numerator,
    falseAlarmMass,
    evidence,
    posterior,
    priorOdds,
    likelihoodRatioPositive,
    posteriorOdds,
  };
}

export function maxFalsePositiveForPosterior({ prior, sensitivity, threshold }) {
  requireProbability(prior, 'prior');
  requireProbability(sensitivity, 'sensitivity');
  requireRate(threshold, 'threshold');
  if (prior === 1) return 1;
  if (prior === 0 || sensitivity === 0) return 0;

  const numerator = sensitivity * prior * (1 - threshold);
  const denominator = threshold * (1 - prior);
  return Math.min(1, Math.max(0, numerator / denominator));
}

export function posteriorAcrossPriors({ priors, sensitivity, falsePositive }) {
  if (!Array.isArray(priors) || priors.length === 0) throw new TypeError('priors must be non-empty');
  return priors.map((prior) => computeBayes({ prior, sensitivity, falsePositive }));
}

export function populationCounts({ prior, sensitivity, falsePositive, population }) {
  if (!Number.isInteger(population) || population <= 0) throw new RangeError('population must be a positive integer');
  const stats = computeBayes({ prior, sensitivity, falsePositive });
  const classCount = population * prior;
  const truePositive = classCount * sensitivity;
  const otherCount = population - classCount;
  const falseAlarm = otherCount * falsePositive;
  return {
    ...stats,
    population,
    classCount,
    otherCount,
    truePositive,
    falseAlarm,
    positiveTotal: truePositive + falseAlarm,
  };
}
