function requireProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be in [0, 1]`);
}

function safeDivide(numerator, denominator) {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function buildJointTable({ conditionRate, eventGivenCondition, eventGivenNotCondition }) {
  requireProbability(conditionRate, 'conditionRate');
  requireProbability(eventGivenCondition, 'eventGivenCondition');
  requireProbability(eventGivenNotCondition, 'eventGivenNotCondition');

  const both = conditionRate * eventGivenCondition;
  const conditionOnly = conditionRate * (1 - eventGivenCondition);
  const eventOnly = (1 - conditionRate) * eventGivenNotCondition;
  const neither = (1 - conditionRate) * (1 - eventGivenNotCondition);
  const eventRate = both + eventOnly;

  return {
    both,
    conditionOnly,
    eventOnly,
    neither,
    eventRate,
    conditionRate,
  };
}

export function conditionalMetrics(scenario) {
  const table = buildJointTable(scenario);
  const eventGivenCondition = safeDivide(table.both, table.conditionRate);
  const conditionGivenEvent = safeDivide(table.both, table.eventRate);
  const eventGivenNotCondition = safeDivide(table.eventOnly, 1 - table.conditionRate);
  const independentJoint = table.eventRate * table.conditionRate;
  const independenceGap = table.both - independentJoint;
  const conditionalGap = eventGivenCondition - eventGivenNotCondition;
  const riskRatio = eventGivenNotCondition === 0 ? Number.POSITIVE_INFINITY : eventGivenCondition / eventGivenNotCondition;

  return {
    ...table,
    eventGivenCondition,
    conditionGivenEvent,
    eventGivenNotCondition,
    independentJoint,
    independenceGap,
    conditionalGap,
    riskRatio,
    independent: Math.abs(conditionalGap) < 1e-12,
    bayesReconstruction: safeDivide(eventGivenCondition * table.conditionRate, table.eventRate),
    totalProbabilityReconstruction:
      eventGivenCondition * table.conditionRate
      + eventGivenNotCondition * (1 - table.conditionRate),
  };
}

export function expectedCounts(scenario) {
  if (!Number.isInteger(scenario.population) || scenario.population <= 0) throw new RangeError('population must be positive');
  const metrics = conditionalMetrics(scenario);
  return {
    both: metrics.both * scenario.population,
    conditionOnly: metrics.conditionOnly * scenario.population,
    eventOnly: metrics.eventOnly * scenario.population,
    neither: metrics.neither * scenario.population,
    eventTotal: metrics.eventRate * scenario.population,
    conditionTotal: metrics.conditionRate * scenario.population,
  };
}

export function buildConditionalLab(scenario) {
  const metrics = conditionalMetrics(scenario);
  const counts = expectedCounts(scenario);
  return {
    metrics,
    counts,
    directionAsymmetry: metrics.eventGivenCondition - metrics.conditionGivenEvent,
    associationStrength: Math.abs(metrics.conditionalGap),
  };
}
