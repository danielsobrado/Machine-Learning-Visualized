const UINT32_MAX_PLUS_ONE = 4_294_967_296;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

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

function nextRandom(state) {
  const next = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return [next, next / UINT32_MAX_PLUS_ONE];
}

export function sampleBinomial(rate, sampleSize, seed) {
  let state = seed >>> 0;
  let successes = 0;
  for (let index = 0; index < sampleSize; index += 1) {
    let random;
    [state, random] = nextRandom(state);
    if (random < rate) successes += 1;
  }
  return successes;
}

export function proportionInterval(successes, sampleSize, confidence, method = 'wilson') {
  if (!(sampleSize > 0)) throw new RangeError('sampleSize must be positive');
  const pHat = successes / sampleSize;
  const z = inverseNormalCdf(0.5 + confidence / 200);
  if (method === 'wald') {
    const margin = z * Math.sqrt((pHat * (1 - pHat)) / sampleSize);
    const low = clamp(pHat - margin, 0, 1);
    const high = clamp(pHat + margin, 0, 1);
    return { pHat, low, high, width: high - low, z, method };
  }
  if (method !== 'wilson') throw new RangeError(`unknown interval method: ${method}`);
  const zSquared = z * z;
  const denominator = 1 + zSquared / sampleSize;
  const center = (pHat + zSquared / (2 * sampleSize)) / denominator;
  const margin = (z / denominator) * Math.sqrt((pHat * (1 - pHat)) / sampleSize + zSquared / (4 * sampleSize * sampleSize));
  const low = clamp(center - margin, 0, 1);
  const high = clamp(center + margin, 0, 1);
  return { pHat, low, high, width: high - low, z, method };
}

function runSeed(baseSeed, runIndex) {
  return (baseSeed + Math.imul(runIndex + 1, 2654435761)) >>> 0;
}

export function simulateIntervals(scenario) {
  const trueRate = scenario.trueRate / 100;
  return Array.from({ length: scenario.runs }, (_, runIndex) => {
    const successes = sampleBinomial(trueRate, scenario.sampleSize, runSeed(scenario.seed, runIndex));
    const interval = proportionInterval(successes, scenario.sampleSize, scenario.confidence, scenario.method);
    return {
      ...interval,
      successes,
      captures: interval.low <= trueRate && trueRate <= interval.high,
    };
  });
}

export function buildConfidenceLab(scenario) {
  const trueRate = scenario.trueRate / 100;
  const intervals = simulateIntervals(scenario);
  const captured = intervals.filter((interval) => interval.captures).length;
  const coverage = captured / intervals.length;
  const averageWidth = intervals.reduce((sum, interval) => sum + interval.width, 0) / intervals.length;
  const expectedStandardError = Math.sqrt((trueRate * (1 - trueRate)) / scenario.sampleSize);
  const reference = proportionInterval(Math.round(trueRate * scenario.sampleSize), scenario.sampleSize, scenario.confidence, scenario.method);
  const fourXReference = proportionInterval(Math.round(trueRate * scenario.sampleSize * 4), scenario.sampleSize * 4, scenario.confidence, scenario.method);
  const collapsed = intervals.filter((interval) => interval.width === 0).length;
  return {
    metrics: {
      trueRate,
      coverage,
      nominalCoverage: scenario.confidence / 100,
      coverageError: coverage - scenario.confidence / 100,
      averageWidth,
      expectedStandardError,
      captured,
      collapsed,
      criticalZ: intervals[0].z,
      referenceWidth: reference.width,
      fourXReferenceWidth: fourXReference.width,
    },
    first: intervals[0],
    intervals,
  };
}
