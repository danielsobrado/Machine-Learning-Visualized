import { BASE_SEED, SIMULATION_RUNS } from './sequentialTestingConfig.js';

const EPSILON = 1e-12;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normalSample(random) {
  const u1 = Math.max(EPSILON, random());
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function inverseNormalCdf(probability) {
  const p = clamp(probability, EPSILON, 1 - EPSILON);
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const low = 0.02425;
  const high = 1 - low;

  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > high) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  const q = p - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
    / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

function thresholds(alpha, looks) {
  return {
    naive: inverseNormalCdf(1 - alpha / 2),
    spent: inverseNormalCdf(1 - alpha / (2 * looks)),
  };
}

export function simulatePath(scenario, trueEffect = scenario.effect, seed = BASE_SEED) {
  const random = mulberry32(seed);
  const boundary = thresholds(scenario.alpha, scenario.looks);
  const points = [];
  let controlSum = 0;
  let treatmentSum = 0;
  let previousN = 0;

  for (let look = 1; look <= scenario.looks; look += 1) {
    const n = Math.max(2, Math.round((scenario.maxPerArm * look) / scenario.looks));
    const increment = n - previousN;
    controlSum += Math.sqrt(increment) * normalSample(random);
    treatmentSum += trueEffect * increment + Math.sqrt(increment) * normalSample(random);
    const difference = treatmentSum / n - controlSum / n;
    const standardError = Math.sqrt(2 / n);
    const z = difference / standardError;
    points.push({
      look,
      n,
      information: n / scenario.maxPerArm,
      difference,
      standardError,
      z,
      naiveCrossed: Math.abs(z) >= boundary.naive,
      spentCrossed: Math.abs(z) >= boundary.spent,
    });
    previousN = n;
  }

  return { points, boundaries: boundary };
}

function simulateOperatingCharacteristics(scenario, trueEffect, seedOffset) {
  const boundary = thresholds(scenario.alpha, scenario.looks);
  let fixedRejects = 0;
  let naiveRejects = 0;
  let spentRejects = 0;
  let naiveStopTotal = 0;
  let spentStopTotal = 0;
  let naiveStops = 0;
  let spentStops = 0;

  for (let run = 0; run < SIMULATION_RUNS; run += 1) {
    const path = simulatePath(scenario, trueEffect, BASE_SEED + seedOffset + run * 7919).points;
    const finalPoint = path[path.length - 1];
    if (Math.abs(finalPoint.z) >= boundary.naive) fixedRejects += 1;

    const naiveStop = path.find((point) => point.naiveCrossed);
    if (naiveStop) {
      naiveRejects += 1;
      naiveStops += 1;
      naiveStopTotal += naiveStop.n;
    }

    const spentStop = path.find((point) => point.spentCrossed);
    if (spentStop) {
      spentRejects += 1;
      spentStops += 1;
      spentStopTotal += spentStop.n;
    }
  }

  return {
    fixedRate: fixedRejects / SIMULATION_RUNS,
    naiveRate: naiveRejects / SIMULATION_RUNS,
    spentRate: spentRejects / SIMULATION_RUNS,
    naiveMeanStopN: naiveStops ? naiveStopTotal / naiveStops : scenario.maxPerArm,
    spentMeanStopN: spentStops ? spentStopTotal / spentStops : scenario.maxPerArm,
  };
}

export function buildSequentialLab(scenario) {
  const nullRun = simulateOperatingCharacteristics(scenario, 0, 100003);
  const alternativeRun = simulateOperatingCharacteristics(scenario, scenario.effect, 700001);
  const example = simulatePath(scenario, scenario.effect, BASE_SEED + 41);
  const perLookAlpha = scenario.alpha / scenario.looks;

  return {
    scenario,
    nullRun,
    alternativeRun,
    example,
    metrics: {
      naiveInflation: nullRun.naiveRate / scenario.alpha,
      perLookAlpha,
      savedSamplesNaive: 1 - alternativeRun.naiveMeanStopN / scenario.maxPerArm,
      savedSamplesSpent: 1 - alternativeRun.spentMeanStopN / scenario.maxPerArm,
    },
  };
}
