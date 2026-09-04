const MIN_SAMPLE = 20;
const MAX_SAMPLE = 2_000_000;
const POWER_SEARCH_STEPS = 48;

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const polynomial = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  return sign * (1 - polynomial * Math.exp(-a * a));
}

export function normalCdf(value) {
  return 0.5 * (1 + erf(value / Math.SQRT2));
}

export function inverseNormalCdf(probability) {
  if (!(probability > 0 && probability < 1)) throw new RangeError('probability must be between 0 and 1');
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const low = 0.02425;
  const high = 1 - low;
  if (probability < low) {
    const q = Math.sqrt(-2 * Math.log(probability));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (probability <= high) {
    const q = probability - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
      / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - probability));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
    / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

function rates(scenario, relativeLift = scenario.relativeLift) {
  const p0 = scenario.baselineRate / 100;
  const p1 = Math.min(0.999, p0 * (1 + relativeLift / 100));
  return { p0, p1, delta: p1 - p0 };
}

export function achievedPower(scenario, totalSample = scenario.plannedTotal, relativeLift = scenario.relativeLift) {
  const { p0, p1, delta } = rates(scenario, relativeLift);
  const allocation = scenario.treatmentAllocation / 100;
  const treatmentN = Math.max(1, totalSample * allocation);
  const controlN = Math.max(1, totalSample * (1 - allocation));
  const alternativeSe = Math.sqrt(scenario.designEffect * (p1 * (1 - p1) / treatmentN + p0 * (1 - p0) / controlN));
  if (alternativeSe === 0) return 0;
  const pooledRate = allocation * p1 + (1 - allocation) * p0;
  const nullSe = Math.sqrt(scenario.designEffect * pooledRate * (1 - pooledRate) * (1 / treatmentN + 1 / controlN));
  const criticalDifference = inverseNormalCdf(1 - scenario.alpha / 200) * nullSe;
  return normalCdf((-criticalDifference - delta) / alternativeSe)
    + 1 - normalCdf((criticalDifference - delta) / alternativeSe);
}

export function requiredSampleSize(scenario) {
  const target = scenario.targetPower / 100;
  let low = MIN_SAMPLE;
  let high = MAX_SAMPLE;
  if (achievedPower(scenario, high) < target) return high;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (achievedPower(scenario, mid) >= target) high = mid;
    else low = mid + 1;
  }
  return low;
}

export function detectableRelativeLift(scenario) {
  const target = scenario.targetPower / 100;
  let low = 0;
  let high = 200;
  for (let step = 0; step < POWER_SEARCH_STEPS; step += 1) {
    const mid = (low + high) / 2;
    if (achievedPower(scenario, scenario.plannedTotal, mid) >= target) high = mid;
    else low = mid;
  }
  return high;
}

export function buildPowerCurve(scenario, points = 15) {
  const required = requiredSampleSize(scenario);
  const minN = Math.max(500, Math.floor(required * 0.2));
  const maxN = Math.max(scenario.plannedTotal, Math.ceil(required * 1.8));
  return Array.from({ length: points }, (_, index) => {
    const fraction = index / (points - 1);
    const totalSample = Math.round(minN + (maxN - minN) * fraction);
    return { totalSample, power: achievedPower(scenario, totalSample) };
  });
}

export function buildPowerLab(scenario) {
  const { p0, p1, delta } = rates(scenario);
  const requiredTotal = requiredSampleSize(scenario);
  const power = achievedPower(scenario);
  const detectableLift = detectableRelativeLift(scenario);
  const critical = inverseNormalCdf(1 - scenario.alpha / 200);
  const targetZ = inverseNormalCdf(scenario.targetPower / 100);
  const allocation = scenario.treatmentAllocation / 100;
  return {
    metrics: {
      baselineRate: p0,
      treatmentRate: p1,
      absoluteEffect: delta,
      requiredTotal,
      achievedPower: power,
      falseNegativeRate: 1 - power,
      criticalZ: critical,
      targetZ,
      detectableRelativeLift: detectableLift,
      treatmentN: Math.round(scenario.plannedTotal * allocation),
      controlN: scenario.plannedTotal - Math.round(scenario.plannedTotal * allocation),
      underpowered: power < scenario.targetPower / 100,
      sampleRatio: scenario.plannedTotal / requiredTotal,
    },
    curve: buildPowerCurve(scenario),
  };
}
