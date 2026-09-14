function assertPositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

export function buildCupedHeterogeneityLab(scenario) {
  assertPositive(scenario.residualSd, 'residualSd');
  assertPositive(scenario.samplePerCell, 'samplePerCell');

  const tau = scenario.averageEffect;
  const gamma = scenario.interaction;
  const beta = scenario.baselineSlope;
  const sigma2 = scenario.residualSd ** 2;
  const nPerArm = 2 * scenario.samplePerCell;

  const lowEffect = tau - gamma;
  const highEffect = tau + gamma;
  const ate = (lowEffect + highEffect) / 2;

  const rawControlVariance = beta ** 2 + sigma2;
  const rawTreatmentVariance = (beta + gamma) ** 2 + sigma2;
  const rawSe = Math.sqrt(rawControlVariance / nPerArm + rawTreatmentVariance / nPerArm);

  const theta = beta + gamma / 2;
  const adjustedArmVariance = (gamma / 2) ** 2 + sigma2;
  const adjustedSe = Math.sqrt(2 * adjustedArmVariance / nPerArm);
  const varianceReduction = 1 - (adjustedSe / rawSe) ** 2;

  return {
    effects: {
      low: lowEffect,
      high: highEffect,
      ate,
    },
    metrics: {
      theta,
      rawSe,
      adjustedSe,
      varianceReduction,
      precisionMultiplier: rawSe / adjustedSe,
      interactionGap: highEffect - lowEffect,
      crossesZero: lowEffect < 0 && highEffect > 0,
      heterogeneous: Math.abs(gamma) > 1e-9,
    },
  };
}
