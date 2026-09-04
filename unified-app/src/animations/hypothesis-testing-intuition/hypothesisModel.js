const CURVE_POINTS = 121;
const Z_RANGE = 4;

function erf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * x);
  const polynomial = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  return sign * (1 - polynomial * Math.exp(-x * x));
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

export function twoSidedPValue(zScore) {
  if (zScore === 0) return 1;
  return Math.min(1, 2 * (1 - normalCdf(Math.abs(zScore))));
}

export function powerForEffect({ effect, standardError, alpha }) {
  if (standardError <= 0) return 0;
  const criticalZ = inverseNormalCdf(1 - alpha / 200);
  const criticalEffect = criticalZ * standardError;
  return normalCdf((-criticalEffect - effect) / standardError)
    + 1 - normalCdf((criticalEffect - effect) / standardError);
}

function normalDensity(z, mean = 0) {
  const residual = z - mean;
  return Math.exp(-0.5 * residual * residual) / Math.sqrt(2 * Math.PI);
}

function buildDistributionCurve(meanZ = 0) {
  return Array.from({ length: CURVE_POINTS }, (_, index) => {
    const z = -Z_RANGE + (index / (CURVE_POINTS - 1)) * Z_RANGE * 2;
    return { z, density: normalDensity(z, meanZ) };
  });
}

export function buildHypothesisLab(scenario) {
  const standardError = scenario.noiseSd / Math.sqrt(scenario.sampleSize);
  const observedZ = scenario.observedEffect / standardError;
  const alpha = scenario.alpha / 100;
  const criticalZ = inverseNormalCdf(1 - alpha / 2);
  const pValue = twoSidedPValue(observedZ);
  const margin = criticalZ * standardError;
  const designZ = scenario.designEffect / standardError;
  const power = powerForEffect({ effect: scenario.designEffect, standardError, alpha: scenario.alpha });
  const confidenceInterval = [scenario.observedEffect - margin, scenario.observedEffect + margin];
  const statisticallySignificant = pValue < alpha;
  const practicallyMeaningful = Math.abs(scenario.observedEffect) >= scenario.meaningfulThreshold;

  return {
    metrics: {
      standardError,
      observedZ,
      pValue,
      alpha,
      criticalZ,
      criticalEffect: criticalZ * standardError,
      confidenceInterval,
      statisticallySignificant,
      practicallyMeaningful,
      designPower: power,
      falseNegativeRate: 1 - power,
      designZ,
    },
    nullCurve: buildDistributionCurve(0),
    designCurve: buildDistributionCurve(designZ),
  };
}
