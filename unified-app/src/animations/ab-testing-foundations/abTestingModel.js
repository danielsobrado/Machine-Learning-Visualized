import {
  CONFIDENCE_Z,
  SIGNIFICANCE_ALPHA,
} from './abTestingConstants.js';

const UINT32_RANGE = 4294967296;
const MIN_RANDOM = 1e-12;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalCdf(x) {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

export function twoSidedPValue(z) {
  return Math.min(1, 2 * (1 - normalCdf(Math.abs(z))));
}

export function planningMetrics({
  baselinePct,
  liftPct,
  sampleSize,
  treatmentShare,
  mdePct,
  guardrailImpactPct,
  guardrailThresholdPct,
}) {
  const treatmentN = Math.round(sampleSize * (treatmentShare / 100));
  const controlN = sampleSize - treatmentN;
  const controlRate = baselinePct / 100;
  const treatmentRate = clamp(controlRate * (1 + liftPct / 100), 0.001, 0.999);
  const diff = treatmentRate - controlRate;
  const pooled = (controlRate * controlN + treatmentRate * treatmentN) / sampleSize;
  const se = Math.sqrt(
    pooled * (1 - pooled) * ((1 / Math.max(1, controlN)) + (1 / Math.max(1, treatmentN))),
  );
  const z = se === 0 ? 0 : diff / se;
  const pValue = twoSidedPValue(z);
  const ciLow = diff - CONFIDENCE_Z * se;
  const ciHigh = diff + CONFIDENCE_Z * se;
  const relativeLift = controlRate === 0 ? 0 : diff / controlRate;
  const practical = Math.abs(relativeLift) * 100 >= mdePct;
  const significant = pValue < SIGNIFICANCE_ALPHA;
  const guardrailPass = guardrailImpactPct >= guardrailThresholdPct;
  const allocationRisk = Math.min(treatmentN, controlN) / Math.max(treatmentN, controlN) < 0.35;

  return {
    treatmentN,
    controlN,
    controlRate,
    treatmentRate,
    diff,
    se,
    z,
    pValue,
    ciLow,
    ciHigh,
    relativeLift,
    practical,
    significant,
    guardrailPass,
    allocationRisk,
    decisionReady: significant && practical && guardrailPass && !allocationRisk,
  };
}

export function simulateOptionalStopping({
  looks,
  simulations,
  seed,
  alpha = SIGNIFICANCE_ALPHA,
}) {
  if (!Number.isInteger(looks) || looks < 2) {
    throw new RangeError('Optional-stopping simulation requires at least two looks.');
  }
  if (!Number.isInteger(simulations) || simulations < 100) {
    throw new RangeError('Optional-stopping simulation requires at least 100 experiments.');
  }
  if (!(alpha > 0 && alpha < 1)) {
    throw new RangeError('Alpha must be between zero and one.');
  }

  const random = seededRandom(seed);
  const standardNormal = normalSampler(random);
  const firstCrossings = Array.from({ length: looks }, () => 0);
  let fixedHorizonFalsePositives = 0;
  let naivePeekingFalsePositives = 0;
  let adjustedMonitoringFalsePositives = 0;
  let examplePath = null;

  for (let simulation = 0; simulation < simulations; simulation += 1) {
    let cumulativeEvidence = 0;
    let firstCrossing = -1;
    let adjustedCrossing = false;
    const path = [];

    for (let look = 1; look <= looks; look += 1) {
      cumulativeEvidence += standardNormal();
      const z = cumulativeEvidence / Math.sqrt(look);
      const pValue = twoSidedPValue(z);
      path.push({ look, z, pValue });

      if (firstCrossing < 0 && pValue < alpha) {
        firstCrossing = look - 1;
      }
      if (pValue < alpha / looks) {
        adjustedCrossing = true;
      }
    }

    const finalSignificant = path.at(-1).pValue < alpha;
    if (finalSignificant) fixedHorizonFalsePositives += 1;
    if (firstCrossing >= 0) {
      naivePeekingFalsePositives += 1;
      firstCrossings[firstCrossing] += 1;
    }
    if (adjustedCrossing) adjustedMonitoringFalsePositives += 1;

    if (!examplePath && firstCrossing >= 0 && !finalSignificant) {
      examplePath = path;
    }
  }

  let cumulativeCrossings = 0;
  const falsePositiveByLook = firstCrossings.map((count, index) => {
    cumulativeCrossings += count;
    return {
      look: index + 1,
      rate: cumulativeCrossings / simulations,
    };
  });

  const fixedHorizonRate = fixedHorizonFalsePositives / simulations;
  const naivePeekingRate = naivePeekingFalsePositives / simulations;
  const adjustedMonitoringRate = adjustedMonitoringFalsePositives / simulations;

  return {
    looks,
    simulations,
    alpha,
    fixedHorizonRate,
    naivePeekingRate,
    adjustedMonitoringRate,
    inflationMultiple: fixedHorizonRate === 0 ? 0 : naivePeekingRate / fixedHorizonRate,
    falsePositiveByLook,
    examplePath: examplePath ?? [],
  };
}

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return sign * y;
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  };
}

function normalSampler(random) {
  let spare = null;
  return () => {
    if (spare !== null) {
      const value = spare;
      spare = null;
      return value;
    }

    const u1 = Math.max(MIN_RANDOM, random());
    const u2 = random();
    const radius = Math.sqrt(-2 * Math.log(u1));
    const angle = 2 * Math.PI * u2;
    spare = radius * Math.sin(angle);
    return radius * Math.cos(angle);
  };
}
